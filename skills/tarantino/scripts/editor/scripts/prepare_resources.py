"""Prepara fontes e modelos do manifesto existente, conferindo SHA-256."""
import argparse
import hashlib
import json
import importlib.metadata
from pathlib import Path
import tempfile
from urllib.request import urlopen

ROOT = Path(__file__).resolve().parents[1]

def ensure_resources(root=ROOT, opener=urlopen):
    root = Path(root).resolve()
    assets = root / 'assets'
    manifest = json.loads((assets / 'manifest.json').read_text(encoding='utf-8'))
    results = []
    for entry in [*manifest['fonts'], *manifest.get('models', [])]:
        relative = Path(entry['path'])
        target = (assets / relative).resolve()
        if relative.is_absolute() or not target.is_relative_to(assets.resolve()):
            raise ValueError('Invalid resource path')
        expected = entry['sha256']
        if target.is_file() and hashlib.sha256(target.read_bytes()).hexdigest() == expected:
            results.append({'path': entry['path'], 'status': 'verified'})
            continue
        url = entry['source']
        if not url.startswith('https://'):
            raise ValueError('Resource source must use HTTPS')
        target.parent.mkdir(parents=True, exist_ok=True)
        temporary = None
        try:
            if entry.get('source_package'):
                package, version = entry['source_package'].split('==', 1)
                distribution = importlib.metadata.distribution(package)
                if distribution.version != version:
                    raise ValueError('Installed resource package version mismatch')
                package_root = Path(distribution.locate_file(package.replace('-', '_'))).resolve()
                resource = (package_root / entry['runtime_path']).resolve()
                if not resource.is_relative_to(package_root):
                    raise ValueError('Invalid package resource path')
                data = resource.read_bytes()
            else:
                with opener(url, timeout=60) as response:
                    if getattr(response, 'geturl', lambda: url)().split(':', 1)[0] != 'https':
                        raise ValueError('Redirect must use HTTPS')
                    data = response.read(32 * 1024 * 1024 + 1)
            if len(data) > 32 * 1024 * 1024 or hashlib.sha256(data).hexdigest() != expected:
                raise ValueError('Resource checksum mismatch: ' + entry['path'])
            with tempfile.NamedTemporaryFile(dir=target.parent, suffix='.download', delete=False) as handle:
                temporary = Path(handle.name)
                handle.write(data)
            temporary.replace(target)
            results.append({'path': entry['path'], 'status': 'downloaded-and-verified'})
        finally:
            if temporary is not None:
                temporary.unlink(missing_ok=True)
    return results

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--root', type=Path, default=ROOT)
    args = parser.parse_args()
    print(json.dumps({'resources': ensure_resources(args.root)}, ensure_ascii=False, indent=2))

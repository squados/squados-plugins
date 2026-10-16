"""Confere a biblioteca pública e o contrato de preparação do Studio (stdlib)."""
import json
import hashlib
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXPECTED = {
    'michelangelo', 'tarantino', 'audio', 'krug', 'warren', 'zuck', 'flavio',
    'gutenberg', 'linus', 'drucker', 'maslow', 'darwin', 'figma', 'notion',
    'google-workspace', 'obsidian', 'shop', 'shopify', 'telephony', 'handoff',
}
SUPPORT = {'references', 'scripts', 'assets', 'templates', 'examples'}
errors = []
packages = []

def fail(name, message):
    errors.append(f'{name}: {message}')

def field(text, key):
    match = re.search(rf'(?m)^{key}:\s*(.+)$', text.split('---', 2)[1])
    return match.group(1).strip().strip('"\'') if match else ''


CODE_PATH = re.compile(r'(?<![\w/])(?:\$?SKILL_DIR/|(?:\.\./)+)?(?:scripts|references|templates|assets)/(?:[A-Za-z0-9_.-]+/)*[A-Za-z0-9_.-]+\.(?:py|mjs|sh|md|json|tex|html|toml|yaml|yml|txt|svg)\b')


def code_path_errors(root, path, text):
    """Confere receitas e spans inline, distinguindo PROJECT/ e arquivos do bundle."""
    issues = []
    for match in CODE_PATH.finditer(text):
        token = match[0]
        if text[match.end():match.end()+2] == '](':
            continue  # Rótulo de link; o destino é validado separadamente.
        relative = re.sub(r'^\$?SKILL_DIR/', '', token)
        candidates = [root / relative] if 'SKILL_DIR/' in token else [path.parent / relative, root / relative]
        if not any(p.is_file() and p.resolve().is_relative_to(root.resolve()) for p in candidates):
            issues.append(f"linha {text[:match.start()].count(chr(10))+1}: {token}")
    return issues


def provenance_revision_error(origin):
    match = re.search(r'/(?:tree|blob)/([a-f0-9]{40})(?:/|$)', origin.get('source', ''))
    if match and origin.get('revision') != match[1]:
        return 'revisão diferente do commit fixado na URL: ' + origin['source']
    return None


def legacy_credentials_client(name, suffix, text):
    return name in {'telephony', 'google-workspace'} and suffix == '.py' and bool(re.search(r'_upsert_env_file|google_token\.json', text))


def package_revision(root):
    files = sorted((p for p in root.rglob('*') if p.is_file() and '__pycache__' not in p.parts), key=lambda p: p.relative_to(root).as_posix())
    manifest = '\n'.join(p.relative_to(root).as_posix() + ':' + hashlib.sha256(p.read_bytes().replace(b'\r\n', b'\n')).hexdigest() for p in files)
    return 'sha256-lf:' + hashlib.sha256(manifest.encode('utf-8')).hexdigest()

def main():
    sys.stdout.reconfigure(encoding="utf-8")
    actual = {p.name for p in (ROOT / 'skills').iterdir() if p.is_dir()}
    if actual != EXPECTED:
        fail('skills', f'ausentes={sorted(EXPECTED - actual)}; excedentes={sorted(actual - EXPECTED)}')
    for name in sorted(EXPECTED & actual):
        root = ROOT / 'skills' / name
        entry = root / 'SKILL.md'
        if not entry.is_file():
            fail(name, 'SKILL.md ausente')
            continue
        source = entry.read_text(encoding='utf-8')
        if not source.startswith('---\n') or source.count('---') < 2:
            fail(name, 'frontmatter inválido')
            continue
        if field(source, 'name') != name:
            fail(name, 'name diferente da pasta')
        if not 1 <= len(field(source, 'description')) <= 120:
            fail(name, 'description fora de 1–120 caracteres')
        if not field(source, 'license'):
            fail(name, 'licença ausente')
        if len(source.splitlines()) > 180:
            fail(name, 'entrada excessiva; extrair detalhes de modos')
        files = [p for p in root.rglob('*') if p.is_file() and '__pycache__' not in p.parts]
        if len(files) > 100 or sum(p.stat().st_size for p in files) > 4 * 1024 * 1024:
            fail(name, f'limites excedidos: {len(files)} arquivos')
        for path in files:
            relative = path.relative_to(root)
            if path.is_symlink() or not path.resolve().is_relative_to(root.resolve()):
                fail(name, f'arquivo fora da raiz: {relative}')
                continue
            if relative != Path('SKILL.md') and relative.parts[0] not in SUPPORT and not re.match(r'^(LICENSE|LICENCE|NOTICE|COPYING)', relative.name, re.I):
                fail(name, f'recurso fora dos diretórios aceitos: {relative}')
            if not all(re.fullmatch(r'(?!\.{1,2}$)[A-Za-z0-9._-]{1,100}', part) for part in relative.parts):
                fail(name, f'caminho não suportado: {relative}')
            try:
                text = path.read_text(encoding='utf-8')
                if '\0' in text:
                    raise ValueError('NUL')
            except (UnicodeError, ValueError):
                fail(name, f'binário: {relative}')
                continue
            if re.search(r'(?i:[a-z]:[\\/]users[\\/])|/Users/|\.cursor/skills|\.claude/skills|\.codex/skills|\b\d{8,12}:[A-Za-z0-9_-]{30,}\b', text):
                fail(name, f'caminho pessoal ou credencial: {relative}')
            if path.suffix == '.md':
                if re.search(r'CODEX_HOME|~?/\.codex/config\.toml|~/\.hermes/skills/|cronjob\s*\(', text):
                    fail(name, f'receita de harness/pasta antiga: {relative}')
                if '/path/to/excel-author/' in text or '../scripts/python-debugpy/run_tests.sh' in text:
                    fail(name, f'helper herdado ausente: {relative}')
                for issue in code_path_errors(root, path, text):
                    fail(name, f'caminho de pacote ausente em {relative}: {issue}')
                prose = re.sub(r'```.*?```', '', text, flags=re.S)
                prose = re.sub(r'`[^`]*`', '', prose)
                for target in re.findall(r'!?\[[^\]]*\]\(([^)]+)\)', prose):
                    target = target.strip('<>').split('#')[0]
                    if not target or re.match(r'^[a-z]+:', target, re.I) or target.startswith(('$', '{')):
                        continue
                    candidate = path.parent / target
                    if not candidate.exists():
                        fail(name, f'link ausente em {relative}: {target}')
            if legacy_credentials_client(name, path.suffix, text):
                fail(name, f'cliente legado de credenciais em arquivo: {relative}')
        provenance = root / 'references/provenance.json'
        if not provenance.is_file():
            fail(name, 'proveniência ausente')
        else:
            record = json.loads(provenance.read_text(encoding='utf-8'))
            for origin in record.get('incorporated', []):
                revision_issue = provenance_revision_error(origin)
                if revision_issue:
                    fail(name, revision_issue)
                if not origin.get('license') or not origin.get('source'):
                    fail(name, 'incorporação sem origem/licença')
                for notice in origin.get('notices', []):
                    if not (root / notice).is_file():
                        fail(name, f'aviso legal ausente: {notice}')
        packages.append({'name': name, 'files': len(files), 'bytes': sum(p.stat().st_size for p in files)})

    gallery = json.loads((ROOT / 'gallery.json').read_text(encoding='utf-8'))
    items = gallery['items']
    if len(items) != 20 or {item['id'] for item in items} != EXPECTED:
        fail('gallery', 'deve conter somente os vinte pacotes aprovados')
    areas = {area['id'] for area in gallery['areas']}
    for item in items:
        if item.get('editorial', {}).get('reviewedRevision') != package_revision(ROOT / 'skills' / item['id']):
            fail(item['id'], 'revisão editorial não corresponde ao pacote atual')
        if item['source'] != {'type': 'squados', 'path': f"skills/{item['id']}"}:
            fail(item['id'], 'fonte não aponta ao pacote consolidado')
        if item['area'] not in areas:
            fail(item['id'], 'área inexistente')
        for locale in ('pt-BR', 'en'):
            for key, limit in (('title', 80), ('description', 300)):
                value = item[key].get(locale, '')
                if not 1 <= len(value) <= limit or '\n' in value:
                    fail(item['id'], f'{key}/{locale} inválido')

    print(json.dumps({'status': 'failed' if errors else 'passed', 'packages': packages, 'errors': errors}, ensure_ascii=False, indent=2))
    raise SystemExit(bool(errors))


if __name__ == "__main__":
    main()

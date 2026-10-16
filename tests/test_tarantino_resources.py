import hashlib
import importlib.util
import io
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
from types import SimpleNamespace

ROOT=Path(__file__).resolve().parents[1]
SCRIPT=ROOT/'skills/tarantino/scripts/editor/scripts/prepare_resources.py'

class Resources(unittest.TestCase):
    def setUp(self):
        self.assertTrue(SCRIPT.is_file(),'Tarantino precisa preparar os recursos verificados sem distribuir binários')
        spec=importlib.util.spec_from_file_location('prepare_resources',SCRIPT)
        self.module=importlib.util.module_from_spec(spec);spec.loader.exec_module(self.module)
        self.temp=tempfile.TemporaryDirectory(dir=ROOT/'.scratch')
        self.addCleanup(self.temp.cleanup)
        self.root=Path(self.temp.name);(self.root/'assets').mkdir()
        self.data=b'verified resource';self.calls=[]
        self.entry={'path':'fonts/font.ttf','source':'https://example.invalid/font.ttf','sha256':hashlib.sha256(self.data).hexdigest()}
    def manifest(self,entry=None):
        (self.root/'assets/manifest.json').write_text(json.dumps({'fonts':[entry or self.entry],'models':[]}),encoding='utf-8')
    def open(self,url,timeout):
        self.calls.append(url);return io.BytesIO(self.data)
    def test_downloads_verified_resource_and_reuses_cache(self):
        self.manifest();self.module.ensure_resources(self.root,opener=self.open)
        self.assertEqual((self.root/'assets/fonts/font.ttf').read_bytes(),self.data)
        self.module.ensure_resources(self.root,opener=self.open);self.assertEqual(len(self.calls),1)
    def test_checksum_failure_does_not_replace_resource(self):
        self.entry['sha256']='0'*64;self.manifest()
        with self.assertRaisesRegex(ValueError,'checksum'):self.module.ensure_resources(self.root,opener=self.open)
        self.assertFalse((self.root/'assets/fonts/font.ttf').exists())
        self.assertFalse(list(self.root.rglob('*.download')))
    def test_rejects_resource_path_outside_assets(self):
        self.entry['path']='../outside.ttf';self.manifest()
        with self.assertRaisesRegex(ValueError,'path'):self.module.ensure_resources(self.root,opener=self.open)
        self.assertEqual(self.calls,[])
    def test_rejects_non_https_source(self):
        self.entry['source']='file:///private/file';self.manifest()
        with self.assertRaisesRegex(ValueError,'HTTPS'):self.module.ensure_resources(self.root,opener=self.open)
    def test_preserves_an_existing_download_file(self):
        self.manifest();folder=self.root/'assets/fonts';folder.mkdir()
        unrelated=folder/'font.ttf.download';unrelated.write_bytes(b'preserve')
        self.module.ensure_resources(self.root,opener=self.open)
        self.assertTrue(unrelated.exists(),'Existing files must not be treated as temporary files')
        self.assertEqual(unrelated.read_bytes(),b'preserve')
    def test_uses_the_pinned_installed_model_without_http(self):
        self.entry.update(path='models/face.tflite',runtime_path='modules/face.tflite',source_package='mediapipe==0.10.21',source='https://pypi.org/project/mediapipe/0.10.21/')
        self.manifest();model=self.root/'wheel/mediapipe/modules/face.tflite';model.parent.mkdir(parents=True);model.write_bytes(self.data)
        distribution=SimpleNamespace(version='0.10.21',locate_file=lambda value:self.root/'wheel'/value)
        with patch('importlib.metadata.distribution',return_value=distribution):self.module.ensure_resources(self.root,opener=self.open)
        self.assertEqual(self.calls,[],'A PyPI project page is provenance, not model bytes')
        self.assertEqual((self.root/'assets/models/face.tflite').read_bytes(),self.data)
    def test_rejects_another_installed_package_version(self):
        self.entry.update(path='models/face.tflite',runtime_path='modules/face.tflite',source_package='mediapipe==0.10.21')
        self.manifest();distribution=SimpleNamespace(version='0.10.20')
        with patch('importlib.metadata.distribution',return_value=distribution):
            with self.assertRaisesRegex(ValueError,'version'):self.module.ensure_resources(self.root,opener=self.open)

if __name__=='__main__':unittest.main()

"""Regressões do contrato distribuído, incluindo caminhos dentro de comandos."""
import importlib.util
from pathlib import Path
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('library_verifier', ROOT / 'scripts/verify-skills.py')
verifier = importlib.util.module_from_spec(spec)
spec.loader.exec_module(verifier)


class LibraryVerifier(unittest.TestCase):
    def setUp(self):
        (ROOT / '.scratch').mkdir(exist_ok=True)
        self.temporary = tempfile.TemporaryDirectory(dir=ROOT / '.scratch')
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        (self.root / 'scripts').mkdir()
        (self.root / 'scripts/real.py').write_text('print(1)\n', encoding='utf-8')
        self.guide = self.root / 'references/mode.md'

    def test_rejects_missing_command_in_fence_and_inline_span(self):
        for text in ['```bash\npython SKILL_DIR/scripts/missing.py\n```', '`scripts/missing.py`']:
            self.assertTrue(verifier.code_path_errors(self.root, self.guide, text))

    def test_accepts_real_bundle_path_and_explicit_project_output(self):
        text = '`SKILL_DIR/scripts/real.py` and `PROJECT/scripts/generated.py`'
        self.assertEqual(verifier.code_path_errors(self.root, self.guide, text), [])

    def test_rejects_mismatched_pinned_provenance(self):
        origin = {'source': 'https://github.com/owner/repo/tree/' + 'a' * 40, 'revision': 'b' * 40}
        self.assertIsNotNone(verifier.provenance_revision_error(origin))
        origin['revision'] = 'a' * 40
        self.assertIsNone(verifier.provenance_revision_error(origin))

    def test_revision_normalizes_line_endings_and_detects_content_change(self):
        file = self.root / 'scripts/real.py'
        before = verifier.package_revision(self.root)
        file.write_bytes(b'print(1)\r\n')
        self.assertEqual(verifier.package_revision(self.root), before)
        file.write_bytes(b'print(2)\n')
        self.assertNotEqual(verifier.package_revision(self.root), before)

    def test_rejects_legacy_secret_file_clients(self):
        self.assertTrue(verifier.legacy_credentials_client('telephony', '.py', 'def _upsert_env_file(values): pass'))
        self.assertTrue(verifier.legacy_credentials_client('google-workspace', '.py', 'TOKEN_PATH = "google_token.json"'))
        self.assertFalse(verifier.legacy_credentials_client('telephony', '.md', 'Use a connected secure tool.'))


if __name__ == '__main__':
    unittest.main()

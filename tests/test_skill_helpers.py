"""Exercita recursos de helpers a partir do layout distribuído, fora da pasta da skill."""
from pathlib import Path
import os
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
HELPER = ROOT / 'skills/linus/scripts/fastmcp/scaffold_fastmcp.py'


class DistributedHelpers(unittest.TestCase):
    def test_fastmcp_lists_bundled_templates(self):
        result = subprocess.run([sys.executable, str(HELPER), '--list'], cwd=ROOT,
                                capture_output=True, text=True, check=True)
        self.assertEqual(set(result.stdout.split()), {'api_wrapper', 'database_server', 'file_processor'})

    def test_fastmcp_renders_a_template_from_another_working_folder(self):
        scratch = ROOT / '.scratch'
        scratch.mkdir(exist_ok=True)
        with tempfile.TemporaryDirectory(dir=scratch) as folder:
            output = Path(folder) / 'server.py'
            subprocess.run([sys.executable, str(HELPER), '--template', 'api_wrapper',
                            '--name', 'Fixture service', '--output', str(output)], cwd=folder,
                           capture_output=True, text=True, check=True,
                           env=os.environ | {'PYTHONDONTWRITEBYTECODE': '1'})
            source = output.read_text(encoding='utf-8')
            self.assertIn('Fixture service', source)
            self.assertNotIn('__SERVER_NAME__', source)
            compile(source, str(output), 'exec')


if __name__ == '__main__':
    unittest.main()

import { readFile, mkdir, cp } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = dirname(fileURLToPath(import.meta.url));
const templates = JSON.parse(await readFile(join(root, 'index.json'), 'utf8'));
const npmCli = process.env.npm_execpath;
if (!npmCli) throw new Error('Execute pelo script npm run build.');
for (const template of templates) {
  const directory = join(root, template.id);
  for (const args of [['ci', '--no-audit', '--no-fund'], ['run', 'build']]) {
    const result = spawnSync(process.execPath, [npmCli, ...args], { cwd: directory, stdio: 'inherit' });
    if (result.error) throw result.error;
    if (result.status !== 0) process.exit(result.status || 1);
  }
  const output = join(root, '.preview', template.id);
  await mkdir(output, { recursive: true });
  await cp(join(directory, 'dist'), output, { recursive: true, force: true });
}
console.log('Quatro builds estáticos disponíveis. Abra com npm run preview.');

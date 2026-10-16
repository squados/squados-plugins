import { createServer } from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
import { dirname, extname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const templates = JSON.parse(await readFile(join(root, 'index.json'), 'utf8'));
const ids = new Set(templates.map(template => template.id));
const portIndex = process.argv.indexOf('--port');
const port = portIndex < 0 ? 0 : Number(process.argv[portIndex + 1]);
if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error('Porta inválida.');
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.md': 'text/plain; charset=utf-8', '.txt': 'text/plain; charset=utf-8' };
const inside = (parent, child) => { const path = relative(parent, child); return !isAbsolute(path) && path !== '..' && !path.startsWith('..' + sep); };
const documents = new Set(['preview.png', 'README.md', 'LICENSE', 'NOTICE.md', 'assets.json', 'art-prompts.json']);

const server = createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405); response.end(); return; }
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (pathname.includes('\\') || pathname.includes('\0')) throw new Error('Invalid path');
    const parts = pathname.split('/').filter(Boolean);
    let directory = root;
    let filename = parts.join('/') || 'index.html';
    if (ids.has(parts[0]) && !(parts.length === 2 && documents.has(parts[1]))) {
      if (parts.length === 1 && !pathname.endsWith('/')) { response.writeHead(302, { Location: pathname + '/' }); response.end(); return; }
      directory = join(root, '.preview', parts.shift());
      filename = parts.join('/') || 'index.html';
    }
    const canonicalRoot = await realpath(directory);
    const target = await realpath(resolve(directory, filename));
    if (!inside(canonicalRoot, target) || !(await stat(target)).isFile()) throw new Error('Outside root');
    const bytes = await readFile(target);
    response.writeHead(200, { 'Content-Type': mime[extname(target)] || 'application/octet-stream', 'Content-Length': bytes.length, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    response.end(request.method === 'HEAD' ? undefined : bytes);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Recurso não encontrado. Gere os quatro sites com npm run build nesta pasta.');
  }
});
server.listen(port, '127.0.0.1', () => {
  const origin = 'http://127.0.0.1:' + server.address().port;
  console.log(JSON.stringify({ origin, templates: [...ids].map(id => origin + '/' + id + '/') }));
});
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => process.exit(0)));

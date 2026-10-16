import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// A prévia expõe apenas os arquivos necessários ao spike, em loopback.
const root = dirname(fileURLToPath(import.meta.url));
const allowed = new Map([
  ['/index.html', 'text/html; charset=utf-8'], ['/style.css', 'text/css; charset=utf-8'],
  ['/directions.css', 'text/css; charset=utf-8'], ['/app.js', 'text/javascript; charset=utf-8'], ['/data.js', 'text/javascript; charset=utf-8'],
  ['/assets/body.woff2', 'font/woff2'], ['/assets/avatars.png', 'image/png'],
  ['/assets/lesson-design.png', 'image/png'], ['/assets/lesson-ai.png', 'image/png'], ['/assets/lesson-strategy.png', 'image/png']
]);
const server = createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405); response.end(); return; }
  const url = new URL(request.url, 'http://localhost');
  const pathname = url.pathname === '/' ? '/index.html' : url.pathname;
  if (!allowed.has(pathname)) { response.writeHead(404); response.end(); return; }
  try {
    const content = await readFile(join(root, pathname.slice(1)));
    response.writeHead(200, { 'Content-Type': allowed.get(pathname), 'Content-Length': content.length, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    response.end(request.method === 'HEAD' ? undefined : content);
  } catch { response.writeHead(404); response.end(); }
});
const portArg = process.argv.find(arg => arg.startsWith('--port='));
const port = portArg ? Number(portArg.slice(7)) : 0;
if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error('Porta inválida');
server.listen(port, '127.0.0.1', () => console.log('Numa spike: http://127.0.0.1:' + server.address().port));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => process.exit(0)));

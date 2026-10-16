import {createServer} from 'node:http';
import {readFile,realpath,stat} from 'node:fs/promises';
import {dirname,extname,isAbsolute,join,relative,resolve,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url));
const ids=new Set(JSON.parse(await readFile(join(root,'index.json'),'utf8')).map(t=>t.id));
const arg=process.argv.find(s=>s.startsWith('--port='));const port=arg?Number(arg.slice(7)):0;
if(!Number.isInteger(port)||port<0||port>65535)throw new Error('Porta inválida.');
const mime={'.html':'text/html; charset=utf-8','.json':'application/json; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.woff2':'font/woff2','.svg':'image/svg+xml','.md':'text/plain; charset=utf-8'};
const inside=(parent,target)=>{const path=relative(parent,target);return !isAbsolute(path)&&path!=='..'&&!path.startsWith('..'+sep);};
const documents=new Set(['preview.png','preview-light.png','preview-dark.png','README.md','NOTICE.md']);
const server=createServer(async(request,response)=>{
 if(!['GET','HEAD'].includes(request.method)){response.writeHead(405);response.end();return;}
 try{
  const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname);
  if(pathname.includes('\\')||pathname.includes('\0'))throw Error('Invalid path');
  const parts=pathname.split('/').filter(Boolean);let directory,filename;
  if(!parts.length||parts.length===1&&['index.html','index.json'].includes(parts[0])){directory=root;filename=parts[0]||'index.html';}
  else if(ids.has(parts[0])){
   const id=parts.shift();
   if(!parts.length&&!pathname.endsWith('/')){response.writeHead(302,{Location:pathname+'/'});response.end();return;}
   directory=join(root,parts.length===1&&documents.has(parts[0])?id:'.preview/'+id);filename=parts.join('/')||'index.html';
  }else throw Error('Unknown route');
  const canonical=await realpath(directory),target=await realpath(resolve(directory,filename));
  if(!inside(canonical,target)||!(await stat(target)).isFile()||!mime[extname(target)])throw Error('Invalid resource');
  const bytes=await readFile(target);response.writeHead(200,{'Content-Type':mime[extname(target)],'Content-Length':bytes.length,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});response.end(request.method==='HEAD'?undefined:bytes);
 }catch{response.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});response.end('Recurso não encontrado. Gere os templates com npm run build na pasta apps.');}
});
server.listen(port,'127.0.0.1',()=>console.log('Templates web: http://127.0.0.1:'+server.address().port));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>process.exit(0)));

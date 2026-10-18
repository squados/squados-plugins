import {cp,mkdir,readdir} from 'node:fs/promises';
import {join} from 'node:path';
await mkdir('dist',{recursive:true});
for(const e of await readdir('.',{withFileTypes:true})){
 if(['dist','node_modules','.git'].includes(e.name))continue;
 await cp(e.name,join('dist',e.name),{recursive:true,filter:p=>!/[\\/](node_modules|\.git)([\\/]|$)/.test(p)});
}
console.log('Static game ready in dist/. Serve over HTTP.');

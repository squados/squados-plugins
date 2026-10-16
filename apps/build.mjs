import {readFile,mkdir,cp} from 'node:fs/promises';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

// O build acontece em cópias: os pacotes candidatos permanecem sem node_modules.
const root=dirname(fileURLToPath(import.meta.url));
const templates=JSON.parse(await readFile(join(root,'index.json'),'utf8'));
const npmCli=process.env.npm_execpath;
if(!npmCli)throw new Error('Execute pelo script npm run build.');
for(const template of templates){
 const source=join(root,template.id),work=join(root,'.build',template.id);
 await mkdir(work,{recursive:true});
 await cp(source,work,{recursive:true,filter:path=>!/[\\/](node_modules|dist|\.git)([\\/]|$)/.test(path)});
 for(const args of [['ci','--no-audit','--no-fund'],['run','build']]){
  const result=spawnSync(process.execPath,[npmCli,...args],{cwd:work,stdio:'inherit'});
  if(result.error)throw result.error;if(result.status!==0)process.exit(result.status||1);
 }
 const output=join(root,'.preview',template.id);
 await mkdir(output,{recursive:true});await cp(join(work,'dist'),output,{recursive:true,force:true});
 console.log('Build verificado: '+template.id);
}
console.log('Nove builds estáticos disponíveis em .preview/.');

import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { generateKeyPairSync } from 'node:crypto';
import { loadCentralCreds } from '../skills/linus/scripts/chrome-webstore/lib/config.mjs';
import { getAccessToken } from '../skills/linus/scripts/chrome-webstore/lib/auth.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
mkdirSync(join(root,'.scratch'),{recursive:true});
function fixture(){return mkdtempSync(join(root,'.scratch','cws-test-'));}

test('reads credentials supplied by the runtime without a personal dotenv',()=>{
 const previous={...process.env};
 try{
  process.env.CWS_ENV_PATH=join(fixture(),'not-present.env');
  process.env.CHROME_WEBSTORE_SA_KEY_PATH='provided-by-runtime.json';
  process.env.CHROME_WEBSTORE_PUBLISHER_ID='publisher-test';
  assert.deepEqual(loadCentralCreds(),{saKeyPath:'provided-by-runtime.json',publisherId:'publisher-test'});
 }finally{process.env=previous;}
});

test('rejects a credential file that sends a signed assertion to another host',async()=>{
 const dir=fixture();
 const {privateKey}=generateKeyPairSync('rsa',{modulusLength:2048});
 const file=join(dir,'service-account.json');
 writeFileSync(file,JSON.stringify({client_email:'test@example.invalid',private_key:privateKey.export({type:'pkcs8',format:'pem'}),token_uri:'https://other.example.invalid/token'}));
 let calls=0;const previous=globalThis.fetch;
 globalThis.fetch=async()=>{calls++;return {ok:true,text:async()=>JSON.stringify({access_token:'test-token'})};};
 try{await assert.rejects(getAccessToken(file),/token endpoint/i);assert.equal(calls,0);}
 finally{globalThis.fetch=previous;}
});

test('dry run needs no credentials and preserves project configuration and version',()=>{
 const cwd=fixture();writeFileSync(join(cwd,'manifest.json'),JSON.stringify({manifest_version:3,name:'Fixture',version:'1.2.3'}));
 const result=spawnSync(process.execPath,[join(root,'skills/linus/scripts/chrome-webstore/upload.mjs'),'--cwd',cwd,'--item-id','fixture-item','--dry-run'],{
  encoding:'utf8',windowsHide:true,env:{...process.env,CWS_ENV_PATH:join(cwd,'not-present.env'),CHROME_WEBSTORE_SA_KEY_PATH:'',CHROME_WEBSTORE_PUBLISHER_ID:''},
 });
 assert.equal(result.status,0,result.stderr);
 assert.equal(JSON.parse(readFileSync(join(cwd,'manifest.json'),'utf8')).version,'1.2.3');
 assert.equal(existsSync(join(cwd,'.chrome-webstore.json')),false);
 assert.equal(JSON.parse(result.stdout).dryRun,true);
});

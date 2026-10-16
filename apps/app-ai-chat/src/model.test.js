import test from 'node:test';
import assert from 'node:assert/strict';
import {createInitialState,newConversation,sendMessage,updateDraft,searchHistory,setFeedback,responseFor} from './model.js';

test('whitespace não cria mensagem ou muda histórico',()=>{
 const state=createInitialState();assert.equal(sendMessage(state,' \n\t '),state);
});
test('envio adiciona usuário e resposta somente à conversa ativa, sem mutar entrada',()=>{
 const before=createInitialState(),original=structuredClone(before),after=sendMessage(before,'Planeje minha semana');
 assert.deepEqual(before,original);
 assert.equal(after.conversations[0].messages.length,before.conversations[0].messages.length+2);
 assert.deepEqual(after.conversations[1],before.conversations[1]);
 assert.equal(after.conversations[0].messages.at(-1).role,'assistant');
});
test('nova conversa isola mensagens e conserva histórico',()=>{
 const first=createInitialState(),empty=newConversation(first),sent=sendMessage(empty,'Uma ideia de campanha');
 assert.notEqual(empty.activeId,first.activeId);assert.equal(empty.conversations[0].messages.length,0);
 assert.equal(sent.conversations[0].messages.length,2);assert.deepEqual(sent.conversations[1],first.conversations[0]);
 assert.equal(newConversation(empty),empty);
});
test('rascunhos são independentes e envio só limpa o atual',()=>{
 let state=updateDraft(createInitialState(),'Texto guardado');const previous=state.activeId;
 state=newConversation(state);state=updateDraft(state,'Outro texto');state=sendMessage(state,'Enviar outro texto');
 assert.equal(state.conversations.find(c=>c.id===previous).draft,'Texto guardado');
 assert.equal(state.conversations[0].draft,'');
});
test('busca ignora acentos e considera conteúdo das mensagens',()=>{
 const state=createInitialState();assert.ok(searchHistory(state,'proxima semana').length>=1);
 assert.equal(searchHistory(state,'SEM_CORRESPONDENCIA').length,0);
});
test('HTML permanece texto e entradas longas são limitadas',()=>{
 let state=sendMessage(createInitialState(),'<img src=x onerror=alert(1)>');
 assert.equal(state.conversations[0].messages.at(-2).text,'<img src=x onerror=alert(1)>');
 state=sendMessage(state,'a'.repeat(9000));assert.equal(state.conversations[0].messages.at(-2).text.length,4000);
});
test('feedback alterna somente a resposta escolhida',()=>{
 const state=createInitialState(),id=state.conversations[0].messages.at(-1).id;
 const liked=setFeedback(state,id,'up');assert.equal(liked.conversations[0].messages.at(-1).feedback,'up');
 assert.equal(setFeedback(liked,id,'up').conversations[0].messages.at(-1).feedback,null);
 assert.deepEqual(liked.conversations[1],state.conversations[1]);
});
test('direção escolhida altera a extensão da resposta de exemplo',()=>{
 const balanced=responseFor('Organizar a semana');
 assert.ok(responseFor('Organizar a semana','concise').length<balanced.length);
 assert.ok(responseFor('Organizar a semana','creative').length>balanced.length);
});
test('pedido de texto para marca usa exemplo de escrita, sem virar campanha',()=>{
 assert.ok(responseFor('Como deixar o texto da minha marca mais acolhedor?').some(b=>b.type==='heading'&&b.text==='Uma versão para experimentar'));
});

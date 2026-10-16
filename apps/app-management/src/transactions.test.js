import test from 'node:test';
import assert from 'node:assert/strict';
import {transactionsForView} from './transactions.js';
const rows=[{id:1,type:'pagar',status:'A pagar'},{id:2,type:'pagar',status:'Pago'},{id:3,type:'receber',status:'A receber'},{id:4,type:'receber',status:'Recebido'}];
test('abas pendentes excluem lançamentos já concluídos',()=>{
 assert.deepEqual(transactionsForView(rows,'A pagar').map(t=>t.id),[1]);
 assert.deepEqual(transactionsForView(rows,'A receber').map(t=>t.id),[3]);
 assert.equal(transactionsForView(rows,'Todas').length,4);
});
test('quitar lançamento retira item da visão pendente',()=>{
 const settled=rows.map(t=>t.id===1?{...t,status:'Pago'}:t);
 assert.equal(transactionsForView(settled,'A pagar').length,0);
 assert.equal(rows[0].status,'A pagar');
});

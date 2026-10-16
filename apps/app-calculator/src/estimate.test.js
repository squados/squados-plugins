import test from 'node:test';
import assert from 'node:assert/strict';
import {calculateEstimate} from './estimate.js';
test('cenário inicial de 8 telas:56horas e6720reais',()=>{
 const result=calculateEstimate({type:'Website',pages:8,complexity:'Completo',deadline:'Flexível',rate:120,prototype:true});
 assert.equal(result.hours,56);assert.equal(result.total,6720);
 assert.equal(result.design+result.development+result.review,result.total);
});
test('escopo máximo com urgência conserva total e arredonda horas',()=>{
 const result=calculateEstimate({type:'Aplicativo',pages:24,complexity:'Avançado',deadline:'15 dias',rate:300,content:true,prototype:true,support:true});
 assert.equal(result.hours,198);assert.equal(result.total,74250);
 assert.equal(result.design+result.development+result.review,74250);
});
test('marca essencial sem adicionais mantém orçamento coerente',()=>{
 const result=calculateEstimate({type:'Marca',pages:3,complexity:'Essencial',deadline:'Flexível',rate:80});
 assert.equal(result.hours,22);assert.equal(result.total,1760);
 assert.equal(result.design+result.development+result.review,1760);
});

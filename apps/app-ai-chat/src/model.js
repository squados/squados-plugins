// Conversas e respostas de exemplo, sem chamadas a serviços externos.
const paragraph=text=>({type:'paragraph',text});
const heading=text=>({type:'heading',text});
const list=items=>({type:'list',items});
function baseResponse(text,mode='balanced'){
 const value=text.toLocaleLowerCase('pt-BR');
 if(/semana|agenda|tarefas|prioridade/.test(value))return [
  paragraph('Vamos organizar uma semana que tenha direção e também espaço para respirar. Eu começaria por três prioridades, em vez de uma lista interminável.'),
  heading('Um plano possível para os próximos dias'),
  list(['Segunda · Clareza. Escolha o resultado mais importante da semana e reserve um bloco de foco.','Terça e quarta · Construção. Avance no projeto principal antes das reuniões e das pequenas demandas.','Quinta · Troca. Compartilhe uma primeira versão, peça feedback e ajuste a direção.','Sexta · Fechamento. Registre o que avançou e escolha um próximo passo para a semana seguinte.']),
  heading('Uma regra simples para começar'),
  paragraph('Reserve 90 minutos por dia para o trabalho que precisa da sua atenção inteira. Agrupe as tarefas rápidas em dois momentos e deixe um espaço livre para os imprevistos.'),
  paragraph('Qual dessas prioridades merece o primeiro bloco da sua segunda-feira?')
 ];
 if(/campanha|ideia|lina|lança/.test(value))return [
  paragraph('Uma boa campanha começa com uma ideia que as pessoas reconhecem no próprio dia. Para a Casa Lina, eu exploraria o cuidado que transforma pequenos momentos.'),
  heading('Conceito · O cuidado mora nos detalhes'),
  list(['Uma história real de uso: mostre o que muda na rotina de quem escolhe a marca.','Uma série de três conteúdos: o começo, o processo e o resultado.','Um convite claro: conhecer a coleção e escolher um primeiro detalhe para a própria casa.']),
  paragraph('Comece com uma versão pequena: uma peça principal, três recortes e um convite. Observe quais perguntas aparecem antes de aumentar a campanha.')
 ];
 if(/texto|escrev|tom de voz|melhor/.test(value))return [
  paragraph('Vamos deixar a mensagem mais próxima, direta e fácil de lembrar.'),
  heading('Uma versão para experimentar'),
  paragraph('Ideias boas merecem espaço para acontecer. A gente cuida dos detalhes para você dar o próximo passo com mais clareza.'),
  list(['Abra com o que muda para a pessoa.','Troque promessas vagas por um benefício concreto.','Termine com um convite simples.']),
  paragraph('Se você trouxer um texto, podemos comparar uma versão mais direta e outra mais acolhedora.')
 ];
 return [paragraph(mode==='concise'?'Vamos transformar isso em um próximo passo claro.':'Podemos usar essa ideia como ponto de partida e construir uma primeira versão simples.'),heading('Um caminho para começar'),list(['Defina para quem essa ideia faz diferença.','Escolha um resultado pequeno que você consegue observar.','Crie uma primeira versão e ajuste a partir do que aprender.']),paragraph('Nesta demonstração, as respostas são exemplos locais. Que parte você gostaria de explorar primeiro?')];
}
export function responseFor(text,mode='balanced'){
 const blocks=baseResponse(text,mode);
 if(mode==='concise')return blocks.slice(0,3);
 if(mode==='creative')return [...blocks,paragraph('Uma possibilidade extra: transforme essa primeira versão em um pequeno experimento e convide alguém para construir junto.')];
 return blocks;
}
const conversation=(id,title,prompt)=>({id,title,draft:'',messages:[{id:id+'-u',role:'user',text:prompt},{id:id+'-a',role:'assistant',blocks:responseFor(prompt),feedback:null}]});
export function createInitialState(){return {nextId:4,activeId:'c1',mode:'balanced',conversations:[
 conversation('c1','Planejamento da próxima semana','Me ajude a organizar as prioridades da próxima semana. Quero avançar no projeto principal sem deixar o resto da rotina para trás.'),
 conversation('c2','Ideias para a Casa Lina','Quero ideias de campanha para a Casa Lina.'),
 conversation('c3','Tom de voz da marca','Como deixar o texto da minha marca mais acolhedor?')
]};}
export function newConversation(state){
 if(!state.conversations.find(c=>c.id===state.activeId)?.messages.length)return state;
 const id='c'+state.nextId;return {...state,nextId:state.nextId+1,activeId:id,conversations:[{id,title:'Nova conversa',draft:'',messages:[]},...state.conversations]};
}
export function updateDraft(state,text){return {...state,conversations:state.conversations.map(c=>c.id===state.activeId?{...c,draft:text}:c)};}
export function sendMessage(state,input){
 const text=typeof input==='string'?input.trim().slice(0,4000):'';if(!text)return state;
 const messageId='m'+state.nextId;
 return {...state,nextId:state.nextId+1,conversations:state.conversations.map(c=>c.id===state.activeId?{...c,title:c.messages.length?c.title:text.slice(0,42),draft:'',messages:[...c.messages,{id:messageId+'-u',role:'user',text},{id:messageId+'-a',role:'assistant',blocks:responseFor(text,state.mode),feedback:null}]}:c)};
}
const normalized=text=>text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR');
export function searchHistory(state,query){const needle=normalized(query.trim());return state.conversations.filter(c=>normalized(c.title+' '+c.messages.map(m=>m.text||m.blocks?.map(b=>b.text||b.items?.join(' ')).join(' ')).join(' ')).includes(needle));}
export function setFeedback(state,messageId,feedback){return {...state,conversations:state.conversations.map(c=>({...c,messages:c.messages.map(m=>m.id===messageId?{...m,feedback:m.feedback===feedback?null:feedback}:m)}))};}

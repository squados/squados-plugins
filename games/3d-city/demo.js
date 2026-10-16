import { Main } from './build/MainGame.module.js';
const strings={
 'pt-BR':{name:'Simulador de Cidades',subtitle:'Planeje o futuro de Nova Aurora.',help:'Como jogar',restart:'Reiniciar',language:'EN',management:'Gestão',home:'Todos os jogos',title:'Sua próxima decisão muda a cidade.',line1:'Escolha uma ferramenta e clique no terreno para construir.',line2:'Arraste: girar · Botão direito: mover · Roda: zoom · WASD / setas: mover',line3:'Reiniciar restaura Nova Aurora e os fundos iniciais.',credit:'Créditos e licenças'},
 en:{name:'City Simulator',subtitle:'Plan the future of Nova Aurora.',help:'How to play',restart:'Restart',language:'PT',management:'Management',home:'All games',title:'Your next decision changes the city.',line1:'Choose a tool, then click the ground to build.',line2:'Drag: orbit · Right drag: pan · Wheel: zoom · WASD / arrows: pan',line3:'Restart restores Nova Aurora and the initial funds.',credit:'Credits and licenses'}
};
let language='pt-BR';
const $=id=>document.getElementById(id);
$('demo-reset').addEventListener('click',()=>location.reload());
$('demo-help').addEventListener('click',()=>{
 $('demo-instructions').hidden=!$('demo-instructions').hidden;
 $('demo-help').setAttribute('aria-expanded',String(!$('demo-instructions').hidden));
});
$('city-management-toggle').addEventListener('click',()=>{
 const open=document.body.dataset.management!=='open';
 document.body.dataset.management=open?'open':'closed';
 $('city-management-toggle').setAttribute('aria-expanded',String(open));
});
function setLanguage(next){
 language=next;document.documentElement.lang=next;
 const text=strings[next];
 document.title=text.name+' · SquadOS';
 const labels={'city-title':'name','city-subtitle':'subtitle','demo-help':'help','demo-reset':'restart','demo-language':'language','city-management-toggle':'management','demo-help-title':'title','demo-line1':'line1','demo-line2':'line2','demo-line3':'line3','city-credit':'credit'};
 for(const [id,key] of Object.entries(labels))$(id).textContent=text[key];
 $('demo-language').setAttribute('aria-label',next==='en'?'Português':'English');
 $('city-home').setAttribute('aria-label',text.home);
 $('city-home').href='../?lang='+next;
 const url=new URL(location.href);url.searchParams.set('lang',next);history.replaceState(null,'',url);
 document.dispatchEvent(new Event('city-language-change'));
}
$('demo-language').addEventListener('click',()=>setLanguage(language==='en'?'pt-BR':'en'));
setLanguage(new URLSearchParams(location.search).get('lang')==='en'?'en':'pt-BR');
// IDs/dados e evento de prontidão continuam compatíveis com o smoke da demo.
 document.addEventListener('city-ready',()=>{document.body.dataset.cityReady='true';});
try{
 const response=await fetch('./assets/demo-city.json');
 if(!response.ok)throw new Error('Initial city could not be loaded');
 await Main.init(undefined,false,await response.text());
}catch(error){
 console.error(error);$('demo-error').textContent=language==='en'?'Could not open the city. Use a WebGL 2 browser and serve this folder over HTTP.':'Não foi possível abrir a cidade. Use um navegador com WebGL 2 e sirva esta pasta por HTTP.';$('demo-error').hidden=false;
}

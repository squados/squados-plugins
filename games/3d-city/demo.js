import { Main } from './build/MainGame.module.js';
const strings = {
  'pt-BR': ['Controles','Reiniciar','EN','Selecione uma ferramenta abaixo e clique no terreno para construir.','Arraste: girar · Botão direito: mover · Roda: zoom · WASD / setas: mover','Uma cidade inicial, pronta para crescer. Reiniciar restaura esta cidade.'],
  en: ['Controls','Restart','PT','Select a tool below, then click the ground to build.','Drag: orbit · Right drag: pan · Wheel: zoom · WASD / arrows: pan','A starter city, ready to grow. Restart restores this city.']
};
let language = 'pt-BR';
document.querySelector('#demo-reset').addEventListener('click',()=>location.reload());
document.querySelector('#demo-help').addEventListener('click',()=>{
  const panel=document.querySelector('#demo-instructions');
  panel.hidden=!panel.hidden;
  document.querySelector('#demo-help').setAttribute('aria-expanded',String(!panel.hidden));
});
function setLanguage(nextLanguage) {
  language=nextLanguage;
  document.documentElement.lang=language;
  const text=strings[language];
  ['#demo-help','#demo-reset','#demo-language','#demo-line1','#demo-line2','#demo-line3'].forEach((id,i)=>document.querySelector(id).textContent=text[i]);
  document.querySelector('#demo-language').setAttribute('aria-label',language==='en'?'Português':'English');
}
document.querySelector('#demo-language').addEventListener('click',()=>setLanguage(language==='en'?'pt-BR':'en'));
setLanguage(new URLSearchParams(location.search).get('lang')==='en'?'en':'pt-BR');
document.addEventListener('city-ready',()=>{
  document.body.dataset.cityReady='true';
  setTimeout(()=>{
    document.querySelector('#demo-instructions').hidden=true;
    document.querySelector('#demo-help').setAttribute('aria-expanded','false');
  },16000);
});
try {
  const response=await fetch('./assets/demo-city.json');
  if(!response.ok) throw new Error('Initial city could not be loaded');
  await Main.init(undefined,false,await response.text());
} catch(error) {
  console.error(error);
  const message=document.querySelector('#demo-error');
  message.textContent='Não foi possível abrir a cidade. Use um navegador com WebGL 2 e sirva esta pasta por HTTP. / Could not open the city. Use a WebGL 2 browser and serve this folder over HTTP.';
  message.hidden=false;
}

import { Hub_Pannel } from './Hub_Pannel.js';
import { AppState } from '../../AppState.js';
import { t } from '../Copy.js';

export class Hub_Save_Load extends Hub_Pannel {
    constructor(hub,isRight){super(hub,'Save Load',isRight);}
    init(){
        this.body=document.createElement('div');
        this.body.style.cssText='padding:16px 12px;pointer-events:none;display:flex;flex-direction:column;align-items:center;gap:8px;';
        this.pannel.appendChild(this.body);
        this.buttons=[
            ['localSave',()=>AppState.main.autoSave()],
            ['exportSave',()=>AppState.main.saveGame()],
            ['loadLocal',()=>AppState.main.loadGame()],
            // A ação NEW MAP herdada chamava funções inexistentes. Na demo, reiniciar
            // tem o mesmo contrato do cabeçalho: restaurar a cidade inicial.
            ['restartCity',()=>location.reload()]
        ].map(([key,action])=>{
            const button=document.createElement('button');button.type='button';button.className='hub-btn';
            button.dataset.fileAction=key;button.style.cssText='width:172px;min-height:33px;pointer-events:auto;';
            button.addEventListener('click',action);this.body.appendChild(button);return{key,button};
        });
        this.localize();document.addEventListener('city-language-change',()=>this.localize());
    }
    localize(){for(const{key,button}of this.buttons)button.textContent=t(key);}
}

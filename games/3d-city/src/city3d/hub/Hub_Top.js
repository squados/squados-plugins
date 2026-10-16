import { AppState } from '../../AppState.js';
import { t, language, message } from '../Copy.js';
import { icon } from '../UrbanIcons.js';
import { Hub_Disaster } from './Hub_Disaster.js';
import { Hub_Budget } from './Hub_Budget.js';
import { Hub_Awards } from './Hub_Awards.js';
import { Hub_Eval } from './Hub_Eval.js';
import { Hub_History } from './Hub_History.js';
import { Hub_Overlays } from './Hub_Overlays.js';
import { Hub_Ordinances } from './Hub_Ordinances.js';
import { Hub_Economy } from './Hub_Economy.js';
import { Hub_Save_Load } from './Hub_Save_Load.js';
import { Hub_About } from './Hub_About.js';

// Painéis administrativos originais, apresentados no novo HUD da adaptação.
export class Hub_Top {
    constructor(parent) {
        this.parent=parent;
        this.taxeIncome='';
        this.pannels={
            Budget:new Hub_Budget(parent),Eval:new Hub_Eval(parent),Orders:new Hub_Ordinances(parent),
            Economy:new Hub_Economy(parent),Awards:new Hub_Awards(parent),History:new Hub_History(parent,true),
            Overlay:new Hub_Overlays(parent,true),Disaster:new Hub_Disaster(parent,true),
            Files:new Hub_Save_Load(parent,true),About:new Hub_About(parent,true)
        };
        this.content=document.createElement('section');
        this.content.className='city-management';
        this.content.id='city-management';
        parent.hub.appendChild(this.content);
        this.heading=document.createElement('h2');this.content.appendChild(this.heading);
        this.city=document.createElement('p');this.city.className='city-management-name';this.content.appendChild(this.city);
        const nav=document.createElement('nav');this.content.appendChild(nav);
        this.panelButtons={};
        for(const key in this.pannels){
            const button=document.createElement('button');button.type='button';button.dataset.panel=key;
            button.addEventListener('click',()=>{this.closePannel(key);this.pannels[key].open();});
            nav.appendChild(button);this.panelButtons[key]=button;
        }
        this.statusBar=document.createElement('section');
        this.statusBar.className='city-statistics';
        parent.hub.appendChild(this.statusBar);
        this.statLabels={};
        for(const key of ['class','date','population','money','score','happiness']){
            const block=document.createElement('div');block.className='city-stat';block.dataset.stat=key;
            const label=document.createElement('span');label.className='city-stat-label';
            const value=document.createElement('strong');value.className='city-stat-value';
            block.append(label,value);this.statusBar.appendChild(block);this[key]=value;this.statLabels[key]=label;
        }
        this.msg=document.createElement('p');this.msg.className='city-message';
        parent.hub.appendChild(this.msg);
        this.localize();
        document.addEventListener('city-language-change',()=>{this.localize();if(this.lastInfos)this.updateInfo(this.lastInfos);});
    }
    localize(){
        this.heading.textContent=t('municipality');this.city.textContent=t('city');
        this.statusBar.setAttribute('aria-label',t('overview'));
        for(const key in this.panelButtons)this.panelButtons[key].innerHTML=icon(key)+`<span>${t(key)}</span>`;
        for(const key in this.statLabels)this.statLabels[key].textContent=t(key);
        this.format=new Intl.NumberFormat(language());
        this.msg.textContent=t('welcome');
    }
    closePannel(selected){for(const key in this.pannels)if(key!==selected)this.pannels[key].close();}
    setTaxeIncome(value){this.taxeIncome=value;}
    updateInfo(infos){
        if(!infos)return;
        this.lastInfos=infos;
        const type=String(infos[1]||'City').toLowerCase();
        this.class.textContent=t(type.charAt(0).toUpperCase()+type.slice(1));
        const months={Jan:'jan.',Feb:'fev.',Mar:'mar.',Apr:'abr.',May:'mai.',Jun:'jun.',Jul:'jul.',Aug:'ago.',Sep:'set.',Oct:'out.',Nov:'nov.',Dec:'dez.'};
        this.date.textContent=language()==='en'?infos[0]:String(infos[0]).replace(/^[A-Za-z]{3}/,month=>months[month]||month);
        this.money.textContent=this.format.format(infos[4]||0);
        this.population.textContent=this.format.format(infos[3]||0);
        this.score.textContent=this.format.format(infos[2]||0);
        const happiness=Number.isFinite(this.pannels.Eval.happiness)?this.pannels.Eval.happiness:infos[16]||0;
        this.happiness.textContent=happiness+'%';
        this.happiness.dataset.level=happiness>=70?'good':happiness>=40?'fair':'low';
        this.msg.textContent=message(infos[8]);
    }
}

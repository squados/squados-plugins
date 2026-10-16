import { Hub_Pannel } from './Hub_Pannel.js';
import { t } from '../Copy.js';

export class Hub_About extends Hub_Pannel {
    constructor(hub,isRight){super(hub,'About',isRight);}
    init(){
        this.body=document.createElement('div');
        this.body.className='city-credits';
        this.pannel.appendChild(this.body);
        this.localize();
        document.addEventListener('city-language-change',()=>this.localize());
    }
    localize(){
        this.body.innerHTML=`<img src="./assets/city-mark.svg" alt="" width="46" height="46"><h3>${t('name')}</h3><p>${t('ownCredit')}: SquadOS.</p><p>${t('baseCredit')}: <a href="https://github.com/lo-th/3d.city" target="_blank" rel="noopener">3d.city, lo-th</a>, Three.js + MicropolisJS.</p><p>${t('licenseNotice')}</p><a href="./UPSTREAM.md" target="_blank" rel="noopener">${t('licenses')}</a>`;
    }
}

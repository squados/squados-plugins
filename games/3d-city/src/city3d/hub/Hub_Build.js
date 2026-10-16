// Interface própria sobre ferramentas e velocidades nativas de 3d.city.
import { Base } from '../Base.js';
import { AppState } from '../../AppState.js';
import { t } from '../Copy.js';
import { icon } from '../UrbanIcons.js';

export class Hub_Build {
    constructor(parent) {
        this.currentToolName=0;
        this.menu=0;
        this.content=document.createElement('section');
        this.content.className='city-build';
        parent.hub.appendChild(this.content);
        this.header=document.createElement('div');
        this.header.className='city-build-header';
        this.content.appendChild(this.header);
        const tabs=document.createElement('div');
        tabs.className='city-build-tabs';
        this.header.appendChild(tabs);
        this.tabs=['build','services'].map((key,index)=>{
            const button=document.createElement('button');
            button.type='button'; button.dataset.tab=key;
            button.addEventListener('click',()=>this.switchMenu(index));
            tabs.appendChild(button); return button;
        });
        const speeds=document.createElement('div');
        speeds.className='city-speeds';
        this.header.appendChild(speeds);
        this.speedButton=[];
        ['Ⅱ','▷','▷▷','▷▷▷','»'].forEach((label,index)=>{
            const button=document.createElement('button');
            button.type='button';button.textContent=label;button.dataset.speed=index;
            button.dataset.state=index===2?'select':'close';
            button.addEventListener('click',()=>this.setActiveSpeed(index));
            speeds.appendChild(button);this.speedButton.push(button);
        });
        this.innerb=document.createElement('div');
        this.innerb.className='city-tools';
        this.content.appendChild(this.innerb);
        this.toolButtons=Array.from({length:10},(_,index)=>{
            const button=document.createElement('button');
            button.type='button';
            button.className='city-tool';
            button.addEventListener('click',()=>this.selectId(index));
            button.addEventListener('mouseenter',()=>this.showToolInfo(index));
            button.addEventListener('focus',()=>this.showToolInfo(index));
            button.addEventListener('mouseleave',()=>this.showSelectedInfo());
            this.innerb.appendChild(button);
            return button;
        });
        const footer=document.createElement('div');
        footer.className='city-build-footer';
        this.content.appendChild(footer);
        this.toolInfo=document.createElement('span');
        this.toolInfo.className='city-tool-info';
        footer.appendChild(this.toolInfo);
        this.demand=document.createElement('div');
        this.demand.className='city-demand';
        footer.appendChild(this.demand);
        this.demandTitle=document.createElement('span');
        this.demand.appendChild(this.demandTitle);
        this.rci=['residential','commercial','industrial'].map(key=>{
            const track=document.createElement('span');
            track.className='city-demand-track';track.dataset.zone=key;
            const bar=document.createElement('i');
            bar.style.background=Base.toolSet.find(tool=>tool.tool===key).color;
            track.appendChild(bar);this.demand.appendChild(track);return bar;
        });
        this.switchMenu(0);
        this.localize();
        document.addEventListener('city-language-change',()=>this.localize());
    }
    localize() {
        this.tabs.forEach((button,index)=>button.textContent=t(index?'services':'build'));
        const keys=['pause','slow','normal','fast','veryFast'];
        this.speedButton.forEach((button,index)=>{button.setAttribute('aria-label',t(keys[index]));button.title=t(keys[index]);});
        this.demandTitle.textContent=t('demand');
        this.renderTools();
    }
    switchMenu(index) {
        this.menu=index;
        this.tool=index===0?[1,2,3,7,8,9,11,10,12,14]:[5,6,4,13,15,17,16,18,20,19];
        this.tabs.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
        this.resetTool();
        this.renderTools();
    }
    renderTools() {
        this.toolButtons.forEach((button,index)=>{
            const tool=Base.toolSet[this.tool[index]];
            button.dataset.tool=tool.tool;
            button.style.setProperty('--tool-color',tool.color==='none'?'#597367':tool.color);
            button.disabled=tool.id===14;
            button.setAttribute('aria-label',t(tool.tool));
            button.title=button.disabled?t('unavailable'):`${t(tool.tool)} · ${tool.price}`;
            button.innerHTML=icon(tool.tool)+`<span>${t(tool.tool)}</span><small>${tool.price?tool.price:'—'}</small>`;
            button.setAttribute('aria-pressed',String(this.currentToolName===tool.id&&tool.id!==0));
        });
        this.showSelectedInfo();
    }
    setActiveSpeed(index) {
        AppState.main.setSpeed(Number(index));
        this.speedButton.forEach((button,i)=>button.dataset.state=i===Number(index)?'select':'close');
    }
    selectId(index) {
        const id=this.tool[index];
        if(id===14)return;
        if(this.currentToolName===id){this.resetTool();return;}
        this.currentToolName=id;
        AppState.main.selectTool(id);
        this.renderTools();
    }
    showToolInfo(index) {
        const tool=Base.toolSet[this.tool[index]];
        this.toolInfo.textContent=tool.id===14?t('unavailable'):`${t(tool.tool)}${tool.price?' · '+tool.price:''}`;
    }
    showSelectedInfo() {
        const index=this.tool.indexOf(this.currentToolName);
        if(index>=0)this.showToolInfo(index);
        else this.toolInfo.textContent=t('selectTool');
    }
    updateRCI(residential,commercial,industrial) {
        [residential,commercial,industrial].forEach((value,index)=>{
            this.rci[index].style.width=Math.min(100,Math.abs(value)/20)+'%';
            this.rci[index].style.opacity=value<0?'.4':'1';
            this.rci[index].parentElement.title=t(['residential','commercial','industrial'][index])+': '+value;
        });
    }
    resetTool() {
        this.currentToolName=0;
        AppState.main.selectTool(0);
        if(this.toolButtons)this.toolButtons.forEach(button=>button.setAttribute('aria-pressed','false'));
        if(this.toolInfo)this.toolInfo.textContent=t('selectTool');
    }
}

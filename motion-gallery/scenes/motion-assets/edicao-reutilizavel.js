(() => {
  const root = document.querySelector('main');
  const mode = root.dataset.variant;
  const inputs = window.motionInputs || {};
  const q = name => root.querySelector(name);
  const clamp = x => Math.max(0, Math.min(1, x));
  const ease = x => { x = clamp(x); return x*x*(3-2*x); };
  const out = x => 1 - (1 - clamp(x)) ** 4;
  const set = (node, style) => Object.assign(node.style, style);
  const defaultTitle = 'Como a edição acontece';

  if (mode === 'frame') {
    const lens = q('.lens');
    if (inputs.side === 'left') lens.classList.add('left');
    window.renderMotion = t => {
      const p = out(t / .42);
      set(lens, { opacity: p, transform: 'translateY(' + (1-p)*42 + 'px)' });
    };
  } else if (mode === 'flash') {
    q('.a h1').textContent = inputs.before || 'Plano aberto';
    q('.b h1').textContent = inputs.after || 'Segundo plano';
    const peak = Math.min(.6, Math.max(.10, Number(inputs.intensity) || .36));
    window.renderMotion = t => {
      const u = (t - 1.76) / .09;
      set(q('.flare'), { opacity: peak * Math.exp(-u*u) });
      set(q('.b'), { opacity: ease((t-1.70)/.12) });
    };
  } else if (mode === 'glass') {
    q('h1').textContent = inputs.title || defaultTitle;
    const labels = Array.isArray(inputs.items) ? inputs.items.slice(0, 3) : ['Preparar o material', 'Escolher os cortes', 'Conferir a montagem'];
    const times = Array.isArray(inputs.reveals) ? inputs.reveals : [1.2, 2.4, 3.6];
    const panel = q('.glass');
    const cards = labels.map((label, i) => {
      const row = document.createElement('div');
      row.className = 'glass-row';
      const number = document.createElement('b');
      number.textContent = '0' + (i+1);
      const title = document.createElement('span');
      title.textContent = label;
      row.append(number, title);
      panel.append(row);
      return title;
    });
    window.renderMotion = t => {
      const p = out(t/.35);
      set(panel, {opacity:p, transform:'translate('+(1-p)*28+'px,'+(1-p)*36+'px)'});
      cards.forEach((card, i) => {
        const reveal = ease((t - times[i]) / .29);
        set(card, {filter:'blur('+(1-reveal)*17+'px)', opacity:.51 + .49*reveal});
      });
    };
  } else if (mode === 'tablet') {
    const node = q('.device');
    if (inputs.side === 'left') node.style.left = '240px';
    window.renderMotion = t => {
      const p = out(t / .6);
      set(node, {opacity:p, transform:'perspective(1500px) translateY('+(1-p)*92+'px) rotateY('+(-39 + 31*p)+'deg) rotateZ('+(-7 + 4*p)+'deg)'});
    };
  } else if (['squados', 'claude', 'chatgpt', 'click'].includes(mode)) {
    if (inputs.transparent) root.style.background = 'transparent';
    const logo = inputs.logo || 'logo.svg';
    const isClick = mode === 'click';
    const badge = q('.badge');
    for (let i = 0; i <= 20; i++) {
      const slice = document.createElement('div');
      const outer = i === 0 || i === 20;
      slice.className = 'slice' + (outer ? ' outer' : '');
      slice.style.transform = 'translateZ(' + (i-10)*2.2 + 'px)';
      const image = new Image();
      image.src = logo;
      image.alt = '';
      if (i === 0) image.style.transform = 'scaleX(-1)';
      slice.append(image);
      badge.append(slice);
    }
    window.renderMotion = t => {
      const p = out(t/.42);
      const press = ease((t-1.32)/.1)*(1-ease((t-1.46)/.16));
      const angle = isClick ? -28 + 28*p : -50 + 410*ease((t-.16)/3.16);
      set(badge, {opacity:p,transform:'rotateX(-9deg) rotateY('+angle+'deg) scale('+(.8 + .2*p - .09*press)+')'});
      if (isClick) {
        const age = clamp((t-1.42)/.64);
        set(q('.ripple'), {opacity:t<1.42?0:(1-age)**1.6, transform:'scale('+(1+out(age)*.8)+')'});
      }
    };
  } else if (mode === 'cuts') {
    const svg = q('svg');
    const count = q('.count');
    const beats = Array.isArray(inputs.beats) && inputs.beats.length === 3 ? inputs.beats : [1.28,2.10,2.96];
    const ns = 'http://www.w3.org/2000/svg';
    function element(tag, attrs) {
      const node = document.createElementNS(ns, tag);
      for (const [key,val] of Object.entries(attrs)) node.setAttribute(key, val);
      svg.append(node);
      return node;
    }
    const blocks = Array.from({length:7}, (_, i) => {
      const gap = i % 2 === 1;
      return {gap, width: gap ? 90 : 193, media: element('rect',{y:36,height:111,rx:12,fill:gap?'#875dbb':'#514676'}),
        audio: element('rect',{y:208,height:114,rx:12,fill:gap?'#443254':'#342f48'}), wave: Array.from({length:24},(_,j)=>element('line',
          {'stroke-width':3,stroke:gap?'#b699ca':'#aa95dd',y1:265-(gap?4:23+18*Math.sin(j*2.8)**2),y2:265+(gap?4:23+18*Math.sin(j*2.8)**2)}))};
    });
    const playhead = element('line',{y1:11,y2:342,stroke:'#eee5ff','stroke-width':4});
    window.renderMotion = t => {
      let x = 20, nearest = 170;
      blocks.forEach((item,i) => {
        const j = (i-1)/2;
        if(item.gap && t >= beats[j]-.4) nearest=x;
        const width = item.gap ? item.width * (1-out((t-beats[j])/.34)) : item.width;
        item.media.setAttribute('x',x); item.audio.setAttribute('x',x);
        item.media.setAttribute('width',width); item.audio.setAttribute('width',width);
        item.wave.forEach((bar,n)=>{
          const bx = x + (n+.5)*width/item.wave.length;
          bar.setAttribute('x1',bx); bar.setAttribute('x2',bx);
          bar.setAttribute('opacity',width>8?'1':'0');
        });
        x += width + (width>1?5:0);
      });
      if(t > beats[2]+.32) nearest += (x-nearest-40)*ease((t-beats[2]-.32)/.8);
      playhead.setAttribute('x1',nearest); playhead.setAttribute('x2',nearest);
      count.textContent = beats.filter(beat=>beat<=t).length + ' de 3 cortes';
    };
  }

  window.renderMotion?.(0);
})();

(() => {
  const demos = window.motionDemos ??= Object.create(null)
  const tau = Math.PI * 2
  const ice = '#c5f7ff'
  const pearl = '#fff8e9'
  const mint = '#68f9bd'
  const cyan = '#4bd9ff'
  const blue = '#4789ff'
  const violet = '#aa9aff'
  const pink = '#ff79b6'
  const coral = '#ff795c'
  const gold = '#ffd786'
  const ink = '#14172c'
  const clamp = p => Math.min(1, Math.max(0, p))
  const phase = (t, a, b) => clamp((t - a) / (b - a))
  const smooth = p => p * p * (3 - 2 * p)
  const ease = (t, a, b) => smooth(phase(t, a, b))
  const out = (t, a, b) => 1 - (1 - phase(t, a, b)) ** 3
  const mix = (a, b, t) => a + (b - a) * t
  const seed = n => ((Math.sin(n * 91.314 + 43.71) * 43758.5453) % 1 + 1) % 1

  function shape(c, points, fill, width) {
    c.beginPath()
    points.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y))
    if (width) {
      c.lineCap = 'round'
      c.lineJoin = 'round'
      c.strokeStyle = fill
      c.lineWidth = width
      c.stroke()
    } else {
      c.closePath()
      c.fillStyle = fill
      c.fill()
    }
  }

  function trace(c, points, p, color, width = 2) {
    if (p <= 0) return
    const index = (points.length - 1) * clamp(p)
    const full = Math.floor(index)
    const path = points.slice(0, full + 1)
    if (full + 1 < points.length) {
      path.push(points[full].map((v, i) => mix(v, points[full + 1][i], index - full)))
    }
    shape(c, path, color, width)
  }

  function rect(c, x, y, w, h, r, fill, edge) {
    if (w <= 0 || h <= 0) return
    c.beginPath()
    c.roundRect(x, y, w, h, r)
    c.fillStyle = fill
    c.fill()
    if (edge) {
      c.strokeStyle = edge
      c.lineWidth = 1
      c.stroke()
    }
  }

  function arc(c, x, y, r, start, end, color, width) {
    if (r <= 0 || end <= start) return
    c.beginPath()
    c.arc(x, y, r, start, end)
    if (width) {
      c.lineWidth = width
      c.lineCap = 'round'
      c.strokeStyle = color
      c.stroke()
    } else {
      c.fillStyle = color
      c.fill()
    }
  }

  const dot = (c, x, y, r, color) => arc(c, x, y, r, 0, tau, color)

  function gradient(c, x, y, u, v, ...colors) {
    const g = c.createLinearGradient(x, y, u, v)
    colors.forEach((color, i) => g.addColorStop(i / (colors.length - 1), color))
    return g
  }

  function pose(c, x, y, scale, angle, draw, alpha = 1) {
    if (scale <= 0 || alpha <= 0) return
    c.save()
    c.translate(x, y)
    c.rotate(angle)
    c.scale(scale, scale)
    c.globalAlpha *= alpha
    draw()
    c.restore()
  }

  function type(c, value, x, y, size, color = pearl, align = 'center', weight = 700) {
    c.fillStyle = color
    c.font = weight + ' ' + size + 'px "Segoe UI", sans-serif'
    c.textAlign = align
    c.textBaseline = 'middle'
    c.fillText(value, x, y)
  }

  function star(c, x, y, r, color, arms = 4, inner = .22) {
    shape(c, Array.from({ length: arms * 2 }, (_, i) => {
      const angle = i * Math.PI / arms - Math.PI / 2
      const length = i % 2 ? r * inner : r
      return [x + Math.cos(angle) * length, y + Math.sin(angle) * length]
    }), color)
  }

  function halo(c, x, y, r, color, p) {
    if (p <= 0 || p >= 1) return
    c.save()
    c.globalAlpha *= 1 - p
    arc(c, x, y, r * (.35 + .85 * p), 0, tau, color, mix(3, .7, p))
    c.restore()
  }

  function burst(c, x, y, color, p, count = 12, radius = 52) {
    if (p <= 0 || p >= 1) return
    for (let i = 0; i < count; i++) {
      const a = i * tau / count + seed(i) * .45
      const r = mix(8, radius * (.5 + .5 * seed(i + 70)), p)
      const dx = Math.cos(a), dy = Math.sin(a)
      c.save()
      c.globalAlpha *= 1 - p
      shape(c, [[x + dx * r, y + dy * r], [x + dx * (r + 7), y + dy * (r + 7)]], color, 2)
      c.restore()
    }
  }

  const check = (c, x, y, r, p, color, w = 4) =>
    trace(c, [[x - r, y], [x - r * .3, y + r * .6], [x + r, y - r * .65]], p, color, w)

  function diamond(c, x, y, r, fill) {
    shape(c, [[x, y-r], [x+r, y], [x, y+r], [x-r, y]], fill)
  }

  function sheet(c, fill = pearl, detail = ink, lineCount = 3) {
    shape(c, [[-34,-49], [17,-49], [34,-32], [34,49], [-34,49]], fill)
    shape(c, [[17,-49], [17,-32], [34,-32]], '#9192a07d')
    for (let i = 0; i < lineCount; i++) {
      rect(c, -20, -12 + 13*i, i === 0 ? 33 : 41 - 4*i, i === 0 ? 5 : 3, 2, detail)
    }
  }

  function curve(a, b, bend = 35) {
    return Array.from({length: 33}, (_, i) => {
      const p = i / 32
      return [mix(a[0], b[0], p), mix(a[1], b[1], smooth(p)) - Math.sin(p * Math.PI) * bend]
    })
  }

  function signal(c, points, p, color, radius = 5) {
    if (p < 0 || p > 1) return
    const i = Math.min(points.length - 2, Math.floor(p * (points.length - 1)))
    const f = p * (points.length - 1) - i
    const x = mix(points[i][0], points[i+1][0], f)
    const y = mix(points[i][1], points[i+1][1], f)
    dot(c, x, y, radius * 2.8, color + '20')
    dot(c, x, y, radius, color)
    dot(c, x, y, radius * .42, pearl)
  }

  function node(c, x, y, r, color, active) {
    dot(c, x, y, r, color + '27')
    arc(c, x, y, r, 0, tau, color, active ? 2.4 : 1)
    diamond(c, x, y, r * (active ? .52 : .33), color)
  }

  // Documentos, classificação e leitura de dados.
  demos['13-G'] = (c, t) => {
    const scan = ease(t, .13, .74)
    const x = mix(90, 390, scan)
    rect(c, x-29, 43, 58, 183, 0, gradient(c, x-29, 0, x+29, 0, '#41dfff00', '#41dfff26', '#41dfff00'))
    for (let i = 0; i < 4; i++) {
      const px = 111 + 86*i
      const turn = ease(t, .14+i*.12, .32+i*.12)
      pose(c, px, 132 - 11 * Math.sin(turn * Math.PI), .82, (1-turn)*(.10-i*.055), () => {
        c.scale(.08 + .92 * Math.abs(1 - 2*turn), 1)
        if (turn < .5) sheet(c, pearl, '#76748c')
        else {
          const color = i % 2 ? blue : mint
          rect(c,-39,-51,78,102,11,gradient(c,-39,-51,39,51,color, i % 2 ? '#3342ac' : '#229d80'))
          diamond(c,0,-12,18,ice)
          for (let j=0;j<=i;j++) rect(c,-19+j*11,25,7,4,2,ink+'99')
        }
      })
    }
    shape(c, [[x,47],[x,221]], ice, 1.6)
    halo(c, 373, 132, 58, mint, phase(t,.73,.96))
  }

  demos['13-E1'] = (c, t) => {
    for (let i = 0; i < 4; i++) {
      const p = out(t,.04+i*.07,.54+i*.07)
      const x = mix(240+i*5, [178,302,178,302][i], p)
      const y = mix(138+i*4, [86,86,184,184][i], p)
      const color = [gold, coral, violet, mint][i]
      pose(c,x,y, mix(1,.83,p), (-.19+i*.12)*(1-p), () => {
        c.scale(1 + p*.54, 1 - p*.20)
        if (p < .45) sheet(c, pearl, '#7d7b85')
        else {
          rect(c,-38,-47,76,94,12,gradient(c,-38,-48,38,47,pearl,color))
          star(c,-3,-2,24,ink,4,.37)
          arc(c,-3,-2,27,-1.8,-1.8+tau*phase(p,.5,1),ink+'aa',.8)
        }
      })
    }
  }

  demos['13-E2'] = (c, t) => {
    const left = [[110,82],[110,135],[110,188]]
    const destinations = [[365,60],[365,110],[365,160],[365,210]]
    const selected = i => i === 1 || i === 3
    const right = destinations.map(([x,y],i) => [x+(selected(i)?18*ease(t,.51+i*.04,.75+i*.04):0),y])
    const links = [[0,0],[0,1],[1,1],[1,2],[2,1],[2,3]]
    links.forEach(([a,b],i) => {
      const route = curve(left[a],right[b],0)
      trace(c,route,ease(t,.08+i*.045,.43+i*.045),selected(b) ? mint : '#8288af66',selected(b) ? 2.3 : 1.2)
      if (selected(b)) signal(c,route,(t-.17-i*.04)/.41,cyan,3.7)
    })
    left.forEach(([x,y], i) => node(c,x,y,14,[violet,cyan,blue][i],false))
    right.forEach(([x,y],i) => {
      const p = ease(t,.51+i*.04,.75+i*.04)
      node(c,x,y,16+(selected(i)?6*p:0),selected(i)?mint:'#9a9bb4',selected(i) && p>.3)
      if (selected(i)) halo(c,x,y,37,cyan,phase(t,.62+i*.04,.91+i*.02))
    })
  }

  demos['14-G'] = (c, t) => {
    const cx = 238
    const cy = 141
    const colors = [cyan,violet,gold]
    const ratios = [.84,.62,.41]
    for (let i=0;i<3;i++) {
      const p = out(t,.04+i*.09,.65+i*.075)
      const r = 88 - 17*i
      arc(c,cx,cy,r,-Math.PI/2,tau-Math.PI/2,colors[i]+'26',8)
      arc(c,cx,cy,r,-Math.PI/2,-Math.PI/2+tau*ratios[i]*p,colors[i],8)
      const a = -Math.PI/2 + tau*ratios[i]*p
      dot(c,cx+r*Math.cos(a),cy+r*Math.sin(a),4.5,pearl)
    }
    type(c,String(Math.round(84*out(t,.10,.78))),cx,cy-4,52,pearl)
    type(c,'%',cx,cy+34,16,cyan)
  }

  demos['14-E1'] = (c, t) => {
    const scores = [52,86,68]
    const colors = [cyan,gold,pink]
    const rank = [2,0,1]
    scores.forEach((value,i) => {
      const p = ease(t,.28+i*.02,.70+i*.02)
      const width = value*2.38*out(t,.025+i*.03,.54)
      const y = mix(73+i*62,73+rank[i]*62,p)
      rect(c,91,y-10,width,20,8,gradient(c,91,0,315,0,colors[i]+'69',colors[i]))
      dot(c,67,y,8,colors[i])
      type(c,Math.round(width/2.38),103+width,y,22,colors[i],'left',650)
      if (i===1) halo(c,67,y,24,gold,phase(t,.67,.99))
    })
  }

  demos['14-E2'] = (c, t) => {
    const colors = [pink,cyan,gold]
    const sizes = [128,164,85]
    for (let i=0;i<3;i++) {
      const x=134+i*105
      const p=out(t,.06+i*.10,.63+i*.075)
      const h=sizes[i]*p
      rect(c,x-23,216-h,46,h,7,gradient(c,x,216-h,x,216,colors[i],colors[i]+'16'))
      if (h>2) rect(c,x-19,216-h,38,2,1,pearl)
      type(c,Math.round(h),x,194-h,23,colors[i])
      if (i===0) shape(c,[[x-6,227],[x+8,234],[x-6,241]],colors[i])
      if (i===1) diamond(c,x,234,8,colors[i])
      if (i===2) arc(c,x,234,7,0,tau,colors[i],2)
    }
    shape(c,[[79,218],[400,218]],'#d6eaff68',1)
  }

  demos['14-E3'] = (c, t) => {
    const values = [171,161,170,125,143,99,123,81,91,54,69]
    const path = []
    for (let i=0;i<80;i++) {
      const p=i/79, j=Math.min(values.length-2,Math.floor(p*(values.length-1)))
      path.push([64+350*p,mix(values[j],values[j+1],smooth(p*(values.length-1)-j))])
    }
    const p = out(t,.02,.82)
    const end = path[Math.floor(p*79)]
    for(let i=0;i<4;i++) shape(c,[[64,75+i*43],[414,75+i*43]],'#90aeff39',1)
    shape(c,[[64,204],...path.slice(0,Math.floor(p*79)+1),[end[0],204]],gradient(c,0,55,0,204,blue+'ad',blue+'00'))
    trace(c,path,p,cyan,3.4)
    dot(c,end[0],end[1],5,pearl)
    halo(c,end[0],end[1],25,ice,phase(t,.72,.99))
  }

  // Alinhamento, matrizes de contraste e dobra.
  demos['15-G'] = (c, t) => {
    const colors=[pearl,violet,cyan]
    for(let i=0;i<3;i++) {
      const p=ease(t,.05+i*.07,.61+i*.07)
      const q=ease(t,.54+i*.065,.91+i*.025)
      const x=mix(122+i*118,205+i*36,p)
      const y=mix(130+Math.sin(i*2)*32,148-i*12,p)
      const angle=(1-p)*(-.32+i*.3)+q*(i-1)*.18
      pose(c,x,y,1+.08*q,angle,()=>{
        c.scale(1+q*1.04,1-q*.43)
        sheet(c,colors[i],ink+'75',3-i)
      })
    }
    const r=phase(t,.68,1)
    halo(c,246,145,97,cyan,r)
    pose(c,366,119,ease(t,.71,.94),.15,()=>star(c,0,0,27,gold))
  }

  demos['15-E1'] = (c,t) => {
    const colors=[coral,violet,mint]
    for(let i=0;i<3;i++) {
      const p=out(t,.035+i*.10,.65+i*.07)
      pose(c,mix([-35,240,515][i],137+103*i,p),mix([187,2,187][i],125,p),p*.66+.42,(-.34+i*.35)*(1-p),()=>{
        const color=colors[i]
        rect(c,-42,-53,84,112,10,gradient(c,-42,-53,42,59,color,ink),color)
        arc(c,0,0,26,0,tau,pearl,1.1)
        shape(c,[[-29,17],[0,-30],[29,17]],pearl,1.8)
        star(c,0,0,12,color)
      })
      const line=ease(t,.57+i*.07,.85+i*.05)
      shape(c,[[137+103*i-31*line,199],[137+103*i+31*line,199]],colors[i],2)
    }
  }

  demos['15-E2'] = (c,t) => {
    const pattern=[[1,1,1,1],[1,0,1,1],[0,1,0,1]]
    pattern.forEach((row,j)=>row.forEach((value,i)=>{
      const p=out(t,.02+.032*(4*j+i),.31+.035*(4*j+i))
      const x=135+i*70,y=76+j*59
      const lit=i===1
      pose(c,x,y,p,0,()=>{
        rect(c,-24,-23,48,46,10,lit?'#b39bff44':'#7799cb29',lit?violet:'#7799cb88')
        if (value) check(c,0,0,10,ease(t,.13+.035*(4*j+i),.42+.035*(4*j+i)),lit?pearl:cyan,2.7)
        else shape(c,[[-8,0],[8,0]],pink,2)
      })
    }))
    const p=ease(t,.57,.91)
    if(p>0) {
      shape(c,[[170,222],[170,222-172*p],[238,222-172*p],[238,222]],violet,1.4)
      star(c,204,30,10*p,pearl)
    }
  }

  function printPage(c, variant) {
    rect(c,-74,-87,148,174,4,gradient(c,-74,0,74,0,'#a8a6cc',pearl,pearl))
    if (variant===0) {
      rect(c,-60,-70,120,140,0,gradient(c,-60,-70,60,70,'#fc5e56','#981560',ink))
      for(let i=0;i<5;i++) arc(c,0,-3,14+i*10,-.9+i*.19,3.9+i*.19,gold,1.25)
    } else if (variant===1) {
      for(let i=0;i<5;i++) rect(c,-53,-58+i*29,106-(i%2)*33,16,2,[violet,blue,cyan,mint,gold][i])
    } else {
      for(let i=0;i<6;i++) shape(c,[[-59,-50+i*18],[-32,-60+i*19],[0,-35+i*16],[42,-54+i*18],[58,-65+i*19]],ink,1.5)
      star(c,40,-38,21,coral)
    }
  }

  demos['15-E3'] = (c,t) => {
    const p=ease(t,.14,.55), q=ease(t,.56,.91)
    const turn = p<1?p:q
    const page = p<1?0:1
    pose(c,mix(165,239,p),134,1.03,-.10+.12*t,()=>{
      c.save()
      c.translate(74,0)
      printPage(c,page+1)
      c.restore()
      if (page > 0) {
        rect(c,-148,-87,148,174,4,gradient(c,-148,0,0,0,'#e8ddea','#a49bb9'))
        for(let i=0;i<5;i++) arc(c,-76,0,16+i*10,-2.3,1.9,'#9b71bf',1.1)
      }
      c.save()
      c.transform(Math.cos(turn*Math.PI), -.18*Math.sin(turn*Math.PI), 0,1,0,0)
      c.translate(74,0)
      if (turn<.5) printPage(c,page)
      else {
        rect(c,-74,-87,148,174,4,gradient(c,-74,0,74,0,'#a49bb9','#e8ddea'))
        for(let i=0;i<5;i++) arc(c,2,0,16+i*10,-2.3,1.9,'#9b71bf',1.1)
      }
      c.restore()
    })
  }

  // Alternância, entrega e confirmação como símbolos independentes.
  function pill(c,x,y,w,h,color) {
    rect(c,x-w/2,y-h/2,w,h,h/2,gradient(c,x-w/2,y-h/2,x+w/2,y+h/2,color,color+'6f'),color)
  }

  demos['16-G'] = (c,t) => {
    const beats = [[122,95,cyan],[357,96,pink],[164,176,cyan],[322,179,pink]]
    beats.forEach(([x,y,color],i)=>{
      const p=out(t,.02+i*.14,.28+i*.14)
      pose(c,x,y,p,0,()=>{
        pill(c,0,0,98+7*i,43,color)
        for(let j=0;j<3;j++) dot(c,-20+j*20,2*Math.sin(32*t-j*1.6),3.2,ink)
      })
    })
    const p=ease(t,.29,.86)
    arc(c,240,137,33,-Math.PI/2,-Math.PI/2+p*tau,ice,2.3)
    star(c,240,137,p*21,pearl)
    halo(c,240,137,53,pearl,phase(t,.71,1))
  }

  demos['16-E1'] = (c,t) => {
    const route=curve([105,140],[373,140],79)
    const p=ease(t,.08,.83)
    const color=p<.5?cyan:pink
    arc(c,104,140,39,0,tau,cyan,2)
    arc(c,374,140,39,0,tau,pink,2)
    arc(c,104,140,47,-2.8,1.7,cyan+'60',1)
    arc(c,374,140,47,-1.3,3.25,pink+'60',1)
    trace(c,route,1,'#ded6ff38',1)
    for(let i=5;i>=0;i--) {
      c.save()
      c.globalAlpha*=1-i*.165
      signal(c,route,p-i*.029,color,7.8-i*.94)
      c.restore()
    }
    halo(c,374,140,72,pink,phase(t,.75,.99))
  }

  demos['16-E2'] = (c,t) => {
    const p=out(t,.02,.52), fly=ease(t,.48,.86)
    const x=mix(214,314,fly), y=157-75*Math.sin(fly*Math.PI)-19*fly
    const route=curve([131,187],[314,138],72)
    trace(c,route,fly,pink+'75',1.8)
    pose(c,x,y,mix(1.39,.91,fly)*p,-.17+.45*fly,()=>{
      sheet(c,pearl,ink,0)
      rect(c,-27,4,54,27,6,coral)
      type(c,'PDF',0,18,16,ink)
    })
    const q=out(t,.81,1)
    pose(c,361,185,q,0,()=>{
      dot(c,0,0,21,mint)
      check(c,0,0,9,q,ink,3)
    })
    burst(c,316,136,pink,phase(t,.80,1),9,62)
  }

  demos['16-E3'] = (c,t) => {
    const r=75,p=out(t,.04,.68), a=mix(-Math.PI*.54,Math.PI*.70,p)
    arc(c,236,132,r,0,tau,'#ffcc8050',2)
    arc(c,236,132,r,-Math.PI/2,-Math.PI/2+p*tau,gold,5)
    for(let i=0;i<12;i++) {
      const v=i*tau/12
      shape(c,[[236+Math.cos(v)*61,132+Math.sin(v)*61],[236+Math.cos(v)*66,132+Math.sin(v)*66]],pearl,1.8)
    }
    shape(c,[[236,132],[236+Math.cos(a)*49,132+Math.sin(a)*49]],gold,4.6)
    dot(c,236,132,7,pearl)
    const q=out(t,.64,.91)
    pose(c,310,189,q,0,()=>{
      dot(c,0,0,23,mint)
      check(c,0,0,10,q,ink,4)
    })
    halo(c,310,189,45,mint,phase(t,.69,.98))
  }

  demos['16-E4'] = (c,t) => {
    const p=ease(t,.05,.46),q=ease(t,.39,.89)
    const first=curve([63,133],[238,133],0)
    const second=curve([237,133],[411,79],15)
    trace(c,first,p,coral,3.8)
    trace(c,second,q,mint,3)
    signal(c,first,phase(t,.05,.46),coral,6)
    signal(c,second,phase(t,.44,.90),mint,6)
    pose(c,237,134,.65+.37*p,p*.1,()=>{
      dot(c,0,0,39,ink)
      arc(c,0,0,38,0,tau,coral,4)
      shape(c,[[-20,20],[20,-20]],coral,4)
    })
    halo(c,237,134,68,coral,phase(t,.40,.74))
    if(q>.65) star(c,411,79,18*(q-.65)/.35,mint)
  }

  demos['16-E5'] = (c,t) => {
    const p=out(t,.04,.31),q=out(t,.31,.63),r=out(t,.60,.90)
    pose(c,148,135,p,0,()=> {
      for(let i=0;i<3;i++) dot(c,-26+i*26,9*Math.sin(t*25-i*1.5),6+2*Math.sin(t*20-i),violet)
    },1-.57*q)
    pose(c,234,133,q,-.13*(1-q),()=>{
      diamond(c,0,0,43,blue)
      check(c,0,0,17,q,pearl)
    })
    pose(c,328,135,r,.22*(1-r),()=>{
      arc(c,0,0,36,0,tau,pink,2.2)
      type(c,'?',0,0,49,pink)
    })
    halo(c,328,135,55,pink,phase(t,.71,1))
  }
  // Consolidação, sincronização e marcos.
  demos['17-G'] = (c,t) => {
    const points=[[98,134],[240,134],[382,134]]
    for(let i=0;i<2;i++) {
      const p=ease(t,.33+i*.13,.70+i*.11)
      const path=curve(points[i],points[i+1],i===0?32:-32)
      trace(c,path,p,mint,3)
      signal(c,path,(t-.55-i*.16)/.20,pearl,4.7)
    }
    points.forEach(([x,y],i)=>{
      const p=out(t,.04+i*.08,.60+i*.045)
      pose(c,mix(x+[39,0,-39][i],x,p),mix([190,67,190][i],y,p),.52+.52*p,(1-p)*1.8,()=>{
        shape(c,Array.from({length:7},(_,j)=>[36*Math.cos(j*tau/6),36*Math.sin(j*tau/6)]),[blue,violet,mint][i],2.2)
        dot(c,0,0,15,[blue,violet,mint][i]+'56')
        star(c,0,0,16,[blue,violet,mint][i])
      })
    })
    halo(c,382,134,49,mint,phase(t,.86,1))
  }

  demos['17-E1'] = (c,t) => {
    const colors=[violet,cyan,mint]
    for(let i=0;i<3;i++) {
      const y=76+i*58
      const path=curve([91,y],[325,101+i*29],0)
      trace(c,path,.99,colors[i]+'32',1)
      for(let j=0;j<3;j++) {
        const f=phase(t,.045+i*.11+j*.04,.52+i*.095+j*.04)
        const x=mix(91+14*j,335+13*j,f)
        const yy=mix(y,102+i*29,smooth(f))
        pose(c,x,yy,.87,0,()=>diamond(c,0,0,mix(6,9,f),colors[i]),.46+.54*f)
      }
      arc(c,80,y,19,-2.2,2.2,colors[i],2.2)
      rect(c,321,89+i*29,ease(t,.53+i*.08,.83+i*.06)*90,23,8,colors[i]+'2f')
    }
    const p=ease(t,.72,.96)
    if(p>0) trace(c,[[324,75],[396,75],[412,91],[412,178],[323,178]],p,pearl,1.6)
  }

  function prism(c,color1,color2) {
    const g=gradient(c,-35,-34,32,41,color1,color2)
    shape(c,[[0,-39],[32,-16],[27,25],[0,42],[-27,25],[-32,-16]],g)
    shape(c,[[0,-39],[32,-16],[0,1],[-32,-16]],color1)
    shape(c,[[0,1],[32,-16],[27,25],[0,42]],color2)
    shape(c,[[-31,-16],[0,1],[31,-16]],pearl+'99',1)
    shape(c,[[0,1],[0,41]],pearl+'6a',1)
  }

  demos['17-E2'] = (c,t) => {
    const pairs=[[coral,'#a33249'],[gold,'#9b572a'],[mint,'#14715e'],[cyan,'#155a9c'],[violet,'#493aa4'],[pink,'#8a3678']]
    const original=1-ease(t,.29,.54)
    pose(c,240,136,1.5,.12*t,()=>prism(c,pearl,'#a3a6ce'),original)
    pairs.forEach(([bright,deep],i)=>{
      const p=out(t,.18+i*.085,.57+i*.076)
      pose(c,mix(240,133+i%3*108,p),mix(136,i<3?80:183,p),.16+.88*p,(1-p)*(-1.12+i*.39),()=>prism(c,bright,deep),p)
    })
    halo(c,240,136,125,pearl,phase(t,.27,.61))
  }

  demos['17-E3'] = (c,t) => {
    const xs=[126,239,352]
    const route=curve([47,183],[435,172],72)
    trace(c,route,1,'#a1d8ff41',1.1)
    xs.forEach((x,i)=>{
      const p=ease(t,.18+i*.14,.39+i*.16)
      const y=route[Math.round((x-47)/(435-47)*32)][1]
      pose(c,x,y,.8+.2*p,Math.PI/4,()=>{
        rect(c,-26,-26,52,52,11,ink,[cyan,violet,mint][i])
        rect(c,-17,-17,34,34,8,[cyan,violet,mint][i]+'33')
      })
    })
    for(let i=0;i<3;i++){
      const p=(t-.08-i*.135)/.52
      signal(c,route,p,[cyan,violet,mint][i],6)
      if(p>1) {
        const q=out(t,.6+i*.135,.75+i*.105)
        diamond(c,421-i*12,173+i*18,10*q,[cyan,violet,mint][i])
      }
    }
  }

  demos['18-G'] = (c,t) => {
    const outer=[[240,49],[130,187],[350,187]]
    const hub=[240,136]
    outer.forEach(([x,y],i)=>{
      const color=[violet,cyan,mint][i]
      const p=out(t,.05+i*.1,.52+i*.1)
      const path=curve([x,y],hub,i%2?21:-18)
      trace(c,path,p,color,2)
      signal(c,path,(t-.19-i*.10)/.40,color,4)
      node(c,x,y,17,color,p>.3)
      const side=curve([x,y],outer[(i+1)%3],9)
      trace(c,side,ease(t,.42+i*.08,.81+i*.08),color+'56',1)
    })
    const p=out(t,.44,.86)
    pose(c,...hub,.24+.76*p,(1-p)*1.4,()=>prism(c,pearl,'#6266dd'))
    halo(c,...hub,73,pearl,phase(t,.68,.98))
  }

  function pointer(c,color) {
    const coords=[[0,0],[11,42],[20,27],[37,21]]
    shape(c,coords,color)
    shape(c,[...coords,coords[0]],pearl,1.2)
  }

  demos['18-E1'] = (c,t) => {
    const left=[139,149], right=[340,133]
    const route=curve(left,right,35)
    const p=out(t,.03,.50),q=out(t,.13,.58),r=ease(t,.39,.83)
    trace(c,route,r,pearl,2.2)
    ;[left,right].forEach(([x,y],i)=>{
      const color=i?pink:cyan
      node(c,x,y,22,color,true)
      const slide=i?q:p
      pose(c,x+mix(i?119:-94,4,slide),y+mix(65,8,slide),1.06,-.15+.2*slide,()=>pointer(c,color))
      halo(c,x,y,49,color,phase(t,.50+i*.08,.83+i*.08))
    })
    signal(c,route,(t-.49)/.36,gold,5)
  }

  demos['18-E2'] = (c,t) => {
    const pts=[[93,150],[173,82],[290,194],[389,106]]
    const colors=[cyan,violet,pink,mint]
    for(let i=0;i<pts.length-1;i++){
      const route=curve(pts[i],pts[i+1],i===1?-16:11)
      trace(c,route,1,colors[i]+'55',1)
      trace(c,route,ease(t,.08+i*.18,.36+i*.18),colors[i],4)
      signal(c,route,(t-.10-i*.18)/.26,pearl,4.9)
    }
    pts.forEach(([x,y],i)=>{
      const color=colors[i]
      const p=out(t,.14+i*.17,.37+i*.18)
      node(c,x,y,13+15*p,color,p>.2)
      halo(c,x,y,55,color,phase(t,.19+i*.17,.45+i*.17))
    })
    burst(c,389,106,mint,phase(t,.70,1),9,43)
  }

  function medal(c, p, radius=41) {
    const r=radius
    shape(c,[[-r*.73,r*.28],[-r*.05,r*.66],[-r*.32,r*1.50],[-r*.56,r*1.27],[-r*.92,r*1.34]],coral)
    shape(c,[[r*.73,r*.28],[r*.05,r*.66],[r*.32,r*1.50],[r*.56,r*1.27],[r*.92,r*1.34]],'#d74d80')
    dot(c,0,0,r,gradient(c,-r,-r,r,r,pearl,gold,'#dd8148'))
    arc(c,0,0,r*.83,0,tau,'#ae5b31',1.4)
    arc(c,0,0,r*.72,-1.9,1.75,pearl,.9)
    star(c,0,0,r*.56,gold,5,.42)
    check(c,0,0,r*.29,p,'#7c432f',2.8)
  }

  demos['19-G'] = (c,t) => {
    const cx=238,cy=139
    for(let i=0;i<5;i++){
      const a=-Math.PI/2+i*tau/5
      const p=ease(t,.04+i*.08,.42+i*.08)
      arc(c,cx,cy,83,a,a+p*.91*tau/5,[cyan,blue,violet,pink,gold][i],6)
      dot(c,cx+83*Math.cos(a),cy+83*Math.sin(a),4,pearl)
    }
    const q=out(t,.47,.83)
    pose(c,cx,cy-6,1.15*q,(1-q)*(-.41),()=>medal(c,q))
    burst(c,cx,cy,gold,phase(t,.65,.99),14,106)
  }

  demos['19-E1'] = (c,t) => {
    const route=curve([110,142],[325,142],43)
    const p=ease(t,.05,.73)
    trace(c,route,1,gold+'44',1)
    pose(c,mix(110,325,p),142-43*Math.sin(Math.PI*p),1.13-.32*p,-.39+.39*p,()=>{
      arc(c,-20,0,19,0,tau,gold,6)
      shape(c,[[0,0],[47,0],[47,13],[35,13],[35,4],[22,4],[22,11]],gold,6)
      dot(c,-20,0,5,pearl)
    },1-ease(t,.62,.76))
    const q=out(t,.60,.92)
    arc(c,325,142,56,0,tau,cyan+'76',2)
    pose(c,325,142,q,0,()=>{
      dot(c,0,0,43,gradient(c,-43,-43,43,43,cyan,blue))
      shape(c,[[-11,-19],[22,0],[-11,19]],pearl)
    })
    halo(c,325,142,71,cyan,phase(t,.70,.99))
  }

  demos['19-E2'] = (c,t) => {
    const colors=[cyan,violet,mint]
    for(let i=0;i<3;i++){
      const p=ease(t,.025+i*.10,.50+i*.12)
      const y=68+63*i, x=80
      rect(c,x,y-5,278,10,5,colors[i]+'35')
      rect(c,x,y-5,278*p,10,5,gradient(c,x,y,358,y,colors[i]+'45',colors[i]))
      dot(c,x+278*p,y,6.6,pearl)
      const start=.51+i*.12, q=out(t,start,start+.20)
      pose(c,358+33*q,y-8*Math.sin(Math.PI*q),q*.45,(1-q)*1.8,()=>medal(c,q))
      halo(c,391,y,34,gold,phase(t,start+.06,start+.24))
    }
  }

  demos['19-E3'] = (c,t) => {
    const pts=[[66,176],[149,101],[231,171],[337,108]]
    const colors=[cyan,mint,violet,gold]
    for(let i=0;i<3;i++) {
      const route=curve(pts[i],pts[i+1],i%2?20:-14)
      trace(c,route,1,colors[i]+'37',1)
      trace(c,route,ease(t,.07+i*.18,.39+i*.18),colors[i],3.2)
      signal(c,route,(t-.08-i*.18)/.31,pearl,4)
    }
    pts.slice(0,3).forEach(([x,y],i)=>{
      const q=out(t,.03+i*.18,.30+i*.18)
      arc(c,x,y,14+6*q,0,tau,colors[i],2)
      star(c,x,y,10*q,colors[i])
    })
    const p=out(t,.56,.94)
    pose(c,337,108,1.16*p,.2*(1-p),()=>medal(c,p))
    burst(c,337,108,gold,phase(t,.76,1),13,78)
  }

  // Matrizes visuais compostas por recortes e texturas vetoriais.
  const pigments=[
    ['#ff875e','#ab2055',pearl], ['#a699ff','#363998',ice],
    ['#6de9b3','#12646c',gold], ['#ffd97c','#a74830','#362251'],
    ['#f69ac0','#652865',ice], ['#65d7ff','#184a93',pearl],
    ['#ef8e73','#693f7c',gold], ['#d3ecff','#155f80',mint]
  ]
  function printTile(c, x, y, w, h, i) {
    if (w<=0 || h<=0) return
    const [light,dark,mark]=pigments[i%pigments.length]
    c.save()
    c.beginPath()
    c.roundRect(x,y,w,h,Math.min(7,w*.08,h*.08))
    c.clip()
    rect(c,x,y,w,h,0,gradient(c,x,y,x+w,y+h,light,dark))
    c.translate(x+w*.5,y+h*.5)
    c.scale(w/100,h/100)
    switch (i%8) {
      case 0:
        dot(c,2,-11,23,mark)
        shape(c,[[-55,45],[-16,1],[8,33],[27,9],[56,46],[56,56],[-55,56]],dark)
        for(let j=0;j<4;j++) shape(c,[[-47,36+j*7],[44,36+j*7]],light,1)
        break
      case 1:
        for(let j=0;j<5;j++) arc(c,-14,25,12+j*12,-2.9,1.7,mark,1.5)
        star(c,24,-25,17,mark)
        break
      case 2:
        for(let j=0;j<9;j++) {
          const a=j*tau/9
          c.save()
          c.rotate(a)
          c.beginPath()
          c.ellipse(0,-22,7,20,.10,0,tau)
          c.fillStyle=j%2?mark:dark
          c.fill()
          c.restore()
        }
        dot(c,0,0,9,mark)
        break
      case 3:
        c.rotate(-.35)
        for(let j=0;j<6;j++) rect(c,-40,-42+16*j,81,7,3,j%2?mark:pearl)
        break
      case 4:
        for(let j=0;j<4;j++) {
          diamond(c, -3+j*9, 4-j*10, 39-j*6,j%2?dark:mark)
        }
        break
      case 6:
        for(let j=0;j<6;j++) for(let k=0;k<6;k++) {
          dot(c,-38+k*15,-38+j*15,1.3+Math.hypot(k-2.5,j-2.5)*1.15,mark)
        }
        star(c,0,0,27,dark,5,.47)
        break
      case 7:
        shape(c,[[-50,-25],[49,5],[-50,36]],mark)
        shape(c,[[-52,-13],[5,5],[-52,24]],dark)
        arc(c,-7,0,27,0,tau,pearl,1.7)
        break
      default:
        for(let j=0;j<10;j++) dot(c,-43+seed(j+17)*87,-43+seed(j+70)*84,2+seed(j)*5,j%3?mark:dark)
        arc(c,0,0,32,-.7,4.8,mark,1.7)
    }
    c.restore()
  }

  demos['20-G'] = (c,t) => {
    for(let j=0;j<3;j++) for(let i=0;i<5;i++){
      const p=out(t,.02+(i+j)*.075,.32+(i+j)*.075)
      const x=76+i*67,y=49+j*59
      if(p<=0) continue
      c.save()
      c.beginPath()
      c.rect(x,y,61*p,52)
      c.clip()
      printTile(c,x,y,61,52,(i+j*5)%6)
      c.restore()
      if(p<1) shape(c,[[x+61*p,y],[x+61*p,y+52]],pearl,2.5)
    }
  }

  demos['20-E1'] = (c,t) => {
    const p=ease(t,.055,.92)
    pose(c,240,135,mix(3.9,1,p),.10*(1-p),()=>{
      for(let j=0;j<3;j++) for(let i=0;i<5;i++){
        printTile(c,-169+i*69,-91+j*62,63,56,i===2&&j===1?2:(j*5+i+1)%6)
      }
    })
  }

  demos['20-E2'] = (c,t) => {
    const sizes=[[60,40,111,87],[178,40,60,87],[245,40,111,87],[363,40,60,87],[60,134,61,96],[128,134,122,96],[257,134,62,96],[326,134,97,96]]
    const order=[0,3,4,1,6,2,7,5]
    sizes.forEach(([x,y,w,h],i)=>{
      const p=out(t,.03+order[i]*.065,.31+order[i]*.064)
      pose(c,x+w/2,y+h/2,.58+.42*p,0,()=>printTile(c,-w/2,-h/2,w,h,i),p)
    })
  }

  demos['20-E3'] = (c,t) => {
    const p=ease(t,.02,1)
    c.save()
    c.globalAlpha=.55
    for(let i=0;i<9;i++) printTile(c,-15+i*74-137*p,52,66,51,i+2)
    c.restore()
    for(let i=0;i<9;i++) printTile(c,-65+i*101-307*p,111,92,105,i)
  }

  demos['21-G'] = (c,t) => {
    const reveal=ease(t,.05,.46),pull=ease(t,.44,.91)
    const x=mix(126,174,pull), y=mix(46,72,pull), w=mix(228,132,pull), h=mix(178,126,pull)
    c.save()
    c.beginPath()
    c.rect(x,y,w,h*reveal)
    c.clip()
    printTile(c,x,y,w,h,1)
    c.restore()
    if(reveal<1) shape(c,[[x,y+h*reveal],[x+w,y+h*reveal]],ice,3)
    const surrounds=[[90,72,74,57],[90,138,74,60],[316,72,74,57],[316,138,74,60]]
    surrounds.forEach(([x,y,w,h],i)=>{
      const p=out(t,.49+i*.065,.84+i*.042)
      pose(c,x+w/2,y+h/2,.3+.7*p,.22*(i-1.5)*(1-p),()=>printTile(c,-w/2,-h/2,w,h,i+2),p)
    })
  }

  demos['21-E1'] = (c,t) => {
    const p=ease(t,.13,.73),q=ease(t,.49,.89)
    const x1=mix(143,240,p),x2=mix(340,240,p)
    pose(c,x1,mix(146,135,p),mix(1.21,1.47,p),-.22*(1-p),()=> {
      dot(c,0,0,49,gradient(c,-49,-49,49,49,blue,violet))
      shape(c,[[-35,18],[-12,-35],[8,-23],[33,20],[15,43],[-13,37]],pearl)
    })
    pose(c,x2,mix(146,135,p),1.08,.22*(1-p),()=> {
      arc(c,0,0,63,-1.4,4.9,cyan,2.3)
      arc(c,0,0,49,-2.1,3.6,cyan,1.2)
      star(c,37,-32,17,pink)
    })
    if(q>0) {
      arc(c,240,135,91,-Math.PI/2,-Math.PI/2+q*tau,ice,2)
      star(c,292,92,23*q,gold)
    }
    burst(c,240,135,pearl,phase(t,.62,.94),10,111)
  }

  function bottle(c) {
    rect(c,-10,-57,20,22,3,gradient(c,-10,-57,10,-57,'#252943',pearl,'#252943'))
    rect(c,-24,-37,48,81,12,gradient(c,-24,-37,24,34,'#141e37','#4eb7c6','#172b52'),ice)
    rect(c,-17,-10,34,33,2,pearl)
    star(c,0,6,11,ink)
    shape(c,[[-17,-25],[-18,-18],[-18,33]],ice,1.4)
  }

  demos['21-E2'] = (c,t) => {
    const p=phase(t,.06,.94)
    printTile(c,115,53,250,164,2)
    ;[5,4].forEach((scene,i)=>{
      const reveal=ease(p,.19+i*.39,.40+i*.39)
      if(reveal<=0) return
      c.save()
      c.beginPath()
      c.rect(115,53,250*reveal,164)
      c.clip()
      printTile(c,115,53,250,164,scene)
      c.restore()
      if(reveal<1) shape(c,[[115+250*reveal,55],[115+250*reveal,215]],ice+'80',1)
    })
    pose(c,240,141,1.39,0,()=>bottle(c))
    const x=mix(219,257, Math.sin(t*tau)*.5+.5)
    star(c,x,86,7+4*Math.sin(t*tau),pearl)
  }

  demos['21-E3'] = (c,t) => {
    for(let i=0;i<8;i++){
      const p=out(t,.025+i*.056,.31+i*.057)
      const lit=Math.max(0,1-Math.abs(t-(.24+i*.085))/.13)
      const x=103+i%4*91, y=i<4?84:180
      pose(c,x,y,(.48+.52*p)*(1+.14*lit),.2*(i%2?1:-1)*(1-p),()=>{
        printTile(c,-38,-35,76,70,i)
        if(lit>.55) arc(c,29,-24,11,-2.6,-2.6+lit*4,pearl,1.9)
      },p)
    }
  }
  // Percursos, encaixes e recomposição.
  demos['22-G'] = (c,t) => {
    const pts=[[78,136],[168,92],[267,170],[381,123]]
    const colors=[violet,cyan,mint,gold]
    for(let i=0;i<3;i++) {
      const path=curve(pts[i],pts[i+1],i===1?-11:17)
      trace(c,path,ease(t,.12+i*.13,.50+i*.13),colors[i],2.6)
      signal(c,path,(t-.18-i*.15)/.34,pearl,4.6)
    }
    pts.slice(0,3).forEach(([x,y],i)=>{
      const p=out(t,.02+i*.13,.32+i*.14)
      pose(c,x,y,p,-.18*(1-p),()=>node(c,0,0,17,colors[i],true))
    })
    const p=out(t,.60,.91)
    pose(c,...pts[3],p*.84,.27*(1-p),()=>{
      sheet(c,gradient(c,-34,-49,34,49,pearl,gold),'#935849')
      check(c,9,31,9,p,ink,2.5)
    })
    burst(c,381,123,gold,phase(t,.76,1),8,68)
  }

  demos['22-E1'] = (c,t) => {
    const p=ease(t,.09,.72)
    const q=ease(t,.57,.92)
    const route=curve([237,47],[237,151],-10)
    trace(c,route,p,violet+'72',1.2)
    shape(c,[[82,151],[212,151]],cyan+'55',2.5)
    shape(c,[[265,151],[396,151]],mint+'55',2.5)
    node(c,82,151,17,cyan,true)
    node(c,396,151,17,mint,true)
    pose(c,239,mix(50,151,p),1.03,(1-p)*Math.PI*.25,()=>{
      rect(c,-23,-23,46,46,9,gradient(c,-23,-23,23,23,violet,blue),ice)
      diamond(c,0,0,13,ice)
    })
    trace(c,[[100,151],[215,151]],q,cyan,3)
    trace(c,[[264,151],[378,151]],q,mint,3)
    halo(c,239,151,55,violet,phase(t,.61,.96))
  }

  demos['22-E2'] = (c,t) => {
    const anchors=[[105,175],[191,91],[286,171],[377,121]]
    const colors=[pink,violet,cyan]
    anchors.slice(0,3).forEach(([x,y],i)=>{
      arc(c,x,y,29,-Math.PI*.7+i*.7,Math.PI*1.24+i*.7,colors[i],2.2)
      arc(c,x,y,36,-Math.PI*.6+i*.7,-Math.PI*.22+i*.7,colors[i]+'7a',1.1)
      const p=out(t,.13+i*.16,.40+i*.16)
      check(c,x,y,11,p,colors[i],3)
      const route=curve(anchors[i],anchors[i+1],-10+10*i)
      trace(c,route,1,colors[i]+'4a',1.1)
      signal(c,route,(t-.17-i*.16)/.21,pearl,6)
    })
    const q=out(t,.62,.91)
    pose(c,377,121,q,-.1,()=>{
      prism(c,ice,'#207e92')
      star(c,0,12,15,pearl)
    })
  }

  demos['22-E3'] = (c,t) => {
    const scan=ease(t,.09,.65)
    pose(c,146,138,1.22,-.08,()=>{
      sheet(c,pearl,'#7b8398',0)
      for(let i=0;i<5;i++) rect(c,-21,-24+i*11,39-(i%2)*10,3,1,i<scan*5?'#5750d1':'#adb2c6')
      const y=mix(-39,38,scan)
      shape(c,[[-34,y],[34,y]],violet,2.4)
    })
    for(let i=0;i<3;i++){
      const p=ease(t,.24+i*.12,.59+i*.12)
      const x=mix(152,331,p)
      const y=mix(110+i*11,90+i*45,p)
      const colors=[violet,cyan,mint]
      const path=curve([184,115+i*12],[331,y],12)
      trace(c,path,p,colors[i]+'46',1.2)
      pill(c,x,y,mix(9,91,p),mix(5,12,p),colors[i])
      if(p>.9) dot(c,384,y,3.5,pearl)
    }
  }

  demos['23-G'] = (c,t) => {
    const p=ease(t,.08,.77)
    const w=mix(254,109,p),h=mix(128,180,p)
    const x=240-w/2,y=135-h/2
    c.save()
    c.beginPath()
    c.roundRect(x,y,w,h,18)
    c.clip()
    rect(c,x,y,w,h,0,gradient(c,x,y,x+w,y+h,'#1a497b',blue,violet))
    for(let i=0;i<7;i++) arc(c,240,186,18+i*15,-3.9,-.15,ice+'77',1.4)
    star(c,240,117,34,pearl)
    c.restore()
    rect(c,x,y,w,h,18,'#00000000',ice)
    const q=out(t,.72,.92)
    pose(c,x+w+17,135,1.1*q,0,()=>{
      dot(c,0,0,20,mint)
      check(c,0,0,9,q,ink,3.5)
    })
  }

  demos['23-E1'] = (c,t) => {
    const p=ease(t,.13,.68)
    const path=curve([100,138],[338,138],52)
    trace(c,path,1,blue+'60',1.2)
    for(let i=0;i<7;i++) {
      const q=ease(t,.04+i*.045,.53+i*.046)
      const x=mix(85+i*11,336+22*Math.cos(i*tau/7),q)
      const y=mix(138,138+22*Math.sin(i*tau/7),q)-36*Math.sin(q*Math.PI)
      dot(c,x,y,mix(3.6,5.4,q),i%2?cyan:pearl)
    }
    arc(c,338,138,59,-Math.PI/2,-Math.PI/2+p*tau,cyan,2.3)
    const q=out(t,.62,.94)
    star(c,338,138,q*34,mint)
    halo(c,338,138,72,mint,phase(t,.74,1))
  }

  demos['23-E2'] = (c,t) => {
    const colors=[violet,pink,cyan]
    const chosen=[true,false,true]
    for(let i=0;i<3;i++) {
      const p=ease(t,.24+i*.085,.64+i*.085)
      const x=mix(122+i*118,chosen[i]?183+i*56:241,p)
      const y=mix(131,chosen[i]?105:213,p)
      pose(c,x,y,1-.13*p,(1-p)*(.17-i*.17),()=>{
        shape(c,[[0,-43],[41,-4],[32,-4],[32,34],[-32,34],[-32,-4],[-41,-4]],gradient(c,-36,-36,36,38,colors[i],ink))
        shape(c,[[0,-43],[41,-4],[32,-4],[32,34],[-32,34],[-32,-4],[-41,-4],[0,-43]],colors[i],2)
        diamond(c,0,-2,12,pearl)
      },chosen[i]?1:1-.71*p)
    }
    const q=ease(t,.65,.92)
    trace(c,[[151,138],[151,166],[326,166],[326,138]],q,mint,2.4)
    halo(c,240,166,50,mint,phase(t,.79,1))
  }

  demos['23-E3'] = (c,t) => {
    const points=[[104,138],[212,138],[320,138]]
    points.forEach(([x,y],i)=>{
      const p=ease(t,.05+i*.14,.28+i*.15)
      arc(c,x,y,34,0,tau,cyan+'43',1.7)
      arc(c,x,y,34,-Math.PI/2,-Math.PI/2+p*tau,[cyan,violet,mint][i],3.2)
      check(c,x,y,16,p,pearl,3.7)
      halo(c,x,y,55,cyan,phase(t,.19+i*.14,.45+i*.15))
    })
    const q=out(t,.62,.95)
    pose(c,369,93-17*q,q,0,()=>{
      dot(c,0,0,18,pink)
      star(c,0,0,11,pearl)
    })
  }

  demos['23-E4'] = (c,t) => {
    for(let i=0;i<3;i++) {
      const y=79+i*56
      const color=[cyan,violet,pink][i]
      const p=phase(t,.045+i*.11,.73+i*.085)
      shape(c,[[80,y],[404,y]],color+'34',1)
      const q=(p<.50?smooth(p*2)*.5:.5+smooth((p-.5)*2)*.5)
      const x=mix(107,371,q)
      const angle=(Math.sin(tau*p))*Math.PI*.25
      pose(c,x,y,1,angle,()=>{
        rect(c,-24,-15,48,30,7,gradient(c,-24,-15,24,15,pearl,color))
        for(let j=0;j<3;j++) dot(c,-10+j*10,0,2.1,ink)
      })
    }
    for(let i=0;i<3;i++) {
      for(let j=0;j<3;j++) arc(c,107+i*132,79+j*56,24,-.30,1.26,'#afc8f879',1)
    }
  }

  demos['24-G'] = (c,t) => {
    const y=147
    const path=curve([65,y],[408,y],-29)
    const p=ease(t,.06,.89)
    trace(c,path,1,blue+'5b',1.3)
    trace(c,path,p,cyan,3.1)
    signal(c,path,p,pearl,6)
    for(let i=0;i<4;i++) {
      const [x,yy]=path[6+i*7]
      dot(c,x,yy,5.7,cyan)
    }
    const q=out(t,.36,.61),r=ease(t,.62,.91)
    pose(c,250,87-14*q,1.03*q,0,()=>{
      dot(c,0,0,30,gradient(c,-30,-30,30,30,violet,blue))
      if(r<.5) type(c,'?',0,0,32,pearl)
      else star(c,0,0,21,pearl)
    })
    if(q>0) trace(c,[[249,151],[249,104]],q,violet,1.8)
    halo(c,250,73,51,violet,phase(t,.68,1))
  }

  demos['24-E1'] = (c,t) => {
    const p=out(t,.07,.45),q=out(t,.43,.89)
    const path=curve([132,134],[342,134],21)
    trace(c,path,1,violet+'45',1)
    trace(c,path,ease(t,.30,.81),violet,2)
    pose(c,132,133,.89+.16*p,0,()=>{
      arc(c,0,0,41,0,tau,violet,3.2)
      type(c,'?',0,0,47,violet)
    })
    signal(c,path,(t-.36)/.43,pearl,5)
    pose(c,343,134,q,0,()=>{
      dot(c,0,0,48,gradient(c,-48,-48,48,48,cyan,blue))
      shape(c,[[-11,-21],[25,0],[-11,21]],pearl)
      arc(c,0,0,54,-1.3,2.5,ice,1.7)
    })
  }

  demos['24-E2'] = (c,t) => {
    const p=ease(t,.06,.49),q=ease(t,.45,.9)
    for(let i=0;i<4;i++) {
      const selected=i===1
      pose(c,mix(105+i*90,selected?240:105+i*90,p),mix(144,selected?130:157,p),mix(1,selected?1.7:.75,p),(.25-i*.18)*(1-p),()=>{
        printTile(c,-34,-51,68,102,i+3)
      },selected?1-q:1-p)
    }
    for(let i=0;i<4;i++) {
      const r=out(q,.08+i*.13,.57+i*.14)
      pose(c,mix(240,113+i*84,r),mix(135,164-(i%2)*59,r),.68+.32*r,0,()=>diamond(c,0,0,21,[gold,pink,violet,mint][i]),r)
    }
    const pts=[[113,164],[197,105],[281,164],[365,105]]
    trace(c,pts,ease(t,.61,.92),pearl,1.8)
  }

  demos['24-E3'] = (c,t) => {
    const p=ease(t,.15,.73)
    const routes=[[[92,139],[155,139],[231,101]],[[248,177],[320,139],[389,139]]]
    routes.forEach((path,i)=>{
      const color=[coral,mint][i]
      const moved=path.map(([x,y])=>[x,mix(y,139,p)])
      trace(c,moved,1,color+'3b',9)
      trace(c,moved,1,color,3)
      const [x,y]=moved[i===0?0:2]
      dot(c,x,y,5,color)
    })
    pose(c,240,139,1.18+.16*Math.sin(p*Math.PI),0,()=>{
      const color=p<.52?coral:mint
      dot(c,0,0,31,gradient(c,-30,-30,30,30,ink,'#152f48'))
      arc(c,0,0,31,0,tau,color,2.6)
      arc(c,0,0,23,-2.6,.7,ice+'56',1)
      if(p<.52) {
        shape(c,[[0,-12],[0,3]],color,4)
        dot(c,0,12,2.6,color)
      } else check(c,0,0,12,ease(p,.52,.94),color,4)
    })
    halo(c,240,135,66,mint,phase(t,.72,1))
  }
  // Volume, classificação, excesso de sinais e mudança de estado.
  demos['RM26-13-01'] = (c,t) => {
    for(let i=0;i<18;i++){
      const p=out(t,.025+i*.035,.29+i*.037)
      const x=129+i*3.2+(seed(i)-.5)*21
      const y=191-i*5.3
      pose(c,x,mix(y-121,y,p),.78,.27*(seed(i+30)-.5),()=>{
        sheet(c,i%3===0?ice:i%3===1?violet:pearl,'#433e71',2)
      },p)
    }
    const p=out(t,.07,.91)
    type(c,Math.round(500*p),317,133,70,ice)
    rect(c,243,178,148*p,4,2,cyan)
    if(p>.86) star(c,398,106,19*phase(p,.86,1),mint)
  }

  demos['RM26-13-02'] = (c,t) => {
    const p=ease(t,.04,.80)
    const funnel=[[87,56],[237,108],[308,117],[308,153],[237,162],[87,214]]
    shape(c,funnel,gradient(c,87,135,308,135,blue+'00',blue+'3d'))
    trace(c,funnel.slice(0,3),1,cyan,2)
    trace(c,funnel.slice(3),1,cyan,2)
    for(let i=0;i<57;i++){
      const f=clamp(p*1.52 - seed(i+8)*.52)
      const x=mix(87+seed(i)*54,304,f)
      const amp=mix(70,10,f)
      const y=135+(seed(i+91)-.5)*amp*1.7
      const color=[violet,cyan,mint][i%3]
      if(f<1) dot(c,x,y,1.25+seed(i+119)*2.1,color)
    }
    for(let i=0;i<3;i++){
      const q=out(t,.55+i*.076,.85+i*.055)
      pose(c,mix(308,342+i*31,q),mix(135,135+(i-1)*44,q),q,0,()=>star(c,0,0,14,[cyan,gold,mint][i]))
    }
  }

  demos['RM26-14-01'] = (c,t) => {
    const p=ease(t,.04,.73)
    for(let i=0;i<8;i++){
      const angle=-Math.PI/2+i*tau/8
      const q=out(t,.08+i*.068,.35+i*.075)
      const r=mix(116,58,p*.48 + .38*q)
      const x=240+Math.cos(angle+p*1.65)*r
      const y=135+Math.sin(angle+p*1.65)*r
      pose(c,x,y,q,angle*.17,()=>{
        type(c,'?',0,0,27,[violet,pink,cyan][i%3])
      },.9-.45*p)
    }
    const q=out(t,.54,.91)
    pose(c,240,135,.64+.39*q,0,()=>{
      arc(c,0,0,39,0,tau,coral,2.6)
      type(c,q>.54?'!':'?',0,0,47,q>.54?coral:pearl)
    })
    halo(c,240,135,87,coral,phase(t,.69,1))
  }

  demos['RM26-14-02'] = (c,t) => {
    const p=ease(t,.18,.75),q=out(t,.52,.91)
    for(let i=0;i<5;i++){
      const x=89+i*36
      const h=(33+63*seed(i+90))*out(t,.01+i*.035,.34+i*.05)
      const color=[violet,blue,cyan,mint,gold][i]
      const xp=mix(x,326,p),yp=mix(166-h/2,102+i*17,p)
      pose(c,xp,yp,1,Math.PI*.5*p,()=>{
        rect(c,-8,-h/2,16,h,5,gradient(c,0,-h/2,0,h/2,color,color+'30'))
      },1-.50*q)
    }
    pose(c,329,134,1.13*q,.10*(1-q),()=>{
      rect(c,-48,-63,96,126,8,gradient(c,-48,-63,48,63,pearl,'#e9b479'))
      for(let i=0;i<4;i++) {
        const p=ease(q,.12+i*.13,.57+i*.11)
        rect(c,-24,-32+i*20,(47-(i%2)*14)*p,4,2,ink+'b8')
        diamond(c,-34,-30+i*20,3,coral)
      }
    })
    star(c,390,81,19*q,gold)
  }

  demos['RM26-15-01'] = (c,t) => {
    const colors=[coral,pink,violet,cyan,gold]
    for(let i=0;i<5;i++) {
      const x=124+(i%3)*116+(i>2?58:0),y=i>2?181:92
      const pop=out(t,.03+i*.13,.24+i*.128)
      const pulse=phase(t,.12+i*.125,.45+i*.13)
      pose(c,x,y,.46+.52*pop,-.22*(1-pop),()=>{
        dot(c,0,0,31,colors[i]+'37')
        arc(c,0,0,29,0,tau,colors[i],2.5)
        type(c,'!',0,0,36,colors[i])
      },.28+.72*pop)
      halo(c,x,y,50,colors[i],pulse)
    }
  }

  demos['RM26-15-02'] = (c,t) => {
    const a=ease(t,.06,.69)
    const route=curve([117,164],[373,129],54)
    const theta=-Math.PI/2+a*tau
    arc(c,117,164,35,0,tau,coral+'77',2)
    arc(c,117,164,35,-Math.PI/2,theta,coral,4)
    shape(c,[[117,164],[117+Math.cos(theta)*21,164+Math.sin(theta)*21]],pearl,2.4)
    dot(c,117,164,4,pearl)
    const b=ease(t,.44,.92)
    trace(c,route,b,violet,3)
    signal(c,route,(t-.45)/.45,ice,5.7)
    pose(c,373,129,out(t,.72,.96),0,()=>node(c,0,0,34,mint,true))
  }

  demos['RM26-15-03'] = (c,t) => {
    const p=ease(t,.10,.73)
    const route=curve([95,146],[361,146],76)
    trace(c,route,p,gold+'89',1.8)
    pose(c,95+266*p,146-76*Math.sin(Math.PI*p),1.14,-.72*(1-p),()=>{
      c.scale(.21+.79*Math.abs(Math.cos(Math.PI*2*p)),1)
      dot(c,0,0,31,gradient(c,-31,-31,31,31,pearl,gold,'#b17040'))
      arc(c,0,0,24,0,tau,'#9c5126',1.4)
      star(c,0,0,17,'#9c5126',5,.49)
    },1-ease(t,.67,.83))
    const q=out(t,.63,.94)
    pose(c,361,142,1.14*q,.13*(1-q),()=>{
      sheet(c,pearl,ink+'84',2)
      dot(c,12,24,15,mint)
      check(c,12,24,7,q,ink,2.6)
    })
    burst(c,361,142,gold,phase(t,.72,1),12,83)
  }

  demos['RM26-15-04'] = (c,t) => {
    const pts=Array.from({length:5},(_,i)=>[93+i*71,203-i*34])
    const colors=[blue,cyan,violet,pink,gold]
    pts.forEach(([x,y],i)=>{
      const p=out(t,.02+i*.10,.27+i*.13)
      shape(c,[[x-34,y],[x+28,y],[x+42,y+11],[x-20,y+11]],colors[i]+'a8')
      shape(c,[[x-20,y+11],[x+42,y+11],[x+42,y+18],[x-20,y+18]],colors[i]+'4f')
      if(p>0) arc(c,x,y-13,4+6*p,0,tau,colors[i],1.4)
    })
    const q=phase(t,.06,.89)*4
    const i=Math.min(3,Math.floor(q)),f=q-i
    const x=mix(pts[i][0],pts[i+1][0],f)
    const y=mix(pts[i][1],pts[i+1][1],f)-15-32*Math.sin(Math.PI*f)
    star(c,x,y,15,pearl)
    halo(c,377,54,34,gold,phase(t,.83,1))
  }

  demos['RM26-15-05'] = (c,t) => {
    const colors=[violet,cyan,mint]
    for(let i=0;i<3;i++){
      const x=143+i*97
      const q=ease(t,.06+i*.14,.31+i*.14)
      const y=mix(160,131,q)
      pose(c,x,y,1,.14*(i-1),()=>{
        sheet(c,gradient(c,-34,-49,34,49,pearl,colors[i]),'#434a74',2+i)
      })
    }
    const p=ease(t,.04,.64)
    pose(c,mix(104,335,p),151-29*Math.sin(Math.PI*p),1.03,-.22,()=>{
      dot(c,0,0,32,ice+'24')
      arc(c,0,0,32,0,tau,ice,4.5)
      shape(c,[[23,22],[47,46]],ice,6.2)
    },1-ease(t,.71,.91))
    const q=out(t,.65,.92)
    star(c,336,104,33*q,gold)
    halo(c,336,104,53,gold,phase(t,.72,1))
  }

  demos['RM26-15-06'] = (c,t) => {
    const colors=[cyan,violet,mint]
    const p=out(t,.16,.76)
    for(let i=0;i<3;i++){
      const q=ease(t,.18+i*.12,.58+i*.12)
      const a=-Math.PI/2+i*tau/3 + .41*p
      const x=240+92*q*Math.cos(a),y=135+73*q*Math.sin(a)
      if(q>0) {
        shape(c,[[240,135],[x,y]],colors[i]+'66',1.8)
        node(c,x,y,16,colors[i],q>.3)
      }
      arc(c,240,135,46+i*10,a-1,a-1+q*1.36,colors[i],2)
    }
    pose(c,240,135,.75+.39*p,1.5*(1-p),()=>prism(c,ice,blue))
    burst(c,240,135,ice,phase(t,.75,1),14,104)
  }

  // Perspectiva sem câmera 3D externa.
  demos['25-G'] = (c,t) => {
    const speed=phase(t,.23,.91)
    const travel=.17*t+.73*speed**2
    const cx=240,cy=135
    const glow=c.createRadialGradient(cx,cy,0,cx,cy,125)
    glow.addColorStop(0,'#4588ff37')
    glow.addColorStop(.34,'#4789ff1c')
    glow.addColorStop(1,'#4789ff00')
    dot(c,cx,cy,125,glow)
    for(let i=0;i<96;i++){
      const a=seed(i+401)*tau
      const r=((seed(i+500)+travel*(.73+.54*seed(i+600)))%1)**2
      const length=(.014+.31*speed)*r
      const scale=225+seed(i+700)*84
      const dx=Math.cos(a)*scale,dy=Math.sin(a)*scale*.66
      const colors=[ice,cyan,blue,violet,pink]
      c.save()
      c.globalAlpha=.22+.75*r
      const color=colors[i%5]
      const head=[cx+dx*r,cy+dy*r],tail=[cx+dx*(r-length),cy+dy*(r-length)]
      shape(c,[head,tail],gradient(c,...head,...tail,color,color+'25'),mix(.8,2.9,r))
      c.restore()
    }
    for(let i=0;i<3;i++){
      const p=((i/3+travel*.86)%1)**1.85
      const r=17+230*p
      c.save()
      c.globalAlpha=.63*(1-p)
      c.beginPath()
      c.ellipse(cx,cy,r,r*.59,-.06,0,tau)
      c.strokeStyle=[cyan,blue,violet][i]
      c.lineWidth=.6+p*2.6
      c.stroke()
      c.restore()
    }
    const flash=phase(t,.56,.92)
    halo(c,cx,cy,130,ice,flash)
  }

  function extruded(c,x,y,w,d,h,index) {
    const top = [[x,y-h],[x+w,y+d-h],[x,y+2*d-h],[x-w,y+d-h]]
    const side1=[top[3],top[2],[x,y+2*d],[x-w,y+d]]
    const side2=[top[2],top[1],[x+w,y+d],[x,y+2*d]]
    const colors=[[ice,cyan,'#15509d'],['#e0c9ff',violet,'#4b3596'],['#fff1be',gold,'#aa5660'],['#c4ffdb',mint,'#237b8b']]
    const [light,mid,dark]=colors[index%4]
    shape(c,side1,gradient(c,x-w,y-h,x,y+d,mid,dark))
    shape(c,side2,gradient(c,x,y-h,x+w,y+d,dark,'#151c40'))
    shape(c,top,light)
    shape(c,[top[3],top[2],top[1]],light+'a8',1)
    for(let yy=13;yy<h-8;yy+=10){
      const a=y+d-h+yy
      shape(c,[[x-w*.76,a+d*.24],[x-w*.23,a+d*.77]],ice+'70',.9)
      shape(c,[[x+w*.18,a+d*.82],[x+w*.77,a+d*.23]],mid+'8a',.9)
    }
  }

  demos['25-E1'] = (c,t) => {
    const pivot=ease(t,.05,1)
    c.save()
    c.translate(240,142)
    c.scale(1.14,1.14)
    c.translate(-240,-142)
    for(let d=0;d<7;d++) for(let j=0;j<4;j++){
      const i=d-j
      if(i<0||i>3) continue
      const w=mix(22,28,pivot)
      const x=240+(i-j)*w,y=130+(i+j)*12
      shape(c,[[x,y-4],[x+w-2,y+9],[x,y+22],[x-w+2,y+9]],'#5559a3a8')
    }
    for(let d=0;d<7;d++) for(let j=0;j<4;j++){
      const i=d-j
      if(i<0||i>3) continue
      const idx=i+4*j
      const w=mix(22,28,pivot)
      const x=240+(i-j)*w,y=123+(i+j)*12
      const q=out(t,.035+d*.062,.52+d*.062)
      const h=(28+76*seed(idx+45))*q
      extruded(c,x,y,w*.66,8,h,idx+j)
    }
    c.restore()
  }
})()

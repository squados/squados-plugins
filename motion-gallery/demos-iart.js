(() => {
  const demos = window.motionDemos ??= Object.create(null)
  const W = 480
  const H = 270
  const tau = 2 * Math.PI
  const ink = '#101722'
  const paper = '#faf1df'
  const mint = '#a3f2c6'
  const gold = '#ffcc65'
  const coral = '#ff806e'
  const blue = '#92bcff'
  const lilac = '#bdabff'
  const muted = '#a9b6c8'

  const clamp = n => Math.max(0, Math.min(1, n))
  const mix = (a, b, p) => a + (b - a) * p
  const stage = (t, a, b) => clamp((t - a) / (b - a))
  const out = t => 1 - (1 - t) ** 3
  const smooth = t => t * t * (3 - 2 * t)
  const back = t => 1 + 2.8 * (t - 1) ** 3 + 1.8 * (t - 1) ** 2
  const frac = n => n - Math.floor(n)
  const random = n => frac(Math.sin(n * 87.22 + 41.38) * 43758.54)

  function rect(c, x, y, w, h, fill, radius = 0) {
    c.fillStyle = fill
    if (!radius) {
      c.fillRect(x, y, w, h)
      return
    }
    c.beginPath()
    c.roundRect(x, y, w, h, radius)
    c.fill()
  }
  function bg(c, fill = ink) { rect(c, 0, 0, W, H, fill) }
  function circle(c, x, y, r, fill) {
    if (r <= 0) return
    c.beginPath()
    c.arc(x, y, r, 0, tau)
    c.fillStyle = fill
    c.fill()
  }
  function ellipse(c, x, y, rx, ry, color, width = 0) {
    if (rx <= 0 || ry <= 0) return
    c.beginPath()
    c.ellipse(x, y, rx, ry, 0, 0, tau)
    if (width) {
      c.strokeStyle = color
      c.lineWidth = width
      c.stroke()
    } else {
      c.fillStyle = color
      c.fill()
    }
  }
  function stroke(c, points, color, width = 1, progress = 1) {
    if (points.length < 2 || progress <= 0) return points[0]
    const lengths = points.slice(1).map(([x, y], i) => Math.hypot(x - points[i][0], y - points[i][1]))
    let remaining = lengths.reduce((sum, length) => sum + length, 0) * progress
    let tip = points[0]
    c.beginPath()
    c.moveTo(...tip)
    for (let i = 0; i < lengths.length; i++) {
      const step = lengths[i] ? Math.min(1, remaining / lengths[i]) : 1
      tip = points[i].map((value, axis) => mix(value, points[i + 1][axis], step))
      c.lineTo(...tip)
      remaining -= lengths[i]
      if (remaining <= 0) break
    }
    c.strokeStyle = color
    c.lineWidth = width
    c.lineCap = 'round'
    c.lineJoin = 'round'
    c.stroke()
    return tip
  }
  function poly(c, points, fill) {
    c.beginPath()
    c.moveTo(...points[0])
    for (const p of points.slice(1)) c.lineTo(...p)
    c.closePath()
    c.fillStyle = fill
    c.fill()
  }
  function text(c, str, x, y, size = 18, color = paper, options = {}) {
    const { align = 'left', weight = 650, family = 'system-ui', italic = false, outline = false, max = 455 } = options
    c.font = [italic ? 'italic' : 'normal', weight, size + 'px', family].join(' ')
    c.textAlign = align
    c.textBaseline = 'middle'
    if (outline) {
      c.lineJoin = 'round'
      c.lineWidth = 1.5
      c.strokeStyle = color
      c.strokeText(str, x, y, max)
    } else {
      c.fillStyle = color
      c.fillText(str, x, y, max)
    }
  }
  function center(c, str, x, y, size, color = paper, options = {}) {
    text(c, str, x, y, size, color, { ...options, align: 'center' })
  }
  function chip(c, str, x, y, color = mint, width = 105) {
    rect(c, x, y, width, 23, color, 11)
    center(c, str, x + width / 2, y + 12, 10, ink, { max: width - 10 })
  }
  function caption(c, str, color = muted) { text(c, str, 24, 23, 11, color, { weight: 750 }) }
  function arc(c, x, y, r, progress, color, width = 4) {
    if (progress <= 0) return
    c.beginPath()
    c.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + tau * progress)
    c.lineWidth = width
    c.strokeStyle = color
    c.lineCap = 'round'
    c.stroke()
  }
  function layer(c, alpha, draw) {
    c.save()
    c.globalAlpha *= clamp(alpha)
    draw()
    c.restore()
  }
  function pose(c, x, y, sx, sy, radians, draw) {
    c.save()
    c.translate(x, y)
    c.rotate(radians)
    c.scale(sx, sy)
    draw()
    c.restore()
  }
  function crop(c, x, y, w, h, draw) {
    c.save()
    c.beginPath()
    c.rect(x, y, w, h)
    c.clip()
    draw()
    c.restore()
  }
  function grid(c, x, y, w, h, step, color) {
    for (let i = x; i <= x + w; i += step) stroke(c, [[i, y], [i, y + h]], color)
    for (let i = y; i <= y + h; i += step) stroke(c, [[x, i], [x + w, i]], color)
  }
  function cursor(c, x, y) {
    poly(c, [[x, y], [x + 4, y + 21], [x + 8, y + 14], [x + 15, y + 15]], paper)
  }
  function portrait(c, x, y, scale, t, tones = ['#2e5261', '#e6a17a', '#382927']) {
    const [shirt, skin, hair] = tones
    pose(c, x, y, scale, scale, 0, () => {
      ellipse(c, 0, 82, 49, 42, shirt)
      rect(c, -11, 32, 22, 25, skin, 5)
      circle(c, 0, 1, 31, hair)
      ellipse(c, 0, 15, 23, 26, skin)
      poly(c, [[-25, 13], [-22, -9], [13, -15], [23, 2], [2, -2], [-16, 9]], hair)
      const blink = Math.abs(Math.sin(tau * t * 1.7 + 0.3)) > 0.10
      ellipse(c, -8, 14, 2, blink ? 2 : 0.6, hair)
      ellipse(c, 8, 14, 2, blink ? 2 : 0.6, hair)
      ellipse(c, 1, 26, 5, 1 + 2.5 * Math.abs(Math.sin(tau * t * 11)), '#8b4944')
    })
  }
  function vertical(c, draw) {
    rect(c, 163, 8, 154, 254, '#566476', 9)
    crop(c, 166, 11, 148, 248, draw)
  }

  demos['ms-caption-animation'] = (c, t) => {
    bg(c, '#161e2c')
    caption(c, 'LEGENDA / KARAOKÊ')
    vertical(c, () => {
      rect(c, 166, 11, 148, 248, '#314957')
      circle(c, 245, 92, 56, '#416677')
      portrait(c, 239, 101, 1.37, t)
      rect(c, 172, 183, 136, 42, '#111b28', 7)
      const beat = clamp(t * 1.05) * 3.99
      const active = Math.floor(beat)
      const words = ['Mude', 'o', 'ritmo', 'hoje']
      const positions = [195, 218, 241, 279]
      words.forEach((word, i) => {
        const zoom = i === active ? 1 + 0.22 * Math.exp(-frac(beat) * 12) : 1
        pose(c, positions[i], 203, zoom, zoom, 0, () => center(c, word, 0, 0, 12, i === active ? '#d4ff71' : paper))
      })
    })
    stroke(c, [[333, 203], [389, 203]], mint)
    text(c, 'PALAVRA ATIVA', 333, 220, 9, mint)
  }

  demos['ms-countdown-video'] = (c, t) => {
    bg(c, '#102929')
    caption(c, 'CONTAGEM / 5 SEGUNDOS', mint)
    const remaining = Math.max(0, 5 - t * 6)
    arc(c, 240, 134, 85, 1, '#294b46', 5)
    arc(c, 240, 134, 85, remaining / 5, mint, 5)
    for (let i = 0; i < 30; i++) {
      const a = i * tau / 30
      circle(c, 240 + 98 * Math.cos(a), 134 + 98 * Math.sin(a), i % 6 ? 1 : 2, '#4a776d')
    }
    center(c, String(Math.ceil(remaining)).padStart(2, '0'), 240, 126, 67, paper, { family: 'monospace' })
    center(c, remaining ? 'SEGUNDOS' : 'AGORA', 240, 179, 12, mint)
  }

  demos['ms-lower-thirds-vertical'] = (c, t) => {
    bg(c, '#241e29')
    caption(c, 'GC / VÍDEO VERTICAL', gold)
    vertical(c, () => {
      rect(c, 166, 11, 148, 248, '#594357')
      rect(c, 172, 29, 89, 194, '#7d5c71', 40)
      portrait(c, 232, 99, 1.48, t, ['#713b54', '#e7b088', '#403052'])
      for (let i = 0; i < 3; i++) circle(c, 298, 159 + 24 * i, 5, '#ca9db8')
      const p = out(stage(t, 0.11, 0.34)) * (1 - smooth(stage(t, 0.79, 0.95)))
      crop(c, 172, 153, p * 113, 55, () => {
        rect(c, 172, 153, 112, 47, gold, 5)
        text(c, 'Lia Reis', 180, 168, 16, ink)
        text(c, 'Apresentadora', 180, 187, 10, ink)
      })
      stroke(c, [[178, 233], [258, 233]], '#c99caf', 2)
    })
    stroke(c, [[323, 172], [384, 172]], gold)
    text(c, 'ÁREA SEGURA', 323, 189, 9, gold)
  }

  function landscape(c, x, y, w, h, warm) {
    rect(c, x, y, w, h, warm ? '#bf6861' : '#3d7893')
    circle(c, x + w * 0.69, y + h * 0.32, h * 0.15, warm ? '#fbd69b' : '#dbf0c7')
    poly(c, [[x, y + h * .61], [x + w * .25, y + h * .28], [x + w * .51, y + h * .73], [x + w * .69, y + h * .48], [x + w, y + h * .77], [x + w, y + h], [x, y + h]], warm ? '#6a374d' : '#264c65')
    poly(c, [[x, y + h * .77], [x + w * .4, y + h * .53], [x + w * .72, y + h * .83], [x + w, y + h * .64], [x + w, y + h], [x, y + h]], warm ? '#3e2e43' : '#172f48')
  }

  demos['ms-short-form-video'] = (c, t) => {
    bg(c, '#181e2b')
    caption(c, 'VÍDEO / 3 BATIDAS')
    const beat = t < .34 ? 0 : t < .62 ? 1 : 2
    vertical(c, () => {
      const scales = [1, 1.46, 1.12]
      pose(c, 240, 135, scales[beat], scales[beat], 0, () => landscape(c, -75, -126, 150, 252, beat !== 0))
      if (beat === 0) rect(c, 166, 11, 148, 248, '#11172466')
      center(c, ['Você viu?', 'Olhe o topo', 'O sol voltou'][beat], 240, beat === 1 ? 202 : 143, 18, paper, { max: 128 })
    })
    const labels = ['Gancho', 'Virada', 'Payoff']
    labels.forEach((label, i) => text(c, label, 339, 105 + 30 * i, 13, beat === i ? gold : muted))
  }

  demos['ms-text-message-animation'] = (c, t) => {
    bg(c, '#22203a')
    caption(c, 'CONVERSA / CENA FICTÍCIA', lilac)
    rect(c, 118, 34, 244, 210, '#343155', 14)
    circle(c, 143, 58, 10, lilac)
    text(c, 'Nina e Ivo', 161, 58, 12)
    const bubbles = [
      ['Você viu a luz?', 202, 81, .08, blue],
      ['Vi. Era o farol!', 137, 146, .52, mint],
      ['Então vamos.', 202, 196, .74, blue],
    ]
    bubbles.forEach(([label, x, y, start, color], i) => {
      const p = out(stage(t, start, start + .13))
      layer(c, p, () => {
        const offset = (i === 1 ? -16 : 16) * (1 - p)
        rect(c, x + offset, y, 141, 33, color, 13)
        text(c, label, x + 12 + offset, y + 17, 12, ink)
      })
    })
    if (t >= .26 && t < .52) {
      rect(c, 137, 125, 53, 23, '#5c577d', 10)
      for (let i = 0; i < 3; i++) circle(c, 150 + i * 13, 136 + 2.5 * Math.sin(tau * t * 7 - i), 2.6, paper)
    }
  }

  demos['ms-audiogram'] = (c, t) => {
    bg(c, '#242239')
    caption(c, 'PODCAST / ONDA DE VOZ', lilac)
    circle(c, 240, 65, 26, '#494068')
    center(c, 'FM', 240, 65, 17, lilac)
    const voice = .24 + .76 * Math.abs(Math.sin(tau * t * 3.4))
    for (let i = 0; i < 39; i++) {
      const envelope = .26 + .74 * Math.sin(Math.PI * i / 38)
      const h = 3 + 82 * voice * envelope * (.32 + .68 * Math.abs(Math.sin(i * .61 + t * 24)))
      rect(c, 55 + 9.6 * i, 142 - h / 2, 5, h, i < t * 39 ? lilac : '#5f577d', 2)
    }
    center(c, ['Escute', 'Escute a', 'Escute a pausa'][Math.min(2, Math.floor(t * 3))], 240, 215, 28)
  }

  demos['ms-youtube-intro-outro'] = (c, t) => {
    bg(c, '#281d33')
    if (t < .42) {
      caption(c, '01 / VINHETA', coral)
      const p = back(stage(t, 0, .30))
      poly(c, [[194 - 88 * (1 - p), 104], [240 - 88 * (1 - p), 67], [240 - 88 * (1 - p), 153]], coral)
      poly(c, [[286 + 88 * (1 - p), 104], [240 + 88 * (1 - p), 67], [240 + 88 * (1 - p), 153]], gold)
      layer(c, stage(t, .22, .34), () => center(c, 'Oficina do Norte', 240, 185, 26))
      return
    }
    caption(c, '02 / TELA FINAL', coral)
    text(c, 'Continue por aqui', 36, 65, 26)
    rect(c, 38, 99, 215, 123, '#543954', 10)
    poly(c, [[130, 137], [130, 184], [176, 160]], coral)
    circle(c, 357, 151, 43, '#543954')
    chip(c, 'INSCREVA-SE', 302, 204, gold, 110)
  }

  demos['ms-photo-slideshow'] = (c, t) => {
    bg(c, '#25242f')
    caption(c, 'SLIDESHOW / PAN E ZOOM', gold)
    const fade = smooth(stage(t, .40, .59))
    crop(c, 51, 43, 378, 184, () => {
      pose(c, 240 - 27 * t, 135 + 13 * t, 1 + t * .28, 1 + t * .28, 0, () => landscape(c, -196, -103, 392, 206, false))
      layer(c, fade, () => pose(c, 221 + 25 * t, 135 - 12 * (1 - t), 1.25 - t * .13, 1.25 - t * .13, 0, () => landscape(c, -196, -103, 392, 206, true)))
    })
    text(c, fade < .5 ? '01 / Enseada fria' : '02 / Vale vermelho', 51, 245, 14)
  }

  function listScreen(c, done) {
    rect(c, 69, 60, 342, 168, '#263652', 13)
    rect(c, 69, 60, 342, 24, '#344a70', 10)
    for (let i = 0; i < 3; i++) circle(c, 84 + i * 13, 72, 3.5, blue)
    text(c, 'Minhas listas', 93, 108, 19)
    chip(c, 'Criar lista', 277, 96, mint, 103)
    for (let i = 0; i < 3; i++) rect(c, 93, 137 + i * 22, 286, 17, '#405575', 4)
    layer(c, done, () => {
      rect(c, 93, 137, 286, 17, '#3c776e', 4)
      text(c, '✓  Lista criada', 104, 146, 11)
    })
  }
  demos['ms-product-demo-video'] = (c, t) => {
    bg(c, '#162435')
    caption(c, 'DEMONSTRAÇÃO / AÇÃO E RESULTADO', blue)
    const p = out(stage(t, .07, .46))
    const zoom = 1 + .17 * p
    pose(c, 240, 141, zoom, zoom, 0, () => {
      c.translate(-240, -141)
      listScreen(c, out(stage(t, .49, .63)))
      const x = mix(147, 323, p)
      const y = mix(196, 109, p)
      const click = stage(t, .44, .61)
      if (t >= .44 && click < 1) layer(c, 1 - click, () => ellipse(c, x, y, 5 + click * 23, 5 + click * 23, gold, 2))
      cursor(c, x, y)
    })
  }

  demos['ms-promo-video'] = (c, t) => {
    bg(c, '#632d37')
    caption(c, 'OFERTA / SEMANA DA COR', gold)
    rect(c, 72, 51, 336, 168, '#ffe9d5', 19)
    center(c, 'R$ 90', 240, 88, 31, '#754854')
    stroke(c, [[181, 95], [298, 80]], '#b03c55', 3, out(stage(t, .13, .35)))
    const p = stage(t, .29, .56)
    layer(c, p, () => pose(c, 240, 149, .63 + .37 * back(p), .63 + .37 * back(p), 0, () => center(c, 'R$ 62', 0, 0, 65, '#542735')))
    const badge = out(stage(t, .53, .71))
    layer(c, badge, () => chip(c, 'SEMANA DA COR', 178, 207 - 22 * badge, gold, 124))
  }

  function organizer(c, x, y, scale) {
    pose(c, x, y, scale, scale, 0, () => {
      poly(c, [[-82, -15], [-40, -41], [88, -27], [46, 0]], '#edb88a')
      poly(c, [[-82, -15], [46, 0], [46, 48], [-82, 33]], '#b96556')
      poly(c, [[46, 0], [88, -27], [88, 21], [46, 48]], '#8d4650')
      for (let i = 0; i < 3; i++) stroke(c, [[-62 + i * 37, -17 + i * 4], [-31 + i * 37, -35 + i * 4]], '#a86454', 3)
    })
  }
  demos['ms-ad-creative-video'] = (c, t) => {
    if (t < .30) {
      bg(c, '#432d45')
      caption(c, '01 / GANCHO', lilac)
      center(c, 'Mesa sem espaço?', 240, 111, 37)
      for (let i = 0; i < 7; i++) pose(c, 100 + i * 47, 194 + 10 * Math.sin(i * 4 + t * 7), 1, 1, i * .9, () => rect(c, -20, -9, 40, 18, i % 2 ? lilac : coral, 4))
    } else if (t < .68) {
      bg(c, '#623a39')
      caption(c, '02 / BENEFÍCIO', gold)
      text(c, 'Tudo à mão', 37, 124, 31)
      organizer(c, 342, 143, 1)
    } else {
      bg(c, '#233e3c')
      caption(c, '03 / AÇÃO', mint)
      organizer(c, 240, 120, .86)
      chip(c, 'VEJA AS MEDIDAS', 166, 189, mint, 148)
    }
  }

  function lamp(c, x, y, scale) {
    pose(c, x, y, scale, scale, 0, () => {
      ellipse(c, 0, 69, 50, 9, '#171427')
      stroke(c, [[0, 62], [0, -31], [-35, -31]], '#e5ad84', 7)
      poly(c, [[-56, -44], [-17, -44], [1, -9], [-72, -9]], '#f49a70')
      ellipse(c, -36, -8, 36, 5, '#ffe1a3')
    })
  }
  demos['ms-launch-video'] = (c, t) => {
    bg(c, t < .36 ? '#332040' : '#32223e')
    caption(c, 'LUMINÁRIA / REVELAÇÃO', coral)
    if (t < .19) {
      lamp(c, 300, 221, 3.4)
    } else if (t < .36) {
      lamp(c, 173, -32, 3.05)
    } else {
      const p = out(stage(t, .36, .60))
      circle(c, 178, 131, 68 + p * 19, '#573551')
      lamp(c, 178, 132, 1.27)
      layer(c, p, () => {
        text(c, 'Lume', 281, 116, 42, paper)
        text(c, 'Uma nova luz', 283, 156, 14, gold)
      })
    }
  }

  demos['ms-testimonial-video'] = (c, t) => {
    bg(c, '#163836')
    rect(c, 49, 43, 382, 183, '#edeee0', 17)
    text(c, '“', 74, 88, 68, '#70aa92')
    layer(c, out(stage(t, .08, .25)), () => text(c, 'Encontrei o arquivo', 121, 96, 24, '#173b39'))
    const phrase = out(stage(t, .24, .46))
    rect(c, 119, 118, 157 * phrase, 28, '#b6e8bb', 4)
    layer(c, phrase, () => text(c, 'em segundos.', 122, 132, 23, '#173b39'))
    layer(c, out(stage(t, .51, .69)), () => {
      circle(c, 136, 179, 16, '#387267')
      center(c, 'A', 136, 180, 14)
      text(c, 'Ana / personagem fictícia', 162, 179, 13, '#2e5c54')
    })
  }

  demos['ms-animated-infographic'] = (c, t) => {
    bg(c, '#172b35')
    caption(c, 'COOPERATIVA / INDICADORES', mint)
    const values = [12, 38, 84]
    const names = ['Hortas', 'Canteiros', 'Voluntários']
    const colors = [mint, blue, gold]
    values.forEach((value, i) => {
      const start = .12 + i * .13
      const p = out(stage(t, start, start + .29))
      const x = 28 + 144 * i
      const y = 81 + 22 * (1 - p)
      layer(c, p, () => {
        rect(c, x, y, 136, 136, '#253f4a', 12)
        poly(c, [[x + 60, y + 36], [x + 69, y + 20], [x + 78, y + 36], [x + 69, y + 42]], colors[i])
        center(c, String(Math.round(value * p)), x + 69, y + 75, 38, colors[i])
        center(c, names[i], x + 69, y + 112, 13)
      })
    })
  }

  demos['ms-chart-animation'] = (c, t) => {
    bg(c, '#1b253d')
    caption(c, t < .50 ? 'RANKING / JANEIRO → JUNHO' : 'RANKING / JUNHO', blue)
    const progress = smooth(t)
    const reorder = smooth(stage(progress, .42, .65))
    const data = [[80, 63, 0, 1, 'Norte', blue], [56, 90, 1, 0, 'Leste', mint], [38, 49, 2, 2, 'Sul', gold]]
    data.forEach(([from, to, oldRank, newRank, name, color]) => {
      const y = 74 + 57 * mix(oldRank, newRank, reorder)
      const value = Math.round(mix(from, to, progress))
      text(c, name, 33, y + 13, 15)
      rect(c, 102, y, 295, 26, '#304064', 6)
      rect(c, 102, y, 2.95 * value, 26, color, 6)
      text(c, String(value), 410, y + 13, 17, color)
    })
  }

  demos['ms-presentation-video'] = (c, t) => {
    bg(c, '#253052')
    const slide = Math.min(2, Math.floor(t * 3))
    caption(c, 'APRESENTAÇÃO / ' + (slide + 1) + ' DE 3', blue)
    rect(c, 45, 51, 390, 172, '#eef0f9', 12)
    if (slide === 0) {
      center(c, 'Onde reduzir a fila?', 240, 138, 29, '#283657')
    } else if (slide === 1) {
      text(c, 'Tempo de espera', 65, 80, 16, '#283657')
      const p = out(stage(t, .34, .58))
      rect(c, 67, 113, 245 * p, 28, '#657bd1', 4)
      rect(c, 67, 158, 118 * p, 28, '#58b694', 4)
      text(c, 'Padrão', 320, 128, 13, '#283657')
      text(c, 'Piloto', 194, 171, 13, '#283657')
    } else {
      chip(c, 'DECISÃO', 188, 83, mint)
      center(c, 'Ampliar o piloto', 240, 145, 31, '#283657')
    }
    for (let i = 0; i < 3; i++) rect(c, 45 + 132 * i, 239, 126, 4, i <= slide ? blue : '#506386', 2)
  }

  demos['ms-diagram-animation'] = (c, t) => {
    bg(c, '#263238')
    caption(c, 'FLUXOGRAMA / PEDIDO A RESPOSTA', mint)
    const labels = ['Pedido', 'Triagem', 'Resposta']
    labels.forEach((label, i) => {
      const p = i ? out(stage(t, i * .27, i * .27 + .15)) : 1
      const x = 25 + 151 * i
      rect(c, x, 109, 127, 55, '#3a5052', 9)
      layer(c, p, () => {
        rect(c, x, 109, 127, 55, mint, 9)
        center(c, label, x + 63, 137, 16, ink)
      })
      if (i < 2) {
        const end = out(stage(t, .10 + .27 * i, .27 + .27 * i))
        stroke(c, [[x + 127, 136], [x + 149, 136]], gold, 2, end)
        if (end >= .97) poly(c, [[x + 147, 132], [x + 147, 140], [x + 151, 136]], gold)
      }
    })
  }

  demos['ms-explainer-video'] = (c, t) => {
    bg(c, '#1d373e')
    caption(c, 'ANALOGIA / FILTRO DE DADOS', mint)
    rect(c, 122, 126, 236, 18, '#47707b', 4)
    for (let i = 0; i < 18; i++) rect(c, 131 + i * 12, 132, 7, 5, '#9ccbc6', 2)
    for (let i = 0; i < 9; i++) {
      const p = stage(t, .05 + .025 * i, .60 + .028 * i)
      const x = 147 + 23 * i
      const y = mix(57 - i % 3 * 11, i % 2 ? 114 : 204, p ** 1.45)
      if (i % 2) rect(c, x - 7, y - 7, 14, 14, coral, 2)
      else circle(c, x, y, 6, mint)
    }
    stroke(c, [[116, 193], [126, 218], [355, 218], [365, 193]], '#638f95', 2)
    layer(c, out(stage(t, .65, .84)), () => center(c, 'Só o que interessa', 240, 242, 15, mint))
  }

  function tile(c, x, y, color) {
    poly(c, [[x - 95, y], [x, y - 31], [x + 95, y], [x, y + 31]], color)
    poly(c, [[x - 95, y], [x, y + 31], [x, y + 41], [x - 95, y + 10]], '#293454')
    poly(c, [[x, y + 31], [x + 95, y], [x + 95, y + 10], [x, y + 41]], '#34496d')
  }
  demos['ms-isometric-animation'] = (c, t) => {
    bg(c, '#222944')
    caption(c, 'ISOMÉTRICO / CAMADAS DO SISTEMA', lilac)
    const p = smooth(stage(t, .10, .72))
    const x = 199
    const y = 186
    const gap = 12 + 39 * p
    stroke(c, [[x - 95, y], [x - 95, y - 2 * gap]], '#7e8aac', 1)
    stroke(c, [[x + 95, y], [x + 95, y - 2 * gap]], '#7e8aac', 1)
    ;[[blue, 'Coleta'], [lilac, 'Índice'], [mint, 'Busca']].forEach(([color, label], i) => {
      const row = y - i * gap
      tile(c, x, row, color)
      layer(c, p, () => text(c, label, 319, row, 14, color))
    })
  }

  demos['ms-whiteboard-animation'] = (c, t) => {
    bg(c, '#f4efe3')
    caption(c, 'QUADRO / AVIÃO DE PAPEL', '#516c87')
    grid(c, 0, 40, W, 216, 18, '#e5e2d9')
    const path = [[115, 132], [351, 63], [249, 197], [205, 145], [351, 63], [177, 171], [205, 145], [115, 132]]
    const p = out(stage(t, .06, .82))
    const tip = stroke(c, path, '#346b96', 3.5, p)
    layer(c, 1 - stage(t, .73, .88), () => {
      poly(c, [tip, [tip[0] + 23, tip[1] + 5], [tip[0] + 17, tip[1] + 15]], '#346b96')
      stroke(c, [[tip[0] + 21, tip[1] + 10], [tip[0] + 63, tip[1] + 40]], '#585367', 9)
    })
    layer(c, stage(t, .82, .96), () => center(c, 'Dobre na diagonal', 240, 235, 16, '#346b96'))
  }

  demos['ms-wrapped-video'] = (c, t) => {
    const beat = Math.min(2, Math.floor(t * 3))
    const color = [gold, mint, lilac][beat]
    bg(c, ['#50283d', '#193f3b', '#312452'][beat])
    const p = back(clamp((t * 3 - beat) * 2.9))
    caption(c, 'SEU ANO DE LEITURA / ' + (beat + 1), color)
    for (let i = 0; i < 5; i++) ellipse(c, 240, 136, 63 + i * 29, 31 + i * 17, '#ffffff23', 1)
    pose(c, 240, 116, .58 + .42 * p, .58 + .42 * p, 0, () => center(c, ['24', '8 mil', '3'][beat], 0, 0, 84, color))
    center(c, ['livros lidos', 'páginas viradas', 'gêneros novos'][beat], 240, 201, 23)
  }

  demos['ms-map-animation'] = (c, t) => {
    bg(c, '#3d7186')
    const tick = Math.floor(t * 72) / 72
    const zoom = 1 + .35 * out(stage(tick, 0, .53))
    pose(c, 240, 136, zoom, zoom, 0, () => {
      c.translate(-240, -136)
      poly(c, [[-80, -70], [620, -70], [620, 330], [374, 330], [383, 220], [335, 194], [364, 139], [295, 106], [274, 51], [214, 64], [176, 19], [-80, 45]], '#ced0a3')
      stroke(c, [[-30, 28], [117, 39], [164, 65], [214, 64], [274, 51], [295, 106], [364, 139], [335, 194], [383, 220], [374, 330]], '#e6e0ba', 3)
      const route = [[317, 180], [294, 147], [302, 121], [251, 102], [224, 78], [188, 81]]
      c.save()
      c.setLineDash([5, 5])
      stroke(c, route, '#884449', 3, out(stage(tick, .25, .79)))
      c.restore()
      circle(c, 317, 180, 5, '#884449')
      text(c, 'Porto Baixo', 229, 196, 12, '#462d38')
      layer(c, out(stage(tick, .70, .87)), () => {
        circle(c, 188, 81, 6, '#884449')
        text(c, 'Vila Alta', 125, 92, 12, '#462d38')
      })
    })
    chip(c, 'ROTA COSTEIRA', 24, 20, paper, 112)
  }

  demos['ms-60fps-animation'] = (c, t) => {
    bg(c, '#18293c')
    caption(c, 'CADÊNCIA / MESMO PERCURSO', blue)
    const p = smooth(t)
    const steps = [Math.floor(p * 6) / 6, p]
    ;['Saltos discretos', 'Transformação contínua'].forEach((label, i) => {
      const y = 88 + i * 93
      const progress = steps[i]
      text(c, label, 52, y - 24, 12)
      stroke(c, [[52, y + 19], [428, y + 19]], '#57718a', 1)
      for (let tick = 0; tick < 7; tick++) circle(c, 66 + 55 * tick, y + 19, 2, blue)
      layer(c, .66 + .34 * progress, () => rect(c, 52 + 330 * progress, y - 7, 46, 29, i ? mint : coral, 5))
    })
  }

  demos['ms-accessible-animation'] = (c, t) => {
    bg(c, '#26322e')
    caption(c, 'ACESSIBILIDADE / DOIS MODOS', mint)
    const p = out(stage(t, .12, .58))
    const fade = stage(t, .25, .46)
    ;['Padrão', 'Movimento reduzido'].forEach((label, i) => {
      const x = 130 + i * 220
      rect(c, x - 98, 62, 196, 152, '#354944', 12)
      center(c, label, x, 84, 14)
      const scale = i ? 1 : .75 + .25 * p
      layer(c, i ? fade : p, () => pose(c, x, i ? 143 : 143 + 39 * (1 - p), scale, scale, 0, () => {
        rect(c, -74, -22, 148, 44, mint, 7)
        center(c, '✓  Salvo', 0, 0, 19, ink)
      }))
    })
  }

  demos['ms-ascii-animation'] = (c, t) => {
    bg(c, '#142923')
    caption(c, 'ASCII / MAPA DE LUZ', mint)
    const alphabet = '.:-=+*#%@'
    for (let y = -8; y <= 8; y++) {
      for (let x = -16; x <= 16; x++) {
        const sx = x / 16
        const sy = y / 8
        const radius = sx ** 2 + sy ** 2
        if (radius > 1) continue
        const z = Math.sqrt(1 - radius)
        const azimuth = tau * t
        const value = clamp((sx * Math.cos(azimuth) + z * Math.sin(azimuth) - sy * .45 + 1) * .49)
        center(c, alphabet[Math.floor(value * (alphabet.length - 1))], 240 + x * 8, 145 + y * 10, 12, value > .51 ? mint : '#578676', { family: 'monospace' })
      }
    }
  }

  function glassLights(c, t, frosted = false) {
    const colors = [coral, lilac, blue]
    const origin = [[127, 132], [248, 171], [354, 105]]
    origin.forEach(([x, y], i) => {
      const phase = t * tau + i * 2.2
      const cx = x + 32 * Math.sin(phase)
      const cy = y + 25 * Math.cos(phase)
      if (!frosted) {
        ellipse(c, cx, cy, 71, 46, colors[i])
        return
      }
      pose(c, cx, cy, 1, .68, 0, () => {
        const glow = c.createRadialGradient(0, 0, 29, 0, 0, 88)
        glow.addColorStop(0, colors[i])
        glow.addColorStop(1, colors[i] + '00')
        circle(c, 0, 0, 88, glow)
      })
    })
  }
  demos['ms-glassmorphism'] = (c, t) => {
    bg(c, '#272448')
    glassLights(c, t)
    c.save()
    c.beginPath()
    c.roundRect(108, 67, 264, 137, 21)
    c.clip()
    rect(c, 106, 66, 268, 140, '#28284e')
    glassLights(c, t, true)
    rect(c, 106, 66, 268, 140, '#22244891')
    c.restore()
    c.beginPath()
    c.roundRect(108, 67, 264, 137, 21)
    c.strokeStyle = '#ffffff9d'
    c.lineWidth = 1.2
    c.stroke()
    stroke(c, [[146, 68], [332, 68]], '#fff6e8', 2)
    text(c, 'VIDRO FOSCO', 136, 104, 11)
    text(c, 'Brilho em trânsito', 136, 147, 23)
  }

  demos['ms-gsap-web'] = (c, t) => {
    bg(c, '#292343')
    caption(c, 'ROLAGEM / CABEÇALHO FIXO', lilac)
    const p = smooth(t)
    rect(c, 57, 54, 366, 164, '#3c345f', 12)
    crop(c, 62, 88, 356, 125, () => {
      const slides = [[gold, 'Estudo'], [mint, 'Protótipo'], [lilac, 'Entrega']]
      slides.forEach(([color, name], i) => {
        const x = 72 + (i - 2 * p) * 335
        rect(c, x, 95, 317, 106, color, 9)
        text(c, String(i + 1).padStart(2, '0'), x + 22, 123, 11, ink)
        text(c, name, x + 22, 158, 32, ink)
      })
    })
    rect(c, 73, 72, 333, 3, '#716493', 1)
    rect(c, 73, 72, 333 * p, 3, lilac, 1)
    center(c, 'Progresso da rolagem', 240, 242, 12)
  }

  demos['ms-lottie-animation'] = (c, t) => {
    bg(c, '#153341')
    caption(c, 'ÍCONE / SEGMENTOS DE ANIMAÇÃO', blue)
    const p = out(stage(t, .06, .48))
    const check = stage(t, .43, .68)
    const scale = 1 + .15 * Math.sin(Math.PI * stage(t, .67, .92))
    pose(c, 240, 127, scale, scale, 0, () => {
      arc(c, 0, 0, 63, 1, '#416473', 5)
      arc(c, 0, 0, 63, p, blue, 5)
      stroke(c, [[-26, 2], [-7, 21], [28, -22]], mint, 6, check)
    })
    center(c, check >= 1 ? 'CONCLUÍDO' : 'CARREGANDO', 240, 222, 15, check >= 1 ? mint : blue)
  }

  function heart(c, x, y, fill) {
    c.beginPath()
    c.moveTo(x, y + 13)
    c.bezierCurveTo(x - 18, y, x - 14, y - 15, x - 5, y - 12)
    c.quadraticCurveTo(x, y - 11, x, y - 7)
    c.quadraticCurveTo(x, y - 11, x + 5, y - 12)
    c.bezierCurveTo(x + 14, y - 15, x + 18, y, x, y + 13)
    c.closePath()
    if (fill) {
      c.fillStyle = coral
      c.fill()
    } else {
      c.lineWidth = 2
      c.strokeStyle = muted
      c.stroke()
    }
  }
  demos['ms-micro-interaction'] = (c, t) => {
    bg(c, '#332531')
    caption(c, 'INTERAÇÃO / FAVORITAR', coral)
    const p = out(stage(t, .07, .40))
    const done = t >= .46
    const spring = stage(t, .41, .64)
    const scale = 1 - .13 * Math.sin(tau * spring) * (1 - spring)
    pose(c, 240, 136, scale, scale, 0, () => {
      rect(c, -74, -29, 148, 58, done ? '#663c4f' : '#503647', 26)
      heart(c, -28, 0, done)
      center(c, done ? '24' : '23', 23, 0, 28, done ? coral : paper)
    })
    const burst = stage(t, .46, .78)
    if (done && burst < 1) layer(c, 1 - burst, () => {
      for (let i = 0; i < 8; i++) circle(c, 210 + Math.cos(i * tau / 8) * 75 * burst, 136 + Math.sin(i * tau / 8) * 59 * burst, 3, gold)
    })
    cursor(c, mix(352, 213, p) + 25 * stage(t, .51, .75), mix(203, 142, p) + 19 * stage(t, .51, .75))
  }

  demos['ms-page-transition-animation'] = (c, t) => {
    bg(c, '#26314e')
    caption(c, 'TRANSIÇÃO / COLEÇÃO → DETALHE', blue)
    const p = smooth(stage(t, .15, .72))
    layer(c, 1 - stage(t, .13, .56), () => {
      rect(c, 49 - 28 * p, 88, 118, 103, '#446b80', 9)
      rect(c, 313 + 28 * p, 88, 118, 103, '#7b637b', 9)
      center(c, 'Costas', 108 - 28 * p, 165, 14)
      center(c, 'Dunas', 371 + 28 * p, 165, 14)
    })
    const x = mix(181, 45, p)
    const y = mix(88, 54, p)
    const w = mix(118, 390, p)
    const h = mix(103, 127, p)
    crop(c, x, y, w, h, () => landscape(c, x, y, w, h, false))
    layer(c, 1 - p, () => center(c, 'Serra', 240, 167, 14))
    layer(c, out(stage(t, .63, .86)), () => text(c, 'Serra do Poente', 47, 215, 26))
  }

  demos['ms-svg-animation'] = (c, t) => {
    bg(c, '#20263b')
    caption(c, 'VETOR / REVELAÇÃO DO TRAÇO', gold)
    const points = Array.from({ length: 126 }, (_, i) => {
      const p = i / 125
      return [72 + 334 * p + 26 * Math.sin(tau * p * 4), 134 + (1 - .64 * p) * 51 * Math.sin(tau * p * 4 + .42)]
    })
    const p = smooth(stage(t, .08, .70))
    const [x, y] = stroke(c, points, gold, 3, p)
    if (p < 1) {
      circle(c, x, y, 9, '#ffcc6550')
      circle(c, x, y, 3.5, paper)
    }
    if (t >= .72) stroke(c, [[105, 191], [370, 176]], coral, 2.5)
  }

  demos['ms-after-effects'] = (c, t) => {
    bg(c, '#2d2440')
    caption(c, 'EXPRESSÃO / OSCILAÇÃO AMORTECIDA', lilac)
    const p = out(stage(t, .04, .34))
    const settle = stage(t, .32, 1)
    const spring = x => Math.exp(-4.4 * x) * Math.sin(tau * 3.2 * x)
    const stretch = 1 + spring(settle) * .58
    stroke(c, [[55, 102], [425, 102]], '#594c70', 1)
    circle(c, 240, 102, 5, '#eee1ff66')
    pose(c, mix(58, 240, p) + 28 * spring(settle), 102, 1, stretch, 0, () => poly(c, [[-29, 0], [0, -24], [29, 0], [0, 24]], lilac))
    stroke(c, [[55, 192], [425, 192]], '#594c70', 1)
    const curve = Array.from({ length: 81 }, (_, i) => [55 + 4.5 * i, 192 - 42 * spring(i / 80)])
    stroke(c, curve, '#6f6186', 1.5)
    const [x, y] = stroke(c, curve, coral, 2.5, settle)
    circle(c, x, y, 4, coral)
    text(c, 'AMPLITUDE', 55, 235, 10, lilac)
  }

  demos['ms-animation-principles'] = (c, t) => {
    bg(c, '#403246')
    caption(c, 'FÍSICA / PREPARO, SALTO, IMPACTO', gold)
    const flight = stage(t, .22, .67)
    const anticipation = Math.sin(Math.PI * stage(t, .02, .24))
    const bounce = Math.sin(Math.PI * stage(t, .69, .88))
    const height = 107 * 4 * flight * (1 - flight) + bounce * 18
    const impact = Math.sin(Math.PI * stage(t, .63, .74))
    const stretch = 1 - anticipation * .34 + (flight > 0 && flight < .24 ? .22 * Math.sin(Math.PI * flight / .24) : 0) - impact * .33
    const x = mix(113, 363, flight) + 14 * bounce
    stroke(c, [[42, 224], [438, 224]], '#82718b', 2)
    ellipse(c, x, 224, 29 - height * .14, 5 - height * .029, '#261e32')
    ellipse(c, x, 224 - height - 26 * stretch, 26 / stretch, 26 * stretch, gold)
  }

  demos['ms-beat-sync-editing'] = (c, t) => {
    const cut = Math.min(3, Math.floor(t * 4))
    const beat = clamp(t * 4 - cut)
    const pulse = 1 + .24 * Math.exp(-beat * 12)
    const color = [mint, coral, gold, blue][cut]
    bg(c, ['#203e39', '#4d293e', '#514132', '#283c58'][cut])
    caption(c, 'MONTAGEM / 4 BATIDAS', color)
    pose(c, 240, 124, pulse, pulse, cut * .42, () => {
      if (cut === 0) circle(c, 0, 0, 51, color)
      if (cut === 1) rect(c, -43, -43, 86, 86, color, 8)
      if (cut === 2) poly(c, [[0, -60], [56, 43], [-56, 43]], color)
      if (cut === 3) poly(c, [[-58, 0], [0, -48], [58, 0], [0, 48]], color)
    })
    stroke(c, [[54, 224], [426, 224]], '#ffffff70', 1)
    for (let i = 0; i < 4; i++) circle(c, 73 + 111 * i, 224, i === cut ? 6 + 4 * (pulse - 1) : 3, i === cut ? color : muted)
    circle(c, mix(73, 406, t), 238, 2.5, paper)
  }

  demos['ms-color-motion'] = (c, t) => {
    const p = smooth(t)
    const hue = mix(225, 375, p)
    const fills = [`hsl(${hue} 36% 20%)`, `hsl(${hue + 34} 83% 65%)`, `hsl(${hue + 52} 87% 76%)`]
    bg(c, fills[0])
    caption(c, 'COR / DO FRIO AO QUENTE', paper)
    const gradient = c.createRadialGradient(224, 106, 8, 241, 127, 64)
    gradient.addColorStop(0, fills[2])
    gradient.addColorStop(1, fills[1])
    circle(c, 240, 127, 64, gradient)
    fills.forEach((fill, i) => {
      rect(c, 146 + i * 68, 213, 49, 23, paper, 5)
      rect(c, 147 + i * 68, 214, 47, 21, fill, 4)
    })
  }

  demos['ms-logo-animation'] = (c, t) => {
    bg(c, '#203739')
    caption(c, 'IDENTIDADE / ENCAIXE DO SÍMBOLO', mint)
    const parts = [[-137, -41, -27, mint], [114, -43, 27, blue], [18, 92, 0, gold]]
    parts.forEach(([x, y, target, color], i) => {
      const p = back(stage(t, .06 + .065 * i, .58))
      pose(c, 240 + mix(x, target, p), 113 + mix(y, i === 2 ? 20 : -7, p), 1, 1, (1 - p) * (i - 1) * 3.2, () => poly(c, [[-26, 0], [0, -23], [26, 0], [0, 23]], color))
    })
    const ring = stage(t, .52, .74)
    if (t >= .52 && ring < 1) layer(c, 1 - ring, () => ellipse(c, 240, 117, 52 + 27 * ring, 44 + 27 * ring, mint, 2))
    layer(c, out(stage(t, .58, .80)), () => center(c, 'Orla', 240, 191, 38))
  }

  demos['ms-motion-art-direction'] = (c, t) => {
    bg(c, '#262838')
    caption(c, 'DIREÇÃO / MESMA FORMA, OUTRO RITMO')
    const names = ['Contido', 'Enérgico']
    names.forEach((name, mode) => {
      const x = 128 + 224 * mode
      rect(c, x - 101, 56, 202, 167, mode ? '#512e45' : '#243d60', 10)
      center(c, name, x, 202, 15, mode ? coral : blue)
      for (let i = 0; i < 3; i++) {
        const p = mode ? back(stage(t, .11 + .10 * i, .43 + .10 * i)) : smooth(stage(t, .08, .71))
        pose(c, x + (i - 1) * 43, 122 + (1 - p) * (mode ? 51 : 19), 1, 1, mode ? (1 - p) * -.9 + .17 : 0, () => rect(c, -14, -30, 28, 61, mode ? coral : blue, 5))
      }
    })
  }

  demos['ms-motion-background'] = (c, t) => {
    bg(c, '#141c33')
    const colors = ['#5ab3a748', '#7766c166', '#9df9be38']
    colors.forEach((color, i) => {
      const band = Array.from({ length: 29 }, (_, k) => {
        const x = k * 18
        return [x, 91 + i * 23 + 26 * Math.sin(x * .016 + tau * t * (i + 1) + i)]
      })
      poly(c, [...band, ...band.slice().reverse().map(([x, y]) => [x, y + 39 + 12 * Math.sin(x * .012)])], color)
    })
    for (let i = 0; i < 40; i++) circle(c, 480 * random(i), 270 * random(i + 97), .7, '#dcecf277')
    text(c, 'Aurora lenta', 42, 213, 28)
  }

  demos['ms-remotion-video'] = (c, t) => {
    bg(c, '#183c41')
    caption(c, 'COMPOSIÇÃO / TEMPO POR FRAME', mint)
    const frame = Math.min(119, Math.floor(120 * t))
    const card = back(out(stage(frame, 0, 31)))
    const value = out(stage(frame, 18, 86))
    pose(c, 240, 132, .70 + .30 * card, .70 + .30 * card, 0, () => {
      rect(c, -147, -68, 294, 139, '#ddf4e8', 15)
      text(c, 'Pedidos concluídos', -120, -39, 14, '#21484b')
      text(c, String(Math.round(42 * value)), -120, 0, 43, '#21484b')
      rect(c, -119, 37, 236, 11, '#abcbbf', 5)
      rect(c, -119, 37, 236 * value, 11, '#498e79', 5)
    })
    center(c, 'FRAME ' + String(frame).padStart(3, '0') + ' / 120', 240, 238, 13, mint, { family: 'monospace' })
  }

  demos['ms-shot-composition'] = (c, t) => {
    bg(c, '#598aa1')
    const p = smooth(t) - .5
    circle(c, 123 - p * 8, 75, 31, '#ffdd99')
    pose(c, -p * 41, 0, 1, 1, 0, () => {
      poly(c, [[-65, 192], [121, 118], [250, 182], [365, 156], [550, 216], [550, 287], [-65, 287]], '#3d6579')
      rect(c, 316, 96, 15, 73, '#f1e2cc', 2)
      poly(c, [[310, 97], [324, 81], [337, 97]], '#754b59')
      poly(c, [[320, 101], [247, 114], [247, 86]], '#ffdb885c')
    })
    pose(c, -p * 110, 0, 1, 1, 0, () => poly(c, [[-95, 201], [53, 171], [200, 227], [355, 211], [560, 181], [560, 288], [-95, 288]], '#23384d'))
    caption(c, 'COMPOSIÇÃO / TRÊS PLANOS', paper)
  }

  function letters(c, word, options, animation) {
    const { x = 240, y = 130, size = 56, gap = 2, color = paper, family = 'system-ui', italic = false, weight = 850, outline = false } = options
    c.font = [italic ? 'italic' : 'normal', weight, size + 'px', family].join(' ')
    const chars = [...word]
    const widths = chars.map(char => c.measureText(char).width)
    let left = x - (widths.reduce((sum, width) => sum + width, 0) + gap * (chars.length - 1)) / 2
    chars.forEach((char, i) => {
      const offset = left + widths[i] / 2 - x
      const effect = animation(i, chars.length, char, offset)
      const { dx = 0, dy = 0, sx = 1, sy = 1, rotation = 0, alpha = 1, filter = 'none', fill = color } = effect
      if (char !== ' ' && alpha > 0) {
        layer(c, alpha, () => {
          c.filter = filter
          pose(c, x + offset + dx, y + dy, sx, sy, rotation, () => center(c, char, 0, 0, size, fill, { family, italic, weight, outline }))
        })
      }
      left += widths[i] + gap
    })
  }

  demos['ms-kinetic-typography'] = (c, t) => {
    const beat = Math.min(2, Math.floor(t * 3))
    const p = clamp(t * 3 - beat)
    const palette = [gold, lilac, mint]
    const color = palette[beat]
    bg(c, ['#4d3338', '#352749', '#163a37'][beat])
    caption(c, 'TIPOGRAFIA / ' + (beat + 1) + ' DE 3', color)
    if (beat === 0) {
      const squash = Math.sin(Math.PI * stage(p, 0, .44))
      pose(c, 240, 131, 1 + squash * .18, 1 - squash * .29, 0, () => center(c, 'PARE', 0, 0, 76, color))
    } else if (beat === 1) {
      letters(c, 'OLHE', { size: 78, color }, i => {
        const q = back(stage(p, .05 + .07 * i, .58 + .08 * i))
        return { dy: 64 * (1 - q), alpha: q }
      })
    } else {
      const q = out(stage(p, 0, .57))
      text(c, 'SIGA', 27 + 177 * q, 131, 74, color)
      stroke(c, [[37, 192], [403, 192]], color, 3, q)
    }
  }

  demos['ms-brand-motion-guidelines'] = (c, t) => {
    bg(c, '#342d43')
    caption(c, 'SISTEMA DE MOTION / ENTRADA DE 320 MS', lilac)
    const p = out(stage(t, .15, .23))
    const s = .76 + .24 * p
    ;['Selo', 'Botão', 'Cartão'].forEach((label, i) => {
      const x = 89 + i * 150
      layer(c, p, () => pose(c, x, 114 + (1 - p) * 45, s, s, 0, () => {
        if (i === 0) circle(c, 0, 0, 33, lilac)
        if (i === 1) rect(c, -46, -19, 92, 38, lilac, 19)
        if (i === 2) rect(c, -53, -31, 106, 62, lilac, 7)
        center(c, label, 0, 0, 15, ink)
      }))
    })
    const curve = Array.from({ length: 45 }, (_, i) => [120 + 240 * i / 44, 228 - 54 * out(i / 44)])
    stroke(c, curve, '#695e7b', 2)
    stroke(c, curve, lilac, 2, stage(t, .15, .60))
  }

  demos['ms-client-revisions'] = (c, t) => {
    bg(c, '#4a3038')
    caption(c, 'REVISÃO / TEMPO DE LEITURA', gold)
    const limits = [.34, .83]
    limits.forEach((end, i) => {
      const x = 35 + i * 215
      text(c, i ? 'Depois' : 'Antes', x, 62, 15)
      rect(c, x, 81, 194, 103, '#704451', 9)
      const alpha = out(stage(t, .04, .16)) * (1 - stage(t, end, end + .10))
      layer(c, alpha, () => center(c, 'R$ 62', x + 97, 130, 40, gold))
      rect(c, x, 202, 194, 4, '#937180', 2)
      rect(c, x, 202, 194 * end, 4, i ? mint : coral, 2)
      circle(c, x + 194 * t, 204, 4.5, paper)
      text(c, i ? 'LEITURA AMPLIADA' : 'SAÍDA ANTECIPADA', x, 226, 10, i ? mint : coral)
    })
  }

  demos['ms-creative-brief'] = (c, t) => {
    bg(c, '#253944')
    caption(c, 'BRIEFING / TRADUÇÃO EM CENAS', blue)
    rect(c, 26, 54, 162, 169, '#3b5361', 12)
    text(c, 'Abrir a janela', 39, 77, 18)
    const beats = [['Objetivo', 'Descoberta', 'GANCHO'], ['Público', 'Ciclistas', 'PRODUTO'], ['Mensagem', 'Siga a luz', 'AÇÃO']]
    beats.forEach(([label, value, scene], i) => {
      const p = out(stage(t, .08 + .19 * i, .24 + .19 * i))
      const y = 108 + 42 * i
      layer(c, p, () => {
        text(c, label, 39, y, 10, blue)
        text(c, value, 39, y + 14, 13)
        stroke(c, [[192, y + 8], [218, y + 8]], blue, 1, p)
        const x = 225 + 26 * (1 - p)
        const color = [blue, mint, gold][i]
        rect(c, x, y - 12, 220, 35, color, 6)
        rect(c, x + 7, y - 7, 40, 25, '#263d49', 3)
        if (i === 0) {
          circle(c, x + 30, y, 5, gold)
          poly(c, [[x + 9, y + 14], [x + 23, y + 1], [x + 45, y + 14]], blue)
        } else if (i === 1) {
          lamp(c, x + 30, y + 3, .13)
        } else {
          stroke(c, [[x + 18, y + 6], [x + 35, y + 6], [x + 29, y], [x + 35, y + 6], [x + 29, y + 12]], gold, 2)
        }
        text(c, String(i + 1).padStart(2, '0') + '  ' + scene, x + 58, y + 6, 12, ink)
      })
    })
  }

  demos['ms-motion-pricing'] = (c, t) => {
    bg(c, '#273b3e')
    caption(c, 'ORÇAMENTO / EXEMPLO DE ESCOPO', mint)
    for (let mode = 0; mode < 2; mode++) {
      const x = 29 + 226 * mode
      rect(c, x, 54, 196, 176, '#3b5354', 11)
      text(c, mode ? 'Filme + adaptações' : 'Filme principal', x + 14, 76, 15)
      let total = 0
      const formats = mode ? ['16:9', '9:16', '1:1'] : ['16:9']
      formats.forEach((format, i) => {
        const p = out(stage(t, .12 + .19 * i, .25 + .19 * i))
        total += Math.round((i ? 200 : 900) * p)
        layer(c, p, () => {
          rect(c, x + 13 + 56 * i, 103 + 10 * (1 - p), 48, 62, i ? blue : mint, 6)
          center(c, format, x + 37 + 56 * i, 135 + 10 * (1 - p), 10, ink)
        })
      })
      text(c, 'R$ ' + total.toLocaleString('pt-BR'), x + 14, 199, 26, mint)
    }
  }

  demos['ms-video-delivery-specs'] = (c, t) => {
    bg(c, '#282d43')
    caption(c, 'ENTREGA / ÁREAS SEGURAS', lilac)
    const layouts = [[33, 79, 266, 150, '16:9'], [329, 48, 111, 197, '9:16']]
    layouts.forEach(([x, y, w, h, format], i) => {
      rect(c, x, y, w, h, i ? '#494067' : '#334562', 8)
      const p = out(stage(t, .09 + .09 * i, .57))
      const left = x + 12
      const right = x + w - (i ? 26 : 13)
      const bottom = y + h - (i ? 40 : 13)
      const top = y + 14
      c.save()
      c.setLineDash([4, 4])
      stroke(c, [[left, top], [right, top], [right, bottom], [left, bottom], [left, top]], '#b9b4ce', 1)
      c.restore()
      const centerX = (left + right) / 2
      lamp(c, centerX, y + h * .42 + (1 - p) * 14, i ? .54 : .72)
      layer(c, p, () => center(c, 'Lume', centerX, bottom - 20 + 12 * (1 - p), i ? 15 : 22))
      text(c, format, x, y - 11, 10, lilac)
      if (i) {
        for (let j = 0; j < 3; j++) circle(c, right + 13, top + 69 + j * 20, 4.5, '#a393c2')
        rect(c, x + 9, bottom + 13, w - 19, 3, '#a393c2', 2)
      }
    })
  }

  demos['ms-particle-system'] = (c, t) => {
    bg(c, '#27213e')
    caption(c, 'PARTÍCULAS / DOIS PULSOS', lilac)
    circle(c, 240, 128, 6, '#676083')
    circle(c, 240, 128, 2.3, paper)
    for (let wave = 0; wave < 2; wave++) {
      const age = (t - .08 - wave * .37) * 1.66
      if (age <= 0 || age >= 1) continue
      for (let i = 0; i < 49; i++) {
        const seed = i + 73 * wave
        const angle = tau * i / 49 + .16 * random(seed)
        const speed = 44 + 130 * random(seed + 141)
        const radius = speed * age
        layer(c, 1 - age, () => circle(c, 240 + Math.cos(angle) * radius, 128 + Math.sin(angle) * radius + 57 * age ** 2, (1.6 + 3 * random(seed + 289)) * (1 - .78 * age), [mint, coral, lilac][i % 3]))
      }
    }
  }

  demos['ms-shader-glsl'] = (c, t) => {
    const phase = tau * t
    for (let y = 0; y < H; y += 5) {
      for (let x = 0; x < W; x += 5) {
        const u = x / W
        const v = y / H
        const waves = Math.sin(u * 14 + v * 3 + phase) + Math.sin(v * 13 - u * 5 - phase) + Math.sin(Math.hypot(u - .5, v - .5) * 17 + phase)
        const p = smooth((waves + 3) / 6)
        rect(c, x, y, 5, 5, `hsl(${mix(264, 388, p)} 75% ${mix(18, 67, p)}%)`)
      }
    }
    rect(c, 14, 11, 158, 26, '#17152cca', 6)
    caption(c, 'PLASMA / CAMPO DE ONDAS', paper)
  }

  demos['ms-threejs-animation'] = (c, t) => {
    bg(c, '#233354')
    caption(c, 'CENA 3D / CÂMERA EM ÓRBITA', blue)
    const theta = tau * t
    const rotate = ([x, y, z]) => [x * Math.cos(theta) - z * Math.sin(theta), y, x * Math.sin(theta) + z * Math.cos(theta)]
    const camera = point => {
      const [x, y, z] = rotate(point)
      return [x, y * .88 - z * .475, z * .88 + y * .475]
    }
    const project = ([x, y, z]) => [240 + x * 330 / (z + 280), 128 + y * 330 / (z + 280)]
    for (let i = -3; i <= 3; i++) {
      stroke(c, [project(camera([-126, 54, 42 * i])), project(camera([126, 54, 42 * i]))], '#486083')
      stroke(c, [project(camera([42 * i, 54, -126])), project(camera([42 * i, 54, 126]))], '#486083')
    }
    const coords = [[-44, -49, -44], [44, -49, -44], [44, 39, -44], [-44, 39, -44], [-44, -49, 44], [44, -49, 44], [44, 39, 44], [-44, 39, 44]].map(camera)
    const faces = [
      [[0, 1, 2, 3], '#7289c7'], [[7, 6, 5, 4], '#7289c7'], [[4, 0, 3, 7], '#506bad'],
      [[1, 5, 6, 2], '#506bad'], [[4, 5, 1, 0], '#a3b9ed'], [[3, 2, 6, 7], '#a3b9ed'],
    ]
    const projected = faces.map(([indices, color]) => {
      const vertices = indices.map(i => coords[i])
      return { color, depth: vertices.reduce((sum, v) => sum + v[2], 0), points: vertices.map(project) }
    })
    projected.sort((a, b) => b.depth - a.depth).forEach(({ color, points }) => {
      const [a, b, d] = points
      const cross = (b[0] - a[0]) * (d[1] - a[1]) - (b[1] - a[1]) * (d[0] - a[0])
      if (cross <= 0) return
      poly(c, points, color)
      stroke(c, [...points, points[0]], '#b8ccf4', 1)
    })
  }

  demos['ms-manim'] = (c, t) => {
    bg(c, '#1e3337')
    caption(c, 'MATEMÁTICA / SEN(θ)', mint)
    const p = stage(t, .06, .95)
    const angle = tau * p
    const y = 139 - 58 * Math.sin(angle)
    const x = 108 + 58 * Math.cos(angle)
    const end = 203 + 243 * p
    stroke(c, [[34, 139], [183, 139]], '#608787')
    stroke(c, [[108, 65], [108, 214]], '#608787')
    stroke(c, [[201, 139], [448, 139]], '#608787')
    stroke(c, [[203, 65], [203, 214]], '#608787')
    arc(c, 108, 139, 58, 1, '#739795', 2)
    stroke(c, [[108, 139], [x, y]], mint, 2)
    c.save()
    c.setLineDash([3, 5])
    stroke(c, [[x, y], [end, y]], '#78ad9f', 1)
    c.restore()
    const curve = Array.from({ length: 90 }, (_, i) => {
      const phase = p * i / 89
      return [203 + 243 * phase, 139 - 58 * Math.sin(tau * phase)]
    })
    stroke(c, curve, gold, 3)
    circle(c, x, y, 5.5, mint)
    circle(c, end, y, 4.5, gold)
    text(c, 'Círculo unitário', 58, 233, 12)
    text(c, '0', 202, 233, 11)
    text(c, '2π', 433, 233, 11)
  }

  demos['ms-generative-illustration'] = (c, t) => {
    bg(c, '#f0e5c9')
    caption(c, 'HERBÁRIO / CRESCIMENTO GENERATIVO', '#3a6757')
    circle(c, 241, 140, 95, '#e9d7ad')
    const colors = ['#5e8e69', '#3c7666', '#ac7855']
    for (let branch = 0; branch < 3; branch++) {
      const growth = out(stage(t, .02 + branch * .12, .77 + .10 * branch))
      const bend = (branch - 1) * 112 + 13 * Math.sin(tau * t + branch)
      const point = p => [240 + bend * p ** 1.27, 231 - (151 - 13 * branch) * p]
      const path = Array.from({ length: 45 }, (_, i) => point(i / 44))
      stroke(c, path, '#466959', 2.4, growth)
      for (let i = 1; i <= 6; i++) {
        const pos = i * .135
        const p = out(stage(growth, pos, pos + .18))
        if (p <= 0) continue
        const side = i % 2 ? -1 : 1
        const [x, y] = point(pos)
        pose(c, x, y, p, p, side * mix(.05, .87, p), () => {
          c.beginPath()
          c.moveTo(0, 0)
          c.quadraticCurveTo(-17, -18, 0, -37 + i)
          c.quadraticCurveTo(17, -18, 0, 0)
          c.fillStyle = colors[branch]
          c.fill()
          stroke(c, [[0, -3], [0, -24]], '#d5d7aa88', .9)
        })
      }
    }
    stroke(c, [[145, 235], [334, 235]], '#bcac8a')
  }

  demos['ms-javascript-animation'] = (c, t) => {
    bg(c, '#202238')
    const ground = 158
    const windowColors = [gold, '#5f77a2', coral]
    for (let i = 0; i < 12; i++) {
      const x = i * 42 - 8
      const h = 39 + 66 * random(i + 11)
      rect(c, x, ground - h, 37, h, i % 2 ? '#32384e' : '#2b3046')
      for (let k = 0; k < 3; k++) {
        const y = ground - h + 12 + 19 * k
        if (y + 7 < ground) rect(c, x + 13, y, 7, 9, windowColors[(i + k) % 3], 1)
      }
    }
    rect(c, 0, ground, W, H - ground, '#282a42')
    stroke(c, [[0, ground + 1], [W, ground + 1]], '#616680')
    for (let i = 1; i < 11; i++) {
      const color = windowColors[i % 3]
      for (let line = 0; line < 5; line++) {
        const y = ground + 12 + 15 * line + random(i * 3 + line) * 10
        const x = i * 42 + 5 + Math.sin(t * tau * 2 + line + i) * (3 + line * 2)
        layer(c, .43 - line * .06, () => stroke(c, [[x - line * 2, y], [x + 8 + line * 2, y]], color, 2))
      }
    }
    for (let i = 0; i < 24; i++) {
      const p = frac(random(i + 5) + t * 2)
      const x = 18 + 455 * random(i + 214) + p * 18
      const y = ground + 8 + 88 * random(i + 54)
      layer(c, .63 * (1 - p), () => ellipse(c, x, y, 3 + 27 * p, 1 + 5 * p, windowColors[i % 3], 1))
    }
    for (let i = 0; i < 48; i++) {
      const p = frac(random(i + 343) + t * (1.3 + .45 * random(i)))
      const x = 501 * random(i + 84) - 39 * p
      const y = 178 * p
      stroke(c, [[x + 7, y - 18], [x, y]], '#d3e5ff51', 1.4)
    }
    caption(c, 'CANVAS / CHUVA NA RUA', paper)
  }

  demos['ms-soundtrack'] = (c, t) => {
    bg(c, '#302946')
    caption(c, 'TRILHA / PULSO, CONTRATEMPO E ACENTO', lilac)
    const x0 = 104
    const w = 334
    const cut = Math.min(3, Math.floor(t * 4))
    for (let i = 0; i < 4; i++) {
      const color = [lilac, mint, coral, gold][i]
      layer(c, i === cut ? 1 : .44, () => {
        rect(c, x0 + w / 4 * i, 48, w / 4 - 5, 37, color, 5)
        center(c, ['Plano A', 'Plano B', 'Plano C', 'Fecho'][i], x0 + w / 4 * (i + .5) - 2, 67, 10, ink)
      })
    }
    const tracks = [[0, .25, .50, .75], [.125, .375, .625, .875], [.94]]
    tracks.forEach((events, track) => {
      const y = 111 + 41 * track
      text(c, ['Pulso', 'Contratempo', 'Acento'][track], 23, y + 14, 11)
      rect(c, x0, y, w, 28, '#514564', 5)
      events.forEach(beat => {
        const p = (t - beat) * 14
        const active = p >= 0 && p < 1
        rect(c, x0 + beat * w, y + (active ? 3 : 8), track === 2 ? 16 : 8, active ? 22 : 12, [mint, lilac, gold][track], 3)
      })
    })
    stroke(c, [[x0 + w * t, 92], [x0 + w * t, 228]], paper, 1.5)
  }

  demos['ms-lower-thirds-alpha'] = (c, t) => {
    for (let y = 0; y < H; y += 18) {
      for (let x = 0; x < W; x += 18) rect(c, x, y, 18, 18, (x / 18 + y / 18) % 2 ? '#33475a' : '#3c5468')
    }
    chip(c, 'PRÉVIA DE ALPHA', 26, 14, blue, 119)
    const bar = out(stage(t, .07, .29)) * (1 - smooth(stage(t, .76, .94)))
    const reveal = out(stage(t, .15, .36)) * (1 - smooth(stage(t, .74, .90)))
    crop(c, 29, 148, 280 * reveal, 67, () => {
      rect(c, 29, 154, 249, 55, '#142534e8', 5)
      text(c, 'Rui Terra', 47, 172, 21)
      text(c, 'Curador convidado', 48, 193, 12, '#a4ecee')
    })
    rect(c, 30, 207, 266 * bar, 4, '#80eced', 2)
  }

  demos['ms-talking-head-b-roll'] = (c, t) => {
    const shot = t < .31 ? 0 : t < .58 ? 1 : t < .88 ? 2 : 0
    bg(c, ['#344c5b', '#3c3151', '#203e3c'][shot])
    caption(c, ['APRESENTADORA', 'INSERÇÃO / CAIXA', 'INSERÇÃO / TRÊS ETAPAS'][shot], paper)
    if (shot === 0) {
      circle(c, 243, 119, 70, '#547180')
      portrait(c, 242, 100, 1.59, t, ['#605187', '#d9906d', '#34293d'])
    } else if (shot === 1) {
      const p = out(stage(t, .32, .49))
      poly(c, [[173, 99], [242, 77], [314, 100], [245, 123]], '#b88da9')
      poly(c, [[173, 99], [245, 123], [245, 174], [173, 145]], '#ad6d8b')
      poly(c, [[245, 123], [314, 100], [314, 148], [245, 174]], '#d28f9d')
      poly(c, [[173 - 17 * p, 99 - 42 * p], [242, 77 - 54 * p], [314 + 17 * p, 100 - 42 * p], [245, 123 - 30 * p]], '#f2bcaf')
    } else {
      for (let i = 0; i < 3; i++) {
        const p = back(stage(t, .59 + i * .058, .72 + i * .058))
        layer(c, p, () => {
          rect(c, 90 + 109 * i, 80 + 22 * (1 - p), 82, 93, [mint, blue, gold][i], 7)
          center(c, String(i + 1), 131 + 109 * i, 124 + 22 * (1 - p), 32, ink)
        })
      }
    }
    rect(c, 100, 223, 280, 28, '#151c29', 7)
    text(c, 'Uma', 139, 238, 14, t < .31 ? gold : paper)
    text(c, 'caixa,', 184, 238, 14, shot === 1 ? gold : paper)
    text(c, 'três etapas.', 234, 238, 14, shot === 2 ? gold : paper)
  }

  demos['ms-talking-head'] = (c, t) => {
    bg(c, '#33304e')
    caption(c, 'APRESENTADOR ILUSTRADO / APOIO GRÁFICO', lilac)
    const p = out(stage(t, .29, .55))
    const x = 240 - 100 * p
    circle(c, x, 132, 81, '#544970')
    portrait(c, x, 108, 1.50, t, ['#367176', '#c08368', '#322635'])
    const reveal = out(stage(t, .46, .70))
    layer(c, reveal, () => {
      const left = 244 + 24 * (1 - reveal)
      rect(c, left, 66, 200, 138, '#474464', 9)
      text(c, 'Projeto piloto', left + 19, 86, 13)
      ;[38, 61, 49].forEach((height, i) => rect(c, left + 26 + 52 * i, 181 - height * reveal, 32, height * reveal, [mint, blue, lilac][i], 4))
      stroke(c, [[left + 20, 185], [left + 173, 185]], '#9f97bc')
    })
  }

  // As transições têm uma origem e um destino, com cores e composições próprias.
  const scenePairs = [
    [['#20283e', lilac, 'PULSO'], ['#263d3b', mint, 'SINAL']],
    [['#4b3141', gold, 'MARÉ'], ['#273952', blue, 'CÉU']],
    [['#273e43', mint, 'PLANO'], ['#3c284c', lilac, 'CORTE']],
    [['#4b343c', coral, 'PISTA'], ['#263e55', blue, 'META']],
    [['#483942', gold, 'DIA'], ['#242843', lilac, 'NOITE']],
  ]
  function transitionScene(c, pair, index, withTitle = true) {
    const [background, accent, label] = scenePairs[pair][index]
    rect(c, -2, -2, W + 4, H + 4, background)
    if (index) {
      for (let i = 0; i < 5; i++) ellipse(c, 338, 138, 29 + i * 29, 19 + i * 25, accent + '4a', 1.5)
    } else {
      for (let i = 0; i < 5; i++) poly(c, [[0, 52 + 39 * i], [132, 28 + 39 * i], [132, 34 + 39 * i], [0, 58 + 39 * i]], accent + '4a')
    }
    caption(c, index ? 'CENA B' : 'CENA A', accent)
    if (withTitle) center(c, label, 240, 135, 67, accent, { weight: 850 })
  }

  demos['showcase-implode'] = (c, t) => {
    const p = stage(t, .22, .61)
    const q = out(stage(t, .59, .79))
    transitionScene(c, 0, p >= .94 ? 1 : 0, false)
    if (p < .94) {
      letters(c, 'PULSO', { size: 69, color: lilac, gap: 5 }, (i, length, _char, origin) => {
        const distance = Math.abs(i - (length - 1) / 2)
        const k = stage(p, .10 - distance * .05, .92 - distance * .10) ** 2
        return { dx: origin * (Math.cos(k * 2.4) * (1 - k) - 1), dy: origin * Math.sin(k * 2.4) * (1 - k), sx: 1 - k, sy: 1 - k, rotation: 2.6 * k, alpha: 1 - k, filter: 'blur(' + (4 * k) + 'px)' }
      })
      if (p > .58) circle(c, 240, 130, 7 * Math.sin(Math.PI * stage(p, .58, 1)), paper)
    } else {
      layer(c, q, () => pose(c, 240, 135, .1 + .9 * q, .1 + .9 * q, 0, () => center(c, 'SINAL', 0, 0, 67, mint, { weight: 850 })))
    }
  }

  demos['showcase-color-band-sweep'] = (c, t) => {
    transitionScene(c, 1, t < .49 ? 0 : 1)
    const colors = ['#8fe6e6', '#22283b', '#a892f4']
    colors.forEach((color, i) => {
      const p = smooth(stage(t, .20 + .043 * i, .73 + .043 * i))
      const y = mix(382, -540, p)
      poly(c, [[0, y + 32], [W, y - 32], [W, y + 326], [0, y + 390]], color)
    })
  }

  demos['showcase-venetian-shutter'] = (c, t) => {
    transitionScene(c, 2, t < .53 ? 0 : 1)
    const colors = [lilac, gold, mint, '#405977']
    colors.forEach((color, i) => {
      const close = stage(t, .18 + .035 * i, .34 + .035 * i) ** 2
      const open = out(stage(t, .55 + .039 * i, .72 + .039 * i))
      const y = H / 4 * i + H / 4 * open
      const h = (H / 4 + 1) * close * (1 - open)
      rect(c, 0, y, W, h, color)
    })
  }

  demos['showcase-whip-pan-blur'] = (c, t) => {
    const time = stage(t, .26, .76)
    if (time === 0 || time === 1) {
      transitionScene(c, 3, time === 1 ? 1 : 0)
      return
    }
    const progress = smooth(time)
    const left = -W * progress
    const right = W * (1 - progress)
    const draw = (idx, x) => pose(c, x, 0, 1, 1, 0, () => transitionScene(c, 3, idx))
    draw(0, left)
    draw(1, right)
    const blur = 76 * Math.sin(time * Math.PI) ** 2
    for (let j = 1; j <= 6; j++) {
      layer(c, .17, () => {
        const trail = blur * j / 6
        draw(0, left + trail)
        draw(1, right + trail)
      })
    }
  }

  demos['showcase-iris'] = (c, t) => {
    const close = 1 - smooth(stage(t, .18, .50))
    const open = smooth(stage(t, .51, .80))
    const radius = 279 * (t < .51 ? close : open)
    bg(c, '#141b2b')
    if (radius <= 0) return
    c.save()
    c.beginPath()
    c.arc(240, 135, radius, 0, tau)
    c.clip()
    transitionScene(c, 4, t < .51 ? 0 : 1)
    c.restore()
    ellipse(c, 240, 135, radius, radius, '#e3dbb84a', 1)
  }

  function floatType(c, word, y, size, color, t, start, perLetter = .035, gap = 3) {
    letters(c, word, { y, size, color, gap }, i => {
      const time = stage(t, start + perLetter * i, start + .31 + perLetter * i)
      const p = back(time)
      return { dy: 49 * (1 - p), sy: Math.max(.05, Math.sin(time * Math.PI / 2)) * (1 + (p - 1) * .24), alpha: out(time) }
    })
  }
  function corners(c, x, y, w, h, color, p) {
    for (const sx of [-1, 1]) {
      for (const sy of [-1, 1]) {
        const reach = 14 + 7 * (1 - p)
        const px = x + sx * (w / 2 + 24 * (1 - p))
        const py = y + sy * (h / 2 + 24 * (1 - p))
        stroke(c, [[px - sx * reach, py], [px, py], [px, py - sy * reach]], color, 2)
      }
    }
  }
  function risingCredit(c, word, y, t, start, color) {
    const p = out(stage(t, start, start + .20))
    crop(c, 42, y - 11, 396, 22, () => layer(c, p, () => center(c, word, 240, y + 18 * (1 - p), 11, color, { weight: 750 })))
  }

  demos['showcase-s1'] = (c, t) => {
    bg(c, '#333152')
    ellipse(c, 240, 140, 196, 81, '#b8b1ee45', 1)
    ellipse(c, 240, 140, 185, 70, '#b8b1ee25', 1)
    risingCredit(c, 'UM FILME DO ESTÚDIO NORTE', 83, t, .02, lilac)
    floatType(c, 'IMPULSO', 148, 63, paper, t, .14, .046, mix(0, 5, stage(t, .62, .96)))
  }

  demos['showcase-s2'] = (c, t) => {
    bg(c, '#4a3338')
    const order = [1, 4, 0, 2, 5, 3]
    letters(c, 'a cada', { y: 137, size: 77, color: gold, family: 'Georgia, serif', italic: true, weight: 700, gap: 1 }, (i, length) => {
      const arrive = out(stage(t, .08 + order[i] * .043, .40 + order[i] * .047))
      const leave = stage(t, .69 + Math.min(i, length - i - 1) * .031, .89 + Math.min(i, length - i - 1) * .031) ** 2
      return { dy: 74 * (1 - arrive) - 59 * leave, rotation: .2 * (1 - arrive) - .10 * leave, alpha: arrive * (1 - leave), sx: 1 - .42 * leave, sy: 1 - .42 * leave }
    })
  }

  demos['showcase-s3'] = (c, t) => {
    bg(c, '#273750')
    const shake = stage(t, .37, .58)
    const x = 240 + Math.sin(shake * tau * 4) * 10 * (1 - shake)
    letters(c, 'QUADRO', { x, y: 136, size: 66, color: blue, outline: true }, (i, length) => {
      const distance = Math.floor(Math.abs(i - (length - 1) / 2))
      const p = out(stage(t, .08 + .061 * distance, .45 + .055 * distance))
      const leave = stage(t, .73 + (length - i) * .013, .88 + (length - i) * .013)
      const scale = 1 + 3.2 * (1 - p)
      return { dx: (i - 2.5) * 18 * (1 - p), dy: 75 * leave, sx: scale, sy: scale * Math.max(.01, Math.cos(Math.PI * .5 * leave)), alpha: p * (1 - leave), filter: 'blur(' + (12 * (1 - p)) + 'px)' }
    })
  }

  demos['showcase-s4'] = (c, t) => {
    bg(c, '#312b45')
    const rows = [['CORTE', mint], ['MOVA', lilac], ['ENTREGUE', coral]]
    rows.forEach(([word, color], row) => {
      letters(c, word, { y: 74 + row * 61, size: 47, color }, i => {
        const start = .07 + row * .16 + i * .024
        const time = stage(t, start, start + .24)
        const p = row === 2 ? back(time) : out(time)
        const bounce = row === 2 ? Math.sin(Math.PI * stage(t, .66 + i * .016, .80 + i * .016)) * 10 : 0
        return { dx: row === 1 ? -55 * (1 - p) : 0, dy: (row === 0 ? 51 * (1 - p) : 0) - bounce, sx: row === 2 ? 1 + (1 - p) * 1.05 : 1, sy: row === 2 ? 1 + (1 - p) * 1.05 : 1, alpha: out(time) }
      })
    })
  }

  demos['showcase-s5'] = (c, t) => {
    bg(c, '#313645')
    const frame = out(stage(t, .08, .48))
    layer(c, frame, () => corners(c, 240, 135, 339, 166, lilac, frame))
    floatType(c, 'ESTÚDIO', 105, 47, paper, t, .08)
    floatType(c, 'NORTE', 157, 57, gold, t, .22)
    const rule = smooth(stage(t, .37, .66))
    if (rule > 0) stroke(c, [[240 - 123 * rule, 190], [240 + 123 * rule, 190]], gold, 1.6)
    risingCredit(c, 'TIPOGRAFIA E MOVIMENTO', 207, t, .49, lilac)
  }

  demos['showcase-s6'] = (c, t) => {
    bg(c, '#233c3a')
    const frame = out(stage(t, .10, .55))
    layer(c, frame, () => corners(c, 240, 133, 335, 144, mint, frame))
    letters(c, 'norte.co', { y: 123, size: 57, weight: 800, gap: 1 }, (i, _length, char) => {
      if (char === '.') {
        const dot = out(stage(t, .44, .58))
        const pulse = .32 * Math.sin(Math.PI * stage(t, .56, .79))
        return { fill: gold, alpha: dot, sx: dot + pulse, sy: dot + pulse }
      }
      const p = back(stage(t, .08 + i * .031, .39 + i * .031))
      return { dy: 40 * (1 - p), alpha: p, sy: .18 + .82 * p }
    })
    const line = smooth(stage(t, .46, .71))
    if (line > 0) stroke(c, [[240 - 120 * line, 158], [240 + 120 * line, 158]], gold, 1.6)
    risingCredit(c, 'ESTÚDIO DE ANIMAÇÃO', 178, t, .54, mint)
  }
})()


(() => {
  const demos = window.motionDemos ??= Object.create(null)
  const W = 480
  const H = 270
  const ink = '#101729'
  const surface = '#1d2b40'
  const line = '#354866'
  const white = '#f3f5ff'
  const muted = '#a2b6cc'
  const mint = '#7bf4cb'
  const lilac = '#ae9bff'
  const amber = '#ffd475'
  const rose = '#ff8fa3'
  const tau = Math.PI * 2
  const clamp = p => Math.min(1, Math.max(0, p))
  const mix = (a, b, p) => a + (b - a) * p
  const range = (t, a, b) => clamp((t - a) / (b - a))
  const ease = (t, a, b) => {
    const p = range(t, a, b)
    return p * p * (3 - 2 * p)
  }

  function box(c, x, y, w, h, color = surface, r = 8, border) {
    if (w <= 0 || h <= 0) return
    c.beginPath()
    c.roundRect(x, y, w, h, r)
    c.fillStyle = color
    c.fill()
    if (border) {
      c.strokeStyle = border
      c.lineWidth = 1
      c.stroke()
    }
  }

  function label(c, content, x, y, size = 13, color = white, align = 'left', family = 'system-ui') {
    c.font = '650 ' + size + 'px ' + family
    c.fillStyle = color
    c.textAlign = align
    c.textBaseline = 'middle'
    c.fillText(content, x, y)
  }

  function stroke(c, points, color = line, width = 1) {
    c.beginPath()
    points.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y))
    c.strokeStyle = color
    c.lineWidth = width
    c.lineCap = 'round'
    c.stroke()
  }

  function poly(c, points, color) {
    c.beginPath()
    points.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y))
    c.closePath()
    c.fillStyle = color
    c.fill()
  }

  function oval(c, x, y, rx, ry, color) {
    c.beginPath()
    c.ellipse(x, y, rx, ry, 0, 0, tau)
    c.fillStyle = color
    c.fill()
  }

  function windowClip(c, x, y, w, h, draw, radius = 8) {
    c.save()
    c.beginPath()
    c.roundRect(x, y, w, h, radius)
    c.clip()
    draw()
    c.restore()
  }

  function reveal(c, p, draw, dx = 0, dy = 10) {
    if (p <= 0) return
    c.save()
    c.globalAlpha *= p
    c.translate(dx * (1 - p), dy * (1 - p))
    draw()
    c.restore()
  }

  function fitted(c, x, y, w, h, draw) {
    windowClip(c, x, y, w, h, () => {
      c.translate(x, y)
      c.scale(w / W, h / H)
      draw()
    })
  }

  function stage(c, title, kicker, accent = mint) {
    const gradient = c.createLinearGradient(0, 0, W, H)
    gradient.addColorStop(0, '#17273e')
    gradient.addColorStop(1, ink)
    c.fillStyle = gradient
    c.fillRect(0, 0, W, H)
    if (!title) return
    label(c, kicker, 26, 24, 10, accent)
    label(c, title, 26, 47, 25)
    stroke(c, [[26, 66], [454, 66]], line)
  }

  function app(c, x, y, w, h, title, accent = mint) {
    box(c, x, y, w, h, '#142236', 9, line)
    box(c, x, y, w, 25, '#25354c', [9, 9, 0, 0])
    for (let i = 0; i < 3; i++) oval(c, x + 10 + 7 * i, y + 12, 2, 2, i ? muted : accent)
    label(c, title, x + 34, y + 13, 10)
  }

  function chip(c, x, y, w, message, active = false, height = 28) {
    box(c, x, y, w, height, active ? '#184137' : surface, height / 2, active ? mint : line)
    label(c, message, x + w / 2, y + height / 2, 11, active ? mint : white, 'center')
  }

  function bar(c, x, y, width, p, color = mint, h = 6) {
    box(c, x, y, width, h, line, h / 2)
    box(c, x, y, width * clamp(p), h, color, h / 2)
  }

  function pathProgress(c, a, b, p, color = mint) {
    const [x, y] = a
    const [u, v] = b
    const points = Array.from({ length: 25 }, (_, i) => {
      const q = i / 24
      return [mix(x, u, q), mix(y, v, q * q * (3 - 2 * q))]
    })
    stroke(c, points)
    if (p > 0) {
      const count = Math.max(2, Math.ceil(p * 25))
      stroke(c, points.slice(0, count), color, 2)
    }
  }

  function typing(content, t, start, end) {
    return content.slice(0, Math.round(content.length * range(t, start, end))) + (t < end ? '▍' : '')
  }

  function cursor(c, x, y, click = 0) {
    if (click > 0 && click < 1) {
      c.beginPath()
      c.arc(x, y, 6 + 18 * click, 0, tau)
      c.strokeStyle = 'rgba(123,244,203,' + (1 - click) + ')'
      c.lineWidth = 2
      c.stroke()
    }
    poly(c, [[x, y], [x + 14, y + 7], [x + 8, y + 9], [x + 6, y + 15]], white)
    stroke(c, [[x, y], [x + 6, y + 15], [x + 8, y + 9], [x + 14, y + 7], [x, y]], ink)
  }

  function face(c, x, y, r, variant = 0, mood = 0) {
    const skin = ['#e2a582', '#b97857', '#efa77e', '#9a644c'][variant % 4]
    oval(c, x, y + 3, r, r * 1.14, '#192439')
    oval(c, x, y + 4, r * .84, r, skin)
    poly(c, [[x - r * .87, y], [x - r * .66, y - r * .87], [x + r * .73, y - r * .76],
      [x + r * .83, y + 1], [x + r * .34, y - r * .32], [x - r * .31, y - r * .09]], '#192439')
    for (const side of [-1, 1]) {
      oval(c, x + side * r * .3, y + r * .09, Math.max(1, r * .06), Math.max(1, r * .08), ink)
      stroke(c, [[x + side * r * .12, y - r * .1 - mood * r * .13],
        [x + side * r * .45, y - r * .12 + mood * r * .09]], ink, Math.max(1, r * .05))
    }
    if (mood > .1) oval(c, x, y + r * .5, r * .18, r * (.06 + mood * .12), '#5c3037')
    else stroke(c, [[x - r * .18, y + r * .43], [x, y + r * .5], [x + r * .18, y + r * .43]], '#70424a', Math.max(1, r * .05))
  }

  function host(c, t, { zoom = 1, take = 0, point = 0 } = {}) {
    c.save()
    c.translate(240, 102)
    c.scale(zoom, zoom)
    c.translate(-240, -102)
    const gradient = c.createLinearGradient(0, 0, W, H)
    gradient.addColorStop(0, take ? '#29234b' : '#173d4c')
    gradient.addColorStop(1, '#0e182c')
    c.fillStyle = gradient
    c.fillRect(0, 0, W, H)
    const x = (take ? 217 : 244) + 4 * Math.sin(t * tau)
    const y = 103 + 4 * Math.sin(t * 9)
    c.save()
    c.globalAlpha = .5
    oval(c, take ? 361 : 109, 129, 79, 97, take ? '#51426e' : '#2e5963')
    box(c, take ? 42 : 350, 57, 75, 111, '#33465c', 3, '#6a7c93')
    stroke(c, [[take ? 42 : 350, 138], [take ? 117 : 425, 138]], line, 3)
    c.restore()
    oval(c, x, y + 108, 77, 66, take ? '#6759ab' : '#2e937e')
    box(c, x - 12, y + 34, 24, 31, '#bd8065', 7)
    face(c, x, y, 38, 0, .2 + .5 * Math.abs(Math.sin(t * 47)))
    const hx = mix(x + 64, x + 94, point)
    const hy = mix(y + 113 - 13 * Math.sin(t * 8), y - 10, point)
    stroke(c, [[x + 40, y + 96], [x + 67, y + 127], [hx, hy]], take ? '#6759ab' : '#2e937e', 22)
    oval(c, hx, hy, 10, 8, '#e2a582')
    if (point > .45) stroke(c, [[hx, hy], [hx + 14, hy - 9]], '#e2a582', 5)
    c.restore()
  }

  const palettes = [
    ['#55496e', '#ffd383', '#534c89'], ['#406b84', '#f5bd9c', '#325d6c'],
    ['#2f536d', '#7bf4cb', '#b3a1ff'], ['#2e6158', '#ffd475', '#142c33'],
    ['#492f54', '#a9e4fa', '#ed9ca3'], ['#704e68', '#ffc983', '#363950'],
    ['#25495a', '#87ded4', '#a996ff'], ['#414982', '#f3edc7', '#df8c9f'],
  ]

  function illustration(c, x, y, w, h, kind, type = 0) {
    const [base, bright, shade] = palettes[(kind + type) % palettes.length]
    windowClip(c, x, y, w, h, () => {
      c.translate(x, y)
      c.scale(w / 120, h / 82)
      box(c, 0, 0, 120, 82, base, 0)
      oval(c, 84, 27, 24, 24, bright)
      if (kind === 0) {
        face(c, 31, 41, 18, type % 4)
        label(c, 'NOVO', 62, 53, 15)
        label(c, 'OLHAR', 62, 69, 13, bright)
      } else if (kind === 1) {
        poly(c, [[0, 76], [41, 22], [72, 66], [97, 42], [120, 70], [120, 82], [0, 82]], shade)
        poly(c, [[0, 67], [37, 58], [80, 74], [120, 57], [120, 82], [0, 82]], '#162e42')
      } else if (kind === 2) {
        box(c, 16, 16, 90, 50, '#152b3e', 4)
        ;[17, 31, 25, 39].forEach((n, i) => box(c, 26 + 17 * i, 58 - n, 11, n, i % 2 ? shade : bright, 2))
      } else if (kind === 3) {
        if (type === 0) {
          for (let i = 0; i < 6; i++) poly(c, [[i * 23, 21], [i * 23 - 12, 77], [i * 23 + 12, 77]], shade)
        } else if (type === 1) {
          for (let i = 0; i < 4; i++) stroke(c, [[0, 49 + i * 9], [43, 45 + i * 9], [120, 50 + i * 9]], '#a8d0d8', 2)
        } else {
          for (let i = 0; i < 6; i++) {
            box(c, i * 22, 26 + i % 3 * 9, 16, 56, shade, 0)
            stroke(c, [[5 + i * 22, 38], [5 + i * 22, 59]], '#f88db5', 2)
          }
        }
        box(c, 46, 34, 28, 36, '#f7eac8', 4, '#aa8c62')
        box(c, 53, 24, 14, 12, '#17252f', 2)
        box(c, 50, 47, 20, 14, '#bc8b6c', 0)
      } else if (kind === 4) {
        poly(c, [[25, 32], [42, 11], [54, 34], [73, 34], [91, 14], [96, 46], [74, 69], [48, 69]], shade)
        oval(c, 51, 46, 5, 5, white)
        oval(c, 74, 46, 5, 5, white)
      } else if (kind === 5) {
        poly(c, [[26, 35], [48, 15], [73, 15], [96, 35], [81, 47], [75, 41], [80, 73], [40, 73], [45, 41], [40, 47]], shade)
        stroke(c, [[48, 16], [60, 27], [73, 16]], bright, 2)
      } else if (kind === 6) {
        poly(c, [[24, 43], [59, 22], [97, 43], [62, 64]], bright)
        poly(c, [[24, 43], [62, 64], [62, 81], [24, 60]], shade)
        poly(c, [[62, 64], [97, 43], [97, 60], [62, 81]], '#294c69')
      } else {
        c.save()
        c.translate(60, 43)
        c.rotate(-.19)
        label(c, 'VIVA', 0, -6, 28, white, 'center')
        label(c, 'A COR', 0, 18, 14, bright, 'center')
        c.restore()
      }
    })
  }

  function document(c, x, y, w, h, title, accent = lilac) {
    box(c, x, y, w, h, '#f3ecdb', 5)
    box(c, x + 12, y + 12, 5, 10, accent, 1)
    label(c, title, x + 22, y + 17, 11, ink)
    for (let i = 0; i < 4; i++) box(c, x + 12, y + 36 + i * 10, (w - 26) * (.94 - (i % 3) * .11), 3, '#aaafbd', 2)
  }

  const names = ['Lia', 'Davi', 'Nara', 'Caio']
  const scores = [.95, .63, .89, .58]

  function candidate(c, x, y, i, highlight = false, w = 142) {
    box(c, x, y, w, 54, highlight ? '#193c38' : surface, 8, highlight ? mint : line)
    face(c, x + 24, y + 24, 12, i)
    label(c, names[i], x + 44, y + 18, 13)
    label(c, Math.round(scores[i] * 100) + '%', x + w - 10, y + 18, 11, highlight ? mint : muted, 'right')
    bar(c, x + 44, y + 35, w - 55, scores[i], highlight ? mint : lilac)
  }

  function chat(c, x, y, w, h, title, accent) {
    app(c, x, y, w, h, title, accent)
    box(c, x + 9, y + h - 22, w - 18, 13, surface, 6)
    oval(c, x + w - 17, y + h - 15, 4, 4, accent)
  }

  function bubble(c, p, x, y, w, message, answer = false, color = mint) {
    reveal(c, p, () => {
      box(c, x, y, w, 25, answer ? '#1d3e42' : '#253852', [8, 8, answer ? 2 : 8, answer ? 8 : 2])
      label(c, message, x + 9, y + 13, 11, answer ? color : white)
    })
  }

  function badge(c, x, y, r, color = amber) {
    poly(c, [[x - r * .62, y + 4], [x - r * .48, y + r * 1.64], [x, y + r * 1.25],
      [x + r * .51, y + r * 1.64], [x + r * .64, y + 4]], '#94614d')
    oval(c, x, y, r, r, color)
    oval(c, x, y, r * .68, r * .68, '#94614d')
    label(c, '✓', x, y, r * 1.1, color, 'center')
  }

  function flow(c, xs, ys, words, t, start = .12, gap = .14, w = 92) {
    xs.forEach((x, i) => {
      if (i) pathProgress(c, [xs[i - 1], ys[i - 1]], [x, ys[i]], ease(t, start + (i - 1) * gap, start + i * gap))
    })
    xs.forEach((x, i) => reveal(c, ease(t, start + i * gap, start + i * gap + .13), () => {
      chip(c, x - w / 2, ys[i] - 14, w, words[i], t > start + i * gap + .15)
    }))
  }

  function histogram(c, t, rows, { x = 38, y = 105, w = 400, spacing = 46, icons = false } = {}) {
    const largest = Math.max(...rows.map(row => row[1]))
    rows.forEach(([name, value, color, scale = largest], i) => {
      const p = ease(t, .15 + i * .13, .54 + i * .13)
      const yy = y + i * spacing
      if (icons) {
        box(c, x, yy - 9, 19, 19, color, 5)
        label(c, ['▷', '▧', '◌'][i], x + 9, yy, 12, ink, 'center')
      }
      label(c, name, x + (icons ? 29 : 0), yy, 13)
      label(c, Math.round(value * p).toLocaleString('pt-BR'), x + w, yy, 13, color, 'right')
      bar(c, x, yy + 13, w, p * value / scale, color)
    })
  }

  demos['13-G'] = (c, t) => {
    stage(c, 'Triagem de currículos', 'RECRUTAMENTO')
    chip(c, 25, 78, 156, 'Busque os perfis da vaga')
    for (let i = 3; i >= 0; i--) {
      const p = ease(t, .12 + i * .13, .47 + i * .13)
      const x = mix(46 + i * 7, 227 + i % 2 * 105, p)
      const y = mix(131 + i * 5, 109 + Math.floor(i / 2) * 67, p)
      if (p < .82) document(c, x, y, 79, 97, 'Currículo')
      if (p >= .64) reveal(c, range(p, .64, 1), () => candidate(c, x, y, i, t > .73 && i % 2 === 0, 101))
    }
    if (t > .12 && t < .77) stroke(c, [[206, 103], [206, 226]], mint, 2)
  }

  demos['13-E1'] = (c, t) => {
    stage(c, 'Documentos organizados', 'CURRÍCULOS')
    for (let i = 3; i >= 0; i--) {
      const p = ease(t, .06 + i * .1, .54 + i * .1)
      const x = mix(161 + i * 9, 73 + i % 2 * 173, p)
      const y = mix(102 + i * 7, 98 + Math.floor(i / 2) * 77, p)
      c.save()
      c.globalAlpha = 1 - range(p, .55, .93)
      document(c, x, y, 141, 92, 'Currículo ' + names[i])
      c.restore()
      reveal(c, range(p, .45, 1), () => candidate(c, x, y, i))
    }
  }

  demos['13-E2'] = (c, t) => {
    stage(c, 'Compatibilidade com a vaga', 'CRITÉRIOS')
    const criteria = ['Portfólio', 'Pesquisa', 'Colaboração']
    criteria.forEach((name, i) => {
      pathProgress(c, [148, 111 + i * 52], [314 - 21 * ease(t, .62, .9), 101 + (i % 2) * 88],
        ease(t, .18 + i * .11, .53 + i * .11))
      chip(c, 35, 97 + i * 52, 113, name, t > .32 + i * .11)
    })
    ;[0, 1, 2, 3].forEach(i => {
      const p = ease(t, .62, .9)
      c.save()
      c.globalAlpha = i % 2 ? 1 - .53 * p : 1
      candidate(c, 314 - (i % 2 ? 0 : 21 * p), 78 + i * 44, i, i % 2 === 0 && p > .25, 133)
      c.restore()
    })
  }

  function profile(c, x, y, w, h, t) {
    app(c, x, y, w, h, 'Perfil · Caderno de ideias', lilac)
    oval(c, x + 27, y + 48, 13, 13, lilac)
    label(c, 'Caderno de ideias', x + 48, y + 43, 12)
    label(c, '6 publicações', x + 48, y + 57, 9, muted)
    const thumb = (w - 30) / 3
    for (let i = 0; i < 6; i++) reveal(c, ease(t, i * .07, .38 + i * .07), () => {
      illustration(c, x + 9 + i % 3 * (thumb + 6), y + 71 + Math.floor(i / 3) * 39, thumb, 34, i + 1)
    })
  }

  const metrics = [['Alcance', 4200, mint, 5400], ['Publicações', 28, lilac, 42], ['Interações', 1240, amber, 1600]]

  demos['14-G'] = (c, t) => {
    stage(c, 'Métricas do perfil', 'REDES SOCIAIS')
    profile(c, 27, 82, 185, 170, t * 2)
    const x = mix(493, 224, ease(t, .21, .54))
    app(c, x, 82, 229, 170, 'Métricas · 30 dias')
    histogram(c, range(t, .28, .96), metrics, { x: x + 14, y: 122, w: 200, spacing: 43 })
  }

  const posts = [['Vida na serra', 2450, 1], ['Tipos de luz', 7240, 2], ['Cores de outono', 4320, 7]]
  function ranking(c, t, x, y, w) {
    const sort = ease(t, .4, .8)
    posts.forEach(([name, views, kind], i) => {
      const yy = y + mix(i, [2, 0, 1][i], sort) * 48
      box(c, x, yy, w, 43, '#253650', 5, line)
      illustration(c, x + 5, yy + 5, 45, 33, kind)
      label(c, name, x + 57, yy + 21, 11)
      label(c, Math.round(views * ease(t, .12, .76)).toLocaleString('pt-BR'),
        x + w - 9, yy + 21, 11, mint, 'right')
    })
  }

  demos['14-E1'] = (c, t) => {
    stage(c, 'Publicações mais vistas', 'VISUALIZAÇÕES')
    ranking(c, t, 90, 89, 300)
  }

  demos['14-E2'] = (c, t) => {
    stage(c, 'Visualizações por formato', 'REDES SOCIAIS')
    histogram(c, t, [['Vídeos', 7320, mint], ['Fotos', 5680, lilac], ['Stories', 4100, amber]], { icons: true })
  }

  demos['14-E3'] = (c, t) => {
    stage(c, 'Atividade do perfil', 'VISÃO GERAL')
    const p = ease(t, .09, .85)
    const points = Array.from({ length: 72 }, (_, i) =>
      [35 + i * 5.7, 207 - i * 1.14 + 15 * Math.sin(i / 8) + 9 * Math.cos(i / 4)])
    const drawn = points.slice(0, Math.max(2, Math.round(points.length * p)))
    for (let i = 0; i < 4; i++) stroke(c, [[35, 111 + i * 34], [440, 111 + i * 34]])
    poly(c, [[35, 213], ...drawn, [drawn.at(-1)[0], 213]], '#21454e')
    stroke(c, drawn, mint, 3)
    reveal(c, ease(t, .56, .94), () => {
      chip(c, 35, 222, 153, 'Alcance · 4.200', true)
      chip(c, 199, 222, 143, 'Visitas · 726')
    })
  }

  const vendors = ['Horizonte', 'Estação', 'Cedro']
  const traits = ['Catálogo', 'Atendimento', 'Entrega local', 'Área privada']
  const checks = [[1, 1, 1], [1, 1, 1], [1, 0, 1], [0, 0, 0]]

  function site(c, x, y, w, h, i) {
    app(c, x, y, w, h, vendors[i])
    illustration(c, x + 7, y + 32, w - 14, h - 49, [1, 6, 3][i], i)
    box(c, x + 8, y + h - 11, w * .67, 3, muted, 2)
  }

  function matrix(c, t, x, y, w, h, light = false) {
    const column = (w - 116) / 3
    const row = (h - 27) / 4
    const fg = light ? ink : white
    box(c, x, y, w, h, light ? '#f2eddf' : '#142236', 8)
    vendors.forEach((name, i) => label(c, name, x + 113 + column * (i + .5), y + 15, 10, fg, 'center'))
    traits.forEach((name, i) => {
      const yy = y + 27 + i * row
      const p = ease(t, .12 + i * .15, .4 + i * .15)
      box(c, x + 6, yy, w - 12, row - 3, light ? '#e5ded2' : surface, 4)
      if (i === 2 && t > .65) box(c, x + 6, yy, w - 12, row - 3, light ? '#fff0bd' : '#58442d', 4)
      label(c, name, x + 14, yy + row / 2, 11, fg)
      reveal(c, p, () => checks[i].forEach((ok, j) => label(c, ok ? '✓' : '—', x + 113 + column * (j + .5),
        yy + row / 2, 13, light ? '#175950' : mint, 'center')), 0, 4)
    })
  }

  demos['15-G'] = (c, t) => {
    stage(c, 'Relatório comparativo', 'PESQUISA')
    if (t < .51) {
      box(c, 38, 80, 404, 34)
      label(c, typing('Compare os três fornecedores.', t, .02, .24), 50, 97, 14)
      vendors.forEach((_, i) => reveal(c, ease(t, .12 + .08 * i, .34 + .06 * i),
        () => site(c, 39 + i * 137, 129, 126, 98, i)))
    } else {
      const p = range(t, .51, .97)
      matrix(c, p, 26, 81, 277, 164)
      histogram(c, p, [['Horizonte', 82, mint], ['Estação', 65, lilac], ['Cedro', 74, amber]],
        { x: 319, y: 109, w: 130, spacing: 43 })
    }
  }

  demos['15-E1'] = (c, t) => {
    stage(c, 'Sites em comparação', 'TRÊS FORNECEDORES')
    vendors.forEach((_, i) => {
      const p = ease(t, .08 + i * .11, .56 + i * .11)
      const x = 28 + i * 145
      reveal(c, p, () => site(c, x, 93, 133, 115, i), [-64, 0, 64][i], [24, -31, 24][i])
      reveal(c, ease(t, .53 + i * .09, .72 + i * .09), () => {
        label(c, ['R$ 40 · retirada', 'R$ 60 · entrega', 'R$ 50 · retirada'][i], x + 6, 228, 12, mint)
      })
    })
  }

  demos['15-E2'] = (c, t) => {
    stage(c, 'Matriz de diferenças', 'RECURSOS DOS FORNECEDORES')
    matrix(c, t, 35, 80, 410, 173)
  }

  demos['15-E3'] = (c, t) => {
    stage(c)
    const idx = t < .36 ? 0 : t < .68 ? 1 : 2
    const progress = Math.min(range(t, [0, .36, .68][idx], [.36, .68, 1][idx]), 1)
    const spread = mix(.15, 1, Math.min(1, progress * 5, idx === 2 ? 1 : (1 - progress) * 5))
    c.save()
    c.translate(240, 0)
    c.scale(spread, 1)
    c.translate(-240, 0)
    box(c, 98, 26, 284, 218, '#f4eee0', 8)
    if (idx === 0) {
      illustration(c, 113, 43, 254, 101, 1)
      label(c, 'Relatório comparativo', 116, 171, 22, ink)
      label(c, 'Três fornecedores fictícios', 116, 196, 12, '#526785')
    } else if (idx === 1) {
      label(c, '01  Recursos', 116, 51, 17, ink)
      matrix(c, progress * 1.5, 108, 73, 264, 152, true)
    } else {
      label(c, '02  Visão comparativa', 116, 51, 17, ink)
      ;[76, 107, 137].forEach((height, i) => {
        const h = height * ease(progress, .08 * i, .6 + .08 * i)
        box(c, 135 + i * 73, 195 - h, 43, h, ['#3d786a', '#6a5d9f', '#af733d'][i], 4)
        label(c, vendors[i], 158 + i * 73, 213, 11, ink, 'center')
      })
    }
    c.restore()
    label(c, String(idx + 1) + ' / 3', 448, 240, 11, muted, 'right')
  }

  demos['16-G'] = (c, t) => {
    stage(c, 'Atendimento em dois canais', 'ASSISTENTE')
    chat(c, 28, 80, 206, 168, 'Chat do site', mint)
    chat(c, 246, 80, 206, 168, 'Caixa de mensagens', lilac)
    bubble(c, ease(t, .1, .24), 40, 115, 157, 'Qual é o horário?')
    bubble(c, ease(t, .24, .39), 258, 115, 146, 'Vocês fazem entregas?')
    bubble(c, ease(t, .25, .33), 181, 153, 39, t < .48 ? '•••' : '✓', true)
    bubble(c, ease(t, .39, .51), 400, 153, 39, t < .65 ? '•••' : '✓', true, lilac)
    bubble(c, ease(t, .47, .62), 58, 185, 162, 'Das 9h às 18h.', true)
    bubble(c, ease(t, .63, .81), 274, 185, 165, 'Sim, em dias úteis.', true, lilac)
  }

  demos['16-E1'] = (c, t) => {
    stage(c, 'Conversa retomada', 'CONTEXTO ENTRE CANAIS')
    chat(c, 28, 80, 185, 163, 'Chat do site', mint)
    chat(c, 267, 80, 185, 163, 'Caixa de mensagens', lilac)
    bubble(c, ease(t, .08, .21), 40, 114, 160, 'Quero o catálogo.')
    const p = ease(t, .23, .67)
    if (p > 0 && p < 1) chip(c, mix(95, 300, p), 149 - 24 * Math.sin(p * Math.PI), 91, 'Contexto', true)
    bubble(c, ease(t, .62, .78), 278, 114, 160, 'Retomando seu pedido…', true, lilac)
    bubble(c, ease(t, .75, .92), 287, 152, 151, 'Aqui está o catálogo.', true, lilac)
  }

  function fullChat(c, title, accent = mint) {
    chat(c, 82, 35, 316, 204, title, accent)
    label(c, 'CONVERSA FICTÍCIA', 240, 17, 9, muted, 'center')
  }

  demos['16-E2'] = (c, t) => {
    stage(c)
    fullChat(c, 'Chat de orçamento')
    bubble(c, ease(t, .07, .22), 97, 74, 211, 'Pode enviar a proposta por aqui?')
    reveal(c, ease(t, .26, .58), () => {
      box(c, 172, 111, 209, 58, surface, 8, line)
      box(c, 182, 121, 37, 37, lilac, 6)
      label(c, 'PDF', 200, 140, 11, ink, 'center')
      label(c, 'Proposta-exemplo.pdf', 229, 140, 12)
    }, 34, 0)
    bubble(c, ease(t, .63, .87), 199, 181, 181, 'Proposta enviada ✓', true)
  }

  demos['16-E3'] = (c, t) => {
    stage(c)
    fullChat(c, 'Agendamento', lilac)
    bubble(c, ease(t, .06, .23), 97, 73, 190, 'Tem horário amanhã?')
    reveal(c, ease(t, .24, .42), () => {
      chip(c, 177, 120, 87, '10h')
      chip(c, 278, 120, 87, '14h', t > .65)
    })
    if (t > .39 && t < .82) {
      const p = ease(t, .39, .65)
      cursor(c, mix(388, 322, p), mix(187, 134, p), range(t, .65, .82))
    }
    bubble(c, ease(t, .65, .86), 197, 177, 185, 'Confirmado para 14h ✓', true)
  }

  demos['16-E4'] = (c, t) => {
    stage(c)
    fullChat(c, 'Atendimento com escopo')
    bubble(c, ease(t, .06, .2), 95, 70, 207, 'Qual é o telefone pessoal?')
    reveal(c, ease(t, .24, .42), () => {
      box(c, 306, 70, 75, 25, '#663243', 6)
      label(c, 'Restrito', 344, 83, 11, rose, 'center')
    })
    bubble(c, ease(t, .39, .63), 143, 112, 239, 'Posso enviar o canal público.', true)
    bubble(c, ease(t, .66, .91), 95, 160, 174, 'Pode ser. Obrigado!')
  }

  demos['16-E5'] = (c, t) => {
    stage(c)
    fullChat(c, 'Informações sobre entrega', lilac)
    bubble(c, ease(t, .07, .19), 99, 74, 145, 'Qual é o prazo?')
    if (t < .46) bubble(c, ease(t, .2, .3), 337, 112, 41, '•••', true, lilac)
    bubble(c, ease(t, .45, .62), 178, 112, 200, 'O prazo é de dois dias úteis.', true, lilac)
    bubble(c, ease(t, .63, .84), 165, 158, 213, 'Qual é a cidade de entrega?', true, lilac)
  }

  demos['17-G'] = (c, t) => {
    stage(c, 'Do manual ao automático', 'AUTOMAÇÃO DE PROCESSO')
    const p = ease(t, .24, .58)
    const xs = [100, 240, 380]
    xs.forEach((x, i) => {
      if (i) pathProgress(c, [xs[i - 1], 156], [x, 156], ease(t, .53 + (i - 1) * .13, .72 + (i - 1) * .13))
      const left = mix(110 + i * 54, x - 53, p)
      const top = mix(94 + i * 29, 126, p)
      app(c, left, top, 106, 63, ['Planilha', 'Arquivos', 'E-mail'][i])
      bar(c, left + 11, top + 38, 81, ease(t, .56 + .11 * i, .72 + .11 * i))
    })
    if (t < .28) cursor(c, mix(117, 347, range(t, 0, .28)), 160 + 15 * Math.sin(t * 25))
    reveal(c, ease(t, .82, .98), () => chip(c, 162, 215, 156, '✓ Resultado entregue', true))
  }

  demos['17-E1'] = (c, t) => {
    stage(c, 'Relatório de três planilhas', 'CONSOLIDAÇÃO')
    app(c, 268, 81, 184, 165, 'Relatório')
    for (let i = 0; i < 3; i++) {
      const y = 83 + i * 55
      const p = ease(t, .14 + i * .17, .44 + i * .17)
      box(c, 36, y, 133, 42, '#263b4c', 6, line)
      label(c, ['Norte', 'Centro', 'Sul'][i], 46, y + 13, 11)
      for (let j = 0; j < 4; j++) box(c, 46 + j * 29, y + 25, 23, 8, '#4d7082', 2)
      pathProgress(c, [169, y + 21], [268, 124 + i * 25], p)
      if (p > 0 && p < 1) oval(c, mix(169, 268, p), mix(y + 21, 124 + i * 25, p), 4, 4, mint)
      reveal(c, ease(p, .7, 1), () => label(c, ['Norte      28', 'Centro    37', 'Sul          45'][i], 283, 124 + i * 25, 13))
    }
    reveal(c, ease(t, .79, .96), () => chip(c, 281, 205, 153, 'Total · 110', true))
  }

  demos['17-E2'] = (c, t) => {
    stage(c, 'Variações da mesma imagem', 'PRODUÇÃO EM LOTE')
    illustration(c, 29, 105, 117, 109, 3)
    label(c, 'Imagem-base', 88, 228, 11, muted, 'center')
    pathProgress(c, [154, 156], [206, 156], ease(t, .09, .32))
    for (let i = 0; i < 6; i++) {
      const x = 209 + i % 3 * 83
      const y = 87 + Math.floor(i / 3) * 77
      box(c, x, y, 76, 68, ink, 6, line)
      reveal(c, ease(t, .16 + i * .1, .35 + i * .1), () => illustration(c, x, y, 76, 68, 3, i))
    }
  }

  demos['17-E3'] = (c, t) => {
    stage(c, 'Pedidos no mesmo fluxo', 'FILA AUTOMÁTICA')
    flow(c, [94, 239, 385], [134, 134, 134], ['Receber', 'Conferir', 'Registrar'], t * 2)
    for (let i = 0; i < 3; i++) {
      const p = ease(t, .12 + i * .19, .49 + i * .19)
      const x = mix(46, 361, p)
      const y = mix(214 - i * 15, 196 + i * 12, p) - 56 * Math.sin(p * Math.PI)
      chip(c, x, y, 66, p > .93 ? '✓ 0' + (i + 1) : 'Pedido 0' + (i + 1), p > .93, 19)
    }
  }

  function meeting(c, t, focus) {
    stage(c, 'Sessão de mentoria', 'CHAMADA COMPARTILHADA')
    const active = Math.min(2, Math.floor(t * 3))
    const xs = [69, 218, 366]
    xs.forEach((x, i) => {
      box(c, x - 25, 76, 94, 55, '#283851', 8, i === active ? mint : line)
      face(c, x - 6, 103, 12, i)
      label(c, ['Lia', 'Davi', 'Nara'][i], x + 12, 103, 12)
    })
    box(c, 37, 142, 406, 107, '#142236', 7, line)
    label(c, 'Tela compartilhada', 51, 157, 10, muted)
    if (focus === 0) {
      flow(c, [109, 239, 370], [198, 198, 198], ['Ler', 'Organizar', 'Entregar'], t, .19, .2)
    } else {
      flow(c, [109, 239, 370], [198, 198, 198], ['Ler', 'Organizar', 'Entregar'], focus === 2 ? 1 : .5 + t * .5, .03, .23)
      if (focus === 1) {
        cursor(c, mix(125, 98, ease(t, .06, .56)), mix(229, 197, ease(t, .06, .56)))
        label(c, 'Lia', mix(139, 112, ease(t, .06, .56)), 228, 10, mint)
        cursor(c, mix(312, 230, ease(t, .25, .72)), mix(235, 201, ease(t, .25, .72)))
        label(c, 'Davi', mix(328, 246, ease(t, .25, .72)), 229, 10, lilac)
      } else {
        oval(c, 109 + 261 * ease(t, .1, .79), 217, 5, 5, mint)
        reveal(c, ease(t, .7, .9), () => label(c, '✓ Execução concluída', 371, 233, 11, mint, 'center'))
      }
    }
  }

  demos['18-G'] = (c, t) => meeting(c, t, 0)
  demos['18-E1'] = (c, t) => meeting(c, t, 1)
  demos['18-E2'] = (c, t) => meeting(c, t, 2)

  function training(c, t, stagger, showAccess) {
    app(c, 31, 80, 418, 171, 'Painel de formação')
    ;[0, 1, 2].forEach(i => {
      const y = 121 + i * 48
      const p = ease(t, .12 + i * .08, stagger[i])
      face(c, 53, y + 8, 10, i)
      label(c, names[i], 73, y, 12)
      if (showAccess) label(c, t > .07 + i * .1 ? 'Acesso ativo' : 'Sem acesso', 115, y, 10, t > .07 + i * .1 ? mint : muted)
      bar(c, 73, y + 12, 264, p)
      label(c, Math.round(p * 100) + '%', 377, y + 11, 11, p >= 1 ? mint : muted, 'right')
      reveal(c, ease(t, stagger[i] - .02, stagger[i] + .13), () => badge(c, 413, y + 6, 12), 0, -14)
    })
  }

  demos['19-G'] = (c, t) => {
    stage(c, 'Acesso e avanço nas aulas', 'PAINEL DE FORMAÇÃO')
    training(c, t, [.63, 1.22, 1.4], true)
  }

  demos['19-E1'] = (c, t) => {
    stage(c, 'Licença atribuída', 'ACESSO À TRILHA')
    candidate(c, 35, 145, 0)
    const p = ease(t, .15, .55)
    chip(c, 43, mix(91, 206, p), 128, p < .95 ? 'Licença disponível' : '✓ Acesso ativo', p > .95)
    reveal(c, ease(t, .52, .85), () => {
      app(c, 213, 90, 235, 151, 'Primeira aula')
      illustration(c, 225, 124, 211, 104, 6)
      oval(c, 331, 175, 19, 19, white)
      poly(c, [[326, 166], [341, 175], [326, 184]], ink)
    }, 24)
  }

  demos['19-E2'] = (c, t) => {
    stage(c, 'Medalhas por conclusão', 'PROGRESSO COLETIVO')
    training(c, t, [.43, .62, .8], false)
  }

  demos['19-E3'] = (c, t) => {
    stage(c, 'Trilha de formação', 'QUATRO ETAPAS')
    const points = [[68, 201], [175, 134], [282, 200], [401, 132]]
    points.forEach((point, i) => {
      const p = ease(t, .08 + i * .17, .34 + i * .17)
      if (i) pathProgress(c, points[i - 1], point, p)
      reveal(c, p, () => {
        if (i === 3) badge(c, ...point, 18 + 5 * p)
        else {
          oval(c, ...point, 15, 15, mint)
          label(c, '0' + (i + 1), ...point, 11, ink, 'center')
        }
        label(c, ['Introdução', 'Prática', 'Projeto', 'Conquista'][i], point[0], point[1] + 35, 12, white, 'center')
      })
    })
  }

  function tile(c, x, y, w, h, i) {
    box(c, x, y, w, h, palettes[i % 8][0], 5)
    if (i % 3 === 1) {
      badge(c, x + w / 2, y + h * .43, Math.min(w, h) * .23)
    } else {
      const r = Math.min(w, h) * .23
      oval(c, x + w * .5, y + h * .65, r * 1.35, r * .85, palettes[(i + 2) % 8][1])
      face(c, x + w * .5, y + h * .42, r, i)
    }
  }

  function mural(c, t, mode) {
    stage(c)
    const p = ease(t, .03, .9)
    const tracking = mode === 3
    const tileWidth = tracking ? 85 : 61
    const tileHeight = tracking ? 82 : 50
    const rows = tracking ? 2 : 4
    const cols = tracking ? 12 : 7
    c.save()
    if (mode === 1) {
      c.translate(240, 141)
      const scale = mix(5.1, 1, p)
      c.scale(scale, scale)
      c.translate(-240, -mix(116, 141, p))
    }
    for (let i = 0; i < rows * cols; i++) {
      const row = Math.floor(i / cols)
      const col = i % cols
      const x = 8 + col * (tileWidth + 6) - (tracking ? 470 * t * (row ? 1 : .78) : 0)
      const y = (tracking ? 57 : 34) + row * (tileHeight + 7)
      if (mode === 1 || tracking) tile(c, x, y, tileWidth, tileHeight, i)
      else {
        const delay = mode === 2 ? ((col >= 4 ? 1 : 0) + (row >= 2 ? 2 : 0)) * .15 + (col + row) * .015 : (col + row) * .065
        const q = ease(t, delay, delay + .23)
        reveal(c, q, () => {
          const shrink = mode === 2 ? 7 * (1 - q) : 0
          tile(c, x + shrink, y + shrink, tileWidth - shrink * 2, tileHeight - shrink * 2, i)
        }, 0, mode === 2 ? 0 : 12)
      }
    }
    c.restore()
    box(c, 0, 0, W, 30, ink, 0)
    label(c, 'MURAL DE CONQUISTAS', 18, 16, 10, amber)
  }

  demos['20-G'] = (c, t) => mural(c, t, 0)
  demos['20-E1'] = (c, t) => mural(c, t, 1)
  demos['20-E2'] = (c, t) => mural(c, t, 2)
  demos['20-E3'] = (c, t) => mural(c, t, 3)

  function galleryGrid(c, t, focus = -1) {
    const kinds = ['Miniatura', 'Paisagem', 'Infográfico', 'Produto', 'Desenho', 'Moda', '3D', 'Pôster']
    kinds.forEach((name, i) => {
      const x = 26 + i % 4 * 109
      const y = 82 + Math.floor(i / 4) * 86
      const p = ease(t, i * .06, .28 + i * .06)
      reveal(c, p, () => {
        box(c, x, y, 101, 78, surface, 6, i === focus ? mint : line)
        illustration(c, x + 3, y + 3, 95, 53, i)
        label(c, name, x + 9, y + 67, 10, i === focus ? mint : white)
      })
    })
  }

  demos['21-G'] = (c, t) => {
    stage(c, 'Da instrução à galeria', 'GERAÇÃO DE IMAGENS')
    const p = ease(t, .55, .83)
    if (t > .55) {
      c.save()
      c.translate(240, 161)
      c.scale(1 + .18 * (1 - p), 1 + .18 * (1 - p))
      c.translate(-240, -161)
      galleryGrid(c, range(t, .55, .95))
      c.restore()
    }
    if (p < 1) reveal(c, 1 - p, () => {
      chip(c, 27, 83, 194, typing('Uma serra ao amanhecer', t, .02, .29))
      box(c, 240, 83, 211, 148, surface, 7, line)
      const height = 148 * ease(t, .25, .58)
      if (height > 1) windowClip(c, 240, 83, 211, height, () => illustration(c, 240, 83, 211, 148, 1), 0)
    }, 0, 0)
  }

  demos['21-E1'] = (c, t) => {
    stage(c, 'Composição de uma thumbnail', 'DUAS REFERÊNCIAS')
    tile(c, 30, 79, 118, 73, 0)
    label(c, 'Retrato', 35, 143, 10)
    box(c, 30, 167, 118, 72, '#302a47', 6, line)
    oval(c, 55, 194, 13, 16, '#766b9d')
    label(c, 'NOVO', 75, 187, 14)
    label(c, 'OLHAR', 75, 204, 12, amber)
    label(c, 'Esboço', 35, 231, 10, muted)
    pathProgress(c, [148, 112], [215, 154], ease(t, .08, .47))
    pathProgress(c, [148, 193], [215, 154], ease(t, .2, .55), lilac)
    reveal(c, ease(t, .45, .83), () => illustration(c, 215, 96, 235, 135, 0), 28, 0)
  }

  demos['21-E2'] = (c, t) => {
    stage(c, 'Um frasco, três cenários', 'FOTOGRAFIA DE PRODUTO')
    ;['Floresta', 'Água', 'Rua noturna'].forEach((name, i) => {
      const x = 28 + 144 * i
      reveal(c, ease(t, .05 + i * .19, .36 + i * .19), () => {
        illustration(c, x, 95, 134, 128, 3, i)
        label(c, name, x + 67, 241, 12, white, 'center')
      }, 22, 0)
    })
  }

  demos['21-E3'] = (c, t) => {
    stage(c, 'Oito estilos de imagem', 'GALERIA DE REFERÊNCIAS')
    galleryGrid(c, .83 + t * .17, Math.min(7, Math.floor(t * 8)))
  }

  demos['22-G'] = (c, t) => {
    stage(c, 'Do pedido ao arquivo', 'FLUXO AUTOMÁTICO')
    chip(c, 34, 88, 174, 'Resuma este documento')
    flow(c, [73, 185, 295, 409], [160, 160, 160, 160], ['Receber', 'Ler', 'Resumir', 'Entregar'], t, .1, .15)
    const p = ease(t, .34, .79)
    if (p > 0) oval(c, mix(73, 409, p), 186, 5, 5, mint)
    reveal(c, ease(t, .76, .96), () => {
      box(c, 309, 205, 139, 42, '#204940', 7, mint)
      box(c, 321, 214, 17, 23, '#e3eee7', 2)
      for (let i = 0; i < 3; i++) box(c, 325, 221 + i * 4, 9, 1, '#688482', 1)
      label(c, 'Resumo.pdf ✓', 347, 226, 11, mint)
    })
  }

  demos['22-E1'] = (c, t) => {
    stage(c, 'Modelo integrado', 'BIBLIOTECA DE AUTOMAÇÕES')
    box(c, 28, 81, 424, 60, '#142236', 8, line)
    chip(c, 53, 97, 115, 'Planilha')
    chip(c, 309, 97, 115, 'Mensagem')
    const p = ease(t, .15, .65)
    pathProgress(c, [147, 196], [325, 196], ease(t, .62, .95))
    chip(c, 48, 182, 100, 'Entrada', p > .9)
    chip(c, 325, 182, 100, 'Entrega', t > .8)
    chip(c, 183, mix(97, 182, p), 115, 'Resumo', p > .5)
  }

  demos['22-E2'] = (c, t) => {
    stage(c, 'Passagem de tarefas', 'AGENTES EM EQUIPE')
    const p = ease(t, .13, .78)
    ;['Leitura', 'Checagem', 'Síntese'].forEach((name, i) => {
      const x = 28 + 145 * i
      const complete = p >= i / 3 + .17
      box(c, x, 87, 134, 97, surface, 7, complete ? mint : line)
      face(c, x + 67, 113, 14, i)
      label(c, name, x + 67, 142, 12, white, 'center')
      label(c, complete ? '✓ Concluído' : 'Aguardando', x + 67, 163, 10, complete ? mint : muted, 'center')
    })
    if (p < 1) chip(c, mix(47, 362, p), 188, 73, 'Tarefa', true, 25)
    reveal(c, ease(t, .73, .94), () => chip(c, 131, 217, 218, '✓  ✓  ✓   Documento final', true))
  }

  demos['22-E3'] = (c, t) => {
    stage(c, 'Resumo extraído do PDF', 'LEITURA DE DOCUMENTO')
    document(c, 44, 90, 144, 144, 'Pesquisa.pdf')
    const p = ease(t, .12, .72)
    if (p < 1) stroke(c, [[44, mix(95, 228, p)], [188, mix(95, 228, p)]], '#66a7b9', 3)
    app(c, 215, 90, 224, 144, 'Resumo')
    ;['42 respostas fictícias', 'Prazo mais citado: 2 dias', 'Próxima etapa: validação'].forEach((name, i) => {
      reveal(c, ease(p, .16 + i * .19, .39 + i * .19), () => label(c, name, 231, 131 + 24 * i, 12))
    })
    reveal(c, ease(t, .72, .92), () => label(c, '✓ Leitura concluída', 232, 211, 11, mint))
  }

  function phone(c, x, y, w, h) {
    box(c, x, y, w, h, '#091424', 13, '#748caa')
    box(c, x + 6, y + 12, w - 12, h - 23, '#253650', 7)
    box(c, x + w * .36, y + 6, w * .28, 3, '#748caa', 2)
  }

  function smallApp(c, x, y, w, h, p) {
    illustration(c, x, y, w, h * .47, 6)
    label(c, 'Novo projeto', x + 7, y + h * .6, w < 100 ? 10 : 14)
    chip(c, x + 5, y + h * .7, w - 10, p > .7 ? '✓ Salvo' : 'Salvar', p > .7, 23)
  }

  demos['23-G'] = (c, t) => {
    stage(c, 'Um app em duas telas', 'DO PEDIDO À INTERFACE')
    box(c, 31, 77, 416, 28, surface, 5, line)
    label(c, typing('Crie um app para salvar projetos.', t, .02, .29), 44, 91, 12)
    reveal(c, ease(t, .25, .53), () => {
      app(c, 47, 118, 252, 128, 'Projetos')
      smallApp(c, 58, 151, 230, 84, t)
    })
    reveal(c, ease(t, .47, .72), () => {
      phone(c, 320, 108, 101, 144)
      smallApp(c, 332, 130, 77, 105, t)
    }, 45, 0)
  }

  demos['23-E1'] = (c, t) => {
    stage(c, 'Cadastro de novo contato', 'LANDING PAGE')
    app(c, 29, 82, 263, 167, 'Página de inscrição')
    illustration(c, 41, 114, 239, 49, 1)
    box(c, 41, 172, 239, 25, '#101c2b', 5, line)
    label(c, typing('lia@example.com', t, .09, .54), 53, 185, 12)
    chip(c, 154, 206, 126, 'Cadastrar', t > .61)
    if (t > .43 && t < .79) {
      const p = ease(t, .43, .61)
      cursor(c, mix(99, 213, p), mix(187, 223, p), range(t, .61, .79))
    }
    app(c, 304, 82, 146, 167, 'Contatos')
    reveal(c, ease(t, .64, .93), () => {
      face(c, 334, 146, 16)
      label(c, 'Lia', 360, 143, 13)
      label(c, '✓ Novo contato', 318, 188, 11, mint)
    })
  }

  demos['23-E2'] = (c, t) => {
    stage(c, 'Seleção de imóveis', 'BUSCA COM FILTRO')
    chip(c, 28, 79, 145, t > .28 ? 'Filtro · 2 quartos' : 'Todos os imóveis', t > .28)
    const p = ease(t, .28, .7)
    ;['Casa Cedro', 'Loft Rio', 'Vila Sol'].forEach((name, i) => {
      const x = 29 + i * 146 + (i === 2 ? -67 * p : i === 0 ? 23 * p : 0)
      const y = i === 1 ? 122 + p * 26 : 122 - p * 7
      c.save()
      c.globalAlpha = i === 1 ? 1 - .88 * p : 1
      box(c, x, y, 130, 88, surface, 6, i !== 1 && p > .8 ? mint : line)
      illustration(c, x + 5, y + 5, 120, 55, i % 2 ? 6 : 1, i)
      label(c, name, x + 8, y + 73, 11)
      c.restore()
    })
    reveal(c, ease(t, .68, .91), () => chip(c, 238, 213, 208, '✓ Duas opções enviadas', true))
  }

  demos['23-E3'] = (c, t) => {
    stage(c, 'Vistoria concluída', 'APLICATIVO DE CAMPO')
    app(c, 58, 77, 364, 164, 'Vistoria fictícia · Unidade A')
    ;['Iluminação', 'Portas', 'Ventilação'].forEach((name, i) => {
      const y = 115 + i * 36
      const p = ease(t, .12 + i * .17, .28 + i * .17)
      box(c, 73, y, 334, 30, surface, 5)
      box(c, 82, y + 7, 16, 16, p > .5 ? mint : line, 3)
      if (p > .5) label(c, '✓', 90, y + 15, 12, ink, 'center')
      label(c, name, 110, y + 15, 12)
    })
    reveal(c, ease(t, .68, .89), () => chip(c, 230, 214, 179, '✓ Vistoria enviada', true), 0, 25)
  }

  demos['23-E4'] = (c, t) => {
    stage(c, 'Quadro de tarefas', 'ANDAMENTO DO PROJETO')
    const items = [['Roteiro', 0, .13], ['Revisão', 1, .44], ['Capas', 0, .46]]
    const columns = items.map(([, column, start]) => {
      const steps = column ? (t > start ? 1 : 0) : (t > start + .48 ? 2 : t > start ? 1 : 0)
      return column + steps
    })
    ;['A fazer', 'Em curso', 'Concluído'].forEach((name, i) => {
      const x = 28 + i * 145
      box(c, x, 84, 133, 153, '#142236', 7, line)
      label(c, name, x + 10, 103, 12)
      label(c, columns.filter(column => column === i).length, x + 119, 103, 11, mint, 'right')
    })
    items.forEach(([name, column, start], i) => {
      const p = ease(t, start, start + .25) + (column ? 0 : ease(t, start + .48, start + .69))
      chip(c, 36 + (column + p) * 145, 121 + i * 33, 117, name, column + p > 1.95, 25)
    })
  }

  const lessons = ['01  Conceito', '02  Prática', '03  Projeto', '04  Revisão']

  function lessonList(c, t, x, y, w) {
    lessons.forEach((name, i) => chip(c, x, y + i * 34, w, name, t >= .11 + i * .18, 27))
  }

  demos['24-G'] = (c, t) => {
    stage(c, 'Trilha e projeto assistido', 'FORMAÇÃO')
    lessonList(c, t, 30, 82, 141)
    app(c, 185, 81, 267, 162, 'Projeto da trilha')
    reveal(c, ease(t, .18, .47), () => illustration(c, 198, 118, 241, 110, 6))
    bubble(c, ease(t, .48, .61), 200, 129, 139, 'Como salvo o projeto?')
    bubble(c, ease(t, .65, .91), 233, 175, 201, 'Escolha Exportar no menu.', true)
  }

  demos['24-E1'] = (c, t) => {
    stage(c)
    fullChat(c, 'Tutor de projetos')
    bubble(c, ease(t, .05, .22), 99, 72, 225, 'Como configuro a saída?')
    bubble(c, ease(t, .22, .45), 146, 112, 233, 'Selecione o tamanho em Exportar.', true)
    reveal(c, ease(t, .46, .84), () => {
      box(c, 140, 150, 240, 55, surface, 7, line)
      illustration(c, 145, 155, 64, 45, 6)
      label(c, 'Aula · Configurar a saída', 222, 178, 12)
    }, 26, 0)
  }

  demos['24-E2'] = (c, t) => {
    stage(c, t < .58 ? 'Biblioteca de cursos' : 'Trilha de montagem', 'FORMAÇÃO')
    if (t < .58) {
      const p = ease(t, .36, .58)
      ;['Montagem', 'Cor', 'Som', 'Roteiro'].forEach((name, i) => {
        reveal(c, ease(t, .02 + i * .06, .22 + i * .06) * (i ? 1 - p : 1), () => {
          const x = 31 + i * 108 + (i ? 0 : 61 * p)
          illustration(c, x, 92, 96 + (i ? 0 : p * 110), 126, [6, 7, 2, 1][i])
          label(c, name, x + 48, 236, 12, white, 'center')
        })
      })
    } else {
      lessonList(c, range(t, .58, .96), 121, 86, 238)
    }
  }

  demos['24-E3'] = (c, t) => {
    stage(c, 'Correção com suporte', 'PROJETO ASSISTIDO')
    app(c, 29, 82, 266, 161, 'Projeto')
    illustration(c, 42, 118, 240, 110, 6)
    chip(c, 55, 191, 212, t < .73 ? 'Arquivo sem destino' : '✓ Exportação concluída', t > .73)
    const p = ease(t, .12, .4) * (1 - ease(t, .63, .85))
    reveal(c, p, () => {
      chat(c, 230, 86, 220, 153, 'Suporte', lilac)
      bubble(c, ease(t, .18, .38), 242, 122, 170, 'A exportação não inicia.')
      bubble(c, ease(t, .4, .58), 246, 160, 191, 'Escolha a pasta de destino.', true)
    }, 110, 0)
  }

  demos['RM26-13-01'] = (c, t) => {
    stage(c, 'Uma vaga, muitas inscrições', 'RECRUTAMENTO')
    const p = ease(t, .07, .95)
    box(c, 25, 214, 430, 26, '#465572', 6)
    face(c, 366, 140, 39, 0, p)
    label(c, String(Math.round(500 * p)), 35, 133, 59, p > .8 ? amber : white)
    label(c, 'inscrições recebidas', 36, 181, 13, muted)
    for (let i = 0; i < 14; i++) {
      reveal(c, ease(t, .1 + i * .05, .18 + i * .05), () => {
        box(c, 200 + (i % 4) * 6, 211 - i * 4, 102, 12, '#f3ecdb', 2, '#b3a9b1')
      }, -20, -19)
    }
  }

  demos['RM26-13-02'] = (c, t) => {
    stage(c, 'De 500 a 3 perfis', 'TRIAGEM DE CANDIDATURAS')
    const p = ease(t, .13, .81)
    const steps = ['Experiência', 'Portfólio', 'Horário']
    ;[142, 108, 74].forEach((w, i) => {
      const x = 141 - w / 2
      const y = 111 + i * 34
      poly(c, [[x, y], [x + w, y], [x + w - 15, y + 29], [x + 15, y + 29]], p > i * .32 ? '#2c6759' : surface)
      label(c, steps[i], 141, y + 14, 10, white, 'center')
    })
    label(c, String([500, 126, 24, 3][Math.min(3, Math.floor(p * 4))]), 141, 91, 21, mint, 'center')
    for (let i = 0; i < 6; i++) {
      const q = range(t, .05 + i * .07, .55 + i * .07)
      if (q > 0 && q < 1) box(c, 69 + i * 13 + q * 42, 78 + q * 119, 8, 9, '#f4e7cb', 2)
    }
    ;[0, 2, 1].forEach((i, j) => reveal(c, ease(t, .58 + j * .09, .77 + j * .09), () =>
      candidate(c, 265, 79 + j * 60, i, true, 150), 24))
  }

  demos['RM26-14-01'] = (c, t) => {
    stage(c, 'Rolagem sem encontrar um padrão', 'FEED DE PUBLICAÇÕES')
    face(c, 135, 161, 53, 2, ease(t, .25, .87))
    phone(c, 269, 75, 128, 172)
    windowClip(c, 275, 87, 116, 149, () => {
      for (let i = 0; i < 7; i++) illustration(c, 281, 96 + i * 65 - t * 268, 104, 58, i)
    })
    for (let i = 0; i < 3; i++) reveal(c, ease(t, .29 + .17 * i, .5 + .17 * i), () =>
      label(c, '?', 90 + 50 * i, 104 + 11 * (i % 2), 20 + 7 * i, amber, 'center'), 0, -12)
  }

  demos['RM26-14-02'] = (c, t) => {
    stage(c, 'Resultados viram pauta', 'PLANEJAMENTO DE CONTEÚDO')
    ranking(c, t * 1.85, 29, 88, 219)
    reveal(c, ease(t, .43, .74), () => {
      app(c, 260, 88, 190, 146, 'Pauta para gravar')
      label(c, 'Tema · Tipos de luz', 271, 131, 11)
      label(c, 'Abertura · Mesmo objeto', 271, 160, 11)
      label(c, 'Cena · Mudar a luz lateral', 271, 185, 11)
      label(c, '✓ Pauta pronta', 272, 215, 11, mint)
    }, 34, 0)
  }

  demos['RM26-15-01'] = (c, t) => {
    stage(c, 'Cinco conversas de uma vez', 'FILA DE ATENDIMENTO')
    box(c, 24, 79, 432, 172, '#523c41', 8)
    for (let i = 0; i < 5; i++) {
      const x = 39 + 81 * i
      const y = 100 + 22 * (i % 2)
      phone(c, x, y, 67, 99)
      const alerts = Math.floor(ease(t, .09 + .08 * i, .8 + .04 * i) * (i + 2))
      if (alerts > 0) {
        oval(c, x + 51, y + 24, 9, 9, rose)
        label(c, alerts, x + 51, y + 24, 9, ink, 'center')
      }
      if (i === 1) bar(c, x + 11, y + 58, 45, ease(t, .2, .79), mint)
    }
    const p = ease(t, .24, .72)
    const hx = mix(89, 153, p)
    const hy = mix(281, 218, p)
    stroke(c, [[hx - 15, hy + 39], [hx, hy]], '#bb846e', 24)
    oval(c, hx, hy, 13, 17, '#d9a082')
    stroke(c, [[hx + 2, hy], [hx + 8, hy - 31 + 8 * Math.sin(t * 34)]], '#d9a082', 8)
  }

  demos['RM26-15-02'] = (c, t) => {
    stage(c, 'O pedido muda de conversa', 'ATENDIMENTO')
    chat(c, 28, 82, 206, 161, 'Loja do Vale', rose)
    chat(c, 246, 82, 206, 161, 'Loja da Serra', mint)
    bubble(c, ease(t, .04, .22), 39, 116, 170, 'Tem esse item disponível?')
    const p = range(t, .13, .68)
    oval(c, 133, 177, 19, 19, '#654356')
    stroke(c, [[133, 177], [133 + 13 * Math.sin(p * tau), 177 - 13 * Math.cos(p * tau)]], rose, 2)
    bubble(c, ease(t, .49, .66), 258, 115, 170, 'Tem esse item disponível?')
    bubble(c, ease(t, .66, .85), 266, 153, 175, 'Sim. Pedido confirmado!', true)
  }

  demos['RM26-15-03'] = (c, t) => {
    stage(c)
    fullChat(c, 'Compra por mensagem')
    bubble(c, ease(t, .04, .16), 97, 70, 179, 'Posso comprar por aqui?')
    bubble(c, ease(t, .19, .32), 183, 105, 197, 'Sim, veja o link de exemplo.', true)
    reveal(c, ease(t, .34, .52), () => chip(c, 224, 135, 156, 'Abrir pagamento ↗', t > .55, 23))
    bubble(c, ease(t, .57, .72), 97, 163, 191, '✓ Comprovante recebido')
    bubble(c, ease(t, .74, .92), 181, 191, 199, 'Pagamento confirmado ✓', true)
  }

  demos['RM26-15-04'] = (c, t) => {
    stage(c, 'Cinco níveis de capacidade', 'AGENTE CONVERSACIONAL')
    const p = clamp(t / .92) * 4
    const step = Math.min(4, Math.floor(p))
    const hop = p - step
    ;['Conversar', 'Consultar', 'Agendar', 'Manter escopo', 'Ver lacunas'].forEach((name, i) => {
      const x = 28 + i * 85
      const y = 225 - i * 24
      box(c, x, y, 79, 23 + i * 24, step >= i ? '#234c4b' : surface, 4, step === i ? mint : line)
      label(c, name, x + 39, y + 14, 9, step >= i ? mint : muted, 'center')
    })
    face(c, 68 + p * 85, 203 - p * 24 - 28 * Math.sin(hop * Math.PI), 13, 2)
  }

  demos['RM26-15-05'] = (c, t) => {
    stage(c, 'Resposta encontrada na base', 'ATENDIMENTO COM CONTEXTO')
    chat(c, 28, 81, 229, 169, 'Atendimento', mint)
    bubble(c, ease(t, .07, .22), 39, 115, 168, 'Qual é o prazo de troca?')
    const active = Math.min(2, Math.floor(range(t, .15, .61) * 3))
    ;['Catálogo', 'Entregas', 'Trocas · 15 dias'].forEach((name, i) => {
      chip(c, 280, 88 + i * 44, 161, name, i === active && t > .15)
    })
    pathProgress(c, [280, 190], [250, 164], ease(t, .57, .72))
    bubble(c, ease(t, .63, .76), 62, 153, 183, 'O prazo é de 15 dias.', true)
    bubble(c, ease(t, .77, .93), 39, 189, 115, 'Obrigado!')
  }

  demos['RM26-15-06'] = (c, t) => {
    stage(c, 'Evolução de capacidade', 'AGENTE CONVERSACIONAL')
    if (t < .29) {
      face(c, 240, 153, 47, 1)
      label(c, 'Conversa inicial', 240, 221, 15, muted, 'center')
    } else {
      face(c, 113, 149, 39, 1)
      ;['Conhecimento', 'Ferramentas', 'Autonomia'].forEach((name, i) => {
        const p = ease(t, .31 + i * .13, .49 + i * .13)
        pathProgress(c, [159, 154], [251, 107 + i * 45], p)
        chip(c, 250, 93 + i * 45, 177, name, p > .75)
      })
      reveal(c, ease(t, .75, .95), () => chip(c, 57, 214, 132, 'Tarefa concluída ✓', true))
    }
  }

  demos['25-G'] = (c, t) => {
    const boost = ease(t, .45, .72)
    const track = t * 8 + Math.max(0, t - .47) ** 2 * 16
    const sky = c.createLinearGradient(0, 0, 0, H)
    sky.addColorStop(0, '#100e28')
    sky.addColorStop(1, '#293164')
    c.fillStyle = sky
    c.fillRect(0, 0, W, H)
    for (let i = 0; i < 68; i++) {
      const x = (i * 141 + 2) % W
      const y = (i * 47 + 7) % 161
      stroke(c, [[x, y], [x + (x - 240) * boost * .12, y + (y - 111) * boost * .12 + 1]], '#aab9e0', 1)
    }
    oval(c, 84, 88, 37, 37, '#553f79')
    oval(c, 381, 63, 28, 28, '#845a6e')
    stroke(c, [[342, 71], [395, 52], [424, 59]], '#b98ca6', 2)
    const bend = 27 * Math.sin(t * 8)
    const near = (lane, z) => [240 + (1 - z) * bend + lane * (9 + 254 * z), 109 + z * 202]
    poly(c, [near(-1, 0), near(1, 0), near(1, 1), near(-1, 1)], '#243d5c')
    for (const side of [-1, 1]) stroke(c, [near(side, 0), near(side, 1)], lilac, 3)
    for (let i = 0; i < 9; i++) {
      const z = ((i + track) % 9 / 9) ** 2
      for (const lane of [-.35, .35]) {
        stroke(c, [near(lane, z), near(lane, z + .028)], i % 2 ? mint : lilac, 1 + z * 2)
      }
    }
    for (let i = 0; i < 3; i++) {
      const z = ((i * 3 + track) % 9 / 9) ** 2
      const [left, y] = near(-.76, z)
      const [right] = near(.76, z)
      const height = 10 + 108 * z
      stroke(c, [[left, y], [left + height * .24, y - height], [right - height * .24, y - height], [right, y]],
        i === 1 ? amber : lilac, 1 + z * 4)
      if (i === 1 && z > .15) label(c, 'TURBO', (left + right) / 2, y - height - 9, 8 + z * 10, amber, 'center')
    }
    const x = 240 + 24 * Math.sin(t * 8)
    poly(c, [[x - 10, 233], [x - 4, 255 + 11 * boost], [x + 4, 255 + 11 * boost], [x + 10, 233]], boost > .4 ? amber : mint)
    poly(c, [[x, 187], [x + 27, 231], [x + 16, 243], [x, 237], [x - 16, 243], [x - 27, 231]], '#dce6ff')
    poly(c, [[x, 194], [x + 9, 224], [x, 230], [x - 9, 224]], '#5872a9')
    box(c, 19, 17, 129, 43, '#191e38', 7, '#56679a')
    label(c, Math.round(330 + t * 265 + boost * 544) + ' km/h', 31, 39, 19, boost > .4 ? amber : mint)
  }

  const blocks = Array.from({ length: 49 }, (_, i) => ({
    x: i % 7 - 3, y: Math.floor(i / 7) - 3, height: 7 + ((i * 7) % 13) * 3, index: i,
  })).filter(block => block.index % 5 !== 0)

  demos['25-E1'] = (c, t) => {
    stage(c)
    const angle = -.56 + 1.1 * t
    const sin = Math.sin(angle)
    const cos = Math.cos(angle)
    const project = (x, y, h = 0) => {
      const u = x * cos - y * sin
      const v = x * sin + y * cos
      return [238 + u * 37, 152 + v * 21 - h]
    }
    poly(c, [project(-4, -4), project(4, -4), project(4, 4), project(-4, 4)], '#305749')
    for (let i = -3.5; i < 4; i++) {
      stroke(c, [project(i, -4), project(i, 4)], '#1b303b', 6)
      stroke(c, [project(-4, i), project(4, i)], '#1b303b', 6)
    }
    blocks.slice().sort((a, b) => (a.x - b.x) * sin + (a.y - b.y) * cos).forEach(({ x, y, height, index }) => {
      const a = project(x - .33, y - .33, height)
      const b = project(x + .33, y - .33, height)
      const d = project(x - .33, y + .33, height)
      const e = project(x + .33, y + .33, height)
      const power = index === 41
      poly(c, [b, e, project(x + .33, y + .33), project(x + .33, y - .33)], '#435a76')
      poly(c, [d, e, project(x + .33, y + .33), project(x - .33, y + .33)], '#576b83')
      poly(c, [a, b, e, d], power ? amber : index % 2 ? '#a7baca' : '#839ec2')
      if (power) label(c, 'Usina', e[0], e[1] - 3, 9, ink, 'center')
    })
    box(c, 19, 17, 136, 64, '#16243a', 7, line)
    label(c, 'VILA DO VALE', 30, 30, 11, mint)
    label(c, 'População    3.240', 30, 49, 10)
    label(c, 'Energia          84%', 30, 65, 10, amber)
  }

  const editWords = ['O', 'bruto', 'virou', 'um', 'vídeo.']
  const wordTimes = [0, .1, .33, .54, .68, 1]
  const frameWords = t => Math.max(0, wordTimes.findLastIndex(time => t >= time && time < 1))

  function waveform(c, x, y, w, h, progress, pause = false, count = 70) {
    for (let i = 0; i < count; i++) {
      const u = i / count
      const quiet = pause && u > .37 && u < .51
      const height = quiet ? 2 : h * (.14 + Math.abs(Math.sin(i * 1.77) * Math.cos(i * .29)) * .86)
      box(c, x + u * w, y + (h - height) / 2, Math.max(1, w / count * .5), height,
        quiet ? amber : u <= progress ? mint : '#607397', 2)
    }
  }

  function playhead(c, x, y, bottom, color = mint) {
    stroke(c, [[x, y + 5], [x, bottom]], color, 1.5)
    poly(c, [[x - 4, y], [x + 4, y], [x, y + 7]], color)
  }

  function editPage(c, width, height, p) {
    box(c, 0, 0, width, height, '#f5eee3', 5)
    box(c, 0, 0, width, 24, '#ded8e0', [5, 5, 0, 0])
    for (let i = 0; i < 3; i++) oval(c, 12 + i * 9, 12, 2.5, 2.5, '#8d829e')
    label(c, 'Guia de montagem', 44, 13, 10, '#463c58')
    label(c, 'Como dirigir a edição', 23, 61, 23, ink)
    stroke(c, [[23, 77], [width - 23, 77]], '#ccc4cb')
    label(c, 'Mostre o resultado nos primeiros segundos.', 24, 102, 12, ink)
    box(c, 22, 116, 252 * p, 18, '#ffe082', 1)
    label(c, 'Use a imagem para comprovar a ideia.', 24, 125, 12, ink)
    label(c, 'Deixe a ação guiar o ritmo.', 24, 147, 12, ink)
  }

  function editorWindow(c, x, y, w, h, t) {
    app(c, x, y, w, h, 'Estúdio de edição')
    const query = typing('Separe a abertura e a demonstração.', t, .14, .5)
    label(c, 'O que vamos editar?', x + 16, y + 46, 16)
    box(c, x + 15, y + 63, w - 30, 28, ink, 5, '#657aa1')
    label(c, query, x + 24, y + 77, 11)
    chip(c, x + w - 108, y + 100, 93, 'Gerar prévia', t > .6, 23)
    reveal(c, ease(t, .61, .87), () => {
      const col = (w - 36) / 3
      ;['Abertura', 'Demo', 'Fechamento'].forEach((word, i) => chip(c, x + 15 + (col + 3) * i, y + 135, col, word, false, 23))
    })
    if (t > .31 && t < .78) {
      const p = ease(t, .31, .61)
      cursor(c, mix(x + 47, x + w - 55, p), mix(y + 84, y + 112, p), range(t, .61, .78))
    }
  }

  demos['26-G'] = (c, t) => {
    host(c, t)
    const vignette = c.createLinearGradient(0, 0, W, 0)
    vignette.addColorStop(0, '#091328e0')
    vignette.addColorStop(.4, '#09132800')
    vignette.addColorStop(.6, '#09132800')
    vignette.addColorStop(1, '#091328e0')
    c.fillStyle = vignette
    c.fillRect(0, 0, W, H)
    for (let i = 0; i < 4; i++) {
      const x = i % 2 ? 347 : 19
      const y = i < 2 ? 58 : 146
      reveal(c, ease(t, .08 + i * .1, .29 + i * .1), () => {
        const kind = (i + (t > .57 + i * .08 ? 4 : 0)) % 8
        illustration(c, x, y, 113, 65, kind)
      }, i % 2 ? 95 : -95, 0)
    }
  }

  demos['26-E1'] = (c, t) => {
    host(c, t)
    const gradient = c.createLinearGradient(0, 173, 0, 270)
    gradient.addColorStop(0, '#11152700')
    gradient.addColorStop(1, '#111527e8')
    c.fillStyle = gradient
    c.fillRect(0, 173, W, 97)
    const words = ['O ritmo', 'muda', 'tudo.']
    c.font = '650 27px system-ui'
    const widths = words.map(word => c.measureText(word).width + 2)
    let x = (W - widths.reduce((total, width) => total + width, 16)) / 2
    words.forEach((word, i) => {
      const p = ease(t, .11 + i * .23, .25 + i * .23)
      if (p > 0) windowClip(c, x, 204, p * widths[i], 41, () =>
        label(c, word, x, 225, 27, i === 2 ? mint : white), 0)
      x += widths[i] + 8
    })
  }

  demos['26-E2'] = (c, t) => {
    const cut = t < .22 ? 0 : t < .43 ? 1 : t < .65 ? 2 : 3
    host(c, t, { zoom: [1, 1.24, 1.52, 1.06][cut], take: cut === 3 ? 1 : 0 })
    label(c, ['Plano médio', 'Punch-in · 124%', 'Punch-in · 152%', 'Segundo take'][cut], 20, 246, 11, mint)
  }

  demos['26-E3'] = (c, t) => {
    host(c, t, { point: ease(t, .09, .49) * (1 - ease(t, .73, .99)) })
    const p = ease(t, .29, .6)
    reveal(c, p, () => {
      c.translate(394, 78)
      c.rotate(-.23 + .17 * p)
      c.scale(.83 + .17 * p, .83 + .17 * p)
      box(c, -43, -37, 86, 78, '#423669', 9, lilac)
      poly(c, [[0, -26], [4, -14], [16, -10], [4, -6], [0, 6], [-4, -6], [-16, -10], [-4, -14]], lilac)
      label(c, 'Estúdio Luz', 0, 25, 12, white, 'center')
    }, 0, 32)
  }

  demos['26-E4'] = (c, t) => {
    stage(c)
    const zoom = 1 + .36 * ease(t, .17, .79)
    c.save()
    c.translate(240, 171)
    c.scale(zoom, zoom)
    c.translate(-166, -125)
    editPage(c, 332, 178, ease(t, .2, .82))
    c.restore()
  }

  demos['26-E5'] = (c, t) => {
    stage(c)
    const p = ease(t, .04, .44)
    const yaw = 1 - ease(t, .24, .86)
    const w = 333
    const h = 179
    const width = w * (1 - yaw * .2)
    const x0 = 240 - width / 2
    const y0 = 42 + (1 - p) * 61
    // A escala de cada faixa diminui em direção à borda mais distante.
    const top = q => y0 + yaw * q * 27
    const bottom = q => y0 + h - yaw * q * 21
    if (p <= 0) return
    c.save()
    c.globalAlpha = p
    for (let i = 0; i < 24; i++) {
      const left = i / 24
      const right = (i + 1) / 24
      const x = x0 + left * width
      const u = x0 + right * width
      c.save()
      c.beginPath()
      c.moveTo(x, top(left))
      c.lineTo(u + .6, top(right))
      c.lineTo(u + .6, bottom(right))
      c.lineTo(x, bottom(left))
      c.clip()
      const sx = width / w
      const sy = (bottom(left) - top(left)) / h
      const tilt = (top(right) - top(left)) * 24 / w
      c.transform(sx, tilt, 0, sy, x0, top(left) - tilt * left * w)
      editPage(c, w, h, 0)
      c.restore()
    }
    c.restore()
  }

  demos['26-E6'] = (c, t) => {
    stage(c, 'Do bruto ao vídeo final', 'FLUXO DE PRODUÇÃO')
    const nodes = [105, 160, 215]
    nodes.forEach((y, i) => {
      const p = ease(t, .17 + i * .1, .43 + i * .1)
      const q = ease(t, .5 + i * .1, .72 + i * .1)
      pathProgress(c, [104, 160], [194, y], p, i % 2 ? lilac : mint)
      pathProgress(c, [286, y], [370, 160], q, i % 2 ? lilac : mint)
      reveal(c, p, () => chip(c, 194, y - 14, 92, ['Cortes', 'Som', 'Motion'][i], p > .95))
    })
    chip(c, 25, 146, 79, 'Bruto')
    chip(c, 370, 146, 84, 'Vídeo final', t > .81)
  }

  demos['26-E7'] = (c, t) => {
    host(c, t)
    const vignette = c.createLinearGradient(0, 0, 291, 0)
    vignette.addColorStop(0, '#11172b')
    vignette.addColorStop(1, '#11172b00')
    c.fillStyle = vignette
    c.fillRect(0, 0, 291, H)
    label(c, 'O QUE ENTRA NO VÍDEO', 24, 82, 10, lilac)
    ;['Cortes', 'Efeitos sonoros', 'Animações'].forEach((word, i) => reveal(c, ease(t, .11 + i * .21, .29 + i * .21), () => {
      oval(c, 29, 115 + i * 33, 3, 3, mint)
      label(c, word, 42, 115 + i * 33, 19)
    }))
  }

  demos['26-E8'] = (c, t) => {
    stage(c)
    label(c, 'VOLUME DE PRODUÇÃO', 240, 63, 12, lilac, 'center')
    const p = ease(t, .06, .85)
    const value = Math.round(940 + 60 * p).toLocaleString('pt-BR')
    label(c, value, 240, 134, 83, p >= 1 ? mint : white, 'center', 'monospace')
    reveal(c, ease(t, .5, .76), () => label(c, 'frames revisados', 240, 202, 19, lilac, 'center'))
  }

  demos['26-E9'] = (c, t) => {
    host(c, t)
    const current = t < .48 ? 0 : 1
    reveal(c, ease(t, .07, .24), () => {
      chip(c, 313, 36, 141, current ? '02  A montagem' : '01  A gravação', true)
      const p = ease(t, .46, .6)
      const lengths = [mix(27, 6, p), mix(6, 27, p), 6, 6]
      let x = 353
      lengths.forEach((length, i) => {
        box(c, x, 77, length, 5, i === current ? mint : muted, 2)
        x += length + 5
      })
    }, 16, 0)
  }

  demos['26-E10'] = (c, t) => {
    host(c, t)
    ;['Ver o bruto', 'Escolher takes', 'Limpar pausas', 'Montar cena'].forEach((name, i) => {
      const start = .09 + i * .17
      const p = ease(t, start, start + .13)
      const ok = t > start + .21
      reveal(c, p, () => chip(c, i % 2 ? 327 : 25, 115 + Math.floor(i / 2) * 43, 126,
        (ok ? '✓  ' : '○  ') + name, ok), i % 2 ? 20 : -20)
    })
  }

  demos['26-E11'] = (c, t) => {
    stage(c, 'A equipe de edição', 'PAPÉIS DA PRODUÇÃO')
    const active = Math.floor(range(t, .07, .88) * 5.99)
    ;['Editor', 'Transcritor', 'Animação', 'Som', 'Finalizador', 'Direção de arte'].forEach((name, i) => {
      const x = 28 + i % 3 * 145
      const y = 83 + Math.floor(i / 3) * 82
      box(c, x, y, 134, 72, active === i ? '#21423d' : surface, 7, active === i ? mint : line)
      label(c, '0' + (i + 1), x + 12, y + 18, 10, i <= active ? mint : muted)
      label(c, i <= active ? name : 'Bloqueado', x + 12, y + 47, 13, i <= active ? white : muted)
    })
  }

  demos['26-E12'] = (c, t) => {
    stage(c)
    reveal(c, ease(t, 0, .15), () => editorWindow(c, 52, 44, 376, 181, t))
  }

  demos['26-E13'] = (c, t) => {
    host(c, t)
    const p = ease(t, .16, .84)
    reveal(c, ease(t, .06, .24), () => {
      box(c, 20, 83, 170, 107, ink, 8, line)
      label(c, 'VOZ PARA TEXTO', 31, 99, 10, lilac)
      waveform(c, 31, 116, 148, 28, p, false, 37)
      const phrase = ['O', 'bruto', 'virou', 'texto.']
      label(c, phrase.slice(0, Math.floor(p * 4.99)).join(' '), 31, 167, 15)
    })
  }

  demos['26-E14'] = (c, t) => {
    stage(c, 'Quatro takes. Um fica.', 'SELEÇÃO DE ABERTURA')
    ;['Primeira tentativa', 'Pausa longa', 'Frase incompleta', 'Versão escolhida'].forEach((name, i) => {
      const y = 79 + i * 42
      const decided = ease(t, .16 + i * .16, .29 + i * .16)
      reveal(c, ease(t, .02 + i * .06, .17 + i * .06), () => {
        box(c, 30, y, 420, 35, i === 3 && decided > .6 ? '#23483f' : surface, 7, line)
        label(c, 'TAKE ' + (i + 1), 44, y + 18, 10, i === 3 ? mint : lilac)
        label(c, name, 103, y + 18, 14, decided > .7 && i < 3 ? muted : white)
        if (i < 3 && decided > 0) stroke(c, [[102, y + 18], [102 + 122 * decided, y + 18]], rose, 1.5)
        if (decided > .7) label(c, i === 3 ? '✓ Escolhido' : '× Cortado', 434, y + 18, 11,
          i === 3 ? mint : rose, 'right')
      })
    })
  }

  demos['26-E15'] = (c, t) => {
    stage(c, 'Da fala à entrega', 'SEQUÊNCIA DE TRABALHO')
    const p = ease(t, .06, .85)
    const xs = [64, 181, 298, 415]
    stroke(c, [[64, 176], [415, 176]], line, 4)
    stroke(c, [[64, 176], [64 + 351 * p, 176]], mint, 4)
    oval(c, 64 + 351 * p, 176, 4, 4, mint)
    ;['Gravação', 'Transcrição', 'Montagem', 'Exportação'].forEach((word, i) => reveal(c,
      ease(t, [.06, .35, .52, .76][i], [.18, .46, .65, .91][i]), () => {
        box(c, xs[i] - 43, 116, 86, 51, i === 3 ? '#224c43' : surface, 6, line)
        label(c, '0' + (i + 1), xs[i], 129, 10, mint, 'center')
        label(c, word, xs[i], 150, 11, white, 'center')
      }))
  }

  demos['26-E16'] = (c, t) => {
    stage(c, 'Resultado e contexto', 'DUAS PROVAS NA TELA')
    ;['Resultado', 'Contexto'].forEach((word, i) => {
      const p = ease(t, .08 + i * .24, .36 + i * .24)
      reveal(c, p, () => {
        c.translate(132 + i * 216, 157)
        c.rotate((i ? 1 : -1) * (.18 - .08 * p))
        c.transform(1, 0, i ? -.08 : .08, 1, 0, 0)
        illustration(c, -89, -64, 178, 127, i ? 2 : 3)
        chip(c, -79, 31, 84, word, i === 0, 23)
      }, i ? 65 : -65, 0)
    })
  }

  demos['26-E17'] = (c, t) => {
    host(c, t)
    const p = ease(t, .18, .8)
    reveal(c, ease(t, .09, .29), () => {
      chip(c, 310, 189, 145, p >= 1 ? '✓ Prévia aprovada' : '◷ Exportando prévia', p >= 1)
      bar(c, 318, 226, 129, p, p >= 1 ? mint : lilac, 5)
    })
  }

  demos['26-E18'] = (c, t) => {
    stage(c, 'Busca na biblioteca', 'CONSULTA E RESULTADOS')
    reveal(c, ease(t, .04, .25), () => {
      box(c, 56, 90, 368, 41, '#25344d', 9, lilac)
      c.beginPath()
      c.arc(76, 109, 6, 0, tau)
      c.strokeStyle = mint
      c.lineWidth = 2
      c.stroke()
      stroke(c, [[81, 114], [87, 120]], mint, 2)
      label(c, typing('Como montar um vídeo curto?', t, .15, .59), 95, 111, 15)
    })
    ;['↳  Fluxo de edição', '↳  Ferramentas e exemplos'].forEach((word, i) => reveal(c,
      ease(t, .56 + i * .16, .73 + i * .16), () => {
        box(c, 68, 145 + 43 * i, 344, 33, surface, 6, line)
        label(c, word, 80, 161 + 43 * i, 12)
      }))
  }

  demos['26-E19'] = (c, t) => {
    stage(c, 'Exportação conferida', 'CONTROLE DE QUALIDADE')
    app(c, 36, 81, 408, 165, 'Terminal de verificação')
    ;['resolução  1920 × 1080', 'quadros    30 fps', 'cor        Rec. 709', 'áudio      estéreo'].forEach((row, i) => {
      const start = .08 + i * .17
      const y = 122 + i * 30
      if (t < start) return
      label(c, '› ' + typing(row, t, start, start + .17), 52, y, 13, white, 'left', 'monospace')
      if (t > start + .2) label(c, '✓ OK', 422, y, 12, mint, 'right', 'monospace')
      stroke(c, [[52, y + 13], [425, y + 13]], line)
    })
  }

  demos['26-E20'] = (c, t) => {
    stage(c, 'O que define a montagem', 'DIREÇÃO CRIATIVA')
    const points = [[91, 106], [91, 213], [389, 106], [389, 213]]
    points.forEach(([x, y], i) => {
      const p = ease(t, .1 + i * .15, .36 + i * .15)
      pathProgress(c, [240, 157], [x, y], p, i % 2 ? lilac : mint)
      reveal(c, ease(p, .66, 1), () =>
        chip(c, x - 62, y - 14, 124, ['Ritmo', 'Cor', 'Enquadramento', 'Som'][i], true))
    })
    chip(c, 187, 143, 106, 'Estilo', true)
  }

  demos['26-E21'] = (c, t) => {
    stage(c)
    windowClip(c, 23, 39, 133, 190, () => {
      c.translate(-84, 38)
      c.scale(.72, .72)
      host(c, t, { zoom: 1.2 })
    })
    label(c, 'APRESENTADOR', 89, 242, 9, muted, 'center')
    reveal(c, ease(t, .09, .24), () => editorWindow(c, 170, 39, 288, 190, t), 18)
  }

  demos['26-E22'] = (c, t) => {
    stage(c, 'Quanto custa por vídeo?', 'COMPARATIVO ILUSTRATIVO')
    ;[['Plano mensal', 'R$ 100'], ['Volume', '10 vídeos'], ['Custo por vídeo', 'R$ 10']].forEach(([name, value], i) => {
      const x = 27 + i * 145
      reveal(c, ease(t, .07 + i * .2, .27 + i * .2), () => {
        box(c, x, 103, 135, 112, i === 2 ? '#204b42' : surface, 9, i === 2 ? mint : line)
        label(c, name, x + 13, 128, 12, i === 2 ? mint : lilac)
        label(c, value, x + 13, 170, 22, i === 2 ? mint : white)
      }, 0, 25)
    })
  }

  demos['26-E23'] = (c, t) => {
    host(c, t)
    const p = ease(t, .15, .95)
    reveal(c, ease(t, .05, .24), () => {
      box(c, 24, 163, 432, 86, ink, 8, line)
      label(c, 'LINHA DO TEMPO', 38, 177, 9, lilac)
      for (let i = 0; i < 3; i++) box(c, 39 + 134 * i, 192, 129, 46, i === 1 ? '#35435d' : '#27364b', 4)
      const x = 39 + 400 * .37
      box(c, x, 191, 400 * .14, 48, '#544b3e', 2)
      label(c, '▼ Pausa', x + 5, 197, 9, amber)
      waveform(c, 39, 207, 400, 25, p, true)
      playhead(c, 39 + 400 * p, 186, 242)
    }, 0, 29)
  }

  demos['26-E24'] = (c, t) => {
    stage(c, 'Bruto e editado', 'COMPARATIVO DE COR')
    const p = ease(t, .12, .92)
    illustration(c, 28, 79, 424, 163, 1)
    box(c, 28, 79, 424, 163, '#5559639c', 0)
    if (p > 0) windowClip(c, 28, 79, 424 * p, 163, () => illustration(c, 28, 79, 424, 163, 1), 0)
    const x = 28 + 424 * p
    stroke(c, [[x, 79], [x, 242]], mint, 2)
    oval(c, x, 157, 12, 12, mint)
    label(c, '↔', x, 157, 12, ink, 'center')
    if (p > .23) chip(c, 37, 88, 78, 'Editado', true, 23)
    if (p < .77) chip(c, 361, 88, 78, 'Bruto', false, 23)
  }

  demos['26-E25'] = (c, t) => {
    stage(c)
    const shots = [1, 3, 6, 4, 2, 7]
    const shot = Math.min(shots.length - 1, Math.floor(t * 6))
    label(c, 'PROVAS', 27, 89, 12, lilac)
    label(c, '0' + (shot + 1), 25, 139, 48, mint)
    for (let i = 2; i >= 0; i--) {
      c.save()
      c.translate(278 + i * 8, 141 - i * 7)
      c.rotate((shot % 2 ? .045 : -.065) + i * .045)
      c.globalAlpha = 1 - i * .25
      illustration(c, -133, -83, 266, 166, shots[(shot + i) % shots.length])
      c.restore()
    }
  }

  demos['26-E26'] = (c, t) => {
    if (t < .17 || t >= .81) {
      host(c, t, { take: t >= .81 ? 1 : 0 })
    } else {
      const p = ease(t, .17, .5)
      const delta = t < .51 ? 21 * p : 0
      illustration(c, -delta, -delta, W + delta * 2, H + delta * 2, t < .51 ? 3 : 1)
    }
  }

  demos['26-E27'] = (c, t) => {
    stage(c, 'Da instrução aos arquivos', 'VÁRIAS SAÍDAS')
    ;['Transcrição', 'Lista de cortes', 'Prévia de vídeo'].forEach((name, i) => {
      const y = 99 + i * 56
      const p = ease(t, .12 + i * .16, .48 + i * .16)
      pathProgress(c, [161, 155], [296, y + 14], p, i % 2 ? lilac : mint)
      reveal(c, ease(p, .68, 1), () => chip(c, 296, y, 151, '↳  ' + name, true), 17)
    })
    chip(c, 34, 141, 128, 'Editar o take')
  }

  demos['26-E28'] = (c, t) => {
    host(c, t)
    reveal(c, ease(t, .06, .24), () => {
      box(c, 21, 173, 438, 78, ink, 8, line)
      const gap = 60
      for (let i = 0; i < 7; i++) {
        const sample = i / 6
        const x = 32 + i * gap
        fitted(c, x, 184, 55, 35, () => host(c, sample))
        label(c, (sample * 5).toFixed(1).replace('.', ',') + ' s', x + 27, 232, 9, muted, 'center')
      }
      playhead(c, 32 + 414 * t, 180, 240)
    }, 0, 29)
  }

  function timedWords(c, x, y, w, t, seconds) {
    const active = frameWords(t)
    editWords.forEach((word, i) => {
      const start = wordTimes[i]
      const width = w * (wordTimes[i + 1] - start)
      const xx = x + start * w
      box(c, xx, y, width - 3, 27, i === active ? '#235447' : surface, 4, i === active ? mint : line)
      label(c, word, xx + width / 2, y + 14, 11, i === active ? mint : white, 'center')
      if (seconds) label(c, (start * 5).toFixed(1).replace('.', ',') + ' s', xx, y + 38, 9, muted)
    })
  }

  demos['26-E29'] = (c, t) => {
    stage(c, 'Onda e transcrição alinhadas', 'SINCRONIA DA FALA')
    const x = 32
    const w = 416
    const p = range(t, .03, .96)
    waveform(c, x, 97, w, 66, p)
    timedWords(c, x, 178, w, p, false)
    playhead(c, x + w * p, 85, 215)
    label(c, 'Palavra ativa: ' + editWords[frameWords(p)], 32, 239, 12, mint)
  }

  demos['26-E30'] = (c, t) => {
    host(c, t)
    const x = 40
    const w = 400
    const p = range(t, .05, .94)
    box(c, 24, 158, 432, 96, '#111c2bea', 7, '#51708a')
    label(c, 'TEMPO MEDIDO DA FALA', x, 171, 9, lilac)
    waveform(c, x, 182, w, 15, p, false, 93)
    timedWords(c, x, 201, w, p, true)
    playhead(c, x + w * p, 176, 246, amber)
  }

  demos['26-E31'] = (c, t) => {
    stage(c, 'A emenda se fecha', 'CORTE DE PAUSA')
    const p = ease(t, .31, .67)
    const gap = 99 * (1 - p)
    const left = 50
    const middle = 191
    const right = middle + gap
    box(c, left, 129, 141, 62, '#304a6c', 5)
    box(c, right, 129, 140, 62, '#2e5c61', 5)
    waveform(c, left + 7, 146, 127, 28, 1, false, 29)
    waveform(c, right + 7, 146, 127, 28, 1, false, 31)
    if (gap > 1) {
      box(c, middle, 129, gap, 62, '#594737', 2)
      if (gap > 49) label(c, 'Pausa', middle + gap / 2, 159, 11, amber, 'center')
    }
    stroke(c, [[middle, 122], [middle, 199]], p >= 1 ? mint : amber, 2)
    const head = ease(t, .65, 1)
    if (head > 0) playhead(c, left + 280 * head, 121, 202)
    label(c, p >= 1 ? '✓ Emenda fechada' : 'Intervalo marcado', 241, 224, 13, p >= 1 ? mint : amber, 'center')
  }

  demos['26-E32'] = (c, t) => {
    stage(c, 'Três faixas, um master', 'COMPOSIÇÃO E EXPORTAÇÃO')
    const p = ease(t, .12, .55)
    ;['Imagem', 'Motion', 'Som'].forEach((word, i) => {
      const q = ease(t, .55 + i * .07, .85 + i * .06)
      reveal(c, 1 - q, () => {
        const x = 28 + q * 250
        const y = mix(86 + i * 50, 139, q)
        const w = 275 - q * 170
        const color = ['#506d98', '#63528e', '#357568'][i]
        box(c, x, y, w, 36, color, 6)
        label(c, word, x + 12, y + 18, 11)
        if (i === 0) illustration(c, x + 81, y + 5, w * .25, 26, 1)
        if (i === 1) for (let j = 0; j < 4; j++) oval(c, x + 84 + j * w * .1, y + 18, 3, 3, lilac)
        if (i === 2) waveform(c, x + 80, y + 9, w * .59, 18, p, false, 26)
      }, 0, 0)
    })
    if (t < .59) playhead(c, 97 + 203 * p, 79, 233)
    reveal(c, ease(t, .61, .91), () => {
      box(c, 332, 125, 121, 66, '#205249', 8, mint)
      label(c, 'VÍDEO FINAL', 392, 148, 11, mint, 'center')
      label(c, 'Master exportado', 392, 171, 11, white, 'center')
    })
  }

  demos['26-E33'] = (c, t) => {
    const p = ease(t, .16, .73)
    stage(c)
    if (p < .01) {
      host(c, t)
      return
    }
    const x = mix(240, 121, p)
    const y = mix(135, 139, p)
    const rx = mix(294, 91, p)
    const ry = mix(221, 110, p)
    c.save()
    c.beginPath()
    c.ellipse(x, y, rx, ry, 0, 0, tau)
    c.clip()
    const scale = mix(1, .81, p)
    c.translate(x - 240 * scale, y - 135 * scale)
    c.scale(scale, scale)
    host(c, t)
    c.restore()
    reveal(c, ease(t, .42, .88), () => {
      illustration(c, 233, 70, 219, 139, 2)
      chip(c, 247, 174, 139, 'Resultado da edição', true, 24)
    }, 43, 0)
  }

  demos['26-E34'] = (c, t) => {
    stage(c)
    windowClip(c, 21, 38, 183, 194, () => {
      c.translate(-60, 38)
      c.scale(.72, .72)
      host(c, t)
    })
    label(c, 'APRESENTADOR', 112, 247, 10, muted, 'center')
    const x = 218
    const p = ease(t, .41, .58)
    const times = [['Gravação', '02:30'], ['Revisão', '01:10'], ['Edição', '03:20']]
    const costs = [['Captação', 'R$ 40'], ['Pós-produção', 'R$ 60'], ['Total', 'R$ 100']]
    app(c, x, 38, 240, 194, t < .5 ? 'Tempo de produção' : 'Registro de custo')
    windowClip(c, x + 4, 65, 232, 157, () => {
      const rows = (data, offset) => data.forEach(([word, value], i) => {
        const y = 82 + i * 44
        box(c, x + 12 + offset, y, 215, 35, i === 2 && data === costs ? '#21423d' : surface, 6)
        label(c, word, x + 23 + offset, y + 18, 12)
        label(c, value, x + 215 + offset, y + 18, 12, mint, 'right')
      })
      rows(times, -238 * p)
      rows(costs, 238 * (1 - p))
    })
  }
})()

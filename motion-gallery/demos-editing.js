(() => {
  const demos = window.motionDemos ??= Object.create(null)
  const cream = '#f8f6ea'
  const violet = '#ae9aff'
  const ice = '#78f5dc'
  const lime = '#e1ff73'
  const orange = '#ff7e61'
  const cobalt = '#7199ff'
  const ink = '#101014'
  const tau = Math.PI * 2

  const clamp = x => Math.min(1, Math.max(0, x))
  const span = (t, start, end) => clamp((t - start) / (end - start))
  const smooth = x => x * x * (3 - 2 * x)
  const ease = (t, start, end) => smooth(span(t, start, end))
  const fly = (t, start, end) => 1 - (1 - span(t, start, end)) ** 3
  const mix = (a, b, x) => a + (b - a) * x

  function frame(c, x, y, sx, sy, angle, alpha, paint) {
    if (alpha <= 0 || sx <= 0 || sy <= 0) return
    c.save()
    c.translate(x, y)
    c.rotate(angle)
    c.scale(sx, sy)
    c.globalAlpha *= clamp(alpha)
    paint()
    c.restore()
  }

  function rect(c, x, y, w, h, color, radius = 0) {
    if (w <= 0 || h <= 0) return
    c.fillStyle = color
    if (!radius) return c.fillRect(x, y, w, h)
    c.beginPath()
    c.roundRect(x, y, w, h, radius)
    c.fill()
  }

  function ring(c, x, y, r, color, width = 0, a = 0, b = tau) {
    if (r <= 0 || b <= a) return
    c.beginPath()
    c.arc(x, y, r, a, b)
    if (width) {
      c.lineWidth = width
      c.strokeStyle = color
      c.stroke()
    } else {
      c.fillStyle = color
      c.fill()
    }
  }

  function path(c, points, color, width = 0) {
    c.beginPath()
    c.moveTo(...points[0])
    for (const point of points.slice(1)) c.lineTo(...point)
    if (width) {
      c.lineWidth = width
      c.lineCap = 'round'
      c.lineJoin = 'round'
      c.strokeStyle = color
      c.stroke()
    } else {
      c.closePath()
      c.fillStyle = color
      c.fill()
    }
  }

  function line(c, x1, y1, x2, y2, color, width = 1) {
    path(c, [[x1, y1], [x2, y2]], color, width)
  }

  function grad(c, x, y, endX, endY, from, to) {
    const paint = c.createLinearGradient(x, y, endX, endY)
    paint.addColorStop(0, from)
    paint.addColorStop(1, to)
    return paint
  }

  function text(c, value, x, y, size, color = cream, {
    align = 'center', weight = 700, family = 'system-ui', italic = false, maxWidth = 420
  } = {}) {
    c.fillStyle = color
    c.textAlign = align
    c.textBaseline = 'middle'
    c.font = (italic ? 'italic ' : '') + weight + ' ' + size + 'px ' + family
    c.fillText(value, x, y, maxWidth)
  }

  function mask(c, x, y, w, h, paint) {
    if (w <= 0 || h <= 0) return
    c.save()
    c.beginPath()
    c.rect(x, y, w, h)
    c.clip()
    paint()
    c.restore()
  }

  function spark(c, x, y, size, color) {
    path(c, [[x, y - size], [x + size * .23, y - size * .23], [x + size, y],
      [x + size * .23, y + size * .23], [x, y + size], [x - size * .23, y + size * .23],
      [x - size, y], [x - size * .23, y - size * .23]], color)
  }

  function check(c, x, y, size, p, color, width = 2.5) {
    const ax = x - size * .45
    const ay = y
    const bx = x - size * .12
    const by = y + size * .33
    if (p < .38) {
      const s = clamp(p / .38)
      if (s > 0) line(c, ax, ay, mix(ax, bx, s), mix(ay, by, s), color, width)
    } else {
      const s = (p - .38) / .62
      path(c, [[ax, ay], [bx, by], [mix(bx, x + size * .55, s), mix(by, y - size * .42, s)]], color, width)
    }
  }

  function ribbon(c, x, y, width, color, rotation = 0, waves = 2) {
    frame(c, x, y, 1, 1, rotation, 1, () => {
      c.beginPath()
      c.moveTo(-width / 2, -15)
      for (let i = 0; i <= 38; i++) {
        const q = i / 38
        c.lineTo(-width / 2 + q * width, Math.sin(q * Math.PI * waves) * 13 - 15)
      }
      for (let i = 38; i >= 0; i--) {
        const q = i / 38
        c.lineTo(-width / 2 + q * width, Math.sin(q * Math.PI * waves) * 13 + 15)
      }
      c.closePath()
      c.fillStyle = color
      c.fill()
    })
  }

  function tile(c, design, color) {
    mask(c, -38, -28, 76, 56, () => {
      rect(c, -38, -28, 76, 56, color)
      if (design === 0) {
        ring(c, -3, 6, 25, ink, 9)
        spark(c, 18, -12, 10, cream)
      } else if (design === 1) {
        for (let n = -2; n < 4; n++) line(c, n * 19 - 34, 30, n * 19 + 21, -30, ink, 7)
      } else if (design === 2) {
        for (let n = 0; n < 3; n++) ring(c, 14, -8, 10 + n * 9, ink, 2.5)
        ring(c, -18, 14, 9, cream)
      } else {
        path(c, [[-40, 20], [0, -25], [42, 20], [0, 36]], ink)
        path(c, [[-18, 19], [0, -1], [18, 19], [0, 33]], cream)
      }
    })
  }

  demos['26-G'] = (c, t) => {
    const colors = [ice, violet, orange, lime]
    const slots = [[117, 83], [363, 181], [364, 83], [116, 180]]
    slots.forEach(([x, y], i) => {
      const p = fly(t, .05 + i * .12, .32 + i * .12)
      const change = ease(t, .65 + i * .035, .80 + i * .035)
      const direction = Math.sign(x - 240)
      const phase = Math.abs(1 - 2 * change)
      frame(c, x + direction * 79 * (1 - p), y, Math.max(.03, phase), 1, direction * (1 - p) * .22, p, () => {
        tile(c, (i + (change > .5 ? 1 : 0)) % 4, colors[i])
      })
    })
  }

  demos['26-E1'] = (c, t) => {
    const words = ['O ritmo', 'muda', 'tudo.']
    const x = [97, 244, 366]
    words.forEach((word, i) => {
      const p = fly(t, .07 + i * .21, .28 + i * .21)
      const overshoot = Math.sin(p * Math.PI) * .08
      mask(c, x[i] - 79, 92, 158, 81, () => {
        frame(c, x[i], 137 + (1 - p) * 58, 1 + overshoot, 1 - overshoot, 0, p, () =>
          text(c, word, 0, 0, 41, i === 2 ? lime : cream, { weight: 820, maxWidth: 155 }))
      })
    })
  }

  function target(c, radius, color) {
    for (let i = 1; i <= 4; i++) ring(c, 0, 0, radius * i / 4, color, i === 4 ? 1 : 1.8)
    for (let i = 0; i < 12; i++) {
      const a = i * tau / 12
      line(c, Math.cos(a) * radius * .9, Math.sin(a) * radius * .9, Math.cos(a) * radius * 1.05, Math.sin(a) * radius * 1.05, color, 2)
    }
    spark(c, 0, 0, radius * .22, color)
  }

  demos['26-E2'] = (c, t) => {
    const jump = t < .26 ? 0 : t < .51 ? 1 : t < .76 ? 2 : 3
    const radius = [45, 75, 117, 56][jump]
    const color = [cream, ice, lime, cream][jump]
    const cutAt = [0, .26, .51, .76][jump]
    const snap = 1 - ease(t, cutAt, cutAt + .09)
    const p = fly(t, 0, .16)
    frame(c, 240, 135, 1, 1, (jump === 3 ? Math.PI / 12 : 0) + .16 * t, p, () => {
      if (jump > 0) {
        frame(c, snap * 7, 0, 1, 1, 0, .45 * snap, () => target(c, radius, orange))
        frame(c, -snap * 7, 0, 1, 1, 0, .45 * snap, () => target(c, radius, cobalt))
      }
      target(c, radius, color)
    })
  }

  demos['26-E3'] = (c, t) => {
    const p = fly(t, .08, .47)
    const swing = Math.sin(p * Math.PI) * .10
    const sheen = ease(t, .44, .77)
    frame(c, 240, 136 + 29 * (1 - p), .72 + .28 * p, .72 + .28 * p, -.24 * (1 - p) + swing, p, () => {
      rect(c, -120, -36, 240, 72, grad(c, -120, 0, 120, 0, '#7455fa', violet), 36)
      ring(c, -79, 0, 24, '#1a1240')
      spark(c, -79, 0, 13, cream)
      text(c, 'EM FOCO', -44, 0, 31, ink, { align: 'left', weight: 820 })
      if (sheen > 0 && sheen < 1) ring(c, -79, 0, 25 + sheen * 23, '#e7dbff', 1.5 * (1 - sheen))
    })
  }

  demos['26-E4'] = (c, t) => {
    const grow = ease(t, .06, .68)
    const stroke = ease(t, .26, .73)
    frame(c, 240, 137, .79 + .21 * grow, .79 + .21 * grow, -.05, fly(t, .02, .20), () => {
      const phrase = 'OLHA O CORTE.'
      c.font = '870 48px system-ui'
      const edge = Math.min(215, c.measureText(phrase).width / 2 + 9)
      const width = 2 * edge * stroke
      text(c, phrase, 0, 0, 48, cream, { weight: 870 })
      if (width > 0) {
        c.save()
        path(c, [[-edge, -23], [-edge + width, -28], [-edge + width + 3, 18], [-edge - 4, 20]], lime)
        c.clip()
        text(c, phrase, 0, 0, 48, ink, { weight: 870 })
        c.restore()
      }
    })
  }

  demos['26-E5'] = (c, t) => {
    const p = fly(t, .07, .81)
    const height = 110 * (.28 + .72 * p)
    const near = mix(144, 118, p)
    const far = mix(58, 118, p)
    frame(c, 240, 161 - p * 26, 1, 1, -.15 * (1 - p), p, () => {
      const top = -height / 2
      const bottom = height / 2
      const base = grad(c, -118, top, 116, bottom, cobalt, '#e4defa')
      path(c, [[-far, top], [far, top], [near, bottom], [-near, bottom]], base)
      for (let i = 0; i < 5; i++) {
        const a = i * .18 + .05
        const b = a + .048
        const l = mix(far, near, a)
        const r = mix(far, near, b)
        path(c, [[-l, mix(top, bottom, a)], [l, mix(top, bottom, a)], [r, mix(top, bottom, b)], [-r, mix(top, bottom, b)]], ink)
      }
      line(c, -near, bottom, near, bottom, cream, 1)
    })
  }

  function curvePoints(x0, y0, x1, y1, progress) {
    return Array.from({ length: 30 }, (_, i) => {
      const q = i * progress / 29
      return [mix(x0, x1, q), mix(y0, y1, smooth(q))]
    })
  }

  demos['26-E6'] = (c, t) => {
    const colors = [cobalt, violet, ice]
    const ys = [73, 135, 197]
    ys.forEach((y, i) => {
      const p = ease(t, .07 + i * .065, .70 + i * .065)
      if (!p) return
      const shape = curvePoints(83, y, 370, 135, p)
      const paint = grad(c, 82, y, 372, 135, colors[i], cream)
      path(c, shape, paint, 2 + i * .4)
      ring(c, 83, y, 6, colors[i])
      ring(c, ...shape.at(-1), 4.5, cream)
    })
    const flash = fly(t, .75, .95)
    if (flash) {
      ring(c, 370, 135, 12 + 14 * flash, '#f8f6ea70', 1)
      spark(c, 370, 135, 14 * flash, cream)
    }
  }

  demos['26-E7'] = (c, t) => {
    const words = ['Corte', 'Cor', 'Som']
    words.forEach((word, i) => {
      const p = fly(t, .11 + i * .17, .36 + i * .17)
      const y = 78 + i * 56
      mask(c, 61, y - 24, 270, 50, () => {
        frame(c, 74, y + (1 - p) * 35, 1, 1, 0, p, () => {
          spark(c, 0, 0, 6, i === 1 ? violet : ice)
          text(c, word, 25, 0, 48, cream, { align: 'left', family: 'Georgia', italic: true })
        })
      })
    })
  }

  demos['26-E8'] = (c, t) => {
    const p = fly(t, .08, .90)
    const targets = [11, 20, 30, 40]
    targets.forEach((goal, i) => {
      const q = fly(t, .10 + (3 - i) * .065, .75 + (3 - i) * .065)
      const place = [128, 202, 266, 330][i]
      const wheel = q * goal
      const digit = Math.floor(wheel + .00001)
      const shift = wheel - digit
      mask(c, place - 33, 86, 66, 90, () => {
        text(c, String(digit % 10), place, 130 - shift * 82, 79, cream, { family: 'monospace' })
        text(c, String((digit + 1) % 10), place, 212 - shift * 82, 79, cream, { family: 'monospace' })
      })
    })
    ring(c, 161, 156, 4, ice)
    text(c, 'QUADROS', 240, 201, 16, ice, { weight: 650 })
    line(c, 99, 179, 99 + 266 * p, 179, '#bfc1b080', 1)
  }

  demos['26-E9'] = (c, t) => {
    const p = ease(t, .05, .94)
    const chapter = Math.min(3, Math.floor(p * 3.92))
    const reveal = fly(t, .04, .24)
    frame(c, 240, 121, 1, 1, 0, reveal, () => {
      text(c, 'Capítulo ' + String(chapter + 1).padStart(2, '0'), 0, 0, 44, cream, { family: 'Georgia', italic: true })
      const bars = Array.from({ length: 4 }, (_, i) => 8 + 32 * Math.max(0, 1 - Math.abs(p * 3 - i)))
      const total = bars.reduce((sum, w) => sum + w, 0) + 27
      let x = -total / 2
      for (const [i, w] of bars.entries()) {
        rect(c, x, 45, w, 5, i === chapter ? lime : '#d0c9bb63', 2.5)
        x += w + 9
      }
    })
  }

  demos['26-E10'] = (c, t) => {
    const words = ['Cortar', 'Sincronizar', 'Exportar']
    words.forEach((word, i) => {
      const p = fly(t, .06 + .14 * i, .31 + .14 * i)
      const mark = ease(t, .26 + .16 * i, .53 + .16 * i)
      const y = 79 + 55 * i
      frame(c, 144 - 28 * (1 - p), y, 1, 1, 0, p, () => {
        ring(c, 0, 0, 15, mark > .98 ? lime : '#edeadc96', 1.6)
        check(c, 0, 0, 20, mark, lime)
        text(c, word, 36, 0, 33, cream, { align: 'left', weight: 670 })
      })
    })
  }

  demos['26-E11'] = (c, t) => {
    const colors = [cobalt, violet, ice, lime, orange, cream]
    colors.forEach((color, i) => {
      const p = fly(t, .04 + i * .11, .28 + i * .11)
      const flip = ease(t, .05 + i * .11, .37 + i * .11)
      frame(c, 144 + i % 3 * 96, 89 + Math.floor(i / 3) * 86, Math.max(.02, flip), .8 + .2 * flip, -.3 * (1 - flip), p, () => {
        const sides = 3 + i
        const points = Array.from({ length: sides }, (_, k) => {
          const a = k * tau / sides - Math.PI / 2
          return [Math.cos(a) * 30, Math.sin(a) * 30]
        })
        path(c, points, color)
        ring(c, 0, 0, 10, ink, 2)
        ring(c, 0, 0, 2.5, ink)
      })
    })
  }

  demos['26-E12'] = (c, t) => {
    const p = ease(t, .07, .50)
    const fire = ease(t, .47, .84)
    const fade = 1 - ease(t, .71, .94)
    const x = mix(99, 240, p)
    const y = mix(183, 133, p) + 22 * Math.sin(Math.PI * p)
    frame(c, x, y, 1, 1, -.20 * (1 - p), 1 - fire * .5, () =>
      path(c, [[-6, -19], [16, 8], [3, 5], [-3, 18]], cream))
    if (fire > 0) {
      if (fade > 0) ring(c, 240, 133, 17 + 61 * fire, '#fff7e8', 2 * fade)
      for (let i = 0; i < 8; i++) {
        const a = i * tau / 8
        const r = mix(14, 90, fire)
        frame(c, 240 + Math.cos(a) * r, 133 + Math.sin(a) * r, 1, 1, a, fade,
          () => rect(c, 0, -1.5, 17 - 10 * fire, 3, i % 2 ? violet : lime, 1.5))
      }
      spark(c, 240, 133, 23 * fire, violet)
    }
  }

  function wave(c, x, y, width, height, total, progress, offColor, onColor, phase = 0) {
    for (let i = 0; i < total; i++) {
      const q = i / (total - 1)
      const envelope = .2 + .8 * Math.sin(q * Math.PI) ** .65
      const amplitude = 4 + height * (.14 + .86 * Math.abs(Math.sin(i * 1.76 + phase) * Math.cos(i * .51 + .7))) * envelope
      rect(c, x + q * width, y - amplitude / 2, 2.4, amplitude, q <= progress ? onColor : offColor, 1.2)
    }
  }

  demos['26-E13'] = (c, t) => {
    const p = span(t, .08, .82)
    const spread = ease(t, .12, .66)
    wave(c, 91, 103 - 13 * spread, 296, 65, 58, p, '#78f5dc33', ice, .3)
    const phrase = ['A forma', 'vira', 'voz.']
    phrase.forEach((word, i) => {
      const mark = fly(t, .23 + i * .17, .45 + i * .17)
      const x = [137, 245, 339][i]
      mask(c, x - 65, 134, 130, 54, () => {
        frame(c, x, 159 + (1 - mark) * 34, 1, 1, 0, mark,
          () => text(c, word, 0, 0, 32, i === 2 ? ice : cream, { family: 'Georgia', italic: true }))
      })
    })
  }

  demos['26-E14'] = (c, t) => {
    const words = ['Primeira', 'Segunda', 'Terceira', 'Final']
    words.forEach((word, i) => {
      const p = fly(t, .06 + i * .072, .30 + i * .072)
      const strike = ease(t, .29 + i * .13, .49 + i * .13)
      const final = i === 3
      const x = final ? 221 + ease(t, .65, .89) * 28 : 221
      const y = 67 + 44 * i
      frame(c, x, y, 1, 1, 0, p * (final ? 1 : 1 - .58 * strike), () => {
        text(c, word, 0, 0, final ? 45 : 31, final ? lime : cream, { family: 'Georgia', italic: true })
        if (!final) line(c, -72, 3, -72 + 150 * strike, -4, orange, 3)
        else check(c, 75, 0, 21, ease(t, .62, .91), lime)
      })
    })
  }

  demos['26-E15'] = (c, t) => {
    const p = ease(t, .08, .9)
    const first = 78
    const width = 324
    const x = first + width * p
    line(c, first, 138, first + width, 138, '#e4e2dc30', 1.4)
    if (p > 0) line(c, first, 138, x, 138, ice, 2)
    for (let i = 0; i < 4; i++) {
      const q = fly(p, i / 3 - .13, i / 3 + .02)
      const dotX = first + i * width / 3
      ring(c, dotX, 138, 8, '#e4e2dc6b', 1.2)
      frame(c, dotX, 138, q, q, Math.PI / 4, q, () => rect(c, -8, -8, 16, 16, ice, 1.4))
      frame(c, dotX, 101 + 12 * (1 - q), 1, 1, 0, q, () => text(c, '0' + (i + 1), 0, 0, 20, cream, { family: 'monospace' }))
    }
    ring(c, x, 138, 3, cream)
  }

  function engraving(c, width, color, invert = false) {
    mask(c, -width / 2, -65, width, 130, () => {
      rect(c, -width / 2, -65, width, 130, color)
      for (let i = -6; i <= 6; i++) {
        if (invert) ring(c, 37, 30, 16 + Math.abs(i + 6) * 9, ink, .7 + .11 * i)
        else line(c, i * 18 - 52, 65, i * 18 + 14, -65, ink, 1.6)
      }
      spark(c, -22, -8, 17, cream)
    })
  }

  demos['26-E16'] = (c, t) => {
    const a = fly(t, .08, .56)
    const b = fly(t, .25, .74)
    frame(c, 156 - 67 * (1 - a), 132 + 38 * (1 - a), 1, 1, -.19 - .40 * (1 - a), a,
      () => engraving(c, 132, cobalt))
    frame(c, 307 + 68 * (1 - b), 140 + 43 * (1 - b), 1, 1, .15 + .38 * (1 - b), b,
      () => engraving(c, 132, orange, true))
  }

  demos['26-E17'] = (c, t) => {
    const p = ease(t, .08, .65)
    const morph = ease(t, .62, .82)
    const w = mix(252, 52, morph)
    const h = mix(5, 52, morph)
    const pAlpha = fly(t, .01, .15)
    frame(c, 240, 133, 1, 1, 0, pAlpha, () => {
      rect(c, -w / 2, -h / 2, w, h, '#c8e3da31', h / 2)
      rect(c, -w / 2, -h / 2, w * p, h, lime, h / 2)
      if (morph > 0) check(c, 0, 0, 28, ease(t, .72, .96), ink, 4)
    })
  }

  demos['26-E18'] = (c, t) => {
    const phrase = 'Onde começa?'
    const count = Math.floor(span(t, .08, .56) * (phrase.length + 1))
    const typed = phrase.slice(0, count)
    text(c, typed, 76, 99, 38, cream, { align: 'left', weight: 610 })
    const x = 79 + c.measureText(typed).width
    if (t < .67 && Math.sin(t * 59) > -.24) rect(c, x + 4, 83, 2, 32, violet)
    ;['No olhar.', 'No próximo corte.'].forEach((lineText, i) => {
      const p = fly(t, .54 + .15 * i, .77 + .15 * i)
      mask(c, 74, 124 + i * 40, 320, 38, () => {
        frame(c, 77 + 20 * (1 - p), 144 + i * 40, 1, 1, 0, p,
          () => text(c, lineText, 0, 0, 26, i ? violet : ice, { align: 'left', family: 'Georgia', italic: true }))
      })
    })
  }

  demos['26-E19'] = (c, t) => {
    const specs = [['RES', '1920 × 1080'], ['FPS', '24.00'], ['COR', 'REC.709'], ['SOM', '−14 LUFS']]
    specs.forEach(([name, value], i) => {
      const y = 72 + 40 * i
      const p = fly(t, .06 + i * .135, .30 + i * .135)
      const verified = ease(t, .23 + i * .135, .47 + i * .135)
      frame(c, 98, y + 11 * (1 - p), 1, 1, 0, p, () => {
        text(c, name, 0, 0, 19, lime, { align: 'left', family: 'monospace' })
        text(c, value, 81, 0, 21, cream, { align: 'left', family: 'monospace' })
        line(c, 0, 17, 280, 17, '#f5eedd31')
        check(c, 266, -1, 17, verified, ice)
      })
    })
  }

  demos['26-E20'] = (c, t) => {
    const center = fly(t, .02, .25)
    const ends = [[143, 66], [339, 66], [340, 203], [139, 203]]
    frame(c, 240, 135, center, center, .14 * (1 - center), center, () => {
      ring(c, 0, 0, 25, violet, 1.7)
      spark(c, 0, 0, 13, violet)
    })
    ends.forEach(([x, y], i) => {
      const p = ease(t, .18 + i * .12, .53 + i * .12)
      if (p <= 0) return
      const shape = curvePoints(240 + (x - 240) * .18, 135 + (y - 135) * .19, x, y, p)
      path(c, shape, i % 2 ? lime : ice, 1.7)
      const [tipX, tipY] = shape.at(-1)
      ring(c, tipX, tipY, 4, i % 2 ? lime : ice)
      ring(c, x, y, 11 * fly(p, .72, 1), cream, 1.2)
    })
  }

  demos['26-E21'] = (c, t) => {
    const split = ease(t, .11, .78)
    const gap = 14 * split
    const divider = 240 - 63 * split
    mask(c, 62, 66, divider - 62 - gap, 138, () => {
      const x = 170 - 40 * split
      ring(c, x, 135, 52, ice, 13)
      ring(c, x, 135, 13, cream)
    })
    mask(c, divider + gap, 66, 415 - divider - gap, 138, () => {
      const x = 328 - 17 * split
      for (let i = 0; i < 3; i++) ribbon(c, x, 104 + i * 31, 198, [violet, cream, cobalt][i], -.16)
    })
    frame(c, divider, 135, 1, split, 0, split, () => line(c, 0, -72, 0, 72, cream, 1.4))
  }

  demos['26-E22'] = (c, t) => {
    const values = [12, 8, 5]
    const colors = [violet, ice, lime]
    values.forEach((value, i) => {
      const x = 151 + i * 90
      const p = fly(t, .08 + i * .15, .42 + i * .15)
      const h = value * 10 * p
      rect(c, x - 19, 190 - h, 38, h, grad(c, 0, 190, 0, 70, colors[i] + '62', colors[i]), 2)
      frame(c, x, 171 - h, 1, 1, 0, p, () =>
        text(c, Math.round(value * p) + 's', 0, 0, 27, colors[i], { family: 'monospace' }))
    })
    line(c, 112, 192, 367, 192, '#ece8da51', 1.3)
  }

  demos['26-E23'] = (c, t) => {
    const p = ease(t, .06, .95)
    const x = 75 + 330 * p
    const hold = ease(t, .15, .44)
    rect(c, 198, 82, 41, 104, '#ffca6151', 2)
    wave(c, 76, 131, 329, 46, 80, p, '#e7e0d47a', ice, .9)
    for (let i = 0; i < 3; i++) {
      rect(c, 75 + i * 111, 161, 104 * hold, 5, [cobalt, violet, ice][i], 1.5)
    }
    line(c, x, 75, x, 192, cream, 1.5)
    path(c, [[x - 5, 74], [x + 5, 74], [x, 80]], cream)
  }

  function colorStudy(c, finished, t) {
    const colors = finished ? ['#ff795d', '#ad73ff', '#80f5d6'] : ['#77716e', '#675f75', '#697d75']
    mask(c, 74, 67, 332, 136, () => {
      frame(c, 238 + 6 * Math.sin(t * Math.PI), 112, 1, 1, -.23, 1, () => {
        ribbon(c, -15, -17, 306, grad(c, -130, -16, 142, 18, colors[0], colors[1]), 0, 2.4)
        ribbon(c, 34, 43, 278, grad(c, -130, -15, 147, 17, colors[2], colors[1]), 0, 2.4)
        ring(c, 106, -10, 31, colors[2], 2.3)
      })
    })
  }

  demos['26-E24'] = (c, t) => {
    const p = ease(t, .12, .93)
    const x = 74 + 332 * p
    colorStudy(c, false, t)
    mask(c, 74, 63, x - 74, 143, () => colorStudy(c, true, t))
    line(c, x, 65, x, 205, cream, 1.35)
    ring(c, x, 137, 7, cream)
  }

  demos['26-E25'] = (c, t) => {
    const colors = [violet, lime, cobalt, orange, ice]
    const selected = Math.min(4, Math.floor(t * 5))
    const kick = 1 - ease(t, selected / 5, selected / 5 + .086)
    for (let i = 2; i >= 0; i--) {
      const layer = (selected + i) % 5
      frame(c, 240 + 11 * i + (i ? 0 : kick * 7), 131 - 11 * i, 1, 1, .09 * (i - 1) - kick * .055, 1 - i * .17, () => {
        engraving(c, 166, colors[layer], layer % 2 === 1)
        if (layer === 2 || layer === 4) ring(c, 23, 15, 24, cream, 4)
      })
    }
    text(c, '0' + (selected + 1), 108, 177, 29, cream, { family: 'monospace' })
  }

  demos['26-E26'] = (c, t) => {
    if (t < .21 || t >= .80) {
      const tail = t >= .8
      frame(c, 240, 135, 1, 1, tail ? .2 * ease(t, .80, .99) : 0, 1, () => {
        ring(c, 0, 0, 62, cream, 1.4)
        spark(c, 0, 0, tail ? 41 : 36, cream)
      })
    } else if (t < .52) {
      const scale = 1 + .28 * ease(t, .21, .52)
      frame(c, 240, 135, scale, scale, -.12, 1, () => {
        for (let i = 0; i < 5; i++) ribbon(c, 0, -64 + 32 * i, 320, i % 2 ? ice : cobalt, 0, 2.1)
      })
    } else {
      frame(c, 240, 135, 1, 1, .14, 1, () => {
        for (let i = 1; i <= 5; i++) ring(c, 0, 0, i * 20, i % 2 ? orange : lime, i % 2 ? 1.5 : 3)
      })
    }
  }

  demos['26-E27'] = (c, t) => {
    const p = fly(t, .03, .22)
    const colors = [cobalt, violet, ice]
    frame(c, 105, 136, p, p, Math.PI / 4, p, () => rect(c, -17, -17, 34, 34, cream, 2))
    ;[70, 136, 202].forEach((y, i) => {
      const travel = ease(t, .18 + i * .11, .57 + i * .11)
      if (!travel) return
      const curve = curvePoints(132, 136, 370, y, travel)
      path(c, curve, colors[i], 1.7)
      ring(c, ...curve.at(-1), 3, cream)
      const open = fly(travel, .72, 1)
      frame(c, 373, y, open, open, i * .19, open, () => spark(c, 0, 0, 14, colors[i]))
    })
  }

  function orbitGlyph(c, q, x, y, r, color) {
    ring(c, x, y, r, '#f5f4ec59', 1)
    const a = q * tau - Math.PI / 2
    ring(c, x + Math.cos(a) * r, y + Math.sin(a) * r, Math.max(2, r * .24), color)
  }

  demos['26-E28'] = (c, t) => {
    const p = ease(t, .04, .94)
    orbitGlyph(c, p, 240, 93, 38, lime)
    for (let i = 0; i < 7; i++) {
      const q = fly(t, .08 + i * .03, .36 + i * .03)
      const active = Math.round(p * 6) === i
      frame(c, 90 + i * 50, 177 + (1 - q) * 15, 1, 1, 0, q, () => {
        rect(c, -22, -19, 44, 38, active ? '#e1ff7327' : '#efeae113', 4)
        orbitGlyph(c, i / 6, 0, 0, 10, active ? lime : cream)
      })
    }
    const playX = 90 + p * 300
    line(c, playX, 150, playX, 204, lime, 1.4)
    text(c, '0' + (Math.round(p * 6) + 1), playX, 220, 12, lime, { family: 'monospace' })
  }

  demos['26-E29'] = (c, t) => {
    const p = span(t, .06, .94)
    const words = ['O', 'som', 'marca', 'cada', 'corte.']
    const x = 71 + 338 * p
    wave(c, 71, 104, 338, 57, 78, p, '#dfd9cd68', cream, .6)
    words.forEach((word, i) => {
      const mid = 71 + (i + .5) * 338 / words.length
      const active = Math.min(4, Math.floor(p * 5)) === i
      text(c, word, mid, 165, active ? 25 : 19, active ? ice : cream, { family: 'Georgia', italic: true, maxWidth: 57 })
    })
    line(c, x, 67, x, 142, ice, 1.4)
    ring(c, x, 142, 3, ice)
  }

  demos['26-E30'] = (c, t) => {
    const p = span(t, .07, .95)
    const width = 338
    const left = 71
    const reveal = fly(t, .06, .31)
    const blocks = [[.02, .14], [.19, .36], [.39, .53], [.56, .75], [.80, .97]]
    frame(c, 0, (1 - reveal) * 28, 1, 1, 0, reveal, () => {
      line(c, left, 153, left + width, 153, '#e7dfd4ab', 1)
      for (let i = 0; i <= 20; i++) {
        const x = left + i * width / 20
        line(c, x, 153, x, i % 5 === 0 ? 170 : 160, '#e7dfd4ae')
        if (i % 5 === 0) text(c, (i / 5).toFixed(1) + 's', x, 184, 12, cream, { family: 'monospace' })
      }
      blocks.forEach(([a, b], i) => {
        const selected = p >= a && p <= b
        rect(c, left + width * a, 121, width * (b - a), 14, selected ? lime : ['#7495ff87', '#ae9aff87'][i % 2], 2)
      })
      const x = left + width * p
      line(c, x, 103, x, 168, cream, 1.3)
      ring(c, x, 103, 3, lime)
    })
  }

  demos['26-E31'] = (c, t) => {
    const close = ease(t, .24, .68)
    const gap = 65 * (1 - close)
    const join = 242
    const a = join - gap / 2
    const b = join + gap / 2
    wave(c, a - 130, 132, 130, 64, 32, 1, cream, violet, .8)
    wave(c, b + 2, 132, 130, 64, 32, 1, cream, ice, 1.9)
    if (gap > 0) {
      rect(c, a, 83, gap, 97, '#ff7e6140', 2)
      line(c, a, 83, a, 180, orange, 1)
      line(c, b, 83, b, 180, orange, 1)
    }
    const p = span(t, .65, .97)
    if (p > 0) {
      const x = mix(97, 379, p)
      line(c, x, 79, x, 184, cream, 1.6)
      ring(c, x, 78, 3, lime)
    }
  }

  demos['26-E32'] = (c, t) => {
    const colors = [cobalt, violet, ice]
    for (let i = 0; i < 3; i++) {
      const p = ease(t, .21 + i * .085, .66 + i * .085)
      const alpha = fly(t, .03 + .055 * i, .19 + .055 * i)
      const y = mix(76 + i * 59, 126 + i * 10, p)
      const x = mix(215 - i * 19, 272, p)
      frame(c, x, y, 1, 1, .12 * (i - 1) * (1 - p), alpha,
        () => ribbon(c, 0, 0, mix(300 - i * 24, 199, p), grad(c, -100, 0, 100, 0, colors[i] + '50', colors[i]), 0, 1.8))
    }
    const seal = fly(t, .73, .96)
    if (seal) ring(c, 383, 137, 13 * seal, cream, 1.4)
  }

  function aperture(c, x, y, r, paint) {
    if (r <= 0) return
    c.save()
    c.beginPath()
    c.arc(x, y, r, 0, tau)
    c.clip()
    paint()
    c.restore()
  }

  demos['26-E33'] = (c, t) => {
    const p = ease(t, .08, .72)
    const x = mix(239, 133, p)
    const r = mix(79, 53, p)
    aperture(c, x, 135, r, () => {
      for (let i = -2; i <= 2; i++) ribbon(c, x, 136 + i * 28, 172, i % 2 === 0 ? cobalt : violet, -.32)
    })
    ring(c, x, 135, r, cream, 1.4)
    const q = fly(t, .37, .87)
    if (!q) return
    aperture(c, 335, 135, 75 * q, () => {
      ring(c, 335, 135, 76, lime)
      for (let i = 1; i <= 4; i++) ring(c, 346, 122, i * 14, ink, 2.4)
      spark(c, 311, 151, 18, ink)
    })
    ring(c, 335, 135, 75 * q, '#e1ff7399', 1)
  }

  demos['26-E34'] = (c, t) => {
    const enter = fly(t, .02, .26)
    const p = ease(t, .35, .70)
    const color = t < .56 ? violet : ice
    const angle = mix(-.4, .65, p)
    frame(c, 143, 133, enter, enter, angle, enter, () => {
      ring(c, 0, 0, 51, '#efeae686', 1.4)
      for (let i = 0; i < 4; i++) ring(c, 0, 0, 43 - 6 * i, color, 1.6, .37 * i, 4.8 - .40 * i)
      spark(c, 0, 0, 16, color)
    })
    const titleP = Math.abs(1 - 2 * p)
    mask(c, 225, 92, 173, 96, () => {
      frame(c, 228, 133 + (p > .5 ? -1 : 1) * (1 - titleP) * 36, 1, 1, 0, enter * titleP, () => {
        text(c, t < .56 ? 'MONTAGEM' : 'FINALIZAÇÃO', 0, 0, 25, cream, { align: 'left', weight: 800 })
        line(c, 0, 22, 126, 22, color, 1.4)
      })
    })
  }
})()

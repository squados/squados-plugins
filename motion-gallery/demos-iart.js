(() => {
  const demos = window.motionDemos ??= Object.create(null)
  const W = 480
  const H = 270
  const X = W / 2
  const Y = H / 2
  const TAU = 2 * Math.PI
  const snow = '#fbf7ef'
  const ink = '#121217'
  const lime = '#d9ff5c'
  const gold = '#ffca76'
  const rose = '#ff667d'
  const aqua = '#65f5dd'
  const violet = '#b3a0ff'
  const blue = '#638eff'
  const serif = 'Georgia, serif'
  const mono = 'Consolas, monospace'
  const display = '"Arial Black", "Segoe UI", sans-serif'
  const clamp = value => Math.max(0, Math.min(1, value))
  const phase = (t, a, b) => clamp((t - a) / (b - a))
  const lerp = (a, b, t) => a + (b - a) * t
  const ease = t => t * t * (3 - 2 * t)
  const out = t => 1 - (1 - t) ** 3
  const bump = t => 1 + 2.5 * (t - 1) ** 3 + 1.5 * (t - 1) ** 2
  const fract = value => value - Math.floor(value)
  const noise = seed => fract(Math.sin(seed * 127.1 + 74.7) * 43758.5453)

  function layer(c, draw, alpha = 1) {
    c.save()
    c.globalAlpha *= clamp(alpha)
    draw()
    c.restore()
  }

  function rect(c, x, y, w, h, fill, radius = 0) {
    if (w <= 0 || h <= 0) return
    c.fillStyle = fill
    if (!radius) {
      c.fillRect(x, y, w, h)
      return
    }
    c.beginPath()
    c.roundRect(x, y, w, h, radius)
    c.fill()
  }

  function line(c, points, color, width = 1) {
    if (!points.length) return
    c.beginPath()
    c.moveTo(...points[0])
    for (const point of points.slice(1)) c.lineTo(...point)
    c.strokeStyle = color
    c.lineWidth = width
    c.lineCap = 'round'
    c.lineJoin = 'round'
    c.stroke()
  }

  function polygon(c, points, fill, edge, width = 1) {
    c.beginPath()
    c.moveTo(...points[0])
    for (const point of points.slice(1)) c.lineTo(...point)
    c.closePath()
    if (fill) {
      c.fillStyle = fill
      c.fill()
    }
    if (edge) {
      c.strokeStyle = edge
      c.lineWidth = width
      c.stroke()
    }
  }

  function ellipse(c, x, y, rx, ry, color, width = 0, rotation = 0) {
    if (rx <= 0 || ry <= 0) return
    c.beginPath()
    c.ellipse(x, y, rx, ry, rotation, 0, TAU)
    if (width) {
      c.strokeStyle = color
      c.lineWidth = width
      c.stroke()
      return
    }
    c.fillStyle = color
    c.fill()
  }

  function arc(c, x, y, r, from, to, color, width) {
    if (to <= from) return
    c.beginPath()
    c.arc(x, y, r, from, to)
    c.strokeStyle = color
    c.lineWidth = width
    c.lineCap = 'round'
    c.stroke()
  }

  function gradient(c, x, y, x2, y2, ...colors) {
    const fill = c.createLinearGradient(x, y, x2, y2)
    colors.forEach((color, i) => fill.addColorStop(i / (colors.length - 1), color))
    return fill
  }

  function glow(c, x, y, radius, color) {
    const fill = c.createRadialGradient(x, y, 0, x, y, radius)
    fill.addColorStop(0, color)
    fill.addColorStop(1, '#00000000')
    ellipse(c, x, y, radius, radius, fill)
  }

  function words(c, value, x, y, size, color = snow, options = {}) {
    const { family = display, italic = false, weight = 900, align = 'center', outline = 0, max = 440 } = options
    c.font = `${italic ? 'italic ' : ''}${weight} ${size}px ${family}`
    c.textAlign = align
    c.textBaseline = 'middle'
    if (outline) {
      c.strokeStyle = color
      c.lineWidth = outline
      c.lineJoin = 'round'
      c.strokeText(value, x, y, max)
      return
    }
    c.fillStyle = color
    c.fillText(value, x, y, max)
  }

  function letters(c, value, x, y, size, color, animate, options = {}) {
    const { family = display, italic = false, weight = 900, tracking = 0 } = options
    c.font = `${italic ? 'italic ' : ''}${weight} ${size}px ${family}`
    const glyphs = [...value].map(char => ({ char, width: c.measureText(char).width }))
    let left = x - (glyphs.reduce((width, glyph) => width + glyph.width, 0) + tracking * (glyphs.length - 1)) / 2
    glyphs.forEach(({ char, width }, i) => {
      if (char !== ' ') {
        const motion = animate(i, glyphs.length)
        layer(c, () => {
          c.translate(left + width / 2 + (motion.x ?? 0), y + (motion.y ?? 0))
          c.rotate(motion.rotation ?? 0)
          c.scale(motion.sx ?? 1, motion.sy ?? 1)
          if (motion.blur) c.filter = `blur(${motion.blur}px)`
          words(c, char, 0, 0, size, motion.color ?? color, { ...options, outline: motion.outline ?? options.outline })
        }, motion.alpha)
      }
      left += width + tracking
    })
  }

  function mask(c, x, y, w, h, draw) {
    if (w <= 0 || h <= 0) return
    layer(c, () => {
      c.beginPath()
      c.rect(x, y, w, h)
      c.clip()
      draw()
    })
  }

  function trace(c, points, progress, color, width = 1) {
    const lengths = points.slice(1).map(([x, y], i) => Math.hypot(x - points[i][0], y - points[i][1]))
    let distance = lengths.reduce((sum, length) => sum + length, 0) * progress
    const visible = [points[0]]
    for (let i = 0; i < lengths.length && distance > 0; i++) {
      const fraction = clamp(distance / lengths[i])
      visible.push(points[i].map((value, axis) => lerp(value, points[i + 1][axis], fraction)))
      distance -= lengths[i]
    }
    if (progress > 0) line(c, visible, color, width)
    return visible.at(-1)
  }

  function spark(c, x, y, r, color, narrow = 0.23) {
    if (r <= 0) return
    const n = r * narrow
    polygon(c, [[x, y - r], [x + n, y - n], [x + r, y], [x + n, y + n],
      [x, y + r], [x - n, y + n], [x - r, y], [x - n, y - n]], color)
  }

  function cropMarks(c, x, y, w, h, length, color, width = 1.5) {
    for (const horizontal of [-1, 1]) {
      for (const vertical of [-1, 1]) {
        const px = x + horizontal * w / 2
        const py = y + vertical * h / 2
        line(c, [[px - horizontal * length, py], [px, py], [px, py - vertical * length]], color, width)
      }
    }
  }

  demos['ms-caption-animation'] = (c, t) => {
    const active = Math.min(2, Math.floor(t * 3.6))
    const pop = Math.sin(Math.PI * phase(fract(t * 3.6), 0, 0.68))
    const parts = [['MUDE', 203, 105, 52], ['O', 331, 105, 52], ['RITMO', 240, 168, 74]]
    parts.forEach(([value, x, y, size], i) => {
      const p = out(phase(t, i * 0.055, 0.14 + i * 0.055))
      layer(c, () => {
        const on = i === active
        words(c, value, x, y + 16 * (1 - p) - (on ? 5 * pop : 0), size, on ? lime : snow)
        if (on) {
          const w = c.measureText(value).width * (0.66 + 0.24 * pop)
          rect(c, x - w / 2, y + size * 0.43, w, 2.5, lime)
        }
      }, p)
    })
  }

  demos['ms-countdown-video'] = (c, t) => {
    const tick = Math.min(3, Math.floor(t * 3.4))
    const local = fract(t * 3.4)
    ellipse(c, X, Y, 86, 86, '#ffffff2f', 1)
    ellipse(c, X, Y, 74, 74, '#ffffff26', 4)
    for (let i = 0; i < 60; i++) {
      const a = i * TAU / 60
      const inner = i % 5 === 0 ? 90 : 93
      line(c, [[X + inner * Math.cos(a), Y + inner * Math.sin(a)],
        [X + 96 * Math.cos(a), Y + 96 * Math.sin(a)]], '#ffffff5a')
    }
    if (tick < 3) arc(c, X, Y, 74, -Math.PI / 2, -Math.PI / 2 + TAU * (1 - local), gold, 5)
    const finish = phase(t, 0.88, 1)
    if (finish > 0) layer(c, () => ellipse(c, X, Y, 74 + 32 * finish, 74 + 32 * finish, gold, 1.4), 1 - finish)
    words(c, String(3 - tick), X, Y + 2, 106 - 13 * out(local), tick === 3 ? gold : snow, { family: mono })
  }

  demos['ms-lower-thirds-vertical'] = (c, t) => {
    const reveal = out(phase(t, 0.05, 0.27)) * (1 - ease(phase(t, 0.76, 0.98)))
    const bar = out(phase(t, 0, 0.19)) * (1 - ease(phase(t, 0.85, 1)))
    const x = 118
    const y = 162
    rect(c, x, y, 4, 60 * bar, lime)
    mask(c, x + 12, y - 5, 241 * reveal, 67, () => {
      words(c, 'Lia Reis', x + 17 + 27 * (reveal - 1), y + 15, 36, snow, { align: 'left' })
      words(c, 'DIREÇÃO CRIATIVA', x + 18 + 16 * (reveal - 1), y + 47, 12, lime, { align: 'left', family: mono })
    })
  }

  demos['ms-short-form-video'] = (c, t) => {
    const cuts = [0, 0.27, 0.59]
    const i = t < cuts[1] ? 0 : t < cuts[2] ? 1 : 2
    const pulse = 1 + 0.22 * (1 - out(phase(t, cuts[i], cuts[i] + 0.12)))
    layer(c, () => {
      c.translate(X, Y)
      c.scale(pulse, pulse)
      if (i === 0) {
        mask(c, -96, -67, 179, 134, () => ellipse(c, -9, 0, 99, 99, gradient(c, -90, -70, 80, 70, rose, '#dc301b')))
        rect(c, -104, 58, 201, 2, rose)
      } else if (i === 1) {
        polygon(c, [[0, -105], [143, 0], [0, 105], [-143, 0]], violet)
        polygon(c, [[0, -57], [78, 0], [0, 57], [-78, 0]], ink)
      } else {
        for (let arm = 0; arm < 6; arm++) {
          c.rotate(TAU / 6)
          rect(c, -10, 4, 20, 96, lime, 8)
        }
        ellipse(c, 0, 0, 18, 18, lime)
      }
    })
  }

  demos['ms-text-message-animation'] = (c, t) => {
    const intro = bump(phase(t, 0, 0.18))
    const reveal = ease(phase(t, 0.45, 0.73))
    const width = lerp(110, 298, reveal)
    const x = X - width / 2
    const y = Y - 32 + 20 * (1 - intro)
    layer(c, () => {
      rect(c, x, y, width, 65, violet, 32)
      polygon(c, [[x + 18, y + 55], [x + 15, y + 72], [x + 42, y + 61]], violet)
      layer(c, () => {
        for (let i = 0; i < 3; i++) {
          const wave = Math.sin(TAU * (t * 2.8 - i * 0.18))
          ellipse(c, X - 23 + i * 23, y + 33 - Math.max(0, wave) * 8, 5.3, 5.3, ink)
        }
      }, 1 - phase(t, 0.42, 0.55))
      mask(c, x + 21, y, 252 * reveal, 65, () => words(c, 'Vamos nessa.', x + 25, y + 34, 33, ink, { align: 'left', family: serif, italic: true, weight: 700 }))
    }, intro)
  }

  demos['ms-audiogram'] = (c, t) => {
    line(c, [[63, Y], [417, Y]], '#6cfce65b')
    for (let i = 0; i < 55; i++) {
      const x = 74 + i * 6.15
      const band = i / 54
      const wave = 0.4 + 0.6 * noise(i + 20)
      const shift = 1.25 * t - 0.14
      const center = Math.exp(-((band - shift) ** 2) * 23)
      const satellite = 0.57 * Math.exp(-((band - shift + 0.35) ** 2) * 36) + 0.35 * Math.exp(-((band - shift - 0.27) ** 2) * 49)
      const amplitude = (center + satellite) * (1 - 0.88 * Math.sin(Math.PI * phase(t, 0.57, 0.73)) ** 2)
      const h = 2 + 72 * amplitude * wave * Math.sin(Math.PI * band) ** 0.55
      rect(c, x, Y - h, 2.7, h * 2, gradient(c, x, Y - h, x, Y + h, aqua, snow, '#2778da'), 1.35)
    }
  }

  demos['ms-youtube-intro-outro'] = (c, t) => {
    const p = bump(phase(t, 0.06, 0.51))
    const halo = out(phase(t, 0.43, 0.87))
    for (let i = 0; i < 2; i++) {
      const sign = i * 2 - 1
      layer(c, () => {
        c.translate(X + sign * (1 - p) * 162, Y + sign * (1 - p) * 52)
        c.rotate(i * Math.PI + sign * (1 - p) * 1.4)
        c.beginPath()
        c.arc(0, 0, 76, -Math.PI / 2, Math.PI / 2)
        c.quadraticCurveTo(62, 0, 0, -76)
        c.fillStyle = i ? snow : gradient(c, 0, -72, 67, 68, '#684aff', violet)
        c.fill()
      }, out(phase(t, 0, 0.16)))
    }
    layer(c, () => ellipse(c, X, Y, 79 + 40 * halo, 79 + 40 * halo, violet, 1.4), Math.sin(Math.PI * halo) * 0.8)
  }

  demos['ms-photo-slideshow'] = (c, t) => {
    const dissolve = ease(phase(t, 0.33, 0.66))
    layer(c, () => {
      c.beginPath()
      c.arc(X, Y, 103, 0, TAU)
      c.clip()
      const landscape = (cool, opacity) => layer(c, () => {
        const zoom = cool ? lerp(1.4, 1.04, t) : lerp(1.02, 1.44, t)
        c.translate(X + (cool ? 20 : -20) * t, Y)
        c.scale(zoom, zoom)
        rect(c, -155, -110, 310, 250, gradient(c, 0, -115, 0, 100,
          ...(cool ? ['#18295b', '#5a77c5', '#c0bbff'] : ['#ee7752', '#ffb67f', '#ffe8bb'])))
        ellipse(c, cool ? 36 : -33, -32, 20, 20, cool ? '#bdfaff' : '#ffe9a5')
        for (let i = 0; i < 5; i++) {
          const y = 5 + i * 21
          c.beginPath()
          c.moveTo(-153, y + 30)
          c.bezierCurveTo(-70, y - 86 + i * 7, 17, y + 70, 155, y - 37)
          c.lineTo(155, 151)
          c.lineTo(-155, 151)
          c.closePath()
          c.fillStyle = (cool ? ['#8c91d4', '#676aaf', '#465798', '#34457c', '#243864']
            : ['#f6b074', '#e47a5a', '#cb6049', '#a64141', '#7c3443'])[i]
          c.fill()
        }
      }, opacity)
      landscape(false, 1)
      landscape(true, dissolve)
    })
  }

  demos['ms-product-demo-video'] = (c, t) => {
    const p = ease(phase(t, 0.02, 0.42))
    const x = 273 - 111 * (1 - p)
    const y = 115 + 63 * (1 - p) ** 2
    const strike = Math.sin(Math.PI * phase(t, 0.39, 0.51))
    for (let i = 0; i < 3; i++) {
      const k = phase(t, 0.43 + i * 0.053, 0.78 + i * 0.065)
      if (k > 0) layer(c, () => ellipse(c, 273, 115, 15 + k * 64, 15 + k * 64, i === 1 ? aqua : violet, 2.3), (1 - k) * 0.9)
    }
    ellipse(c, 273, 115, 4.5, 4.5, violet)
    layer(c, () => {
      c.translate(x, y)
      c.rotate(-0.14 - strike * 0.11)
      c.scale(1 - 0.13 * strike, 1 - 0.13 * strike)
      polygon(c, [[0, 0], [9, 56], [21, 42], [35, 58], [43, 51], [29, 35], [49, 29]], snow, ink, 2)
    })
  }

  demos['ms-promo-video'] = (c, t) => {
    const shift = ease(phase(t, 0.35, 0.61))
    const scale = bump(phase(t, 0.42, 0.74))
    layer(c, () => {
      c.translate(X, Y - 47 * shift)
      c.scale(1 - 0.32 * shift, 1 - 0.32 * shift)
      words(c, 'R$ 90', 0, 0, 66, snow)
      trace(c, [[-107, 13], [107, -10]], out(phase(t, 0.16, 0.36)), rose, 5)
    }, 1 - 0.38 * shift)
    layer(c, () => {
      c.translate(X, 163)
      c.scale(0.56 + 0.44 * scale, 0.56 + 0.44 * scale)
      words(c, 'R$ 62', 0, 0, 87, lime)
    }, out(phase(t, 0.42, 0.59)))
  }

  demos['ms-ad-creative-video'] = (c, t) => {
    const hit = out(phase(t, 0.08, 0.48))
    const collapse = 1 - hit
    for (let i = 3; i > 0; i--) {
      for (const side of [-1, 1]) {
        layer(c, () => words(c, 'IMPACTO', X, Y + side * i * 30 * collapse, 63, rose, { outline: 1.2 }), collapse * (1 - i * 0.14))
      }
    }
    words(c, 'IMPACTO', X, Y, 63 + 4 * Math.sin(Math.PI * phase(t, 0.34, 0.54)), snow)
    const accent = out(phase(t, 0.35, 0.71))
    for (const side of [-1, 1]) {
      const x = X + side * (163 + 42 * accent)
      const y = Y - 28 * side
      line(c, [[x - 9 * side, y + 15], [x + 8 * side, y - 15]], rose, 2 + 2 * accent)
    }
  }

  demos['ms-launch-video'] = (c, t) => {
    const reveal = out(phase(t, 0.1, 0.69))
    const points = [[240, 40], [309, 104], [285, 198], [240, 229], [195, 198], [171, 104]]
    layer(c, () => {
      polygon(c, points, null, '#baadff52', 1)
      c.clip()
      const y = 254 - 244 * reveal
      polygon(c, [[130, y + 31], [348, y - 43], [354, 264], [120, 265]])
      c.clip()
      polygon(c, [[240, 40], [240, 229], [195, 198], [171, 104]], gradient(c, 170, 100, 244, 230, violet, '#342379'))
      polygon(c, [[240, 40], [309, 104], [285, 198], [240, 229]], gradient(c, 230, 46, 301, 213, '#d6d0ff', '#5949c2', '#27124a'))
      polygon(c, [[240, 40], [309, 104], [240, 143], [171, 104]], gradient(c, 172, 110, 305, 106, '#5224b4', '#e6d7ff', '#8467ff'))
      line(c, [[160, y + 19], [320, y - 36]], '#fbf7fdbd', 1.8)
    })
    glow(c, X, 219, 46, '#7551ff38')
  }

  demos['ms-testimonial-video'] = (c, t) => {
    const p = out(phase(t, 0.05, 0.36))
    const q = out(phase(t, 0.22, 0.53))
    const mark = ease(phase(t, 0.49, 0.65))
    const width = 290 * mark
    layer(c, () => words(c, '“', 91, 82 - 15 * (1 - p), 104, violet, { family: serif }), p)
    mask(c, 90, 100, 315, 54, () => words(c, 'A partir daqui,', 112, 125 + 53 * (1 - p), 40, snow, { family: serif, align: 'left', italic: true }))
    rect(c, 107, 157, width, 43, aqua)
    mask(c, 90, 152, 315, 55, () => {
      words(c, 'tudo mudou.', 111, 179 + 53 * (1 - q), 41, snow, { family: serif, align: 'left', italic: true })
      mask(c, 107, 157, width, 43, () => words(c, 'tudo mudou.', 111, 179 + 53 * (1 - q), 41, ink, { family: serif, align: 'left', italic: true }))
    })
  }

  demos['ms-animated-infographic'] = (c, t) => {
    const values = [38, 64, 92]
    values.forEach((value, i) => {
      const x = 111 + i * 129
      const color = [rose, gold, aqua][i]
      const start = 0.06 + i * 0.13
      const p = out(phase(t, start, start + 0.48))
      const rise = out(phase(t, start, start + 0.22))
      layer(c, () => {
        const y = Y + 21 * (1 - rise)
        ellipse(c, x, y, 47, 47, '#ffffff35', 1)
        ellipse(c, x, y, 39, 39, '#ffffff26', 4)
        arc(c, x, y, 39, -Math.PI / 2, -Math.PI / 2 + TAU * p * value / 100, color, 4)
        words(c, `${Math.round(value * p)}%`, x, y + 1, 24, snow, { family: mono })
      }, rise)
    })
  }

  demos['ms-chart-animation'] = (c, t) => {
    const flow = ease(phase(t, 0.08, 0.85))
    const swap = ease(phase(t, 0.36, 0.6))
    const rows = [[lerp(136, 93, swap), lerp(52, 95, flow), aqua],
      [lerp(93, 136, swap), lerp(72, 78, flow), rose], [179, lerp(37, 57, flow), violet]]
    const intro = out(phase(t, 0, 0.17))
    line(c, [[74, 63], [74, 202]], '#ffffff56')
    rows.forEach(([y, value, color], i) => {
      const w = value * 2.78 * intro
      rect(c, 81, y - 12, w, 23, gradient(c, 80, y, 81 + w, y, ['#2682a5', '#9d324b', '#5539ab'][i], color), 3)
      layer(c, () => words(c, String(Math.round(value)), 92 + w, y + 1, 17, snow, { family: mono, align: 'left' }), intro)
    })
  }

  demos['ms-presentation-video'] = (c, t) => {
    const p = out(phase(t, 0.08, 0.44))
    const q = out(phase(t, 0.23, 0.57))
    const end = ease(phase(t, 0.87, 1))
    rect(c, 88, 79 + end * 115, 3, 115 * out(phase(t, 0, 0.32)) * (1 - end), aqua)
    layer(c, () => {
      mask(c, 105, 76, 270, 52, () => words(c, 'O próximo', 110, 102 + 60 * (1 - p), 42, aqua, { family: serif, italic: true, align: 'left' }))
      mask(c, 105, 124, 276, 81, () => words(c, 'PASSO', 108, 166 + 75 * (1 - q), 71, snow, { align: 'left' }))
    }, 1 - end)
  }

  demos['ms-diagram-animation'] = (c, t) => {
    const source = [107, 135]
    const paths = [
      [[107, 135], [207, 135], [244, 75], [362, 75]],
      [[107, 135], [362, 135]],
      [[107, 135], [207, 135], [244, 195], [362, 195]],
    ]
    const colors = [violet, gold, aqua]
    paths.forEach((path, i) => {
      const p = ease(phase(t, 0.04 + i * 0.105, 0.62 + i * 0.105))
      const tip = trace(c, path, p, colors[i], 2)
      const [x, y] = path.at(-1)
      const node = phase(p, 0.83, 1)
      if (p > 0) ellipse(c, ...tip, 4.5, 4.5, colors[i])
      ellipse(c, x, y, 12 * node, 12 * node, colors[i], 1.4)
      ellipse(c, x, y, 5.5 * node, 5.5 * node, colors[i])
    })
    glow(c, ...source, 36, '#ffca765d')
    ellipse(c, ...source, 15, 15, gold, 1.3)
    ellipse(c, ...source, 7, 7, snow)
  }

  demos['ms-explainer-video'] = (c, t) => {
    const membrane = out(phase(t, 0, 0.25))
    rect(c, X - 159 * membrane, 139, 318 * membrane, 1, '#d4edff9c')
    for (let i = 0; i < 29; i++) {
      const k = phase(t, i * 0.009, 0.63 + i * 0.01)
      const x = 104 + (i * 53 % 269)
      const top = 13 + 64 * noise(i + 39)
      const dot = i % 3 !== 0
      const gravity = dot ? k ** 1.25 : ease(phase(k, 0, 0.66))
      const bounce = dot ? 0 : 34 * Math.sin(Math.PI * phase(k, 0.61, 1)) + 9 * k
      const y = lerp(top, dot ? 219 + 16 * noise(i) : 132, gravity) - bounce
      const radius = 3 + 5 * noise(i + 81)
      layer(c, () => {
        if (dot) ellipse(c, x + (y - top) * 0.068, y, radius, radius, aqua)
        else polygon(c, [[x, y - radius], [x + radius, y], [x, y + radius], [x - radius, y]], violet)
      }, out(phase(t, 0, 0.18)))
    }
  }

  demos['ms-isometric-animation'] = (c, t) => {
    const lift = out(phase(t, 0.06, 0.69))
    const midway = out(phase(t, 0.18, 0.74))
    const planes = [[0, '#4550ad', '#302e69'], [-47 * midway, '#7a69db', '#4a358d'], [-97 * lift, violet, '#5d43bd']]
    const points = y => [[107, y], [240, y - 44], [373, y], [240, y + 44]]
    const base = 176
    for (const i of [0, 1, 2, 3]) {
      const a = points(base)[i]
      const b = points(base + planes[2][0])[i]
      line(c, [a, b], '#b3a0ff69', 1)
    }
    planes.forEach(([dy, light, dark]) => {
      const p = points(base + dy)
      const down = i => [p[i][0], p[i][1] + 9]
      polygon(c, [p[0], p[3], down(3), down(0)], dark)
      polygon(c, [p[3], p[2], down(2), down(3)], '#3a317c')
      polygon(c, p, gradient(c, 104, 125 + dy, 355, 202 + dy, dark, light), '#e2d8ff82')
      for (let i = 1; i <= 3; i++) {
        const f = i / 4
        line(c, [[lerp(p[0][0], p[1][0], f), lerp(p[0][1], p[1][1], f)],
          [lerp(p[3][0], p[2][0], f), lerp(p[3][1], p[2][1], f)]], '#e9dcff38')
      }
    })
  }

  demos['ms-whiteboard-animation'] = (c, t) => {
    const p = ease(phase(t, 0.03, 0.7))
    const plane = [[124, 114], [349, 61], [279, 192], [217, 150], [349, 61], [193, 160], [183, 192], [217, 150], [183, 192], [176, 143], [124, 114]]
    const tip = trace(c, plane, p, '#154bd9', 3.8)
    const tail = Array.from({ length: 32 }, (_, i) => {
      const f = i / 31
      return [170 - f * 105, 188 + 29 * Math.sin(Math.PI * f)]
    })
    layer(c, () => {
      c.setLineDash([3, 7])
      trace(c, tail, out(phase(t, 0.66, 0.97)), '#154bd9', 2)
    })
    if (p < 1) ellipse(c, ...tip, 4.3, 4.3, '#154bd9')
  }

  demos['ms-wrapped-video'] = (c, t) => {
    const p = out(phase(t, 0.03, 0.63))
    const q = out(phase(t, 0.46, 0.71))
    const number = String(Math.round(128 * p)).padStart(3, '0')
    const shift = 15 * (1 - q)
    words(c, number, X + 8 + shift, 116 + 6 + shift, 130, violet, { outline: 1.9, family: mono })
    words(c, number, X, 116, 130, snow, { family: mono })
    mask(c, 139, 176, 202, 49, () => words(c, 'horas', X, 199 + 44 * (1 - q), 44, violet, { family: serif, italic: true, weight: 400 }))
  }

  demos['ms-map-animation'] = (c, t) => {
    const land = [[77, 66], [121, 57], [156, 72], [202, 61], [231, 82], [250, 115], [294, 105], [316, 130], [339, 135],
      [379, 165], [395, 199], [342, 210], [308, 194], [268, 218], [215, 205], [188, 183], [141, 191], [101, 161], [103, 123]]
    const route = [[121, 110], [149, 121], [176, 102], [214, 111], [246, 147], [289, 136], [316, 155], [347, 181]]
    const p = ease(phase(t, 0.05, 0.84))
    polygon(c, land, gradient(c, 92, 65, 381, 219, '#354679', '#191e39'), '#768cbe')
    layer(c, () => {
      polygon(c, land)
      c.clip()
      for (let i = 0; i < 10; i++) {
        const pts = Array.from({ length: 45 }, (_, j) => [50 + j * 9, 28 + 22 * i + 17 * Math.sin(j / 8 + i * 0.46)])
        line(c, pts, '#9caede29')
      }
    })
    const tip = layerTip()
    ellipse(c, ...route[0], 4, 4, gold)
    ellipse(c, ...tip, 5, 5, snow)
    const end = out(phase(t, 0.81, 1))
    if (end > 0) layer(c, () => ellipse(c, ...route.at(-1), 5 + 17 * end, 5 + 17 * end, gold, 1.4), 1 - 0.75 * end)

    function layerTip() {
      c.save()
      c.setLineDash([4, 4])
      const point = trace(c, route, p, gold, 2.8)
      c.restore()
      return point
    }
  }
  demos['ms-60fps-animation'] = (c, t) => {
    const p = phase(t, 0, 0.96)
    const point = f => [68 + 344 * f, 135 - 58 * Math.sin(TAU * f)]
    const start = Math.max(0, p - 0.44)
    for (let i = 0; i < 60; i++) {
      const a = i / 60
      const b = (i + 1) / 60
      const from = point(lerp(start, p, a))
      const to = point(lerp(start, p, b))
      layer(c, () => line(c, [from, to], i > 48 ? aqua : blue, 0.7 + 7 * a ** 2), a ** 1.5)
    }
    const [x, y] = point(p)
    glow(c, x, y, 27, '#65f5dd86')
    ellipse(c, x, y, 6, 6, snow)
  }

  demos['ms-accessible-animation'] = (c, t) => {
    const p = ease(phase(t, 0.14, 0.67))
    words(c, 'Calma', X, Y - 4, 111, violet, { family: serif, italic: true, weight: 500 })
    layer(c, () => words(c, 'Calma', X, Y - 4, 111, snow, { family: serif, italic: true, weight: 500 }), p)
    rect(c, 171, 205, 138, 1.4, violet)
    layer(c, () => rect(c, 171, 205, 138, 1.4, snow), p)
  }

  demos['ms-ascii-animation'] = (c, t) => {
    const ramp = '·:-+*#%@'
    const a = TAU * t
    const light = [Math.sin(a) * 0.69, -0.31 + 0.18 * Math.cos(a), 0.63]
    c.font = '700 10px Consolas, monospace'
    c.textAlign = 'center'
    c.textBaseline = 'middle'
    for (let y = -10; y <= 10; y++) {
      for (let x = -17; x <= 17; x++) {
        const nx = x / 17.2
        const ny = y / 10.7
        if (nx ** 2 + ny ** 2 > 1) continue
        const nz = Math.sqrt(1 - nx ** 2 - ny ** 2)
        const bands = 0.84 + 0.16 * Math.sin(18 * (nx + ny * 0.36) - 3 * a)
        const l = clamp((0.19 + nx * light[0] + ny * light[1] + nz * light[2]) * bands)
        c.fillStyle = `hsl(${lerp(255, 177, l)} 92% ${lerp(47, 91, l)}%)`
        c.fillText(ramp[Math.round(l * (ramp.length - 1))], X + x * 6.35, Y + y * 9.9)
      }
    }
  }

  demos['ms-glassmorphism'] = (c, t) => {
    const x = X + 85 * Math.sin(TAU * t)
    const a = -0.41
    layer(c, () => {
      c.translate(X, Y)
      c.rotate(a)
      layer(c, () => {
        c.beginPath()
        c.ellipse(0, 0, 135, 74, 0, 0, TAU)
        c.clip()
        rect(c, -135, -74, 270, 148, gradient(c, -135, -74, 135, 74, '#b6beff44', '#34336611', '#746ad150'))
        for (let i = 0; i < 3; i++) {
          const shift = x - X + i * 22 - 22
          const points = [[shift - 90, 89], [shift - 5, 9], [shift + 92, -89]]
          c.filter = `blur(${4 + i * 3}px)`
          line(c, points, ['#43e9ff92', '#a985ffa5', '#ff7996ad'][i], 23)
        }
      })
      ellipse(c, 0, 0, 135, 74, gradient(c, -135, 56, 135, -55, '#3f396e', '#acaeff', '#423c64'), 2.6)
      ellipse(c, 0, 0, 131, 70, '#cfcfff50', 1.1)
      const start = -1.9 + Math.sin(TAU * t) * 0.72
      c.beginPath()
      c.ellipse(0, 0, 134, 74, 0, start, start + 0.72)
      c.strokeStyle = '#f4f2ffb8'
      c.lineWidth = 2
      c.stroke()
    })
  }

  demos['ms-gsap-web'] = (c, t) => {
    const p = (ease(phase(t, 0.12, 0.46)) + ease(phase(t, 0.54, 0.86))) * 166
    line(c, [[106, 84], [106, 191]], '#ffffff81', 1.4)
    line(c, [[374, 84], [374, 191]], '#ffffff81', 1.4)
    const glyphs = ['A', 'B', 'C']
    mask(c, 109, 65, 262, 144, () => {
      glyphs.forEach((char, i) => {
        const x = X + 166 * i - p
        words(c, char, x, 137, 132, [snow, violet, gold][i], { outline: Math.abs(x - X) > 100 ? 1.3 : 0 })
      })
    })
    ellipse(c, X, 215, 3, 3, gold)
  }

  demos['ms-lottie-animation'] = (c, t) => {
    const p = out(phase(t, 0.02, 0.45))
    const q = out(phase(t, 0.35, 0.64))
    const pulse = Math.sin(Math.PI * phase(t, 0.52, 0.75))
    const ring = out(phase(t, 0.55, 0.98))
    layer(c, () => ellipse(c, X, Y, 66 + 34 * ring, 66 + 34 * ring, aqua, 1.2), (1 - ring) * phase(t, 0.55, 0.63))
    layer(c, () => {
      c.translate(X, Y)
      c.scale(1 + 0.12 * pulse, 1 + 0.12 * pulse)
      arc(c, 0, 0, 64, -Math.PI / 2, -Math.PI / 2 + TAU * p, aqua, 4)
      trace(c, [[-29, 2], [-8, 21], [30, -22]], q, snow, 10)
    })
  }

  demos['ms-micro-interaction'] = (c, t) => {
    const trigger = phase(t, 0.2, 0.65)
    const kick = -0.19 * Math.sin(Math.PI * phase(t, 0.1, 0.26)) + 0.23 * Math.sin(Math.PI * phase(t, 0.25, 0.55))
    layer(c, () => {
      c.translate(X, Y - 5)
      c.scale(1 + kick, 1 + kick)
      c.beginPath()
      c.moveTo(0, 67)
      c.bezierCurveTo(-13, 59, -77, 17, -77, -25)
      c.bezierCurveTo(-77, -72, -25, -79, 0, -43)
      c.bezierCurveTo(25, -79, 77, -72, 77, -25)
      c.bezierCurveTo(77, 17, 13, 59, 0, 67)
      c.closePath()
      const a = c.globalAlpha
      c.globalAlpha *= out(trigger)
      c.fillStyle = gradient(c, -45, -66, 64, 56, '#ffadc8', rose, '#df325f')
      c.fill()
      c.globalAlpha = a
      c.strokeStyle = '#ff95b8'
      c.lineWidth = 3.3
      c.stroke()
    })
    for (let i = 0; i < 6; i++) {
      const p = out(phase(t, 0.32 + i * 0.015, 0.81))
      if (!p) continue
      const a = i * TAU / 6 + 0.16 + p * 0.24
      const r = 82 + 61 * p
      layer(c, () => spark(c, X + Math.cos(a) * r, Y + Math.sin(a) * r * 0.79, 10 * (1 - p), i % 2 ? snow : rose), 1 - p)
    }
  }

  demos['ms-page-transition-animation'] = (c, t) => {
    const p = ease(phase(t, 0.09, 0.77))
    const x = lerp(170, 237, p)
    const y = lerp(155, 135, p)
    const r = lerp(25, 144, p)
    const h = lerp(25, 76, p)
    layer(c, () => {
      c.beginPath()
      c.ellipse(x, y, r, h, -0.29, 0, TAU)
      c.clip()
      rect(c, 0, 0, W, H, gradient(c, 117, 91, 363, 192, '#382589', '#775dfe', '#d5beff'))
      for (let i = 0; i < 10; i++) {
        const size = i * 13 + 8
        ellipse(c, x - r * 0.32, y + h * 0.21, size * 1.65, size, '#fbf6ff77', 1.2, -0.35)
      }
    })
    spark(c, x - r * 0.32, y + h * 0.21, 5.5 + 4 * p, snow)
  }

  demos['ms-svg-animation'] = (c, t) => {
    const pts = [[90, 172], [115, 134], [161, 72], [188, 51], [185, 67], [153, 128], [123, 189], [132, 205],
      [165, 179], [201, 131], [229, 98], [234, 116], [209, 170], [224, 173], [255, 141], [280, 119], [280, 151],
      [302, 143], [331, 128], [338, 145], [320, 170], [337, 176], [377, 147]]
    const knots = []
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[Math.max(0, i - 1)]
      const b = pts[i]
      const d = pts[i + 1]
      const e = pts[Math.min(pts.length - 1, i + 2)]
      for (let j = 0; j < 6; j++) {
        const u = j / 6
        knots.push(b.map((x, k) => 0.5 * ((2 * x) + (-a[k] + d[k]) * u +
          (2 * a[k] - 5 * x + 4 * d[k] - e[k]) * u ** 2 + (-a[k] + 3 * x - 3 * d[k] + e[k]) * u ** 3)))
      }
    }
    knots.push(pts.at(-1))
    const p = ease(phase(t, 0.03, 0.8))
    const tip = trace(c, knots, p, snow, 3.7)
    const tail = out(phase(t, 0.73, 0.92))
    trace(c, [[190, 211], [260, 206], [332, 199], [386, 190]], tail, aqua, 2.6)
    layer(c, () => glow(c, ...tip, 17, '#65f5ddba'), phase(t, 0, 0.12) * (1 - phase(t, 0.78, 0.94)))
  }

  demos['ms-after-effects'] = (c, t) => {
    const shape = (time, i) => {
      const entry = out(phase(time, 0, 0.42))
      const a = phase(time, 0.36, 1)
      const wave = Math.sin(a * TAU * 3.4) * Math.exp(-5.4 * a)
      const x = X - 168 * (1 - entry) + 42 * wave
      const y = Y - 31 * (1 - entry) - 15 * wave
      const r = 72 + 18 * wave
      layer(c, () => {
        polygon(c, [[x, y - r], [x + r * 1.1, y], [x, y + r], [x - r * 1.1, y]],
          i ? null : gradient(c, x - 48, y - 59, x + 51, y + 57, '#fff0a6', gold, '#df7528'), i ? gold : null, 1.8)
        if (!i) polygon(c, [[x, y - r], [x + r * 1.1, y], [x, y + r * 0.28], [x - r * 1.1, y]], '#ffedaf69')
      }, i ? (1 - phase(t, 0.34, 0.76)) * (0.42 - i * 0.08) : 1)
    }
    for (let i = 3; i >= 0; i--) shape(t - i * 0.043, i)
  }

  demos['ms-animation-principles'] = (c, t) => {
    const a = phase(t, 0.18, 0.61)
    const b = phase(t, 0.64, 0.84)
    const lift = 114 * 4 * a * (1 - a) + 34 * 4 * b * (1 - b)
    const squeeze = 0.25 * Math.sin(Math.PI * phase(t, 0.01, 0.18)) +
      0.32 * Math.sin(Math.PI * phase(t, 0.565, 0.675)) +
      0.15 * Math.sin(Math.PI * phase(t, 0.817, 0.91))
    const stretch = 0.23 * Math.sin(Math.PI * phase(t, 0.15, 0.34))
    const rx = 40 * (1 + squeeze - stretch * 0.58)
    const ry = 40 * (1 - squeeze + stretch)
    const y = 209 - lift - ry
    ellipse(c, X, 213, 49 - 20 * lift / 114, 7 - 2 * lift / 114, `rgba(255,131,160,${0.34 - 0.24 * lift / 114})`)
    const fill = c.createRadialGradient(X - 12, y - 16, 1, X, y, Math.max(rx, ry))
    fill.addColorStop(0, '#ffd9df')
    fill.addColorStop(0.36, '#ff91a6')
    fill.addColorStop(1, '#db3d7e')
    ellipse(c, X, y, rx, ry, fill)
  }

  demos['ms-beat-sync-editing'] = (c, t) => {
    const beat = Math.min(3, Math.floor(t * 4))
    const clock = fract(t * 4)
    const colors = [gold, violet, aqua, rose]
    const count = [3, 5, 8, 12][beat]
    const size = 1 + 0.19 * (1 - out(phase(clock, 0, 0.36)))
    layer(c, () => {
      c.translate(X, Y)
      c.scale(size, size)
      c.rotate(beat * 0.7 + 0.13 * clock)
      for (let i = 0; i < count; i++) {
        c.rotate(TAU / count)
        c.beginPath()
        c.moveTo(0, -9)
        c.quadraticCurveTo(-61, -28, 0, -100)
        c.quadraticCurveTo(61, -28, 0, -9)
        c.fillStyle = gradient(c, 0, -94, 0, -9, colors[beat], '#f7f5ff6f')
        c.fill()
      }
      ellipse(c, 0, 0, 6, 6, snow)
    })
  }

  demos['ms-color-motion'] = (c, t) => {
    const p = ease(phase(t, 0.06, 0.92))
    const hue = lerp(241, 388, p)
    const fill = c.createRadialGradient(209, 96, 1, X, Y, 97)
    fill.addColorStop(0, `hsl(${hue + 26} 100% 93%)`)
    fill.addColorStop(0.48, `hsl(${hue + 5} 96% 61%)`)
    fill.addColorStop(1, `hsl(${hue - 27} 68% 23%)`)
    ellipse(c, X, Y, 81, 81, fill)
    for (let i = 0; i < 2; i++) {
      const a = -0.36 + i * 0.28 + p * 0.21
      const delayed = lerp(241, 388, ease(phase(t, 0.15 + i * 0.045, 1)))
      ellipse(c, X, Y, 143 - i * 17, 26 + i * 11, `hsl(${delayed} 100% 77% / 0.68)`, 1.5, a)
    }
  }

  demos['ms-logo-animation'] = (c, t) => {
    for (let i = 0; i < 3; i++) {
      const p = bump(phase(t, i * 0.045, 0.54 + i * 0.05))
      const a = i * TAU / 3
      layer(c, () => {
        c.translate(X + 118 * (1 - p) * Math.cos(a - Math.PI / 2), Y + 83 * (1 - p) * Math.sin(a - Math.PI / 2))
        c.rotate(a - 1.3 * (1 - p))
        c.beginPath()
        c.moveTo(0, -10)
        c.bezierCurveTo(-63, -38, -40, -92, 14, -88)
        c.bezierCurveTo(29, -53, 26, -24, 0, -10)
        c.fillStyle = [snow, lime, aqua][i]
        c.fill()
      }, out(phase(t, 0, 0.2)))
    }
    const p = phase(t, 0.44, 0.76)
    spark(c, X, Y, 13 * Math.sin(Math.PI * p), snow)
  }

  demos['ms-motion-art-direction'] = (c, t) => {
    const settle = ease(phase(t, 0.71, 1))
    for (let i = 0; i < 7; i++) {
      const p = out(phase(t, i * 0.038, 0.6 + i * 0.038))
      const angle = (i - 3) * (0.235 * p - 0.03 * settle)
      layer(c, () => {
        c.translate(X, 211)
        c.rotate(angle)
        const shimmer = 87 * (0.5 + 0.5 * Math.sin(TAU * t + i * 0.48))
        const fill = gradient(c, -8, -146 + shimmer, 34, -21 + shimmer, '#562a26', '#db8d45', '#ffe4a0', '#75402d')
        c.beginPath()
        c.moveTo(-17, 0)
        c.bezierCurveTo(-41, -66, -38, -131, 9, -164)
        c.bezierCurveTo(38, -120, 31, -57, 14, 0)
        c.closePath()
        c.fillStyle = fill
        c.fill()
        c.strokeStyle = '#ffd79ba0'
        c.lineWidth = 0.8
        c.stroke()
      }, out(phase(t, 0, 0.21)))
    }
  }

  demos['ms-motion-background'] = (c, t) => {
    for (let i = 0; i < 3; i++) {
      const a = i * 1.74 + TAU * t
      const y = 127 + i * 14
      const bend = 61 * Math.sin(a)
      const crest = 24 * Math.cos(a * 2)
      const fill = gradient(c, 0, 0, W, H, '#00000000', ['#6cffcc91', '#8c67edb8', '#43a0ff89'][i], '#00000000')
      layer(c, () => {
        c.filter = `blur(${8 + i * 2}px)`
        c.beginPath()
        c.moveTo(-35, y + 67)
        c.bezierCurveTo(105, y - 130 + bend, 279, y + 72 + crest, 515, y - 75)
        c.bezierCurveTo(290, y + 149 + crest, 117, y - 69 + bend, -35, y + 95)
        c.fillStyle = fill
        c.fill()
      })
      c.beginPath()
      c.moveTo(-35, y + 72)
      c.bezierCurveTo(105, y - 112 + bend, 279, y + 86 + crest, 515, y - 62)
      c.strokeStyle = fill
      c.lineWidth = 1.6
      c.stroke()
    }
  }

  demos['ms-remotion-video'] = (c, t) => {
    const p = out(phase(t, 0.05, 0.78))
    const columns = [4 * p, 12 * p]
    mask(c, 120, 66, 240, 128, () => {
      columns.forEach((index, i) => {
        const center = Math.floor(index)
        for (let n = center - 1; n <= center + 1; n++) {
          if (n < 0) continue
          const dy = (n - index) * 105
          layer(c, () => words(c, String(n % 10), 198 + i * 83, 133 + dy, 117, snow, { family: mono }), 1 - Math.min(0.7, Math.abs(dy) / 130))
        }
      })
    })
    rect(c, 139, 209, 202, 2, '#ffffff3d')
    rect(c, 139, 209, 202 * p, 2, rose)
    ellipse(c, 139 + 202 * p, 210, 4, 4, rose)
  }

  demos['ms-shot-composition'] = (c, t) => {
    const p = ease(t)
    const colors = [['#4431ae', '#7966db'], ['#6c3fa0', '#bd70dc'], ['#ae3965', '#fb7d8c']]
    const shift = [18, 46, 91]
    ellipse(c, 309 - 13 * p, 100, 35, 35, gradient(c, 277, 65, 323, 135, '#fff2bd', gold))
    for (let i = 0; i < 3; i++) {
      const x = 46 - shift[i] * p
      const y = 146 + i * 26
      c.beginPath()
      c.moveTo(x, y + 21)
      c.bezierCurveTo(x + 103, y + 27, x + 108, y - 99, x + 221, y - 47)
      c.bezierCurveTo(x + 277, y - 10, x + 345, y - 21, x + 442, y - 62)
      c.bezierCurveTo(x + 339, y + 34, x + 162, y + 45, x, y + 21)
      c.fillStyle = gradient(c, x + 94, y - 43, x + 300, y + 29, ...colors[i])
      c.fill()
      c.strokeStyle = '#f2d2ff50'
      c.lineWidth = 0.9
      c.stroke()
    }
  }

  demos['ms-kinetic-typography'] = (c, t) => {
    const i = t < 0.28 ? 0 : t < 0.63 ? 1 : 2
    const p = phase(t, [0, 0.28, 0.63][i], [0.28, 0.63, 1][i])
    const value = ['PARE', 'OLHE', 'SIGA'][i]
    const color = [rose, snow, lime][i]
    if (i === 1) {
      mask(c, 38, 70, 404, 128, () => letters(c, value, X, Y, 101, color, (j) => {
        const step = out(phase(p, (j % 2 ? 0.12 : 0.02) + j * 0.052, 0.62 + j * 0.052))
        return { y: 86 * (1 - step), alpha: step }
      }))
      return
    }
    const arrive = bump(phase(p, 0, 0.37))
    const leave = ease(phase(p, 0.63, 1))
    layer(c, () => {
      c.translate(X + (i === 2 ? -69 * (1 - arrive) + 262 * leave : 0), Y)
      c.scale(i === 0 ? 1.18 - 0.18 * arrive : 1 + 0.25 * leave, i === 0 ? 0.53 + 0.47 * arrive : 1)
      words(c, value, 0, 0, 101, color, { italic: i === 2 })
    })
  }

  demos['ms-brand-motion-guidelines'] = (c, t) => {
    const p = bump(phase(t, 0.07, 0.53))
    const flash = Math.sin(Math.PI * phase(t, 0.53, 0.78))
    const scale = 1 + 0.12 * flash
    for (let i = 0; i < 3; i++) {
      const x = 111 + i * 129
      const color = [snow, gold, aqua][i]
      layer(c, () => {
        c.translate(x + (i - 1) * 85 * (1 - p), Y + (i === 1 ? -99 : 84) * (1 - p))
        c.rotate((1 - p) * (i - 1) * 0.95)
        c.scale(scale, scale)
        if (i === 0) ellipse(c, 0, 0, 42, 42, color, 7.5)
        if (i === 1) polygon(c, [[0, -49], [46, 0], [0, 49], [-46, 0]], color)
        if (i === 2) spark(c, 0, 0, 48, color, 0.29)
      }, out(phase(t, 0, 0.24)))
    }
  }

  demos['ms-client-revisions'] = (c, t) => {
    const a = out(phase(t, 0.03, 0.27))
    const b = out(phase(t, 0.28, 0.48))
    const cut = ease(phase(t, 0.83, 1))
    const width = 207 * a + 176 * b
    mask(c, 47 + cut * width, 67, width * (1 - cut), 130, () => {
      words(c, 'TEMPO', X, Y, 108, snow, { max: 374 })
      rect(c, 60, 190, 363, 2, violet)
    })
    if (t < 0.49) rect(c, 47 + width, 82, 2, 103, violet)
  }

  demos['ms-creative-brief'] = (c, t) => {
    const p = out(phase(t, 0.03, 0.36))
    const circle = bump(phase(t, 0.26, 0.53))
    const star = ease(phase(t, 0.56, 0.8))
    const path = Array.from({ length: 54 }, (_, i) => {
      const f = i / 53
      return [77 + 216 * f, 171 - 36 * f - 60 * Math.sin(Math.PI * f)]
    })
    trace(c, path, p, violet, 2.7)
    const [x, y] = path.at(-1)
    const r = 52 * circle * (1 - star)
    ellipse(c, x, y, r, r, gradient(c, 253, 95, 330, 170, violet, '#7656df'))
    spark(c, x, y, 81 * star, gradient(c, 259, 82, 340, 181, snow, gold))
    if (star > 0) ellipse(c, x, y, 98 * star, 98 * star, '#ffca7657', 1)
  }

  demos['ms-motion-pricing'] = (c, t) => {
    const formats = [[216, 121.5, -53, -0.33, '#a18aff'], [137, 137, 4, 0.09, '#ffbc76'], [93, 165, 67, 0.37, '#65f5dd']]
    formats.forEach(([w, h, x, a, color], i) => {
      const p = out(phase(t, 0.07 + i * 0.074, 0.65 + i * 0.074))
      layer(c, () => {
        c.translate(X + x * p, Y + (i - 1) * 5 * p)
        c.rotate(a * p)
        const width = lerp(216, w, p)
        const height = lerp(121.5, h, p)
        polygon(c, [[-width / 2, -height / 2], [width / 2, -height / 2], [width / 2, height / 2], [-width / 2, height / 2]],
          color + '24', color, 1.7)
        ellipse(c, 0, 0, 2.5, 2.5, color)
      }, i === 0 ? 1 : phase(t, 0.09 * i, 0.13 + 0.09 * i))
    })
  }

  demos['ms-video-delivery-specs'] = (c, t) => {
    const p = ease(phase(t, 0.14, 0.77))
    const w = lerp(296, 111, p)
    const h = lerp(166.5, 197, p)
    const y = lerp(135, 131, p)
    mask(c, X - w / 2, y - h / 2, w, h, () => {
      ellipse(c, X, y, 78, 78, gradient(c, 168, 57, 317, 206, '#ffceac', rose, '#813559'))
      for (let i = 0; i < 8; i++) {
        ellipse(c, X, y, 94 + i * 12, 47 + i * 6, '#ffbbd661', 1.2, -0.33)
      }
    })
    cropMarks(c, X, y, w + 17, h + 16, 15, snow)
  }
  demos['ms-particle-system'] = (c, t) => {
    for (let i = 0; i < 108; i++) {
      const burst = i < 68 ? 0.07 : 0.29
      const p = phase(t, burst + 0.11 * noise(i), burst + 0.51 + 0.2 * noise(i + 1))
      if (p <= 0 || p >= 1) continue
      const a = TAU * noise(i + 14)
      const reach = 62 + 132 * noise(i + 38)
      const r = reach * out(p)
      const x = X + r * Math.cos(a)
      const y = 120 + r * 0.61 * Math.sin(a) + 45 * p ** 2
      const size = (2 + 7.5 * noise(i + 83)) * (1 - 0.78 * p)
      layer(c, () => {
        c.translate(x, y)
        c.rotate(a + 2.1 * p)
        const color = [gold, rose, snow][i % 3]
        if (i % 7 === 0) spark(c, 0, 0, size * 2.2, color)
        else rect(c, -size, -size * 0.35, size * 2.2, size * 0.7, color, size * 0.31)
      }, Math.sin(Math.PI * p) ** 0.57)
    }
    const center = Math.sin(Math.PI * phase(t, 0.02, 0.27)) + 0.65 * Math.sin(Math.PI * phase(t, 0.24, 0.5))
    glow(c, X, 120, 36, `rgba(255,190,107,${clamp(center) * 0.57})`)
    spark(c, X, 120, center * 26, snow)
  }

  let plasmaBuffer

  function makePlasmaBuffer(c) {
    const canvas = c.canvas.ownerDocument.createElement('canvas')
    canvas.width = 160
    canvas.height = 90
    const ctx = canvas.getContext('2d')
    return { canvas, ctx, pixels: ctx.createImageData(canvas.width, canvas.height) }
  }

  demos['ms-shader-glsl'] = (c, t) => {
    plasmaBuffer ??= makePlasmaBuffer(c)
    const { canvas, ctx, pixels } = plasmaBuffer
    const a = TAU * t
    const data = pixels.data
    for (let y = 0; y < 90; y++) {
      const v = y / 90
      for (let x = 0; x < 160; x++) {
        const u = x / 160
        const fold = Math.sin(u * 7.1 + a + 0.9 * Math.cos(v * 10 - a))
        const bend = Math.sin(v * 6.6 - a + 1.2 * Math.cos(u * 8.2 + a))
        const radius = Math.hypot((u - 0.6) * 1.45, v - 0.39)
        const wave = Math.sin(radius * 16.4 + a * 2 + fold * 0.9)
        const p = clamp(0.5 + 0.22 * fold + 0.24 * bend + 0.24 * wave)
        const i = (y * 160 + x) * 4
        data[i] = 16 + 239 * p ** 1.45
        data[i + 1] = 7 + 193 * p ** 4
        data[i + 2] = 42 + 128 * Math.sin(Math.PI * p) ** 1.7
        data[i + 3] = 255
      }
    }
    ctx.putImageData(pixels, 0, 0)
    c.imageSmoothingQuality = 'high'
    c.drawImage(canvas, 0, 0, W, H)
  }

  demos['ms-threejs-animation'] = (c, t) => {
    const a = TAU * t + 0.24
    const tilt = 0.44
    const vertices = [[0, -102, 0], [76, 0, 0], [0, 0, 76], [-76, 0, 0], [0, 0, -76], [0, 100, 0]]
    const positions = vertices.map(([x, y, z]) => {
      const hx = x * Math.cos(a) + z * Math.sin(a)
      const hz = -x * Math.sin(a) + z * Math.cos(a)
      const hy = y * Math.cos(tilt) - hz * Math.sin(tilt)
      const depth = y * Math.sin(tilt) + hz * Math.cos(tilt)
      const scale = 335 / (335 - depth)
      return [X + hx * scale, Y + hy * scale, depth]
    })
    const faces = [[0, 1, 2], [0, 2, 3], [0, 3, 4], [0, 4, 1], [5, 2, 1], [5, 3, 2], [5, 4, 3], [5, 1, 4]]
      .map((face, i) => ({ points: face.map(vertex => positions[vertex]), i }))
      .sort((a, b) => a.points.reduce((sum, p) => sum + p[2], 0) - b.points.reduce((sum, p) => sum + p[2], 0))
    glow(c, X, 215, 55, '#6962ed4a')
    faces.forEach(({ points, i }) => {
      const [p, q, r] = points
      const area = (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0])
      if (area < 0) return
      const brightness = 38 + 29 * (0.5 + 0.5 * Math.sin(a + i * 1.31))
      const fill = gradient(c, p[0], p[1], q[0], q[1], `hsl(${219 + i * 7} 91% ${brightness + 20}%)`, `hsl(${225 + i * 6} 61% ${brightness - 16}%)`)
      polygon(c, points.map(([x, y]) => [x, y]), fill, '#e1ddff92', 1.2)
    })
  }

  demos['ms-manim'] = (c, t) => {
    const p = phase(t, 0.04, 0.96)
    const r = 56
    const point = [115 + r * Math.cos(TAU * p), Y - r * Math.sin(TAU * p)]
    const target = [188 + 224 * p, point[1]]
    ellipse(c, 115, Y, r, r, '#afa1ff9f', 1.4)
    line(c, [[59, Y], [419, Y]], '#cbd1ec3a')
    line(c, [[115, Y + r + 11], [115, Y - r - 11]], '#cbd1ec3a')
    line(c, [[115, Y], point], violet, 1.6)
    layer(c, () => {
      c.setLineDash([3, 4])
      line(c, [point, target], '#d2d2ff7b')
    })
    const curve = Array.from({ length: 66 }, (_, i) => {
      const f = p * i / 65
      return [188 + 224 * f, Y - r * Math.sin(TAU * f)]
    })
    line(c, curve, aqua, 2.7)
    ellipse(c, ...point, 5.7, 5.7, violet)
    ellipse(c, ...target, 4.5, 4.5, snow)
  }

  demos['ms-generative-illustration'] = (c, t) => {
    for (let stem = 0; stem < 3; stem++) {
      const p = out(phase(t, 0.02 + stem * 0.075, 0.65 + stem * 0.09))
      const point = f => {
        const sway = Math.sin(t * TAU + stem) * 7 * f ** 2
        return [238 + (stem - 1) * (12 + 132 * f ** 1.36) + 29 * Math.sin(Math.PI * f) + sway,
          222 - f * [147, 177, 130][stem]]
      }
      trace(c, Array.from({ length: 46 }, (_, i) => point(i / 45)), p, '#9dca8b', 1.7)
      for (let i = 0; i < 8; i++) {
        const f = 0.18 + i * 0.104
        const open = out(phase(p, f - 0.02, f + 0.15))
        if (open <= 0) continue
        const [x, y] = point(f)
        const side = i % 2 ? -1 : 1
        const size = (45 - 17 * f + noise(i * stem + 14) * 8) * open
        layer(c, () => {
          c.translate(x, y)
          c.rotate(side * (0.27 + 0.79 * open) + (stem - 1) * 0.54)
          c.beginPath()
          c.moveTo(0, 0)
          c.quadraticCurveTo(-size * 0.45, -size * 0.54, 0, -size)
          c.quadraticCurveTo(size * 0.47, -size * 0.63, 0, 0)
          c.fillStyle = gradient(c, 0, 0, 0, -size, '#1b6a58', ['#7ac990', '#d9f39b', '#b9dc80'][stem])
          c.fill()
          line(c, [[0, 0], [0, -size * 0.87]], '#d4f6b463', 0.7)
        })
      }
    }
  }

  demos['ms-javascript-animation'] = (c, t) => {
    for (let i = 0; i < 32; i++) {
      const speed = i % 3 === 0 ? 2 : 1
      const p = fract(t * speed + noise(i + 76))
      const x = 55 + noise(i + 17) * 358
      const floor = 156 + noise(i + 9) * 67
      if (p < 0.52) {
        const fall = p / 0.52
        const y = lerp(26 + 58 * noise(i + 94), floor, fall)
        const dx = -34 * (1 - fall)
        layer(c, () => {
          const streak = gradient(c, x + dx - 10, y - 23, x + dx, y, '#638eff00', i % 5 === 0 ? snow : '#84caff')
          line(c, [[x + dx - 10, y - 23], [x + dx, y]], streak, 1.1 + 2.1 * noise(i + 20))
        }, Math.sin(Math.PI * fall) ** 0.35)
      } else {
        const ripple = out(phase(p, 0.52, 0.99))
        layer(c, () => {
          ellipse(c, x, floor, 3 + 30 * ripple, 1 + 7 * ripple, '#77c5ff', 1.5)
          ellipse(c, x, floor, 2 + 13 * ripple, 1 + 3 * ripple, '#c7b7ff', 1.2)
        }, (1 - ripple) * 0.89)
      }
    }
  }

  demos['ms-soundtrack'] = (c, t) => {
    for (let beat = 0; beat < 4; beat++) {
      const p = phase(t, 0.04 + beat * 0.21, 0.37 + beat * 0.21)
      const size = 13 + (beat === 3 ? 113 : 83) * out(p)
      if (p > 0 && p < 1) layer(c, () => {
        ellipse(c, X, Y, size, size, gold, 3.6 - 2.5 * p)
        ellipse(c, X, Y, size * 0.68, size * 0.68, '#ffca766c', 1)
      }, 1 - p)
    }
    for (let i = 0; i < 3; i++) {
      const p = Math.sin(Math.PI * phase(t, 0.16 + i * 0.21, 0.28 + i * 0.21))
      spark(c, i % 2 ? 344 : 133, 93 + i * 26, 26 * p, aqua)
    }
    const beat = fract(t / 0.21)
    ellipse(c, X, Y, 6 + 9 * (1 - out(beat)), 6 + 9 * (1 - out(beat)), snow)
  }

  demos['ms-lower-thirds-alpha'] = (c, t) => {
    const a = out(phase(t, 0.03, 0.34)) * (1 - ease(phase(t, 0.81, 1)))
    const b = out(phase(t, 0.12, 0.46)) * (1 - ease(phase(t, 0.72, 0.95)))
    const x = 35
    const y = 177
    const top = (width, yy, height) => [[x, yy], [x + width, yy], [x + Math.max(0, width - 20), yy + height], [x, yy + height]]
    if (a > 0) polygon(c, top(243 * a, y, 43), gradient(c, x, y, 272, y, '#43cfe6', aqua))
    if (b > 0) polygon(c, top(191 * b, y + 43, 24), '#4846a8')
    mask(c, x + 12, y, 187 * a, 42, () => words(c, 'Rui Terra', x + 14, y + 22, 26, ink, { align: 'left' }))
    mask(c, x + 12, y + 43, 151 * b, 24, () => words(c, 'CURADORIA', x + 15, y + 56, 11, snow, { align: 'left', family: mono }))
  }

  demos['ms-talking-head-b-roll'] = (c, t) => {
    const colors = [rose, gold, violet]
    for (let i = 0; i < 3; i++) {
      const p = out(phase(t, i * 0.185 + 0.04, i * 0.185 + 0.37))
      if (p <= 0) continue
      const x = 114 + i * 126
      const y = Y - 12 + (i % 2) * 29
      layer(c, () => {
        c.translate(x, y)
        c.rotate(-0.28)
        mask(c, -70, 60 - 122 * p, 140, 122 * p, () => {
          c.rotate(0.28)
          const fill = gradient(c, -50, -57, 53, 48, snow, colors[i], colors[i])
          if (i === 0) ellipse(c, 0, 0, 52, 52, fill)
          if (i === 1) rect(c, -49, -49, 98, 98, fill, 30)
          if (i === 2) polygon(c, [[0, -58], [53, 0], [0, 58], [-53, 0]], fill)
        })
        const trace = phase(p, 0, 0.84)
        if (trace < 1) line(c, [[-58, 60 - 122 * p], [58, 60 - 122 * p]], colors[i], 2)
      })
    }
  }

  demos['ms-talking-head'] = (c, t) => {
    const p = bump(phase(t, 0.1, 0.42))
    const exit = ease(phase(t, 0.78, 1))
    const x = 346 + 108 * (1 - p) + 92 * exit
    const y = 127
    layer(c, () => {
      const text = out(phase(t, 0.23, 0.51))
      spark(c, x - 72, y, 27 * p * (1 - exit), gold)
      mask(c, x - 43, y - 32, 137 * text, 70, () => {
        words(c, 'FOCO', x + 26 - 14 * (1 - text), y + 1, 39, snow, { max: 134 })
        rect(c, x - 36, y + 31, 130 * text, 1.6, gold)
      })
    }, 1 - exit)
  }

  demos['showcase-implode'] = (c, t) => {
    letters(c, 'PULSO', X, Y, 91, snow, (i, n) => {
      const edge = Math.abs(i - (n - 1) / 2)
      const p = phase(t, 0.21 - edge * 0.034, 0.61 - edge * 0.017) ** 2.25
      return { x: (2 - i) * 64 * p, y: -Math.sin(p * Math.PI) * (i - 2) * 25,
        rotation: 2.7 * p, sx: 1 - p, sy: 1 - p, alpha: 1 - p, blur: p * 6 }
    }, { tracking: -3.6 })
    const hit = phase(t, 0.48, 0.68)
    spark(c, X, Y, 22 * Math.sin(Math.PI * hit), gold)
    letters(c, 'NOVO', X, Y, 95, violet, (i, n) => {
      const p = out(phase(t, 0.59 + Math.abs(i - (n - 1) / 2) * 0.035, 0.89 + i * 0.019))
      return { x: (1.5 - i) * 65 * (1 - p), rotation: -1.2 * (1 - p), sx: p, sy: p, alpha: p }
    }, { tracking: -3.8 })
  }

  demos['showcase-color-band-sweep'] = (c, t) => {
    const p = ease(phase(t, 0.16, 0.81))
    if (p < 0.5) {
      ellipse(c, X, Y, 72, 72, rose)
      ellipse(c, X, Y, 88, 88, '#ff667da1', 1.2)
    } else {
      polygon(c, [[X, 46], [350, Y], [X, 224], [130, Y]], violet)
      polygon(c, [[X, 34], [365, Y], [X, 236], [115, Y]], null, '#b3a0ff96', 1.2)
    }

    // As três faixas cobrem os dois cantos opostos no instante da troca.
    const top = 302 - 713 * p
    const colors = [aqua, snow, '#7855ee']
    colors.forEach((color, i) => {
      const y = top + i * 126
      polygon(c, [[-1, y + 31], [481, y - 30], [481, y + 97], [-1, y + 158]], color)
    })
  }

  demos['showcase-venetian-shutter'] = (c, t) => {
    if (t < 0.51) {
      const fill = gradient(c, 183, 74, 300, 204, rose, '#b642a8')
      ellipse(c, X, Y, 78, 78, fill)
      ellipse(c, X, Y, 49, 49, '#ffbac2b3', 1.4)
    } else {
      spark(c, X, Y, 88, aqua)
      ellipse(c, X, Y, 98, 98, '#65f5dd80', 1.3)
    }
    const colors = ['#8b63fa', gold, aqua, snow]
    for (let i = 0; i < 4; i++) {
      const close = phase(t, 0.09 + i * 0.062, 0.27 + i * 0.062) ** 2
      const open = out(phase(t, 0.52 + i * 0.064, 0.77 + i * 0.064))
      const h = 68
      const y = i * 67.5 + h * open
      const visible = h * close * (1 - open)
      rect(c, 0, y, W, visible, colors[i])
      if (visible > 0.5) rect(c, 0, y, W, 1.2, '#ffffff95')
    }
  }

  demos['showcase-whip-pan-blur'] = (c, t) => {
    const leaving = phase(t, 0.2, 0.56)
    const entering = phase(t, 0.42, 0.81)
    const rush = Math.sin(Math.PI * phase(t, 0.35, 0.63))
    layer(c, () => {
      const streak = gradient(c, 45, Y, 434, Y, '#ffffff00', '#edeff27d', '#d9ff5c00')
      rect(c, 0, Y - 29, W, 2, streak)
      rect(c, 0, Y + 36, W, 1, streak)
    }, rush)
    function whip(value, x, color, strength) {
      for (let i = 7; i > 0; i--) {
        layer(c, () => words(c, value, x + i * 19 * strength, Y, 108, color), strength * (0.23 - i * 0.02))
      }
      layer(c, () => {
        if (strength > 0.03) c.filter = `blur(${2.5 * strength}px)`
        words(c, value, x, Y, 108, color)
      })
    }
    if (leaving < 1) whip('VAI', X - 459 * leaving ** 2.8, snow, leaving)
    if (entering > 0) whip('VEM', X + 443 * (1 - out(entering)), lime, (1 - entering) ** 2)
  }

  demos['showcase-iris'] = (c, t) => {
    const open = t < 0.5 ? 1 - ease(phase(t, 0.15, 0.47)) : ease(phase(t, 0.53, 0.86))
    const r = 131 * open
    if (r < 0.3) return
    layer(c, () => {
      c.beginPath()
      c.arc(X, Y, r, 0, TAU)
      c.clip()
      if (t < 0.5) {
        ellipse(c, X, Y, 83, 83, gradient(c, 168, 65, 310, 212, '#ffad9e', '#ff537e'), 25)
        ellipse(c, X, Y, 58, 58, '#ff96aa73', 1.2)
      } else {
        for (let i = 0; i < 8; i++) {
          const a = i * TAU / 8
          ellipse(c, X + 45 * Math.cos(a), Y + 45 * Math.sin(a), 47, 12.5, aqua, 0, a)
        }
        ellipse(c, X, Y, 6, 6, snow)
      }
    })
    layer(c, () => ellipse(c, X, Y, r, r, t < 0.5 ? rose : aqua, 1.9), Math.sin(Math.PI * open))
  }

  demos['showcase-s1'] = (c, t) => {
    mask(c, 27, 54, 426, 151, () => {
      letters(c, 'IMPULSO', X, Y, 79, snow, (i) => {
        const p = bump(phase(t, 0.055 + i * 0.048, 0.38 + i * 0.046))
        return { y: 79 * (1 - p), sy: 0.04 + 0.96 * p, alpha: out(phase(p, 0, 0.65)) }
      }, { tracking: lerp(-4, 1.3, ease(phase(t, 0.68, 1))) })
    })
    const lineIn = out(phase(t, 0.59, 0.86))
    rect(c, X - 144 * lineIn, 192, 288 * lineIn, 1.7, gold)
  }

  demos['showcase-s2'] = (c, t) => {
    const order = [1, 0, 4, 2, 3, 5]
    mask(c, 56, 64, 368, 148, () => {
      letters(c, 'a cada', X, 137, 111, gold, (i, n) => {
        const p = out(phase(t, 0.03 + order[i] * 0.035, 0.36 + order[i] * 0.041))
        const exit = phase(t, 0.72 + (2.5 - Math.abs(i - (n - 1) / 2)) * 0.033, 0.99) ** 2
        return { y: 95 * (1 - p) - 78 * exit, rotation: (1 - p) * 0.24,
          sx: 1 - 0.37 * exit, sy: 1 - 0.37 * exit, alpha: p * (1 - exit) }
      }, { family: serif, italic: true, weight: 500, tracking: -5 })
    })
  }

  demos['showcase-s3'] = (c, t) => {
    const hit = phase(t, 0.32, 0.54)
    const shake = 6 * Math.sin(hit * TAU * 2) * (1 - hit)
    letters(c, 'QUADRO', X + shake, Y, 84, snow, (i, n) => {
      const distance = Math.abs(i - (n - 1) / 2)
      const p = out(phase(t, 0.01 + distance * 0.052, 0.41 + distance * 0.039))
      const exit = phase(t, 0.72 + (n - i) * 0.021, 0.99) ** 2
      return { y: 99 * exit, sx: 1 + 2.3 * (1 - p), sy: (1 + 2.3 * (1 - p)) * (1 - 0.92 * exit),
        alpha: p * (1 - exit), blur: 8 * (1 - p), outline: 2.1 }
    }, { tracking: -4 })
  }

  demos['showcase-s4'] = (c, t) => {
    const lines = [['CORTE', 77, 56, aqua], ['MOVA', 132, 64, violet], ['ENTREGUE', 188, 55, rose]]
    lines.forEach(([value, y, size, color], row) => {
      mask(c, 37, y - 31, 406, 61, () => {
        letters(c, value, X, y, size, color, (i) => {
          const begin = 0.025 + row * 0.18 + i * 0.022
          const p = (row === 2 ? bump : out)(phase(t, begin, begin + 0.32))
          const wave = row === 2 ? 6 * Math.sin(TAU * phase(t, 0.68 + i * 0.011, 0.93 + i * 0.008)) : 0
          return { x: row === 1 ? -80 * (1 - p) : 0, y: row === 0 ? 62 * (1 - p) : wave,
            sx: row === 2 ? 1 + 0.65 * (1 - p) : 1, sy: row === 2 ? 1 + 0.65 * (1 - p) : 1, alpha: p }
        }, { tracking: -2.6 })
      })
    })
  }

  demos['showcase-s5'] = (c, t) => {
    const frame = out(phase(t, 0.12, 0.6))
    const underline = ease(phase(t, 0.5, 0.74))
    layer(c, () => cropMarks(c, X, Y, 338 + 54 * (1 - frame), 172 + 41 * (1 - frame), 20, snow, 1.8), frame)
    rect(c, X - 119 * underline, 193, 238 * underline, 1.65, gold)
    const lines = [['ESTÚDIO', 106, snow], ['NORTE', 158, gold]]
    lines.forEach(([value, y, color], row) => {
      mask(c, 69, y - 42, 342, 71, () => {
        letters(c, value, X, y, 58, color, (i) => {
          const p = bump(phase(t, 0.06 + row * 0.145 + i * 0.032, 0.41 + row * 0.132 + i * 0.032))
          return { y: 55 * (1 - p), sy: 0.09 + 0.91 * p, alpha: p }
        }, { tracking: -2.6 })
      })
    })
  }

  demos['showcase-s6'] = (c, t) => {
    const p = out(phase(t, 0.12, 0.56))
    const pulse = Math.sin(Math.PI * phase(t, 0.53, 0.69)) + 0.45 * Math.sin(Math.PI * phase(t, 0.7, 0.87))
    layer(c, () => cropMarks(c, X, Y, 346 + 53 * (1 - p), 141 + 42 * (1 - p), 15, '#f8f3e9a8'), p)
    mask(c, 68, 76, 344, 121, () => {
      const x = X - 10
      const size = 94
      letters(c, 'norte', x, 132, size, snow, (i) => {
        const enter = bump(phase(t, 0.09 + 0.034 * i, 0.45 + 0.031 * i))
        return { y: 63 * (1 - enter), sy: 0.12 + 0.88 * enter, alpha: enter }
      }, { tracking: -4 })
      const width = [...'norte'].reduce((sum, char) => sum + c.measureText(char).width, -16)
      const enter = bump(phase(t, 0.4, 0.59))
      const radius = 7.6 * (enter + 0.46 * pulse)
      ellipse(c, x + width / 2 + 11, 159 + 14 * (1 - enter), radius, radius, gold)
    })
    const underline = out(phase(t, 0.44, 0.69))
    rect(c, X - 100 * underline, 182, 200 * underline, 1.5, gold)
  }
})()

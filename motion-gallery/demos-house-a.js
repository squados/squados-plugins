(() => {
  'use strict';

  const demos = window.motionDemos ??= Object.create(null);
  const ink = '#111a29';
  const slate = '#26364d';
  const white = '#f5f6fa';
  const mist = '#adbbcb';
  const blue = '#83aaff';
  const green = '#8fe5bc';
  const coral = '#ff917e';
  const gold = '#f8d783';
  const purple = '#c4adff';
  const accents = [blue, coral, green, gold, purple];

  const clamp = value => Math.max(0, Math.min(1, value));
  const phase = (t, from, to) => clamp((t - from) / (to - from));
  const ease = (t, from, to) => {
    const p = phase(t, from, to);
    return p * p * (3 - 2 * p);
  };
  const mix = (a, b, p) => a + (b - a) * p;

  function box(ctx, x, y, w, h, color, radius = 8, stroke) {
    if (w <= 0 || h <= 0) return;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);
    ctx.fillStyle = color;
    ctx.fill();
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  function label(ctx, value, x, y, size = 13, color = white, weight = 650, align = 'left') {
    ctx.font = weight + ' ' + size + 'px system-ui, sans-serif';
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';
    ctx.fillText(value, x, y);
  }

  function line(ctx, points, color, width = 2) {
    ctx.beginPath();
    ctx.moveTo(...points[0]);
    points.slice(1).forEach(point => ctx.lineTo(...point));
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = color;
    ctx.stroke();
  }

  function dot(ctx, x, y, r, color) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }

  function outline(ctx, x, y, rx, ry, color, width = 2, from = 0, to = Math.PI * 2) {
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, from, to);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  }

  function poly(ctx, points, color) {
    ctx.beginPath();
    ctx.moveTo(...points[0]);
    points.slice(1).forEach(point => ctx.lineTo(...point));
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  function reveal(ctx, amount, draw, distance = 12) {
    if (amount <= 0) return;
    ctx.save();
    ctx.globalAlpha *= amount;
    ctx.translate(0, (1 - amount) * distance);
    draw();
    ctx.restore();
  }

  function clip(ctx, x, y, w, h, draw, r = 8) {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.clip();
    draw();
    ctx.restore();
  }

  function stage(ctx, name, accent = blue) {
    box(ctx, 0, 0, 480, 270, ink, 0);
    for (let y = 49; y < 265; y += 16) {
      for (let x = 16; x < 480; x += 16) dot(ctx, x, y, 0.7, '#26364a');
    }
    box(ctx, 20, 20, 7, 7, accent, 2);
    label(ctx, name, 35, 24, 11, accent, 750);
    line(ctx, [[20, 40], [460, 40]], slate, 1);
  }

  function pill(ctx, text, x, y, color = blue, w = 100) {
    box(ctx, x, y, w, 23, color, 11);
    label(ctx, text, x + w / 2, y + 11.5, 10, ink, 760, 'center');
  }

  function windowPanel(ctx, x, y, w, h, title, light = false) {
    box(ctx, x, y, w, h, light ? white : '#172439', 10, light ? '#c4cdda' : '#38516b');
    line(ctx, [[x + 1, y + 24], [x + w - 1, y + 24]], light ? '#d8dfea' : '#344860', 1);
    [coral, gold, green].forEach((color, i) => dot(ctx, x + 12 + i * 9, y + 12, 2.5, color));
    label(ctx, title, x + 42, y + 12, 10, light ? '#233650' : mist, 700);
  }

  function prompt(ctx, text, x, y, w, p) {
    box(ctx, x, y, w, 37, '#20314a', 9, '#4b668c');
    label(ctx, '›', x + 12, y + 17, 22, green, 800);
    label(ctx, text.slice(0, Math.ceil(text.length * p)), x + 30, y + 18, 13);
  }

  function arrow(ctx, x1, y1, x2, y2, p = 1, color = mist) {
    if (!p) return;
    const x = mix(x1, x2, p);
    const y = mix(y1, y2, p);
    const angle = Math.atan2(y2 - y1, x2 - x1);
    line(ctx, [[x1, y1], [x, y]], color);
    line(ctx, [[x - 7 * Math.cos(angle - 0.6), y - 7 * Math.sin(angle - 0.6)], [x, y],
      [x - 7 * Math.cos(angle + 0.6), y - 7 * Math.sin(angle + 0.6)]], color);
  }

  function cursor(ctx, x, y, active = false) {
    if (active) outline(ctx, x, y, 9, 9, green);
    poly(ctx, [[x, y], [x + 12, y + 6], [x + 6, y + 7], [x + 5, y + 13]], white);
    line(ctx, [[x, y], [x + 12, y + 6], [x + 6, y + 7], [x + 5, y + 13], [x, y]], ink, 1);
  }

  function lines(ctx, x, y, w, count = 3, color = '#536781', p = 1, gap = 10) {
    for (let i = 0; i < count; i++) {
      box(ctx, x, y + i * gap, w * (1 - (i % 3) * 0.16) * clamp(p * count - i), 3, color, 2);
    }
  }

  function art(ctx, x, y, w, h, kind, pan = 0) {
    const color = accents[kind % accents.length];
    box(ctx, x, y, w, h, color, 6);
    clip(ctx, x, y, w, h, () => {
      dot(ctx, x + w * 0.72 + pan, y + h * 0.32, h * 0.16, '#ffefb7');
      poly(ctx, [[x - 10, y + h], [x + w * 0.33 + pan, y + h * 0.3], [x + w * 0.82 + pan, y + h]], '#334b65');
      poly(ctx, [[x + w * 0.27, y + h], [x + w * 0.73 + pan / 2, y + h * 0.46], [x + w + 10, y + h]], '#1c2e45');
      line(ctx, [[x + w * 0.4, y + h], [x + w * 0.61, y + h * 0.72], [x + w * 0.67, y + h * 0.7]], '#e0e9f8', 1.5);
    }, 6);
  }

  function avatar(ctx, x, y, r, person = 0, expression = 0, t = 0) {
    const color = accents[person % accents.length];
    const skin = ['#c88a5e', '#e5a987', '#ae795c', '#f0ba93', '#a26f54'][person % 5];
    dot(ctx, x, y, r, '#344963');
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.clip();
    dot(ctx, x, y + r * 0.82, r * 0.78, color);
    dot(ctx, x, y - r * 0.2, r * 0.57, '#2d2734');
    dot(ctx, x, y - r * 0.06, r * 0.47, skin);
    dot(ctx, x - r * 0.17, y - r * 0.1, r * 0.045, ink);
    dot(ctx, x + r * 0.17, y - r * 0.1, r * 0.045, ink);
    if (expression > 0.25) outline(ctx, x, y + r * 0.13, r * 0.15, r * (0.09 + Math.abs(Math.sin(t * 28)) * 0.06), '#492b38', 1.5, 0, Math.PI);
    else line(ctx, [[x - r * 0.12, y + r * 0.21], [x + r * 0.12, y + r * 0.21]], '#492b38', 1.5);
    ctx.restore();
  }

  function phone(ctx, x, y, w, h, draw) {
    box(ctx, x, y, w, h, '#101625', 15, '#8ca1b7');
    clip(ctx, x + 5, y + 7, w - 10, h - 14, () => draw(x + 5, y + 7, w - 10, h - 14), 10);
    box(ctx, x + w * 0.34, y + 5, w * 0.32, 5, '#101625', 3);
  }

  function carousel(ctx, x, y, w, h, i, p = 1) {
    const theme = i % accents.length;
    box(ctx, x, y, w, h, i % 2 ? white : '#22354e', 8);
    const color = i % 2 ? ink : white;
    const headlines = ['Perto do céu', 'Entre vales', 'Trilha da lua', 'Luzes da serra', 'Mais lá fora'];
    reveal(ctx, p, () => {
      art(ctx, x + 5, y + 5, w - 10, h * 0.55, theme);
      if (w > 53) {
        label(ctx, headlines[theme], x + 7, y + h * 0.75, w > 100 ? 13 : 9, color, 800);
        lines(ctx, x + 7, y + h * 0.85, w - 21, 1, i % 2 ? '#7c899c' : mist);
      }
    }, 6);
  }

  function feed(ctx, x, y, w, h, items, p = 1) {
    box(ctx, x, y, w, h, '#edf0f6', 0);
    dot(ctx, x + 15, y + 20, 6, coral);
    label(ctx, 'Caderno de trilhas', x + 25, y + 20, Math.min(12, w / 14), ink, 760);
    const cell = (w - 20) / 3;
    for (let i = 0; i < items; i++) {
      reveal(ctx, ease(p, i * 0.08, i * 0.08 + 0.18), () => carousel(ctx,
        x + 6 + (i % 3) * (cell + 3), y + 34 + Math.floor(i / 3) * (cell + 5), cell, cell, i));
    }
  }

  function graph(ctx, x, y, w, h, values, p, color = green, bars = false) {
    [0, 0.33, 0.66, 1].forEach(n => line(ctx, [[x, y + h * n], [x + w, y + h * n]], '#3b506a', 1));
    if (bars) {
      const stride = w / values.length;
      values.forEach((value, i) => {
        const amount = ease(p, i * 0.06, i * 0.06 + 0.43);
        const height = h * value * amount;
        box(ctx, x + i * stride + stride * 0.18, y + h - height, stride * 0.63, height, color, 3);
      });
      return;
    }
    const points = values.map((value, i) => [x + w * i / (values.length - 1), y + h * (1 - value)]);
    clip(ctx, x - 3, y - 3, w * p + 6, h + 6, () => line(ctx, points, color, 3), 0);
    const index = Math.min(points.length - 2, Math.floor(p * (points.length - 1)));
    const amount = p * (points.length - 1) - index;
    dot(ctx, mix(points[index][0], points[index + 1][0], amount), mix(points[index][1], points[index + 1][1], amount), 3.5, color);
  }

  function gauge(ctx, x, y, r, value, text, color) {
    outline(ctx, x, y, r, r, slate, 7, Math.PI * 0.78, Math.PI * 2.22);
    if (value) outline(ctx, x, y, r, r, color, 7, Math.PI * 0.78, Math.PI * (0.78 + 1.44 * value));
    label(ctx, text, x, y + 2, r * 0.6, color, 780, 'center');
  }

  function party(ctx, x, y, t, from, spread = 65) {
    const p = phase(t, from, from + 0.25);
    if (p <= 0 || p >= 1) return;
    for (let i = 0; i < 16; i++) {
      const a = i * Math.PI / 8;
      const r = p * spread * (0.48 + (i % 5) * 0.13);
      box(ctx, x + Math.cos(a) * r, y + Math.sin(a) * r + p * p * 15, 4, 4, accents[i % 5], 1);
    }
  }

  demos['01-G'] = (ctx, t) => {
    stage(ctx, 'CARROSSÉIS / PUBLICAÇÃO', coral);
    const move = ease(t, 0.48, 0.77);
    reveal(ctx, 1 - ease(t, 0.52, 0.78), () => prompt(ctx, 'Crie três slides sobre trilhas', 42, 54, 275, phase(t, 0, 0.28)));
    reveal(ctx, ease(t, 0.41, 0.63), () => phone(ctx, 326, 55, 109, 187,
      (x, y, w, h) => feed(ctx, x, y, w, h, 6, ease(t, 0.73, 0.94))));
    for (let i = 0; i < 3; i++) {
      reveal(ctx, ease(t, 0.18 + i * 0.07, 0.36 + i * 0.07) * (1 - ease(t, 0.68, 0.8)), () => {
        carousel(ctx, mix(43 + i * 87, 335 + i * 32, move), mix(111, 96, move), mix(76, 29, move), mix(108, 31, move), i);
      });
    }
    reveal(ctx, ease(t, 0.79, 0.93), () => pill(ctx, '✓ Publicado', 194, 170, green, 110));
  };

  demos['01-E1'] = (ctx, t) => {
    stage(ctx, 'CARROSSÉIS / COMPOSIÇÃO', coral);
    for (let i = 0; i < 3; i++) {
      const x = 49 + i * 131;
      const p = ease(t, 0.09 + i * 0.16, 0.37 + i * 0.16);
      box(ctx, x, 69, 118, 147, '#22354e', 8, '#4b6384');
      carousel(ctx, x, 69, 118, 147, i, p);
      label(ctx, '0' + (i + 1) + ' / 03', x + 59, 235, 10, p > 0.9 ? green : mist, 720, 'center');
    }
  };

  demos['01-E2'] = (ctx, t) => {
    stage(ctx, 'CARROSSÉIS / VARIAÇÕES', purple);
    reveal(ctx, 1 - ease(t, 0.16, 0.54), () => carousel(ctx, 183, 65, 114, 171, 0));
    for (let i = 0; i < 6; i++) {
      const p = ease(t, 0.14 + i * 0.055, 0.45 + i * 0.055);
      reveal(ctx, p, () => carousel(ctx, mix(184, 97 + i % 3 * 101, p), mix(102, 54 + Math.floor(i / 3) * 101, p), 88, 94, i));
    }
  };

  demos['01-E3'] = (ctx, t) => {
    stage(ctx, 'CARROSSÉIS / FILA', coral);
    label(ctx, 'Fila de publicação', 36, 69, 14);
    const status = [0, 1, 2].filter(i => t > 0.4 + i * 0.19).length;
    phone(ctx, 298, 55, 145, 190, (x, y, w, h) => feed(ctx, x, y, w, h, 3 + status));
    for (let i = 0; i < 3; i++) {
      const p = ease(t, 0.14 + i * 0.19, 0.4 + i * 0.19);
      if (p < 1) carousel(ctx, mix(36 + i * 78, 309 + i * 44, p), mix(100, 139, p), mix(68, 39, p), mix(95, 39, p), i);
    }
    pill(ctx, status + ' de 3 publicados', 36, 211, status === 3 ? green : gold, 120);
  };

  function clock(ctx, x, y, r, p, color = gold) {
    outline(ctx, x, y, r, r, color);
    const angle = p * Math.PI * 2 - Math.PI / 2;
    line(ctx, [[x, y - r * 0.48], [x, y], [x + Math.cos(angle) * r * 0.7, y + Math.sin(angle) * r * 0.7]], color, 2);
  }

  function person(ctx, x, y, scale, p, kind = 0, tilt = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.rotate(tilt);
    const wave = Math.sin(p * 30);
    const color = accents[kind % 5];
    line(ctx, [[-14, 37], [-14 + wave * 12, 61], [-22 + wave * 15, 75]], '#7592b0', 10);
    line(ctx, [[14, 37], [14 - wave * 12, 61], [20 - wave * 15, 75]], '#7592b0', 10);
    box(ctx, -21, -7, 42, 48, color, 12);
    line(ctx, [[-16, 2], [-27, 18], [-19 + wave * 11, 27]], color, 8);
    line(ctx, [[16, 2], [26, 17], [30 - wave * 11, 26]], color, 8);
    avatar(ctx, 0, -22, 21, kind, 1, p);
    ctx.restore();
  }

  demos['RM26-02-01'] = (ctx, t) => {
    stage(ctx, 'ENCENAÇÃO / CORTE NA AÇÃO', gold);
    if (t < 0.28) {
      box(ctx, 84, 158, 297, 61, '#283d55', 8);
      person(ctx, 226, 117, 1.2, 0);
      clock(ctx, 304, 112, 31, t * 2);
      arrow(ctx, 264, 111, 272, 111, ease(t, 0.06, 0.23), white);
    } else if (t < 0.68) {
      const run = ease(t, 0.28, 0.68);
      box(ctx, 344, 62, 72, 163, '#3a526d');
      dot(ctx, 357, 148, 4, gold);
      line(ctx, [[38, 226], [447, 226]], slate, 2);
      person(ctx, mix(90, 316, run), 146, 0.96, run, 0, 0.18 + 0.85 * ease(t, 0.56, 0.68));
      box(ctx, mix(119, 358, run), mix(150, 163, run), 33, 24, '#bccce3', 3);
    } else {
      const fall = phase(t, 0.68, 0.95);
      line(ctx, [[32, 218], [447, 218]], mist, 2);
      ctx.save();
      ctx.translate(mix(197, 272, fall), mix(116, 204, fall * fall));
      ctx.rotate(fall * Math.PI * 1.06);
      box(ctx, -41, -11, 82, 22, '#bccce3', 4);
      ctx.restore();
      party(ctx, 278, 219, t, 0.91, 38);
    }
  };

  demos['RM26-02-02'] = (ctx, t) => {
    stage(ctx, 'ENCENAÇÃO / REAÇÃO AO FEED', coral);
    if (t >= 0.3 && t < 0.69) {
      phone(ctx, 171, 53, 138, 195, (x, y, w, h) => {
        box(ctx, x, y, w, h, white, 0);
        label(ctx, 'Caderno de trilhas', x + 10, y + 20, 12, ink);
        const p = ease(t, 0.42, 0.58);
        carousel(ctx, x + 10 - p * w, y + 35, w - 20, 119, 0);
        carousel(ctx, x + 10 + (1 - p) * w, y + 35, w - 20, 119, 1);
        pill(ctx, '✓ Salvo', x + 10, y + 160, green, w - 20);
      });
    } else {
      const reaction = ease(t, 0.68, 0.87);
      avatar(ctx, 240, 146, mix(83, 98, reaction), 1, reaction, t);
      if (reaction) party(ctx, 241, 146, t, 0.74, 139);
    }
  };

  demos['RM26-02-03'] = (ctx, t) => {
    stage(ctx, 'CARROSSÉIS / ANTES E DEPOIS', coral);
    phone(ctx, 59, 55, 137, 170, (x, y, w, h) => feed(ctx, x, y, w, h, 2));
    phone(ctx, 285, 55, 137, 170, (x, y, w, h) => feed(ctx, x, y, w, h, 6, phase(t, 0.13, 0.88)));
    arrow(ctx, 211, 135, 271, 135, ease(t, 0.05, 0.42), coral);
    label(ctx, 'Antes · 2 capas', 127, 242, 12, mist, 720, 'center');
    label(ctx, t > 0.73 ? 'Depois · 6 capas' : 'Depois', 353, 242, 12, green, 720, 'center');
  };

  function website(ctx, x, y, w, h, p, scroll = 0, kind = 0) {
    const themes = [
      { name: 'Refúgio da Serra', headline: 'Acorde entre montanhas', color: '#264856', art: 0 },
      { name: 'Casa do Vento', headline: 'Respire o tempo', color: '#5c3c53', art: 1 },
      { name: 'Vale Claro', headline: 'Onde a trilha começa', color: '#305e57', art: 2 },
    ];
    const theme = themes[kind];
    windowPanel(ctx, x, y, w, h, theme.name, true);
    clip(ctx, x + 8, y + 30, w - 16, h - 37, () => {
      const offset = scroll * 83;
      reveal(ctx, p, () => {
        art(ctx, x + 10, y + 31 - offset, w - 20, 102, theme.art, scroll * 24);
        box(ctx, x + 18, y + 82 - offset, w - 36, 40, theme.color, 6);
        label(ctx, theme.headline, x + w / 2, y + 102 - offset, w > 230 ? 22 : 13, white, 790, 'center');
        const section = ease(p, 0.4, 0.9);
        for (let i = 0; i < 3; i++) {
          const tileWidth = (w - 40) / 3;
          reveal(ctx, section, () => {
            box(ctx, x + 13 + i * (tileWidth + 7), y + 142 - offset, tileWidth, 56, '#dce5ee', 4);
            label(ctx, ['Trilhas', 'Estadias', 'Visitas'][i], x + 17 + i * (tileWidth + 7), y + 157 - offset, 10, theme.color);
            lines(ctx, x + 17 + i * (tileWidth + 7), y + 172 - offset, tileWidth - 10, 2, '#889aae');
          });
        }
      });
    });
  }

  demos['02-G'] = (ctx, t) => {
    stage(ctx, 'SITES / CONSTRUÇÃO', blue);
    reveal(ctx, 1 - ease(t, 0.19, 0.37), () => prompt(ctx, 'Monte um site para um refúgio', 73, 111, 334, phase(t, 0, 0.2)));
    reveal(ctx, ease(t, 0.21, 0.42), () => website(ctx, 65, 52, 350, 191,
      ease(t, 0.27, 0.65), ease(t, 0.65, 0.9)));
    reveal(ctx, ease(t, 0.85, 0.98), () => pill(ctx, '✓ Site publicado', 311, 227, green, 128));
  };

  demos['02-E1'] = (ctx, t) => {
    stage(ctx, 'SITES / ROLAGEM', blue);
    const scroll = ease(t, 0.15, 0.85);
    website(ctx, 65, 52, 350, 190, 1, scroll);
    box(ctx, 426, 64, 4, 163, slate, 2);
    box(ctx, 426, 64 + scroll * 105, 4, 58, blue, 2);
  };

  demos['02-E2'] = (ctx, t) => {
    stage(ctx, 'SITES / REFERÊNCIA VISUAL', purple);
    box(ctx, 28, 75, 156, 139, '#243850', 9);
    art(ctx, 37, 85, 138, 89, 1);
    [coral, gold, purple].forEach((color, i) => dot(ctx, 57 + i * 22, 194, 7, color));
    const scan = phase(t, 0.1, 0.48);
    if (scan < 1) line(ctx, [[40 + scan * 131, 85], [40 + scan * 131, 173]], white, 2);
    arrow(ctx, 194, 139, 235, 139, ease(t, 0.33, 0.57), purple);
    reveal(ctx, ease(t, 0.38, 0.6), () => website(ctx, 246, 58, 209, 180, ease(t, 0.44, 0.86), 0.35, 2));
  };

  demos['02-E3'] = (ctx, t) => {
    stage(ctx, 'SITES / FORMULÁRIO', green);
    windowPanel(ctx, 97, 54, 286, 188, 'Agendar visita', true);
    ['Nome  •  Joana Lago', 'E-mail  •  joana@exemplo.test', 'Visitantes  •  2'].forEach((text, i) => {
      box(ctx, 115, 90 + i * 32, 250, 26, '#dfe7f0', 5);
      label(ctx, text.slice(0, Math.ceil(text.length * phase(t, i * 0.15, 0.23 + i * 0.15))), 127, 103 + i * 32, 12, ink);
    });
    pill(ctx, t > 0.73 ? '✓ Reserva confirmada' : 'Reservar', 164, 205, t > 0.73 ? green : blue, 153);
    cursor(ctx, mix(351, 283, ease(t, 0.53, 0.73)), mix(238, 213, ease(t, 0.53, 0.73)), t > 0.72 && t < 0.82);
    party(ctx, 240, 211, t, 0.73, 83);
  };

  demos['RM26-03-01'] = (ctx, t) => {
    stage(ctx, 'ENCENAÇÃO / APROVAÇÃO DE SITE', gold);
    website(ctx, 143, 55, 194, 144, ease(t, 0.04, 0.39), 0, 2);
    person(ctx, 88, 163, 0.88, 0, 0);
    person(ctx, 393, 163, 0.88, 0, 3);
    reveal(ctx, ease(t, 0.36, 0.54), () => pill(ctx, '✓ Aprovado', 322, 58, green, 117));
    const p = ease(t, 0.53, 0.92);
    reveal(ctx, ease(t, 0.47, 0.59), () => {
      const x = mix(324, 102, p);
      box(ctx, x, 194 - 34 * Math.sin(p * Math.PI), 50, 23, '#519b83', 4);
      box(ctx, x + 2, 191 - 34 * Math.sin(p * Math.PI), 50, 23, green, 4);
      box(ctx, x + 24, 191 - 34 * Math.sin(p * Math.PI), 10, 23, white, 1);
    });
  };

  function article(ctx, x, y, w, h, p, title = 'Roteiro de um dia', kind = 1) {
    windowPanel(ctx, x, y, w, h, 'Diário de campo', true);
    reveal(ctx, ease(p, 0.05, 0.28), () => label(ctx, title, x + 14, y + 40, w > 250 ? 23 : 14, ink, 790));
    reveal(ctx, ease(p, 0.24, 0.58), () => art(ctx, x + 14, y + 55, w - 28, h * 0.36, kind));
    lines(ctx, x + 14, y + 66 + h * 0.36, w - 35, 4, '#8997aa', ease(p, 0.47, 0.98), 8);
  }

  function blog(ctx, x, y, w, h, count, scroll = 0, first = 'Roteiro de um dia', kind = 1) {
    windowPanel(ctx, x, y, w, h, 'Diário de campo', true);
    clip(ctx, x + 7, y + 28, w - 14, h - 35, () => {
      label(ctx, 'Caminhos e paisagens', x + 14, y + 43 - scroll, 17, ink, 800);
      const topics = [first, 'Luzes do vale', 'Rios de pedra', 'Rotas noturnas', 'Antes do verão', 'Ar puro'];
      for (let i = 0; i < 6; i++) {
        const tileWidth = (w - 39) / 3;
        const tileX = x + 12 + i % 3 * (tileWidth + 7);
        const tileY = y + 55 + Math.floor(i / 3) * 62 - scroll;
        reveal(ctx, ease(count, i, i + 0.98), () => {
          art(ctx, tileX, tileY, tileWidth, 39, (kind + i) % 5);
          label(ctx, topics[i], tileX + 1, tileY + 48, tileWidth > 95 ? 10 : 8.5, ink, 740);
        });
      }
    });
  }

  demos['03-G'] = (ctx, t) => {
    stage(ctx, 'BLOGS / PUBLICAÇÃO', green);
    reveal(ctx, 1 - ease(t, 0.24, 0.4), () => prompt(ctx, 'Crie um blog sobre caminhadas', 77, 107, 327, phase(t, 0, 0.23)));
    reveal(ctx, ease(t, 0.26, 0.49), () => blog(ctx, 69, 53, 342, 195, phase(t, 0.36, 0.87) * 6));
    reveal(ctx, ease(t, 0.83, 0.96), () => pill(ctx, '✓ Blog publicado', 314, 224, green, 130));
  };

  demos['03-E1'] = (ctx, t) => {
    stage(ctx, 'BLOGS / ARTIGO', green);
    article(ctx, 103, 54, 274, 194, phase(t, 0.05, 0.83));
  };

  demos['03-E2'] = (ctx, t) => {
    stage(ctx, 'BLOGS / NOVOS POSTS', green);
    windowPanel(ctx, 60, 53, 360, 194, 'Diário de campo', true);
    label(ctx, 'Novos no diário', 75, 96, 18, ink);
    clip(ctx, 71, 107, 338, 130, () => {
      for (let i = 0; i < 3; i++) {
        const p = ease(t, 0.1 + i * 0.16, 0.48 + i * 0.16);
        const x = 74 + 112 * i;
        art(ctx, x, 112 + p * 65, 104, 47, i);
        reveal(ctx, p, () => {
          art(ctx, x, 112, 104, 47, 2 + i);
          label(ctx, ['Rios de pedra', 'Rotas noturnas', 'Antes do verão'][i], x, 166, 9, ink);
        });
      }
    });
  };

  demos['03-E3'] = (ctx, t) => {
    stage(ctx, 'BLOGS / CRESCIMENTO DO ACERVO', green);
    blog(ctx, 57, 53, 366, 195, 2 + ease(t, 0.15, 0.84) * 4);
    pill(ctx, Math.floor(2 + ease(t, 0.15, 0.84) * 4) + ' artigos', 321, 231, green, 88);
  };

  demos['RM26-04-01'] = (ctx, t) => {
    stage(ctx, 'BLOGS / PESQUISA E PUBLICAÇÃO', green);
    if (t < 0.27) {
      prompt(ctx, 'Trilhas ao amanhecer', 62, 90, 356, phase(t, 0, 0.23));
      reveal(ctx, ease(t, 0.11, 0.25), () => pill(ctx, '↑ Tema em alta', 63, 139, gold, 130));
    } else if (t < 0.72) {
      article(ctx, 96, 54, 288, 194, phase(t, 0.27, 0.66), 'Trilhas ao amanhecer', 3);
    } else {
      blog(ctx, 62, 54, 356, 192, 6, 0, 'Trilhas ao amanhecer', 3);
      pill(ctx, '✓ Publicado', 310, 223, green, 108);
    }
  };

  demos['RM26-04-02'] = (ctx, t) => {
    stage(ctx, 'BLOGS / CAPA DO ARTIGO', purple);
    prompt(ctx, 'Ilustre um vale ao pôr do sol', 28, 53, 288, phase(t, 0, 0.24));
    article(ctx, 248, 98, 203, 147, t > 0.79 ? 1 : 0.25, 'Luzes do vale', 1);
    const p = ease(t, 0.48, 0.8);
    reveal(ctx, ease(t, 0.22, 0.42) * (1 - ease(t, 0.78, 0.85)), () =>
      art(ctx, mix(29, 262, p), mix(110, 153, p), mix(176, 175, p), mix(107, 53, p), 1));
    reveal(ctx, ease(t, 0.81, 0.96), () => pill(ctx, '✓ Capa aplicada', 40, 183, green, 129));
  };

  function take(ctx, x, y, w, h, kind, motion, sketch = false) {
    box(ctx, x, y, w, h, sketch ? '#d5dbea' : '#1b344b', 7);
    clip(ctx, x, y, w, h, () => {
      if (!sketch) art(ctx, x, y, w, h, kind, Math.sin(motion * 6) * 8);
      const sway = sketch ? 0 : Math.sin(motion * 17) * w * 0.06;
      person(ctx, x + w * 0.49 + sway, y + h * 0.59, Math.min(w / 92, h / 125), motion, 1);
      if (sketch) {
        for (let i = 0; i < 4; i++) line(ctx, [[x + 8, y + 12 + i * 18], [x + w - 8, y + 12 + i * 18]], '#bbc6db', 1);
      }
    }, 7);
  }

  function videoFrame(ctx, x, y, w, h, scene, motion, sketch = false) {
    windowPanel(ctx, x, y, w, h, sketch ? 'Imagem original' : 'Prévia de vídeo');
    take(ctx, x + 8, y + 30, w - 16, h - 45, scene, motion, sketch);
    box(ctx, x + 8, y + h - 9, w - 16, 3, slate, 2);
    box(ctx, x + 8, y + h - 9, (w - 16) * motion, 3, coral, 2);
  }

  function storyboard(ctx, t, mode) {
    const gather = mode === 'gather' ? ease(t, 0.49, 0.78) : 0;
    for (let i = 0; i < 3; i++) {
      const p = ease(t, i * 0.09, 0.17 + i * 0.09);
      const animateAt = 0.24 + i * 0.11;
      reveal(ctx, p * (1 - ease(gather, 0.68, 1)), () => {
        const x = mix(28 + i * 145, 186, gather);
        const y = mix(92, 82 + i * 23, gather);
        const w = mix(132, 104, gather);
        take(ctx, x, y, w, 106, i, phase(t, animateAt, 1), mode === 'animate' && t < animateAt);
        label(ctx, t < animateAt && mode === 'animate' ? 'Storyboard 0' + (i + 1) : 'Take 0' + (i + 1), x + 5, y + 121, 11);
      });
    }
    reveal(ctx, ease(gather, 0.63, 0.98), () => phone(ctx, 180, 52, 120, 197,
      (x, y, w, h) => take(ctx, x, y, w, h, Math.floor((t - 0.73) * 10 + 1) % 3, t)));
  }

  demos['04-G'] = (ctx, t) => {
    stage(ctx, 'VÍDEOS / MONTAGEM', coral);
    reveal(ctx, 1 - ease(t, 0.3, 0.53), () => prompt(ctx, 'Anime uma exploradora em viagem', 26, 48, 295, phase(t, 0, 0.23)));
    if (t > 0.18) storyboard(ctx, phase(t, 0.18, 0.96), 'gather');
    reveal(ctx, ease(t, 0.85, 0.98), () => pill(ctx, '✓ Vídeo montado', 310, 205, green, 130));
  };

  demos['04-E1'] = (ctx, t) => {
    stage(ctx, 'VÍDEOS / IMAGEM EM MOVIMENTO', coral);
    videoFrame(ctx, 79, 52, 322, 195, 1, phase(t, 0.27, 1), t < 0.27);
    reveal(ctx, ease(t, 0.28, 0.42), () => pill(ctx, '▶ Em movimento', 311, 212, green, 127));
  };

  demos['04-E2'] = (ctx, t) => {
    stage(ctx, 'VÍDEOS / STORYBOARD', coral);
    storyboard(ctx, t, 'animate');
  };

  demos['04-E3'] = (ctx, t) => {
    stage(ctx, 'VÍDEOS / CORTE VERTICAL', coral);
    storyboard(ctx, t, 'gather');
  };

  demos['RM26-05-01'] = (ctx, t) => {
    stage(ctx, 'ENCENAÇÃO / SELEÇÃO DE ELENCO', gold);
    if (t > 0.25 && t < 0.76) {
      windowPanel(ctx, 54, 61, 372, 164, 'Selecionar elenco');
      for (let i = 0; i < 3; i++) {
        const x = 81 + 114 * i;
        box(ctx, x, 99, 89, 105, '#263b56', 8, i === 1 && t > 0.44 ? green : slate);
        avatar(ctx, x + 44, 141, 28, i + 2);
        label(ctx, 'Perfil 0' + (i + 1), x + 44, 186, 11, white, 700, 'center');
      }
      reveal(ctx, ease(t, 0.56, 0.69), () => pill(ctx, '✓ Pagamento enviado', 151, 222, green, 178));
    } else {
      const close = ease(t, 0.76, 0.95);
      avatar(ctx, 240, 139, mix(64, 94, close), 1, 0, t);
      box(ctx, 174, 193 + close * 45, 132, 49, '#607d9a', 6);
      if (close) {
        line(ctx, [[208, 123], [227, 115]], '#422d36', 3);
        line(ctx, [[254, 115], [273, 123]], '#422d36', 3);
      }
    }
  };

  demos['RM26-05-02'] = (ctx, t) => {
    const index = Math.min(2, Math.floor(t * 3));
    stage(ctx, 'VÍDEOS / ' + ['ESTÚDIO', 'PRAIA', 'ESCRITÓRIO'][index], accents[index]);
    const p = t * 3 - index;
    clip(ctx, 46, 54, 388, 190, () => {
      box(ctx, 46, 54, 388, 190, ['#645178', '#4aafbd', '#445f79'][index], 8);
      if (index === 0) {
        dot(ctx, 139, 119, 52, '#ab82a4');
        dot(ctx, 354, 123, 44, '#7b658e');
      }
      if (index === 1) {
        box(ctx, 46, 155, 388, 89, '#ebc99b', 0);
        line(ctx, [[47, 155], [433, 155]], white, 3);
        dot(ctx, 348, 98, 25, gold);
      }
      if (index === 2) {
        box(ctx, 79, 75, 85, 105, '#b5d6e4', 5);
        box(ctx, 319, 145, 73, 60, '#283c56', 5);
      }
      person(ctx, 240 + Math.sin(p * 6) * 5, 150, 1.34, p, 1);
    });
  };

  demos['RM26-05-03'] = (ctx, t) => {
    stage(ctx, 'VÍDEOS / MENSAGEM E FALA', coral);
    const message = 'Vamos descobrir a trilha?';
    if (t < 0.39) {
      prompt(ctx, message, 69, 106, 342, phase(t, 0.03, 0.27));
      reveal(ctx, ease(t, 0.29, 0.38), () => pill(ctx, '✓ Enviada', 309, 158, green));
    } else {
      take(ctx, 88, 53, 304, 194, 2, t);
      box(ctx, 125, 201, 230, 32, '#0d1829', 5);
      const words = message.split(' ').slice(0, 1 + Math.floor(phase(t, 0.41, 0.84) * 3));
      label(ctx, words.join(' '), 240, 217, 16, white, 750, 'center');
    }
  };

  function wave(ctx, x, y, w, height, p, color = purple) {
    for (let i = 0; i < 28; i++) {
      const r = height * (0.2 + Math.abs(Math.sin(i * 2.17)) * 0.8);
      if (i / 28 <= p) line(ctx, [[x + i * w / 28, y - r / 2], [x + i * w / 28, y + r / 2]], color, 2);
    }
  }

  demos['RM26-05-04'] = (ctx, t) => {
    stage(ctx, 'VÍDEOS / IMAGEM, VOZ E TAKE', purple);
    take(ctx, 30, 71, 128, 113, 0, 0, true);
    label(ctx, 'Referência visual', 31, 199, 11, mist);
    wave(ctx, 172, 126, 116, 48, phase(t, 0.16, 0.45));
    label(ctx, 'Faixa de voz', 172, 199, 11, mist);
    reveal(ctx, ease(t, 0.41, 0.62), () => videoFrame(ctx, 302, 64, 148, 123, 0, phase(t, 0.57, 1)));
    box(ctx, 29, 221, 421, 11, slate, 4);
    const p = ease(t, 0.5, 0.95);
    box(ctx, 29, 221, 421 * p, 11, green, 4);
    line(ctx, [[29 + 421 * p, 214], [29 + 421 * p, 239]], white);
  };

  const growth = [0.14, 0.2, 0.19, 0.38, 0.34, 0.62, 0.7, 0.94];
  const flat = [0.22, 0.29, 0.27, 0.39, 0.36, 0.34, 0.42, 0.38];

  function marketing(ctx, x, y, w, h, p, title, bars = false) {
    windowPanel(ctx, x, y, w, h, title);
    if (w >= 245) label(ctx, 'Resultado da semana', x + 14, y + 40, 12);
    label(ctx, 'Pedidos  ' + Math.round(8 + p * 42), x + w - 14, y + 42, 11, green, 730, 'right');
    graph(ctx, x + 15, y + 57, w - 30, h - 70, growth, p, green, bars);
  }

  function budget(ctx, x, y, w, p) {
    label(ctx, 'Orçamento', x, y, 13);
    box(ctx, x, y + 17, w, 7, '#526883', 4);
    box(ctx, x, y + 17, w * (0.35 + 0.45 * p), 7, blue, 4);
    dot(ctx, x + w * (0.35 + 0.45 * p), y + 20, 8, white);
  }

  function orders(ctx, x, y, t, from) {
    for (let i = 0; i < 4; i++) {
      const start = from + [0, 0.14, 0.23, 0.29][i];
      reveal(ctx, ease(t, start, start + 0.1), () => pill(ctx, '✓ Pedido 0' + (i + 1), x, y + i * 27, green, 105));
    }
  }

  demos['05-G'] = (ctx, t) => {
    stage(ctx, 'TRÁFEGO / OTIMIZAÇÃO', green);
    prompt(ctx, 'Otimize a campanha da semana', 27, 51, 320, phase(t, 0, 0.24));
    marketing(ctx, 26, 99, 301, 141, ease(t, 0.27, 0.83), 'Painel de campanhas');
    const p = ease(t, 0.28, 0.61);
    budget(ctx, 344, 70, 106, p);
    reveal(ctx, ease(t, 0.55, 0.67), () => label(ctx, '+35%', 398, 121, 24, gold, 790, 'center'));
    orders(ctx, 344, 142, t, 0.55);
  };

  demos['05-E1'] = (ctx, t) => {
    stage(ctx, 'TRÁFEGO / ORÇAMENTO', green);
    windowPanel(ctx, 37, 65, 271, 161, 'Ajuste da campanha');
    const p = ease(t, 0.14, 0.54);
    budget(ctx, 56, 111, 233, p);
    cursor(ctx, 56 + 233 * (0.35 + 0.45 * p), 133, t > 0.51 && t < 0.62);
    reveal(ctx, ease(t, 0.48, 0.65), () => label(ctx, '+35%', 172, 182, 36, gold, 810, 'center'));
    orders(ctx, 326, 88, t, 0.55);
  };

  demos['05-E2'] = (ctx, t) => {
    stage(ctx, 'TRÁFEGO / CRIATIVOS', green);
    marketing(ctx, 234, 64, 218, 173, ease(t, 0.34, 0.94), 'Distribuição de criativos');
    for (let i = 0; i < 3; i++) {
      const start = 0.21 + i * 0.15;
      const p = ease(t, start, start + 0.3);
      reveal(ctx, ease(t, i * 0.1, 0.16 + i * 0.1) * (1 - ease(p, 0.63, 1)), () =>
        carousel(ctx, mix(33 + i * 52, 260, p), mix(91 + i * 26, 132, p), mix(75, 36, p), mix(97, 49, p), i));
    }
    arrow(ctx, 188, 139, 223, 139, ease(t, 0.18, 0.42), green);
  };

  demos['05-E3'] = (ctx, t) => {
    stage(ctx, 'TRÁFEGO / RELATÓRIO', green);
    const p = ease(t, 0.13, 0.5);
    ['Impressões', 'Pedidos', 'Orçamento', 'Receita'].forEach((name, i) => {
      reveal(ctx, 1 - ease(t, 0.38, 0.59), () => pill(ctx, name, mix(45 + i % 2 * 273, 191, p),
        mix(64 + Math.floor(i / 2) * 122, 126, p), accents[i], 100));
    });
    reveal(ctx, ease(t, 0.35, 0.57), () => marketing(ctx, 62, 58, 356, 181, ease(t, 0.48, 0.94), 'Relatório consolidado', true));
  };

  function dataTable(ctx, x, y, w, h, title, headers, rows, p) {
    windowPanel(ctx, x, y, w, h, title);
    const step = (w - 18) / headers.length;
    headers.forEach((name, i) => label(ctx, name, x + 11 + step * i, y + 39, 10, blue));
    rows.forEach((row, i) => {
      reveal(ctx, ease(p, i * 0.13, i * 0.13 + 0.25), () => {
        box(ctx, x + 8, y + 49 + i * 22, w - 16, 19, i % 2 ? '#213550' : '#293f5b', 3);
        row.forEach((value, col) => label(ctx, value, x + 11 + step * col, y + 58 + i * 22, 10));
      }, 4);
    });
  }

  demos['05-E4'] = (ctx, t) => {
    stage(ctx, 'TRÁFEGO / TABELA PARA PAINEL', green);
    reveal(ctx, 1 - ease(t, 0.22, 0.5), () => dataTable(ctx, 36, 61, 408, 172, 'Gerenciador de anúncios',
      ['Campanha', 'Cliques', 'Pedidos', 'Custo'], [['Serra', '120', '8', '84'], ['Rio', '96', '4', '62'],
        ['Vale', '184', '17', '112'], ['Cume', '117', '6', '75']], 1));
    reveal(ctx, ease(t, 0.24, 0.53), () => {
      const p = ease(t, 0.52, 0.91);
      marketing(ctx, 38, 56, 404, 152, p, 'Desempenho das campanhas');
      budget(ctx, 48, 221, 344, p);
      cursor(ctx, 48 + 344 * (0.35 + 0.45 * p), 239, t > 0.88);
    });
  };

  demos['RM26-06-01'] = (ctx, t) => {
    stage(ctx, 'ENCENAÇÃO / DADOS DISPERSOS', gold);
    avatar(ctx, 116 + Math.sin(t * 18) * 6, 144, 66, 2, 0);
    if (t < 0.66) {
      for (let i = 0; i < 3; i++) {
        const p = ease(t, 0.06 + i * 0.16, 0.24 + i * 0.16);
        reveal(ctx, p, () => dataTable(ctx, 207 + i * 26, 58 + i * 23, 190, 119, 'Planilha 0' + (i + 1),
          ['Dia', 'Cliques', 'Pedidos'], [['Seg', '120', '8'], ['Ter', '96', '4']], 1));
      }
    } else marketing(ctx, 210, 65, 228, 159, ease(t, 0.66, 1) * 0.43, 'Painel em construção');
    label(ctx, '?', 178, 77, 27, gold, 800);
  };

  demos['RM26-06-02'] = (ctx, t) => {
    stage(ctx, 'TRÁFEGO / CONEXÃO DE CANAIS', green);
    pill(ctx, 'Mídia social', 33, 61, coral, 108);
    pill(ctx, 'Mídia de busca', 335, 61, blue, 112);
    arrow(ctx, 143, 83, 216, 110, ease(t, 0.08, 0.35), coral);
    arrow(ctx, 336, 83, 263, 110, ease(t, 0.15, 0.42), blue);
    dot(ctx, 240, 107, 23, purple);
    label(ctx, 'IA', 240, 107, 15, ink, 850, 'center');
    for (let i = 0; i < 3; i++) {
      const p = phase(t, 0.21 + i * 0.11, 0.52 + i * 0.11);
      if (p > 0 && p < 1) {
        dot(ctx, mix(143, 240, p), mix(83, 107, p), 3, coral);
        dot(ctx, mix(336, 240, p), mix(83, 107, p), 3, blue);
      }
    }
    arrow(ctx, 240, 132, 240, 153, ease(t, 0.37, 0.61), purple);
    reveal(ctx, ease(t, 0.42, 0.66), () => marketing(ctx, 94, 154, 292, 97, ease(t, 0.55, 0.96), 'Painel integrado', true));
  };

  demos['RM26-06-03'] = (ctx, t) => {
    stage(ctx, 'TRÁFEGO / AJUSTE RECOMENDADO', green);
    prompt(ctx, 'Como melhorar esta campanha?', 32, 53, 416, phase(t, 0, 0.21));
    reveal(ctx, ease(t, 0.2, 0.44), () => marketing(ctx, 31, 105, 252, 139, ease(t, 0.28, 0.73), 'Relatório da campanha'));
    reveal(ctx, ease(t, 0.44, 0.65), () => {
      box(ctx, 295, 106, 153, 137, '#253c55');
      label(ctx, 'Ajuste sugerido', 309, 128, 12);
      label(ctx, '+12% na busca', 309, 155, 15, gold);
      pill(ctx, t > 0.82 ? '✓ Ajuste aplicado' : 'Aplicar', 305, 201, t > 0.82 ? green : blue, 131);
      cursor(ctx, mix(432, 388, ease(t, 0.67, 0.82)), 216, t > 0.81 && t < 0.91);
    });
  };

  demos['RM26-06-04'] = (ctx, t) => {
    stage(ctx, 'TRÁFEGO / COMPARAÇÃO', green);
    for (let i = 0; i < 2; i++) {
      const x = 28 + i * 219;
      const color = i ? green : coral;
      const p = ease(t, 0.1 + i * 0.1, 0.84 - i * 0.12);
      windowPanel(ctx, x, 58, 205, 185, i ? 'Gestão com IA' : 'Gestão tradicional');
      clock(ctx, x + 29, 110, 13, p, color);
      label(ctx, Math.round((i ? 2 : 6) * p) + ' h', x + 51, 111, 16, color);
      graph(ctx, x + 16, 138, 172, 67, i ? growth : [...growth].reverse(), p, color);
      label(ctx, i ? '+18 pedidos' : '−8 pedidos', x + 16, 224, 12, color, 760);
    }
  };

  function dashboard(ctx, x, y, w, h, p, title = 'Gestão de projetos', filter = false) {
    windowPanel(ctx, x, y, w, h, title);
    box(ctx, x + 8, y + 32, w * 0.23, h - 40, '#243953', 5);
    ['Visão geral', 'Projetos', 'Equipe'].forEach((item, i) => label(ctx, item, x + 15, y + 47 + i * 19, 8.5, i ? mist : green));
    const contentX = x + w * 0.26;
    const contentW = w * 0.7;
    ['Ativos', 'Entregues', 'Equipe'].forEach((item, i) => {
      const tileX = contentX + i * contentW / 3;
      box(ctx, tileX, y + 35, contentW / 3 - 5, 33, '#293e58', 4);
      label(ctx, item, tileX + 5, y + 43, 8, mist);
      label(ctx, Math.round((filter ? [12, 8, 5][i] : [32, 19, 8][i]) * p), tileX + 5, y + 57, 13, green);
    });
    graph(ctx, contentX, y + 79, contentW - 8, Math.max(12, h - 94), filter ? flat : growth, p, filter ? purple : green, filter);
  }

  function credits(ctx, x, y, t, start = 0.32, end = 0.7) {
    const p = ease(t, start, end);
    for (let i = 0; i < 12; i++) {
      const keep = i < 3;
      reveal(ctx, keep ? 1 : clamp((1 - p) * 2), () => {
        const targetX = x + (i % 3) * 23;
        const targetY = y + 60;
        const fromX = x + (i % 3) * 23;
        const fromY = y + Math.floor(i / 3) * 22;
        dot(ctx, mix(fromX, targetX, p), mix(fromY, targetY, p), 8, gold);
        outline(ctx, mix(fromX, targetX, p), mix(fromY, targetY, p), 5, 5, '#8b6f34', 1);
      }, 0);
    }
    label(ctx, Math.round(mix(12, 3, p)) + ' créditos', x + 23, y + 99, 12, gold, 760, 'center');
  }

  function shield(ctx, x, y, scale, fill = blue) {
    const points = [[0, -31], [29, -20], [24, 9], [15, 25], [0, 36], [-15, 25], [-24, 9], [-29, -20]];
    poly(ctx, points.map(([dx, dy]) => [x + dx * scale, y + dy * scale]), fill);
    line(ctx, [[x - 10 * scale, y + 2 * scale], [x - 3 * scale, y + 9 * scale], [x + 12 * scale, y - 7 * scale]], ink, 3 * scale);
  }

  function kanban(ctx, x, y, w, h, t, from = 0.54) {
    windowPanel(ctx, x, y, w, h, 'Funil de projetos');
    const col = (w - 24) / 3;
    ['Aberto', 'Em análise', 'Fechado'].forEach((name, i) => {
      box(ctx, x + 7 + i * (col + 4), y + 34, col, h - 43, '#293e59', 4);
      label(ctx, name, x + 12 + i * (col + 4), y + 46, 9, mist);
    });
    const p = ease(t, from, from + 0.29);
    const cardX = mix(x + 11, x + 11 + 2 * (col + 4), p);
    const cardY = y + 59 - Math.sin(p * Math.PI) * 10;
    box(ctx, cardX, cardY, col - 8, 25, p === 1 ? green : blue, 4);
    label(ctx, 'Projeto Sol', cardX + 4, cardY + 12, 8.5, ink, 750);
    if (p > 0 && p < 1) cursor(ctx, cardX + 15, cardY + 17);
  }

  demos['06-G'] = (ctx, t) => {
    stage(ctx, 'APLICATIVOS / GERAÇÃO', purple);
    prompt(ctx, 'Monte um aplicativo de gestão', 29, 52, 309, phase(t, 0, 0.23));
    reveal(ctx, ease(t, 0.21, 0.43), () => dashboard(ctx, 29, 99, 272, 144, ease(t, 0.24, 0.59)));
    reveal(ctx, ease(t, 0.48, 0.61), () => kanban(ctx, 232, 124, 220, 117, t, 0.54));
    reveal(ctx, ease(t, 0.38, 0.54), () => {
      ctx.save();
      ctx.translate(338, 45);
      ctx.scale(0.66, 0.66);
      credits(ctx, 0, 0, t, 0.49, 0.77);
      ctx.restore();
    });
    reveal(ctx, ease(t, 0.77, 0.97), () => shield(ctx, 432, 84, 0.67));
  };

  demos['06-E1'] = (ctx, t) => {
    stage(ctx, 'APLICATIVOS / INTERAÇÃO', purple);
    prompt(ctx, 'Organize meus projetos', 27, 51, 289, phase(t, 0, 0.24));
    const filter = t > 0.49;
    reveal(ctx, ease(t, 0.2, 0.37), () => {
      dashboard(ctx, 27, 95, 214, 144, ease(t, filter ? 0.49 : 0.27, filter ? 0.78 : 0.48), 'Projetos', filter);
      pill(ctx, filter ? 'Este mês' : 'Todos', 144, 94, filter ? purple : blue, 86);
      if (t > 0.36 && t < 0.55) cursor(ctx, mix(160, 188, ease(t, 0.36, 0.5)), 108, filter);
      kanban(ctx, 252, 95, 202, 144, t, 0.64);
    });
  };

  demos['06-E2'] = (ctx, t) => {
    stage(ctx, 'APLICATIVOS / CRÉDITOS', purple);
    dashboard(ctx, 41, 61, 286, 177, t > 0.57 ? ease(t, 0.57, 0.89) : 1, 'Painel de gestão', t > 0.57);
    credits(ctx, 354, 97, t);
    cursor(ctx, mix(308, 286, ease(t, 0.39, 0.58)), 111, t > 0.57 && t < 0.66);
  };

  demos['07-G'] = (ctx, t) => {
    stage(ctx, 'SEGURANÇA / CAMPO MAGNÉTICO', blue);
    protectedScreen(ctx, t, 0);
  };

  function protectedScreen(ctx, t, mode) {
    const p = mode === 1 ? 1 : ease(t, 0.04, 0.44);
    const centerX = mode === 2 ? mix(205, 263, p) : 240;
    const centerY = 145;
    dashboard(ctx, centerX - 111, 81, 222, 118, mode === 1 ? 1 : ease(t, 0, 0.67));
    box(ctx, centerX - 6, 200, 12, 15, '#516886', 2);
    box(ctx, centerX - 38, 214, 76, 5, '#516886', 3);
    outline(ctx, centerX, centerY, 129 + 11 * p, 92 + 6 * p, blue, 3, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * p);
    if (mode === 2) {
      const a = t * Math.PI * 2;
      dot(ctx, centerX + Math.cos(a) * 140, centerY + Math.sin(a) * 98, 5, green);
      pill(ctx, '✓ Dados preservados', 155, 237, green, 170);
      return;
    }
    for (let i = 0; i < 3; i++) {
      const q = phase(t, 0.22 + i * 0.12, 0.66 + i * 0.1);
      if (q <= 0 || q >= 1) continue;
      const side = i % 2 === 0 ? -1 : 1;
      const y = 115 + 28 * i;
      const x = centerX + side * mix(225, 137, Math.sin(q * Math.PI));
      line(ctx, [[x + side * 18, y], [x, y]], coral, mode ? 5 : 3);
      dot(ctx, x, y, mode ? 6 : 4, coral);
      if (Math.abs(q - 0.5) < 0.11) outline(ctx, x, y, 16, 16, gold, 2);
    }
  }

  demos['RM26-07-01'] = (ctx, t) => {
    stage(ctx, 'APLICATIVOS / DESCRIÇÃO PARA TELA', purple);
    prompt(ctx, 'Controle prazos de uma equipe', 32, 53, 371, phase(t, 0, 0.25));
    reveal(ctx, ease(t, 0.23, 0.49), () => {
      dashboard(ctx, 33, 98, 276, 145, ease(t, 0.29, 0.62));
      box(ctx, 321, 98, 127, 145, '#243953', 8);
      label(ctx, 'Tarefa 01', 333, 120, 12);
      label(ctx, 'Revisar pauta', 333, 143, 12, mist);
      pill(ctx, t > 0.79 ? '✓ Concluída' : 'Concluir', 330, 181, t > 0.79 ? green : blue, 109);
      cursor(ctx, mix(430, 385, ease(t, 0.62, 0.79)), mix(219, 193, ease(t, 0.62, 0.79)), t > 0.78 && t < 0.88);
    });
  };

  demos['RM26-07-02'] = (ctx, t) => {
    stage(ctx, 'APLICATIVOS / TRÊS PASSOS', purple);
    const points = [[240, 76], [370, 213], [110, 213]];
    const names = ['1  Planejar', '2  Desenhar', '3  Criar'];
    for (let i = 0; i < 3; i++) {
      arrow(ctx, ...points[i], ...points[(i + 1) % 3], ease(t, 0.15 + i * 0.2, 0.38 + i * 0.2), accents[i]);
    }
    points.forEach(([x, y], i) => reveal(ctx, ease(t, i * 0.18, i * 0.18 + 0.19), () => pill(ctx, names[i], x - 60, y - 11, accents[i], 120)));
  };

  demos['07-E1'] = (ctx, t) => {
    stage(ctx, 'SEGURANÇA / IMPACTO E REBOTE', coral);
    protectedScreen(ctx, t, 1);
  };

  demos['07-E2'] = (ctx, t) => {
    stage(ctx, 'SEGURANÇA / PERÍMETRO', blue);
    protectedScreen(ctx, t, 2);
  };

  demos['RM26-08-01'] = (ctx, t) => {
    stage(ctx, 'ENCENAÇÃO / ALERTA DE FRAUDE', coral);
    if (t < 0.32) {
      avatar(ctx, 200, 133, 76, 2, 0);
      box(ctx, 213, 141, 137, 74, '#38556d', 7);
      lines(ctx, 226, 155, 110, 5, green, phase(t, 0.04, 0.29), 9);
    } else if (t < 0.68) {
      windowPanel(ctx, 72, 69, 336, 149, 'Alerta de transação');
      label(ctx, 'Transferência desconhecida', 240, 126, 19, white, 730, 'center');
      label(ctx, '− R$ 480,00', 240, 176, 32, coral, 810, 'center');
    } else {
      avatar(ctx, 240, 141, mix(64, 89, ease(t, 0.68, 0.93)), 0, 0);
      label(ctx, '!', 335, 94, 39, coral, 850, 'center');
    }
  };

  function lock(ctx, x, y, size, color = gold) {
    outline(ctx, x, y - size * 0.12, size * 0.27, size * 0.35, color, size * 0.09, Math.PI, 2 * Math.PI);
    box(ctx, x - size / 2, y - size * 0.18, size, size * 0.6, color, size * 0.08);
    dot(ctx, x, y + size * 0.11, size * 0.067, ink);
  }

  demos['RM26-08-02'] = (ctx, t) => {
    stage(ctx, 'SEGURANÇA / TRÊS PORTAS', green);
    for (let i = 0; i < 3; i++) {
      const x = 66 + i * 128;
      const p = ease(t, 0.08 + i * 0.16, 0.41 + i * 0.16);
      box(ctx, x, 71, 90, 143, '#3c506a', 6);
      poly(ctx, [[x + 6, 79], [x + 6 + mix(33, 78, p), 79 - (1 - p) * 13],
        [x + 6 + mix(33, 78, p), 205 + (1 - p) * 12], [x + 6, 205]], p > 0.94 ? green : coral);
      dot(ctx, x + mix(29, 75, p), 143, 3, ink);
    }
    reveal(ctx, ease(t, 0.72, 0.93), () => lock(ctx, 240, 151, 53));
  };

  demos['RM26-08-03'] = (ctx, t) => {
    stage(ctx, 'SEGURANÇA / CARTÕES PARA ESCUDO', blue);
    const p = ease(t, 0.45, 0.82);
    for (let i = 0; i < 21; i++) {
      const x = mix(56 + i % 7 * 54, 221, p);
      const y = mix(69 + Math.floor(i / 7) * 53, 129, p);
      reveal(ctx, ease(t, i * 0.012, 0.17 + i * 0.012) * (1 - ease(p, 0.65, 1)), () => {
        box(ctx, x, y, 42, 38, '#344c70', 5, blue);
        label(ctx, String(i + 1).padStart(2, '0'), x + 21, y + 19, 13, white, 780, 'center');
      });
    }
    reveal(ctx, ease(t, 0.67, 0.93), () => shield(ctx, 240, 138, 1.85));
  };

  function folder(ctx, x, y, w, h, title, p, color = gold) {
    box(ctx, x + 3, y, w * 0.41, 17, color, 5);
    box(ctx, x, y + 9, w, h - 9, color, 6);
    if (p) poly(ctx, [[x + 2, y + h], [x + 9 * p, y + h * (0.36 + 0.15 * p)],
      [x + w + 5 * p, y + h * (0.36 + 0.15 * p)], [x + w - 1, y + h]], '#e7b758');
    label(ctx, title, x + w / 2, y + h * 0.66, w < 85 ? 8 : 11, ink, 760, 'center');
  }

  function page(ctx, x, y, w, h, title, p, kind = 0) {
    box(ctx, x, y, w, h, white, 7, '#91a7c2');
    box(ctx, x + 8, y + 9, 4, h - 18, accents[kind % 5], 2);
    reveal(ctx, ease(p, 0.05, 0.38), () => label(ctx, title, x + 20, y + 21, w > 150 ? 15 : 12, ink, 800));
    if (kind === 2) graph(ctx, x + 21, y + 45, w - 35, h - 64, growth, ease(p, 0.4, 0.9), '#24735e', true);
    else {
      reveal(ctx, ease(p, 0.27, 0.67), () => art(ctx, x + 19, y + 37, w - 31, h * 0.36, kind));
      lines(ctx, x + 20, y + 49 + h * 0.36, w - 35, 3, '#8b9db3', ease(p, 0.55, 0.98), 8);
    }
  }

  demos['08-G'] = (ctx, t) => {
    stage(ctx, 'DOCUMENTOS / PEDIDO E PASTAS', gold);
    const out = 1 - ease(t, 0.38, 0.64);
    reveal(ctx, out, () => prompt(ctx, 'Monte uma proposta comercial', 95, 122, 290, phase(t, 0, 0.21)));
    ['Marketing', 'Comercial', 'Financeiro', 'RH'].forEach((name, i) => {
      const p = ease(t, 0.11 + i * 0.055, 0.33 + i * 0.055);
      reveal(ctx, p * out, () => folder(ctx, mix(189, 35 + i % 2 * 310, p), mix(106, 60 + Math.floor(i / 2) * 128, p), 100, 55, name, p));
    });
    reveal(ctx, ease(t, 0.46, 0.68), () => {
      const p = phase(t, 0.47, 0.93);
      page(ctx, 83, 56, 151, 187, 'Proposta comercial', p, 0);
      page(ctx, 247, 56, 151, 187, 'Projeção', ease(p, 0.19, 1), 2);
    });
  };

  demos['08-E1'] = (ctx, t) => {
    stage(ctx, 'DOCUMENTOS / FOLHEAR PROPOSTA', gold);
    box(ctx, 150, 58, 179, 188, '#95abc3', 7);
    box(ctx, 146, 56, 179, 188, '#c2cedb', 7);
    const index = t < 0.41 ? 0 : t < 0.7 ? 1 : 2;
    const phaseStart = [0, 0.41, 0.7][index];
    page(ctx, 142, 53, 179, 188, ['Proposta comercial', 'Escopo do projeto', 'Projeção'][index],
      ease(t, phaseStart, phaseStart + (index === 0 ? 0.29 : 0.17)), index);
    const turn = index < 2 ? ease(t, [0.31, 0.6][index], [0.41, 0.7][index]) : 0;
    if (turn > 0) {
      poly(ctx, [[142, 53], [142 + 177 * (1 - turn), 53 + turn * 23], [142 + 177 * (1 - turn), 241 - turn * 23], [142, 241]], '#e0e8f3');
      line(ctx, [[142 + 177 * (1 - turn), 53 + turn * 23], [142 + 177 * (1 - turn), 241 - turn * 23]], gold, 2);
    }
    label(ctx, '0' + (index + 1) + ' / 03', 372, 144, 13, gold, 770);
  };

  demos['08-E2'] = (ctx, t) => {
    stage(ctx, 'DOCUMENTOS / APRESENTAÇÃO', purple);
    ['Projeto Sol', 'Plano de ação', 'Projeção'].forEach((name, i) => {
      const p = ease(t, 0.08 + i * 0.12, 0.46 + i * 0.12);
      reveal(ctx, p, () => {
        const x = mix(168 + 20 * i, 29 + 145 * i, p);
        const y = mix(i % 2 ? 160 : 50, 89, p);
        page(ctx, x, y, 132, 101, name, ease(t, 0.13 + i * 0.12, 0.57 + i * 0.12), i);
        label(ctx, '0' + (i + 1), x + 66, y + 121, 12, purple, 770, 'center');
      });
    });
  };

  demos['08-E3'] = (ctx, t) => {
    stage(ctx, 'DOCUMENTOS / PLANILHA', green);
    dataTable(ctx, 28, 58, 262, 171, 'Planilha de entregas', ['Mês', 'Projetos', 'Entregas'],
      [['Jan', '16', '9'], ['Fev', '18', '13'], ['Mar', '23', '16'], ['Abr', '31', '25']], ease(t, 0.05, 0.62));
    reveal(ctx, ease(t, 0.43, 0.72), () => {
      windowPanel(ctx, 302, 58, 150, 171, 'Entregas');
      graph(ctx, 320, 108, 114, 98, [0.3, 0.41, 0.54, 0.85], ease(t, 0.54, 0.91), green, true);
    });
  };

  demos['08-E4'] = (ctx, t) => {
    stage(ctx, 'DOCUMENTOS / CAPA E PÁGINAS', gold);
    ['Guia de visitas', 'Itinerário', 'Anotações'].forEach((name, i) => {
      const p = ease(t, 0.08 + i * 0.13, 0.43 + i * 0.13);
      reveal(ctx, p, () => {
        ctx.save();
        ctx.translate(mix(240, 108 + i * 132, p), 148);
        ctx.rotate((i - 1) * 0.085 * p);
        page(ctx, -59, -85, 118, 170, name, ease(t, 0.08 + i * 0.14, 0.61 + i * 0.14), i ? 3 + i : 0);
        ctx.restore();
      });
    });
  };

  demos['08-E5'] = (ctx, t) => {
    stage(ctx, 'DOCUMENTOS / ANÁLISE DE DADOS', green);
    const merge = ease(t, 0.12, 0.53);
    for (let i = 0; i < 22; i++) {
      reveal(ctx, 1 - ease(t, 0.38, 0.58), () => label(ctx, String(11 + (i * 67) % 218),
        mix(39 + i % 7 * 61, 240, merge), mix(77 + Math.floor(i / 7) * 49 + i % 3 * 7, 136, merge), 12, accents[i % 5]));
    }
    reveal(ctx, ease(t, 0.45, 0.67), () => {
      windowPanel(ctx, 28, 61, 205, 179, 'Entregas por mês');
      graph(ctx, 44, 105, 172, 104, growth, ease(t, 0.5, 0.84), green, true);
      windowPanel(ctx, 246, 61, 206, 179, 'Visitas por mês');
      graph(ctx, 262, 105, 172, 104, flat, ease(t, 0.61, 0.94), purple);
    });
  };

  demos['RM26-09-01'] = (ctx, t) => {
    stage(ctx, 'ARQUIVOS / ÁRVORE DE SETORES', gold);
    folder(ctx, 181, 52, 118, 56, 'Empresa', ease(t, 0.03, 0.32));
    ['Marketing', 'Comercial', 'Financeiro', 'RH'].forEach((name, i) => {
      const x = 30 + i * 108;
      const p = ease(t, 0.22 + i * 0.09, 0.43 + i * 0.09);
      arrow(ctx, 240, 111, x + 48, 146, p, gold);
      reveal(ctx, p, () => folder(ctx, x, 150, 96, 48, name, 0.7));
      reveal(ctx, ease(t, 0.42 + i * 0.09, 0.65 + i * 0.09), () => folder(ctx, x + 15, 205, 66, 36, ['Capas', 'Vendas', 'Recibos', 'Seleção'][i], 0, blue));
    });
  };

  demos['RM26-09-02'] = (ctx, t) => {
    stage(ctx, 'ARQUIVOS / BUSCA DE DEPOIMENTO', gold);
    const p = ease(t, 0.55, 0.91);
    avatar(ctx, 89, 144, 53, 3, p, t);
    prompt(ctx, 'Encontre o depoimento da equipe', 159, 55, 292, phase(t, 0.06, 0.31));
    reveal(ctx, ease(t, 0.34, 0.51) * (1 - ease(t, 0.57, 0.72)), () => pill(ctx, 'Buscando no acervo…', 203, 127, purple, 146));
    reveal(ctx, ease(t, 0.48, 0.69), () => {
      box(ctx, 191, 101, 220, 141, '#29405e', 7, blue);
      avatar(ctx, 260, 167, mix(24, 42, p), 2, 1, t);
      box(ctx, 317, 135, 68, 64, gold, 4);
      label(ctx, 'EQUIPE', 351, 157, 11, ink, 800, 'center');
      label(ctx, 'DO MÊS', 351, 177, 10, ink, 800, 'center');
    });
  };

  demos['RM26-09-03'] = (ctx, t) => {
    stage(ctx, 'ARQUIVOS / BUSCA NA GAVETA', gold);
    box(ctx, 37, 85, 117, 147, '#263d5a', 6);
    for (let i = 0; i < 2; i++) {
      const p = ease(t, 0.07 + i * 0.2, 0.23 + i * 0.2);
      box(ctx, 45 + p * 16, 98 + i * 58, 101, 44, '#4e6985', 5);
      box(ctx, 82 + p * 16, 115 + i * 58, 28, 4, mist, 2);
    }
    box(ctx, 204, 119, 58, 48, purple, 12);
    dot(ctx, 221, 142, 4, ink);
    dot(ctx, 245, 142, 4, ink);
    label(ctx, 'Assistente', 233, 183, 11, purple, 740, 'center');
    avatar(ctx, 387, 142, 54, 0, ease(t, 0.74, 0.9), t);
    const p = ease(t, 0.4, 0.87);
    reveal(ctx, ease(t, 0.31, 0.48), () => folder(ctx, mix(76, 349, p), 175 - Math.sin(p * Math.PI) * 72, 78, 49, 'Proposta', 0.7));
  };

  function cvCard(ctx, x, y, w, h, name, kind, selected = false) {
    box(ctx, x, y, w, h, '#2a3f59', 7, selected ? green : '#4a6380');
    avatar(ctx, x + w / 2, y + 26, 16, kind);
    label(ctx, name, x + w / 2, y + 52, w < 65 ? 9 : 11, white, 760, 'center');
    if (h > 80) lines(ctx, x + 8, y + 64, w - 16, 2, selected ? green : mist, 1, 8);
  }

  demos['09-G'] = (ctx, t) => {
    stage(ctx, 'GESTÃO / PAINEL INTEGRADO', blue);
    prompt(ctx, 'Reúna as áreas em um painel', 29, 50, 288, phase(t, 0, 0.22));
    const p = ease(t, 0.21, 0.53);
    ['Vendas', 'Tráfego', 'RH'].forEach((name, i) => reveal(ctx, 1 - p, () => pill(ctx, name,
      mix(35 + i * 152, 193, p), mix(133 + i % 2 * 29, 157, p), accents[i], 106)));
    reveal(ctx, p, () => {
      marketing(ctx, 29, 101, 141, 138, ease(t, 0.34, 0.84), 'Vendas', true);
      windowPanel(ctx, 178, 101, 140, 138, 'Tráfego');
      graph(ctx, 191, 151, 115, 69, growth, ease(t, 0.42, 0.9), blue);
      windowPanel(ctx, 326, 101, 125, 138, 'RH');
      reveal(ctx, ease(t, 0.52, 0.83), () => cvCard(ctx, 333, 144, 53, 70, 'Perfil 01', 2));
      reveal(ctx, ease(t, 0.63, 0.93), () => cvCard(ctx, 391, 144, 53, 70, 'Perfil 02', 3, true));
    });
  };

  demos['09-E1'] = (ctx, t) => {
    stage(ctx, 'GESTÃO / VENDAS', green);
    windowPanel(ctx, 48, 54, 384, 187, 'Vendas da semana');
    ['Pedidos', 'Clientes', 'Envios'].forEach((name, i) => {
      const x = 64 + i * 120;
      const p = ease(t, 0.06 + i * 0.1, 0.48 + i * 0.1);
      box(ctx, x, 87, 111, 48, '#263b54', 5);
      label(ctx, name, x + 9, 100, 10, mist);
      label(ctx, Math.floor(p * [48, 37, 41][i]), x + 9, 119, 17, green);
    });
    graph(ctx, 66, 150, 344, 73, growth, ease(t, 0.3, 0.91), green, true);
  };

  demos['09-E2'] = (ctx, t) => {
    stage(ctx, 'GESTÃO / TRÁFEGO', green);
    ['Serra', 'Rio', 'Vale'].forEach((name, i) => {
      pill(ctx, name, 33, 82 + i * 45, accents[i], 83);
      const p = phase(t, 0.07 + i * 0.15, 0.52 + i * 0.15);
      arrow(ctx, 118, 93 + i * 45, 209, 142, ease(t, i * 0.08, 0.35 + i * 0.08), slate);
      if (p > 0 && p < 1) dot(ctx, mix(118, 209, p), mix(93 + i * 45, 142, p), 4, green);
    });
    marketing(ctx, 211, 62, 235, 168, ease(t, 0.29, 0.92), 'Tráfego integrado');
  };

  demos['09-E3'] = (ctx, t) => {
    stage(ctx, 'GESTÃO / SELEÇÃO DE CURRÍCULOS', blue);
    windowPanel(ctx, 31, 58, 418, 174, 'Seleção de perfis');
    for (let i = 0; i < 4; i++) {
      const p = ease(t, 0.07 + i * 0.1, 0.45 + i * 0.1);
      reveal(ctx, p, () => cvCard(ctx, 49 + i * 99, mix(i % 2 ? 149 : 79, 105, p), 86, 97, 'Perfil 0' + (i + 1), i, t > 0.76 && i % 2 === 0));
    }
    reveal(ctx, ease(t, 0.75, 0.92), () => pill(ctx, '2 pré-selecionados', 294, 221, green, 135));
  };

  function audit(ctx, t, scanOnly = false, keywords = false) {
    const scan = phase(t, 0.13, 0.67);
    const p = ease(t, 0.4, 0.9);
    const x = scanOnly ? 62 : 31;
    const w = scanOnly ? 356 : 267;
    windowPanel(ctx, x, 66, w, 170, 'Auditoria da página');
    const modules = keywords ? ['Trilhas ao amanhecer', 'Guia de caminhadas', 'Roteiro da serra'] : ['Título e navegação', 'Imagem e descrição', 'Links da página'];
    for (let i = 0; i < 3; i++) {
      const fix = ease(t, 0.24 + i * 0.13, 0.52 + i * 0.13);
      const offset = [19, -4, 27][i] * (1 - fix);
      const y = 105 + i * 37;
      box(ctx, x + 14 + offset, y, w - 60 + 31 * fix, 29, fix > 0.9 ? '#295745' : '#473843', 5);
      label(ctx, modules[i], x + 24 + offset, y + 14, 12);
      if (fix > 0.9) label(ctx, keywords ? '★' : '✓', x + w - 35, y + 14, 15, keywords ? gold : green);
    }
    if (scan > 0 && scan < 1) {
      box(ctx, x + 7, 99 + 112 * scan, w - 14, 12, '#83aaff33', 4);
      line(ctx, [[x + 9, 104 + 112 * scan], [x + w - 9, 104 + 112 * scan]], blue, 2);
    }
    if (!scanOnly) {
      if (keywords) {
        const rank = 8 - Math.round(7 * p);
        gauge(ctx, 376, 151, 50, p * 0.85 + 0.15, '№ ' + rank, rank < 3 ? green : coral);
        label(ctx, 'Posição na busca', 376, 218, 12, mist, 700, 'center');
      } else {
        const score = Math.round(mix(47, 99, p));
        gauge(ctx, 376, 151, 50, score / 100, score, score > 75 ? green : coral);
        label(ctx, 'Nota da página', 376, 218, 12, mist, 700, 'center');
      }
    }
  }

  function searchResults(ctx, x, y, w, h, query, title, rank, p, domain = 'valedatrilha.test') {
    windowPanel(ctx, x, y, w, h, 'Busca na web', true);
    box(ctx, x + 11, y + 34, w - 22, 25, '#dfe8f3', 5);
    label(ctx, '⌕  ' + query, x + 17, y + 47, 11, ink);
    reveal(ctx, p, () => {
      box(ctx, x + 11, y + 69, w - 22, 55, rank === 1 ? '#d8f0e6' : '#e7ebf2', 5);
      label(ctx, domain, x + 18, y + 81, 10, '#324860');
      label(ctx, title, x + 18, y + 99, 14, '#1d4d75', 790);
      lines(ctx, x + 18, y + 113, w - 62, 1, '#778fa9');
      label(ctx, 'Página ' + rank, x + w - 19, y + h - 15, 10, '#3f546a', 710, 'right');
    });
  }

  demos['10-G'] = (ctx, t) => {
    stage(ctx, 'SEO / AUDITORIA E NOTA', blue);
    reveal(ctx, 1 - ease(t, 0.21, 0.44), () => prompt(ctx, 'Audite a página de trilhas', 61, 103, 358, phase(t, 0, 0.24)));
    reveal(ctx, ease(t, 0.24, 0.45), () => audit(ctx, phase(t, 0.25, 0.98)));
  };

  demos['10-E1'] = (ctx, t) => {
    stage(ctx, 'SEO / VARREDURA DA PÁGINA', blue);
    audit(ctx, t, true);
  };

  demos['10-E2'] = (ctx, t) => {
    stage(ctx, 'SEO / MEDIDOR DE NOTA', green);
    website(ctx, 47, 58, 386, 179, 1, 0.16, 1);
    box(ctx, 130, 68, 220, 157, '#18273bee', 13, '#4b6386');
    const p = ease(t, 0.14, 0.82);
    const score = Math.round(mix(47, 99, p));
    gauge(ctx, 240, 145, 49, score / 100, score, score > 75 ? green : coral);
    label(ctx, 'Nota da página', 240, 203, 12, mist, 720, 'center');
  };

  demos['10-E3'] = (ctx, t) => {
    stage(ctx, 'SEO / BUSCA CONVERSACIONAL', blue);
    prompt(ctx, 'Quem vende tênis em Vila Clara?', 42, 53, 396, phase(t, 0, 0.34));
    reveal(ctx, ease(t, 0.33, 0.66), () => {
      box(ctx, 47, 107, 386, 127, '#29435e', 9, blue);
      label(ctx, 'Ateliê Passo Leve', 67, 134, 19, white, 770);
      label(ctx, 'Tênis para trilha · Vila Clara', 67, 160, 12, mist);
      pill(ctx, 'Resultado em destaque', 67, 189, green, 155);
      const x = 327;
      const y = 163;
      poly(ctx, [[x - 41, y + 4], [x - 16, y - 25], [x + 10, y - 13], [x + 18, y - 1],
        [x + 42, y + 7], [x + 50, y + 21], [x - 44, y + 21]], coral);
      line(ctx, [[x - 44, y + 21], [x + 50, y + 21]], white, 5);
      for (let i = 0; i < 3; i++) line(ctx, [[x - 12 + i * 8, y - 15 + i * 4], [x + i * 8, y - 19 + i * 4]], white, 2);
    });
  };

  demos['RM26-10-01'] = (ctx, t) => {
    stage(ctx, 'SEO / FRASE PARA RESULTADO', blue);
    const query = 'Trilhas em Vila Clara';
    reveal(ctx, 1 - ease(t, 0.34, 0.57), () => prompt(ctx, query, 61, 105, 358, phase(t, 0.04, 0.31)));
    reveal(ctx, ease(t, 0.36, 0.62), () => searchResults(ctx, 66, 57, 348, 178, query, query, 1, ease(t, 0.57, 0.91)));
  };

  demos['RM26-10-02'] = (ctx, t) => {
    stage(ctx, 'SEO / VÍDEO E DESCOBERTA', coral);
    if (t < 0.32) {
      phone(ctx, 183, 52, 114, 195, (x, y, w, h) => {
        art(ctx, x, y, w, h, 1);
        person(ctx, 240, 148 + Math.sin(t * 38) * 9, 0.87, t, 3, Math.sin(t * 35) * 0.44);
        label(ctx, 'Ops!', 240, 218, 15, white, 800, 'center');
      });
    } else if (t < 0.66) {
      take(ctx, 83, 56, 314, 185, 2, t);
      pill(ctx, 'Helena · guia de trilhas', 92, 209, green, 165);
    } else {
      searchResults(ctx, 66, 57, 348, 178, 'Guia de trilhas em Vila Clara', 'Helena · guia de trilhas', 1, ease(t, 0.66, 0.88));
    }
  };

  demos['RM26-10-03'] = (ctx, t) => {
    stage(ctx, 'SEO / PALAVRA E CLIQUES', blue);
    if (t < 0.39) {
      label(ctx, 'roteiro', 54, 135, 16, mist);
      label(ctx, 'trilhas leves', 180, 135, 20, green, 800);
      label(ctx, 'mapas', 359, 135, 16, mist);
      const x = mix(87, 240, ease(t, 0.02, 0.33));
      outline(ctx, x, 136, 62, 34, blue, 3);
      line(ctx, [[x + 49, 157], [x + 75, 181]], blue, 5);
    } else {
      searchResults(ctx, 54, 56, 372, 180, 'Trilhas leves', 'Trilhas leves em Vila Clara', 1, 1);
      const p = ease(t, 0.44, 0.69);
      cursor(ctx, mix(393, 248, p), mix(230, 153, p), t > 0.67 && t < 0.78);
      pill(ctx, Math.floor(ease(t, 0.68, 0.95) * 18) + ' novas visitas', 67, 219, green, 133);
    }
  };

  demos['RM26-10-04'] = (ctx, t) => {
    stage(ctx, 'SEO / PALAVRAS E POSIÇÃO', gold);
    audit(ctx, t, false, true);
  };

  demos['RM26-10-05'] = (ctx, t) => {
    stage(ctx, 'SEO / QUARTA PARA PRIMEIRA', green);
    const query = 'Trilhas em Vila Clara';
    const p = ease(t, 0.26, 0.78);
    clip(ctx, 0, 44, 480, 214, () => {
      searchResults(ctx, 65 - 480 * p, 58, 350, 181, query, 'Vale da trilha', 4, 1);
      searchResults(ctx, 65 + 480 * (1 - p), 58, 350, 181, query, 'Vale da trilha', 1, 1);
    }, 0);
  };

  function timeline(ctx, x, y, w, h, t, mode = 'cut') {
    windowPanel(ctx, x, y, w, h, 'Linha do tempo');
    const left = x + 16;
    const width = w - 32;
    const gap = ease(t, 0.24, 0.59);
    const track = y + 52;
    for (let i = 0; i < 8; i++) {
      const mark = left + i * width / 8;
      line(ctx, [[mark, track - 11], [mark, track - 6]], mist, 1);
    }
    box(ctx, left, track, width, 27, '#283c55', 4);
    for (let i = 0; i < 4; i++) {
      const start = mix([0, 0.28, 0.54, 0.83][i], i * 0.185, gap);
      box(ctx, left + width * start, track, width * 0.17, 27, accents[i], 3);
      if (i < 3 && gap < 0.7) {
        reveal(ctx, 1 - gap / 0.7, () => box(ctx, left + width * (start + 0.18), track, width * (0.09 - gap * 0.09), 27, coral, 3));
      }
    }
    if (mode === 'full') {
      reveal(ctx, ease(t, 0.38, 0.64), () => {
        ['Legenda', 'Título', 'Legenda'].forEach((name, i) => {
          box(ctx, left + i * width * 0.245, track + 32, width * 0.23, 17, '#374e6a', 3);
          label(ctx, name, left + 6 + i * width * 0.245, track + 40, 8, white);
        });
      });
      wave(ctx, left + 3, track + 63, width * 0.8, 18, phase(t, 0.58, 0.78), purple);
    }
    const head = left + width * phase(t, 0.05, 0.93);
    line(ctx, [[head, track - 15], [head, y + h - 8]], white, 1);
    poly(ctx, [[head - 4, track - 15], [head + 4, track - 15], [head, track - 8]], white);
  }

  demos['11-G'] = (ctx, t) => {
    stage(ctx, 'EDIÇÃO / BRUTO PARA VERTICAL', coral);
    reveal(ctx, 1 - ease(t, 0.16, 0.37), () => pill(ctx, '↓ gravação_bruta.mp4', 42, 59, purple, 167));
    timeline(ctx, 30, 104, 282, 131, phase(t, 0.11, 0.82), 'full');
    reveal(ctx, ease(t, 0.56, 0.83), () => phone(ctx, 334, 56, 113, 188, (x, y, w, h) => {
      take(ctx, x, y, w, h, 2, t);
      pill(ctx, '✓ Vídeo pronto', x + 4, y + h - 32, green, w - 8);
    }));
    arrow(ctx, 278, 79, 330, 79, ease(t, 0.54, 0.76), coral);
  };

  demos['11-E1'] = (ctx, t) => {
    stage(ctx, 'EDIÇÃO / LIMPEZA DA TIMELINE', coral);
    timeline(ctx, 43, 83, 394, 129, t);
    pill(ctx, t < 0.52 ? 'Erros e pausas' : '✓ Lacunas fechadas', 53, 225, t < 0.52 ? coral : green, 153);
  };

  demos['11-E2'] = (ctx, t) => {
    stage(ctx, 'EDIÇÃO / REENQUADRAMENTO', coral);
    reveal(ctx, 1 - ease(t, 0.31, 0.64), () => {
      take(ctx, 64, 55, 352, 187, 0, t);
      const p = ease(t, 0.06, 0.32);
      ctx.beginPath();
      ctx.roundRect(240 - mix(171, 51, p), 59, mix(342, 102, p), 178, 7);
      ctx.strokeStyle = white;
      ctx.lineWidth = 3;
      ctx.stroke();
    });
    for (let i = 0; i < 3; i++) {
      const p = ease(t, 0.29 + i * 0.13, 0.58 + i * 0.13);
      reveal(ctx, p, () => phone(ctx, mix(184, 55 + 130 * i, p), 54, 112, 191,
        (x, y, w, h) => {
          take(ctx, x, y, w, h, i, t + i * 0.15);
          label(ctx, 'Corte 0' + (i + 1), x + w / 2, y + h - 18, 12, white, 760, 'center');
        }));
    }
  };

  function caption(ctx, t, x, y, w) {
    const words = ['Cada', 'trilha', 'conta', 'uma história.'];
    const index = Math.min(3, Math.floor(phase(t, 0.1, 0.9) * 4));
    box(ctx, x, y, w, 30, '#101a2add', 6);
    label(ctx, words[index], x + w / 2, y + 15, 16, index % 2 ? gold : white, 790, 'center');
  }

  demos['11-E3'] = (ctx, t) => {
    stage(ctx, 'EDIÇÃO / LEGENDAS E GRAFISMOS', coral);
    take(ctx, 63, 53, 354, 194, 2, t);
    reveal(ctx, ease(t, 0.11, 0.25), () => caption(ctx, t, 150, 199, 180));
    const p = ease(t, 0.35, 0.55);
    reveal(ctx, p, () => pill(ctx, 'Diário de trilha', mix(30, 77, p), 74, purple, 126));
  };

  demos['RM26-11-01'] = (ctx, t) => {
    stage(ctx, 'EDIÇÃO / GRAVAÇÃO VERSUS EDIÇÃO', gold);
    take(ctx, 28, 54, 202, 132, 1, t);
    timeline(ctx, 247, 54, 205, 132, t);
    clock(ctx, 52, 220, 13, phase(t, 0.05, 0.52), coral);
    clock(ctx, 270, 220, 13, phase(t, 0.05, 0.92) * 2.3, gold);
    label(ctx, 'Gravação  ·  ' + Math.round(ease(t, 0.05, 0.52) * 20) + ' min', 73, 221, 12, coral);
    label(ctx, 'Edição  ·  ' + Math.round(ease(t, 0.05, 0.92) * 75) + ' min', 291, 221, 12, gold);
  };

  demos['RM26-11-02'] = (ctx, t) => {
    stage(ctx, 'EDIÇÃO / FLUXO COMPLETO', coral);
    if (t < 0.22) {
      windowPanel(ctx, 88, 73, 304, 126, 'Importar gravação');
      label(ctx, 'gravação_bruta.mp4', 105, 123, 16);
      box(ctx, 105, 151, 270, 7, slate, 4);
      box(ctx, 105, 151, 270 * phase(t, 0, 0.22), 7, blue, 4);
    } else if (t < 0.77) {
      timeline(ctx, 41, 66, 398, 153, phase(t, 0.22, 0.73), 'full');
      reveal(ctx, ease(t, 0.65, 0.75), () => pill(ctx, '✓ Exportação concluída', 262, 228, green, 169));
    } else {
      take(ctx, 86, 56, 308, 187, 2, t);
      caption(ctx, phase(t, 0.77, 1), 150, 198, 180);
    }
  };

  function call(ctx, t, first, second, suggestion, state = false) {
    const dialogue = t > 0.69;
    windowPanel(ctx, 28, 57, 258, 176, 'Chamada comercial');
    [first, second].forEach((name, i) => {
      const x = 38 + i * 121;
      const active = i === (dialogue ? 1 : 0);
      box(ctx, x, 93, 116, 108, '#263b53', 6, active ? green : slate);
      avatar(ctx, x + 58, 139, 33, i + 1, active ? 1 : 0, t);
      label(ctx, name, x + 58, 184, 11, active ? green : mist, 720, 'center');
    });
    wave(ctx, 101, 215, 108, 13, 1, t % 0.1 < 0.05 ? mist : green);
    const entry = ease(t, 0.32, 0.58);
    reveal(ctx, entry, () => {
      ctx.translate(40 * (1 - entry), 0);
      box(ctx, 298, 57, 154, 175, '#253c59', 8, blue);
      label(ctx, 'Sugestão ao vivo', 309, 80, 12, blue, 760);
      suggestion.forEach((part, i) => {
        reveal(ctx, ease(t, 0.41 + i * 0.075, 0.55 + i * 0.075), () => label(ctx, part, 309, 117 + i * 18, 12));
      });
      pill(ctx, state ? '✓ Fechado' : dialogue ? 'Resposta em curso' : 'Próxima resposta', 305, 196, state ? green : purple, 139);
    }, 0);
  }

  demos['12-G'] = (ctx, t) => {
    stage(ctx, 'CHAMADAS / SUGESTÃO AO VIVO', purple);
    call(ctx, t, 'Cliente', 'Consultor', ['Pergunte qual etapa', 'mais atrasa a rotina.']);
  };

  demos['12-E1'] = (ctx, t) => {
    stage(ctx, 'CHAMADAS / PERGUNTA DE PREÇO', gold);
    call(ctx, t, 'Cliente', 'Consultora', ['Confirme o escopo', 'antes de citar valores.']);
    reveal(ctx, ease(t, 0.08, 0.28), () => pill(ctx, 'Qual é o investimento?', 38, 228, gold, 171));
  };

  demos['12-E2'] = (ctx, t) => {
    stage(ctx, 'CHAMADAS / OBJEÇÃO', coral);
    call(ctx, t, 'Cliente', 'Consultor', ['Proponha um piloto', 'de duas semanas.']);
    reveal(ctx, ease(t, 0.08, 0.28), () => pill(ctx, 'Não temos tempo', 38, 228, coral, 155));
  };

  demos['RM26-12-01'] = (ctx, t) => {
    stage(ctx, 'CHAMADAS / FECHAMENTO', green);
    call(ctx, t, 'Cliente', 'Vendedor', ['Combine a data', 'da primeira entrega.'], t > 0.83);
    reveal(ctx, 1 - ease(t, 0.29, 0.54), () => pill(ctx, 'Como avançar?', 161, 228, gold, 111));
    party(ctx, 373, 206, t, 0.81, 69);
  };

  demos['RM26-12-02'] = (ctx, t) => {
    stage(ctx, 'GESTÃO / META DA EQUIPE', green);
    const p = ease(t, 0.1, 0.7);
    windowPanel(ctx, 29, 58, 241, 180, 'Meta comercial');
    graph(ctx, 47, 109, 204, 90, [0.32, 0.46, 0.64, 0.82, 1], p, green, true);
    label(ctx, Math.floor(p * 100) + '% da meta', 49, 217, 14, green, 780);
    avatar(ctx, 317, 145, 38, 0, p, t);
    avatar(ctx, 407, 145, 38, 2, p, t);
    avatar(ctx, 363, 201, 37, 1, p, t);
    party(ctx, 365, 158, t, 0.68, 99);
    reveal(ctx, ease(t, 0.72, 0.88), () => pill(ctx, '✓ Meta atingida', 301, 58, green, 126));
  };
})();

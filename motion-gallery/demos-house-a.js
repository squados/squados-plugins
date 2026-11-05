(() => {
  'use strict';

  const demos = window.motionDemos ??= Object.create(null);
  const tau = 2 * Math.PI;
  const { sin, cos, sqrt, abs, PI } = Math;
  const white = '#fff2df';
  const sky = '#93e5ff';
  const teal = '#43f2c4';
  const violet = '#b5a0ff';
  const orchid = '#f4a2eb';
  const coral = '#ff6d55';
  const amber = '#ffd36b';
  const ink = '#111427';

  const clamp = v => Math.max(0, Math.min(1, v));
  const phase = (t, a, b) => clamp((t - a) / (b - a));
  const ease = (t, a, b) => {
    const u = phase(t, a, b);
    return u * u * (3 - 2 * u);
  };
  const out = (t, a, b) => 1 - (1 - phase(t, a, b)) ** 4;
  const mix = (a, b, u) => a + (b - a) * u;
  const rand = i => {
    const value = sin(i * 128.13 + 8.79) * 43758.5453;
    return value - Math.floor(value);
  };
  const at = (x, y, radius, a) => [x + cos(a) * radius, y + sin(a) * radius];
  const points = (count, fn) => Array.from({ length: count }, (_, i) => fn(i));

  function scoped(ctx, draw) {
    ctx.save();
    draw();
    ctx.restore();
  }

  function alpha(ctx, opacity, draw) {
    if (opacity <= 0) return;
    scoped(ctx, () => {
      ctx.globalAlpha *= clamp(opacity);
      draw();
    });
  }

  function pose(ctx, x, y, rotation, sx, sy, draw) {
    scoped(ctx, () => {
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.scale(sx, sy);
      draw();
    });
  }

  function line(ctx, vertices, color, width = 2) {
    if (vertices.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(...vertices[0]);
    vertices.slice(1).forEach(v => ctx.lineTo(...v));
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = color;
    ctx.stroke();
  }

  function polygon(ctx, vertices, color) {
    ctx.beginPath();
    ctx.moveTo(...vertices[0]);
    vertices.slice(1).forEach(v => ctx.lineTo(...v));
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  function rect(ctx, x, y, w, h, radius, color) {
    if (w <= 0 || h <= 0) return;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);
    ctx.fillStyle = color;
    ctx.fill();
  }

  function dot(ctx, x, y, radius, color) {
    if (radius <= 0) return;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, tau);
    ctx.fillStyle = color;
    ctx.fill();
  }

  function arc(ctx, x, y, rx, ry, a, b, color, width = 1) {
    if (rx <= 0 || ry <= 0 || a === b) return;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, a, b, b < a);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  function trace(ctx, vertices, progress, color, width = 2) {
    if (progress <= 0) return;
    const index = Math.min(vertices.length - 2, Math.floor((vertices.length - 1) * progress));
    const a = vertices[index];
    const b = vertices[index + 1];
    const u = (vertices.length - 1) * progress - index;
    line(ctx, [...vertices.slice(0, index + 1), [mix(a[0], b[0], u), mix(a[1], b[1], u)]], color, width);
  }

  function gradient(ctx, x1, y1, x2, y2, a, b) {
    const ramp = ctx.createLinearGradient(x1, y1, x2, y2);
    ramp.addColorStop(0, a);
    ramp.addColorStop(1, b);
    return ramp;
  }

  function orb(ctx, x, y, radius, a, b) {
    if (radius <= 0) return;
    const light = ctx.createRadialGradient(x - radius * .35, y - radius * .38, 0, x, y, radius);
    light.addColorStop(0, a);
    light.addColorStop(.55, b);
    light.addColorStop(1, ink);
    dot(ctx, x, y, radius, light);
  }

  function type(ctx, value, x, y, size, color, weight = 800, family = 'system-ui') {
    ctx.font = weight + ' ' + size + 'px ' + family;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color;
    ctx.fillText(value, x, y);
  }

  function burst(ctx, x, y, t, color, count = 12, radius = 74) {
    if (t <= 0 || t >= 1) return;
    alpha(ctx, (1 - t) ** 1.3, () => {
      for (let i = 0; i < count; i++) {
        const a = tau * (i + rand(i) * .6) / count;
        const r = (radius * (.56 + .44 * rand(i + 23))) * out(t, 0, 1);
        line(ctx, [at(x, y, r, a), at(x, y, r + 11 * (1 - t), a)], color, 1 + 2 * rand(i + 42));
      }
    });
  }

  function check(ctx, x, y, size, t, color) {
    trace(ctx, [[x - size * .4, y], [x - size * .12, y + size * .26], [x + size * .43, y - size * .33]], t, color, size * .09);
  }

  demos['01-G'] = (ctx, t) => {
    const close = ease(t, .67, .91);
    [violet, coral, white].forEach((color, i) => {
      const u = out(t, i * .07, .44 + i * .07) * (1 - close);
      const end = 340 + 19 * i;
      const y = 135 + (i - 1) * 52 * u;
      const ramp = gradient(ctx, 97, 0, end, 0, color, color + '1d');
      ctx.beginPath();
      ctx.moveTo(93, 136);
      ctx.bezierCurveTo(172, 136 - u * 24, 224, y + 14, end, y - 17 * u);
      ctx.bezierCurveTo(331, y + 31 * u, 180, 154 + u * 19, 93, 138);
      ctx.fillStyle = ramp;
      ctx.fill();
    });
    alpha(ctx, close, () => line(ctx, [[93, 137], [371, 137]], white, 2.5));
  };

  demos['01-E1'] = (ctx, t) => {
    [124, 240, 356].forEach((x, i) => {
      const u = ease(t, .08 + i * .14, .58 + i * .14);
      dot(ctx, x, 135, 49, [coral, amber, orchid][i]);
      scoped(ctx, () => {
        ctx.beginPath();
        ctx.arc(x, 135, 48.5, 0, tau);
        ctx.clip();
        ctx.beginPath();
        ctx.rect(x - 50, 185 - 100 * u, 100, 100 * u);
        ctx.clip();
        for (let j = 0; j < 12; j++) {
          line(ctx, points(40, k => [x - 51 + k * 2.7, 90 + j * 8 + sin(k / 6 + j * .55) * (8 + i * 1.7)]), ink, 1.2);
        }
        line(ctx, [[x - 51, 186 - 100 * u], [x + 51, 186 - 100 * u]], white, 2);
      });
    });
  };

  demos['01-E2'] = (ctx, t) => {
    for (let i = 0; i < 6; i++) {
      const p = phase(t, .07 + i * .045, .62 + i * .045);
      const u = out(p, 0, 1);
      const radius = 10 + 52 * u + sin(p * PI) * 11;
      const a = i * tau / 6 - PI / 2 + (1 - u) * .85;
      pose(ctx, 240, 135, a, 1, 1, () => {
        rect(ctx, 0, -21 * u, radius + 27 * u, 42 * u, 25, gradient(ctx, 0, 0, 95, 0, coral, amber));
        alpha(ctx, u, () => line(ctx, [[24, 0], [radius + 11, 0]], white, .9));
      });
    }
    orb(ctx, 240, 135, mix(25, 17, out(t, .1, .68)), white, amber);
  };

  demos['01-E3'] = (ctx, t) => {
    const rail = points(60, i => [63 + i * 6, 161 - 75 * sin(i / 59 * PI)]);
    line(ctx, rail, '#93e5ff49', 1.5);
    [violet, teal, sky].forEach((color, i) => {
      const u = ease(t, .08 + i * .15, .55 + i * .15);
      const pos = mix(.12 - i * .055, .95 - i * .067, u);
      const x = 63 + pos * 354;
      const y = 161 - 75 * sin(pos * PI);
      const spring = sin(phase(t, .51 + i * .15, .68 + i * .15) * PI);
      pose(ctx, x, y, mix(.54, PI / 4, u), mix(1, .46, u) + .1 * spring, mix(1, .46, u) - .1 * spring, () => {
        rect(ctx, -22, -22, 44, 44, 8, gradient(ctx, -22, -22, 22, 22, white, color));
        rect(ctx, -13, -13, 26, 26, 4, color);
      });
    });
  };

  demos['RM26-02-01'] = (ctx, t) => {
    const drop = phase(t, .13, .57);
    const rebound = sin(PI * phase(t, .57, .77)) * 19;
    const x = mix(136, 300, out(t, .13, .72));
    const y = mix(67, 184, drop ** 2.4) - rebound;
    const squash = sin(phase(t, .55, .62) * PI);
    alpha(ctx, .5, () => line(ctx, [[106, 195], [376, 195]], amber, 1));
    pose(ctx, x, y, tau * ease(t, .08, .57) + rebound * .009, 1 + squash * .13, 1 - squash * .32, () => {
      rect(ctx, -57, -10, 114, 20, 10, gradient(ctx, -42, -10, 42, 10, white, amber));
      line(ctx, [[-38, -4], [35, -4]], white, 1);
    });
    burst(ctx, x, 194, phase(t, .56, .86), amber, 17, 54);
  };

  demos['RM26-02-02'] = (ctx, t) => {
    const u = ease(t, .28, .76);
    const beat = sin(phase(t, .1, .3) * 2 * PI) ** 2;
    const width = mix(73, 230, u) + beat * 36;
    for (let j = 0; j < 3; j++) {
      const vertices = points(66, i => {
        const s = i / 65;
        return [240 + (s - .5) * (width + j * 22 * u), 128 + sin(s * PI) * (42 + j * 18) * u + beat * sin(s * tau * 2) * 6];
      });
      alpha(ctx, j === 0 ? 1 : u * (.8 - .17 * j), () => line(ctx, vertices, [orchid, violet, white][j], j === 0 ? 8 : 2));
    }
  };

  demos['RM26-02-03'] = (ctx, t) => {
    const x = mix(101, 368, ease(t, .12, .84));
    scoped(ctx, () => {
      ctx.beginPath();
      ctx.arc(240, 135, 91, 0, tau);
      ctx.clip();
      dot(ctx, 240, 135, 91, coral);
      for (let i = 0; i < 28; i++) line(ctx, [[104 + i * 12, 32], [15 + i * 12, 237]], ink, 2.2);
      ctx.beginPath();
      ctx.moveTo(40, 30);
      ctx.lineTo(x + 57, 30);
      ctx.lineTo(x - 57, 240);
      ctx.lineTo(40, 240);
      ctx.closePath();
      ctx.clip();
      dot(ctx, 240, 135, 91, teal);
      for (let i = 0; i < 28; i++) line(ctx, [[60 + i * 12, 31], [147 + i * 12, 238]], ink, 2.2);
      line(ctx, [[x + 57, 30], [x - 57, 240]], white, 4);
    });
  };

  demos['02-G'] = (ctx, t) => {
    const draw = (level, color) => {
      const u = out(t, level * .13, .42 + level * .13);
      const y = 189 - level * 49 * u;
      const w = 110 - level * 22;
      alpha(ctx, u, () => {
        polygon(ctx, [[240 - w, y], [240, y - 37 * u], [240 + w, y], [240, y + 37 * u]], gradient(ctx, 150, y + 23, 330, y - 20, violet, color));
        polygon(ctx, [[240 - w, y], [240, y + 37 * u], [240 + w, y], [240 + w, y + 11 * u], [240, y + 48 * u], [240 - w, y + 11 * u]], ink);
        trace(ctx, [[240 - w, y], [240, y + 37 * u], [240 + w, y]], ease(t, .26 + level * .13, .64 + level * .12), white, 1.1);
      });
    };
    draw(0, violet);
    draw(1, sky);
    draw(2, white);
  };

  demos['02-E1'] = (ctx, t) => {
    const u = ease(t, .05, .92);
    scoped(ctx, () => {
      ctx.beginPath();
      ctx.arc(240, 135, 93, 0, tau);
      ctx.clip();
      dot(ctx, 240, 135, 93, violet);
      dot(ctx, 275 - 24 * u, 88, 24, amber);
      [violet, coral, amber].forEach((color, j) => {
        const wave = points(70, i => [137 + i * 3, 123 + j * 30 + sin(i * .13 + u * (1.6 + j * 1.9) + j) * (18 - j * 2)]);
        polygon(ctx, [...wave, [345, 236], [137, 236]], gradient(ctx, 150, 155, 316, 229, color, color + '77'));
        line(ctx, wave, color, 1.4);
      });
    });
  };

  demos['02-E2'] = (ctx, t) => {
    const u = ease(t, .1, .87);
    pose(ctx, 240, 136, mix(-.27, .28, u), 1, 1, () => {
      const vertices = [[-104, 37], [-65, -70], [89, -53], [101, 53], [-24, 80]];
      polygon(ctx, vertices, gradient(ctx, -100, -40, 80, 55, orchid, violet));
      scoped(ctx, () => {
        ctx.clip();
        const y = 87 - 168 * u;
        rect(ctx, -120, y, 240, 177, 0, gradient(ctx, -105, 0, 105, 20, teal, sky));
        for (let i = -6; i < 11; i++) alpha(ctx, .45, () => line(ctx, [[i * 21, -81], [i * 21 - 70, 81]], ink, 1.4));
        line(ctx, [[-125, y], [125, y]], white, 3);
      });
    });
  };

  demos['02-E3'] = (ctx, t) => {
    const merge = ease(t, .37, .57);
    for (let i = 0; i < 3; i++) {
      const u = out(t, .04 + i * .10, .20 + i * .10);
      alpha(ctx, 1 - merge, () => orb(ctx, mix(166 + i * 74, 240, merge), 135, (14 + sin(u * PI) * 8) * u, white, amber));
    }
    alpha(ctx, merge, () => dot(ctx, 240, 135, mix(12, 63, out(t, .38, .63)), teal));
    check(ctx, 240, 135, 108, ease(t, .52, .77), ink);
    burst(ctx, 240, 135, phase(t, .53, .87), white, 20, 102);
  };

  demos['RM26-03-01'] = (ctx, t) => {
    for (let i = 3; i >= 0; i--) {
      const p = ease(t - i * .045, .12, .68);
      const x = mix(98, 348, p);
      const y = 137 - 58 * sin(p * PI) - 8 * sin(PI * phase(t, .68, .86));
      alpha(ctx, i ? .25 / i * sin(PI * p) : 1, () => {
        orb(ctx, x, y, 38, white, amber);
        arc(ctx, x, y, 28, 28, -PI / 2, PI * 1.5, white, .85);
        polygon(ctx, [[x, y - 16], [x + 12, y], [x, y + 16], [x - 12, y]], amber);
      });
    }
    for (let i = 0; i < 2; i++) {
      const r = phase(t, .66 + i * .06, .96);
      alpha(ctx, (1 - r) * r * 2, () => arc(ctx, 348, 137, 38 + r * 29, 38 + r * 29, 0, tau, amber));
    }
  };


  demos['03-G'] = (ctx, t) => {
    for (let j = 0; j < 7; j++) {
      const a = j * tau / 7 - PI / 2;
      const vertices = points(60, i => {
        const u = i / 59;
        return at(240, 135, 8 + 84 * sin(u * PI), a + (u - .5) * 1.18);
      });
      trace(ctx, vertices, out(t, j * .067, .42 + j * .067), gradient(ctx, 240, 45, 240, 225, white, violet), 2.2 + (j % 3) * .9);
    }
  };

  demos['03-E1'] = (ctx, t) => {
    const u = out(t, .03, .32);
    rect(ctx, 119, 59, 180 * u, 16, 8, white);
    const v = ease(t, .19, .61);
    scoped(ctx, () => {
      ctx.beginPath();
      ctx.rect(119, 89, 243, 66 * v);
      ctx.clip();
      for (let j = 0; j < 8; j++) {
        line(ctx, points(51, i => [121 + i * 4.75, 95 + j * 7.8 + 9 * sin(i * .17 + j * .4 + t * 1.5)]), violet, 2);
      }
    });
    [204, 158, 225, 105].forEach((w, i) => rect(ctx, 119, 175 + 12 * i, w * out(t, .41 + i * .075, .66 + i * .075), 2, 1, white));
  };

  demos['03-E2'] = (ctx, t) => {
    for (let i = 0; i < 3; i++) {
      const start = .1 + i * .11;
      const u = ease(t, start, start + .46);
      const spring = sin(PI * phase(t, start + .31, start + .58));
      const y = 87 + 27 * i;
      rect(ctx, 112, y + u * 60 + spring * 8, 237 - i * 24, 5, 3, white);
      alpha(ctx, u, () => rect(ctx, mix(65, 112, u), y - 5, mix(145, 210 + i * 23, u), 15, 8, gradient(ctx, 112, 0, 350, 0, coral, amber)));
    }
  };

  demos['03-E3'] = (ctx, t) => {
    const center = [240, 135];
    for (let i = 0; i < 6; i++) {
      const a = -PI / 2 + i * tau / 6;
      const p = i < 2 ? 1 : out(t, .07 + (i - 2) * .13, .5 + (i - 2) * .13);
      const edge = at(...center, 90, a);
      const next = at(...center, 90, a + p * tau / 6);
      polygon(ctx, [center, edge, next], [violet, '#7b5ad0', '#a785e8', '#57418f', '#8e74e1', '#d4bcff'][i]);
      line(ctx, [edge, next, center], white + '8a', 1.1);
    }
  };

  demos['RM26-04-01'] = (ctx, t) => {
    const settle = ease(t, .7, .94);
    for (let i = 0; i < 5; i++) {
      const u = out(t, .16 + i * .055, .62 + i * .037);
      const h = (i - 2) * 32 * (1 - settle);
      const w = 78 + 168 * u - abs(i - 2) * 12;
      alpha(ctx, u * (1 - (i === 2 ? 0 : settle)), () => line(ctx, [[121, 135], [121 + w * u, 135 + h * u]], gradient(ctx, 120, 135, 369, 135, white, amber), i === 2 ? 5 : 1.6));
    }
    orb(ctx, 121, 135, 10 + out(t, 0, .25) * 10, white, amber);
    burst(ctx, 121, 135, phase(t, .12, .43), amber, 9, 28);
  };

  demos['RM26-04-02'] = (ctx, t) => {
    const u = ease(t, .12, .7);
    const x = mix(171, 338, u);
    const y = 139 - 59 * sin(PI * u);
    const scale = mix(1, .38, u);
    arc(ctx, 338, 139, 43, 43, -.22 * PI, PI * (1.15 + ease(t, .55, .85) * .63), white, 1.4);
    pose(ctx, x, y, u * 2.8, scale, scale, () => {
      dot(ctx, 0, 0, 75, coral);
      scoped(ctx, () => {
        ctx.clip();
        for (let j = -7; j <= 7; j++) line(ctx, [[-80, j * 11], [80, j * 11]], ink, j % 3 === 0 ? 3 : 1.2);
      });
    });
  };

  demos['04-G'] = (ctx, t) => {
    [sky, violet, teal].forEach((color, i) => {
      const u = ease(t, .02 + i * .07, .65);
      const vertices = points(55, j => {
        const p = j / 54;
        return [mix(69, 297, p), 135 + (i - 1) * 92 * (1 - p) - sin(p * PI) * (26 - i * 11)];
      });
      alpha(ctx, 1 - ease(t, .62, .85), () => {
        trace(ctx, vertices, u, gradient(ctx, 65, 0, 298, 0, color + '09', color), 5 - i * .7);
        const [x, y] = vertices[Math.floor(u * 54)];
        dot(ctx, x, y, 6, color);
      });
    });
    const shot = out(t, .59, .88);
    line(ctx, [[297, 135], [297 + shot * 117, 135]], white, 5 * (1 - .72 * ease(t, .7, 1)));
    burst(ctx, 297, 135, phase(t, .61, .92), white, 17, 63);
  };

  demos['04-E1'] = (ctx, t) => {
    const u = ease(t, .17, .6);
    const contour = points(101, i => {
      const a = i * tau / 100;
      return at(240, 135, 76 + u * (sin(a * 3 - t * 7) * 13 + cos(a * 2 + t * 4) * 7), a);
    });
    alpha(ctx, u, () => polygon(ctx, contour, gradient(ctx, 177, 57, 297, 217, '#6b42cb', '#d4a8ff')));
    scoped(ctx, () => {
      ctx.clip();
      for (let j = 0; j < 3; j++) {
        const wave = points(70, i => [140 + i * 3, 111 + 23 * j + 28 * sin(i / 12 + t * 6 + j * .65)]);
        alpha(ctx, u * (.9 - j * .19), () => line(ctx, wave, white, 2.6 - j * .5));
      }
    });
    trace(ctx, contour, out(t, 0, .32), violet, 1.8);
  };

  demos['04-E2'] = (ctx, t) => {
    [sky, violet, orchid].forEach((color, j) => {
      const p = ease(t, .13 + .12 * j, .84);
      const vertices = points(130, i => {
        const s = i / 129;
        return [81 + s * 318, 78 + j * 57 + sin(s * tau * mix(2.4 + .8 * j, 3, p) + (1 - p) * j * 1.8) * (12 + 12 * sin(s * PI))];
      });
      trace(ctx, vertices, out(t, .03 + j * .13, .53 + j * .13), color, 3.4);
      alpha(ctx, p, () => dot(ctx, 240, vertices[65][1], 4, white));
    });
  };

  demos['04-E3'] = (ctx, t) => {
    const crop = ease(t, .48, .73);
    scoped(ctx, () => {
      ctx.beginPath();
      ctx.roundRect(240 - mix(203, 47, crop), 33, 2 * mix(203, 47, crop), 204, mix(44, 14, crop));
      ctx.clip();
      [violet, coral, amber].forEach((color, i) => {
        const u = ease(t, .04 + i * .09, .64);
        const x = mix(113 + i * 126, 240, u);
        const y = mix(135, 178 - i * 43 - 30 * ease(t, .72, .95), crop);
        pose(ctx, x, y, mix((i - 1) * .31, -.48, crop), 1, 1, () => rect(ctx, -71, -21, 142, 42, 21, gradient(ctx, -71, 0, 71, 0, color + '8f', color)));
      });
    });
  };

  demos['RM26-05-01'] = (ctx, t) => {
    const u = ease(t, .38, .66);
    const p = phase(t, .51, .88);
    const r = 42 - sin(p * PI) * 8;
    const drift = sin(p * tau * 4) * (1 - p) * 6;
    [136, 240, 344].forEach((x, i) => alpha(ctx, i === 1 ? 1 : 1 - u, () => orb(ctx, mix(x, 240, u) + drift, 135, i === 1 ? r : mix(29, 11, u), white, violet)));
    arc(ctx, 240 + drift, 135, 58, 58, -PI / 2, -PI / 2 + tau * out(t, .13, .43), orchid, 2);
    alpha(ctx, u * .38, () => arc(ctx, 240, 135, 67, 67, 0, tau, orchid, 1));
  };

  demos['RM26-05-02'] = (ctx, t) => {
    const mode = Math.min(2, Math.floor(t * 3));
    if (mode === 0) {
      for (let i = 0; i < 5; i++) pose(ctx, 240, 135, t * 2 + i * PI / 5, 1, 1, () => arc(ctx, 0, 0, 111, 33, 0, tau, violet, 1.6));
    } else if (mode === 1) {
      for (let i = 0; i < 7; i++) line(ctx, points(60, j => [102 + j * 4.7, 72 + i * 20 + 14 * sin(j * .19 + t * 8 + i)]), coral, 1.8);
    } else {
      for (let i = 0; i < 28; i++) {
        const a = i * tau / 28 + t * .6;
        line(ctx, [at(240, 135, 52, a), at(240, 135, 84 + 20 * sin(i * 2.1 + t * 5), a)], teal, 2);
      }
    }
    dot(ctx, 240, 135, 41, ink);
    arc(ctx, 240, 135, 42, 42, 0, tau, white, 4);
  };

  demos['RM26-05-03'] = (ctx, t) => {
    const u = ease(t, .3, .57);
    const wave = points(120, i => {
      const s = i / 119;
      return [240 + (s - .5) * mix(275, 94, u), 135 + sin(s * tau * 6 - t * 14) * sin(s * PI) * mix(46, 0, u)];
    });
    alpha(ctx, 1 - u, () => trace(ctx, wave, out(t, .0, .28), violet, 3));
    ['VAI', 'COM', 'TUDO'].forEach((word, i) => {
      const p = out(t, .41 + i * .145, .56 + i * .145);
      const active = phase(t, .55 + i * .145, .58 + i * .145);
      alpha(ctx, p, () => type(ctx, word, [131, 230, 342][i], 135 + (1 - p) * 22, i === 2 ? 49 : 45, active < 1 || i === 2 ? teal : white, 900));
    });
    alpha(ctx, u, () => {
      line(ctx, [[62, 135], [77, 135]], violet, 3);
      line(ctx, [[406, 135], [421, 135]], violet, 3);
    });
  };

  demos['RM26-05-04'] = (ctx, t) => {
    const u = ease(t, .33, .81);
    orb(ctx, 240, mix(95, 135, u), mix(33, 48, u), white, violet);
    const vertices = points(100, i => {
      const s = i / 99;
      const a = -PI + s * tau * .93;
      return [mix(81 + s * 318, 240 + 94 * cos(a), u), mix(185 + 18 * sin(s * tau * 8 + t * 9) * sin(s * PI), 135 + 42 * sin(a), u)];
    });
    trace(ctx, vertices, out(t, .02, .38), sky, 2.7);
    const [x, y] = vertices[Math.min(99, Math.floor(100 * phase(t, .16, .91)))];
    dot(ctx, x, y, 6, white);
  };

  demos['05-G'] = (ctx, t) => {
    const u = ease(t, .07, .85);
    const vertices = points(101, i => {
      const s = i / 100;
      return [79 + 321 * s, 194 - 31 * ease(s, .04, .28) - 35 * ease(s, .34, .65) - 62 * ease(s, .70, .98)];
    });
    const active = vertices.slice(0, 1 + Math.floor(100 * u));
    const [x, y] = active[active.length - 1];
    polygon(ctx, [[79, 206], ...active, [x, 206]], gradient(ctx, 0, 64, 0, 206, teal + 'ae', teal + '04'));
    line(ctx, [[75, 206], [405, 206]], white + '49', 1);
    trace(ctx, vertices, u, teal, 3.8);
    dot(ctx, x, y, 6, white);
  };

  demos['05-E1'] = (ctx, t) => {
    const u = out(t, .06, .64);
    const r = 81;
    arc(ctx, 240, 130, r, r, -PI * .97, -PI * .97 + PI * 1.94 * u, amber, 3);
    type(ctx, '+' + Math.round(35 * u) + '%', 240, 127, 62, white, 850);
    line(ctx, [[143, 213], [337, 213]], amber + '7a', 1.2);
    [.44, .58, .68, .75].forEach((start, i) => {
      const p = phase(t, start, start + .19);
      if (p > 0 && p < 1) alpha(ctx, sin(p * PI), () => dot(ctx, 143 + p * 194, 213, 3 + i * .4, teal));
    });
  };

  demos['05-E2'] = (ctx, t) => {
    const end = points(90, i => [224 + i * 2, 180 - 126 * (i / 89) ** 1.74]);
    [violet, sky, teal].forEach((color, j) => {
      const u = ease(t, .06 + j * .11, .63 + j * .08);
      const vertices = points(60, i => {
        const p = i / 59;
        return [74 + p * 150, mix(72 + j * 61, 180, p) + sin(p * PI) * (28 - j * 26)];
      });
      trace(ctx, vertices, u, gradient(ctx, 74, 0, 224, 0, color + '25', color), 4.5 - j * .7);
    });
    trace(ctx, end, out(t, .53, .92), white, 4);
  };

  demos['05-E3'] = (ctx, t) => {
    const heights = [48, 86, 66, 116, 143];
    heights.forEach((h, i) => {
      const x = 123 + i * 58;
      const u = ease(t, .29 + i * .045, .74 + i * .04);
      for (let j = 0; j < 15; j++) {
        const k = i * 23 + j;
        const p = out(t, .02 + rand(k + 77) * .22, .48 + i * .038);
        alpha(ctx, (1 - u) * (.4 + rand(k + 76) * .6), () => dot(ctx, mix(71 + rand(k) * 338, x + rand(k + 1) * 24, p), mix(53 + rand(k + 3) * 154, 206 - rand(k + 7) * h, p), 1.5 + rand(k + 8) * 2.6, amber));
      }
      rect(ctx, x, 206 - h * u, 26, h * u, 4, gradient(ctx, 0, 206 - h * u, 0, 206, amber, coral + '7f'));
      alpha(ctx, u, () => line(ctx, [[x + 4, 207 - h * u], [x + 22, 207 - h * u]], white, 2));
    });
  };

  demos['05-E4'] = (ctx, t) => {
    const heights = [45, 65, 57, 88, 105, 95, 138];
    const curve = points(121, i => {
      const s = i / 120 * 6;
      const j = Math.min(5, Math.floor(s));
      return [90 + s * 50, 206 - mix(heights[j], heights[j + 1], ease(s, j, j + 1))];
    });
    const merge = ease(t, .44, .83);
    heights.forEach((h, i) => {
      const u = out(t, .04 + i * .047, .46 + i * .04);
      const x = 90 + i * 50;
      const y = 206 - h * u;
      alpha(ctx, u, () => {
        rect(ctx, x - 11 * (1 - merge), y, 22 * (1 - merge), h * u * (1 - merge), 4, gradient(ctx, x, y, x, 206, sky, violet + '55'));
        dot(ctx, x, y, mix(2.2, 5, merge), teal);
      });
    });
    trace(ctx, curve, ease(t, .52, .91), teal, 3.4);
  };

  demos['RM26-06-01'] = (ctx, t) => {
    const u = ease(t, .24, .79);
    for (let i = 0; i < 24; i++) {
      const x = mix(95 + 290 * rand(i), 240, u);
      const y = mix(64 + 141 * rand(i + 28), 105 + i % 3 * 29, u);
      const angle = (rand(i + 56) - .5) * 2.6 * (1 - u);
      const l = mix(18 + rand(i + 31) * 75, 63 - (i % 3) * 12, u);
      const remaining = i > 2 ? 1 - u : 1;
      alpha(ctx, remaining * (i > 2 ? .45 + rand(i + 38) * .45 : 1), () => line(ctx, [at(x, y, l, angle + PI), at(x, y, l, angle)], i % 2 ? coral : white, i > 2 ? 1.5 : 5));
    }
  };

  demos['RM26-06-02'] = (ctx, t) => {
    [sky, violet].forEach((color, i) => {
      const vertices = points(56, j => {
        const s = j / 55;
        return [240 + (i === 0 ? -1 : 1) * 162 * (1 - s), 67 + 62 * s ** 1.9];
      });
      line(ctx, vertices, color + '66', 2);
      for (let j = 0; j < 3; j++) {
        const u = phase(t, .03 + i * .057 + j * .11, .44 + j * .13);
        if (u > 0 && u < 1) dot(ctx, ...vertices[Math.floor(u * 55)], 5, color);
      }
    });
    line(ctx, [[240, 135], [240, 222]], teal + '6b', 2);
    const radius = 11 + 15 * out(t, .25, .56) + sin(phase(t, .44, .77) * tau * 3) ** 2 * 4;
    orb(ctx, 240, 131, radius, white, teal);
    for (let j = 0; j < 3; j++) {
      const u = phase(t, .48 + j * .105, .73 + j * .105);
      alpha(ctx, sin(PI * u), () => dot(ctx, 240, 143 + u * 78, 4, white));
    }
  };

  demos['RM26-06-03'] = (ctx, t) => {
    const u = ease(t, .31, .85);
    const a = -PI * .83;
    arc(ctx, 240, 151, 96, 96, a, a + PI * mix(1.54, .77, u), sky, mix(12, 3, u));
    arc(ctx, 240, 151, 70, 70, a, a + PI * mix(.46, 1.62, u), teal, mix(3, 12, u));
    for (let j = 0; j < 3; j++) {
      const p = phase(t, .28 + j * .13, .53 + j * .13);
      alpha(ctx, sin(p * PI), () => dot(ctx, ...at(240, 151, mix(96, 70, p), a + .54 + j * .44), 4.5, white));
    }
  };

  demos['RM26-06-04'] = (ctx, t) => {
    [coral, teal].forEach((color, i) => {
      const x = 147 + i * 185;
      const u = ease(t, .08, .87 - i * .14);
      arc(ctx, x, 91, 39, 39, 0, tau, color, 1.6);
      for (let j = 0; j < 12; j++) line(ctx, [at(x, 91, 33, j * tau / 12), at(x, 91, 37, j * tau / 12)], color, 1);
      line(ctx, [[x, 91], at(x, 91, 29, -PI / 2 + (i ? 1 : 3) * PI / 3 * u)], white, 3.7);
      const curve = points(75, j => {
        const s = j / 74;
        return [x - 69 + s * 138, 187 + (i ? -1 : 1) * (s - .5) * 52 + sin(s * tau) * 8];
      });
      trace(ctx, curve, u, color, 3.3);
    });
  };


  demos['06-G'] = (ctx, t) => {
    for (let i = 0; i < 12; i++) {
      const index = Math.floor(i / 4);
      const u = ease(t, .11 + index * .1, .65 + index * .085);
      const a = mix(i * tau / 12 + .74 * t, -PI / 2 + index * tau / 3, u);
      const r = mix(95 + (i % 2) * 14, 51, u);
      const [x, y] = at(240, 136, r, a);
      const s = mix(1, .62, u);
      alpha(ctx, 1 - u, () => pose(ctx, x, y, a + PI / 4, s, s, () => rect(ctx, -10, -10, 20, 20, 3, i % 2 ? violet : sky)));
    }
    for (let i = 0; i < 3; i++) {
      const a = -PI / 2 + i * tau / 3;
      const v = out(t, .47 + i * .06, .81 + i * .035);
      alpha(ctx, v, () => polygon(ctx, [[240, 136], at(240, 136, 62 * v, a), at(240, 136, 62 * v, a + tau / 3)], [violet, sky, '#6787ee'][i]));
    }
    trace(ctx, points(4, i => at(240, 136, 62, -PI / 2 + i * tau / 3)), ease(t, .76, .95), white, 1.6);
  };

  demos['06-E1'] = (ctx, t) => {
    const u = ease(t, .09, .79);
    const x = mix(112, 370, u);
    const y = mix(175, 94, u);
    const pivot = ease(t, .29, .68);
    line(ctx, [[93, 181], [389, 88]], sky + '7c', 1.4);
    dot(ctx, 370, 94, 5 + out(t, .64, .84) * 6, teal);
    pose(ctx, x, y, u * tau * .65, 1 - .43 * sin(pivot * PI), 1, () => {
      const vertices = points(24, i => {
        const a = i * tau / 24 + PI / 4;
        const r1 = 39 / Math.max(abs(cos(a)), abs(sin(a)));
        const r2 = 42 / cos((a + PI / 6) % (PI / 3) - PI / 6);
        return at(0, 0, mix(r1, r2, pivot), a);
      });
      polygon(ctx, vertices, gradient(ctx, -45, -35, 40, 45, white, pivot > .45 ? teal : sky));
      line(ctx, [[-23, -16], [21, 17]], ink, 1.6);
    });
  };

  demos['06-E2'] = (ctx, t) => {
    for (let i = 0; i < 3; i++) {
      const x = 144 + i * 96;
      for (let j = 0; j < 4; j++) {
        const u = ease(t, .07 + i * .08 + j * .043, .6 + i * .09 + j * .025);
        const a = -1.13 + j * .74;
        const xx = x + cos(a) * (j - 1.6) * 37 * (1 - u);
        const yy = mix(69 + j * 36, 156 - j * 7, u) - 23 * sin(u * PI);
        const ry = mix(8 + j * 2, 13, u) - 3 * sin(phase(u, .78, 1) * PI);
        ctx.beginPath();
        ctx.ellipse(xx, yy, mix(21, 34, u), ry, (1 - u) * a * .24, 0, tau);
        ctx.fillStyle = gradient(ctx, xx, yy - 9, xx, yy + 11, amber, '#a95327');
        ctx.fill();
        arc(ctx, xx, yy - 1, mix(19, 30, u), ry * .83, PI, tau, white + 'a3', 1);
      }
    }
  };

  function impact(ctx, x, y, angle, t, color) {
    if (t <= 0 || t >= 1) return;
    pose(ctx, x, y, angle, 1, 1, () => {
      alpha(ctx, 1 - t, () => {
        const r = 5 + out(t, 0, 1) * 32;
        arc(ctx, 0, 0, r * .49, r, -PI * .92, PI * .92, color, 2);
        for (let i = 0; i < 7; i++) {
          const a = -1.4 + i * .47;
          line(ctx, [at(0, 0, r, a), at(0, 0, r + 9 * (1 - t), a)], color, 1.8);
        }
      });
    });
  }

  demos['07-G'] = (ctx, t) => {
    const u = out(t, .01, .26);
    orb(ctx, 240, 135, 38 * u, white, sky);
    for (let j = 0; j < 3; j++) {
      const angle = j * PI / 3 + t * .7;
      pose(ctx, 240, 135, angle, 1, 1, () => arc(ctx, 0, 0, (98 + j * 6) * u, (57 + j * 5) * u, 0, tau, [sky, sky + '8f', sky + '64'][j], j === 0 ? 2.8 : 1.3));
    }
    arc(ctx, 240, 135, 107 * u, 107 * u, 0, tau, sky + '36', 1);
    [-.16, 2.86, .43].forEach((a, i) => {
      const p = phase(t, .16 + .17 * i, .61 + .17 * i);
      const dist = 107 + 112 * abs(p * 2 - 1) ** 1.3;
      const [x, y] = at(240, 135, dist, a);
      alpha(ctx, sin(p * PI) ** .4, () => line(ctx, [[x, y], at(x, y, 25, a)], coral, 4.2));
      impact(ctx, ...at(240, 135, 107, a), a, phase(p, .5, .96), white);
    });
  };


  demos['RM26-07-01'] = (ctx, t) => {
    for (let i = 0; i < 3; i++) {
      const u = out(t, .02 + i * .10, .55 + i * .08);
      const a = i * tau / 3 - PI / 2 + (1 - u) * (i % 2 ? -2.5 : 2.5);
      const radius = mix(112, 73, u);
      const vertices = [...points(34, j => at(240, 135, radius + 11, a + .045 + j * (tau / 3 - .09) / 33)), ...points(34, j => at(240, 135, radius - 10, a + tau / 3 - .045 - j * (tau / 3 - .09) / 33))];
      alpha(ctx, u, () => polygon(ctx, vertices, gradient(ctx, 150, 59, 324, 214, violet, sky)));
    }
    check(ctx, 240, 135, 94, ease(t, .55, .81), teal);
  };

  demos['RM26-07-02'] = (ctx, t) => {
    const corners = [[240, 47], [353, 201], [127, 201]];
    for (let i = 0; i < 3; i++) {
      const a = corners[i];
      const b = corners[(i + 1) % 3];
      const u = ease(t, .08 + i * .13, .42 + i * .13);
      const start = [mix(a[0], b[0], .085), mix(a[1], b[1], .085)];
      const end = [mix(a[0], b[0], .88), mix(a[1], b[1], .88)];
      trace(ctx, [start, end], u, amber, 2.7);
      const angle = Math.atan2(end[1] - start[1], end[0] - start[0]);
      alpha(ctx, u, () => pose(ctx, mix(start[0], end[0], u), mix(start[1], end[1], u), angle, u, u, () => polygon(ctx, [[5, 0], [-9, -5], [-7, 0], [-9, 5]], amber)));
      orb(ctx, ...a, 13 * out(t, i * .12, .27 + i * .12), white, amber);
    }
    const u = phase(t, .61, .98) * 3;
    const index = Math.floor(u) % 3;
    const a = corners[index];
    const b = corners[(index + 1) % 3];
    alpha(ctx, sin(phase(t, .61, .98) * PI), () => dot(ctx, mix(a[0], b[0], u % 1), mix(a[1], b[1], u % 1), 5.5, white));
  };

  demos['07-E1'] = (ctx, t) => {
    const starts = [.04, .28, .52];
    const hits = starts.map(start => phase(t, start, start + .36));
    const membrane = points(90, j => {
      const y = 43 + j * 2.1;
      const bend = hits.reduce((sum, p, i) => sum + (i === 1 ? -1 : 1) * 20 * Math.exp(-((p - .54) ** 2) / .009) * Math.exp(-((y - (91 + 42 * i)) ** 2) / 590), 0);
      return [240 + bend, y];
    });
    for (let j = -3; j <= 3; j++) {
      if (!j) continue;
      const fringe = membrane.map(([x, y]) => [
        x + j * (6 + 9 * sin(PI * (y - 43) / 187)),
        y
      ]);
      alpha(ctx, .18 / abs(j), () => line(ctx, fringe, teal, 1.4));
    }
    line(ctx, membrane, gradient(ctx, 0, 43, 0, 230, teal + '36', teal), 4);
    hits.forEach((p, i) => {
      const side = i === 1 ? 1 : -1;
      const x = 240 + side * (155 * abs(1 - p * 2) ** 1.35 + 5);
      const y = 91 + i * 42;
      alpha(ctx, sin(p * PI), () => line(ctx, [[x, y], [x + side * 38, y]], gradient(ctx, x, y, x + side * 38, y, white, coral + '13'), 6));
      impact(ctx, 240, y, side === -1 ? PI : 0, phase(p, .48, .97), teal);
    });
  };

  demos['07-E2'] = (ctx, t) => {
    const u = ease(t, .06, .9);
    const x = mix(176, 287, u);
    const y = 137 + 15 * sin(u * PI);
    const p = ease(t, .12, .93);
    const vertices = points(100, i => {
      const a = -PI * .85 + i * tau / 99;
      return [x + 104 * cos(a) + 29 * sin(a), y + 49 * sin(a) - 29 * cos(a)];
    });
    const split = 45 / 99;
    trace(ctx, vertices, Math.min(split, p), violet + '8a', 2.2);
    orb(ctx, x, y, 48, white, violet);
    if (p > split) trace(ctx, vertices.slice(45), phase(p, split, 1), sky, 2.8);
    const head = vertices[Math.floor(p * 99)];
    dot(ctx, ...head, 5, white);
  };

  demos['RM26-08-01'] = (ctx, t) => {
    const u = out(t, .42, .82);
    pose(ctx, 240, 135, -.49, 1, 1, () => {
      const ramp = gradient(ctx, -84, -80, 78, 78, white, '#777296');
      [-1, 1].forEach(side => scoped(ctx, () => {
        ctx.translate(side * 27 * u, side * 9 * u);
        ctx.rotate(side * u * .19);
        ctx.beginPath();
        ctx.rect(side === -1 ? -92 : 0, -92, 92, 184);
        ctx.clip();
        dot(ctx, 0, 0, 81, ramp);
        for (let i = -7; i <= 7; i++) alpha(ctx, .34, () => line(ctx, [[-86, i * 12], [86, i * 12 + 23]], ink, 1));
      }));
      if (t >= .28) alpha(ctx, 1 - u * .45, () => line(ctx, [[0, -107], [0, 107]], coral, mix(4.8, 1.2, u)));
      burst(ctx, 0, 0, phase(t, .42, .95), coral, 17, 121);
    });
  };

  demos['RM26-08-02'] = (ctx, t) => {
    for (let i = 0; i < 3; i++) {
      const u = ease(t, .10 + i * .14, .56 + i * .14);
      const x = 160 + 80 * i;
      const sx = Math.max(.035, abs(cos(u * PI)));
      pose(ctx, x, 154, (1 - u) * (i - 1) * .14, sx, 1, () => {
        rect(ctx, -31, -52, 62, 104, 8, gradient(ctx, -31, -52, 31, 52, u < .5 ? coral : teal, u < .5 ? '#792b48' : '#086b75'));
        line(ctx, [[-19, -38], [-19, 38]], white + '9c', 1.3);
      });
    }
    arc(ctx, 240, 104, 116, 64, PI, PI + PI * ease(t, .57, .93), amber, 2.8);
  };

  demos['RM26-08-03'] = (ctx, t) => {
    const u = ease(t, .13, .68);
    for (let i = 0; i < 21; i++) {
      const a = i * tau / 21 + .8 * u;
      const r = mix(76 + 74 * rand(i + 8), 35, u);
      const [x, y] = at(240, 132, r, a);
      alpha(ctx, 1 - u, () => dot(ctx, x, mix(y, 132 + (y - 132) * .6, .45), 2.5 + 3 * rand(i), i % 2 ? sky : violet));
    }
    const form = out(t, .35, .77);
    alpha(ctx, form, () => pose(ctx, 240, 131, 0, form, form, () => {
      polygon(ctx, [[0, -81], [67, -53], [58, 29], [0, 83], [-58, 29], [-67, -53]], gradient(ctx, -50, -65, 65, 63, sky, '#4c49a7'));
      polygon(ctx, [[0, -81], [67, -53], [58, 29], [0, 83]], '#7581f5');
      line(ctx, [[-67, -53], [0, -81], [67, -53]], white + '88', 2);
    }));
    check(ctx, 240, 128, 96, ease(t, .61, .89), white);
  };

  demos['08-G'] = (ctx, t) => {
    const gather = ease(t, .09, .53);
    const release = ease(t, .54, .86);
    for (let i = 0; i < 4; i++) {
      const side = i < 2 ? -1 : 1;
      const half = i % 2 === 0 ? -1 : 1;
      const x = 240 + side * (104 * (1 - gather) + 62 * release);
      const y = 135 + half * 68 * (1 - gather);
      const a = (1 - gather) * (side * half * .52) + sin(gather * PI) * half * .45;
      pose(ctx, x, y, a, 1, mix(1, .29, gather) + .71 * release, () => {
        polygon(ctx, [[-54, 0], [54, 0], [0, half * 66]], gradient(ctx, -54, 0, 54, half * 66, half < 0 ? coral : amber, '#9d3e69'));
        for (let j = 1; j <= 4; j++) line(ctx, [[-54 + j * 9, 0], [0, half * (66 - j * 8)]], white + '75', .9);
      });
    }
  };

  demos['08-E1'] = (ctx, t) => {
    const angle = PI * ease(t, .12, .82);
    const x = 240;
    const spread = 110 * cos(angle);
    const curve = 38 * sin(angle);
    rect(ctx, 136, 58, 104, 154, 6, '#554b92');
    rect(ctx, 240, 58, 104, 154, 6, '#b3a0f2');
    ctx.beginPath();
    ctx.moveTo(x, 58);
    ctx.bezierCurveTo(x + spread * .38, 55 - curve, x + spread * .7, 63 - curve, x + spread, 55);
    ctx.lineTo(x + spread, 204);
    ctx.bezierCurveTo(x + spread * .7, 217 - curve, x + spread * .38, 217 - curve, x, 212);
    ctx.closePath();
    ctx.fillStyle = gradient(ctx, x, 0, x + (abs(spread) < .001 ? .001 : spread), 0, angle < PI / 2 ? violet : '#a49ed3', white);
    ctx.fill();
    line(ctx, [[240, 58], [240, 212]], white + 'a4', 1.7);
    alpha(ctx, sin(angle), () => line(ctx, [[x + spread, 57], [x + spread, 202]], white, 1.9));
  };

  demos['08-E2'] = (ctx, t) => {
    [sky, violet, teal].forEach((color, i) => {
      const u = out(t, .04 + i * .12, .59 + i * .1);
      const x = 240 + (i - 1) * 101;
      const y = mix([69, 201, 89][i], 136, u);
      pose(ctx, x, y, (1 - u) * (i % 2 ? .9 : -.75), 1, 1, () => {
        polygon(ctx, [[0, -49], [39, -27], [39, 27], [0, 49], [-39, 27], [-39, -27]], gradient(ctx, -39, -49, 39, 49, color, color + '2f'));
        polygon(ctx, [[0, -49], [39, -27], [0, -7], [-39, -27]], color);
        trace(ctx, [[-39, -27], [0, -7], [39, -27]], ease(t, .49 + i * .10, .72 + i * .10), white, 1.6);
      });
    });
  };

  demos['08-E3'] = (ctx, t) => {
    const values = [24, 48, 39, 57, 72];
    line(ctx, [[77, 212], [403, 212]], white + '6e', 1.2);
    values.forEach((n, i) => {
      const x = 112 + i * 64;
      const u = ease(t, .27 + i * .054, .71 + i * .04);
      for (let j = 0; j < 3; j++) {
        const p = out(t, .03 + j * .07 + i * .04, .23 + j * .06 + i * .04);
        alpha(ctx, p * (1 - u), () => type(ctx, (n + j * 3) % 10, x, mix(79 + j * 44, 202, u), 27, amber, 650, 'monospace'));
      }
      const h = u * n * 1.75;
      rect(ctx, x - 14, 212 - h, 28, h, 4, gradient(ctx, x, 212 - h, x, 212, teal, teal + '37'));
      alpha(ctx, u, () => type(ctx, n, x, 194 - h, 17, white, 700, 'monospace'));
    });
  };

  demos['08-E4'] = (ctx, t) => {
    [violet, orchid, white].forEach((color, i) => {
      const u = out(t, i * .08, .62 + i * .06);
      pose(ctx, 240, 209, (i - 1) * 1.05 * u, 1, 1, () => {
        polygon(ctx, [[-16, 0], [-35, -119], [-22, -152], [23, -158], [36, -133], [15, 0]], gradient(ctx, 0, 0, 0, -156, '#7557a8', color));
        for (let j = -1; j < 2; j++) trace(ctx, [[j * 5, -19], [j * 15, -86], [j * 16, -131]], ease(t, .28 + i * .09 + (j + 1) * .055, .76 + i * .07), i === 2 ? ink + '70' : white + 'b3', 1.3);
      });
    });
    dot(ctx, 240, 208, 6.5, amber);
  };

  demos['08-E5'] = (ctx, t) => {
    const u = ease(t, .05, .45);
    for (let i = 0; i < 60; i++) alpha(ctx, 1 - u, () => dot(ctx, mix(98 + 284 * rand(i), 240, u), mix(46 + 173 * rand(i + 60), 135, u), 1.4 + rand(i + 32) * 2.6, i % 2 ? coral : amber));
    [46, 68, 89, 73, 108].forEach((h, i) => {
      const p = out(t, .35 + i * .055, .68 + i * .06);
      rect(ctx, 82 + i * 25, 197 - h * p, 13, h * p, 3, gradient(ctx, 0, 84, 0, 197, amber, coral + '8f'));
    });
    const curve = points(65, i => [261 + i * 2.1, 187 - i * 1.62 + 12 * sin(i * .15)]);
    const p = ease(t, .54, .91);
    trace(ctx, curve, p, white, 3.5);
    alpha(ctx, p, () => dot(ctx, ...curve[Math.floor(64 * p)], 4.6, amber));
  };


  demos['RM26-09-01'] = (ctx, t) => {
    for (let i = 0; i < 4; i++) {
      const x = 105 + i * 90;
      const u = ease(t, .11 + i * .055, .57 + i * .05);
      const vertices = points(66, j => {
        const s = j / 65;
        return [mix(240, x, ease(s, .10, .8)), 66 + s * 105];
      });
      trace(ctx, vertices, u, gradient(ctx, 240, 66, x, 171, teal, sky), 1.8);
      const b = out(t, .46 + i * .072, .75 + i * .05);
      pose(ctx, x, 177, PI / 4, b, b, () => rect(ctx, -14, -14, 28, 28, 4, sky));
      const snap = out(t, .60 + i * .06, .83 + i * .045);
      alpha(ctx, snap, () => pose(ctx, x, 177 + 29 * (1 - snap), PI / 4, 1, 1, () => rect(ctx, -6, -6, 12, 12, 2, white)));
    }
    orb(ctx, 240, 65, 24 * out(t, 0, .32), white, teal);
  };

  demos['RM26-09-02'] = (ctx, t) => {
    const u = out(t, .08, .62);
    const p = ease(t, .53, .88);
    const radius = 7 + 67 * u;
    pose(ctx, 240, 135, -.19 * (1 - u), 1, 1, () => {
      const contour = points(10, i => at(0, 0, radius, i * tau / 10 - PI / 2));
      polygon(ctx, contour, gradient(ctx, -51, -61, 48, 62, white, '#ae5329'));
      scoped(ctx, () => {
        ctx.clip();
        for (let i = 0; i < 10; i++) polygon(ctx, [[0, 0], contour[i], contour[(i + 1) % 10]], i % 2 ? '#71422161' : amber + '42');
        const x = mix(-112, 112, p);
        polygon(ctx, [[x - 21, -90], [x + 12, -90], [x - 25, 90], [x - 52, 90]], '#ffffff9a');
      });
      arc(ctx, 0, 0, radius * 1.12, radius * 1.12, -.9, -.9 + 4.4 * ease(t, .28, .75), amber, 1.3);
      arc(ctx, 0, 0, radius * 1.25, radius * 1.25, 1.2, 1.2 + 2.6 * ease(t, .44, .83), white, 1);
    });
  };

  demos['RM26-09-03'] = (ctx, t) => {
    const u = ease(t, .24, .54);
    const v = ease(t, .49, .87);
    for (let i = 0; i < 2; i++) {
      const p = out(t, .03 + i * .15, .37 + i * .17);
      rect(ctx, 118, 121 + i * 37, 104 * p, 5 + 8 * sin(p * PI), 4, amber);
      alpha(ctx, p * .5, () => line(ctx, [[118, 133 + i * 37], [118 + 104 * p, 133 + i * 37]], amber, 1));
    }
    line(ctx, [[280, 174], [385, 174]], amber + '8c', 1.5);
    alpha(ctx, u, () => pose(ctx, mix(172, 331, v), 153 - 53 * u + 64 * v, -.42 * sin(v * PI) - .14 * v, 1, mix(.12, 1, u), () => {
      polygon(ctx, [[-40, -14], [48, -14], [35, 14], [-52, 14]], gradient(ctx, -45, -10, 42, 15, white, amber));
      line(ctx, [[-32, -4], [26, -4]], ink, 1.3);
    }));
  };

  demos['09-G'] = (ctx, t) => {
    const u = ease(t, .08, .51);
    for (let i = 0; i < 21; i++) {
      const x = 102 + i * 13;
      const y = 83 + (i % 3) * 31 + sin(i * 2.1) * 17;
      alpha(ctx, 1 - u, () => dot(ctx, x, mix(y, 197, u), 2 + i % 3, [violet, white, sky][i % 3]));
    }
    const heights = [52, 80, 71, 108];
    heights.forEach((h, i) => {
      const p = out(t, .38 + .065 * i, .77 + i * .035);
      rect(ctx, 116 + i * 68, 197 - h * p, 34, h * p, 4, gradient(ctx, 0, 88, 0, 197, violet, violet + '33'));
    });
    const curve = points(96, i => [99 + i * 2.95, 145 - i * .88 + 15 * sin(i * .091)]);
    const p = out(t, .45, .92);
    trace(ctx, curve, p, sky, 3);
    alpha(ctx, p, () => dot(ctx, ...curve[Math.floor(p * 95)], 5.5, white));
  };

  demos['09-E1'] = (ctx, t) => {
    const values = [22, 36, 31, 47, 62];
    line(ctx, [[84, 215], [396, 215]], white + '69', 1);
    values.forEach((n, i) => {
      const p = out(t, .06 + i * .12, .51 + i * .1);
      const x = 119 + i * 60;
      const h = n * p * 2.04;
      rect(ctx, x - 13, 215 - h, 26, h, 3, gradient(ctx, 0, 215 - h, 0, 215, amber, amber + '32'));
      alpha(ctx, p, () => type(ctx, Math.round(n * p), x, 199 - h, i === 4 ? 22 : 17, white, 700, 'monospace'));
    });
    burst(ctx, 359, 57, phase(t, .8, .99), amber, 9, 26);
  };

  demos['09-E2'] = (ctx, t) => {
    const vertices = [[197, 184], [239, 184], [239, 153], [296, 153], [296, 116], [348, 116], [348, 71], [405, 71]];
    line(ctx, [[73, 184], [197, 184]], teal + '65', 1.4);
    let progress = 0;
    for (let i = 0; i < 3; i++) {
      const u = phase(t, .04 + i * .18, .35 + i * .18);
      const x = 75 + 122 * u;
      if (u > 0 && u < 1) {
        line(ctx, [[Math.max(73, x - 25), 184], [x, 184]], gradient(ctx, Math.max(72, x - 26), 184, x, 184, teal + '09', teal), 3.7);
        dot(ctx, x, 184, 5, teal);
      }
      progress += ease(t, .33 + .18 * i, .51 + .18 * i) / 3;
    }
    trace(ctx, vertices, clamp(progress), white, 3.8);
    alpha(ctx, ease(t, .81, .96), () => dot(ctx, 405, 71, 6, teal));
  };

  demos['09-E3'] = (ctx, t) => {
    for (let i = 0; i < 4; i++) {
      const p = ease(t, .06 + i * .09, .67 + i * .047);
      const x = mix(180 + i * 41, 105 + i * 90, p);
      const y = mix([75, 199, 62, 196][i], 135, p) + sin(PI * p) * (i % 2 ? 29 : -23);
      const active = i === 1 || i === 2;
      alpha(ctx, active ? 1 : 1 - .67 * ease(t, .6, .88), () => {
        orb(ctx, x, y, 32, white, violet);
        arc(ctx, x, y, 22, 22, -.85, 2.85, white + 'a1', 1);
      });
      if (active) arc(ctx, x, y, 43, 43, -PI / 2, -PI / 2 + tau * out(t, .57 + (i - 1) * .1, .83 + (i - 1) * .1), teal, 2.3);
    }
  };

  demos['10-G'] = (ctx, t) => {
    const u = ease(t, .06, .91);
    const yScan = 45 + 183 * u;
    const cloud = points(160, i => {
      const x = 159 + i % 16 * 10.8;
      const y = 59 + Math.floor(i / 16) * 16.5;
      return { x, y, p: ease(yScan, y - 13, y + 13) };
    }).filter(({ x, y }) => (x - 240) ** 2 + (y - 135) ** 2 < 81 ** 2);
    cloud.forEach(({ x, y, p }, i) => {
      const j = (rand(i) - .5) * 13 * (1 - p);
      if (p > .1) alpha(ctx, p * .41, () => line(ctx, [[x - 4.4, y], [x + 4.4, y]], teal, .8));
      dot(ctx, x + j, y + j * .6, mix(2.2, 2.9, p), p > .5 ? teal : coral);
    });
    alpha(ctx, sin(PI * u), () => {
      rect(ctx, 131, yScan - 13, 218, 13, 0, gradient(ctx, 0, yScan - 13, 0, yScan, teal + '00', teal + '51'));
      line(ctx, [[131, yScan], [349, yScan]], white, 1.9);
    });
  };

  demos['10-E1'] = (ctx, t) => {
    const scan = 53 + ease(t, .05, .92) * 166;
    for (let i = 0; i < 4; i++) {
      const y = 83 + i * 35;
      const u = ease(scan, y - 7, y + 19);
      const x = mix([151, 116, 176, 134][i], 117, u);
      const w = mix([139, 185, 108, 167][i], 245, u);
      line(ctx, [[x, y], [x + w, y + (i % 2 ? 10 : -13) * (1 - u)]], u > .6 ? white : orchid, 5.5);
      alpha(ctx, u, () => dot(ctx, 364, y, 5.5, teal));
    }
    alpha(ctx, 1 - ease(t, .87, .97), () => line(ctx, [[97, scan], [383, scan]], teal + 'bd', 2));
  };

  demos['10-E2'] = (ctx, t) => {
    const u = ease(t, .11, .84);
    const n = Math.round(mix(47, 99, u));
    const start = PI * .73;
    const span = PI * 1.54;
    for (let i = 0; i <= 30; i++) {
      const a = start + i * span / 30;
      line(ctx, [at(240, 137, i % 5 ? 96 : 94, a), at(240, 137, 101, a)], white + '7b', 1);
    }
    arc(ctx, 240, 137, 81, 81, start, start + span, white + '30', 8);
    const color = n < 62 ? coral : n < 79 ? amber : teal;
    arc(ctx, 240, 137, 81, 81, start, start + span * n / 100, color, 8);
    type(ctx, n, 240, 135, 74, white, 780, 'monospace');
    dot(ctx, ...at(240, 137, 81, start + span * n / 100), 5.3, color);
  };

  demos['10-E3'] = (ctx, t) => {
    const u = ease(t, .04, .63);
    const scale = out(t, .27, .73);
    for (const side of [-1, 1]) {
      const x = 240 + side * (146 - 42 * u);
      polygon(ctx, [[x, 93], [x, 162], [240, 135 + 6 * side]], gradient(ctx, x, 135, 240, 135, violet + '0a', violet + '95'));
    }
    alpha(ctx, scale, () => dot(ctx, 240, 135, 73 * scale, '#171428'));
    const shape = points(10, i => at(240, 135, (i % 2 ? 25 : 66) * scale, i * tau / 10 - PI / 2 + (1 - scale) * .5));
    polygon(ctx, shape, gradient(ctx, 200, 80, 260, 181, white, amber));
    burst(ctx, 240, 70, phase(t, .54, .88), white, 12, 35);
  };

  demos['RM26-10-01'] = (ctx, t) => {
    const u = ease(t, .33, .78);
    const word = 'NORTE';
    const y = mix(186, 110, u);
    for (let i = 0; i < word.length; i++) {
      const p = out(t, .04 + i * .045, .25 + i * .045);
      alpha(ctx, p, () => type(ctx, word[i], 125 + 57.5 * i, y + 12 * (1 - p), 65, white, 900, 'monospace'));
    }
    const p = out(t, .57, .94);
    rect(ctx, 99, y + 38, 282 * p, 4, 2, teal);
    alpha(ctx, u * .34, () => line(ctx, [[99, 197], [381, 197]], teal, 1.2));
  };

  demos['RM26-10-02'] = (ctx, t) => {
    const u = ease(t, .28, .68);
    const draw = (x, mode) => {
      if (mode === 0) {
        dot(ctx, x, 135, 66, coral);
        arc(ctx, x, 135, 49, 49, -.8, 2.65, white, 2);
      } else {
        polygon(ctx, [[x, 56], [x + 73, 121], [x, 214], [x - 73, 121]], gradient(ctx, x - 64, 85, x + 60, 200, violet, '#5c45ab'));
        line(ctx, [[x, 57], [x, 211], [x + 72, 121]], white + '80', 1.4);
      }
    };
    for (let i = 5; i > 0; i--) {
      alpha(ctx, sin(PI * u) * .25 / i, () => {
        draw(240 - u * 340 + i * 15, 0);
        draw(240 + (1 - u) * 340 + i * 15, 1);
      });
    }
    draw(240 - u * 340, 0);
    draw(240 + (1 - u) * 340, 1);
  };

  demos['RM26-10-03'] = (ctx, t) => {
    const u = ease(t, .07, .66);
    const x = mix(116, 318, u);
    const visibility = 1 - ease(t, .75, .98);
    type(ctx, 'NORTE', 240, 136, 79, white + '92', 850, 'monospace');
    alpha(ctx, visibility, () => {
      dot(ctx, x, 135, 60, '#20204b');
      scoped(ctx, () => {
        ctx.clip();
        const textX = x + 1.35 * (240 - x);
        type(ctx, 'NORTE', textX, 136, 107, sky, 850, 'monospace');
      });
      arc(ctx, x, 135, 61, 61, 0, tau, sky, 2.8);
    });
    const p = phase(t, .68, .96);
    alpha(ctx, sin(PI * p), () => arc(ctx, x, 135, 62 + p * 28, 62 + p * 28, 0, tau, white, 1.4));
  };

  demos['RM26-10-04'] = (ctx, t) => {
    const p = phase(t, .07, .81) * 7;
    const n = 8 - Math.floor(p);
    const jump = sin(PI * (p % 1));
    type(ctx, n, 240, 133 - jump * 14, 127 - jump * 7, n === 1 ? teal : coral, 850, 'monospace');
    [[158, 102], [323, 92], [315, 169]].forEach(([x, y], i) => {
      const u = out(t, .26 + i * .15, .51 + i * .15);
      const vertices = points(10, j => at(x, y, (j % 2 ? 5.5 : 14) * u, j * tau / 10 - PI / 2));
      polygon(ctx, vertices, amber);
    });
  };

  demos['RM26-10-05'] = (ctx, t) => {
    const u = ease(t, .18, .77);
    scoped(ctx, () => {
      ctx.beginPath();
      ctx.rect(71, 45, 338, 168);
      ctx.clip();
      alpha(ctx, 1 - ease(u, .52, .89), () => type(ctx, '4', 240 - u * 185, 138, 150, coral, 900, 'monospace'));
      alpha(ctx, ease(u, .1, .47), () => type(ctx, '1', 240 + (1 - u) * 185, 138, 150, teal, 900, 'monospace'));
      alpha(ctx, sin(u * PI) * .5, () => {
        for (let j = 0; j < 4; j++) line(ctx, [[126 + j * 47, 194 - j * 15], [184 + j * 48, 194 - j * 15]], white, 1.3);
      });
    });
    rect(ctx, 176, 212, 128 * out(t, .68, .91), 3, 2, teal);
  };


  demos['11-G'] = (ctx, t) => {
    const u = ease(t, .16, .58);
    const v = ease(t, .45, .89);
    [sky, violet, teal].forEach((color, i) => {
      for (let j = 0; j < 4; j++) {
        const x = 74 + j * 89;
        const y = 90 + i * 45;
        alpha(ctx, 1 - .77 * v, () => pose(ctx, mix(x + 28, 240, v), mix(y, 78 + j * 38, v), -PI / 2 * v, 1, 1, () => {
          rect(ctx, -28 + u * j * 5 * (1 - v), -3, 56 - 26 * v, 6, 3, color);
          alpha(ctx, 1 - u, () => rect(ctx, 32, -3, 17, 6, 3, coral));
        }));
      }
    });
    alpha(ctx, v, () => line(ctx, [[240, 56], [240, 207]], white, 5));
  };

  demos['11-E1'] = (ctx, t) => {
    for (let i = 0; i < 4; i++) {
      const u = ease(t, .1 + i * .085, .62 + i * .06);
      const x = mix(61 + i * 99, 115 + i * 64, u);
      const overshoot = sin(phase(t, .53 + i * .06, .81 + i * .04) * PI) * 8;
      rect(ctx, x - overshoot, 119, 63, 32, 4, gradient(ctx, x, 119, x + 49, 151, white, '#b5a3cc'));
      if (i < 3) alpha(ctx, 1 - u, () => rect(ctx, x + 70 + 10 * u, 124, 19 * (1 - u), 22, 4, coral));
      if (i > 0) alpha(ctx, sin(phase(t, .58 + i * .053, .91 + i * .025) * PI), () => line(ctx, [[x, 104], [x, 165]], sky, 2.2));
    }
  };

  demos['11-E2'] = (ctx, t) => {
    const u = ease(t, .14, .66);
    for (let j = 0; j < 3; j++) {
      const p = ease(t, .37 + j * .095, .84 + j * .04);
      const w = mix(100, 52, u);
      const x = 140 + j * 100 + (j - 1) * 9 * p;
      const y = mix(135, 123 + (j - 1) * 28, p);
      scoped(ctx, () => {
        ctx.beginPath();
        ctx.roundRect(x - w / 2, y - mix(55, 80, p), w, 2 * mix(55, 80, p), mix(0, 9, u));
        ctx.clip();
        rect(ctx, 78, 0, 328, 270, 0, gradient(ctx, 87, 48, 389, 225, violet, '#4d3ab4'));
        for (let i = 0; i < 18; i++) line(ctx, points(105, k => [75 + k * 3.25, 32 + i * 13 + 36 * sin(k * .074 + i * .25 + t * 3.9)]), (i % 4 === 0 ? white : orchid) + 'a6', i % 4 === 0 ? 2 : 1);
      });
    }
  };

  demos['11-E3'] = (ctx, t) => {
    const words = ['SINTA', 'O', 'RITMO'];
    const xs = [128, 230, 339];
    const active = Math.min(2, Math.floor(phase(t, .12, .83) * 3));
    const pulse = sin(phase(t, .12 + active * .235, .32 + active * .235) * PI);
    words.forEach((word, i) => {
      const u = out(t, .05 + i * .1, .35 + i * .1);
      alpha(ctx, u, () => type(ctx, word, xs[i], 136 + (1 - u) * 16 - (i === active ? pulse * 9 : 0), 47, i === active ? amber : white, 900));
    });
    const p = active === 0 ? 1 : ease(t, .12 + active * .235, .25 + active * .235);
    const x = active === 0 ? xs[0] : mix(xs[active - 1], xs[active], p);
    const w = active === 0 ? 56 : mix(active === 1 ? 56 : 24, active === 1 ? 24 : 65, p);
    alpha(ctx, out(t, .15, .33), () => rect(ctx, x - w, 168, w * 2, 4, 2, amber));
  };

  demos['RM26-11-01'] = (ctx, t) => {
    [amber, teal].forEach((color, i) => {
      const x = 143 + i * 194;
      const start = -PI / 2;
      const speed = [.44, 1.36][i];
      const u = ease(t, .05 + i * .08, .9);
      for (let j = 0; j < 36; j++) line(ctx, [at(x, 135, j % 3 ? 60 : 56, j * tau / 36), at(x, 135, 65, j * tau / 36)], white + (j % 3 ? '49' : 'ad'), 1);
      arc(ctx, x, 135, 72, 72, start, start + tau * Math.min(speed * u, 1), color, i ? 4 : 2.6);
      line(ctx, [[x, 135], at(x, 135, 51, start + tau * speed * u)], color, 3.5);
      dot(ctx, x, 135, 6, white);
    });
  };

  demos['RM26-11-02'] = (ctx, t) => {
    const u = ease(t, .1, .57);
    const p = ease(t, .46, .86);
    for (let i = 0; i < 18; i++) {
      const x = 105 + (i % 6) * 54;
      const y = 88 + Math.floor(i / 6) * 47;
      const w = 20 + rand(i + 63) * 22;
      alpha(ctx, 1 - (i % 4 === 0 ? ease(t, .1, .43) : p), () => rect(ctx, mix(x, 226, u) - w / 2, mix(y, 128, u), w, 8, 4, violet));
    }
    alpha(ctx, p, () => orb(ctx, 240, 135, 35 + 12 * p, white, violet));
    arc(ctx, 240, 135, 70, 70, -PI / 2, -PI / 2 + p * tau, sky, 3.5);
    const r = phase(t, .82, 1);
    alpha(ctx, sin(PI * r), () => arc(ctx, 240, 135, 71 + 29 * r, 71 + 29 * r, 0, tau, sky, 1.7));
  };

  demos['12-G'] = (ctx, t) => {
    const p = ease(t, .23, .68);
    const u = phase(t, .09, .8);
    const vertices = points(85, i => {
      const s = i / 84;
      return [127 + 225 * s, 135 + sin(s * tau * 2 - t * 9) * sin(PI * s) * 28];
    });
    alpha(ctx, sin(u * PI), () => trace(ctx, vertices, phase(t, .13, .67), gradient(ctx, 125, 0, 352, 0, sky, violet), 3.5));
    alpha(ctx, 1 - .66 * p, () => orb(ctx, 126, 135, 37 + sin(PI * phase(t, .02, .37)) * 9, white, sky));
    orb(ctx, 354, 135, mix(29, 43, p), white, violet);
    for (let j = 0; j < 2; j++) {
      const q = phase(t, .57 + j * .12, .88 + j * .105);
      alpha(ctx, sin(q * PI), () => arc(ctx, 354, 135, 42 + q * 30, 42 + q * 30, 0, tau, violet, 1.8));
    }
  };

  demos['12-E1'] = (ctx, t) => {
    const u = ease(t, .12, .62);
    const v = ease(t, .47, .85);
    const vertices = points(100, i => {
      const s = i / 99;
      return [75 + 327 * s, 135 + 36 * sin(s * tau * 8 - t * 15) * sin(PI * s) * (1 - v * s)];
    });
    alpha(ctx, 1 - .75 * v, () => trace(ctx, vertices, mix(.25, 1, u), amber, 2.3));
    for (let i = 0; i < 3; i++) {
      const p = out(t, .47 + i * .09, .73 + i * .08);
      alpha(ctx, p, () => line(ctx, [[228, 135 + i * 24 - 25 * p], [228 + (174 - i * 39) * p, 135 + i * 24 - 25 * p]], teal, 5 - i));
    }
  };

  demos['12-E2'] = (ctx, t) => {
    const u = ease(t, .15, .71);
    const vertices = points(125, i => {
      const s = i / 124;
      const unstable = 137 + sin(s * tau * 5 + t * 12) * (8 + 34 * sin(s * PI) ** 2) + sin(s * tau * 9) * 8;
      const stable = 192 - 119 * ease(s, .06, .97);
      return [81 + 319 * s, mix(unstable, stable, u)];
    });
    line(ctx, vertices, gradient(ctx, 81, 0, 400, 0, u < .55 ? coral : teal + '54', u < .32 ? coral : teal), mix(2.4, 4.1, u));
    const p = phase(t, .55, .93);
    alpha(ctx, out(t, .55, .68), () => dot(ctx, ...vertices[Math.floor(p * 124)], 5.6, white));
  };

  demos['RM26-12-01'] = (ctx, t) => {
    const u = ease(t, .07, .58);
    [-1, 1].forEach(side => {
      const vertices = points(70, i => {
        const s = i / 69;
        return [240 + side * 164 * (1 - s), 135 + side * 32 * sin(s * tau) * sin(s * PI)];
      });
      alpha(ctx, 1 - ease(t, .47, .75), () => trace(ctx, vertices, u, sky, 3.1));
    });
    arc(ctx, 240, 135, 67, 67, -PI / 2, -PI / 2 + tau * out(t, .43, .77), teal, 3.7);
    check(ctx, 240, 135, 93, ease(t, .53, .82), white);
    for (let i = 0; i < 2; i++) {
      const p = phase(t, .58 + i * .09, .91 + i * .08);
      alpha(ctx, sin(PI * p) * .63, () => arc(ctx, 240, 135, 68 + p * 38, 68 + p * 38, 0, tau, teal, 1.6));
    }
  };

  demos['RM26-12-02'] = (ctx, t) => {
    line(ctx, [[104, 104], [376, 104]], amber + '9f', 1.3);
    [92, 105, 118].forEach((h, i) => {
      const p = out(t, .08 + i * .14, .56 + i * .105);
      const x = 152 + i * 70;
      rect(ctx, x, 210 - h * p, 36, h * p, 4, gradient(ctx, 0, 91, 0, 210, i === 2 ? orchid : violet, violet + '42'));
      alpha(ctx, p, () => line(ctx, [[x + 3, 210 - h * p], [x + 33, 210 - h * p]], white, 1.7));
    });
    const u = out(t, .59, .78);
    alpha(ctx, u, () => type(ctx, '100%', 240, mix(78, 55, u), 44, white, 900));
    burst(ctx, 121, 95, phase(t, .58, .96), amber, 14, 56);
    burst(ctx, 352, 100, phase(t, .65, 1), orchid, 17, 56);
  };
})();

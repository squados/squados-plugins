// color.mjs
import { makeFinding, SEVERITY } from '../contract.mjs'

function luminance({ r, g, b }) {
  const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4) }
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

/** Razão de contraste WCAG entre duas cores opacas. */
export function contrastRatio(fg, bg) {
  const l1 = luminance(fg), l2 = luminance(bg)
  const [hi, lo] = l1 >= l2 ? [l1, l2] : [l2, l1]
  return (hi + 0.05) / (lo + 0.05)
}

function isLargeText(s) {
  return s.fontSize >= 24 || (s.fontSize >= 18.66 /* ~14pt bold */ && /bold|[6-9]00/.test(String(s.fontFamily)))
}

/** Compõe uma cor semi-transparente (fg) sobre um fundo opaco (bg) — alpha compositing. */
function composite(fg, bg) {
  const a = fg.a
  return { r: fg.r * a + bg.r * (1 - a), g: fg.g * a + bg.g * (1 - a), b: fg.b * a + bg.b * (1 - a), a: 1 }
}

/** @param {import('../contract.mjs').DetectorInput} input @returns {import('../contract.mjs').Finding[]} */
export function colorChecks(input) {
  const out = []
  for (const el of input.elements) {
    if (el.role !== 'text' || el.textLength === 0) continue
    const s = el.styles
    // Texto VISUALMENTE oculto (`sr-only`: 1x1px + clip-path inset(50%)) existe
    // só para o leitor de tela — o piso de contraste do WCAG é sobre o que o
    // OLHO lê, e não há olho aqui. Medi-lo dava um P0 que nenhuma mudança de
    // design conserta: o span herda a cor do botão que o contém, então o único
    // "fix" seria escurecer um texto que ninguém vê. Um texto de verdade nunca
    // cabe em 1px; o rect degenerado é o discriminador. (Confirmado 15/09/2026
    // no botão de fechar do StandardDialog do SquadOS: span 1x1 em (967,73),
    // `clip-path: inset(50%)`, 3.64:1 herdado de `--text-3`.)
    if (el.rect.width <= 1 || el.rect.height <= 1) continue
    // fundo desconhecido (gradiente/background-image): não dá pra medir contraste confiável — pula.
    if (el.bgUnknown) continue
    // O fundo efetivo já é resolvido opaco no measurement. Texto semi-transparente
    // (ex.: cinza muted rgba(...,.6)) é composto sobre o fundo antes de medir.
    const fg = s.color.a < 1 ? composite(s.color, s.backgroundColor) : s.color
    const ratio = contrastRatio(fg, s.backgroundColor)
    const min = isLargeText(s) ? 3 : 4.5
    if (ratio < min) {
      out.push(makeFinding({ rule: 'low-contrast', severity: SEVERITY.P0, elementId: el.id,
        measured: `${ratio.toFixed(2)}:1`, expected: `>=${min}:1`, message: 'contraste de texto abaixo do mínimo WCAG' }))
    }
  }
  return out
}

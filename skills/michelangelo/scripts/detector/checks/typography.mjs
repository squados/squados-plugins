import { makeFinding, SEVERITY } from '../contract.mjs'

/** @param {import('../contract.mjs').DetectorInput} input @returns {import('../contract.mjs').Finding[]} */
export function typographyChecks(input) {
  const out = []
  for (const el of input.elements) {
    if (el.role !== 'text' || el.textLength === 0) continue
    const s = el.styles

    if (s.fontSize < 12) {
      out.push(makeFinding({ rule: 'tiny-text', severity: SEVERITY.P1, elementId: el.id,
        measured: `${s.fontSize}px`, expected: '>=12px', message: 'texto pequeno demais' }))
    }
    const ratio = s.lineHeight / s.fontSize
    if (ratio < 1.3) {
      out.push(makeFinding({ rule: 'tight-leading', severity: SEVERITY.P2, elementId: el.id,
        measured: ratio.toFixed(2), expected: '>=1.3', message: 'entrelinha apertada' }))
    }
    const emTrack = s.letterSpacing / s.fontSize
    if (emTrack > 0.05) {
      out.push(makeFinding({ rule: 'wide-tracking', severity: SEVERITY.P3, elementId: el.id,
        measured: `${emTrack.toFixed(3)}em`, expected: '<=0.05em', message: 'tracking largo demais' }))
    }
    // line-length: estimativa de caracteres por linha = largura / (fontSize * 0.5)
    const approxChars = el.rect.width / (s.fontSize * 0.5)
    if (el.textLength > 40 && approxChars > 80) {
      out.push(makeFinding({ rule: 'line-length', severity: SEVERITY.P2, elementId: el.id,
        measured: `~${approxChars.toFixed(0)}ch`, expected: '<=75ch', message: 'linha longa demais para leitura' }))
    }
  }
  return out
}

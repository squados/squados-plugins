import { makeFinding, SEVERITY } from '../contract.mjs'

/** @param {import('../contract.mjs').DetectorInput} input @returns {import('../contract.mjs').Finding[]} */
export function structureChecks(input) {
  const out = []
  const vw = input.viewport.width

  for (const el of input.elements) {
    // horizontal-overflow: elemento estende além da viewport.
    // Pula quando um ancestral faz clipping/scroll horizontal (scroller/carrossel
    // intencional não é overflow da página).
    if (el.rect.right > vw + 1 && !el.clippedByAncestorX) {
      out.push(makeFinding({ rule: 'horizontal-overflow', severity: SEVERITY.P0, elementId: el.id,
        measured: `${el.rect.right.toFixed(0)}px`, expected: `<=${vw}px`, message: 'elemento causa overflow horizontal' }))
    }
    // touch-target-small: interativo menor que 44x44.
    if (el.role === 'interactive' && (el.rect.width < 44 || el.rect.height < 44)) {
      out.push(makeFinding({ rule: 'touch-target-small', severity: SEVERITY.P2, elementId: el.id,
        measured: `${el.rect.width.toFixed(0)}x${el.rect.height.toFixed(0)}`, expected: '>=44x44', message: 'alvo de toque pequeno' }))
    }
    // interactive-no-transition: interativo sem transição declarada.
    if (el.role === 'interactive' && (!el.styles.transition || el.styles.transition === 'none' || el.styles.transition === 'all 0s ease 0s')) {
      out.push(makeFinding({ rule: 'interactive-no-transition', severity: SEVERITY.P3, elementId: el.id,
        measured: el.styles.transition || 'none', expected: 'transição em hover/estado', message: 'elemento interativo sem transição' }))
    }
  }

  // weak-hierarchy: razão do maior título para o corpo mediano.
  const texts = input.elements.filter(e => e.role === 'text' && e.textLength > 0)
  const headings = texts.filter(e => /^h[1-3]$/.test(e.tag))
  const body = texts.filter(e => !/^h[1-6]$/.test(e.tag))
  if (headings.length && body.length) {
    const maxHead = Math.max(...headings.map(e => e.styles.fontSize))
    const medBody = body.map(e => e.styles.fontSize).sort((a, b) => a - b)[Math.floor(body.length / 2)]
    if (maxHead / medBody < 2) {
      out.push(makeFinding({ rule: 'weak-hierarchy', severity: SEVERITY.P2, elementId: 'document',
        measured: `${(maxHead / medBody).toFixed(2)}x`, expected: '>=2x (ideal >=3x)', message: 'hierarquia tipográfica fraca' }))
    }
  }
  return out
}

import { makeFinding, SEVERITY } from '../contract.mjs'

/** @param {import('../contract.mjs').DetectorInput} input @returns {import('../contract.mjs').Finding[]} */
export function consistencyChecks(input) {
  const out = []
  const ds = input.designSystem

  for (const el of input.elements) {
    const s = el.styles
    // radius-off-system: só quando há DS.
    if (ds && s.borderRadius > 0 && !ds.radii.includes(Math.round(s.borderRadius))) {
      out.push(makeFinding({ rule: 'radius-off-system', severity: SEVERITY.P2, elementId: el.id,
        measured: `${s.borderRadius}px`, expected: `∈ {${ds.radii.join(',')}}`, message: 'raio fora do design system' }))
    }
    // zindex-magic: valores altos "mágicos" fora de uma escala semântica.
    if (typeof s.zIndex === 'number' && s.zIndex >= 999) {
      out.push(makeFinding({ rule: 'zindex-magic', severity: SEVERITY.P3, elementId: el.id,
        measured: `${s.zIndex}`, expected: '< 999 (escala semântica)', message: 'z-index mágico' }))
    }
  }

  // monotonous-spacing: coleta paddings/margens e flagra se um valor domina >60% com <=3 únicos.
  const vals = []
  for (const el of input.elements) {
    const s = el.styles
    for (const v of [s.paddingTop, s.paddingRight, s.paddingBottom, s.paddingLeft]) {
      if (v > 0) vals.push(Math.round(v / 4) * 4)
    }
  }
  if (vals.length >= 10) {
    const freq = {}
    vals.forEach(v => { freq[v] = (freq[v] || 0) + 1 })
    const uniq = Object.keys(freq).length
    const top = Math.max(...Object.values(freq))
    if (uniq <= 3 && top / vals.length > 0.6) {
      out.push(makeFinding({ rule: 'monotonous-spacing', severity: SEVERITY.P3, elementId: 'document',
        measured: `${uniq} valores`, expected: '>3 valores de espaçamento', message: 'espaçamento monótono — falta ritmo' }))
    }
  }
  return out
}

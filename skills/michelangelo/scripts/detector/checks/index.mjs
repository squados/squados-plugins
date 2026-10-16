import { spacingChecks } from './spacing.mjs'
import { typographyChecks } from './typography.mjs'
import { colorChecks } from './color.mjs'
import { consistencyChecks } from './consistency.mjs'
import { structureChecks } from './structure.mjs'
import { scrollChecks } from './scroll.mjs'

// Regras sem domínio de aplicação fora da web. Desligá-las não é tolerar defeito:
// é tirar do relatório o ruído que esconde o defeito real. Papel não rola, não
// recebe toque e não tem hover — um finding desses num PDF nunca é acionável.
const NAO_APLICAVEL = {
  web: new Set(),
  print: new Set(['native-scrollbar', 'touch-target-small', 'interactive-no-transition']),
  slide: new Set(['native-scrollbar', 'touch-target-small', 'interactive-no-transition']),
}

/** @param {import('../contract.mjs').DetectorInput} input @returns {import('../contract.mjs').Finding[]} */
export function runChecks(input) {
  const achados = [
    ...spacingChecks(input),
    ...typographyChecks(input),
    ...colorChecks(input),
    ...consistencyChecks(input),
    ...structureChecks(input),
    ...scrollChecks(input),
  ]
  const mudos = NAO_APLICAVEL[input.medium ?? 'web'] ?? NAO_APLICAVEL.web
  return achados.filter((f) => !mudos.has(f.rule))
}

// scroll.mjs
// O ponto cego que deixou passar o picker de herói (19/07/2026): um container com
// scroll interno servindo a scrollbar NATIVA do SO — cinza, grossa, sem craft. O detector
// media o render mas nunca olhava scroll. Aqui olha.
import { makeFinding, SEVERITY } from '../contract.mjs'

const SCROLLS = new Set(['auto', 'scroll'])

/**
 * native-scrollbar: elemento que ROLA de fato (scrollH/W > clientH/W, overflow auto|scroll)
 * mas não estilizou a barra (`scrollbar-width: auto` E `scrollbar-color: auto` = default do
 * UA). Uma barra nativa numa UI caprichada lê como "faltou acabamento" — trava a entrega.
 *
 * Só dispara quando transborda de VERDADE (senão a barra nem aparece), e é conservador: se
 * o projeto setou `scrollbar-width: thin/none` OU `scrollbar-color`, considera estilizado.
 * (Não dá pra detectar `::-webkit-scrollbar` por getComputedStyle; a recomendação é setar
 * também as props padrão, que cobrem Firefox — a falta delas É o defeito.)
 */
export function scrollChecks(input) {
  const out = []
  for (const el of input.elements) {
    const s = el.styles
    const sc = el.scroll
    if (!sc) continue
    const overflowsY = SCROLLS.has(s.overflowY) && sc.scrollH - sc.clientH > 1
    const overflowsX = SCROLLS.has(s.overflowX) && sc.scrollW - sc.clientW > 1
    if (!overflowsY && !overflowsX) continue
    const styled = (s.scrollbarWidth && s.scrollbarWidth !== 'auto') || (s.scrollbarColor && s.scrollbarColor !== 'auto')
    if (styled) continue
    const axis = overflowsY ? 'vertical' : 'horizontal'
    out.push(makeFinding({
      rule: 'native-scrollbar', severity: SEVERITY.P1, elementId: el.id,
      measured: `scrollbar-width:${s.scrollbarWidth}, scrollbar-color:${s.scrollbarColor}`,
      expected: 'scrollbar estilizada (scrollbar-width: thin + scrollbar-color, ou utilitário do projeto)',
      message: `scroll ${axis} servindo scrollbar nativa do SO (sem estilo)`,
    }))
  }
  return out
}

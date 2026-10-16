// spacing.mjs
import { makeFinding, SEVERITY, SIBLING_GAP_MIN } from '../contract.mjs'

const byId = (els) => Object.fromEntries(els.map(e => [e.id, e]))

// Estrutura de LISTA: linhas e células encostam por definição — a separação vem
// de borda/zebra/preenchimento de hover, não de gap. Medir "ritmo entre irmãos"
// aqui acusa defeito em tabela bem construída, e o ruído esconde os findings
// reais. `ul`/`ol`/`menu`/`dl` entram pelo mesmo argumento que `tbody`/`tr`: os
// filhos de uma lista SÃO linhas, e linha de lista de navegação (Slack, Discord,
// Linear) encosta na seguinte de propósito. O rigor continua valendo para dois
// blocos soltos empilhados — eles não são linhas de lista nenhuma.
const ESTRUTURA_DE_LISTA = new Set([
  'table', 'thead', 'tbody', 'tfoot', 'tr',
  'ul', 'ol', 'menu', 'dl',
])

// A MESMA isenção, declarada por ARIA em vez de por tag. React Native Web, os
// virtualizadores (FlashList, react-window, TanStack Virtual) e boa parte dos
// design systems headless emitem `<div role="list">`: a estrutura É de lista, a
// tag não é. Casar só por `tagName` reprova exatamente o produto que a lista
// acima existe para isentar — medido em 01/09/2026 no feed de conversa do
// squados-mobile, onde 15 P1 saíram de UMA causa estrutural.
const PAPEL_DE_LISTA = new Set([
  'list', 'listbox', 'menu', 'menubar', 'tablist', 'tree', 'treegrid',
  'grid', 'table', 'rowgroup', 'row', 'feed',
])

/** Dois fundos efetivos opacos e diferentes: o degrau de plano JÁ separa. */
function planosDiferentes(a, b) {
  const ca = a.styles.backgroundColor, cb = b.styles.backgroundColor
  if (a.bgUnknown || b.bgUnknown) return false
  if ((ca.a ?? 0) < 1 || (cb.a ?? 0) < 1) return false
  return Math.abs(ca.r - cb.r) > 1 || Math.abs(ca.g - cb.g) > 1 || Math.abs(ca.b - cb.b) > 1
}

const FORA_DO_FLUXO = new Set(['absolute', 'fixed'])

/** @param {import('../contract.mjs').DetectorInput} input @returns {import('../contract.mjs').Finding[]} */
export function spacingChecks(input) {
  const out = []
  const map = byId(input.elements)

  // sibling-gap-too-tight: irmãos vizinhos no fluxo com gap < SIBLING_GAP_MIN, mesmo sem borda/fundo.
  for (const parent of input.elements) {
    if (ESTRUTURA_DE_LISTA.has(parent.tag)) continue
    if (PAPEL_DE_LISTA.has(parent.ariaRole)) continue
    // <details>: `summary` e o corpo são uma unidade rótulo↔corpo, não dois blocos
    // empilhados. O ritmo de um accordion vem do padding interno de cada metade e da
    // borda/filete da linha — separar o cabeçalho da própria resposta em 8px abre um
    // rasgo dentro do item. Sem esta isenção, TODO accordion (nativo ou não) vira uma
    // pilha de P1: medido em 22/08/2026 no FaqAccordion do ibeia-pages, onde o estado
    // atual e as três direções candidatas reprovavam pela mesma razão estrutural.
    if (parent.tag === 'details') continue
    const kids = parent.childIds.map(id => map[id]).filter(Boolean)
      // Filho não renderizado (corpo de <details> fechado, `hidden`, `display:none`)
      // tem rect de área zero encostado no irmão anterior e inventa um gap de 0px que
      // ninguém vê. Gap entre blocos só existe entre blocos que ocupam área.
      .filter(k => k.rect.width > 0 && k.rect.height > 0)
    if (kids.length < 2) continue
    // ordena por posição vertical, depois horizontal
    const sorted = [...kids].sort((k1, k2) => k1.rect.top - k2.rect.top || k1.rect.left - k2.rect.left)
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1], cur = sorted[i]
      const vGap = cur.rect.top - prev.rect.bottom
      const overlapX = Math.min(prev.rect.right, cur.rect.right) - Math.max(prev.rect.left, cur.rect.left)
      // Exemções — a regra mede o RITMO entre BLOCOS de conteúdo, não a entrelinha de uma
      // unidade rótulo/valor nem o encosto de um ornamento:
      //  - ornamento decorativo (aria-hidden): régua, losango, filete — não é conteúdo.
      //  - unidade rótulo↔valor: dois text runs onde um é curto (um rótulo, ≤8 chars) hugam
      //    de propósito (ex.: "FOR" sobre "17" num medalhão). Dois PARÁGRAFOS (ambos longos)
      //    continuam sendo flagrados. `tight-leading` (typography) cobre entrelinha interna.
      const decorative = prev.ariaHidden || cur.ariaHidden
      const bothText = prev.role === 'text' && cur.role === 'text'
      const labelValue = bothText && Math.min(prev.textLength, cur.textLength) <= 8
      // Par título↔subtítulo: duas linhas ÚNICAS, tipograficamente distintas
      // (tamanho ou família/peso diferentes), são UMA unidade de identidade —
      // nome sobre organização, sala sobre assunto, produto sobre preço. O ar
      // vem da entrelinha; separar as duas em 8px quebra o par. É o mesmo caso
      // do `labelValue` acima, que só não pega porque mede o rótulo em
      // caracteres — e o comprimento do rótulo não é o que define a relação.
      // Dois blocos com a MESMA tipografia continuam sendo flagrados.
      const umaLinha = (e) => e.rect.height <= e.styles.lineHeight * 1.3
      const tipografiaDistinta =
        prev.styles.fontSize !== cur.styles.fontSize ||
        prev.styles.fontFamily !== cur.styles.fontFamily
      const tituloSubtitulo = bothText && umaLinha(prev) && umaLinha(cur) && tipografiaDistinta
      // Separados por quebra de página forçada: em documento paginado eles caem em
      // folhas diferentes, então o gap medido no fluxo contínuo não existe na saída.
      const paginado = prev.breaksAfter || cur.breaksBefore
      // Separados por FILETE: numa lista dividida (linhas de configuração, seções de
      // um formulário-checklist, itens de menu com régua) o ritmo vem da borda e do
      // padding interno de cada linha, não de um gap entre elas — mesma razão pela
      // qual `table`/`tr` já são isentos acima. Sem isto, todo divide-y bem-feito
      // vira uma pilha de P1 e o ruído esconde o gap que é defeito de verdade.
      const filete = (prev.styles.borderBottomWidth ?? 0) > 0 || (cur.styles.borderTopWidth ?? 0) > 0
      // Runs INLINE dentro de um parágrafo (`strong`, `em`, `a`, `span`): dois deles em
      // linhas consecutivas ficam a (lineHeight - fontSize) de distância, que é
      // entrelinha, não gap entre blocos — e é sempre < 8px em corpo bem composto.
      // Item de flex/grid é blockificado pelo browser, então `display:'inline'` no
      // computed style só sobra para conteúdo de fluxo inline de verdade.
      const inline = prev.styles.display.startsWith('inline') || cur.styles.display.startsWith('inline')
      // FORA DO FLUXO os dois: a regra mede o ritmo entre blocos que o fluxo
      // empilha, e `absolute`/`fixed` não são empilhados — são colocados por
      // coordenada. É o que um virtualizador faz com cada linha: o `top` de
      // cada wrapper já embute a margem do item, então os wrappers encostam por
      // construção e nenhum ajuste de estilo muda o número medido. O rigor
      // continua valendo para o par misto — um bloco no fluxo com algo absoluto
      // colado nele é sobreposição, e outros checks olham para isso.
      const foraDoFluxo =
        FORA_DO_FLUXO.has(prev.styles.position) && FORA_DO_FLUXO.has(cur.styles.position)
      // Separados por DEGRAU DE PLANO: quando o fundo muda de um para o outro,
      // a separação já está desenhada — mesma razão do `filete` acima, e o que
      // a §Surface Planes de um DS bem escrito diz com todas as letras ("o
      // plano substitui a borda"). Encostar dois planos é a decisão, não o
      // descuido.
      const degrauDePlano = planosDiferentes(prev, cur)
      if (decorative || labelValue || tituloSubtitulo || paginado || filete || inline || foraDoFluxo || degrauDePlano) continue
      // Linha de METADADOS sobre o bloco que ela rotula (autor+hora sobre a
      // mensagem, breadcrumb sobre o conteúdo): o rect de um bloco de texto já
      // inclui meia-entrelinha acima e abaixo da tinta, então rects a 2px têm
      // ~10px de ar percebido. Medir rect-a-rect aqui reprova toda composição
      // de chat bem feita. Só vale quando o de cima é uma linha ÚNICA em
      // flex/grid — o formato de uma linha de metadados —, nunca entre dois
      // blocos de prosa empilhados, que continuam medidos rect-a-rect.
      const linhaDeMetadados =
        (prev.styles.display === 'flex' || prev.styles.display === 'grid') &&
        prev.rect.height <= prev.styles.lineHeight * 1.3
      const folga = (e) => Math.max(0, (e.styles.lineHeight - e.styles.fontSize) / 2)
      const gapEfetivo = linhaDeMetadados ? vGap + folga(prev) + folga(cur) : vGap
      // só compara empilhados verticalmente (têm sobreposição horizontal) e não sobrepostos
      if (overlapX > 0 && vGap >= 0 && gapEfetivo < SIBLING_GAP_MIN) {
        out.push(makeFinding({
          rule: 'sibling-gap-too-tight', severity: SEVERITY.P1, elementId: cur.id,
          measured: `${vGap.toFixed(1)}px`, expected: `>=${SIBLING_GAP_MIN}px`,
          message: `gap entre irmãos apertado (${vGap.toFixed(1)}px)`,
        }))
      }
    }
  }

  for (const el of input.elements) {
    const s = el.styles
    // cramped-padding: elemento com texto próprio e padding abaixo do mínimo proporcional à fonte.
    if (el.textLength > 0) {
      const minV = Math.max(4, s.fontSize * 0.3)
      const minH = Math.max(8, s.fontSize * 0.5)
      const vOk = s.paddingTop >= minV && s.paddingBottom >= minV
      const hOk = s.paddingLeft >= minH && s.paddingRight >= minH
      if (!vOk || !hOk) {
        out.push(makeFinding({
          rule: 'cramped-padding', severity: SEVERITY.P2, elementId: el.id,
          measured: `${s.paddingTop}/${s.paddingRight}/${s.paddingBottom}/${s.paddingLeft}px`,
          expected: `>=${minV.toFixed(0)}v / ${minH.toFixed(0)}h`,
          message: 'padding apertado para o tamanho da fonte',
        }))
      }
    }
    // body-text-viewport-edge: texto longo a < 16px de qualquer borda da viewport.
    if (el.role === 'text' && el.textLength > 40) {
      const nearLeft = el.rect.left < 16
      const nearRight = input.viewport.width - el.rect.right < 16
      if (nearLeft || nearRight) {
        out.push(makeFinding({
          rule: 'body-text-viewport-edge', severity: SEVERITY.P2, elementId: el.id,
          measured: `${Math.min(el.rect.left, input.viewport.width - el.rect.right).toFixed(0)}px`,
          expected: '>=16px', message: 'texto longo colado na borda da viewport',
        }))
      }
    }
  }
  return out
}

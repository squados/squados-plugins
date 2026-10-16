// contract.mjs

/**
 * @typedef {Object} Rect
 * @property {number} x @property {number} y @property {number} width @property {number} height
 * @property {number} top @property {number} left @property {number} right @property {number} bottom
 */

/**
 * @typedef {Object} RGBA
 * @property {number} r @property {number} g @property {number} b @property {number} a
 */

/**
 * @typedef {Object} ElementStyles
 * @property {number} fontSize @property {number} lineHeight @property {number} letterSpacing
 * @property {string} fontFamily
 * @property {RGBA} color @property {RGBA} backgroundColor
 * @property {number} paddingTop @property {number} paddingRight @property {number} paddingBottom @property {number} paddingLeft
 * @property {number} borderRadius @property {string} boxShadow
 * @property {number} borderTopWidth @property {number} borderBottomWidth  filete que separa irmãos encostados
 * @property {number|null} zIndex
 * @property {string} display @property {string} position @property {string} transition
 * @property {string} overflowX @property {string} overflowY
 * @property {string} scrollbarWidth   computed `scrollbar-width` ('auto'|'thin'|'none')
 * @property {string} scrollbarColor   computed `scrollbar-color` ('auto' quando não estilizada)
 */

/**
 * @typedef {Object} ScrollDims
 * @property {number} scrollW @property {number} scrollH @property {number} clientW @property {number} clientH
 */

/**
 * @typedef {Object} ElementMeasurement
 * @property {string} id            unique path/selector
 * @property {string} tag
 * @property {'text'|'container'|'interactive'|'image'|'other'} role
 * @property {Rect} rect
 * @property {ElementStyles} styles
 * @property {ScrollDims} scroll     dimensões de scroll (scrollH>clientH ⇒ transborda de fato)
 * @property {boolean} ariaHidden    aria-hidden="true" (ornamento decorativo, não conteúdo)
 * @property {string|null} ariaRole  papel ARIA declarado (`role="list"` etc.); estrutura que a tag não conta
 * @property {boolean} bgUnknown     fundo resolvido veio de gradiente/background-image (contraste não medível)
 * @property {boolean} clippedByAncestorX  algum ancestral faz clipping/scroll horizontal (overflow-x auto/scroll/hidden)
 * @property {boolean} breaksBefore  quebra de página forçada ANTES deste elemento (break/page-break-before)
 * @property {boolean} breaksAfter   quebra de página forçada DEPOIS deste elemento (break/page-break-after)
 * @property {string|null} parentId
 * @property {string[]} childIds
 * @property {number} textLength     chars of own (non-child) text
 */

/**
 * A lei visual do projeto, como o detector a consome.
 *
 * A FONTE CANONICA e o cabecalho YAML do `DESIGN.md` na raiz do repo do usuario —
 * `design-md.mjs` le esse cabecalho e deriva os cinco campos abaixo. O tokens file
 * JSON e forma LEGADA, ainda aceita por `--ds` para repos antigos, mas nenhum caminho
 * do modo `design-system` volta a escreve-lo: dois arquivos com os mesmos valores
 * divergem, e nada comparava os dois.
 *
 * @typedef {Object} DesignSystem
 * @property {number[]} spacingScale
 * @property {number[]} radii
 * @property {{name:string,rgb:RGBA}[]} colorTokens
 * @property {string[]} fontFamilies
 * @property {string[]} shadowTokens
 */

/**
 * @typedef {'web'|'print'|'slide'} Medium
 * Meio de saída do alvo. Decide quais checks têm domínio de aplicação
 * (ver checks/index.mjs) e quais regras de craft valem (references/visual/medium.md).
 */

/**
 * @typedef {Object} DetectorInput
 * @property {ElementMeasurement[]} elements
 * @property {{width:number,height:number}} viewport
 * @property {DesignSystem|null} designSystem
 * @property {Medium} [medium]  default 'web'
 */

/**
 * @typedef {Object} Finding
 * @property {string} rule @property {'P0'|'P1'|'P2'|'P3'} severity
 * @property {string} elementId @property {string} measured @property {string} expected @property {string} message
 */

export const SEVERITY = { P0: 'P0', P1: 'P1', P2: 'P2', P3: 'P3' }

export function makeFinding({ rule, severity, elementId, measured, expected, message }) {
  if (!rule) throw new Error('finding sem rule')
  if (!Object.values(SEVERITY).includes(severity)) throw new Error(`severidade inválida: ${severity}`)
  return { rule, severity, elementId, measured, expected, message }
}

/** Escala de espaçamento canônica (px). */
export const SPACING_SCALE = [4, 8, 12, 16, 24, 32, 48, 64, 96]

/** Menor gap aceitável entre irmãos, por nível de hierarquia (px). */
export const SIBLING_GAP_MIN = 8

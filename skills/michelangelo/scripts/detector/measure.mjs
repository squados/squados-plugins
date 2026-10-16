// measure.mjs
// Função serializada rodada DENTRO do browser via page.evaluate.
// Anda no DOM, resolve o fundo efetivo (subindo a árvore quando translúcido)
// e emite ElementMeasurement[] conforme contract.mjs.
export const MEASURE_FN_SOURCE = `() => {
  const parse = (v) => parseFloat(v) || 0
  // Resolve QUALQUER cor CSS válida (rgb/rgba, hex, named, oklch, lab, color(), hsl…)
  // pintando 1px num canvas e lendo o pixel de volta. Regex de rgba() sozinho falha
  // silencioso em DS oklch/lab (Chromium serializa o computed color no espaço autoral),
  // devolvendo a:0 → contraste 1.00:1 falso em TODA a página. O canvas delega ao próprio
  // browser, então cobre todo formato que ele entende. Alpha do getImageData é 0-255 →
  // normaliza pra 0..1 (o contrato e o effectiveBg esperam a em 0..1).
  const _cv = document.createElement('canvas'); _cv.width = _cv.height = 1
  const _ctx = _cv.getContext('2d', { willReadFrequently: true })
  const toRGBA = (str) => {
    if (!str || str === 'transparent' || str === 'none') return { r: 0, g: 0, b: 0, a: 0 }
    _ctx.clearRect(0, 0, 1, 1)
    _ctx.fillStyle = str
    _ctx.fillRect(0, 0, 1, 1)
    const d = _ctx.getImageData(0, 0, 1, 1).data
    return { r: d[0], g: d[1], b: d[2], a: d[3] / 255 }
  }
  const INTERACTIVE = new Set(['A','BUTTON','INPUT','SELECT','TEXTAREA','SUMMARY'])
  const FORCA_QUEBRA = new Set(['always', 'page', 'left', 'right', 'recto', 'verso'])
  const isSvg = (el) => el.tagName.toLowerCase() === 'svg' || (typeof SVGElement !== 'undefined' && el instanceof SVGElement)
  const roleOf = (el, hasOwnText) => {
    if (INTERACTIVE.has(el.tagName) || el.getAttribute('role') === 'button') return 'interactive'
    if (el.tagName === 'IMG' || isSvg(el)) return 'image'
    if (hasOwnText) return 'text'
    if (el.children.length > 0) return 'container'
    return 'other'
  }
  const ownText = (el) => Array.from(el.childNodes)
    .filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('').length
  // Resolve o fundo efetivo subindo a árvore. Se, no caminho até um fundo
  // opaco, houver background-image/gradiente em qualquer ancestral, o fundo
  // não é uma cor sólida medível — sinaliza bgUnknown para pular o contraste.
  const effectiveBg = (el) => {
    let cur = el
    let bgUnknown = false
    while (cur) {
      const cs = getComputedStyle(cur)
      if (cs.backgroundImage && cs.backgroundImage !== 'none') bgUnknown = true
      const bg = toRGBA(cs.backgroundColor)
      if (bg.a >= 1) return { r: bg.r, g: bg.g, b: bg.b, a: 1, bgUnknown }
      cur = cur.parentElement
    }
    return { r: 255, g: 255, b: 255, a: 1, bgUnknown }
  }
  // true se algum ANCESTRAL faz clipping/scroll horizontal (overflow-x auto/scroll/hidden):
  // conteúdo mais largo que a viewport dentro de um scroller intencional não é overflow da página.
  const clippedByAncestorX = (el) => {
    let p = el.parentElement
    while (p) {
      const ox = getComputedStyle(p).overflowX
      if (ox === 'auto' || ox === 'scroll' || ox === 'hidden') return true
      p = p.parentElement
    }
    return false
  }
  // Inclui o body como elemento medido (container) para que os blocos
  // top-level da página sejam irmãos e o ritmo entre eles seja avaliado.
  const all = [document.body, ...Array.from(document.querySelectorAll('body *'))]
  let counter = 0
  const idMap = new Map()
  const idOf = (el) => { if (!idMap.has(el)) idMap.set(el, 'el' + (counter++)); return idMap.get(el) }
  const vw = { width: window.innerWidth, height: window.innerHeight }
  const elements = all.filter(el => {
    const r = el.getBoundingClientRect()
    if (!(r.width > 0 && r.height > 0)) return false
    // Não descer DENTRO de um <svg>: um ícone é um átomo. Os filhos (barras do
    // "hambúrguer", paths) não viram elementos medidos nem entram em childIds.
    const svgAnc = el.closest('svg')
    if (svgAnc && svgAnc !== el) return false
    return true
  }).map(el => {
    const cs = getComputedStyle(el)
    const r = el.getBoundingClientRect()
    const tl = ownText(el)
    const bg = effectiveBg(el)
    return {
      id: idOf(el), tag: el.tagName.toLowerCase(), role: roleOf(el, tl > 0),
      rect: { x: r.x, y: r.y, width: r.width, height: r.height, top: r.top, left: r.left, right: r.right, bottom: r.bottom },
      styles: {
        fontSize: parse(cs.fontSize), lineHeight: cs.lineHeight === 'normal' ? parse(cs.fontSize) * 1.2 : parse(cs.lineHeight),
        letterSpacing: cs.letterSpacing === 'normal' ? 0 : parse(cs.letterSpacing),
        fontFamily: cs.fontFamily + ' ' + cs.fontWeight,
        color: toRGBA(cs.color), backgroundColor: { r: bg.r, g: bg.g, b: bg.b, a: bg.a },
        paddingTop: parse(cs.paddingTop), paddingRight: parse(cs.paddingRight),
        paddingBottom: parse(cs.paddingBottom), paddingLeft: parse(cs.paddingLeft),
        borderRadius: parse(cs.borderTopLeftRadius), boxShadow: cs.boxShadow,
        borderTopWidth: parse(cs.borderTopWidth), borderBottomWidth: parse(cs.borderBottomWidth),
        zIndex: cs.zIndex === 'auto' ? null : parseInt(cs.zIndex, 10),
        display: cs.display, position: cs.position, transition: cs.transition,
        overflowX: cs.overflowX, overflowY: cs.overflowY,
        scrollbarWidth: cs.scrollbarWidth || 'auto', scrollbarColor: cs.scrollbarColor || 'auto',
      },
      // Dimensões de scroll: um scroller com scrollHeight > clientHeight transborda de fato.
      // Alimentam o check de scrollbar nativa (checks/scroll.mjs).
      scroll: { scrollW: el.scrollWidth || 0, scrollH: el.scrollHeight || 0, clientW: el.clientWidth || 0, clientH: el.clientHeight || 0 },
      ariaHidden: el.getAttribute('aria-hidden') === 'true',
      // O papel ARIA declarado, cru. Quem usa e o check de ritmo: estrutura de
      // lista se declara por role=list em todo virtualizador e em React Native
      // Web, onde a tag continua sendo div.
      ariaRole: el.getAttribute('role'),
      bgUnknown: bg.bgUnknown,
      clippedByAncestorX: clippedByAncestorX(el),
      // Quebra de página forçada: num documento paginado (PDF impresso), dois
      // elementos separados por uma quebra estão em FOLHAS diferentes — o "gap"
      // entre eles no fluxo contínuo é ficção e não deve ser medido.
      breaksBefore: FORCA_QUEBRA.has(cs.breakBefore) || FORCA_QUEBRA.has(cs.pageBreakBefore),
      breaksAfter: FORCA_QUEBRA.has(cs.breakAfter) || FORCA_QUEBRA.has(cs.pageBreakAfter),
      childIds: [], textLength: tl,
    }
  })
  // segunda passada: liga parentId/childIds ao ancestral MEDIDO mais próximo
  // (sobe a cadeia de parentElement pulando ancestrais filtrados: rect 0x0,
  // display:contents, filhos de svg), evitando órfãos.
  const byEl = new Map()
  elements.forEach(m => byEl.set(m.id, m))
  all.forEach(el => {
    if (!idMap.has(el)) return
    const m = byEl.get(idMap.get(el))
    if (!m) return
    let p = el.parentElement
    while (p && !idMap.has(p)) p = p.parentElement
    m.parentId = p && idMap.has(p) ? idMap.get(p) : null
    if (m.parentId && byEl.get(m.parentId)) byEl.get(m.parentId).childIds.push(m.id)
  })
  return { elements, viewport: vw }
}`

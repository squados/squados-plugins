(() => {
  'use strict'

  const { entries, core = [] } = JSON.parse(document.getElementById('catalog').textContent)
  const groups = document.getElementById('groups')
  const categoryField = document.getElementById('category')
  const queryField = document.getElementById('query')
  const total = document.getElementById('total')
  const empty = document.getElementById('empty')
  const categories = new Map()
  const cards = new Map()
  const links = new Map()
  const coreCategory = new Map(core.flatMap(group => group.ids.map(id => [id, group.title])))
  const normalize = text => text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
  const collectionLabels = {
    'bs-creatormotion': 'CreatorMotion',
    'bs-launchmotion': 'LaunchMotion',
    'bs-paper-cutout-story-video': 'Paper Cutout',
  }
  const seconds = new Intl.NumberFormat('pt-BR')
  const defaultScope = coreCategory.size ? 'core' : entries.some(entry => entry.demo) ? 'complement' : ''
  const comparisonCategory = 'Edição comparada'
  const referenceLanes = { upper: 'Faixa superior', lower: 'Faixa inferior' }

  function element(tag, className, text) {
    const node = document.createElement(tag)
    if (className) node.className = className
    if (text !== undefined) node.textContent = text
    return node
  }

  function makeVideo(src, label, unavailable = 'Vídeo indisponível neste checkout.') {
    const video = element('video', 'motion-video')
    video.controls = true
    video.playsInline = true
    video.preload = 'metadata'
    video.setAttribute('aria-label', label)
    video.addEventListener('error', () => {
      video.hidden = true
      video.after(element('p', 'card-meta', unavailable))
    }, { once: true })
    video.src = src
    return video
  }

  function timestamp(time) {
    const tenths = Math.round(time * 10)
    const minutes = String(Math.floor(tenths / 600)).padStart(2, '0')
    const seconds = String(Math.floor(tenths / 10) % 60).padStart(2, '0')
    return minutes + ':' + seconds + ',' + tenths % 10
  }

  function makeComparison(entry) {
    const { preview, reference } = entry.demo
    const comparison = element('div', 'motion-comparison')
    const original = element('figure', 'comparison-panel')
    const recreated = element('figure', 'comparison-panel')
    const originalVideo = makeVideo(reference.preview, 'Vídeo original · ' + entry.title, 'Vídeo original indisponível neste checkout.')
    const recreatedVideo = makeVideo(preview, 'Recriação · ' + entry.title)
    original.append(element('figcaption', 'comparison-label', 'Vídeo original'), originalVideo)
    recreated.append(element('figcaption', 'comparison-label', 'Recriação'), recreatedVideo)
    const range = reference.lane === 'both' ? 'Vídeo completo' :
      timestamp(reference.start) + '–' + timestamp(reference.end) + ' · ' + referenceLanes[reference.lane]
    original.append(element('p', 'comparison-range', range))
    comparison.classList.toggle('motion-comparison-portrait', reference.lane === 'both')
    comparison.append(original, recreated)
    return comparison
  }

  function makeCard(entry, title, scope) {
    const article = element('article', 'card')
    article.id = entry.id
    const collection = entry.demo ? 'Motion próprio' : collectionLabels[entry.source.package] + ' · Referência'
    const meta = entry.seconds ? collection + ' · ' + seconds.format(entry.seconds) + ' s' : collection + ' · Fluxo de vídeo'
    const heading = element('h3', null, entry.title)
    const permalink = element('a', 'card-id', entry.id)
    permalink.href = '#' + entry.id
    permalink.setAttribute('aria-label', 'Link para ' + entry.title + ', ' + entry.id)

    const copy = element('div', 'card-copy')
    copy.append(element('p', 'card-meta', meta), heading, permalink)
    if (entry.demo) {
      if (entry.demo.reference) {
        article.classList.add('card-comparison')
        copy.prepend(makeComparison(entry))
      } else {
        copy.prepend(makeVideo(entry.demo.preview, entry.title))
      }
      const source = element('a', 'preview-link', 'Fonte da composição')
      source.href = entry.demo.composition
      copy.append(source)
      if (entry.demo.skill) {
        const skill = element('a', 'preview-link', 'Ver skill')
        skill.href = entry.demo.skill
        copy.append(skill)
      }
    } else {
      const preview = element('a', 'preview-link', 'Ver prévia na Skillry ↗')
      preview.href = entry.source.url
      preview.target = '_blank'
      preview.rel = 'noopener noreferrer'
      preview.setAttribute('aria-label', 'Ver prévia de ' + entry.title + ' na Skillry (nova aba)')
      copy.append(preview)
    }
    const details = element('details')
    details.append(element('summary', null, 'Ver prompt'), element('p', 'prompt', entry.prompt))
    article.append(copy, details)
    return {
      article,
      scope,
      filter: entry.demo?.reference ? title : scope,
      search: normalize([entry.title, title, entry.category, collection, entry.id, ...(entry.aliases ?? [])].join(' ')),
    }
  }

  const entriesById = new Map(entries.map(entry => [entry.id, entry]))
  const orderedEntries = [
    ...core.flatMap(group => group.ids.map(id => entriesById.get(id))).filter(Boolean),
    ...entries.filter(entry => !coreCategory.has(entry.id)),
  ]
  for (const entry of orderedEntries) {
    const title = coreCategory.get(entry.id) ?? entry.category
    const scope = coreCategory.has(entry.id) ? 'core' : entry.demo ? 'complement' : 'reference'
    if (!categories.has(title)) categories.set(title, { cards: [] })
    const card = makeCard(entry, title, scope)
    categories.get(title).cards.push(card)
    cards.set(entry.id, card)
    for (const alias of entry.aliases ?? []) {
      if (/^[a-z0-9-]+$/.test(alias)) links.set(alias, card)
    }
  }

  const scopes = new Map([
    ['core', 'Seleção principal'],
    ['complement', 'Acervo complementar'],
    ['reference', 'Referências da Skillry'],
  ])
  for (const [scope, label] of scopes) {
    if ([...cards.values()].some(card => card.scope === scope)) categoryField.add(new Option(label, scope))
  }

  const firstCategories = core.map(group => group.title)
  const orderedCategories = [...firstCategories.filter(title => categories.has(title)),
    ...[...categories.keys()].filter(title => !firstCategories.includes(title)).sort((a, b) => a.localeCompare(b, 'pt-BR'))]
  orderedCategories.forEach((title, index) => {
    const category = categories.get(title)
    const section = element('section', 'group')
    const header = element('div', 'group-heading')
    const heading = element('h2', null, title)
    heading.id = 'category-heading-' + index
    section.setAttribute('aria-labelledby', heading.id)
    if (title === comparisonCategory) section.id = 'edicao-comparada'
    category.section = section
    category.count = element('span')
    header.append(heading, category.count)
    const grid = element('div', 'grid')
    grid.append(...category.cards.map(card => card.article))
    section.append(header, grid)
    groups.append(section)
    categoryField.add(new Option(title, title))
  })

  function applyFilters() {
    const words = normalize(queryField.value.trim()).split(/\s+/).filter(Boolean)
    const filter = categoryField.value
    const scopeFilter = scopes.has(filter)
    let visible = 0
    for (const [title, category] of categories) {
      const inCategory = !filter || scopeFilter || title === filter
      let count = 0
      for (const card of category.cards) {
        const matches = inCategory && (!scopeFilter || card.scope === filter) && words.every(word => card.search.includes(word))
        if (!matches && !card.article.hidden) {
          for (const video of card.article.querySelectorAll('video')) video.pause()
        }
        card.article.hidden = !matches
        if (matches) count++
      }
      category.count.textContent = count === 1 ? '1 resultado' : count + ' resultados'
      category.section.hidden = count === 0
      visible += count
    }
    total.value = visible + (visible === 1 ? ' resultado' : ' resultados')
    empty.hidden = visible !== 0
  }

  function selectFilter(filter) {
    categoryField.value = filter
    queryField.value = ''
    applyFilters()
  }

  function revealLink() {
    let id
    try { id = decodeURIComponent(location.hash.slice(1)) }
    catch { return }
    if (id === 'catalogo') {
      selectFilter(defaultScope)
      return
    }
    if (id === 'edicao-comparada' && categories.has(comparisonCategory)) {
      selectFilter(comparisonCategory)
      categories.get(comparisonCategory).section.scrollIntoView({ block: 'start' })
      return
    }
    const card = cards.get(id) ?? links.get(id)
    if (!card) return
    if (id !== card.article.id) history.replaceState(null, '', '#' + card.article.id)
    if (card.article.hidden) selectFilter(card.filter)
    card.article.scrollIntoView({ block: 'start' })
  }

  queryField.addEventListener('input', applyFilters)
  categoryField.addEventListener('change', applyFilters)
  window.addEventListener('hashchange', revealLink)
  for (const link of document.querySelectorAll('.masthead nav a')) {
    link.addEventListener('click', () => {
      if (link.hash === location.hash) revealLink()
    })
  }
  selectFilter(defaultScope)
  revealLink()
})()

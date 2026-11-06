(() => {
  'use strict'

  const { entries, core = [] } = JSON.parse(document.getElementById('catalog').textContent)
  const groups = document.getElementById('groups')
  const queryField = document.getElementById('query')
  const scopeField = document.getElementById('scope')
  const categoryField = document.getElementById('category')
  const useField = document.getElementById('use')
  const kindField = document.getElementById('kind')
  const durationField = document.getElementById('duration')
  const clearButton = document.getElementById('clear-filters')
  const total = document.getElementById('total')
  const empty = document.getElementById('empty')
  const comparisonLink = document.getElementById('comparison-link')
  const filterFields = [scopeField, categoryField, useField, kindField, durationField]
  const categories = new Map()
  const cards = new Map()
  const links = new Map()
  const coreCategory = new Map(core.flatMap(group => group.ids.map(id => [id, group.title])))
  const normalize = text => text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
  const collator = new Intl.Collator('pt-BR')
  const seconds = new Intl.NumberFormat('pt-BR')
  const comparisonCategory = 'Edição comparada'
  const durations = [
    { max: 5, value: 'short', label: 'Até 5 s' },
    { max: 8, value: 'medium', label: 'Mais de 5 até 8 s' },
    { max: 10, value: 'long', label: 'Mais de 8 até 10 s' },
    { max: Infinity, value: 'extended', label: 'Mais de 10 s' },
  ]

  // Só abra os arquivos próximos à área visível, inclusive depois de mudar os filtros.
  const previews = new IntersectionObserver((items, observer) => {
    for (const { target, isIntersecting } of items) {
      if (!isIntersecting) continue
      target.src = target.dataset.preview
      observer.unobserve(target)
    }
  }, { rootMargin: '240px' })

  function element(tag, className, text) {
    const node = document.createElement(tag)
    if (className) node.className = className
    if (text !== undefined) node.textContent = text
    return node
  }

  function makeCard(entry, group, scope) {
    const article = element('article', 'card')
    article.id = entry.id
    const { description, kind, uses, formats, demo } = entry
    const meta = [kind, seconds.format(entry.seconds) + ' s', ...formats].join(' · ')
    const heading = element('h3', null, entry.title)
    const permalink = element('a', 'card-id', entry.id)
    permalink.href = '#' + entry.id
    permalink.setAttribute('aria-label', 'Link para ' + entry.title + ', ' + entry.id)

    const video = element('video', 'motion-video')
    video.controls = true
    video.playsInline = true
    video.preload = 'metadata'
    video.setAttribute('aria-label', 'Prévia de ' + entry.title)
    video.addEventListener('error', () => {
      video.hidden = true
      video.after(element('p', 'card-meta', 'Prévia indisponível.'))
    }, { once: true })
    video.dataset.preview = demo.preview

    const copy = element('div', 'card-copy')
    copy.append(video, element('p', 'card-meta', meta), heading, element('p', 'card-description', description), permalink)
    const source = element('a', 'preview-link', 'Fonte da composição')
    source.href = demo.composition
    copy.append(source)
    if (demo.skill) {
      const skill = element('a', 'preview-link', 'Ver skill')
      skill.href = demo.skill
      copy.append(skill)
    }

    const details = element('details')
    details.append(element('summary', null, 'Ver prompt'), element('p', 'prompt', entry.prompt))
    article.append(copy, details)
    return {
      article, video, scope, category: entry.category, group, kind, uses, featured: entry.featured === true,
      duration: durations.find(range => entry.seconds <= range.max)?.value,
      search: normalize([
        entry.title, description, group, entry.category, entry.collection, entry.id, kind, ...uses, ...formats,
        ...(entry.aliases ?? []), ...(entry.previousIds ?? []),
      ].join(' ')),
    }
  }

  const entriesById = new Map(entries.map(entry => [entry.id, entry]))
  const orderedEntries = [
    ...[...coreCategory.keys()].map(id => entriesById.get(id)).filter(Boolean),
    ...entries.filter(entry => !coreCategory.has(entry.id)),
  ]
  const usedUses = new Set()
  const usedKinds = new Set()
  const usedDurations = new Set()
  const usedScopes = new Set()
  const usedCategories = new Set()
  for (const entry of orderedEntries) {
    const group = coreCategory.get(entry.id) ?? entry.group ?? entry.category
    const isFeatured = coreCategory.size ? coreCategory.has(entry.id) : entry.featured
    const scope = isFeatured ? 'core' : 'complement'
    if (!categories.has(group)) categories.set(group, { cards: [] })
    const card = makeCard(entry, group, scope)
    categories.get(group).cards.push(card)
    cards.set(entry.id, card)
    usedCategories.add(card.category)
    usedScopes.add(scope)
    card.uses.forEach(use => usedUses.add(use))
    usedKinds.add(card.kind)
    usedDurations.add(card.duration)
    for (const alias of [...(entry.previousIds ?? []), ...(entry.aliases ?? [])]) {
      if (/^[a-z0-9-]+$/.test(alias)) links.set(alias, card)
    }
  }

  const defaultScope = usedScopes.size > 1 ? 'core' : ''
  if (defaultScope) {
    scopeField.add(new Option('Seleção principal', 'core'))
    scopeField.add(new Option('Acervo complementar', 'complement'))
  }
  if (coreCategory.size && entries.some(entry => entry.featured === true)) {
    scopeField.add(new Option('Novidades', 'featured'))
  }
  scopeField.closest('label').hidden = scopeField.options.length < 2
  for (const use of [...usedUses].sort(collator.compare)) useField.add(new Option(use, use))
  for (const kind of [...usedKinds].sort(collator.compare)) kindField.add(new Option(kind, kind))
  for (const { value, label } of durations) {
    if (usedDurations.has(value)) durationField.add(new Option(label, value))
  }

  const firstCategories = [...new Set(core.map(group => group.title))]
  const orderedCategories = [...firstCategories.filter(title => categories.has(title)),
    ...[...categories.keys()].filter(title => !firstCategories.includes(title)).sort(collator.compare)]
  orderedCategories.forEach((title, index) => {
    const category = categories.get(title)
    const section = element('section', 'group')
    const header = element('div', 'group-heading')
    const heading = element('h2', null, title)
    heading.id = 'category-heading-' + index
    section.setAttribute('aria-labelledby', heading.id)
    if (title === comparisonCategory) {
      section.id = 'edicao-comparada'
      comparisonLink.hidden = false
    }
    category.section = section
    category.count = element('span')
    header.append(heading, category.count)
    const grid = element('div', 'grid')
    grid.append(...category.cards.map(card => card.article))
    section.append(header, grid)
    groups.append(section)
    category.cards.forEach(card => previews.observe(card.video))
  })

  const extraGroups = orderedCategories.filter(title => !usedCategories.has(title))
  const categoryOptions = [...usedCategories].sort(collator.compare).map(title => new Option(title, title))
  if (extraGroups.length) {
    const catalogCategories = element('optgroup')
    catalogCategories.label = 'Categorias'
    catalogCategories.append(...categoryOptions)
    const selectionGroups = element('optgroup')
    selectionGroups.label = 'Grupos da seleção'
    selectionGroups.append(...extraGroups.map(title => new Option(title, title)))
    categoryField.append(catalogCategories, selectionGroups)
  } else {
    categoryField.append(...categoryOptions)
  }

  function resultCount(count) {
    return count + (count === 1 ? ' resultado' : ' resultados')
  }

  function applyFilters() {
    const words = normalize(queryField.value.trim()).split(/\s+/).filter(Boolean)
    const [scope, categoryFilter, use, kind, duration] = filterFields.map(field => field.value)
    let visible = 0
    for (const [title, category] of categories) {
      let count = 0
      for (const card of category.cards) {
        const matches = (!categoryFilter || title === categoryFilter || card.category === categoryFilter) &&
          (!scope || (scope === 'featured' ? card.featured : card.scope === scope)) &&
          (!use || card.uses.includes(use)) &&
          (!kind || card.kind === kind) &&
          (!duration || card.duration === duration) &&
          words.every(word => card.search.includes(word))
        if (!matches && !card.article.hidden && !card.video.paused) card.video.pause()
        card.article.hidden = !matches
        if (matches) count++
      }
      category.count.textContent = resultCount(count)
      category.section.hidden = count === 0
      visible += count
    }
    total.value = resultCount(visible)
    empty.hidden = visible !== 0
    clearButton.disabled = !queryField.value && filterFields.every(field => !field.value)
  }

  function selectFilters(scope = '', category = '') {
    queryField.value = ''
    for (const field of filterFields) field.value = ''
    scopeField.value = scope
    categoryField.value = category
    applyFilters()
  }

  function revealLink() {
    let id
    try { id = decodeURIComponent(location.hash.slice(1)) }
    catch { return }
    if (id === 'catalogo') {
      selectFilters(defaultScope)
      return
    }
    if (id === 'edicao-comparada' && categories.has(comparisonCategory)) {
      selectFilters('', comparisonCategory)
      categories.get(comparisonCategory).section.scrollIntoView({ block: 'start' })
      return
    }
    const card = cards.get(id) ?? links.get(id)
    if (!card) return
    if (id !== card.article.id) history.replaceState(null, '', '#' + card.article.id)
    if (card.article.hidden) {
      const category = card.group === comparisonCategory ? comparisonCategory : ''
      selectFilters(defaultScope ? card.scope : '', category)
    }
    card.article.scrollIntoView({ block: 'start' })
  }

  function clearFilters() {
    selectFilters()
    queryField.focus()
  }

  queryField.addEventListener('input', applyFilters)
  for (const field of filterFields) field.addEventListener('change', applyFilters)
  clearButton.addEventListener('click', clearFilters)
  document.getElementById('empty-clear-filters').addEventListener('click', clearFilters)
  window.addEventListener('hashchange', revealLink)
  for (const link of document.querySelectorAll('.masthead nav a')) {
    link.addEventListener('click', () => {
      if (link.hash === location.hash) revealLink()
    })
  }
  selectFilters(defaultScope)
  revealLink()
})()

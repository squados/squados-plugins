(() => {
  'use strict'

  const { entries } = JSON.parse(document.getElementById('catalog').textContent)
  const groups = document.getElementById('groups')
  const categoryField = document.getElementById('category')
  const queryField = document.getElementById('query')
  const total = document.getElementById('total')
  const empty = document.getElementById('empty')
  const categories = new Map()
  const cards = new Map()
  const normalize = text => text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
  const collectionLabels = {
    'bs-creatormotion': 'CreatorMotion',
    'bs-launchmotion': 'LaunchMotion',
    'bs-paper-cutout-story-video': 'Paper Cutout',
  }
  const seconds = new Intl.NumberFormat('pt-BR')

  function element(tag, className, text) {
    const node = document.createElement(tag)
    if (className) node.className = className
    if (text !== undefined) node.textContent = text
    return node
  }

  function makeCard(entry) {
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
      const video = element('video', 'motion-video')
      video.controls = true
      video.playsInline = true
      video.preload = 'metadata'
      video.src = entry.demo.preview
      video.setAttribute('aria-label', entry.title)
      video.addEventListener('error', () => {
        video.hidden = true
        copy.prepend(element('p', 'card-meta', 'Vídeo indisponível neste checkout.'))
      }, { once: true })
      copy.prepend(video)
      const source = element('a', 'preview-link', 'Fonte da composição')
      source.href = entry.demo.composition
      copy.append(source)
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
      own: Boolean(entry.demo),
      search: normalize([entry.title, entry.category, collection, entry.id, ...(entry.aliases ?? [])].join(' ')),
    }
  }

  for (const entry of entries) {
    if (!categories.has(entry.category)) categories.set(entry.category, { cards: [] })
    const card = makeCard(entry)
    categories.get(entry.category).cards.push(card)
    cards.set(entry.id, card)
  }

  const firstCategories = ['Transições de cena', 'Tipografia e legendas']
  const orderedCategories = [...firstCategories.filter(title => categories.has(title)),
    ...[...categories.keys()].filter(title => !firstCategories.includes(title)).sort((a, b) => a.localeCompare(b, 'pt-BR'))]
  orderedCategories.forEach((title, index) => {
    const category = categories.get(title)
    const section = element('section', 'group')
    const header = element('div', 'group-heading')
    const heading = element('h2', null, title)
    heading.id = 'category-heading-' + index
    section.setAttribute('aria-labelledby', heading.id)
    category.section = section
    category.count = element('span')
    header.append(heading, category.count)
    const grid = element('div', 'grid')
    grid.append(...category.cards.map(card => card.article))
    section.append(header, grid)
    groups.append(section)
    categoryField.add(new Option(title, title))
  })

  const ownOption = new Option('Motions próprios', 'own')
  if (entries.some(entry => entry.demo)) categoryField.add(ownOption, 0)

  function applyFilters() {
    const words = normalize(queryField.value.trim()).split(/\s+/).filter(Boolean)
    groups.dataset.own = String(categoryField.value === 'own')
    let visible = 0
    for (const [title, category] of categories) {
      const inCategory = !categoryField.value || title === categoryField.value || categoryField.value === 'own'
      let count = 0
      for (const card of category.cards) {
        const matches = inCategory && (categoryField.value !== 'own' || card.own) && words.every(word => card.search.includes(word))
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

  function revealLinkedCard() {
    let id
    try { id = decodeURIComponent(location.hash.slice(1)) }
    catch { return }
    const card = cards.get(id)
    if (!card) return
    if (card.article.hidden) {
      categoryField.value = ''
      queryField.value = ''
      applyFilters()
    }
    card.article.scrollIntoView({ block: 'start' })
  }

  queryField.addEventListener('input', () => {
    if (categoryField.value === 'own') categoryField.value = ''
    applyFilters()
  })
  categoryField.addEventListener('change', applyFilters)
  window.addEventListener('hashchange', revealLinkedCard)
  if (ownOption.parentNode) categoryField.value = 'own'
  applyFilters()
  revealLinkedCard()
})()

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
  const firstCategories = ['Efeitos de edição', 'Transições de cena']
  const preferredOrder = title => firstCategories.includes(title) ? firstCategories.indexOf(title) : firstCategories.length
  let playing = null
  let frameId = 0

  function element(tag, className, text) {
    const node = document.createElement(tag)
    if (className) node.className = className
    if (text !== undefined) node.textContent = text
    return node
  }

  function setPlayLabel(card, label) {
    card.label.textContent = label
    card.button.setAttribute('aria-label', label + ' ' + card.entry.title)
    card.icon.setAttribute('d', label === 'Pausar' ? 'M4 3h3v10H4zM9 3h3v10H9z' : 'M5 2.5 13 8l-8 5.5z')
  }

  function makeCard(entry) {
    const article = element('article', 'card')
    article.id = entry.id
    const preview = element('div', 'preview')
    const controls = element('div', 'preview-controls')
    const button = element('button', 'play')
    button.type = 'button'
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('viewBox', '0 0 16 16')
    svg.setAttribute('aria-hidden', 'true')
    const icon = document.createElementNS(svg.namespaceURI, 'path')
    svg.append(icon)
    const label = element('span')
    button.append(svg, label)

    const progress = element('progress')
    progress.max = 1
    progress.value = 0
    progress.setAttribute('aria-hidden', 'true')
    progress.hidden = true
    controls.append(button, progress)

    const copy = element('div', 'card-copy')
    const name = element('div', 'card-name')
    const link = element('a', 'card-id', entry.id)
    link.href = '#' + entry.id
    link.setAttribute('aria-label', 'Link para ' + entry.title + ', ' + entry.id)
    const heading = element('h3', null, entry.title)
    name.append(link, heading)
    copy.append(name, controls)

    const details = element('details')
    details.append(element('summary', null, 'Ver prompt'), element('p', 'prompt', entry.prompt))
    if (entry.source.url) {
      const source = element('a', 'source', 'Referência original')
      source.href = entry.source.url
      details.append(source)
    }

    article.append(preview, copy, details)
    const card = {
      article, preview, button, icon, label, progress, entry,
      search: normalize(entry.title + ' ' + entry.id),
      canvas: null, ctx: null, time: 0, started: false
    }
    setPlayLabel(card, 'Reproduzir')
    button.addEventListener('click', () => toggle(card))
    cards.set(entry.id, card)
    return card
  }

  function unavailable(card, error) {
    if (playing === card) stop()
    card.button.disabled = true
    card.canvas?.remove()
    card.preview.append(element('span', 'preview-error', 'Prévia indisponível'))
    console.error('Falha na demo ' + card.entry.id, error)
  }

  function draw(card, time) {
    try {
      if (!card.canvas) {
        card.canvas = element('canvas')
        card.canvas.width = 480
        card.canvas.height = 270
        card.canvas.setAttribute('aria-hidden', 'true')
        card.ctx = card.canvas.getContext('2d')
        card.preview.prepend(card.canvas)
      }
      const ctx = card.ctx
      ctx.save()
      try {
        ctx.clearRect(0, 0, 480, 270)
        window.motionDemos[card.entry.demo.key](ctx, time)
      } finally {
        ctx.restore()
      }
      return true
    } catch (error) {
      unavailable(card, error)
      return false
    }
  }

  function stop() {
    if (!playing) return
    cancelAnimationFrame(frameId)
    setPlayLabel(playing, playing.time >= 1 ? 'Repetir' : 'Continuar')
    playing = null
  }

  function toggle(card) {
    if (playing === card) {
      stop()
      return
    }
    stop()
    if (card.time >= 1) card.time = 0
    if (!draw(card, card.time)) return
    playing = card
    card.started = true
    card.progress.hidden = false
    card.progress.value = card.time
    setPlayLabel(card, 'Pausar')
    const duration = card.entry.demo.seconds * 1000
    const startedAt = performance.now() - card.time * duration
    function tick(now) {
      card.time = Math.min(1, Math.max(0, (now - startedAt) / duration))
      if (!draw(card, card.time)) return
      card.progress.value = card.time
      if (card.time < 1) frameId = requestAnimationFrame(tick)
      else stop()
    }
    frameId = requestAnimationFrame(tick)
  }

  const observer = new IntersectionObserver(records => {
    for (const record of records) {
      const card = cards.get(record.target.id)
      if (record.isIntersecting) {
        if (!card.canvas && !card.button.disabled) {
          draw(card, card.started ? card.time : (card.entry.demo.posterAt ?? 0.45))
        }
      } else if (card.canvas) {
        if (playing === card) stop()
        card.canvas.remove()
        card.canvas = null
        card.ctx = null
      }
    }
  }, { rootMargin: '180px' })

  for (const entry of entries) {
    if (!categories.has(entry.category)) categories.set(entry.category, { cards: [] })
    categories.get(entry.category).cards.push(makeCard(entry))
  }

  const orderedCategories = [...categories.keys()].sort((a, b) => preferredOrder(a) - preferredOrder(b))
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
    for (const card of category.cards) {
      grid.append(card.article)
      observer.observe(card.article)
    }
    section.append(header, grid)
    groups.append(section)
    categoryField.add(new Option(title, title))
  })

  function applyFilters() {
    const words = normalize(queryField.value.trim()).split(/\s+/).filter(Boolean)
    let visible = 0
    for (const [title, category] of categories) {
      const inCategory = !categoryField.value || title === categoryField.value
      let count = 0
      for (const card of category.cards) {
        const matches = inCategory && words.every(word => card.search.includes(word))
        card.article.hidden = !matches
        if (matches) count++
        else if (playing === card) stop()
      }
      category.count.textContent = count === 1 ? '1 demo' : count + ' demos'
      category.section.hidden = count === 0
      visible += count
    }
    total.value = visible + (visible === 1 ? ' efeito' : ' efeitos')
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

  queryField.addEventListener('input', applyFilters)
  categoryField.addEventListener('change', applyFilters)
  window.addEventListener('hashchange', revealLinkedCard)
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop() })
  applyFilters()
  revealLinkedCard()
})()

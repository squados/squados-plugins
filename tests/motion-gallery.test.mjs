import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { runInNewContext } from 'node:vm'
import test from 'node:test'

const gallery = fileURLToPath(new URL('../motion-gallery/', import.meta.url))
const file = name => resolve(gallery, name)
const read = name => readFileSync(file(name), 'utf8')

test('catálogo preserva a cobertura aprovada e identifica cada demo', () => {
  assert.ok(existsSync(file('catalog.json')), 'o catálogo canônico deve existir')
  const { version, entries } = JSON.parse(read('catalog.json'))
  assert.equal(version, 1)
  assert.equal(entries.length, 243)
  assert.equal(new Set(entries.map(entry => entry.id)).size, entries.length)
  const counts = Object.fromEntries(['ibeia', 'motion-skills', 'showcase'].map(
    collection => [collection, entries.filter(entry => entry.source.collection === collection).length]
  ))
  assert.deepEqual(counts, { ibeia: 176, 'motion-skills': 56, showcase: 11 })
  const house = entries.filter(entry => entry.source.collection === 'ibeia')
  assert.equal(house.filter(entry => /^RM26-/.test(entry.id)).length, 41)
  assert.equal(house.filter(entry => /^26-(?:G|E[0-9]+)$/.test(entry.id)).length, 35)
  assert.equal(new Set(entries.map(({ source }) => source.collection + ':' + source.id)).size, 243)
  const titles = entries.map(entry => entry.title.toLocaleLowerCase('pt-BR'))
  assert.equal(new Set(titles).size, titles.length, 'nomes precisam resolver para uma única entrada')
  for (const entry of entries) {
    assert.match(entry.id, /^[a-z0-9-]+$/i)
    assert.ok(entry.title && entry.category && entry.prompt.length >= 70, entry.id)
    assert.ok(entry.source.id && ['original', 'fictional'].includes(entry.material), entry.id)
    assert.ok(entry.demo.seconds > 0 && entry.demo.seconds <= 15, entry.id)
    if (entry.source.collection !== 'ibeia') assert.match(entry.source.url, /^https:\/\/github\.com\/iart-ai\//)
    if (entry.source.collection === 'ibeia') assert.equal(entry.source.id, entry.id)
    if (entry.demo.posterAt !== undefined) assert.ok(entry.demo.posterAt >= 0 && entry.demo.posterAt <= 1, entry.id)
  }
  const byId = Object.fromEntries(entries.map(entry => [entry.id, entry]))
  assert.equal(byId['06-E3'].demo.key, byId['07-G'].demo.key)
})

test('HTML offline carrega o catálogo e todos os scripts de demonstração', () => {
  assert.ok(existsSync(file('index.html')), 'o HTML demonstrativo deve existir')
  const html = read('index.html')
  assert.match(html, /<link rel="stylesheet" href="gallery\.css">/)
  assert.ok(existsSync(file('gallery.css')))
  const embedded = html.match(/<script id="catalog" type="application\/json">([\s\S]+?)<\/script>/)
  assert.deepEqual(JSON.parse(embedded?.[1] ?? 'null'), JSON.parse(read('catalog.json')))
  const window = {}
  const renderers = new Map()
  const files = [...html.matchAll(/<script src="([^"]+)"[^>]*>/g)].map(match => match[1])
  assert.ok(files.includes('gallery.js'))
  for (const name of files) {
    assert.match(name, /^(?:[a-z0-9-]+\/)*[a-z0-9-]+\.js$/i)
    const source = read(name)
    if (!name.startsWith('demos-')) continue
    const before = { ...window.motionDemos }
    runInNewContext(source, { window }, { filename: name })
    for (const [key, renderer] of Object.entries(window.motionDemos)) {
      if (key in before) assert.equal(renderer, before[key], 'registro sobrescrito: ' + key)
      else renderers.set(key, name)
    }
  }
  const { entries } = JSON.parse(read('catalog.json'))
  for (const { id, demo } of entries) {
    assert.equal(typeof window.motionDemos?.[demo.key], 'function', id)
    assert.equal(renderers.get(demo.key), demo.file, id)
  }
  const used = new Set(entries.map(entry => entry.demo.key))
  assert.deepEqual(Object.keys(window.motionDemos).filter(key => !used.has(key)), [])
})

test('Tarantino consulta o catálogo canônico antes de adaptar um efeito nomeado', () => {
  const skill = readFileSync(new URL('../skills/tarantino/SKILL.md', import.meta.url), 'utf8')
  assert.match(skill, /https:\/\/raw\.githubusercontent\.com\/squados\/squados-plugins\/main\/motion-gallery\/catalog\.json/)
  assert.match(skill, /nome exato ou ID/)
})

test('os nomes públicos já usados continuam resolvendo para os mesmos IDs', () => {
  const entries = JSON.parse(read('catalog.json')).entries
  const existingNames = {
    'RM26-02-01': 'Criador de 45 anos, relógio, fuga e notebook no chão',
    'RM26-06-01': 'Analista confuso entre planilhas e dashboard',
    'RM26-06-04': 'Tradicional versus IA',
    'RM26-07-01': 'Descrição vira aplicativo moderno',
    'RM26-09-02': 'Colaborador pede depoimento e recebe placa',
    'RM26-13-02': 'IA reduz 500 candidatos a 3'
  }
  for (const [id, title] of Object.entries(existingNames)) {
    const entry = entries.find(entry => entry.id === id)
    assert.ok([entry.title, ...(entry.aliases ?? [])].includes(title), id)
  }
})

test('cada cartão descreve o efeito isolado e mantém a busca pelo nome anterior', () => {
  const { entries } = JSON.parse(read('catalog.json'))
  for (const { id, title, demo, aliases } of entries) {
    assert.ok(['transparent', 'black', 'white'].includes(demo.background), id)
    assert.ok(!aliases || aliases.every(alias => typeof alias === 'string' && alias !== title), id)
  }
  const html = read('index.html')
  assert.match(html, /animações isoladas/i)
  assert.match(read('gallery.js'), /entry\.aliases/)
})

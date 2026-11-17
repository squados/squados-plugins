import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import test from 'node:test'
import { runInNewContext } from 'node:vm'

const gallery = new URL('../motion-gallery/', import.meta.url)
const read = name => readFileSync(new URL(name, gallery), 'utf8')
const catalog = JSON.parse(read('catalog.json'))

test('curvas rápidas chegam ao estado final e a mola assenta após o rebote', () => {
  const { snap, spring } = runInNewContext(read('scenes/motion-assets/time.js') + '\n;({ snap, spring })', {
    window: {},
    document: { querySelector: () => null },
  })
  const samples = Array.from({ length: 31 }, (_, frame) => frame / 30)
  assert.equal(snap(-1, 0, 1), 0)
  assert.ok(snap(.3, 0, 1) > .8)
  assert.ok(samples.every((t, i) => i === 0 || snap(t, 0, 1) >= snap(samples[i - 1], 0, 1)))
  assert.equal(snap(1, 0, 1), 1)
  assert.equal(spring(0, 0, 1), 0)
  const peak = Math.max(...samples.map(t => spring(t, 0, 1)))
  assert.ok(peak > 1.06 && peak < 1.10)
  assert.ok(Math.abs(spring(.9, 0, 1) - 1) < .005)
  assert.equal(spring(1, 0, 1), 1)
})

test('cada motion tem uma indicação de uso, classificação e composição local', () => {
  const { version, entries } = catalog
  assert.equal(version, 2)
  assert.equal(new Set(entries.map(entry => entry.id)).size, entries.length)
  const descriptions = new Set()
  const lookups = new Map()
  for (const entry of entries) {
    assert.ok(entry.title && entry.category && entry.prompt, entry.id)
    assert.match(entry.description, /^Use [^.?!\r\n]{20,175}\.$/, entry.id)
    assert.ok(!descriptions.has(entry.description), entry.id)
    descriptions.add(entry.description)
    assert.ok(Array.isArray(entry.uses) && entry.uses.length > 0, entry.id)
    assert.deepEqual(entry.formats, ['16:9'], entry.id)
    assert.ok(['Cena completa', 'Sobreposição', 'Transição'].includes(entry.kind), entry.id)
    assert.equal(entry.source, undefined, entry.id)
    assert.equal(entry.demo.preview, 'videos/' + entry.id + '.mp4', entry.id)
    assert.ok(existsSync(new URL(entry.demo.preview, gallery)), entry.id)
    const composition = read(entry.demo.composition)
    assert.ok(composition.includes(`data-composition-id="${entry.id}"`), entry.id)
    assert.ok(composition.includes(`data-duration="${entry.seconds}"`), entry.id)
    for (const name of [entry.id, entry.title, ...(entry.aliases ?? []), ...(entry.previousIds ?? [])]) {
      const key = name.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()
      assert.ok(!lookups.has(key) || lookups.get(key) === entry.id, name)
      lookups.set(key, entry.id)
    }
  }
})

test('seleção principal só aponta para composições canônicas', () => {
  const { core, entries } = catalog
  const ids = core.flatMap(group => group.ids)
  const originals = new Set(entries.map(entry => entry.id))
  assert.ok(core.every(group => group.ids.length > 0))
  assert.equal(new Set(core.map(group => group.title)).size, core.length)
  assert.equal(new Set(ids).size, ids.length)
  for (const id of ids) assert.ok(originals.has(id), id)
  for (const entry of entries.filter(entry => entry.featured)) assert.ok(ids.includes(entry.id), entry.id)
})

test('giro de marca usa um cartão com as marcas anteriores como opções', () => {
  const entry = catalog.entries.find(item => item.id === 'squados-em-volume')
  assert.equal(entry.demo.inputs.brand, 'text')
  assert.deepEqual(entry.previousIds, ['claude-em-volume', 'chatgpt-em-volume'])
  for (const id of entry.previousIds) assert.ok(!catalog.entries.some(item => item.id === id), id)
  assert.equal(entry.demo.presets['claude-em-volume'].brand, 'claude')
  assert.equal(entry.demo.presets['chatgpt-em-volume'].brand, 'chatgpt')
})

test('edição comparada tem um guia de reutilização e uma composição por efeito', () => {
  const entries = catalog.entries.filter(entry => entry.category === 'Edição comparada')
  assert.equal(entries.length, 7)
  const inventory = read('comparativo-de-edicoes.md')
  assert.ok(catalog.entries.every(entry => !entry.demo?.reference))
  for (const { id, demo, seconds } of entries) {
    assert.equal(demo.skill, 'scenes/' + id + '/SKILL.md')
    assert.ok(read(demo.skill).split(/\r?\n/).includes('name: ' + id), id)
    const composition = read(demo.composition)
    assert.ok(composition.includes('data-duration="' + seconds + '"'), id)
    assert.ok(inventory.includes('index.html#' + id + ')'), id)
  }
})

test('HTML offline inclui o catálogo e carrega apenas o script da interface', () => {
  const html = read('index.html')
  assert.match(html, /<link rel="stylesheet" href="gallery\.css">/)
  const embedded = html.match(/<script id="catalog" type="application\/json">([\s\S]+?)<\/script>/)
  assert.deepEqual(JSON.parse(embedded?.[1] ?? 'null'), catalog)
  assert.deepEqual([...html.matchAll(/<script src="([^"]+)"/g)].map(match => match[1]), ['gallery.js'])
  assert.ok(!readdirSync(gallery).some(name => name.startsWith('demos-')))
})

test('Tarantino resolve efeitos por intenção e reutiliza composições locais', () => {
  const skill = readFileSync(new URL('../skills/tarantino/SKILL.md', import.meta.url), 'utf8')
  assert.match(skill, /https:\/\/raw\.githubusercontent\.com\/squados\/squados-plugins\/main\/motion-gallery\/catalog\.json/)
  assert.match(skill, /nome exato ou ID/)
  assert.match(skill, /`description`/)
  assert.match(skill, /`uses`/)
  assert.match(skill, /render-motion\.mjs/)
  assert.doesNotMatch(skill, /source\.package|\b[a-z]:[\\/]|nextcloud|ibeia-videoskills|direção dos previews|window\.motionDemos/i)
})

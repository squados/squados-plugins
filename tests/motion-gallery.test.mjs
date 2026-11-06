import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
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

test('catálogo indexa o benchmark Skillry com slugs e páginas oficiais', () => {
  const { version, entries } = catalog
  assert.equal(version, 2)
  assert.equal(entries.length, 355)
  assert.equal(new Set(entries.map(entry => entry.id)).size, entries.length)
  const sourced = entries.filter(entry => entry.source)
  assert.equal(sourced.length, 331)
  assert.equal(new Set(sourced.map(entry => entry.source.id ?? entry.id)).size, sourced.length)
  const collections = new Map([
    ['bs-creatormotion', 122],
    ['bs-launchmotion', 208],
    ['bs-paper-cutout-story-video', 1],
  ])
  for (const [packageName, count] of collections) {
    assert.equal(sourced.filter(entry => entry.source.package === packageName).length, count)
  }
  assert.ok(entries.find(entry => entry.id === 'parede-em-perspectiva')?.demo)
  for (const entry of entries) {
    assert.ok(entry.title && entry.category && entry.prompt.includes(entry.title), entry.id)
    if (entry.source) {
      assert.ok(collections.has(entry.source.package), entry.id)
      const sourceId = entry.source.id ?? entry.id
      assert.match(sourceId, new RegExp('^' + entry.source.package + '(?:-[a-z0-9-]+)?$'))
      assert.equal(entry.source.url, 'https://skillry.dev/skills/' + sourceId)
      if (entry.demo) assert.ok(entry.aliases.includes(sourceId), entry.id)
    } else {
      assert.ok(entry.demo, entry.id)
    }
    if (entry.demo) {
      assert.equal(entry.demo.preview, 'previews/' + entry.id + '.mp4')
      assert.ok(read(entry.demo.composition).includes(`data-composition-id="${entry.id}"`), entry.id)
    }
  }
  const spectrum = sourced.find(entry => (entry.source.id ?? entry.id) === 'bs-launchmotion-ui-star-flash-irises')
  assert.ok(spectrum.aliases.includes('lm-ui-star-flash-irises'))
  assert.ok(spectrum.title === 'Light Spectrum' || spectrum.aliases.includes('Light Spectrum'))
})

test('seleção principal contém 50 composições próprias em seis categorias', () => {
  const { core, entries } = catalog
  const ids = core.flatMap(group => group.ids)
  const originals = new Set(entries.filter(entry => entry.demo).map(entry => entry.id))
  assert.equal(new Set(core.map(group => group.title)).size, 6)
  assert.deepEqual(core.map(group => group.ids.length), [9, 8, 10, 8, 9, 6])
  assert.equal(new Set(ids).size, 50)
  for (const id of ids) assert.ok(originals.has(id), id)
  assert.equal(originals.size - ids.length, 34)
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

test('Tarantino resolve efeitos sem depender do ambiente da ibe.IA', () => {
  const skill = readFileSync(new URL('../skills/tarantino/SKILL.md', import.meta.url), 'utf8')
  assert.match(skill, /https:\/\/raw\.githubusercontent\.com\/squados\/squados-plugins\/main\/motion-gallery\/catalog\.json/)
  assert.match(skill, /nome exato ou ID/)
  assert.match(skill, /render-motion\.mjs/)
  assert.match(skill, /--skill/)
  assert.match(skill, /--effect/)
  assert.match(skill, /--storyboard/)
  assert.doesNotMatch(skill, /\b[a-z]:[\\/]|nextcloud|ibeia-videoskills|direção dos previews|window\.motionDemos/i)
})

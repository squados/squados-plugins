import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import test from 'node:test'

const gallery = new URL('../motion-gallery/', import.meta.url)
const read = name => readFileSync(new URL(name, gallery), 'utf8')
const catalog = JSON.parse(read('catalog.json'))

test('catálogo indexa o benchmark Skillry com slugs e páginas oficiais', () => {
  const { version, entries } = catalog
  assert.equal(version, 2)
  assert.equal(entries.length, 331)
  assert.equal(new Set(entries.map(entry => entry.id)).size, entries.length)
  const collections = new Map([
    ['bs-creatormotion', 122],
    ['bs-launchmotion', 208],
    ['bs-paper-cutout-story-video', 1],
  ])
  for (const [packageName, count] of collections) {
    assert.equal(entries.filter(entry => entry.source.package === packageName).length, count)
  }
  for (const entry of entries) {
    assert.ok(collections.has(entry.source.package), entry.id)
    assert.match(entry.id, new RegExp('^' + entry.source.package + '(?:-[a-z0-9-]+)?$'))
    assert.ok(entry.title && entry.category && entry.prompt.includes(entry.title), entry.id)
    assert.equal(entry.source.url, 'https://skillry.dev/skills/' + entry.id)
    assert.equal(entry.demo, undefined)
  }
  const spectrum = entries.find(entry => entry.title === 'Light Spectrum')
  assert.equal(spectrum.id, 'bs-launchmotion-ui-star-flash-irises')
  assert.deepEqual(spectrum.aliases, ['lm-ui-star-flash-irises'])
})

test('HTML offline inclui o catálogo e carrega apenas o script da interface', () => {
  const html = read('index.html')
  assert.match(html, /<link rel="stylesheet" href="gallery\.css">/)
  const embedded = html.match(/<script id="catalog" type="application\/json">([\s\S]+?)<\/script>/)
  assert.deepEqual(JSON.parse(embedded?.[1] ?? 'null'), catalog)
  assert.deepEqual([...html.matchAll(/<script src="([^"]+)"/g)].map(match => match[1]), ['gallery.js'])
  assert.ok(!readdirSync(gallery).some(name => name.startsWith('demos-')))
})

test('Tarantino resolve a referência e usa os geradores Skillry', () => {
  const skill = readFileSync(new URL('../skills/tarantino/SKILL.md', import.meta.url), 'utf8')
  assert.match(skill, /https:\/\/raw\.githubusercontent\.com\/squados\/squados-plugins\/main\/motion-gallery\/catalog\.json/)
  assert.match(skill, /nome exato ou ID/)
  assert.match(skill, /--skill/)
  assert.match(skill, /--effect/)
  assert.match(skill, /--storyboard/)
  assert.doesNotMatch(skill, /window\.motionDemos/)
})

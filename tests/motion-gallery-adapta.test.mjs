import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const gallery = new URL('../motion-gallery/', import.meta.url)
const { entries } = JSON.parse(readFileSync(new URL('catalog.json', gallery), 'utf8'))
const byId = new Map(entries.map(entry => [entry.id, entry]))

test('peças da Adapta expõem mídia, dados e controles para edição', () => {
  const contracts = {
    'cta-expansivel': { label: 'text', expandAt: 'number', hold: 'number', transparent: 'boolean' },
    'oferta-em-camadas': { items: 'array', cover: 'image', finalPrice: 'number', currency: 'text' },
    'prompt-e-resultado': { prompt: 'text', screen: 'media', revealAt: 'number' },
    'baralho-de-bonus': { cards: 'array', activeCard: 'number', unlockAt: 'number' },
    'destaque-de-regiao': { documentImage: 'image', region: 'object', screen: 'media', cues: 'array' },
    'matriz-de-comparacao': { options: 'array', rows: 'array', tools: 'array', screens: 'images' },
    'apresentador-e-lista': { presenter: 'media', items: 'array', portraits: 'images' },
  }
  for (const [id, expected] of Object.entries(contracts)) {
    const entry = byId.get(id)
    assert.ok(entry?.demo, id)
    for (const [input, type] of Object.entries(expected)) {
      assert.equal(entry.demo.inputs[input], type, id + ' / ' + input)
    }
  }
})

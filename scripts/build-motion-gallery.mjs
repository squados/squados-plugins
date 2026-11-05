import { readFileSync, writeFileSync } from 'node:fs'

const gallery = new URL('../motion-gallery/', import.meta.url)
const read = name => readFileSync(new URL(name, gallery), 'utf8')
const template = readFileSync(new URL('./motion-gallery-template.html', import.meta.url), 'utf8')
const data = JSON.parse(read('catalog.json'))
const marker = '<!-- CATALOG -->'
if (template.split(marker).length !== 2) throw new Error('O HTML deve ter um marcador de catálogo.')
const embedded = JSON.stringify(data).replaceAll('<', '\\u003c')
const html = template.replace(marker, () => embedded)
const output = new URL('index.html', gallery)
if (process.argv.includes('--check')) {
  if (readFileSync(output, 'utf8') !== html) {
    console.error('index.html desatualizado. Rode node scripts/build-motion-gallery.mjs.')
    process.exitCode = 1
  } else {
    console.log('HTML atualizado com ' + data.entries.length + ' demonstrações.')
  }
} else {
  writeFileSync(output, html)
  console.log('HTML gerado com ' + data.entries.length + ' demonstrações.')
}

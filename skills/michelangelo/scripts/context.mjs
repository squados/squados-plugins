// context.mjs
// Carrega a lei do projeto UMA vez por sessão, no tamanho do alvo.
//
// Antes, todo trabalho começava com `cat DESIGN.md` (centenas de linhas) e
// `cat PRODUCT.md` inteiros — 6k tokens para mexer num rodapé, e relidos a cada
// dúvida. Aqui sai: o cabeçalho de tokens achatado (a lei que se aplica ao
// escrever código), o índice da prosa, e o corpo só das seções que falam do alvo.
//
//   node $SKILL_DIR/scripts/context.mjs [--target <caminho|termo>...] \
//     [--design DESIGN.md] [--product PRODUCT.md] [--section <titulo>] [--full]
//
// Sai 0 mesmo sem DESIGN.md: a ausência é o resultado (a skill trata isso na Abertura).
import { existsSync, readFileSync, realpathSync } from 'node:fs'
import { basename, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { readFrontmatter, parseFrontmatter } from './detector/design-md.mjs'

/** `{ a: { b: "x" } }` → `a.b: x`, uma linha por folha. */
function flatten(value, prefix = '') {
  if (value === null || typeof value !== 'object') return [`${prefix}: ${value}`]
  if (Array.isArray(value)) return [`${prefix}: [${value.join(', ')}]`]
  return Object.entries(value).flatMap(([key, inner]) =>
    flatten(inner, prefix ? `${prefix}.${key}` : key),
  )
}

/** Corta o markdown em seções `##`+ preservando o corpo antes da primeira. */
export function splitSections(body) {
  const lines = String(body).split(/\r?\n/)
  const sections = []
  let current = { title: '(abertura)', level: 0, lines: [] }
  for (const line of lines) {
    const heading = /^(#{1,6})\s+(.*)$/.exec(line)
    if (heading) {
      sections.push(current)
      current = { title: heading[2].trim(), level: heading[1].length, lines: [] }
      continue
    }
    current.lines.push(line)
  }
  sections.push(current)
  return sections.filter((s) => s.title !== '(abertura)' || s.lines.join('').trim())
}

/** Termos de busca a partir de um caminho de arquivo ou de uma palavra solta. */
export function termsFrom(target) {
  return String(target)
    .split(/[\\/]/)
    .flatMap((part) => basename(part).replace(/\.[a-z]+$/i, '').split(/[^A-Za-zÀ-ÿ]+|(?=[A-Z][a-z])/))
    .map((t) => t.toLowerCase())
    .filter((t) => t.length >= 4 && !['src', 'renderer', 'components', 'features', 'index'].includes(t))
}

function matches(section, terms) {
  if (!terms.length) return false
  const haystack = `${section.title}\n${section.lines.join('\n')}`.toLowerCase()
  return terms.some((term) => haystack.includes(term))
}

function renderDoc(label, file, { terms, always = [], full = false }) {
  if (!existsSync(file)) return `## ${label}\n\nNÃO EXISTE (${file}).\n`
  const text = readFileSync(file, 'utf8')
  const out = [`## ${label} — ${file}`, '']
  let body = text
  if (label === 'Lei visual') {
    try {
      const front = readFrontmatter(text, file)
      const tokens = flatten(parseFrontmatter(front, file))
      out.push('### Tokens (cabeçalho)', '', '```', ...tokens, '```', '')
      body = text.slice(text.indexOf('---', text.indexOf('---') + 3) + 3)
    } catch (err) {
      out.push(`### Tokens (cabeçalho)`, '', `ILEGÍVEL: ${err.message}`, '')
    }
  }
  const sections = splitSections(body)
  const wanted = full
    ? sections
    : sections.filter(
        (s) => matches(s, terms) || always.some((a) => s.title.toLowerCase().includes(a)),
      )
  out.push('### Seções', '')
  for (const section of sections) {
    const mark = wanted.includes(section) ? '»' : ' '
    out.push(`${mark} ${'#'.repeat(Math.max(section.level, 1))} ${section.title} (${section.lines.length} linhas)`)
  }
  out.push('')
  if (wanted.length) {
    out.push('### Seções abertas (as marcadas com »)', '')
    for (const section of wanted) {
      out.push(`${'#'.repeat(Math.max(section.level, 1))} ${section.title}`, ...section.lines, '')
    }
  } else {
    out.push('_Nenhuma seção casou com o alvo. Abra uma pelo título com `--section <titulo>` se precisar._', '')
  }
  return out.join('\n')
}

if (process.argv[1] && import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href) {
  const argv = process.argv.slice(2)
  const flag = (name, fallback) => {
    const i = argv.indexOf(`--${name}`)
    return i > -1 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : fallback
  }
  const many = (name) =>
    argv.reduce((acc, arg, i) => (arg === `--${name}` && argv[i + 1] ? [...acc, argv[i + 1]] : acc), [])
  const full = argv.includes('--full')
  const targets = many('target')
  const terms = [...new Set(targets.flatMap(termsFrom).concat(many('section').map((s) => s.toLowerCase())))]
  const design = resolve(flag('design', 'DESIGN.md'))
  const product = resolve(flag('product', 'PRODUCT.md'))

  console.log('# Contexto do projeto')
  console.log('')
  console.log(`Alvo: ${targets.join(', ') || '(não informado)'} · termos: ${terms.join(', ') || '(nenhum)'}`)
  console.log('')
  console.log(renderDoc('Lei visual', design, { terms, full }))
  console.log(renderDoc('Produto', product, { terms, always: ['anti-referência', 'anti-referencia', 'quem usa'], full }))
  console.log('---')
  console.log('Rodado uma vez por sessão. Não releia DESIGN.md nem PRODUCT.md: peça uma seção')
  console.log('pelo título (`--section`) quando faltar algo. O detector lê o cabeçalho sozinho via `--ds`.')
}

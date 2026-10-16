// design-md.mjs
//
// Lê o cabeçalho YAML do `DESIGN.md` e deriva o `DesignSystem` do contract.mjs.
// A fonte canônica da lei visual é o DESIGN.md; o tokens file JSON é forma legada,
// ainda aceita para repos antigos.
//
// A gramática aceita é RESTRITA de propósito (a skill não tem dependência YAML, e o
// cabeçalho é um formato que a própria skill escreve):
//   - indentação de 2 espaços, aninhamento livre
//   - `chave: valor`
//   - mapa inline  `{ a: "x", b: "y" }`  (e `{}`)
//   - lista inline `["a", "b"]`          (e `[]`)
//   - escalar entre aspas duplas ou nu
//   - comentário de linha inteira com `#`
// Sem âncora, sem multi-linha, sem tag, sem lista em bloco (`- item`).
//
// TODA falha é ALTA: `throw`, nunca `null` nem objeto parcial. Os checks fazem
// `if (ds)`, então um DS malformado que degradasse em silêncio mediria o alvo sem lei
// e devolveria PASS por ausência de régua — que é o defeito que este módulo existe
// para matar.

import { readFileSync } from 'node:fs'

export class DesignMdError extends Error {
  constructor(message) {
    super(message)
    this.name = 'DesignMdError'
  }
}

const fail = (file, msg) => {
  throw new DesignMdError(`${file}: ${msg}`)
}

// A chave pode vir entre aspas — em YAML ela PRECISA vir quando começa com dígito
// (`"2xl": "48px"`), que é justamente como uma escala de espaçamento se chama.
const KEY_LINE = /^(\s*)(?:"([^"]+)"|([A-Za-z0-9_.-]+)):[ \t]*(.*)$/

/** Extrai o bloco entre a primeira e a segunda linha `---`. */
export function readFrontmatter(text, file = '<memória>') {
  const lines = String(text).split(/\r?\n/)
  let start = -1
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '') continue
    if (lines[i].trim() === '---') { start = i; break }
    fail(file, 'não tem cabeçalho YAML — a primeira linha não-vazia precisa ser `---`')
  }
  if (start === -1) fail(file, 'não tem cabeçalho YAML (arquivo vazio ou só em branco)')
  const end = lines.indexOf('---', start + 1)
  if (end === -1) fail(file, 'cabeçalho YAML aberto e nunca fechado (falta o `---` de baixo)')
  return lines.slice(start + 1, end)
}

/** Divide por vírgulas de topo, ignorando as que estão dentro de `[]`, `{}` ou aspas. */
function splitTop(src) {
  const out = []
  let depth = 0
  let quoted = false
  let buf = ''
  for (const ch of src) {
    if (ch === '"') { quoted = !quoted; buf += ch; continue }
    if (!quoted && (ch === '[' || ch === '{')) depth++
    if (!quoted && (ch === ']' || ch === '}')) depth--
    if (!quoted && depth === 0 && ch === ',') { out.push(buf); buf = ''; continue }
    buf += ch
  }
  if (buf.trim() !== '') out.push(buf)
  return out.map(s => s.trim())
}

function parseScalar(raw, file, lineNo) {
  const v = raw.trim()
  if (v === '') fail(file, `linha ${lineNo}: valor vazio onde um escalar era esperado`)

  if (v.startsWith('[')) {
    if (!v.endsWith(']')) fail(file, `linha ${lineNo}: lista inline aberta e nunca fechada`)
    const inner = v.slice(1, -1).trim()
    return inner === '' ? [] : splitTop(inner).map(item => parseScalar(item, file, lineNo))
  }

  if (v.startsWith('{')) {
    if (!v.endsWith('}')) fail(file, `linha ${lineNo}: mapa inline aberto e nunca fechado`)
    const inner = v.slice(1, -1).trim()
    if (inner === '') return {}
    const obj = {}
    for (const pair of splitTop(inner)) {
      const at = pair.indexOf(':')
      if (at === -1) fail(file, `linha ${lineNo}: item de mapa inline sem \`:\` — ${pair}`)
      const key = pair.slice(0, at).trim().replace(/^"|"$/g, '')
      obj[key] = parseScalar(pair.slice(at + 1), file, lineNo)
    }
    return obj
  }

  if (v.startsWith('"')) {
    if (!v.endsWith('"') || v.length < 2) fail(file, `linha ${lineNo}: aspas abertas e nunca fechadas`)
    return v.slice(1, -1)
  }

  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v)
  return v
}

/** Parseia o cabeçalho na gramática restrita. Devolve um objeto simples. */
export function parseFrontmatter(lines, file = '<memória>') {
  const root = {}
  /** pilha de {indent, node} — o topo é o mapa que está recebendo chaves */
  const stack = [{ indent: -2, node: root }]

  lines.forEach((line, i) => {
    const lineNo = i + 1
    if (line.trim() === '' || line.trim().startsWith('#')) return

    const m = KEY_LINE.exec(line)
    if (!m) fail(file, `linha ${lineNo}: fora da gramática aceita — ${line.trim()}`)
    const [, pad, quotedKey, bareKey, rawValue] = m
    const key = quotedKey ?? bareKey

    if (pad.includes('\t')) fail(file, `linha ${lineNo}: tabulação na indentação (use 2 espaços)`)
    if (pad.length % 2 !== 0) fail(file, `linha ${lineNo}: indentação de ${pad.length} espaços (use múltiplos de 2)`)

    while (stack.length > 1 && pad.length <= stack[stack.length - 1].indent) stack.pop()
    const parent = stack[stack.length - 1]
    if (pad.length !== parent.indent + 2) {
      fail(file, `linha ${lineNo}: indentação de ${pad.length} espaços não abre sob nenhuma chave`)
    }

    if (rawValue.trim() === '') {
      const child = {}
      parent.node[key] = child
      stack.push({ indent: pad.length, node: child })
      return
    }
    parent.node[key] = parseScalar(rawValue, file, lineNo)
  })

  return root
}

function asMap(fm, key, file, { required }) {
  const v = fm[key]
  if (v === undefined) {
    if (required) fail(file, `cabeçalho sem a chave obrigatória \`${key}\``)
    return {}
  }
  if (v === null || typeof v !== 'object' || Array.isArray(v)) {
    fail(file, `\`${key}\` precisa ser um mapa de tokens (use \`${key}: {}\` se o projeto não tem nenhum)`)
  }
  return v
}

function toPx(value, file, where) {
  if (typeof value === 'number') return value
  const m = /^(-?\d+(?:\.\d+)?)(px|rem)$/.exec(String(value).trim())
  if (!m) fail(file, `${where}: \`${value}\` não é um valor em px ou rem — use uma unidade absoluta da escala do DS`)
  const numericValue = Number(m[1])
  return m[2] === 'rem' ? numericValue * 16 : numericValue
}

const OKLCH_RE = /^oklch\(\s*([\d.]+%?)\s+([\d.]+%?)\s+([\d.]+)(?:deg)?\s*(?:\/\s*([\d.]+%?)\s*)?\)$/i

/**
 * `oklch(L C H)` | `oklch(L C H / A)` → RGBA do contract.mjs.
 *
 * Existe porque um design system inteiro pode ser autorado em OKLCH — é o caso
 * de qualquer projeto Tailwind 4 recente, e alguns o tornam regra dura ("nunca
 * `hsl(var(--x))`, sempre `oklch`"). Antes disto, o `--ds` desses projetos saía
 * com código 2 e a única saída era manter uma cópia hex do DESIGN.md em paralelo
 * — uma segunda fonte de verdade para a lei visual, que é exatamente o que o
 * arquivo existe para evitar.
 *
 * Fora do gamut sRGB a conversão CLAMPA por canal, enquanto o browser faz gamut
 * mapping preservando matiz. Os dois divergem alguns pontos num accent muito
 * saturado; para o que os checks fazem com o token (contraste aproximado e
 * "esta cor pertence à paleta?") a diferença não muda veredito.
 */
export function oklchToRgba(value, file, where) {
  const m = OKLCH_RE.exec(String(value).trim())
  if (!m) fail(file, `${where}: \`${value}\` não é um oklch() reconhecível — use \`oklch(L C H)\` ou \`oklch(L C H / A)\``)
  const pct = (s, scale) => (s.endsWith('%') ? Number(s.slice(0, -1)) / 100 * scale : Number(s))
  const L = pct(m[1], 1), C = pct(m[2], 0.4), H = Number(m[3])
  const alpha = m[4] === undefined ? 1 : pct(m[4], 1)

  const hRad = (H * Math.PI) / 180
  const a = C * Math.cos(hRad), b = C * Math.sin(hRad)
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b
  const l3 = l_ ** 3, m3 = m_ ** 3, s3 = s_ ** 3
  const linear = [
    +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3,
    -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3,
    -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3,
  ]
  const encode = (v) => {
    const c = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(Math.max(v, 0), 1 / 2.4) - 0.055
    return Math.max(0, Math.min(255, Math.round(c * 255)))
  }
  const [r, g, bb] = linear.map(encode)
  return { r, g, b: bb, a: Number(alpha.toFixed(3)) }
}

/** Despacha pela sintaxe: `#...` é hex, `oklch(...)` é OKLCH. */
export function parseColor(value, file, where) {
  const raw = String(value).trim()
  if (/^oklch\(/i.test(raw)) return oklchToRgba(raw, file, where)
  return hexToRgba(raw, file, where)
}

/** `#rgb` | `#rrggbb` | `#rrggbbaa` → RGBA do contract.mjs */
export function hexToRgba(hex, file, where) {
  const h = String(hex).trim().replace(/^#/, '')
  const ok = /^[0-9a-fA-F]+$/.test(h) && [3, 6, 8].includes(h.length)
  if (!ok) fail(file, `${where}: \`${hex}\` não é uma cor reconhecível — use #rgb, #rrggbb, #rrggbbaa ou oklch(L C H[ / A])`)
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
    a: full.length === 8 ? Number((parseInt(full.slice(6, 8), 16) / 255).toFixed(3)) : 1,
  }
}

const numeric = arr => [...new Set(arr)].sort((a, b) => a - b)

/**
 * Deriva o `DesignSystem` (contract.mjs §typedef) do cabeçalho.
 * @returns {import('./contract.mjs').DesignSystem}
 */
export function toDesignSystem(fm, file = '<memória>') {
  const colors = asMap(fm, 'colors', file, { required: true })
  const typography = asMap(fm, 'typography', file, { required: true })
  const spacing = asMap(fm, 'spacing', file, { required: true })
  const rounded = asMap(fm, 'rounded', file, { required: true })
  // `shadows` é extensão nossa: o formato Stitch não carrega elevação no cabeçalho, então
  // exigi-la rejeitaria um DESIGN.md legítimo escrito por outra ferramenta. Ausente =
  // "o projeto não declarou elevação", que é uma verdade, não uma omissão a punir.
  // Os quatro de cima têm check consumindo ou semântica que o detector precisa; este não.
  const shadows = asMap(fm, 'shadows', file, { required: false })

  const fontFamilies = []
  for (const [role, def] of Object.entries(typography)) {
    if (def === null || typeof def !== 'object' || Array.isArray(def)) {
      fail(file, `typography.${role} precisa ser um mapa com \`fontFamily\``)
    }
    if (def.fontFamily === undefined) fail(file, `typography.${role} não declara \`fontFamily\``)
    const first = String(def.fontFamily).split(',')[0].trim().replace(/^["']|["']$/g, '')
    if (first === '') fail(file, `typography.${role}.fontFamily está vazio`)
    if (!fontFamilies.includes(first)) fontFamilies.push(first)
  }
  if (fontFamilies.length === 0) fail(file, '`typography` não declara nenhuma família')

  return {
    spacingScale: numeric(Object.entries(spacing).map(([k, v]) => toPx(v, file, `spacing.${k}`))),
    radii: numeric(Object.entries(rounded).map(([k, v]) => toPx(v, file, `rounded.${k}`))),
    colorTokens: Object.entries(colors).map(([name, value]) => ({ name, rgb: parseColor(value, file, `colors.${name}`) })),
    fontFamilies,
    shadowTokens: Object.keys(shadows),
  }
}

/** Cabeçalho cru — o inventário `components` e o resto, para quem não é o detector. */
export function loadFrontmatter(path) {
  return parseFrontmatter(readFrontmatter(readFileSync(path, 'utf8'), path), path)
}

/**
 * Carrega o design system de `--ds`. `.json` é a forma legada (parse direto);
 * qualquer outra extensão é lida como DESIGN.md.
 * @returns {import('./contract.mjs').DesignSystem}
 */
export function loadDesignSystem(path) {
  const text = readFileSync(path, 'utf8')
  if (path.toLowerCase().endsWith('.json')) {
    try {
      return JSON.parse(text)
    } catch (err) {
      throw new DesignMdError(`${path}: JSON inválido — ${err.message}`)
    }
  }
  return toDesignSystem(parseFrontmatter(readFrontmatter(text, path), path), path)
}

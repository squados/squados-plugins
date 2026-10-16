// run.mjs
import { chromium } from 'playwright'
import { realpathSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { loadDesignSystem } from './design-md.mjs'
import { runChecks } from './checks/index.mjs'
import { scoreReport, formatReport } from './report.mjs'
import { MEASURE_FN_SOURCE } from './measure.mjs'

/** @returns {Promise<ReturnType<import('./report.mjs').scoreReport>>} */
export async function detect({ url, html, designSystem = null, medium = 'web', viewport = { width: 1280, height: 800 } }) {
  const browser = await chromium.launch()
  try {
    // Dev server local costuma servir HTTPS autoassinado (ex.: Vite em https://localhost).
    const page = await browser.newPage({ viewport, ignoreHTTPSErrors: true })
    if (html) await page.setContent(html, { waitUntil: 'networkidle' })
    else await page.goto(url, { waitUntil: 'networkidle' })
    // page.evaluate(string) evaluates the string as an EXPRESSION — it does not
    // auto-invoke an arrow-function literal, it just returns the function value
    // itself (which serializes to undefined). Wrap as an IIFE to actually call it.
    const measured = await page.evaluate(`(${MEASURE_FN_SOURCE})()`)
    const input = { elements: measured.elements, viewport: measured.viewport, designSystem, medium }
    return scoreReport(runChecks(input))
  } finally {
    await browser.close()
  }
}

// CLI
// `file://${process.argv[1]}` breaks on Windows (backslashes, unescaped spaces
// never match the percent-encoded import.meta.url) — pathToFileURL is the
// cross-platform-correct "is this module the entry point" check. When this
// file is reached through a Windows junction (e.g. `$SKILL_DIR/...`
// pointing at a real repo elsewhere), import.meta.url resolves to the real
// target path while argv[1] keeps the junction path — realpathSync resolves
// both to the same underlying file before comparing.
if (process.argv[1] && import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href) {
  const arg = process.argv[2]
  const dsArg = process.argv.indexOf('--ds')
  // `--ds` aceita o DESIGN.md (fonte canônica: o cabeçalho YAML) ou um tokens file
  // JSON (forma legada). Erro de leitura sai com codigo 2 — que NAO se confunde com o
  // 1 do gate BLOCKED nem com o 0 do PASS. Nunca cair para `designSystem: null`: os
  // checks fazem `if (ds)`, entao DS malformado que degradasse aqui daria PASS por
  // ausencia de regua.
  let designSystem = null
  if (dsArg > -1) {
    const dsPath = process.argv[dsArg + 1]
    if (!dsPath) {
      console.error('--ds sem caminho de arquivo')
      process.exit(2)
    }
    try {
      designSystem = loadDesignSystem(dsPath)
    } catch (err) {
      console.error(`--ds invalido: ${err.message}`)
      process.exit(2)
    }
  }
  const medArg = process.argv.indexOf('--medium')
  const medium = medArg > -1 ? process.argv[medArg + 1] : 'web'
  if (!['web', 'print', 'slide'].includes(medium)) {
    console.error(`--medium inválido: ${medium} (use web|print|slide)`)
    process.exit(2)
  }
  // Arquivo entra como file:// URL, NAO como `html` para `setContent`: com
  // setContent a pagina nao tem base URL, entao `<link rel=stylesheet href=...>`
  // relativo e `<img src=...>` local nao carregam — o detector mediria o HTML
  // CRU e devolveria um veredito sobre uma pagina sem estilo nenhum. Ja custou
  // uma rodada inteira de "fixes" para defeitos que nao existiam.
  const isFile = arg && !/^https?:/.test(arg)
  const opts = isFile
    ? { url: pathToFileURL(resolve(arg)).href, designSystem, medium }
    : { url: arg, designSystem, medium }
  const report = await detect(opts)
  console.log(formatReport(report))
  process.exit(report.gate === 'BLOCKED' ? 1 : 0)
}

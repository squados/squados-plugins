// shot.mjs
// Captura de evidência visual da skill. Substitui o harness ad hoc que cada
// sessão reescrevia por heredoc (`capture.mjs`, `shoot.mjs`, recorte em Python):
// aquilo custava ~20k tokens de comando por sessão e nascia duas vezes quando errava.
//
// A saída padrão é UMA folha de contato — todas as variantes, temas e viewports
// lado a lado numa imagem só. Ler 24 PNGs um a um enche a janela e nunca esvazia;
// a folha entrega a mesma comparação por uma imagem.
//
//   node $SKILL_DIR/scripts/shot.mjs <alvo...> --out <dir> \
//     [--viewport 1280x800] [--theme light,dark] [--clip <seletor>] [--pad 16] \
//     [--theme-attr data-theme] [--wait 200] [--full] [--no-sheet]
//
// Aceita arquivo local ou URL. Cada alvo pode trazer um rótulo com `rotulo=caminho`.
import { chromium } from 'playwright'
import { mkdirSync, readFileSync, writeFileSync, realpathSync } from 'node:fs'
import { basename, extname, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

/** Lê `--flag valor` (repetível) e `--flag` booleano dos argumentos. */
function parseArgs(argv) {
  const targets = []
  const flags = {}
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (!arg.startsWith('--')) {
      targets.push(arg)
      continue
    }
    const name = arg.slice(2)
    const next = argv[i + 1]
    if (next === undefined || next.startsWith('--')) {
      flags[name] = true
      continue
    }
    if (flags[name] === undefined) flags[name] = next
    else flags[name] = [].concat(flags[name], next)
    i++
  }
  return { targets, flags }
}

function parseViewport(spec) {
  const match = /^(\d+)x(\d+)$/.exec(String(spec))
  if (!match) throw new Error(`--viewport inválido: ${spec} (use LARGURAxALTURA, ex.: 1280x800)`)
  return { width: Number(match[1]), height: Number(match[2]) }
}

/** `rotulo=caminho` ou só `caminho` (o rótulo vira o nome do arquivo). */
function parseTarget(spec) {
  const eq = spec.indexOf('=')
  const isUrl = /^https?:/.test(spec)
  if (eq > 0 && !isUrl && !/^[a-zA-Z]:[\\/]/.test(spec.slice(0, eq + 1))) {
    return { label: spec.slice(0, eq), ref: spec.slice(eq + 1) }
  }
  const ref = spec
  const label = isUrl ? ref.replace(/^https?:\/\//, '').replace(/[/?#]+/g, '-') : basename(ref, extname(ref))
  return { label, ref }
}

function toUrl(ref) {
  return /^https?:/.test(ref) ? ref : pathToFileURL(resolve(ref)).href
}

/**
 * Captura cada combinação alvo × viewport × tema.
 * @returns {Promise<Array<{file: string, label: string}>>}
 */
export async function shoot({
  targets,
  outDir,
  viewports = [{ width: 1280, height: 800 }],
  themes = ['light'],
  clip = null,
  pad = 16,
  themeAttr = null,
  wait = 0,
  full = false,
}) {
  mkdirSync(outDir, { recursive: true })
  const browser = await chromium.launch()
  const shots = []
  try {
    for (const theme of themes) {
      for (const viewport of viewports) {
        // Dev server local costuma servir HTTPS autoassinado (ex.: Vite em https://localhost).
        const context = await browser.newContext({ viewport, colorScheme: theme, ignoreHTTPSErrors: true })
        const page = await context.newPage()
        for (const target of targets) {
          await page.goto(toUrl(target.ref), { waitUntil: 'networkidle' })
          // Tema por atributo é o que a maioria dos produtos usa; `colorScheme`
          // sozinho só cobre quem lê `prefers-color-scheme`.
          if (themeAttr) {
            await page.evaluate(
              ([attr, value]) => document.documentElement.setAttribute(attr, value),
              [themeAttr, theme],
            )
          }
          if (wait) await page.waitForTimeout(wait)
          const suffix = `${viewport.width}x${viewport.height}-${theme}`
          const file = join(outDir, `${target.label}-${suffix}.png`)
          const options = { path: file }
          if (clip) {
            // Captura PELO elemento, não por recorte da página. Recortar exige
            // um fullPage inteiro, e numa landing longa (palco de scroll, 800vh)
            // ele estoura o teto de altura do Chromium: a imagem sai truncada e
            // a área do clip cai fora dela — "Clipped area is either empty or
            // outside the resulting image". O locator rola até o alvo e
            // fotografa só ele, independente da altura da página.
            const locator = page.locator(clip).first()
            await locator.scrollIntoViewIfNeeded()
            if (wait) await page.waitForTimeout(wait)
            const elOptions = { path: file }
            if (pad) {
              const box = await locator.boundingBox()
              if (!box) throw new Error(`--clip não encontrou "${clip}" em ${target.ref}`)
              elOptions.clip = {
                x: Math.max(0, box.x - pad),
                y: Math.max(0, box.y - pad),
                width: box.width + pad * 2,
                height: box.height + pad * 2,
              }
              await page.screenshot(elOptions)
            } else {
              await locator.screenshot(elOptions)
            }
            shots.push({ file, label: `${target.label} · ${suffix}` })
            continue
          } else if (full) {
            // fullPage expande a página e esconde o corte, o clamp e a scrollbar.
            // Só existe aqui para alvo impresso e landing longa, nunca como default.
            options.fullPage = true
          }
          await page.screenshot(options)
          shots.push({ file, label: `${target.label} · ${suffix}` })
        }
        await context.close()
      }
    }
    return shots
  } finally {
    await browser.close()
  }
}

/**
 * Monta a folha de contato: um HTML com as capturas embutidas em data URI,
 * fotografado pelo próprio Chromium. Sem dependência de biblioteca de imagem.
 */
export async function contactSheet(shots, outFile, columns = 0) {
  const cols = columns || Math.min(shots.length, shots.length > 4 ? 3 : 2)
  const cards = shots
    .map(({ file, label }) => {
      const data = readFileSync(file).toString('base64')
      const caption = label.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c])
      return `<figure><img src="data:image/png;base64,${data}" alt=""><figcaption>${caption}</figcaption></figure>`
    })
    .join('\n')
  const html = `<!doctype html><meta charset="utf-8"><style>
    :root { color-scheme: light }
    body { margin: 0; padding: 20px; background: #6e6e6e; font: 13px/1.4 ui-monospace, monospace; }
    .grid { display: grid; grid-template-columns: repeat(${cols}, 1fr); gap: 20px; align-items: start; }
    figure { margin: 0; background: #fff; border: 1px solid #000; }
    img { display: block; width: 100%; height: auto; }
    figcaption { padding: 6px 8px; border-top: 1px solid #000; color: #000; background: #fff; }
  </style><div class="grid">${cards}</div>`
  const htmlFile = outFile.replace(/\.png$/, '.html')
  writeFileSync(htmlFile, html, 'utf8')
  const browser = await chromium.launch()
  try {
    const page = await browser.newPage({ viewport: { width: 1600, height: 900 } })
    await page.goto(pathToFileURL(resolve(htmlFile)).href, { waitUntil: 'networkidle' })
    await page.locator('.grid').screenshot({ path: outFile })
  } finally {
    await browser.close()
  }
  return outFile
}

if (process.argv[1] && import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href) {
  const { targets, flags } = parseArgs(process.argv.slice(2))
  if (!targets.length || !flags.out) {
    console.error('uso: shot.mjs <alvo...> --out <dir> [--viewport 1280x800] [--theme light,dark]')
    console.error('     [--clip <seletor>] [--pad 16] [--theme-attr data-theme] [--wait ms] [--full] [--no-sheet]')
    process.exit(2)
  }
  const viewports = [].concat(flags.viewport || '1280x800').map(parseViewport)
  const themes = String(flags.theme || 'light').split(',').map((t) => t.trim())
  for (const theme of themes) {
    if (!['light', 'dark'].includes(theme)) {
      console.error(`--theme inválido: ${theme} (use light, dark ou light,dark)`)
      process.exit(2)
    }
  }
  const outDir = resolve(String(flags.out))
  const shots = await shoot({
    targets: targets.map(parseTarget),
    outDir,
    viewports,
    themes,
    clip: flags.clip === true ? null : flags.clip || null,
    pad: Number(flags.pad ?? 16),
    themeAttr: flags['theme-attr'] === true ? 'data-theme' : flags['theme-attr'] || null,
    wait: Number(flags.wait ?? 0),
    full: flags.full === true,
  })
  for (const shot of shots) console.log(shot.file)
  if (flags['no-sheet'] !== true && shots.length > 1) {
    const sheet = await contactSheet(shots, join(outDir, 'contact-sheet.png'), Number(flags.columns ?? 0))
    console.log(`SHEET: ${sheet}`)
    console.log('Leia SÓ a folha de contato. Abrir os PNGs individuais é a exceção, não o passo seguinte.')
  }
}

import { execFileSync } from 'node:child_process'
import { cpSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'

const root = fileURLToPath(new URL('../', import.meta.url))
const gallery = join(root, 'motion-gallery')
const engineVersion = '0.8.33'
const { positionals, values } = parseArgs({
  allowPositionals: true,
  options: {
    inputs: { type: 'string' },
    out: { type: 'string' },
    help: { type: 'boolean' },
  },
})
const normalize = value => value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()
const { entries } = JSON.parse(readFileSync(join(gallery, 'catalog.json'), 'utf8'))

if (values.help) {
  console.log('node scripts/render-motion.mjs "<nome ou ID>" [--inputs dados.json] [--out vídeo.mp4|.mov|.webm]')
  console.log('Com --inputs e sem --out, atualiza o vídeo no cartão da galeria.')
  process.exit(0)
}

try {
  if (positionals.length !== 1) throw Error('Informe um nome ou ID. Veja --help.')
  const requested = normalize(positionals[0])
  const selected = entries.find(entry =>
    [entry.id, entry.title, ...(entry.aliases ?? []), ...(entry.previousIds ?? [])].some(name => normalize(name) === requested),
  )
  if (!selected) throw Error('Efeito próprio não encontrado. Consulte motion-gallery/catalog.json.')
  const preset = Object.entries(selected.demo.presets ?? {}).find(([name]) => normalize(name) === requested)?.[1]
  render(selected, preset)
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}

function render(entry, preset) {
  const preview = !values.out
  const output = values.out ? resolve(values.out) : join(gallery, entry.demo.preview)
  const format = extname(output).slice(1).toLowerCase()
  if (!['mp4', 'mov', 'webm'].includes(format)) throw Error('Use uma saída .mp4, .mov ou .webm.')
  const rawInputs = values.inputs ? JSON.parse(readFileSync(resolve(values.inputs), 'utf8')) : {}
  if (!rawInputs || Array.isArray(rawInputs) || typeof rawInputs !== 'object') throw Error('As entradas devem ser um objeto JSON.')
  for (const name of Object.keys(rawInputs)) {
    if (!Object.hasOwn(entry.demo.inputs, name)) throw Error('Entrada desconhecida: ' + name)
  }
  for (const name of entry.demo.required ?? []) {
    if (!rawInputs[name]) throw Error('Informe a entrada ' + name + ' com --inputs.')
  }

  const scratch = join(root, '.scratch')
  mkdirSync(scratch, { recursive: true })
  const temp = mkdtempSync(join(scratch, 'motion-render-'))
  let pendingOutput
  try {
    const project = join(temp, 'scene')
    cpSync(dirname(join(gallery, entry.demo.composition)), project, { recursive: true })
    const inputs = { ...entry.demo.previewInputs, ...preset, ...rawInputs }
    const inputDirectory = values.inputs ? dirname(resolve(values.inputs)) : dirname(join(gallery, entry.demo.composition))
    const stageMedia = (value, name, videoAllowed) => {
      if (typeof value !== 'string' || !value.trim()) throw Error('Informe um arquivo para ' + name + '.')
      const file = resolve(inputDirectory, value)
      const extension = extname(file).toLowerCase()
      const images = ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.avif']
      const videos = ['.mp4', '.mov', '.m4v', '.webm']
      if (!(images.includes(extension) || (videoAllowed && videos.includes(extension))) || !statSync(file).isFile()) {
        throw Error('Formato de mídia inválido para ' + name + '.')
      }
      const staged = 'input-' + name + extension
      cpSync(file, join(project, staged))
      return staged
    }
    for (const [name, type] of Object.entries(entry.demo.inputs)) {
      if (!Object.hasOwn(inputs, name)) continue
      if (type === 'images') {
        if (!Array.isArray(inputs[name])) throw Error('Informe uma lista de imagens para ' + name + '.')
        inputs[name] = inputs[name].map((value, index) => value == null ? null : stageMedia(value, name + '-' + index, false))
      } else if (type === 'media' || type === 'image') {
        inputs[name] = stageMedia(inputs[name], name, type === 'media')
      }
    }

    const entryPath = join(project, 'index.html')
    let source = readFileSync(entryPath, 'utf8').replace(
      /<!-- motion-media:([a-zA-Z]+):([\d.]+):([\d.]+):([\d]+)(?::([a-zA-Z]+))? -->/g,
      (_marker, name, defaultStart, defaultDuration, track, startInput) => {
        if (!inputs[name]) return ''
        const end = Number(defaultStart) + Number(defaultDuration)
        const requested = inputs[startInput]
        const start = Number.isFinite(requested) ? Math.max(0, Math.min(end - .1, requested)) : Number(defaultStart)
        const duration = end - start
        const attrs = `id="motion-media-${name}" src="${inputs[name]}"`
        return /\.(mp4|mov|m4v|webm)$/i.test(inputs[name])
          ? `<video ${attrs} class="clip" data-start="${start}" data-duration="${duration}" data-track-index="${track}" data-volume="0" muted playsinline></video>`
          : `<img ${attrs} alt="">`
      },
    )
    if (source.includes('../motion-assets/')) {
      // The renderer serves only files inside the staged project.
      cpSync(join(gallery, 'scenes', 'motion-assets'), join(project, 'motion-assets'), { recursive: true })
      source = source.replaceAll('../motion-assets/', 'motion-assets/')
    }
    const payload = JSON.stringify(inputs).replaceAll('<', '\\u003c')
    const bridge = `<script>
      // HyperFrames 0.8.33 seeks registered timelines for every captured frame.
      let motionTime = 0;
      const motionTimeline = {
        duration: () => ${entry.seconds},
        totalDuration: () => ${entry.seconds},
        paused: () => true,
        pause() { return this; },
        play() { return this; },
        time(value) {
          if (value === undefined) return motionTime;
          motionTime = value;
          window.renderMotion(value);
          return this;
        },
        totalTime(value) { return this.time(value); },
        seek(value) { return this.time(value); },
        getChildren: () => []
      };
      window.__timelines = { ${JSON.stringify(entry.id)}: motionTimeline };
    </script>`
    writeFileSync(entryPath, source
      .replace('</head>', () => `<script>window.motionInputs = ${payload};</script></head>`)
      .replace('</body>', () => bridge + '</body>'))

    mkdirSync(dirname(output), { recursive: true })
    const raw = join(temp, 'render.' + format)
    const flags = ['render', project, '--output', raw, '--format', format, '--fps', '30', '--workers', '1', '--quality', 'high']
    const options = { cwd: root, stdio: 'inherit', env: { ...process.env, HF_TELEMETRY_DISABLED: '1' } }
    const engine = process.env.MOTION_HYPERFRAMES_CLI || findCachedEngine()
    if (engine) {
      execFileSync(process.execPath, [engine, ...flags], options)
    } else {
      // Invoking npx-cli.js avoids shell quoting issues with media paths on Windows.
      const npxCli = join(dirname(process.execPath), 'node_modules', 'npm', 'bin', 'npx-cli.js')
      if (process.platform === 'win32') execFileSync(process.execPath, [npxCli, '--yes', 'hyperframes@' + engineVersion, ...flags], options)
      else execFileSync('npx', ['--yes', 'hyperframes@' + engineVersion, ...flags], options)
    }
    pendingOutput = output + '.' + process.pid + '.tmp'
    if (preview) {
      execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', raw, '-vf', 'scale=960:540',
        '-c:v', 'libx264', '-crf', '20', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-f', 'mp4', pendingOutput], options)
    } else {
      cpSync(raw, pendingOutput)
    }
    renameSync(pendingOutput, output)
    console.log(output)
  } finally {
    if (pendingOutput) rmSync(pendingOutput, { force: true })
    rmSync(temp, { recursive: true, force: true })
  }
}

function findCachedEngine() {
  const cache = process.env.npm_config_cache || (process.env.LOCALAPPDATA && join(process.env.LOCALAPPDATA, 'npm-cache'))
  if (!cache) return
  const npxCache = join(cache, '_npx')
  let directories
  try {
    directories = readdirSync(npxCache, { withFileTypes: true })
  } catch (error) {
    if (error.code === 'ENOENT') return
    throw error
  }
  for (const directory of directories.filter(item => item.isDirectory())) {
    const packageDir = join(npxCache, directory.name, 'node_modules', 'hyperframes')
    try {
      const manifest = JSON.parse(readFileSync(join(packageDir, 'package.json'), 'utf8'))
      if (manifest.version === engineVersion && typeof manifest.bin?.hyperframes === 'string') {
        const cli = join(packageDir, manifest.bin.hyperframes)
        if (statSync(cli).isFile()) return cli
      }
    } catch (error) {
      if (error.code !== 'ENOENT') throw error
    }
  }
}

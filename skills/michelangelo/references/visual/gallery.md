# Galeria de opções

Mecanismo para apresentar **variantes** lado a lado quando a mudança pedida é ampla
demais para aplicar às cegas. Nos níveis DS e tela são 3 variantes; no nível delta (ver
§Três níveis de variante) é um número de cards que segue os deltas da rodada. Inspirado no
`live` do impeccable: cada variante varia um eixo primário e expõe params ajustáveis via CSS
vars. Entrega final: **um HTML único navegável** (abas ou lado a lado) que o usuário abre no
browser e escolhe — nunca arquivos soltos, nunca uma escolha forçada sem visualizar.

## Opt-in por escopo

A galeria custa render (LLM + detector 3x) — não é o caminho default.

- **REDESIGN** → gera as 3 opções conforme `SKILL.md` §Abertura, sem opt-in adicional.
- **Pedido estreito sem REDESIGN** ("corrige os paddings", "aumenta a fonte do body", "ajusta essa
  cor de borda") → aplica direto, **sem galeria**. O usuário já disse o que quer.
- **Pedido amplo sem REDESIGN** ("deixa isso bonito", "repensa essa tela", "gera a landing do zero")
  → **perguntar antes** de gerar: *"Quer que eu monte 3 direções pra você escolher, ou
  aplico direto o que parece melhor?"* Só gera a galeria depois de confirmação.

Essa é a mesma bifurcação usada em `design-system/new.md` (reforma ampla → 3 direções) e em
`polish.md` (escopo amplo → oferecer a galeria) — este arquivo é o formato compartilhado
que os dois modos produzem.

## Três níveis de variante

A galeria serve os modos com **três** níveis; o que varia entre as opções muda por nível:

- **Nível DS** (chamado por `design-system/new.md`, critério em `directions.md`): 3
  **direções de linguagem visual** — cada uma variando um eixo primário diferente
  (hierarquia / topologia / densidade / tipografia / cor). Aqui as variantes **podem
  fugir do DS atual** — propor um padrão que ainda não existe (ex.: um bento grid num DS
  que só tem cards simples). Aceitar uma variante off-DS = **promover pro DS** (a
  catraca de `design-system/new.md`: o que é aceito vira token/padrão documentado, não fica
  solto).
- **Nível tela** (chamado por `polish.md`): 3 **arranjos de layout** do mesmo conteúdo,
  dentro do DS já fixado (ou propondo uma expansão pontual dele). Aqui a variação é de
  arranjo — ordem de blocos, proporção de colunas, ênfase de hero — não de linguagem
  visual nova.
- **Nível delta** (chamado por `design-system/improve.md` §Passo 4): **N cards
  independentes antes/depois**, não 3 opções concorrentes. Cada card é um delta de DS
  proposto (ex.: "razão da escala tipográfica 1.2 → 1.25"), com o **antes** (canvas atual da
  seção) e o **depois** (o mesmo canvas com o delta aplicado) lado a lado. O usuário
  liga/desliga/refina por card; o conjunto ligado ao fim da rodada é o que vai para a escrita
  de volta no DS (`design-system/improve.md` §Passo 5). Ao contrário dos níveis DS e tela, o
  número de cards não é fixo em 3 — é quantos deltas de alto impacto a fatia da rodada tiver.

Nos níveis DS e tela são sempre 3 variantes (menos que isso não é escolha real, mais dilui
a decisão); no nível delta o número segue os deltas de alto impacto da rodada, não um alvo
fixo.

## Cada variante é standalone

"Standalone" aqui quer dizer: **cada variante é um documento HTML completo e
autossuficiente** (`<!doctype>` + `<head>` com Tailwind via CDN OU um bloco `<style>`
inline — nunca dependendo de CSS/JS de outra variante ou de asset externo que possa
falhar). Isso garante duas coisas:
1. **Sempre renderiza**, mesmo isolada — nada de "só funciona dentro da galeria".
2. **É o mesmo arquivo que passa pelo gate** (abaixo) — o detector roda em cima do
   documento exatamente como ele existe, sem extração/transformação.

Fluxo de montagem:

1. Gerar as 3 variantes como 3 arquivos `.html` completos e independentes, dentro da
   pasta datada de trabalho `<OUT>` (`<OUT>/variant-1.html`…`variant-3.html`, SKILL.md
   §Pasta de saída) — nunca soltas na raiz nem fora do repo.
2. Rodar o gate em cada uma (próxima seção). Corrigir e regenerar até `PASS`.
3. Montar o arquivo final da galeria em `<OUT>/gallery.html`: um shell com abas (ou
   colunas lado a lado) onde cada painel é um `<iframe>` apontando pro (ou com `srcdoc`
   do) HTML standalone correspondente — os `src="variant-N.html"` são relativos, então
   as variantes ficam ao lado do `gallery.html` na mesma pasta `<OUT>`. O `iframe` é o que preserva o isolamento — cada variante roda no seu
   próprio documento, sem vazamento de CSS entre abas, e o que o usuário vê no iframe é
   *exatamente* o que passou no gate.

Esqueleto mínimo do shell (abas):

```html
<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <title>Galeria — 3 direções</title>
  <style>
    .tabs { display: flex; gap: 8px; padding: 12px; }
    .tabs button[aria-selected="true"] { font-weight: 700; }
    iframe { width: 100%; height: 90vh; border: 0; }
    .panel { display: none; }
    .panel.active { display: block; }
  </style>
</head>
<body>
  <div class="tabs" role="tablist">
    <button role="tab" aria-selected="true" data-target="v1">Direção 1 — hierarquia</button>
    <button role="tab" aria-selected="false" data-target="v2">Direção 2 — densidade</button>
    <button role="tab" aria-selected="false" data-target="v3">Direção 3 — cor</button>
  </div>
  <div id="v1" class="panel active"><iframe src="variant-1.html"></iframe></div>
  <div id="v2" class="panel"><iframe src="variant-2.html"></iframe></div>
  <div id="v3" class="panel"><iframe src="variant-3.html"></iframe></div>
  <script>
    document.querySelectorAll('[role="tab"]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[role="tab"]').forEach(b => b.setAttribute('aria-selected', 'false'));
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        btn.setAttribute('aria-selected', 'true');
        document.getElementById(btn.dataset.target).classList.add('active');
      });
    });
  </script>
</body>
</html>
```

Lado a lado é a mesma estrutura sem o JS de abas — os 3 `.panel` ficam visíveis ao mesmo
tempo em colunas (`display: grid; grid-template-columns: repeat(3, 1fr)`).

## Artifact — a entrega que o usuário vê

O `<OUT>/gallery.html` acima é o arquivo de trabalho. **A entrega é um Artifact publicado**
(`SKILL.md` §Entrega visual), e isso vale para TODA comparação visual que a skill produz:
as 3 direções, os cards de delta, o par antes/depois do `rebuild`.
Sem Artifact, o usuário está sendo convidado a abrir `file://` e a
escolher design por print — que é escolher sem hover, sem foco, sem scroll e sem o texto
real.

**Antes de escrever o arquivo, carregue a skill `artifact-design`** — é requisito da
ferramenta `Artifact`, não zelo.

### O que quebra calado num Artifact

O arquivo publicado é embrulhado num `<!doctype>…<head></head><body>` no momento do
publish, e vive sozinho num host com CSP estrita. Quatro coisas que funcionam em `file://`
e morrem lá:

1. **Caminho relativo.** `<iframe src="variant-1.html">` e `<link href="../base.css">`
   apontam para arquivos que não existem depois do publish. Uma variante entra por
   `<iframe srcdoc="…">` com o documento inteiro escapado (`&` → `&amp;`, `"` → `&quot;`,
   `<` → `&lt;`); o CSS compartilhado do harness entra inline **dentro** de cada `srcdoc`.
   O `srcdoc` é o que preserva o isolamento e garante que o que o usuário vê é *exatamente*
   o documento que passou no gate.
2. **`<!doctype>`/`<html>`/`<head>`/`<body>` seus.** No arquivo que você passa para o
   `Artifact` eles são proibidos — escreva o conteúdo direto. Dentro do `srcdoc`, ao
   contrário, o documento completo é obrigatório: é outro documento.
3. **Asset externo.** Só `fonts.googleapis.com` / `fonts.gstatic.com` passam. Qualquer
   outro host — CDN de script, imagem remota, `fetch` — é bloqueado. Embuta o resto como
   `data:` URI, dentro do teto de 16 MB da página renderizada.
4. **Tema do visitante.** A página renderiza no tema de quem abre, e o host pinta o fundo
   atrás dela: sem `background` explícito no `body`, a casca da galeria empresta o fundo do
   host e some. Defina os tokens no `:root` e repita-os em
   `@media (prefers-color-scheme: dark)` guardado por `:root:not([data-theme="light"])` e
   em `:root[data-theme="dark"]`.

### Composição da casca

A casca é o **enquadramento da escolha**, não uma variante a mais: fundo neutro, um
cabeçalho curto dizendo o que está em jogo, e por versão um rótulo com o eixo que ela varia,
uma linha do trade-off e o veredito do gate. Abas quando as versões são alternativas
concorrentes; colunas lado a lado quando o valor está na comparação simultânea (é o caso do
antes/depois). Nunca esconda o antes atrás de uma aba num redesign — é a metade que prova
magnitude (`rebuild.md` §Passo 5).

O `<iframe>` precisa de altura explícita (`height: 92vh` ou a altura real do alvo) e
`width: 100%`; conteúdo largo rola dentro do próprio iframe, nunca no corpo da página.

Regras de publicação: `title` é o nome curto da peça (não "Galeria de 3 direções"),
`description` é a frase que explica a escolha, `favicon` é obrigatório e **estável entre
redeploys**. Republicar é reusar o **mesmo `file_path`** — caminho novo é URL nova, e o
usuário perde o link que já tinha.

### Alvo impresso

PDF não entra em `srcdoc`. Rasterize as páginas-tipo (`rebuild.md` §Verificação cruzada, o
mesmo `pymupdf` que já roda) e embuta os PNG como `data:` URI, lado a lado por tipo de
página. Conte o teto de 16 MB antes de gerar em 2x: uma capa e três páginas costumam caber;
um livro inteiro não.

### O gate vem antes

Nada entra no Artifact com gate `BLOCKED` — a regra da seção anterior não afrouxa por ser
uma URL bonita. Se uma versão não fecha, ela não vira aba; o que vai para o chat é o
motivo, não uma ressalva dentro da galeria.

## Params ajustáveis via CSS vars

Cada variante expõe **0 a 4 params** no `:root` do seu próprio documento standalone,
como custom properties que controlam um eixo contínuo — não uma escolha binária. Os dois
params mais usados:

- `--density` (`0.6` a `1.4`): multiplica espaçamento vertical/horizontal (padding de
  seção, gap entre irmãos). `1.0` é o baseline do register (ver `register.md`).
- `--scale` (`0.85` a `1.3`): multiplica a escala tipográfica (aplicado em `clamp()` ou
  em `font-size` via `calc()`), sem trocar a razão da escala em si.

Exemplo de wiring dentro do `<style>` da variante:

```css
:root {
  --density: 1;
  --scale: 1;
}
.section {
  padding-block: calc(4rem * var(--density));
}
h1 {
  font-size: calc(3rem * var(--scale));
}
```

Isso deixa o param ajustável no devtools do próprio browser (sem nova chamada de LLM)
para o usuário testar micro-variação antes de comprometer com uma direção. Params são
opcionais — uma variante pode ter 0 se não houver eixo contínuo relevante (ex.: uma
direção que só muda topologia de grid não precisa de slider).

## Gate obrigatório antes de entrar na galeria

Nenhuma variante entra na galeria sem passar pelo detector primeiro — a galeria nunca
expõe ao usuário uma opção que já sabemos estar quebrada.

```bash
node scripts/detector/run.mjs variant-1.html [--ds DESIGN.md]
node scripts/detector/run.mjs variant-2.html [--ds DESIGN.md]
node scripts/detector/run.mjs variant-3.html [--ds DESIGN.md]
```

- Gate `PASS` (`P0 + P1 == 0`, ver `contract.mjs`/`report.mjs`) → a variante pode entrar
  no shell da galeria como está.
- Gate `BLOCKED` (qualquer P0 ou P1) → **corrigir o HTML da variante e rodar de novo**,
  em loop, até `PASS`. Nunca incluir uma variante `BLOCKED` "com ressalva" — o usuário
  não deve escolher entre opções que o detector já reprovou. P2/P3 são aceitáveis (ficam
  visíveis no report, não bloqueiam).
- Passe `--ds` sempre que já existir um DS fixado (modo `polish`, ou caminho `design-system new`
  medindo aderência às direções que **não** pretendem fugir dele) — sem `--ds` o detector
  só valida limites absolutos, não consistência com o sistema.

No **nível delta**, cada card antes/depois é uma variante para efeito do gate: o "depois" de
cada delta passa pelo detector com `PASS` antes de o usuário ver — um delta que o detector
reprova nunca vira card.

## Depois da escolha

O usuário escolhe uma aba/coluna. Se a variante escolhida introduziu um padrão fora do
DS atual, promovê-lo (`DESIGN.md`, pelo caminho `design-system improve`) é o próximo
passo — ver a catraca em
`design-system/new.md`. Se veio do modo `polish`, o arranjo escolhido vira o código final da
tela, e o briefing em `<OUT>/briefing.md` é atualizado/fechado conforme
`polish.md`.

# Regras de craft para geração

Regras concretas para produzir UI bonita — usadas pela geração das 3 variantes (galeria)
e como referência de correção pelo `polish`. Não são sugestões: são os alvos que o
detector determinístico (`scripts/detector/`) mede e reprova.
Toda decisão de estrutura passa primeiro pelo princípio de DRY reuse-first (última seção)
antes de qualquer regra visual abaixo.

## Tipografia

- **Medida de corpo: 65-75ch.** Acima de 80ch o olho perde a linha ao voltar — reprova
  (`line-length`). Em colunas largas, quebre em multi-coluna ou reduza o `max-width` do
  bloco de texto, não o da página.
- **Escala com ratio, nunca valores soltos.** Register **brand** (o design É o produto —
  landing, portfólio): ratio maior, 1.25/1.333/1.5 — mais salto entre níveis, mais respiro.
  Register **product** (o design SERVE o produto — app, dashboard): ratio menor, 1.125-1.2 —
  mais densidade, hierarquia mais sutil. Escolha o register antes de gerar a escala; não
  misture ratios dentro da mesma tela.
- **Teto de display ≤6rem.** Display maior que isso vira pôster, não UI. Para H1 responsivo
  use `clamp(min, preferred, max)` com o `max` ≤2.5× o `min` — cresce em telas grandes sem
  disparar.
- **H1 em 2-3 linhas, nunca 6.** H1 de 6 linhas é sintoma de slop (título fazendo o trabalho
  de um parágrafo). Force isso com `max-w` largo no container do heading (não estreito — o
  objetivo é caber mais por linha) combinado com o `clamp` de tamanho, não com `line-clamp`
  cortando texto.
- **Corpo nunca abaixo de 16px/1rem.** `tiny-text` (<12px) reprova sempre; entre 12-16px é
  aceitável só em metadata/legenda, nunca em texto de leitura.
- **Leading por papel, não um valor único pro documento inteiro.** Heading: 1.1-1.2 (linhas
  curtas, comprimidas). Corpo: 1.5-1.7 (linhas longas, precisam de respiro vertical pra não
  embolar). `tight-leading` (<1.3× em corpo) reprova.
- **Tracking:** `wide-tracking` (>0.05em) e `extreme-negative-tracking` (≤-0.05em) reprovam
  — ambos os extremos read como amadores, não como refinamento.
- **Poucas famílias tipográficas.** Uma para display/heading, uma para corpo (podem ser a
  mesma família em pesos diferentes); uma terceira só se for mono para código/dados.

## Cor

- **Escolha uma estratégia de accent, não misture.** **Restrained** (accent em ≤10% da
  composição — pontual, em CTAs e estados-chave, resto é neutro): o default seguro pra
  product/dashboard. **Committed** (accent em 30-60% — cor carrega blocos inteiros, seções
  alternam fundo): landing/brand com identidade forte. **Full** (cor domina a maior parte
  da tela): casos editoriais/expressivos deliberados. **Drenched** (quase monocromático,
  1-2 hues saturados cobrindo tudo, neutros quase ausentes): identidade extrema, uso raro e
  intencional. Decida a estratégia pelo register+vibe antes de gerar, não no meio da
  composição.
- **Neutros tingidos, nunca cinza puro.** Adicione chroma de +0.005 a +0.015 (em oklch) na
  direção do accent principal em todo cinza/neutro da paleta — fundo, borda, texto
  secundário. Cinza puro ao lado de um accent saturado lê como fora de sistema.
  Especifique cor em **oklch** (não hex/hsl cru) para manter luminosidade perceptual
  consistente ao gerar tints/shades da mesma escala.
  - Exemplo prático: accent `oklch(0.55 0.18 260)` (azul) → neutro-100 não é
    `oklch(0.96 0 0)`, é `oklch(0.96 0.008 260)` — mesmo hue, chroma quase zero.
- **Nunca "roxo de IA".** Gradiente `#7c3aed`→`#a855f7`/similares, ou qualquer glow genérico
  nessa faixa de hue, é o tell mais reconhecível de slop — banido por padrão, não é uma
  opção de estilo. Se o brief pedir roxo de propósito, ainda assim tinja/desature o
  suficiente para não cair no range detectado (ver `references/visual/slop.md`).
- **Contraste é piso, não teto.** Corpo ≥4.5:1, texto grande (≥18px ou bold ≥14px) ≥3:1,
  placeholder ≥4.5:1. Meça no par real fundo/texto renderizado, não na intenção.
- **Cor de marca no meio da escala de luminância não serve como tipografia — precisa de um
  segundo token.** Uma marca cujo accent fica em torno de L≈55-65% (corais, laranjas, verdes
  médios, ciano) reprova nos DOIS sentidos: como texto sobre fundo claro E com texto claro por
  cima. Não é caso de "escurecer um pouco no olho": calcule. O padrão correto é **dois tokens
  com papéis declarados** — `accent` (gráfico puro: filete, faixa, borda, bloco sem texto) e
  `accent-forte` (tipográfico, verificado ≥4.5:1 sobre o fundo e com texto claro por cima).
  Marcas reais caem nisso o tempo todo: o coral do Claude `#D97757` dá 2.69:1 como texto sobre
  o cream `#F0EEE6` e 3.12:1 com branco por cima — reprova nas duas pontas, e `#A8502A`
  resolve as duas (4.70:1 e 5.46:1). Confirmado 30/07 (ibeia-ebooks). Fazer isso ANTES de
  desenhar evita gerar uma direção inteira bonita e ilegível.
- **Poucos accents, saturação contida.** Mais de 2-3 cores de accent na mesma tela dilui
  hierarquia; saturação de accent <80% evita o "néon" que também lê como slop.

## Espaço

- **Escala fixa de 4pt: `4/8/12/16/24/32/48/64/96px`.** Todo padding/margin/gap sai dessa
  lista — nunca um valor arbitrário (`13px`, `22px`) que não serve a nenhum nível de
  hierarquia.
- **Gap entre irmãos: 8-12px.** Itens da mesma lista/grupo (itens de lista, botões lado a
  lado, tags) ficam nessa faixa — perto o bastante pra ler como grupo.
- **Separação entre seções: 48-96px.** Blocos de conteúdo distintos (hero → features,
  features → footer) precisam desse respiro pra o olho registrar "seção nova" sem precisar
  de uma borda/divider explícita.
- **`gap` no lugar de `margin` entre irmãos.** Margin empilhada em cada filho é frágil (o
  espaçamento muda se um item é removido/reordenado) e tende a duplicar-se em pontos de
  colapso. Em containers flex/grid, o espaçamento entre irmãos é responsabilidade do pai
  via `gap`, não de cada filho anunciar sua própria margem.
- **Evite os furos do impeccable:** `sibling-gap-too-tight` reprova gap abaixo do mínimo
  esperado pro nível de hierarquia **mesmo sem container delimitado** — não dá pra
  justificar espaçamento apertado como "está fora de um container, não conta".
  `monotonous-spacing` reprova quando um único valor domina >60% dos espaçamentos da tela
  com ≤3 valores únicos no total — sinal de que a escala não está sendo usada com
  intenção, só repetida.

## Sombra

- **Sutil, não decorativa.** Sombra existe para separar plano (card sobre fundo, dropdown
  sobre conteúdo), não para "dar profundidade" genérica. Se a sombra é percebida antes do
  conteúdo, está forte demais.
- **1-2 camadas, nunca mais.** Uma sombra próxima e nítida (contato) + opcionalmente uma
  sombra distante e difusa (elevação) é o teto. Empilhar 3+ camadas de `box-shadow`
  normalmente está compensando falta de contraste de cor/borda em vez de resolver a causa.
- **Cor da sombra tingida pelo fundo, nunca preto puro.** `rgba(0,0,0,.2)` sobre um fundo
  colorido lê como sujeira, não como profundidade. Derive a cor da sombra do hue do fundo
  (mais escuro e menos saturado que ele), do mesmo jeito que os neutros são tingidos pelo
  accent.

## Grid

- **"Grid over flex-math."** Nunca calcule colunas com `w-[calc(33.333%-16px)]` ou
  equivalente — isso é fazer matemática de grid manualmente dentro de flex. Use `grid` +
  `gap`: o browser resolve o cálculo e o gap não precisa ser subtraído à mão em cada célula.
  `w-[calc(...%-...)]` para colunas é reprovado pelo detector.
- **`min-h-[100dvh]`, não `h-screen`.** `h-screen` usa `100vh`, que em mobile não desconta a
  UI do browser (barra de endereço) e causa overflow/scroll fantasma. `min-h-[100dvh]`
  respeita a viewport dinâmica real e ainda permite que o conteúdo cresça além dela quando
  necessário (por isso `min-h`, não `h`).
- **Sem célula morta em bento.** Todo espaço de uma grid bento carrega conteúdo com
  intenção; célula vazia "porque sobrou espaço" é retrabalho de layout, não decisão de
  design.

## Hover / transições

- **Durações por papel do movimento, não um valor global.** Entrada de elemento (algo
  aparecendo na tela — modal, seção revelada): 300-500ms `ease-out`. Hover (resposta a
  intenção do usuário passando o mouse): 150-200ms. Press/active (resposta a clique/toque,
  precisa parecer instantânea): 100-150ms. Inverter essa ordem (hover mais lento que
  entrada, por exemplo) faz a interface parecer com resposta atrasada.
- **Todo elemento interativo tem estado.** Botão, link, item clicável sem `transition` e
  sem estado `:hover`/`:focus-visible` reprova (`elemento interativo sem transition/hover`)
  — interatividade sem feedback visual não comunica que é interativo.
- **`prefers-reduced-motion` sempre respeitado.** Motion pesado já está fora de escopo
  (§13 do spec — hover/transições CSS entram, orquestração scroll-driven/GSAP não); as
  transições que entram devem cair para instantâneo/quase-instantâneo quando o usuário
  pediu menos movimento, não apenas "mais rápido".

## DRY (reuse-first) — princípio fundamental

Reuse-first é reflexo desde a primeira decisão de estrutura, não faxina depois que a UI já
existe.

- **Antes de criar qualquer componente/modal/bloco, varra o projeto atrás de algo
  reutilizável** — componente, modal, token, util — que sirva como está ou possa ser
  adaptado. Reusar/adaptar vem antes de escrever algo novo do zero.
- **Padrão que se repete é componentizado, não copiado.** Se a mesma estrutura visual (card,
  seção, modal) aparece de novo, o passo correto é extrair o reutilizável — não colar o
  JSX/HTML de novo com pequenas variações.
- **Extraia com 3+ usos da mesma intenção.** Menos que isso é abstração prematura (o
  formato "certo" ainda não se revelou); na 3ª repetição com a mesma intenção, extrai.
- **Tokens em vez de valores crus.** Cor, espaçamento, raio, sombra saem de tokens
  (semânticos quando existem, primitivos quando não) — nunca um hex, px ou rgba solto
  competindo com o design system.
- **As 3 variantes da galeria são montadas a partir dos mesmos componentes/tokens
  compartilhados.** Elas variam o eixo de design (densidade, paleta, escala tipográfica),
  não a estrutura de componentes por baixo — variar a estrutura em vez do eixo é
  reinventar UI três vezes ao invés de gerar três leituras de um mesmo sistema.
- **Vale também na integração.** Ao portar a variante escolhida pro código real: primeiro
  procura o que já existe no projeto (Design System Discovery — token faltando vs one-off
  vs desalinhamento conceitual) e conserta pela causa-raiz, em vez de duplicar markup que
  já tem equivalente no projeto.

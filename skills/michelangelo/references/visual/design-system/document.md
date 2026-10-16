# Caminho `document` — registrar a lei que já existe

Um repo pode ter design bom e nenhuma lei escrita. Este caminho **registra** o que já
está lá: escreve `PRODUCT.md`, `DESIGN.md` e a rota da vitrine, numa varredura só.

**Registrar não é nem refino nem redesign.** É por isso que ele tem porta própria: cair no
`new` (que propõe 3 direções divergentes) quando o pedido era "documenta o que já existe" é
a confusão de regime que o `SKILL.md` chama de falha mais cara.

**Este caminho não muda um pixel do alvo.** Defeito visual encontrado durante a varredura
vira **nota no fim** ("vale um `audit`"), nunca conserto. Se você consertar enquanto
documenta, o `DESIGN.md` passa a descrever um estado que ninguém aprovou.

**Nunca sobrescreve arquivo existente em silêncio:**

- `DESIGN.md` presente → o caminho é `improve` (refinar) ou `new` (trocar), não este.
- `PRODUCT.md` presente e `DESIGN.md` ausente → escreva só o que falta.
- Os dois presentes → pergunte qual atualizar, e deixe o outro intocado.

---

## Passo 1 — Varrer (uma vez, alimenta os três artefatos)

Uma varredura só. Ela responde o que vai para o `PRODUCT.md`, o que vai para o `DESIGN.md`
e como a rota vai ser escrita — re-escanear depois é desperdício e produz respostas que
não batem entre si.

- **README e docs** — propósito, público, objetivos declarados.
- **`package.json` e configs** — stack, dependências, biblioteca de design existente, e o
  **framework** (Next, Vite/React, SvelteKit, Astro, Nuxt, estático multi-página). O
  framework decide como a rota da vitrine é escrita no Passo 5.
- **Componentes recorrentes** — o que já existe e é reusado; é daqui que sai o inventário.
- **Assets de marca** — logo, favicon, cores já commitadas.
- **Tokens / variáveis CSS** — paleta, stacks tipográficas, escalas de espaço e raio.
- **Style guide ou doc de marca** que já exista em qualquer formato.

**Hipótese de register** (não decisão — o Passo 2 confirma): sinais de `brand` são `/`,
`/about`, `/pricing`, `/blog/*`, hero grande, tipografia de display, seções conduzidas por
scroll. Sinais de `product` são `/app/*`, `/dashboard`, `/settings`, `/(auth)`, formulário,
tabela de dados, navegação lateral, app shell.

Anote o que ficou **sem resposta** — é o que o Passo 2 pergunta, e só isso.

## Passo 2 — Entrevistar, não confirmar

**2 a 3 perguntas por rodada, e espere a resposta.** Pelo menos **uma rodada real** antes
de escrever o `PRODUCT.md`.

**Nunca sintetize o `PRODUCT.md` do prompt original e peça confirmação em bloco.** Um
briefing inteiro inferido de uma frase vira um documento que o usuário aprova por cansaço e
que a skill vai obedecer por meses.

- **Rodada 1** — register (lidere com a hipótese do Passo 1: *"pelo código isto parece uma
  superfície `product`; bate com a sua intenção?"*), quem usa e em que contexto, e o
  resultado desejado.
- **Rodada 2** — personalidade em 3 palavras, referências e **anti-referências**,
  acessibilidade.

Empurre por **referência nomeada com o específico** ("o espaçamento do Stripe", "a
tipografia do Linear"), nunca adjetivo de categoria ("moderno", "clean"). Anti-referência
vaga não serve para nada; anti-referência específica é o que alimenta a fuga nos redesigns
futuros.

Pule o que o repo já respondeu sozinho. **Não pergunte sobre cor, fonte, raio ou
espaçamento** — isso é `DESIGN.md`, e sai da varredura, não da entrevista.

## Passo 3 — Escrever o `PRODUCT.md`

Na raiz do repo. Responde *quem / o quê / por quê*, e **não fala de valores visuais**. A
separação existe para que um redesign possa jogar o `DESIGN.md` inteiro fora sem perder o
que o produto é.

```markdown
# PRODUCT.md — <projeto>

## Register
`brand` | `product` — <uma frase: o que o produto é>

## Usuários e propósito
- Quem usa, em que contexto, sob que pressa.
- Que trabalho está tentando terminar.

## Personalidade
<3 palavras>

## Anti-referências
- <o que NÃO pode parecer> — <o específico que se quer evitar>

## Acessibilidade
- <nível WCAG, movimento reduzido, daltonismo, o que for concreto>
```

## Passo 4 — Escrever o `DESIGN.md`

Na raiz do repo, em **duas camadas no mesmo arquivo**. Os valores saem do que o código de
fato usa — **inferido, não inventado**. Onde o repo não tem convenção nenhuma, declare a
canônica da skill (escala `4/8/12/16/24/32/48/64/96`) e diga na prosa que foi adotada
agora, não observada.

**Camada 1 — cabeçalho YAML.** É a camada normativa: é ela que o detector lê (`--ds
DESIGN.md`) e é dela que a vitrine tira o que renderizar.

```yaml
---
name: <projeto>
description: <uma linha>
colors:
  ink: "#1a1512"
  bg: "#faf7f2"
  brand-ember: "#b8422e"
typography:
  display:
    fontFamily: "Cinzel Decorative, Georgia, serif"
    fontSize: "clamp(2.5rem, 7vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Averia Serif Libre, Georgia, serif"
    fontSize: "1rem"
    lineHeight: 1.6
spacing: { xs: "4px", sm: "8px", md: "16px", lg: "32px", xl: "64px" }
rounded: { none: "0px", md: "8px", lg: "16px" }
shadows:
  sm: "0 1px 2px rgb(0 0 0 / 0.08)"
  glow: "0 0 24px rgb(184 66 46 / 0.35)"
components:
  button-primary:
    path: "src/components/ui/Button.tsx"
    variants: ["primary", "ghost", "danger"]
    states: ["default", "hover", "focus-visible", "disabled"]
---
```

Regras do cabeçalho:

- **`components` é inventário, não snippet**: nome → caminho do arquivo **real** →
  variantes e estados que a vitrine renderiza. Nenhum HTML, nenhum CSS. É isso que faz a
  vitrine consumir o componente em vez de copiá-lo.

  **Cuidado com o `components` do formato Stitch.** Um `DESIGN.md` escrito por outra
  ferramenta (o `impeccable`, o Stitch) traz um `components` com **props de token**
  (`backgroundColor: "{colors.gold-400}"`, `padding: "11px 26px"`) e **sem `path`**. Isso é
  uma descrição do componente, não um endereço — a vitrine não consegue importar nada com
  ela. Acrescente `path`, `variants` e `states` a cada entrada; as props podem ficar, mas
  quem manda no que é renderizado é o arquivo real.
- Referência de token usa `{caminho.do.token}` (ex.: `{colors.brand-ember}`). Componente
  referencia primitivo; primitivo não referencia primitivo.
- **Um valor existe uma vez.** Se está no cabeçalho, a prosa o cita — não o redeclara.
- Gramática restrita (o leitor é `scripts/detector/design-md.mjs`, sem dependência YAML):
  indentação de 2 espaços, `chave: valor`, mapa inline `{ a: "x" }`, lista inline
  `["a","b"]`. Chave pode vir entre aspas — e **precisa**, quando começa com dígito
  (`"2xl": "48px"`). Sem lista em bloco (`- item`), sem multi-linha, sem âncora.
- **Obrigatórios: `colors`, `typography`, `spacing`, `rounded`.** Faltar um é erro alto —
  o detector sai com código 2 em vez de medir sem lei. `shadows` é extensão nossa e é
  opcional (o formato Stitch não carrega elevação no cabeçalho); prefira escrever
  `shadows: {}` quando o projeto realmente não tem nenhuma, para a ausência ser uma
  decisão legível e não um esquecimento.
- `colors` é hex (`#rgb`, `#rrggbb`, `#rrggbbaa`); `spacing` e `rounded` são px.

**Camada 2 — o corpo em prosa.** A primeira linha do corpo é literal, e não é decoração:

> Isto é o que o projeto usa hoje, não o melhor que ele poderia usar.

Seções:

- **Register** e **Dials** (`VISUAL_DENSITY`, `DESIGN_VARIANCE`, 1-10, com o padding
  vertical de seção que a densidade implica) — ver `references/visual/register.md`.
- **Escala de espaçamento**, **escala tipográfica**, **cor com papéis semânticos**,
  **raios**, **sombras** — a prosa explica o papel de cada token; os valores estão no
  cabeçalho.
- **Padrões de componente** — convenções recorrentes (padding de card, altura de botão,
  como um formulário se estrutura) que o `polish` deve reusar em vez de reinventar.
- **Receitas aceitas** — direções e variantes que viraram lei.
- **Em disputa** — proposto e ainda não é lei. Cada item: o que é, **o que ele
  derrubaria**, quem propôs, quando.
- **Receitas rejeitadas** — tentado, recusado, e **por quê**. Sem o porquê, a mesma
  discussão reabre na sessão que vem.

As duas últimas nascem **vazias, mas presentes** — com o cabeçalho da seção escrito. Uma
lei que só mostra o vigente ensina que o vigente é o alvo.

**Conflito entre camadas: o cabeçalho vence.** A prosa é que está velha.

## Passo 5 — Gerar a rota da vitrine

`/design-system` no app, **dev-only por padrão** (fora da navegação, atrás de
`NODE_ENV`/flag conforme o projeto), escrita **no framework detectado no Passo 1**. Não
imponha React a um projeto que não é React.

A vitrine **importa os tokens e os componentes reais** e percorre o inventário do
cabeçalho. Ela não guarda cópia de nada: trocar o token muda a vitrine e as telas no mesmo
instante, porque é o mesmo import. É a prova visível do "mexo só no DS, as telas seguem".

Cinco blocos, nessa ordem:

1. **Cabeçalho** — register, dials, e a frase da Camada 2 em destaque.
2. **Tokens** — cores com o papel semântico e o **contraste medido** ao lado de cada par
   texto/fundo; a escala tipográfica **renderizada**, não descrita; espaçamento; raios;
   sombras.
3. **Componentes** — cada item do inventário, importado do arquivo real, em todas as
   variantes e estados declarados, com o **caminho do arquivo visível** ao lado.
4. **Em disputa.**
5. **Receitas rejeitadas**, com o porquê.

**Alvo sem framework — HTML solto, impresso ou slide — não ganha rota.** A lei fica só no
`DESIGN.md`, e os Passos 1 a 4 valem igual.

## Passo 6 — Rodar o gate na própria vitrine

```bash
node $SKILL_DIR/scripts/detector/run.mjs \
  http://localhost:PORT/design-system --ds DESIGN.md
```

Consertar até `PASS`. **Lei que não passa no detector não é lei, é sugestão** — e uma
vitrine que reprova ensina o defeito para toda tela que a consultar.

---

## Fechamento

A vitrine **não vira Artifact** (depende do dev server). O que o usuário recebe é o print
do que foi gerado mais o caminho dos três arquivos. Se durante a varredura apareceu defeito
visual, ele sai aqui como nota — uma linha por achado, com a sugestão de rodar um `audit`.

Este é o único caminho da skill sem passo de fechamento do guardião: ele não produziu
design nenhum, só registrou o que já existia. Não há "é melhor que o DS?" a perguntar
quando o DS acabou de nascer do próprio código.

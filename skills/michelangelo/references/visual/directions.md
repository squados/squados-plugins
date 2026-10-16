# Como escolher 3 direções distintas

Critério usado no **nível DS** da galeria (`references/visual/gallery.md`), chamado por
`references/visual/design-system/new.md` no passo 3 ("Reforma ampla → propor 3 direções via galeria").
Este arquivo não gera HTML nem roda o detector — só decide **o que** as 3 direções vão
variar, antes de qualquer render começar. `gallery.md` cuida do empacotamento (abas, iframe,
gate); `generate.md` cuida do craft de cada direção depois de escolhido o eixo. Este arquivo
é a ponte entre os dois: o critério de seleção.

## Por que "3 direções aleatórias" não funciona

Pedir a um LLM "gera 3 opções diferentes" sem critério produz o padrão conhecido: a opção 1
é o primeiro layout que vem à cabeça (geralmente o mais genérico), a opção 2 é uma variação
de cor da opção 1, e a opção 3 é ruído decorativo em cima da opção 1. Nenhuma das três é uma
direção **estruturalmente** diferente — o usuário está escolhendo entre variações de uma
única ideia, não entre ideias.

A correção é forçar cada direção a variar um **eixo primário** diferente, e forçar essa
decisão a ser declarada **antes** de qualquer HTML ser escrito (ver "O gate `<design_plan>`"
abaixo). Isso mata o "LLM escolhe sempre o primeiro layout" de duas formas: (1) a primeira
direção não pode mais ser "o óbvio" sem que isso seja uma escolha explícita e nomeada, e (2)
as direções 2 e 3 são obrigadas a divergir num eixo estrutural, não numa paleta.

## Os 5 eixos primários

Cada direção varia **um** destes eixos como seu traço dominante. As outras dimensões do
design ainda existem na direção (toda direção tem cor, tipografia, densidade — nada fica
"desligado"), mas só uma delas é o que **define** a direção e o que o usuário está de fato
comparando ao ler as 3 abas lado a lado.

- **Hierarquia** — como a atenção é distribuída entre os elementos. Uma direção pode ser
  "hero dominante" (um elemento consome >60% do viewport inicial, tudo o resto é secundário)
  contra outra "hierarquia plana" (vários elementos com peso visual comparável, sem um único
  foco). Muda o que o olho encontra primeiro, não a paleta nem o grid.
- **Topologia** — a estrutura de grid/composição em si. Grid simétrico de colunas iguais
  contra bento grid (blocos de tamanhos desiguais, alguns spanning 2 colunas) contra
  masonry/overlap (elementos sobrepostos, `margin-top` negativo, quebra de grid). Ver
  `DESIGN_VARIANCE` em `register.md` — topologia é o eixo que mais se conecta a esse dial.
- **Densidade** — quanta informação/espaço em branco por área. Ver a tabela `VISUAL_DENSITY`
  em `register.md` (1-3 Art Gallery / 4-7 Daily App / 8-10 Cockpit) — uma direção pode
  propor um nível de densidade diferente do baseline do register atual, é uma forma legítima
  de divergir.
- **Tipografia** — a personalidade tipográfica. Trocar o pairing inteiro (ver
  `tokens/pairings.json` abaixo) muda o mood do design mais do que qualquer ajuste de cor:
  uma direção serifada/editorial (`Playfair Display` + `Inter`) lê como "premium, autoral";
  uma direção geométrica/mono (`Space Grotesk` + `IBM Plex Mono`) lê como "técnico,
  developer-tool". Duas direções não devem ambas usar sans-serif genérico só com pesos
  diferentes — isso não é uma divergência de eixo, é a mesma direção com uma variável a mais.
- **Cor** — a paleta e a temperatura. Trocar de `palettes.json` (ver abaixo) para uma paleta
  de família cromática distinta (não um tom mais escuro da mesma paleta) — ex.: uma direção
  "SaaS azul confiável" contra uma direção "editorial terracota/creme" contra uma "dark
  tech verde-neon". A troca de cor só conta como eixo primário quando nenhum outro eixo
  também está sendo forçado a divergir na mesma direção (senão a direção está fazendo dois
  eixos de uma vez, o que dilui qual delas o usuário está de fato avaliando).

**Regra dura:** as 3 direções variam 3 eixos **diferentes** entre si. Nunca duas direções no
mesmo eixo (ex.: duas direções que só divergem em densidade, com tipografia/cor idênticas) —
isso devolve o problema de "variações da mesma ideia" que a seção anterior descreve.

## Usar `tokens/styles.json` como critério de produto→estilo

`references/visual/tokens/styles.json` não é uma tabela literal `produto → estilo único`. Cada
entrada tem `name`, `variables` (as CSS vars que definem o estilo), `doNotUseFor` (contextos
onde o estilo é uma escolha ruim) e `keywords` (a descrição do que o estilo produz). O
critério de match é:

1. **Excluir primeiro.** Descartar qualquer estilo cujo `doNotUseFor` bate com o produto em
   questão — ex.: `Neumorphism` lista `"data-heavy dashboards"` em `doNotUseFor`; um
   dashboard financeiro nunca deveria ver essa direção na galeria, mesmo que o eixo primário
   da direção seja outro.
2. **Depois ranquear por fit.** Entre os estilos que sobraram, ler `keywords` contra o brief
   do produto/marca e escolher os que fazem sentido como semente de uma das 3 direções — não
   adotar o estilo inteiro (não é "aplicar Neumorphism"), usar `variables`/`keywords` como
   ponto de partida para o eixo escolhido (ex.: se o eixo da direção é "densidade" e o estilo
   escolhido é `Minimalism & Swiss Style`, a direção puxa `--spacing: 2rem` e `--shadow: none`
   como ponto de partida, não copia o estilo verbatim).

`palettes.json` e `pairings.json` funcionam como semente, não como fonte final: `palettes.json`
já vem parcialmente indexado por domínio de produto (nomes como `"SaaS (General)"`), então
puxar a paleta cujo `name` mais se aproxima do produto é o atalho correto quando o eixo
primário da direção é cor. `pairings.json` tem `mood` e `bestFor` por par de fontes — mesmo
uso quando o eixo é tipografia. Em ambos os casos, o detector valida contraste/legibilidade no
render real (ver `audit.md` §Camada 1) — um dado vendorizado ainda precisa passar pelo gate,
puxar da tabela não é uma isenção de qualidade.

## Direções podem fugir do DS

Uma direção **pode** propor um padrão que não existe no DS atual do repo — um bento grid
quando o DS só documenta cards simples, uma paleta nova quando o DS só tem uma. Isso é
esperado e correto: a galeria de nível DS existe justamente para testar se o repo deveria
expandir sua lei, não só para escolher entre variações do que já está documentado.

Se o usuário aceitar uma direção que fugiu do DS, isso não é uma exceção pontual — é uma
**promoção**: o padrão vira token/regra documentada no `DESIGN.md` — cabeçalho e prosa —, seguindo
a catraca descrita em `design-system/new.md` ("A catraca"). Uma direção off-DS que perde a
escolha não é promovida e não deixa rastro no DS — ela só existiu como opção descartada.

## O gate `<design_plan>`

Antes de escrever qualquer HTML de variante, a direção declara as 3 direções e o eixo de
cada uma num bloco `<design_plan>` — texto simples, sem gerar nenhum código ainda. Este é o
gate que impede o "LLM escolhe sempre o primeiro layout": nomear os 3 eixos em texto, antes
de qualquer render, obriga a decisão a ser deliberada em vez de emergir como efeito colateral
de "só escrever a primeira ideia três vezes com cores diferentes".

Formato mínimo do bloco:

```
<design_plan>
Produto/brief: <uma frase do que está sendo desenhado>
Register: <brand|product> (ver register.md)

Direção 1 — eixo: <hierarquia|topologia|densidade|tipografia|cor>
  O que muda: <1-2 frases concretas — não "mais moderno", e sim "hero de tela cheia,
  navegação some até scroll">
  Semente: <estilo/paleta/pairing de tokens/*.json usado como ponto de partida, ou "nenhum
  — só DS atual">

Direção 2 — eixo: <eixo diferente de Direção 1>
  O que muda: ...
  Semente: ...

Direção 3 — eixo: <eixo diferente de Direção 1 e 2>
  O que muda: ...
  Semente: ...
</design_plan>
```

Regras do gate:

- **Os 3 eixos são obrigatoriamente diferentes** — reforça a regra dura da seção "Os 5 eixos
  primários" no ponto em que ainda é barato corrigir (antes de gerar HTML), não depois.
- **"O que muda" tem que ser concreto**, não adjetivo solto. Se a frase poderia se aplicar a
  qualquer redesign genérico ("mais clean", "mais premium"), ela não passa o gate — reescrever
  até apontar um elemento/comportamento específico.
- **O bloco é escrito e revisado antes do primeiro HTML.** Só depois de `<design_plan>`
  fechado com 3 eixos distintos e "o que muda" concreto é que `gallery.md` entra em ação
  para gerar os 3 arquivos standalone e rodar o gate do detector em cada um.
- Isto é um gate de **plano**, distinto do gate de **qualidade** que `gallery.md` roda depois
  (detector `PASS`/`BLOCKED` por variante). Uma direção pode ter um `<design_plan>` válido e
  ainda assim o HTML gerado falhar o detector — os dois gates são sequenciais, não
  substitutos um do outro.

## Fluxo de ponta a ponta

1. `design-system/new.md` chega ao passo 3 (reforma ampla) e chama este arquivo.
2. Ler o brief/produto, o register já decidido (passo 2 de `design-system/new.md`), e o DS atual
   (se houver).
3. Escolher 3 eixos primários diferentes (seção "Os 5 eixos primários").
4. Para cada eixo, escolher uma semente em `tokens/styles.json` (excluir por `doNotUseFor`,
   ranquear por `keywords`) e, se relevante ao eixo, uma entrada de `palettes.json` ou
   `pairings.json`.
5. Escrever o bloco `<design_plan>` com as 3 direções e validar contra as regras do gate.
6. Só então entregar as 3 direções para `gallery.md` gerar os HTMLs standalone e rodar o
   detector por variante.

## Como isto se conecta ao resto da skill

- `design-system/new.md` chama este arquivo no passo 3, antes de acionar `gallery.md`.
- `gallery.md` consome o `<design_plan>` para nomear as abas (ver o esqueleto de shell em
  `gallery.md`, onde cada aba já leva o eixo no rótulo: "Direção 1 — hierarquia") e para
  saber que as 3 variantes podem fugir do DS.
- `register.md` é a referência dos dials (`VISUAL_DENSITY`, `DESIGN_VARIANCE`) usados como
  baseline antes de decidir o eixo "densidade" ou "topologia" de uma direção.
- Este arquivo cobre só o **nível DS** (3 direções de linguagem visual). O nível tela (3
  arranjos de layout dentro do DS já fixado, usado por `polish.md`) não usa eixo primário —
  usa variação de arranjo, formato descrito em `gallery.md` §"Dois níveis de variante".

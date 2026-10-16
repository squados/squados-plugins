# Caminho `new` — trocar a direção da lei visual

O caminho `new` **troca** a lei visual do repositório: propõe 3 direções divergentes, e a
escolhida substitui a que estava lá. É o regime de **redesign**.

Quando o repo ainda não tem `DESIGN.md`, o caminho é o `document` (registrar o que já
existe), não este. Quando a direção agrada e o pedido é melhorá-la ponto a ponto, é o
`improve`.

Ele fecha o primeiro elo da catraca: `design-system` **define** → `audit` **mede contra** →
`polish` **aplica e devolve aprendizado**. Ver "A catraca" no fim deste documento.

**A vitrine não é fonte de ideia.** Num redesign, as fontes são `references/visual/brand.md`,
`references/visual/directions.md`, `references/visual/inspiration.md` e as **anti-referências** do
`PRODUCT.md`. A rota `/design-system` entra **depois** de a direção existir, e só para
saber **o que vai ser derrubado**. Abrir a vitrine antes é como se recombina o que já está
lá e se entrega um "redesign" que o usuário lê como igualzinho.

## Fluxo

1. **Ler o DS existente.**
   Procura `DESIGN.md` na raiz do repo. Ele é o ponto de partida — e aqui, ao contrário do
   `improve`, é o ponto de partida **do que vai ser derrubado**: o `new` lê a lei para
   saber de onde está saindo, não para respeitá-la. Leia também o `PRODUCT.md`: as
   **anti-referências** são o que mais empurra as 3 direções para longe do genérico.
   Sem `DESIGN.md` no repo, o caminho é o `document`, não este.

2. **Escolher register e inferir os dials.**
   `register` é `brand` (o design É o produto — landing, portfólio, marketing: razões
   tipográficas maiores, mais respiro, mais personalidade) ou `product` (o design SERVE o
   produto — app, dashboard, ferramenta: razões menores, mais densidade, hierarquia mais
   sóbria). O register muda densidade e escala do DS inteiro; não é um detalhe cosmético.
   Os `dials` (`VISUAL_DENSITY` e `DESIGN_VARIANCE`, 1-10) partem de um baseline por
   register e ajustam a partir do vocabulário do pedido (vibe→valores). A densidade mapeia
   para padding vertical de seção concreto — não fica solta como conceito. Formato completo
   de register e dials: `references/visual/register.md`.

3. **Reforma ampla → propor 3 direções via galeria.**
   Quando o pedido é amplo ("deixa lindo", "repensa o visual", "cria um DS do zero") ou o
   DS é greenfield, o modo **não decide sozinho**: gera 3 direções de linguagem visual
   distintas, cada uma variando um eixo primário (tipografia / cor / densidade /
   personalidade), renderizadas lado a lado num HTML único navegável — a galeria de
   `references/visual/gallery.md`, com os eixos escolhidos conforme `references/visual/directions.md`.
   Cada direção **passa o gate do detector antes de entrar na galeria** — nenhuma opção
   ruim chega ao usuário. Pedido estreito sem REDESIGN ("ajusta o espaçamento", "corrige o contraste")
   não passa pela galeria — não há decisão de linguagem visual a propor, só correção.

4. **Usuário escolhe → a direção vira o DS.**
   A direção escolhida é escrita no `DESIGN.md`: **cabeçalho** (os valores) e **prosa** (o
   porquê). A partir desse commit, essa é a lei — todo `audit` subsequente mede contra ela.
   Formato das duas camadas: `document.md` §Passo 4. Não existe segundo arquivo de tokens.

   **Atualize a rota da vitrine** quando a direção traz componente novo ou aposenta um
   antigo: o inventário `components` do cabeçalho e a rota andam juntos (`document.md`
   §Passo 5). E registre a direção que **não** foi escolhida em `Receitas rejeitadas`, com
   o porquê — as outras duas custaram o mesmo que a vencedora, e sem isso a mesma proposta
   volta daqui a três sessões.

5. **Reconstruir o artefato — `references/visual/rebuild.md`.**
   **Este modo não termina no passo 4.** Uma lei nova com o artefato intocado é uma
   promessa, não uma entrega: quem pediu o redesign vai abrir o arquivo e ver o design
   antigo. Encadeie o `rebuild`, que aplica a direção no alvo real, com orçamento de
   mudança e par antes/depois. Só aí o redesign existe.

   Antes das direções, levante a identidade em `references/visual/brand.md` — paleta oficial,
   logo, tipografia da marca. Direção gerada sem esse material sai competente e anônima,
   e é a diferença entre "melhorou" e "parece feito sob medida".

## Formato do `DESIGN.md`

`DESIGN.md` vive na raiz do repo (não em `skills/michelangelo/`) e tem duas camadas no
mesmo arquivo: o **cabeçalho YAML** normativo, que o detector lê (`--ds DESIGN.md`) e do
qual a vitrine tira o que renderizar, e o **corpo em prosa**, que explica o porquê.
**O formato completo das duas camadas está em `document.md` §Passo 4** — inclusive a
gramática restrita do cabeçalho, a primeira linha literal do corpo, e as seções `Em
disputa` e `Receitas rejeitadas`.

Duas coisas que mudam quando é o `new` escrevendo, e não o `document`:

- **A direção escolhida substitui os valores do cabeçalho**, não acrescenta ao lado. Uma
  paleta nova que convive com a velha é a paleta velha com convidados.
- **`Receitas aceitas` ganha a direção vencedora** e `Receitas rejeitadas` ganha as outras
  duas, com o porquê de cada uma. É esse histórico que impede a mesma discussão de reabrir.

**Não existe tokens file separado.** O JSON que a skill escrevia à parte era uma segunda
cópia dos mesmos valores, e nada comparava as duas — a lei podia discordar de si mesma sem
ninguém ver. Hoje o `--ds` do detector aceita o próprio `DESIGN.md` e deriva o que precisa
do cabeçalho (`scripts/detector/design-md.mjs`); o `.json` continua aceito só para repo
antigo, e o caminho `improve` promove esses repos quando os encontra.

## A catraca

O ciclo só funciona porque cada modo respeita o que o anterior decidiu, e devolve
aprendizado pro próximo:

1. **`design-system` define a lei.** Escreve o `DESIGN.md`. A partir daqui, `spacingScale`,
   `radii`, `colorTokens`, `fontFamilies` e `shadowTokens` — derivados do cabeçalho — são o
   "esperado" contra o qual tudo é medido.
2. **`audit` mede contra a lei.** Carrega o `DESIGN.md` como `designSystem` do
   `DetectorInput` (`--ds DESIGN.md`), roda os checks, e separa achados em duas categorias:
   **divergência não-intencional** (código fez um one-off que ninguém escolheu — ex.
   `border-radius: 7px` fora de `radii` — isso é violação, o detector reprova) vs
   **candidato a melhoria de DS** (um padrão bom e recorrente que ainda não virou token —
   isso não é reprovado, é registrado no briefing como proposta).
3. **`polish` aplica e PROPÕE a evolução.** Corrige as violações. Os candidatos aceitos e
   os tokens que perderam voltam para a lei pelo caminho `improve` — **o `polish` não
   escreve o `DESIGN.md`**. Escritor único é o que impede a lei de crescer por três portas
   diferentes, cada uma com o seu critério.

Sem essa catraca, `audit` não teria contra o que medir (todo achado seria opinião solta) e
`polish` não teria onde devolver o que aprendeu (toda melhoria morreria no commit que a
criou, e o próximo `audit` reabriria a mesma discussão). É o `design-system` que dá ao
detector um "esperado" que não é um valor mágico no código, e sim uma decisão registrada e
versionada junto do repo.

**E a catraca gira nos dois sentidos.** Ela não existe só para o código convergir para a
lei: existe também para a lei ceder quando o código produziu algo melhor. Um ciclo que só
sabe corrigir o código para o DS é uma catraca travada — ver `SKILL.md` §Guardião, saída 3.

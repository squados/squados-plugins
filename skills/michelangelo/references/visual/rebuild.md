# Modo `rebuild` — reconstruir o artefato na direção escolhida

`rebuild` é o elo entre a lei nova e o arquivo do usuário. Recebe uma direção aprovada
(da galeria do caminho `design-system new`) e **reescreve o alvo real** para que ele passe a ser
aquela direção — não uma versão dele com alguns ajustes.

Sem este modo, um redesign termina num `DESIGN.md` bonito e num artefato intocado. É o
erro estrutural que a skill cometeu por muito tempo: `polish` era o único modo que escrevia
no projeto, e `polish` só sabe aplicar correções pontuais de um briefing. Um redesign
roteado para `polish` volta como refino — e o usuário responde "está igualzinho".

## O que distingue `rebuild` de `polish`

| | `polish` | `rebuild` |
|---|---|---|
| Entrada | `briefing.md` (lista de defeitos medidos) | direção aprovada (uma lei visual nova) |
| Autorização | corrigir o que está torto | **substituir** o que está lá |
| Preserva | a direção visual atual | a estrutura semântica |
| Sucesso | 0 defeitos | irreconhecível, e melhor |

O que muda em `rebuild` é a lei visual inteira — paleta, tipografia, escala, estrutura de
página, capa, ornamento.

## Passo de abertura — ler a lei para saber de onde se está saindo

Abra o `DESIGN.md` e o `PRODUCT.md` antes de qualquer coisa, mas **pelo motivo oposto ao do
`polish`**: aqui a lei não é o que se obedece, é o que se está tentando bater. Ela diz de
onde o artefato está saindo e o que a direção nova vai precisar derrubar. As
**anti-referências** do `PRODUCT.md` continuam valendo — são a única parte que um redesign
não joga fora, porque descrevem o que o produto **é**, não como ele está pintado hoje.

Duas travas, e as duas existem para o guardião não virar coleira:

- **Não passe a lei velha ao detector.** O `--ds` do `rebuild` aponta para os tokens da
  **direção candidata**, nunca para o `DESIGN.md` vigente. Medir um redesign contra a lei
  que ele veio substituir reprova exatamente o que era o ponto: cada cor nova vira
  `color-off-system`, cada raio novo vira `radius-off-system`, e o gate empurra o artefato
  de volta para o design que o usuário pediu para trocar.
- **A vitrine não é fonte de ideia.** A rota `/design-system` entra **depois** de a direção
  existir, e só para saber o que vai ser derrubado. Abrir o catálogo do que já existe na
  hora de inventar é como se recombina o vigente e se entrega um redesign que o usuário lê
  como igualzinho. As fontes são `brand.md`, `directions.md`, `inspiration.md` e as
  anti-referências.

## Passo 0 — Checkpoint: mostrar a proposta e esperar reação

`rebuild` nunca aplica no artefato final sem esse checkpoint — é o que garante que quem
pediu o redesign escolhe ou opina antes do trabalho pesado acontecer, não depois de já
estar pronto. As 3 opções variam conforme os eixos livres:

- **3 direções livres** (a maioria dos casos) — normalmente já vieram de
  `design-system new` → `gallery.md`, e o usuário já escolheu uma ao chegar aqui.
- **Identidade fixa** (`brand.md` caso 2 — o artefato retrata outra marca, cor/tipografia
  não são nossas pra inventar): isso trava só ESSES dois eixos. Hierarquia, topologia,
  densidade e ornamento continuam livres: gere 3 opções concretas e visuais variando
  esses eixos dentro da identidade, conforme `SKILL.md` §Abertura.

Seja qual for a forma, **o checkpoint é entregue como Artifact publicado** — `SKILL.md`
§Entrega visual, procedimento em `gallery.md` §Artifact.

Pular este passo porque "a direção certa é óbvia" é exatamente o erro: óbvio pra quem
desenhou não é o mesmo que aprovado por quem pediu.

## Passo 1 — Fixar o orçamento de mudança

Antes de escrever a primeira linha, declare **o que vai mudar**, em texto. Este é o
instrumento que a skill tem contra o "está igualzinho": sem um alvo declarado de
magnitude, o modelo converge para mudanças tímidas que passam o gate sem mudar de
patamar.

Um redesign honesto muda **pelo menos 4** destes eixos:

- **paleta** — não um tom a mais; a família cromática do artefato;
- **tipografia** — a família de display e/ou de corpo, não só o peso;
- **escala** — os tamanhos e a razão entre níveis;
- **estrutura de página** — o que abre uma seção, o que separa blocos, o que ganha página
  inteira;
- **superfície** — fundo, sangria, densidade, o que é papel e o que é bloco;
- **capa / primeira impressão** — a peça de maior peso perceptual (§Capa abaixo);
- **ornamento** — filetes, numerais, marcadores, capitulares.

Escreva o orçamento assim, e confira contra ele no Passo 5:

```
Orçamento de mudança — <alvo>
  paleta:      <de> → <para>
  tipografia:  <de> → <para>
  estrutura:   <de> → <para>
  capa:        <de> → <para>
  (eixos intocados e por quê: ...)
```

**Se você não consegue preencher 4 linhas com mudanças concretas, não é um redesign** —
volte e diga ao usuário que o caso é refino, em vez de entregar um refino chamando de
redesign.

### A régua de magnitude — nem toda linha do orçamento conta

Preencher as 4 linhas não basta se cada uma é um toque pequeno demais pra registrar. O
teste: **alguém batendo o olho no antes/depois por menos de 1 segundo percebe a mudança
sem você precisar explicar.** Se a diferença só aparece quando você lê a legenda do que
mudou, o eixo não foi cumprido — foi só marcado como cumprido.

Não contam como eixo cumprido, por si só (podem ser parte de um eixo maior, nunca o eixo
inteiro):

- Trocar só a escala de raio de borda (`6/12/14/16/18/24px` → `10/16/24px`) sem mudar mais
  nada na composição.
- Adicionar sombra sutil a elementos que já existiam, na mesma posição, mesmo tamanho.
- Trocar peso de fonte mantendo a mesma família e a mesma escala de tamanho.
- Mudar um tom de uma cor que já estava em uso, dentro da mesma família cromática.
- Substituir um ícone genérico por outro igualmente genérico sem mudar a composição ao
  redor dele.

Esses são fixes de `polish`, não eixos de `rebuild` — nada errado em fazê-los, mas não
escreva "escala: ..." no orçamento achando que uma mudança desse porte prova magnitude.
Um eixo real muda o que o olho registra primeiro ao ver a peça, não só o que ela mede em
detalhe.

## Passo 2 — Guardar o antes

Antes de tocar em qualquer arquivo, renderize o alvo no estado atual e salve os prints em
`<OUT>/antes/`. Sem isso não há como provar mudança no Passo 5, e não há como voltar
atrás.

Se o alvo é gerado por um motor/build (um `.css` compartilhado, um template), copie
também o arquivo-fonte original para `<OUT>/antes/` — é o rollback.

## Passo 3 — Reconstruir

Aplique a direção no artefato real. Ordem que funciona, do estrutural ao cosmético:

1. **Tokens primeiro.** A paleta e a escala da direção viram variáveis no lugar onde o
   projeto já guarda tokens (ou um bloco `:root` novo, se não houver). Nada de hex solto —
   §Guardião do `SKILL.md`.
2. **Assets.** Fontes e logo entram agora, não no fim: `references/visual/brand.md` §Aquisição. Num
   alvo impresso a fonte precisa estar **embutida** antes de qualquer julgamento visual,
   senão você está olhando um fallback.
3. **Estrutura de página.** O que muda de forma (uma abertura de seção que vira página
   inteira, uma capa recomposta, uma grade nova) vem antes do ajuste fino — refinar
   espaçamento de uma estrutura que ainda vai mudar é trabalho jogado fora.
4. **Craft.** Só então tipografia fina, espaço, ornamento — as regras de
   `references/visual/generate.md`, filtradas pelo meio (`references/visual/medium.md`).

**Reuse o mecanismo que o projeto já tem.** Se existe um sistema de temas, um arquivo de
tokens, um motor de template — a direção nova entra por ele. Criar um segundo caminho
paralelo ao que já existe é a violação de DRY mais cara possível, porque ela se propaga
para todo artefato futuro daquele projeto.

## Passo 4 — Gate do detector

Rode o detector com o perfil de meio correto (`SKILL.md` §Rodar o detector). `BLOCKED`
volta ao Passo 3. **Nenhuma direção é entregue com P0/P1 aberto**, e o ban de narrar saída
de gate vale aqui como em todo lugar.

Duas armadilhas específicas de redesign, porque a paleta é nova:

- **Cor de marca costuma reprovar contraste.** Ver `generate.md` §Cor — o padrão de dois
  tokens (gráfico vs tipográfico). Descobrir isso no gate é normal; ignorar é que não.
- **Estrutura nova gera falso-positivo novo.** Se um check dispara em massa por causa de
  uma decisão estrutural legítima (linhas de tabela, quebras de página), verifique
  elemento por elemento antes de aceitar OU descartar — e se for defeito do check,
  conserte o check, não o design.

### Verificação cruzada — obrigatória em alvo impresso

O detector roda no Chromium, que é o mesmo motor que gerou o PDF: **ele aprova o que ele
mesmo produziu**. Bugs de portabilidade só aparecem noutro renderizador.

Rasterize ao menos a capa, uma abertura e uma página de corpo com um motor independente
(MuPDF via `pymupdf` é rápido e offline) e **olhe**:

```python
import fitz
doc = fitz.open("saida.pdf")
doc[0].get_pixmap(matrix=fitz.Matrix(2, 2)).save("check-capa.png")
```

Dois defeitos que só aparecem assim, ambos já custaram entrega: gradiente terminando em
`transparent` vira bloco sólido; peso de fonte que não existe no arquivo vira negrito
sintético e alguns motores trocam a palavra inteira por outra família.

## Passo 5 — Provar a mudança

Renderize o **depois** e monte um par lado a lado com o `<OUT>/antes/` — a mesma página,
mesmo recorte, mesma escala. Um par por tipo de página (não por página: ver
`audit.md` §Amostragem por tipo).

Confira o orçamento do Passo 1 item a item: cada eixo declarado mudou de fato? Um eixo que
você prometeu e não entregou é dívida, não detalhe — ou entrega, ou diz explicitamente que
não entregou e por quê.

Entregue ao usuário: o par antes/depois **publicado como Artifact** (`gallery.md`
§Artifact — em colunas, nunca com o antes escondido atrás de uma aba), o orçamento
conferido, e o gate. **Nunca entregue só o resultado final** — sem o antes ao lado, quem
pediu não tem como avaliar magnitude, e é exatamente aí que nasce o "está igualzinho".

## Capa e primeira impressão

Todo artefato tem uma superfície que carrega peso perceptual desproporcional: a capa de um
livro, o primeiro viewport de uma landing, o slide de abertura. Ela é julgada em segundos
e define a expectativa de tudo que vem depois.

Num redesign ela **nunca** é tratada como "mais uma tela":

- É a primeira a ser desenhada, não a última.
- É a que mais se beneficia de um asset real (logo, marca, tipografia de display) — ver
  `brand.md`.
- Ela pode legitimamente quebrar a regra de densidade do resto do sistema: uma capa é
  editorial, não uma tela de produto.
- Vazio nela é composição, desde que **ancorado** — conteúdo boiando no meio com massa
  vazia igual em cima e embaixo lê como placeholder, não como respiro. Distribua os
  elementos em blocos com papéis (topo/centro/rodapé) em vez de um miolo solto.

## Quando parar

`rebuild` termina quando: gate `PASS`, orçamento conferido, par antes/depois entregue, e
(em impresso) verificação cruzada feita.

**Passo de fechamento, obrigatório** (`SKILL.md` §Guardião): responda **"o que eu fiz é
melhor que o DS?"**, com uma das três saídas nomeada. Num redesign a saída **"a lei
perdeu"** é o caso **normal**, não a exceção — se a reconstrução não derrubou nada da lei
antiga, provavelmente não foi um redesign, foi um refino caro. O que a reconstrução revelou
como padrão bom vira token, não one-off; quem escreve é o `design-system improve`
(`references/visual/design-system/improve.md`), não o `rebuild`.

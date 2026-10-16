# Caminho `improve` — refinar a lei existente, ponto a ponto

Refina a direção visual **existente** do repo sem trocá-la. Onde o caminho `new` diverge e o
usuário escolhe 1 de 3 direções que substituem a lei, `improve` **converge**: acumula N
deltas pequenos que evoluem a lei atual. Pré-condição: existe `DESIGN.md`. Se não existir,
redirecione para `document` — não há lei a refinar, há lei a registrar.

Este caminho obedece as duas leis transversais do `SKILL.md`: é o **guardião** (todo delta
aceito vira token e propaga) e respeita a **localidade** (uma fatia pequena por rodada, nunca
a página inteira como um bloco).

**É também o ponto de escrita para o que os outros modos propõem.** `polish` e `rebuild` não
escrevem o `DESIGN.md`: quando o passo de fechamento deles diz "falta lei" ou "a lei perdeu",
a proposta chega aqui. Uma proposta vinda de fora **pula os Passos 1 a 4** — ela já é o delta,
já foi vista em código real, e só falta a escrita de volta do Passo 5. Não a re-embale numa
mini-galeria só para cumprir o rito.

## Passo 1 — Briefing leve

Curto — o DS já existe, então não há entrevista estratégica completa. Herda a disciplina de
entrevista do caminho `document` (§Passo 2: perguntas em rodadas, hipóteses como opções,
nunca sintetizar do prompt cru), condensada em 2-3 perguntas, sempre em texto (nunca UI de
chips):

1. O que te incomoda hoje, ou o que você quer **mais**? (mais respiro? mais contraste
   tipográfico? mais personalidade? mais densidade?)
2. Referências ou anti-referências? (nomes de sites/apps, ou "nada em mente" — alimenta a
   mineração do Passo 2 se ela for consentida)
3. Qual **lente** (Passo 3) e qual **escopo de breakpoints** (`audit.md` §Passo 1)?

O register já está no `PRODUCT.md` e os dials no `DESIGN.md` — **não** re-perguntar. Se o
briefing revelar que o usuário quer trocar de register/direção, isso é caso do caminho `new`,
não do `improve`: diga isso e redirecione.

## Passo 2 — Mineração de referências (opcional, consentida)

Se o usuário citou referências, ou aceitar a busca autônoma, rode a capacidade compartilhada
`references/visual/inspiration.md` **aqui**, antes da primeira rodada — os briefs estruturados que ela
devolve semeiam os deltas de alto impacto. É opt-in atrás de um único consentimento (ver
`inspiration.md` §Sourcing). Sem consentimento, o modo segue só com o DS atual + o briefing.

## Passo 3 — As três lentes (default: dimensão do DS)

A lente escolhida no Passo 1 define o que cada rodada percorre. São **lentes de entrada**, não
níveis rígidos; o motor sempre decompõe em unidades pequenas (lei da localidade).

- **Dimensão do DS** — *default.* Percorre tipografia → cor → espaço → elevação → motion →
  padrões-de-componente, cada uma previsualizada numa seção representativa. É o default porque
  (1) bate com o grão do detector, que mede por dimensão (um gate reprovado aponta a dimensão
  exata; uma rodada por seção mistura N mudanças e deixa o gate ambíguo); (2) é o grão de um
  *sistema* — refinar a lei dimensão por dimensão propaga por definição, enquanto melhorar
  seção por seção gera one-offs que encarecem o guardião; (3) continua concreto — a seção é o
  *viewport*, a dimensão é a *variável*.
- **Seção** — percorre uma seção, mostrando os deltas de DS que a melhoram (todas as dimensões,
  uma superfície). Bom para conserto dirigido.
- **Página inteira** — **nunca julgada como um bloco.** Internamente vira "percorre cada seção
  em ordem" (uma sequência de rodadas de lente-seção).

## Passo 4 — O loop de rodadas

Cada rodada:

1. **Canvas real.** Renderize uma seção real representativa do produto pela mesma infra de
   render do `audit` (`references/visual/audit.md` §Passo 1 — Playwright headless, viewport real,
   nunca `fullPage` numa tela de altura travada, superfície de produção). A seção é o palco
   onde os deltas da rodada são medidos.
2. **Propor os deltas da fatia.** Para a fatia da rodada (uma dimensão, no default), proponha
   os deltas de **nível DS** de maior impacto — token/escala/padrão, não rearranjo daquela
   tela. Cada delta é concreto e nomeável (ex.: "razão da escala tipográfica 1.2 → 1.25",
   "adicionar uma escala de elevação `sm/md/lg` — o DS hoje não tem nenhuma").
3. **Mini-galeria antes/depois.** Empacote os deltas como cards antes/depois seguindo o
   terceiro nível de `references/visual/gallery.md` (§Deltas antes/depois). Cada card passa pelo
   detector com gate `PASS` **antes** de o usuário ver (regra dura da skill: nada BLOCKED
   chega ao usuário).
4. **Usuário resolve.** Aceita / rejeita / refina cada delta.
5. **Escrita de volta + propagação** (Passo 5) dos deltas aceitos da rodada.
6. **Próxima rodada adapta.** A próxima rodada muda de tema, informada pelo que foi aceito,
   até o usuário dizer "tá bom" **ou** os deltas de alto impacto se esgotarem.

Critério de parada explícito: o usuário encerra, ou a skill declara que não há mais delta de
alto impacto naquela lente. **Não invente deltas cosméticos só para continuar o loop** — o
guardião promove melhorias reais, não ruído.

## Passo 5 — Escrita de volta + propagação (por rodada)

Ao fim de **cada rodada** (não só no fim do modo):

1. **Grava** os deltas aceitos no `DESIGN.md` — **cabeçalho** (os valores) e **prosa** (o
   porquê). Formato das duas camadas: `document.md` §Passo 4. Não existe tokens file
   separado; o detector deriva o que precisa do cabeçalho.

   **Qual seção recebe depende da saída do fechamento** (`SKILL.md` §Guardião):
   *falta lei* → o token novo entra no cabeçalho e o padrão em `Padrões de componente`;
   *a lei perdeu* → o token vigente é **substituído** no cabeçalho e o antigo vai para
   `Receitas rejeitadas` com o porquê; **sem decisão agora** → vai para `Em disputa`, com o
   que ele derrubaria. `Em disputa` é estacionamento, não cemitério: toda rodada nova
   começa relendo essa seção.

2. **Atualiza o inventário e a vitrine** quando o delta cria, renomeia ou aposenta um
   componente: `components` no cabeçalho e a rota `/design-system` andam juntos
   (`document.md` §Passo 5). Inventário que não bate com a rota é a vitrine mentindo.
3. **Propaga** (guardião, `references/visual/rules.md` §Guardião): refatora os consumidores off-DS dos
   tokens tocados para referenciar o token. Telas que já consomem o token propagam sem edição.
4. **Re-mede** as superfícies afetadas com
   `node scripts/detector/run.mjs <alvo> --ds DESIGN.md` — gate `PASS` obrigatório. Se voltar
   `BLOCKED`, corrija e re-rode antes de fechar a rodada. **A vitrine é uma das superfícies
   afetadas**, e passa pelo mesmo gate: lei que não passa no detector não é lei.
5. **Commit atômico por rodada.** Uma rodada = uma unidade lógica; o histórico fica legível e
   o loop pode parar a qualquer momento com o repo íntegro.

## Passo 6 — Lei morta

Ao fim do modo (não de cada rodada), varra o cabeçalho procurando **token que nenhum
consumidor referencia mais**. Lei morta não é erro e não reprova nada — é **proposta de
remoção**, e vai ao usuário como tal, com onde o token era usado da última vez.

Um DS que só cresce vira museu: cada token morto é uma regra que alguém vai encontrar,
respeitar e propagar sem saber que ninguém mais a usa. Remover é tão parte de guardar quanto
acrescentar.

## Migração — repo que ainda tem tokens file JSON

Repo antigo pode ter um `*.tokens.json` ao lado de um `DESIGN.md` sem cabeçalho. Quando
encontrar isso, **promova, e diga o que fez** — nunca em silêncio:

1. Leia o JSON e escreva o cabeçalho equivalente no topo do `DESIGN.md`.
2. Confira contra o CSS/tokens reais do repo: o JSON era escrito à mão e pode já ter
   divergido. **O código vence o JSON** — era exatamente essa divergência que não tinha
   quem comparasse.
3. Apague o JSON e ajuste quem o referenciava (`--ds` em scripts, docs do repo).
4. Reporte em uma linha o que mudou de valor na promoção, se algo mudou.

## Fronteira com `audit` e `polish`

- `audit` diagnostica UMA tela contra o DS sem alterar e grava um `briefing.md`. `improve`
  **usa** a renderização estilo-audit como canvas, mas seu produto é evoluir o **DS** em
  rodadas — não gera briefing de audit.
- `polish` aplica um briefing em código. A escrita-de-volta do `improve` reusa a mecânica de
  propagação do guardião, não o fluxo do `polish`.
- O encadeamento `audit → polish` (medir uma tela → aplicar) permanece independente do
  `improve` (evoluir a lei).

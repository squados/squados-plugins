# Modo `audit` — diagnosticar sem alterar

`audit` mede um alvo (tela ou componente) contra o design system e devolve um **briefing
de mudanças pronto**. Não toca em código — é leitura, render e medição. O `polish`
(`references/visual/polish.md`) é quem aplica.

Duas camadas, sempre as duas: **Camada 1** (o detector, `scripts/detector/run.mjs`) mede
o render de verdade e reprova por número — é o que trava a entrega. **Camada 2** (a
crítica perceptual, `references/visual/slop.md`) julga gosto sobre os prints, sempre com
evidência — é o que eleva. Uma sem a outra deixa passar metade dos erros: a Camada 1 não
enxerga "isso parece feito por IA"; a Camada 2 sozinha se auto-avalia com o mesmo viés
que produziu o erro.

## Passo 0 — Abrir a lei

Antes de renderizar qualquer coisa:

- **`DESIGN.md`** — é ele que entra como `--ds` do detector (Passo 2) e é contra ele que o
  Passo 4 cruza. Sem `DESIGN.md` no repo, o detector roda sem lei: o gate continua valendo
  (contraste, ritmo, alvo de toque não dependem de DS), mas `radius-off-system` e os checks
  de consistência somem. **Diga isso no briefing** em vez de deixar o usuário achar que
  mediu tudo, e ofereça `design-system document` uma vez.
- **`PRODUCT.md`** — as **anti-referências** são insumo direto da Camada 2 (Passo 3).

## Passo 1 — Renderizar e capturar

Antes de renderizar, cumpra o **Gate obrigatório antes de abrir servidor** de `SKILL.md`
§Higiene de runtime. Reutilize um servidor existente quando ele servir a rota e a superfície
corretas; não abra build + preview por reflexo. Um dev server não é automaticamente válido nem
inválido: confirme que ele reproduz o shell e as restrições do alvo e que está estável para a
captura. Se nenhuma candidata passar, prefira build + preview ou o harness estático já usado
pelo detector. Então renderize em Playwright headless (leia `playwright.md` antes de
rodar). **O que capturar depende do meio** (`SKILL.md` §Abertura,
`references/visual/medium.md`):

- **web** — os breakpoints do escopo. Pergunte antes: *"ajusto em todos os breakpoints
  (mobile+tablet+desktop) ou desktop primeiro (default)?"*. Escopo `desktop` → um print
  (1280×800); escopo `all` → os três abaixo. Desktop primeiro é o default porque o arranjo
  do desktop redefine o que o mobile precisa reempacotar.
- **print** — **não pergunte breakpoint**: papel não reflui. Capture um exemplar de cada
  **tipo de página** (§Amostragem por tipo).
- **slide** — um exemplar de cada tipo de frame (título, conteúdo, encerramento).

| Breakpoint (só web) | Largura | Altura |
|---|---|---|
| mobile | 375px | 780px |
| tablet | 768px | 1024px |
| desktop | 1280px | 800px |

**Audite a superfície REAL, não uma que diverge dela.** O alvo é o que o usuário de fato
vê — a rota de produção, dentro do shell de produção. Um harness `/dev/*` só é válido se
renderiza sob as MESMAS restrições da produção (mesma largura, mesma **altura disponível**,
mesmo container de scroll, mesma chrome ao redor). Um sandbox que é um `<main>` pelado muda
o contexto de layout e **esconde** o que quebra a tela: containers de altura travada, clamps
de conteúdo, overflow, scrollbar nativa. Se você não consegue provar que o harness reproduz
o palco de produção, audite a rota real (autentique se preciso — `playwright.md`).

**NUNCA `fullPage` numa tela de altura fixa ou scroll interno.** `fullPage: true` expande a
página até altura infinita: todo elemento ganha espaço que não tem em produção, o corte some,
o `line-clamp` não dispara, os medalhões/stats ganham ar, e a scrollbar nativa nunca aparece.
Você mede uma tela que não existe. Capture no **viewport real** (com `height` fixo, tabela
acima) pra ver exatamente o que o olho vê. Só use `fullPage` em página que genuinamente rola
o body inteiro (landing longa) — e mesmo aí, capture TAMBÉM o viewport inicial.

Salve os prints em `<OUT>/` (a pasta datada de trabalho, SKILL.md §Pasta de saída) — são
evidência para a Camada 2 e viram anexo do briefing (§Passo 5). No escopo
`all`, um alvo que só é auditado num breakpoint não está auditado — problema de
responsividade só aparece comparando os três lado a lado. No escopo `desktop`, o único
print de desktop É a auditoria completa daquela passada: responsividade está fora de
escopo por decisão explícita, não é um breakpoint "esquecido", então não gere finding de
mobile/tablet — eles entram só quando o usuário pedir a segunda passada (`all`).

**Checklist do que o viewport-real precisa revelar (e o `fullPage` esconde):** conteúdo
cortado pela borda do palco; `line-clamp`/reticências escondendo a parte informativa;
scrollbar nativa não-estilizada; elementos encolhidos a ponto de ficarem ilegíveis pra
caber na altura. Se qualquer um aparece, é finding — a "solução" de encolher/truncar pra
caber é o próprio defeito.

## Passo 2 — Rodar o detector (Camada 1)

```bash
node $SKILL_DIR/scripts/detector/run.mjs <alvo> \
  [--ds DESIGN.md] [--medium web|print|slide]
```

- **Sempre por caminho absoluto** — a skill é global, o cwd é o projeto. Caminho relativo
  não resolve.
- `<alvo>` é uma URL (`http://...`) ou um arquivo HTML local — `run.mjs` decide pelo
  prefixo `http`.
- `--medium` desliga os checks sem domínio de aplicação no meio (scrollbar, alvo de toque,
  transição em impresso). Ver `references/visual/medium.md` §`--medium` no detector.
- **Alvo que o CLI não alcança** (exige sessão autenticada, ou N cliques dentro de um wizard/
  modal/aba): o `run.mjs` só faz `goto` — ele não loga nem navega. **Não invente um harness
  `/dev/*` por causa disso** (§Passo 1 proíbe medir superfície divergente). Escreva um driver
  `.mjs` na `<OUT>` que importa os MESMOS módulos do detector e dirige o browser você mesmo:
  ```js
  const S = 'SKILL_DIRECTORY_URL/scripts/detector'
  const { MEASURE_FN_SOURCE } = await import(`${S}/measure.mjs`)
  const { runChecks } = await import(`${S}/checks/index.mjs`)
  const { scoreReport, formatReport } = await import(`${S}/report.mjs`)
  // ... newContext({ viewport, storageState }) → navegue até o alvo → screenshot (sem fullPage)
  const measured = await page.evaluate(`(${MEASURE_FN_SOURCE})()`)
  console.log(formatReport(scoreReport(runChecks({ ...measured, designSystem }))))
  ```
  Reusar os módulos (em vez de reimplementar limiares) é o que mantém o gate sendo o mesmo gate.
  Aproveite o driver para dumpar **quem é cada `elN`**: o measure numera na ordem do walk do
  DOM, então `kept[Number(id.slice(2))]` reconstrói o elemento — sem isso um P1 é um id opaco e
  você não sabe qual linha de código consertar.
- `--ds DESIGN.md` aponta para a lei visual do repo — o detector lê o cabeçalho YAML e
  deriva dele o baseline (`scripts/detector/design-md.mjs`); um `*.tokens.json` legado
  também é aceito. Sem `--ds`, o detector roda sem baseline — ainda pega
  espaçamento/gap/contraste fora de escala, mas não pega "cor fora do DS" nem "raio
  incoerente com o DS", porque não tem contra o que comparar. **Cabeçalho ilegível sai com
  código 2**, não com veredito: DS quebrado que degradasse para "sem lei" daria `PASS` por
  ausência de régua.
- Saída: `formatReport` imprime o **gate** e a contagem por severidade, seguido de cada
  finding como `[SEV] rule @elementId: mensagem (medido X, esperado Y)`.
- **Gate: `BLOCKED` se `P0 + P1 > 0`; `PASS` caso contrário.** P2/P3 não bloqueiam — viram
  findings no briefing mas não travam a entrega.
- Código de saída do processo: `1` se `BLOCKED`, `0` se `PASS` — útil pro loop de
  correção do `polish` (§Passo 4 de `polish.md`) checar sem parsear a saída de texto.

Cada finding do detector já vem no formato do contrato (`scripts/detector/contract.mjs`):
`rule`, `severity`, `elementId`, `measured`, `expected`, `message`. Não reescreva nem
resuma essa saída ao transcrever para o briefing — copie os valores medidos como estão.
Um finding sem valor medido/esperado concreto não é aceitável nesta camada; se o detector
não mediu, não é finding de Camada 1.

**Alvo paginado (PDF/impresso):** os dois falsos-positivos estruturais que documentos
paginados causavam — gap 0 entre linhas de tabela e entre elementos separados por quebra
de página — **já estão corrigidos no detector** (`checks/spacing.mjs`). Se reaparecerem, é
regressão do check, não limitação a aceitar. O que continua valendo é a disciplina:
identifique cada `elN` (dump via driver custom, acima) antes de aceitar OU descartar um
P1 — nunca descarte às cegas por "deve ser coisa de PDF".

**A Camada 1 não basta em impresso.** O detector roda no Chromium, o mesmo motor que gerou
o PDF: ele aprova o que ele mesmo produziu. Bugs de portabilidade (gradiente terminando em
`transparent`, peso de fonte sintético) só aparecem noutro renderizador — o procedimento
está em `references/visual/rebuild.md` §Verificação cruzada.

## Passo 3 — Crítica perceptual (Camada 2)

Revise a folha de contato, escopo, meio, design system e achados do detector.
Faça a crítica na sessão atual. Uma revisão independente pode ajudar quando
houver ferramenta nativa e autorização aplicável; não é requisito deste modo.
Registre veredito e até oito achados ordenados, com evidência verificável.

A crítica usa `references/visual/slop.md` como checklist: cor,
layout, tipografia, ornamento. Cada item da taxonomia é um **tell nomeável** — a crítica
cita o nome exato do tell (ex.: "gradiente roxo/glow de IA"), a região/elemento onde
apareceu, e por que aquilo lê como gerado por IA.

**Regra de evidência (não-negociável, herdada de `slop.md`):** todo finding desta camada
exige **o quê** (o tell), **onde** (região/elemento do print) e **por quê** (razão
concreta). É proibido registrar "parece ok", "tá bom" ou qualquer veredito sem elemento
citado — se a crítica não consegue apontar região e motivo, o item não entra no briefing.
Silêncio é preferível a evidência fabricada.

A crítica também cobre o que o detector estruturalmente não mede: harmonia de composição,
personalidade visual, se a hierarquia realmente guia o olho na ordem certa — julgamento
que não vira número, mas ainda assim exige prova visual, não opinião solta.

**As anti-referências do `PRODUCT.md` entram aqui, ao lado do `slop.md`.** O `slop.md` é a
taxonomia do genérico — o que qualquer projeto não pode parecer. A anti-referência é
específica **deste** projeto: "não pode parecer um dashboard de fintech", "não pode parecer
um site de agência". Um alvo pode passar limpo pelo `slop.md` e ainda assim estar virando
exatamente a coisa que o dono disse que não queria. A mesma regra de evidência vale: nomeie
a anti-referência, a região, e o que ali a puxa para lá.

### Amostragem por tipo — alvo com muitas telas ou páginas

**Num fluxo multi-tela de produto (wizard, stepper, abas), a Camada 2 roda em CADA tela.**
Num **documento longo**, a unidade é o **tipo de página**, não a página: um exemplar de
capa, folha de rosto, abertura de capítulo, corpo, página com tabela, com figura, com
código, e o que mais existir. Tipicamente 6-8 prints cobrem um livro inteiro, porque o
resto é repetição do mesmo tipo. Um tipo que aparece com variação relevante (tabela larga
e estreita) conta como dois tipos. Ver `references/visual/medium.md` §Amostragem.

Exigir 80 críticas de um livro de 80 páginas não produz rigor — produz desobediência
silenciosa. Exigir 7, uma por tipo, é cumprível e pega o mesmo que importa.

**Detalhamento do caso multi-tela de produto:** O detector (Camada 1) aprova por número e é CEGO a alinhamento e a "o que é o
quê" — uma tela pode ter gate `PASS` de espaçamento/contraste e mesmo assim ser uma sopa de
chips desalinhada e ilegível de propósito. Esse defeito NÃO aparece na Camada 1; só aparece
quando você OLHA o print e nomeia o tell (ver `slop.md` §"Chip-soup"). O erro clássico é
auditar as telas "principais" (a 1ª do fluxo, a mais bonita) e assumir que as secundárias
"são iguais" — as telas de SELEÇÃO secundárias (perícias, magias, maestrias, sub-escolhas de
raça/classe) são exatamente onde o slop se esconde. Regra: um print por tela do fluxo, crítica
perceptual em todos, sem pular nenhum "porque parece com o outro". Se o fluxo tem 10 passos,
são 10 críticas, não 2.

## Passo 4 — Cruzar com o DS

Cada divergência encontrada (pelo detector ou pela crítica) cai em uma de **três**
categorias, nunca ambígua — as mesmas três saídas do fechamento do guardião (`SKILL.md`
§Guardião):

- **Violação** — divergência não-intencional. O código fez um one-off que ninguém
  escolheu (cor fora da paleta, espaçamento fora da escala 4pt, raio inconsistente). Isso
  vira finding no briefing para o `polish` corrigir na direção do DS existente.
- **Falta lei** — padrão bom e recorrente que ainda não virou token. Não é erro a
  corrigir: é proposta de expandir a lei. Vira entrada em `## Candidatos a melhoria de DS`,
  nunca misturada com os findings de violação.
- **A lei perdeu** — um one-off que é **melhor** que a lei vigente. Aqui o fix não é puxar
  o código de volta para o DS: é **derrubar o token** e levar o valor novo para a lei.
  Entra no briefing como `## A lei perdeu`, com o token que ele substitui nomeado.

**A terceira categoria é a mais fácil de perder**, porque a Camada 1 a reporta com a mesma
cara da primeira: um `radius-off-system` não sabe se o 12px ali é descuido ou é melhor que
o 8px da lei. Quem decide é a Camada 2, olhando o pixel. Reclassificar tudo como violação é
como o DS vira museu — e reclassificar violação como "a lei perdeu" **não destrava o gate**:
o `SKILL.md` já proíbe isso.

Essa separação é o que faz o DS ser uma catraca: a mesma divergência nunca é
tratada como "conserta e esquece" quando na verdade é sinal de que a lei está incompleta —
ou de que ela está errada.

### Proveniência — o componente espelhado derivou da fonte?

O detector mede o render contra limiares; a crítica julga o gosto. Nenhum dos dois pega um
componente que é um **porte/espelho de um canônico** e **divergiu** dele — proporção errada,
sub-elemento maior, espaçamento diferente do original. É o "quase certo, mas estranho"
(ex.: um botão cujo medalhão coroante ficou grande e baixo demais e cobre o rótulo, porque o
porte local não acompanhou uma correção feita no design system).

Por isso, para todo componente em quadro que tenha uma **fonte de verdade externa**, faça o
diff contra ela. Sinais de que existe fonte externa (procure ativamente):

- um comentário no código do tipo "porte local de X", "mirror de Y", "copiado de Z";
- um token/arquivo mantido espelhado entre repos (o `CLAUDE.md` do projeto costuma dizer
  quais são — ex.: "design tokens are mirrored, not imported");
- a MESMA peça aparecendo diferente em duas telas do próprio produto.

Achou fonte → abra o canônico e compare os valores (tamanhos, offsets, espaçamentos,
geometria do ornamento) lado a lado. **Drift é violação**, não candidato de DS: o certo já
existe na fonte, e o fix é **re-sincronizar com o canônico** (copiar os valores da fonte),
nunca reinventar um valor novo "que parece bom". Registre no briefing como finding com o
valor da fonte no `fix:` (ex.: "emblema 44px@-18px → 36px@-23px, igual ao dungeonai-pages").
Isto estende o §DRY reuse-first (SKILL.md): não basta não DUPLICAR — um espelho que já existe
precisa ser verificado contra o original, senão a duplicata cala-se enquanto envelhece.

**A reclassificação como "candidato de DS" NÃO se aplica a legibilidade nem a scrollbar.**
Ela existe pra padrões estéticos (um raio, um espaçamento, um tom) — não pra desculpar
texto funcional ilegível ou uma scrollbar nativa. Regras que NÃO podem virar "candidato de
DS" e continuam sendo **violação que trava o gate**:

- **Texto funcional que o usuário PRECISA ler** abaixo do piso de legibilidade (um valor de
  atributo, um rótulo de stat, um número de ficha). "É micro-tipografia intencional do DS"
  não vale quando o resultado é ilegível — se o elemento encolheu pra caber, o defeito é o
  container, conserte o container (mais espaço, ou menos coisa dentro), não aceite os 7px.
  Eyebrow decorativa trackeada é uma coisa; o número que o jogador lê é outra.
- **Scrollbar nativa não-estilizada** — nunca é "intenção de DS", é ausência de craft.
- **Conteúdo cortado / truncado escondendo a parte que importa** — reticências no meio do
  gancho não é decisão de DS, é o palco pequeno demais pro conteúdo.

Se você se pega escrevendo um parágrafo convincente pra justificar por que um P1 do detector
"na verdade tá ok", pare: é o sinal de que você está narrando uma saída do gate (SKILL.md
§Bans). O detector marcou porque está ilegível/quebrado. Conserte.

## Passo 5 — Gravar o briefing

Grave o resultado em `<OUT>/briefing.md` — a pasta datada de trabalho no scratch do repo
(SKILL.md §Pasta de saída), nunca solto na raiz. Esse arquivo é
o contrato entre `audit` e `polish` — precisa ser autossuficiente o bastante para o
`polish` rodar em outra sessão, sem o contexto desta.

**Formato do briefing (obrigatório, siga literalmente):**

```
# Briefing — <alvo> — <data>
## Meio: web|print|slide
## Escopo: desktop|all   (só web)
## Lei: <caminho do DESIGN.md, ou "sem DESIGN.md — checks de consistência não rodaram">
## Anti-referências: <as do PRODUCT.md, ou "nenhuma declarada">
## Prints: <caminhos>
## Gate do detector: BLOCKED|PASS  (P0:n P1:n P2:n P3:n)
## Findings (medidos)
- [P0] <rule> @<elemento>: <mensagem> | medido <x> / esperado <y> | fix: <ação concreta>
## Crítica perceptual (gosto)
- <região>: <problema> | evidência: <o quê/onde> | proposta: <ação>
## Candidatos a melhoria de DS
- <padrão/one-off> → promover como <token/componente>
## A lei perdeu
- <o que está no alvo> é melhor que <token vigente> → derrubar <token> | evidência: <onde>
```

Regras de preenchimento:

- `<alvo>` e `<data>` identificam o que foi auditado e quando — o briefing é reaproveitado
  em sessão futura, então precisa datar-se sozinho.
- `## Meio` grava o meio decidido na Abertura (`SKILL.md`). É o que faz o `polish` rodar o
  detector com o mesmo `--medium` numa sessão futura, sem reperguntar.
- `## Escopo` só existe em alvo **web**: `desktop` (default) ou `all`. É o que faz o
  `polish` honrar o mesmo recorte — sem ele, não dá pra saber se mobile/tablet foram
  adiados de propósito ou nunca medidos. Em `print`/`slide`, escreva `n/a`.
- `## Prints` lista os caminhos de arquivo do Passo 1: só o desktop no escopo `desktop`,
  os 3 (mobile/tablet/desktop) no escopo `all`.
- `## Gate do detector` reproduz exatamente o `gate` e as contagens de `scoreReport`
  (§Passo 2) — não arredonde, não resuma.
- `## Findings (medidos)` tem uma linha por finding do detector, na ordem de severidade
  (P0 primeiro). O campo `fix:` é obrigatório e precisa ser uma ação concreta que o
  `polish` consiga executar sem reinterpretar (ex.: "trocar `padding: 6px` por
  `var(--space-2)` (8px)", não "ajustar espaçamento").
- `## Crítica perceptual` tem uma linha por finding da Camada 2, seguindo a regra de
  evidência do Passo 3 — `<problema>` nomeia o tell, `evidência:` cita a região/elemento,
  `proposta:` é a ação sugerida.
- `## Candidatos a melhoria de DS` lista só os itens classificados como candidato no
  Passo 4 — nunca duplica um item já listado como finding de violação.

Se não houver nenhum item numa seção (ex.: gate `PASS` sem findings), mantenha o
cabeçalho da seção vazio em vez de omiti-lo — o `polish` espera o formato completo e um
cabeçalho ausente é ambíguo entre "não rodou essa camada" e "não achou nada".

## Passo 6 — Fechar com o guardião

O `audit` não escreve código, mas fecha igual aos outros (`SKILL.md` §Guardião): responda
**"o que eu medi diz que a lei precisa mudar?"**, com uma das três saídas nomeada. As
seções `## Candidatos a melhoria de DS` e `## A lei perdeu` do briefing **são** essa
resposta escrita — briefing que sai com as duas vazias está afirmando *nada muda*, e isso
é uma conclusão, não um esquecimento. Se for o caso, diga em uma linha.

## Encadeamento

`audit` e `polish` podem rodar em sequência numa tacada só (o `audit` grava o briefing e o
`polish` já o consome na mesma sessão) ou separados, quando o usuário quer revisar o
briefing antes de qualquer mudança de código entrar. O `audit` nunca altera o repositório
além de escrever `<OUT>/briefing.md` e os prints na pasta datada de trabalho (SKILL.md
§Pasta de saída).

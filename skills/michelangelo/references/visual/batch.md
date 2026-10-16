# Lote — escopo grande quebrado em partes

Carregue quando o pedido cobre **2+ telas**, várias áreas/componentes soltos, ou uma tela
única com seções independentes demais para uma passada. Vale para refino, redesign do
artefato e redesign do DS. **Conserto não entra aqui** — defeitos nomeados são baratos e
seguem direto, mesmo espalhados por várias telas.

O motivo é medido, não estético: tentar o lote inteiro numa passada estoura a janela em
prints e auto-QA e entrega todas as telas pela metade. Uma parte por vez, cada uma com a
cadeia completa, entrega cada tela inteira.

## Passo 1 — quebra junto com a Abertura

A tabela de partes vai **na mesma mensagem** das três perguntas da Abertura — uma espera
só. Depois da resposta, comece sem pedir nova confirmação (o usuário corrige a quebra na
própria resposta, se quiser).

A quebra sai do pedido e das telas/prints enviados. Quando decidir o corte por seção exige
ver a estrutura, é permitida uma leitura de estrutura do alvo (quais seções existem, o que
é compartilhado) — exceção única ao "antes de abrir qualquer arquivo" da Abertura. Nada de
print, detector ou `context.mjs` antes da resposta.

| # | Alvo | Seções incluídas | Por que este recorte |
|---|---|---|---|

**Regra de corte:**

- A unidade padrão é **a tela**.
- Separe uma **seção** em parte própria quando ela é compartilhada entre telas (tabbar,
  header, navegação) ou quando uma área de conteúdo sozinha já é grande o bastante para
  uma passada.
- **Nunca um componente isolado** — botão, card ou input entram na parte da seção que os
  contém.

**Ordem:** o compartilhado primeiro. A tabbar redesenhada na parte 1 é o que as telas das
partes seguintes consomem; fazê-la por último obriga a revisitar todas.

## Passo 2 — `PLAN.md`, o estado do lote

O lote ganha **um** `<OUT>` e cada parte uma subpasta `<OUT>/NN-<parte>/` (folha de contato,
variantes, briefing daquela parte). O estado vive em `<OUT>/PLAN.md`:

```markdown
# Lote — <slug>

## Pedido original
<literal, sem paráfrase>

## Abertura
- Escopo: <refino | redesign do artefato | redesign do DS>
- Lei visual: <preservada | redesenhada>
- Meio: <web | print | slide>

## Partes
| # | Alvo | Status | Direção escolhida | Arquivos tocados | Detector | Artifact |
|---|---|---|---|---|---|---|
| 01 | tabbar | entregue | B — ... | ... | PASS | <url> |
| 02 | Home | em andamento | — | | | |

Status: pendente | em andamento | entregue | travado (motivo)

## Decisões herdadas
- <decisão de uma parte que as seguintes devem respeitar — ex.: "tabbar agora usa X">
```

**Atualize por marco, não por passo:** quando o usuário escolhe a direção na galeria e
quando a parte fecha (entregue ou travada). Toda decisão que muda o que uma parte seguinte
deve fazer vai para **Decisões herdadas** no mesmo momento.

## Passo 3 — cada parte é uma execução completa

Cada parte roda a cadeia normal do escopo (`SKILL.md` §As quatro cadeias), com o checkpoint
visual de sempre. Antes de abrir a parte, leia **Decisões herdadas** e trate-as como lei
local. O teto de verificação (`SKILL.md` §O teto) vale **por parte**: uma parte travada
fica `travado` no `PLAN.md` e o lote segue para a próxima — não abre terceira rodada.

Não comece a parte seguinte com a galeria da atual aberta: a escolha do usuário pode virar
decisão herdada.

## Compactação

**Depois de qualquer compactação, releia `<OUT>/PLAN.md` antes do próximo passo.** O
resumo não é fonte confiável de qual parte está em andamento, qual direção foi escolhida
nem do que foi herdado. Um print de parte anterior nunca é relido para reconstruir
contexto — o `PLAN.md` é que guarda o que importa.

## Fechamento

Ao fechar a última parte, entregue a tabela de **Partes** do `PLAN.md` (status, veredito,
link de cada Artifact). Parte `travada` aparece como travada, com o motivo — o lote só está
entregue quando todas estão `entregue`.

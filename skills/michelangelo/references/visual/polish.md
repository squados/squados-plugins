# Modo `polish` — aplicar o briefing e propor a evolução do DS

`polish` transforma o briefing do `audit` (`<OUT>/briefing.md`, SKILL.md §Pasta de saída) em código de
verdade, reusando o que já existe em vez de duplicar, e termina só quando o detector
confirma o resultado.

**`polish` é o modo do regime de refino.** Ele corrige o que está torto preservando a
direção visual. Se o pedido é trocar a direção — paleta, tipografia, capa, estrutura — o
modo é `rebuild` (`references/visual/rebuild.md`), e roteá-lo para cá devolve um refino que o
usuário lê como "está igualzinho". Ver `SKILL.md` §Abertura.

**Passo de abertura — leia a lei antes de tocar em código.** Abra o `DESIGN.md`: o
cabeçalho diz quais tokens existem, e é reusando token que um fix propaga em vez de virar
mais um one-off. Valor cru onde já existe token é ban absoluto (`SKILL.md`), e a única
forma de não cometê-lo é ter a lista na mão antes de editar.

## Passo 0 — Decidir se a mudança de arranjo passa por galeria

Vale só para mudanças de **arranjo de layout**; os fixes mecânicos do detector aplicam
direto, sempre.

Pedido com **REDESIGN** segue a galeria de 3 opções de `SKILL.md` §Abertura. A bifurcação
abaixo vale para pedidos sem essa palavra.

- **Pedido estreito** ("corrige paddings", "aplica os P0") → aplica direto. Gerar variantes
  para um pedido cirúrgico é custo sem valor.
- **Pedido amplo dentro do refino** ("reorganiza essa seção") → **pergunte** se o usuário
  quer ver opções antes de gastar o render das 3 variantes. Se sim, siga
  `references/visual/gallery.md` (nível tela), cada variante passando o gate antes de entrar.

Uma variante pode propor padrão fora do DS atual; aceitá-la é o mesmo mecanismo de
promoção do Passo 3.

## Passo 1 — Ler o briefing

Leia `<OUT>/briefing.md` (a pasta datada de trabalho no scratch do repo, SKILL.md §Pasta
de saída). Se o arquivo não existir, rode o `audit`
(`references/visual/audit.md`) antes de continuar — `polish` nunca improvisa fixes sem um
briefing medido por trás; aplicar "de cabeça" reintroduz exatamente o viés
auto-avaliado que a Camada 1 existe para eliminar.

Leia o campo `## Escopo` do briefing (`desktop` ou `all`, ver `references/visual/audit.md`
§Passo 5) — ele define em quantos breakpoints o Passo 4 re-renderiza e mede. No escopo
`desktop` (default), o `polish` conserta e valida **só o desktop**; mobile/tablet ficam
adiados para uma segunda passada (`all`). Se o briefing não tiver o campo (briefing
antigo), assuma `desktop` e diga isso ao usuário. Nunca conserte breakpoints fora do
escopo gravado — isso gasta tokens numa base que o próprio usuário pediu para adiar.

Trate as seções do briefing de formas diferentes:

- `## Findings (medidos)` — correções obrigatórias, na ordem de severidade (P0 antes de
  P1, antes de P2/P3). Cada linha já tem um `fix:` concreto — execute-o.
- `## Crítica perceptual` — correções de gosto; a `proposta:` de cada linha é a direção,
  não um passo mecânico, então julgamento fica a cargo de quem aplica.
- `## Candidatos a melhoria de DS` — não são fixes no alvo. São propostas para o Passo 3.
- `## A lei perdeu` — também não são fixes no alvo, e são o **oposto** de um fix: aqui o
  código está certo e o token é que está velho. Não puxe o alvo de volta para o DS; leve
  ao Passo 3.

## Passo 2 — Aplicar os fixes com DRY reuse-first

Aplique os `fix:` na ordem de severidade, seguindo **`references/visual/generate.md` §DRY** — a
fonte única das regras (procurar antes de criar, adaptar em vez de copiar, extrair na 3ª
repetição, token no lugar de valor cru, master + overrides).

Duas ênfases que valem especificamente aqui:

- **DRY guia cada decisão deste passo, não é faxina posterior.** O momento de procurar o
  reutilizável é antes de escrever, não depois de duplicar.
- **Não reintroduza a categoria de erro que você está corrigindo.** Um fix que troca um
  `padding: 13px` por um `padding: 14px` igualmente solto não corrigiu nada — trocou um
  one-off por outro.

Vale igual para os `fix:` mecânicos e para as propostas de gosto: os dois terminam em
código, e código duplicado é duplicado independente de qual camada pediu.

## Passo 3 — Propor a evolução da lei

Cada item de `## Candidatos a melhoria de DS` e de `## A lei perdeu` no briefing é uma
proposta, não uma ordem — avalie se ele de fato melhora a lei atual.

**O `polish` não escreve o `DESIGN.md`.** Quem escreve a lei é o `design-system`, e as
propostas aceitas vão para lá pelo caminho `improve`
(`references/visual/design-system/improve.md`), que já sabe qual seção recebe o quê e propaga para
os consumidores. Escritor único é o que impede a lei de crescer por três portas com três
critérios; antes, `polish`, `improve` e `new` escreviam os três, e a própria doc admitia.

O que o `polish` faz aqui é **preparar a proposta**: o token ou padrão nomeado, o valor
concreto, onde ele apareceu, e qual das saídas do fechamento ele é —
*falta lei* (não existia) ou *a lei perdeu* (existia e o novo é melhor). Com isso o
`improve` escreve sem re-descobrir nada.

Propor é o mecanismo da catraca: a divergência que era exceção vira lei, e a próxima
auditoria já mede contra ela. Nunca proponha item que não estava no briefing — isso apaga
a separação entre "corrigido" e "novo na lei" que o `audit` fez no Passo 4 dele.

## Passo 4 — Re-renderizar, re-medir, e travar o loop

Depois de aplicar os fixes e (se houve) promover candidatos, repita o Passo 1 do `audit`
(render headless nos breakpoints do escopo gravado — só desktop no escopo `desktop`, os 3
no escopo `all`) e rode de novo:

```bash
node scripts/detector/run.mjs <alvo> [--ds DESIGN.md]
```

- Se o gate voltar `PASS` (0 P0 + 0 P1), o `polish` está concluído — pare aqui.
- Se voltar `BLOCKED`, qualquer P0/P1 restante entra num **loop de correção**: volte ao
  Passo 2 só para os findings que ainda restam, re-renderize, re-rode o detector. Repita
  até `PASS`. Não entregue um resultado com o gate `BLOCKED` — esse é o próprio motivo do
  detector existir: travar a entrega por número, não por vibe.
- P2/P3 remanescentes não bloqueiam a entrega, mas registre-os — eles alimentam a próxima
  auditoria.

Use o código de saída do processo (`0` = `PASS`, `1` = `BLOCKED`, ver `run.mjs`) para
decidir automaticamente se o loop continua, sem precisar reparsear a saída de texto a
cada iteração.

## Passo 5 — Entregar, e fechar com o guardião

**Passo de fechamento, obrigatório** (`SKILL.md` §Guardião): antes de declarar entregue,
responda **"o que eu fiz é melhor que o DS?"**, com uma das três saídas nomeada —
*nada muda*, *falta lei*, ou *a lei perdeu*. As duas últimas viram a proposta do Passo 3 e
seguem para o `design-system improve`. Pular equivale a responder "nada muda" sem ter
olhado, e é ban absoluto.

Junto do resultado, entregue o **gate** e o que mudou. Em alvo impresso, a verificação
cruzada num segundo motor de render é obrigatória antes de declarar pronto
(`references/visual/rebuild.md` §Verificação cruzada) — o Chromium aprova o que ele mesmo gerou, e
gradiente com `transparent` ou peso de fonte sintético só aparecem noutro renderizador.

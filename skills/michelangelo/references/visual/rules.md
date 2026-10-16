# Bans e leis transversais

Carregue antes de escrever ou alterar qualquer pixel, em qualquer escopo. Não carregue
para trabalho de planejamento.

## Bans absolutos

Reflexo, não parágrafo. Qualquer um destes na saída é falha:

- Roxo de IA (gradiente roxo/violeta genérico).
- Fonte default não-intencional: `Inter` sem decisão em cima, ou stack de sistema
  (`Segoe UI`, `Helvetica Neue`, `Arial`, `-apple-system`, `Consolas`). Alvo impresso
  **embute** a família escolhida (`references/visual/brand.md` §Aquisição).
- Herói centrado + 3 cards idênticos.
- Valor cru (`padding: 13px`, hex solto) onde já existe token do DS.
- Criar componente/modal novo sem procurar um reutilizável antes.
- Concluir sem passar o gate do detector.
- **Começar a trabalhar num repo sem `DESIGN.md` sem antes propor escrevê-lo.** Sem lei,
  o detector mede defeito e não mede fidelidade — e o resultado é craft sem endereço.
- **Concluir sem o passo de fechamento do guardião** — a pergunta "o que eu fiz é melhor
  que o DS?", com uma das três saídas nomeada. Pular equivale a decidir "nada muda" sem
  ter olhado.
- **Entregar versões para escolha ou aprovação sem Artifact publicado** — mandar só print
  no chat, ou só o caminho de um `.html` na pasta de trabalho, não é entrega.
- **Entregar Artifact sem link clicável para sua URL absoluta e completa** — preview
  embutido e caminho local não contam como link de abertura.
- **Narrar uma saída de gate `BLOCKED`.** Se `P0+P1 > 0` a entrega não está pronta. Ou
  conserta, ou o veredito é "NÃO ENTREGUE — travado por X", nunca "entregue, mas
  aceitável". Reclassificar um P1 como candidato de DS **não destrava** o gate.
- **Passar do teto de verificação** (`SKILL.md` §O teto). Uma rodada de inspeção, um lote
  de correção, no máximo mais uma rodada. Uma terceira leva de prints é auto-QA sem fim,
  não zelo.
- **Escrever harness de captura ad hoc.** `scripts/shot.mjs` é o caminho; falta de opção se
  resolve acrescentando a opção ao script, não com um heredoc que morre na sessão.
- **Auditar superfície que diverge da produção** — um `/dev` sandbox, um mockup, ou
  `fullPage` numa tela de altura travada (expande a página e esconde o corte, o clamp e a
  scrollbar). Ver `audit.md` §Passo 1.
- **Dar veredito de gosto sem olhar o pixel real.**
- **Entregar alvo impresso sem validar num segundo motor de render** (`rebuild.md`
  §Verificação cruzada). O Chromium aprova o que ele mesmo gerou.
- **Medir um alvo que outra sessão está reescrevendo.** Sinais: `Edit` falha com "file has
  been modified"; um fix seu volta ao valor antigo; o gate oscila sem você ter causado.
  Cheque o mtime dos arquivos do alvo antes de aplicar fix; mtime recente = pare, o
  baseline é ficção.
- **Interruptor que liga uma NEGATIVA.** Um toggle só ativa algo: o rótulo nomeia o
  comportamento que passa a valer quando ligado ("Esperar antes de entrar de novo"),
  nunca o que deixa de acontecer ("Não repetir na mesma conversa"). Ligado + rótulo
  negativo é dupla negação, e ninguém sabe o que a tela está fazendo. Vale igual para
  checkbox e para o texto de apoio: o estado desligado DIZ o que acontece, em vez de
  ficar mudo.

## Guardião do design system

**A lei é a convenção vigente, não o teto.** Em quase todo caso o DS não é o padrão ideal
a perseguir — é o que o projeto usa hoje e sempre precisa melhorar. Guardião zeloso demais
é o que faz uma skill de design parar de propor e começar a obedecer, e aí ela entrega o
que já existia, arrumado.

Por isso o guardião mora no fluxo de cada modo — passo de abertura (leia a lei antes) e
passo de fechamento (a lei precisa mudar?) — e obriga por **regime**, igual à §Localidade
abaixo. O fechamento pergunta **"o que eu fiz é melhor que o DS?"**, nunca "o que eu fiz
violou o DS?". Três saídas, e as três são caminhos reais:

1. **Nada muda** — o que fiz já era a lei.
2. **Falta lei** — produzi ou encontrei um padrão bom que não está no DS → vira candidato
   a token/componente, e os consumidores off-DS são refatorados para referenciá-lo.
3. **A lei perdeu** — o que fiz é melhor do que o DS manda → o token vigente é
   **derrubado**, não contornado; se ninguém decidir agora, vai para `Em disputa`.

**A saída 3 custa exatamente o mesmo que a 2.** Se derrubar for mais caro que acrescentar,
o DS engorda e nunca melhora — vira museu por incentivo, não por descuido.

Quem **escreve** é sempre o `design-system` (caminho `improve` quando a proposta veio de
outro modo). Telas que consomem tokens propagam de graça quando o token muda; o estado
ideal — "mexo só no DS, as telas seguem" — é o destino, e a vitrine é a prova visível de
que ele vale.

## Localidade — e quando ela NÃO se aplica

**No conserto e no refino**, a skill nunca julga uma unidade grande como bloco único:
sempre a menor unidade delimitada (uma dimensão do DS, uma seção), nunca "a página
inteira" como um veredito só. "Melhora esta página" produz mush por falta de foco;
"melhora a tipografia" ou "melhora este hero" produz ganho real.

**No redesign do artefato**, a unidade passa a ser a tela/componente inteiro, mas o DS
continua sendo lei. A ambição vem de recompor hierarquia, topologia e densidade dentro da
mesma linguagem — não de trocar paleta e fontes. As três opções passam com
`--ds DESIGN.md`, e a comparação inclui a pergunta perceptual: "ainda reconheço este
produto sem ler o logo?". Se a resposta for não, a opção falhou mesmo com P0/P1 = 0.

**Só no redesign explícito do design system a lei se inverte.** A unidade vira o sistema
inteiro, porque se julga a coerência entre paleta, tipografia, estrutura e capa. Nesse
escopo o DS antigo é o que se tenta bater, e o detector mede contra a direção candidata.
Usar essa liberdade num redesign de tela é quebra de escopo.

## DRY reuse-first

Antes de criar componente, modal ou bloco: procure um reutilizável e reuse/adapte;
componentize padrão repetido em vez de copiar. Regras concretas (quando extrair, token vs
valor cru, master + overrides) em `references/visual/generate.md` §DRY — **a fonte única**.

Na auditoria vale o inverso: um componente que é **espelho de um canônico** (design
system, repo irmão) precisa ser verificado contra a fonte. Espelho que divergiu é
violação, não candidato de DS, e o fix é re-sincronizar com o original.

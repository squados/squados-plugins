# Taxonomia de slop — "cara de IA"

Checklist da Camada 2 (crítica perceptual). Cada item abaixo é um **tell nomeável**: ao
olhar o screenshot, a crítica procura especificamente por ele, aponta o elemento/região
onde apareceu e explica por que aquilo lê como gerado por IA — nunca um veredito solto
tipo "parece ok" ou "tá bom". Ver "Regra de evidência" no fim deste arquivo, que vale
para todo finding desta camada.

**Cobertura: varra TODO componente em quadro, não só o conteúdo "principal".** O furo
clássico é auditar o palco (o grid, o card, o formulário) e tratar a moldura em volta —
navbar, abas, stepper, botões, rodapé, medalhões — como "chrome ok" que não merece olhar.
Chrome é UI: um stepper com o ornamento cobrindo o rótulo é tão defeito quanto um card
torto. Passe o olho, elemento por elemento, por cada peça renderizada — inclusive as que
você "sabe" que são de um componente pronto (elas divergem; ver "Componente" abaixo).

## Cor

- **Gradiente roxo/glow de IA.** Fundo ou hero com gradiente `purple → blue` (ou
  `violet → indigo`, `fuchsia → cyan`) e/ou halos de glow ao redor de blobs/ícones. É o
  tell mais reconhecível de slop porque é o default de praticamente todo gerador — a
  crítica cita a região exata (ex.: "hero, 0–40% da altura") e o par de cores visto.
- **Mais de 1 accent.** Duas ou mais cores de destaque competindo pela mesma atenção
  (ex.: CTA roxo E badge laranja E ícone verde, todos com o mesmo peso visual). Um
  sistema de cor intencional tem um accent dominante; slop empilha accents porque cada
  elemento foi decidido isoladamente, sem visão de conjunto.
- **Saturação acima de ~80%.** Cores "gritando" — accent, fundo ou texto com saturação
  alta o bastante para cansar o olho em poucos segundos de exposição. A crítica não
  precisa medir HSL exato; se a paleta parece "néon" ou "vibrante demais para o
  conteúdo", é o tell.

## Layout

- **Herói centrado + 3 cards idênticos.** Título centralizado, subtítulo centralizado,
  botão centralizado, seguido de uma grade de exatamente 3 cards com o mesmo tamanho,
  mesmo ícone genérico, mesma estrutura (ícone → título → parágrafo curto). É o layout
  mais reciclado de landing page gerada — a crítica cita "hero + grid de 3" como padrão
  reconhecido, não como coincidência de conteúdo.
- **Bento com célula morta.** Grid tipo bento (células de tamanhos variados) com pelo
  menos uma célula que não carrega informação nenhuma — só decoração, cor sólida ou
  ícone solto sem texto. Sinal de que o bento foi escolhido pela estética do grid, não
  porque o conteúdo pedia densidades diferentes.
- **H1 com 6 linhas.** Título principal que quebra em várias linhas curtas ao ponto de
  virar um bloco de texto em vez de uma afirmação — geralmente porque o texto gerado é
  verboso e ninguém cortou. A crítica conta as linhas do H1 no viewport observado.

## Tipografia

- **Inter + slate-900 como default não-intencional.** Fonte `Inter` (ou geometric sans
  equivalente) com texto em `slate-900`/preto-quase-puro, sem nenhuma escolha
  tipográfica que sinalize intenção (peso, tracking, pareamento de fonte serifada,
  cor de texto fora do cinza-padrão). O tell não é usar Inter — é usar Inter porque é o
  que veio no template, sem nenhuma decisão em cima.
- **Ausência de hierarquia.** Títulos e corpo de texto com tamanho/peso quase iguais —
  a página não guia o olho para o que importa primeiro. A crítica compara o tamanho do
  H1/H2 mais próximo contra o parágrafo adjacente; se a razão está perto de 1:1, é o
  tell.

## Ornamento

- **Meta-labels.** Rótulos tipo "SECTION 01", "QUESTION 05", "STEP 03 / 06" decorando
  seções sem que o produto tenha uma numeração real (não é um wizard, não é um
  formulário sequencial) — o rótulo existe só para parecer "designed", sem função.
- **Eyebrows em excesso.** Texto pequeno em `uppercase` com `letter-spacing` largo acima
  de títulos (ex.: "OUR SERVICES", "WHY CHOOSE US") aparecendo em mais de
  ⌈número de seções da página / 3⌉ blocos. Um eyebrow ocasional é escolha de design;
  repetido nessa proporção é tique de gerador. A crítica conta quantas seções têm
  eyebrow e compara contra o limite calculado para o total de seções observado.

## Componente

- **Chip-soup / fileira de toggles desalinhada.** Um conjunto de controles selecionáveis
  (perícias, magias, tags, filtros) renderizado como um `flex-wrap` de botões de LARGURAS
  DIFERENTES, com ícones de ação (ℹ, detalhe, remover) SOLTOS entre eles. O resultado não
  tem coluna, não tem grade, não tem célula: cada item flutua com um tamanho, os ℹ caem em
  posições aleatórias, e o olho não consegue dizer "o que é um item" nem "onde clico". É o
  oposto de um grid de cards uniformes. Sinais: `flex flex-wrap gap-*` de `<Button>`+`<button ℹ>`
  em vez de `grid grid-cols-N` de células iguais; itens de texto curto e longo na mesma linha
  sem alinhamento; o ℹ ora ao lado, ora embaixo. FIX: grid de células uniformes (mesma altura,
  ícone ancorado, rótulo alinhado, estado selecionado óbvio, ℹ num canto fixo). Um seletor de
  N opções é uma GRADE, não uma sopa de chips. **Critique cada tela do fluxo, não só a "principal":
  telas de seleção secundárias (perícias, magias, maestrias) são onde a sopa de chips se esconde.**
- **Ornamento sobre o texto.** Um medalhão, emblema, badge, ícone ou selo que cobre, corta
  ou encosta no rótulo do PRÓPRIO componente — ex.: o círculo que coroa um botão descendo
  sobre a palavra dentro dele, um badge de canto tapando o título do card. Quase sempre é
  geometria errada (ornamento grande demais, ou baixo/deslocado demais). A crítica aponta o
  componente, o texto tapado, e que o ornamento invade a caixa do texto em vez de coroá-la.
  Mede fácil: o rect do ornamento não pode sobrepor o rect do rótulo.
- **Componente derivado do canônico (mirror-drift).** Um componente que é um PORTE/espelho
  de uma fonte canônica (design system, repo irmão) mas que divergiu dela — proporção,
  tamanho de sub-elemento, espaçamento diferentes do original. Lê como "quase certo, mas
  estranho". Não se resolve no olho: confirma-se comparando com a fonte (ver audit.md
  §Passo 4 — Proveniência). O sinal pra suspeitar: um comentário "porte local de X", um
  arquivo espelhado, ou o componente ser visivelmente diferente da mesma peça noutra tela.

## Regra de evidência

Toda finding desta camada é inválido sem:

1. **O quê** — qual tell da lista acima disparou (nome exato, ex.: "gradiente roxo/glow
   de IA").
2. **Onde** — a região/elemento específico do screenshot (ex.: "hero, botão CTA
   secundário", "terceiro card da grid de 3", "eyebrow acima do H2 'Features'").
3. **Por quê** — a razão concreta pela qual aquilo lê como slop, não uma opinião vaga.

É proibido registrar "parece ok", "tá bom", "sem problemas visíveis" ou qualquer
veredito sem elemento citado. Se a crítica não consegue apontar região e motivo, o item
não é reportado — silêncio é preferível a evidência fabricada.

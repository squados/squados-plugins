# Register e dials

Formato completo do passo 2 do modo `design-system new` (ver `references/visual/design-system/new.md`,
"Escolher register e inferir os dials"). Este arquivo é a referência que qualquer modo
(`design-system new`, `design-system improve`, `audit`, `polish`) consulta para decidir
register e dials — não reinventa os conceitos, só aponta pra cá.

## Register: brand vs product

`register` é a primeira decisão, antes de qualquer dial. Ele muda a lei inteira — escala
tipográfica, densidade, quanto o design pode arriscar — não é um detalhe cosmético que se
ajusta depois.

- **`brand`** — o design **É** o produto. Landing page, portfólio, marketing site, página
  de campanha, conteúdo editorial longo. A impressão que o visitante leva embora é a coisa
  sendo entregue. Razões tipográficas maiores (escala modular, `clamp()` fluido, ≥1.25
  entre passos), mais respiro entre seções, mais permissão para personalidade — cor
  drenched, layout assimétrico, motion de entrada orquestrado. O risco de parecer genérico
  é maior aqui do que o risco de parecer ousado demais.
- **`product`** — o design **SERVE** o produto. App autenticado, dashboard, painel admin,
  ferramenta, superfície onde o usuário está numa tarefa. Razões tipográficas menores e
  fixas (rem, não `clamp()`; 1.125–1.2 entre passos — mais elementos de tipo cabem sem
  virar ruído), mais densidade de informação, hierarquia mais sóbria. O risco de estranheza
  sem propósito (motion decorativo, afordância inventada) é maior aqui do que o risco de
  parecer "familiar demais" — familiaridade é o objetivo.

| | `brand` | `product` |
|---|---|---|
| O que entrega | impressão / comunicação | tarefa concluída |
| Escala tipográfica | fluida, ≥1.25 entre passos | fixa (rem), 1.125–1.2 entre passos |
| Densidade típica | baixa a média | média a alta |
| Variância típica | média a alta | baixa a média |
| Cor | permissão para Committed/Drenched | Restrained é o piso |
| Motion | pode orquestrar o load inteiro | só transmite estado (150–250ms) |
| Falha comum | genérico, "cara de IA" | estranho sem propósito, afordância inventada |

Um mesmo repo pode ter os dois registers em superfícies diferentes (site de marketing +
app autenticado). Nesse caso o `DESIGN.md` documenta um register por superfície, não um
único register pro repo inteiro.

## Dials: `VISUAL_DENSITY` e `DESIGN_VARIANCE`

Dois dials, escala 1–10 cada, decididos **depois** do register — o register dá o baseline,
o vocabulário do pedido (a "vibe") ajusta a partir dele. (O terceiro dial do
`design-taste`, `MOTION_INTENSITY`, fica de fora — Michelangelo não avalia motion na
Camada 1/2 atual.)

- **`DESIGN_VARIANCE`** — o quanto o layout se desvia de grid simétrico e alinhamento
  previsível.
  - **1–3 (Predictable):** grid CSS simétrico (12 colunas, frações iguais), paddings
    iguais, alinhamento centrado.
  - **4–7 (Offset):** sobreposições (`margin-top: -2rem`), aspect ratios variados lado a
    lado, cabeçalho alinhado à esquerda sobre dado centralizado.
  - **8–10 (Asymmetric):** masonry, `grid-template-columns` fracionário desigual (`2fr 1fr
    1fr`), zonas de vazio grandes (`padding-left: 20vw`).
  - Em todos os níveis 4–10, o layout assimétrico colapsa pra coluna única estrita
    (`w-full`, `px-4`, `py-8`) abaixo de `768px` — a variância é uma decisão de desktop.

- **`VISUAL_DENSITY`** — quanta informação/espaço em branco por seção.
  - **1–3 (Art Gallery):** muito espaço em branco, gaps de seção enormes.
  - **4–7 (Daily App):** espaçamento padrão de app web.
  - **8–10 (Cockpit):** paddings apertados, sem caixas de card — linhas de 1px separam
    dado, números em `font-mono`.
  - Mapeamento completo pra padding vertical concreto: ver seção abaixo.

### Baseline por register

| Register | `VISUAL_DENSITY` | `DESIGN_VARIANCE` |
|---|---|---|
| `brand` | 3 | 7 |
| `product` | 6 | 3 |

O baseline reflete a tabela de cima: `brand` respira mais e arrisca mais layout; `product`
é mais denso e mais previsível. Overrides acontecem conversacionalmente a partir do
vocabulário do pedido — nunca editando este arquivo.

### Tabela vibe → valores

Ponto de partida pra inferir os dials a partir do vocabulário do pedido, antes de qualquer
ajuste fino. Quando o pedido não bate com nenhuma linha, usa o baseline do register mais
próximo e ajusta pelo texto do brief.

| Vibe / tipo de pedido | Register | `VISUAL_DENSITY` | `DESIGN_VARIANCE` |
|---|---|---|---|
| Landing minimalista, "clean", tipo Linear/Stripe | `brand` | 2 | 4 |
| Portfólio criativo, agência, editorial | `brand` | 2 | 8 |
| Página de campanha / lançamento, maximalista, "acid" | `brand` | 3 | 9 |
| Marketing site institucional, "sóbrio mas confiável" | `brand` | 4 | 3 |
| App SaaS padrão, painel de conta | `product` | 5 | 3 |
| Dashboard analítico / financeiro, muitos dados | `product` | 7 | 2 |
| Ferramenta interna, admin, "cockpit" | `product` | 9 | 1 |
| Onboarding / welcome screen dentro de um produto | `product` | 3 | 5 |
| E-commerce (PLP/PDP) | `product` | 5 | 3 |

## Densidade → padding vertical de seção

A densidade não fica solta como conceito — mapeia direto pro padding vertical (`py-*`) de
cada seção. Isto é o que `audit`/`polish` medem contra quando o finding é "densidade
inconsistente com o register declarado".

| `VISUAL_DENSITY` | Padding vertical de seção | Leitura |
|---|---|---|
| 1–3 | `py-32` a `py-48` | espaçoso, caro, "galeria" |
| 4–7 | `py-16` a `py-24` | padrão de app web, neutro |
| 8–10 | `py-4` a `py-8`, sem caixa de card — separação por `border-t`/`divide-y` | apertado, "cockpit", dado denso |

Espaçamento entre irmãos dentro de uma seção (não entre seções) segue a escala canônica de
`DESIGN.md` (`4/8/12/16/24/32/48/64/96`), agrupamento em `8-12px` — a tabela acima é
especificamente o padding vertical que separa **seções**, não o gap interno de cada uma.

## Como isto se conecta ao resto da skill

- `design-system/new.md` chama este arquivo no passo 2, antes de decidir entre aplicar direto
  ou passar pela galeria de 3 direções; `design-system/document.md` chama no Passo 2 dele,
  ao entrevistar.
- **O register é gravado no `PRODUCT.md`; os dials, no `DESIGN.md`.** A separação não é
  arbitrária: register é o que o produto **é** (o design serve ou é o produto), e sobrevive
  a um redesign que joga a lei visual inteira fora. Dial é calibragem da lei vigente, e cai
  junto com ela.
- Nenhum dos dois é recalculado a cada `audit`: `audit` e `polish` leem o que já está
  gravado. Este arquivo só entra em jogo de novo quando o `design-system` roda outra vez.

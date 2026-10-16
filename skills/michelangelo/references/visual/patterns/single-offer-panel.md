# Padrão — painel de oferta única

Uma seção de compra de produto único tem três massas de conteúdo que brigam: **o que você
leva** (a lista de entregáveis), **quanto custa** (preço, desconto, parcela, cupom) e
**por que é seguro comprar** (selos). O arranjo default — um card de preço de um lado, uma
lista solta do outro, três selos flutuando embaixo — produz **três objetos que não
pertencem uns aos outros**, e refinar espaçamento não conserta isso: o problema é que nada
diz quem contém quem.

O painel de oferta única resolve fechando as três massas dentro de **um** objeto, com
papéis declarados: corpo (o que leva), coluna de compra (quanto custa) e rodapé (por que é
seguro). E dentro dele, **o cupom é uma peça física** — não um retângulo tracejado.

Implementação canônica: `ibeia-pages`, `src/components/sections/PurchaseSection.astro`
(commit `5da316c`). Este arquivo nasceu de uma sessão de redesign com nove rodadas de
rejeição — as lições da §Contra-achados são o que sobrou delas.

## Quando aplicar

- **Uma oferta só** (não uma tabela de planos comparados — ali o padrão é outro).
- **6+ entregáveis** a listar, ou entregáveis que precisam de subtítulo explicativo.
- Existe **desconto, cupom ou parcelamento** — mais de um número disputando a atenção.
- Decisão cara para o comprador, em que selos de confiança têm papel real.

## Quando NÃO aplicar

- **Planos lado a lado.** Comparação quer colunas equivalentes; um painel único força
  hierarquia entre coisas que precisam parecer paralelas.
- **Oferta sem lista** (um botão e um preço). O painel cobra estrutura que não há o que
  preencher, e o resultado é uma moldura em volta do vazio.
- **Preço sob consulta / lead gen.** Sem número, a coluna de compra não tem conteúdo, e o
  padrão degenera num formulário com moldura.

## Anatomia

```
┌───────────────────────────────────────────────────────────────┐
│  ✦ Nome do plano                                              │  ← cabeçalho do painel
├──────────────────────────────────┬────────────────────────────┤
│  AS 3 FORMAÇÕES                  │   de R$ 5.079 por R$ 1.764 │  ← contexto de preço
│  ✓ Item — detalhe no mesmo fluxo │                            │
│  ✓ Item — detalhe                │  ╭────────┬──────────────╮ │
│  ✓ Item — detalhe                │  │ CUPOM  ╎ Pague somente│ │  ← O BILHETE
│                                  │  ) CÓDIGO ╎  12x R$ 147  ( │     serrilha nas laterais
│  FERRAMENTAS                     │  ╰────────┴──────────────╯ │     picote entre talões
│  ✓ Item — detalhe                │                            │
│  ✓ Item — detalhe                │  [    CTA principal    ]   │
│                                  │  Assinatura anual          │
├──────────────────────────────────┴────────────────────────────┤
│  🔒 Pagamento seguro   ⚡ Acesso imediato   🛡 Garantia 7 dias │  ← rodapé, faixa própria
└───────────────────────────────────────────────────────────────┘
```

Sete decisões, e cada uma carrega peso:

1. **Um painel, não três objetos.** A borda externa é o que transforma card + lista +
   selos numa peça só. Sem ela, a lista "boia" no fundo da página e a seção lê como duas
   coisas coladas por acidente — o defeito que motiva este padrão.

2. **O cupom é uma peça física, e isso não é decoração.** É o único elemento da seção que
   o olho procura sozinho, e é o que faz a oferta parecer oferta. Um bloco tracejado
   genérico entrega a informação e não entrega o objeto. A serrilha (§Mecânica do
   bilhete) é o que separa "campo de cupom" de "cupom".

3. **A promoção é descrita UMA vez.** [Baymard](https://baymard.com/blog/product-page-price-discounts)
   mediu 19% dos sites com oferta repetindo a mesma promoção em pontos diferentes da
   página — e usuários leem as repetições como ofertas *distintas* que não conseguem
   somar. Se a descrição da seção já diz "economize 65%", a tag do painel não repete.

4. **Mostre o número maior** — a "regra dos 100" de Jonah Berger, também via Baymard. Em
   produto caro, "Economize R$ 3.315" é maior que "65%"; em produto barato, a porcentagem
   é que ganha. O percentual vira secundário, não some.

5. **Entregáveis agrupados, não enfileirados.** 9 itens numa lista corrida com ícone,
   filete e rótulo por linha somam ~40 elementos e leem como ruído. Em 3 grupos de 3, com
   rótulo por grupo e detalhe no mesmo fluxo do título (`Nome — detalhe`), caem para ~18.
   O agrupamento faz o trabalho que os ícones faziam mal.

6. **Selos de confiança no rodapé do painel, em faixa própria.** Três, no máximo — 1–3
   sinais convertem melhor que nenhum, 7+ convertem pior que 1–3 ("badge bloat"). Longe do
   preço: ver §Contra-achados, porque a pesquisa parece dizer o contrário e a leitura
   ingênua dela estraga a seção.

7. **Condição de cobrança é informação, não letra miúda.** "Assinatura anual", "renova em
   12 meses", "cancele quando quiser" ficam legíveis antes do clique. Custo-surpresa é a
   causa nº 1 de abandono; escondê-lo em 0,7rem abaixo do botão é o mesmo que omitir.

## Mecânica do bilhete

A serrilha é um **recorte real**, com `mask-image` — dois círculos transparentes
compostos por `mask-composite`. Não é borda arredondada nem pseudo-elemento pintado com a
cor do fundo (que quebra sobre glass, gradiente ou imagem).

```css
.cupom {
  --stub-w: 176px;   /* largura do canhoto */
  --notch: 14px;
  display: grid;
  grid-template-columns: var(--stub-w) 1fr;
  -webkit-mask-image:
    radial-gradient(circle var(--notch) at var(--stub-w) 0,    transparent 99%, #000 100%),
    radial-gradient(circle var(--notch) at var(--stub-w) 100%, transparent 99%, #000 100%);
  -webkit-mask-composite: source-in;
  mask-image: /* idem */;
  mask-composite: intersect;
}
```

Quatro armadilhas, todas já pagas:

- **O bloco não pode ter borda.** A mask corta a borda junto e deixa a boca do recorte
  aberta. A delimitação vem do fundo tingido, não de contorno.
- **`--stub-w` é usada duas vezes** — na largura da coluna e na posição do recorte. Mexer
  em uma sem a outra desencontra o picote da serrilha, e o erro é sutil o bastante para
  passar despercebido num print pequeno. Uma custom property, dois consumidores.
- **Em telas estreitas, desligue a mask.** Empilhado, o ponto do recorte passa a depender
  da altura do canhoto, que o conteúdo não garante. Serrilha desencontrada é pior que
  serrilha nenhuma: ali a borda tracejada volta a ser possível (não há mais mask cortando).
- **O gradiente do fundo precisa de faixa estreita.** Sobre superfície glass, um gradiente
  de 24% → 11% deixa a metade fraca invisível e o bilhete lê como dois blocos separados.
  ~23% → ~16% mantém a peça inteira legível como uma coisa só.

E uma armadilha do numeral: **gradiente clipado no texto** (`background-clip: text` +
`-webkit-text-fill-color: transparent`) apaga a base dos dígitos quando o fundo atrás
deles é colorido. Dentro do bilhete, o preço é cor sólida.

## Interação do cupom

Copiar tem que dar retorno, e o retorno é no próprio código: ele vira **COPIADO!** e muda
para a cor de sucesso, voltando sozinho em ~2s. O texto do código mora num `<span>`
próprio — sem ele não há como trocar o rótulo sem destruir o ícone irmão.

Ao trocar a estrutura do bloco, **preserve as classes que scripts consultam**. Neste
componente, `.purch-coupon-code` (cópia) e `.purch-coupon-amount` (toggle de aluno, que
reescreve o `textContent` do valor) são contrato, não estilo. Renomeá-las quebra
comportamento sem quebrar nenhum teste de tipo — grepe por elas antes de mexer.

## Prefixo de parcela é campo livre

`installments` costuma ser uma string livre da página (`'12x'`), e alguém acaba usando-a
como o **próprio símbolo** (`installments: 'R$'`, para preço à vista). Um `R$` fixo no
markup vira **"R$ R$ 97"** nessas páginas. Derive:

```js
const showCurrencySymbol = !/R\$/.test(priceBox.installments || '')
```

O caso não aparece na página que você está olhando — aparece nas outras quinze. Sempre
grepe os consumidores antes de imprimir moeda por conta própria.

## Contra-achados — a pesquisa aplicada ao pé da letra piora a seção

Estes três vieram de aplicar recomendações corretas de forma literal e ver o resultado ser
rejeitado. **São a parte mais cara deste arquivo.**

- **"Selos junto do formulário de pagamento" ≠ "selos empilhados sob o CTA."** A pesquisa
  de percepção de segurança ([Baymard](https://baymard.com/blog/perceived-security-of-payment-form),
  [CXL](https://cxl.com/research-study/trust-seals/)) mede o **encapsulamento visual** —
  a área de compra ter fundo/borda próprios — e coloca 1–2 ícones *dentro* dela. Numa
  seção de venda, o que está encapsulado é o painel inteiro; empilhar selos, termos e
  garantia abaixo do botão põe seis linhas de disclaimer em volta do preço e a oferta fica
  visivelmente menos atraente. O achado vale para o **checkout**, onde há campos de cartão;
  aqui, a faixa de rodapé cumpre o papel sem sufocar o preço.
- **Encapsular a coluna de compra com fundo + borda forte + sombra engrossa a seção.** A
  "cápsula" que a pesquisa sugere só compensa quando ela contém campos sensíveis. Contendo
  preço e botão, ela vira uma moldura dentro de uma moldura.
- **Preço grande é ambíguo, não consensual.** [Coulter & Coulter (2005)](https://www.researchgate.net/publication/247353219_Size_Does_Matter_The_Effects_of_Magnitude_Representation_Congruency_on_Price_Perceptions_and_Purchase_Likelihood)
  acharam que fonte grande faz o número ser percebido como *numericamente maior* — o que
  recomendaria preço de venda em corpo menor; [Huang (2025)](https://onlinelibrary.wiley.com/doi/10.1002/cb.2465)
  achou o oposto para persuasão. **Não decida isso por decreto**: mantenha o padrão de
  mercado (parcela grande) e trate a inversão como candidata a A/B.

Regra geral que os três compartilham: **pesquisa de checkout não transfere direto para
seção de venda.** O comprador ali já decidiu; aqui ele ainda está sendo convencido, e
disclaimer perto do preço custa desejo.

## Régua de poluição

"Está poluído" vira medível contando **elementos visuais distintos** dentro do painel —
cada ícone em caixa, cada filete, cada rótulo, cada tag. Referências reais desta sessão:
~42 elementos = rejeitado como poluído; ~18 = aprovado. Quando o feedback for "poluído",
conte antes de redesenhar: quase sempre há um grupo inteiro de repetição (9 ícones, 9
rótulos "incluso", 8 filetes) que sai sem perder informação nenhuma.

## O que o detector vai dizer

Defeitos que este tipo de seção quase sempre carrega, e que valem conserto:

- **`tiny-text` nos selos e na linha de assinatura.** `0.72rem` = 11,52px e `0.7rem` =
  11,2px reprovam no piso de 12px. É o defeito nº 1 desse padrão: texto de confiança nasce
  pequeno "porque é secundário", e vira ilegível.
- **`sibling-gap-too-tight` no card de preço.** Um `gap: 6px` no container do card fica
  abaixo do mínimo de 8px e reprova *todos* os pares de irmãos ali dentro de uma vez — um
  valor, muitas violações.
- **Pares título/detalhe com `margin-top: 2px`/`4px`.** Reprovam. 8px é o piso, e visualmente
  ainda lê como par.

Um falso-positivo estrutural conhecido: medindo a **página inteira**, a `<section>` do
painel acusa `sibling-gap-too-tight` contra a seção vizinha (gap 0, o respiro vem do
padding interno de cada seção). Isso é do ritmo da página, não do padrão — meça a seção
isolada para avaliar o padrão, e não tente consertar o encosto entre seções dentro desta
tarefa.

## Ao propor este padrão numa auditoria

O gatilho é medível: **uma oferta única + 6 ou mais entregáveis + 2 ou mais números de
preço concorrendo** (de/por, percentual, parcela, cupom). Registre como finding de Camada 2
com a contagem de elementos como evidência.

Cuidado com o regime (`SKILL.md` §Abertura): adotar o painel **muda a estrutura da seção**.
Num refino isso só entra com o usuário avisado. Já **trocar só o bloco do cupom** por um
bilhete é uma mudança local legítima em refino — e, das nove rodadas que produziram este
arquivo, foi a única que o usuário aceitou de primeira.

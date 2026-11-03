# Marca e assets — a matéria-prima que faltava

A skill sabia gerar direções a partir de eixos abstratos (tipografia, cor, densidade) e de
tabelas genéricas indexadas por **domínio de produto** ("SaaS (General)"). O resultado é
competente e anônimo: um design que poderia ser de qualquer um.

O que separa um redesign bom de um excelente quase sempre é material concreto que **não
estava no CSS**: a paleta oficial de uma marca, o arquivo do logo, uma família tipográfica
de verdade. Isto é um input de primeira classe, e é levantado **antes** de propor direções.

## Passo 1 — De quem é a identidade?

Três casos, e confundi-los é caro:

1. **O artefato É a marca** (site da empresa, produto próprio, material institucional) → a
   identidade a respeitar é a do próprio dono. Procure o que já existe antes de inventar.
2. **O artefato é SOBRE outra marca** (um guia sobre uma ferramenta, um curso sobre um
   produto de terceiro, um comparativo) → a identidade **do assunto** é matéria-prima
   legítima e normalmente é o que faz a peça parecer feita sob medida. A marca da casa
   assina; a marca do assunto ilustra.
3. **Não há marca** (protótipo, ferramenta interna, exercício) → aí sim as tabelas
   genéricas de `tokens/*.json` são o ponto de partida correto.

O caso 2 é o mais subestimado. Um livro sobre uma ferramenta com a paleta e o logo daquela
ferramenta lê como material oficial; o mesmo livro em cores neutras lê como apostila.

## Passo 2 — Levantar o material

Antes de desenhar, responda por escrito (uma linha cada, "não há" é resposta válida):

- **Paleta oficial** — hex exatos. Fonte: o site da marca, a interface do produto, um
  press kit, um `brand.md`/`DESIGN.md` no repo.
- **Logo** — existe SVG? Onde? Ele é quadrado (cabe num bloco) ou horizontal (lockup)?
- **Tipografia** — a marca usa uma família específica? Ela é licenciável/livre, ou preciso
  de um substituto próximo?
- **Restrições do dono** — há regra de marca a respeitar? (Ex.: uma cor aposentada da
  paleta, um símbolo que nunca pode ser recolorido, um lockup mínimo.)
- **Conflito entre as duas marcas** — quando o caso 2 se aplica, quem domina a superfície e
  quem assina? Decida explicitamente em vez de misturar.

Quando houver regra de marca do próprio usuário e ela colidir com a identidade do assunto,
**isso é decisão dele, não sua** — traga em uma linha, com a recomendação, em vez de
escolher no silêncio.

## Passo 3 — Aquisição: baixar e embutir

**Isto é permitido e frequentemente necessário.** A proibição de `inspiration.md` §Guardrail
vale para **referências** — não clonar o CSS/imagem de um site que você usou como
inspiração. Ela **não** se aplica aos assets da identidade que o artefato legitimamente
usa: a fonte que você escolheu, o logo da marca sobre a qual o material fala.

### Fontes

Um alvo impresso **precisa** da fonte embutida (`medium.md`). Um alvo web se beneficia de
self-hosting (sem dependência de CDN, sem FOUT).

```bash
# CSS com as URLs (UA moderno = woff2, bem menor que ttf)
curl -s -A "Mozilla/5.0 ... Chrome/120.0.0.0 Safari/537.36" \
  "https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;700&display=swap"
# depois baixe cada .woff2 do bloco de subset que você precisa (latin cobre pt-BR)
```

Regras que evitam retrabalho:

- **Subset certo.** `latin` cobre acentuação de português (`U+00C0-00FF`). Não embuta
  cyrillic/greek sem necessidade.
- **Só os pesos que o CSS usa.** Cada peso embutido é ~20-120 KB em base64 dentro do
  arquivo final. Embutir a família inteira "por garantia" incha o entregável.
- **Fonte variável serve vários pesos com um arquivo só** — mas cada peso ainda precisa do
  seu `@font-face`. Se você renomear o mesmo arquivo por peso, saiba que está embutindo o
  mesmo binário N vezes: prefira um `@font-face` por peso apontando para o **mesmo**
  arquivo.
- **Nunca declare um peso que não existe** — negrito sintético quebra em impresso.

### Logos

- SVG, sempre que possível. Fontes: o press kit da marca; para marcas de tecnologia,
  bibliotecas de ícones oficiais servem bem e vêm normalizadas.
- **Verifique se o `fill` está cravado no arquivo.** Muitos SVGs de marca trazem a cor
  oficial fixa nos paths, e nesse caso ele ignora `color`/`currentColor` do CSS. Isso é
  desejável para o logo do assunto (a cor é parte da marca) e indesejável para um símbolo
  que você quer recolorir — nesse caso, reescreva o `fill` em runtime em vez de editar o
  arquivo original, que outros consumidores podem usar.
- **Proporção.** Um logo quadrado e um lockup horizontal não são intercambiáveis no mesmo
  slot de layout.
- **Asset ausente não pode falhar em silêncio.** Se o layout declara um logo que não está
  no disco, o resultado é uma capa sem logo que ninguém percebe até abrir o arquivo.
  Verifique a existência e **avise** quando faltar.

## Passo 4 — Cor de marca é quase sempre inutilizável como texto

Este é o erro mais previsível de todo redesign com marca real, e vale a pena antecipar.

Marcas escolhem cores para **impacto**, não para legibilidade sobre fundo claro. Uma cor de
accent com luminância média (corais, laranjas, verdes-médio, ciano, amarelo) reprova WCAG
**nos dois sentidos**: como texto sobre fundo claro, e com texto claro por cima.

**A solução não é escurecer no olho — é calcular e derivar um segundo token:**

- `--accent` — a cor oficial, exata. Uso **gráfico**: filete, faixa, borda, bloco, ícone.
  Nunca carrega texto.
- `--accent-forte` — derivada, mais escura. Uso **tipográfico**: verificada ≥4.5:1 sobre o
  fundo, e ≥4.5:1 com texto claro por cima quando vira fundo de bloco.

Calcule antes de desenhar:

```python
def lum(h):
    h = h.lstrip('#'); c = [int(h[i:i+2],16)/255 for i in (0,2,4)]
    c = [x/12.92 if x <= 0.03928 else ((x+0.055)/1.055)**2.4 for x in c]
    return 0.2126*c[0] + 0.7152*c[1] + 0.0722*c[2]

def ratio(a, b):
    la, lb = lum(a), lum(b); hi, lo = max(la,lb), min(la,lb)
    return (hi + 0.05) / (lo + 0.05)
```

Documente os dois tokens com o **papel declarado** no `DESIGN.md`. Sem isso, o próximo a
mexer usa a cor oficial num rótulo e reintroduz o defeito.

## Passo 5 — Marca no `DESIGN.md`

A marca entra nas **duas camadas** do `DESIGN.md` (formato em
`design-system/document.md` §Passo 4), e cada uma leva a metade que lhe cabe.

**No cabeçalho — os valores.** A paleta oficial e a tipografia da marca são tokens como
qualquer outro; não existe "cor da marca" solta ao lado dos tokens do projeto:

```yaml
colors:
  brand-ember: "#b8422e"      # oficial
  brand-ember-ink: "#8f2f1f"  # derivado, para texto sobre claro
typography:
  display:
    fontFamily: "Cinzel Decorative, Georgia, serif"
```

**Na prosa — o que o cabeçalho não sabe dizer:** de quem é a identidade, o papel declarado
de cada token, e o que não se pode fazer com ela.

```
## Marca
- Identidade: <de quem é> (própria | do assunto | nenhuma)
- Papel de cada token oficial: <qual é gráfico, qual é tipográfico, com o par de contraste
  verificado>
- Logo: <arquivo, formato, proporção, cor cravada?>
- Tipografia: <pesos disponíveis como arquivo, onde estão>
- Restrições: <regras do dono da marca>
```

Isso fecha a catraca para identidade do mesmo jeito que os tokens fecham para espaçamento:
a próxima sessão não redescobre a paleta nem rebaixa a marca a um hex solto. E é o
`PRODUCT.md` que guarda a outra metade — as **anti-referências**, que sobrevivem a um
redesign porque descrevem o que o produto é, não como ele está pintado.

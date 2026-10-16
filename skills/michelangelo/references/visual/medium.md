# Meio de saída — web, impresso, slide

A skill nasceu para UI web e por muito tempo assumiu isso em todos os níveis: breakpoints,
hover, scrollbar, alvo de toque. Num PDF, metade desses checks é ruído e as regras que
realmente importam não existiam em lugar nenhum.

O meio é decidido na Abertura (`SKILL.md`) e vale para a sessão inteira. Ele determina
**três coisas**: quais regras de `generate.md` se aplicam, quais checks do detector rodam,
e o que é obrigatório antes de entregar.

## Perfis

| | **web** | **print** (PDF, ebook, livro) | **slide** |
|---|---|---|---|
| Unidade | viewport / breakpoint | página física (A4, 6×9") | frame de proporção fixa |
| Reflui? | sim | não — paginação é definitiva | não |
| Fontes | webfont ou stack | **obrigatoriamente embutidas** | embutidas ou do sistema do apresentador |
| Interação | hover, focus, transição | nenhuma | nenhuma (ou transições de slide) |
| Distância de leitura | ~50 cm | ~40 cm | metros — tipo grande é regra |
| Falha típica | quebra em mobile | quebra de página no lugar errado | texto pequeno demais |

## `--medium` no detector

```bash
node $SKILL_DIR/scripts/detector/run.mjs <alvo> --medium print
```

O flag **desliga os checks que não têm domínio de aplicação** no meio. Não é tolerância a
defeito: é remover ruído que esconde defeito real. Um check que não pode ser satisfeito
num meio não mede qualidade, só polui o relatório.

| Check | web | print | slide | Por quê |
|---|:-:|:-:|:-:|---|
| `low-contrast` (P0) | ✅ | ✅ | ✅ | Vale em todo meio; em impresso, mais ainda. |
| `horizontal-overflow` (P0) | ✅ | ✅ | ✅ | Conteúdo fora da página é pior que fora da tela. |
| `sibling-gap-too-tight` (P1) | ✅ | ✅ | ✅ | Ritmo é universal. |
| `tiny-text` (P1) | ✅ | ✅ | ✅ | Piso de legibilidade sobe no slide. |
| `native-scrollbar` (P1) | ✅ | ❌ | ❌ | Não existe scroll em papel. |
| `touch-target-small` (P2) | ✅ | ❌ | ❌ | Não se toca em papel. Em web, cuidado: o check mede todo `<a>`, então texto com links inline gera ruído. |
| `interactive-no-transition` (P3) | ✅ | ❌ | ❌ | Não há hover em papel. |
| `line-length` (P2) | ✅ | ✅ | ✅ | Medida de linha é tipografia, não meio. |
| `weak-hierarchy`, `cramped-padding`, `tight-leading`, `monotonous-spacing`, `radius-off-system`, `wide-tracking`, `zindex-magic` | ✅ | ✅ | ✅ | Craft geral. |

**Ressalva honesta sobre `cramped-padding` em print:** ele espera padding proporcional à
fonte em todo elemento com texto. Num documento, texto corrido usa margem e entrelinha, não
padding — então ele gera P2 em massa em `<p>`/`<li>`/`<td>`. P2 não bloqueia, mas não trate
esse volume como sinal de qualidade; olhe os P0/P1 e a Camada 2.

## O que muda no craft

### print — o que passa a valer

- **Fonte embutida, sempre.** Um PDF que referencia fonte por nome renderiza com o que a
  máquina do leitor tiver. Embuta em base64 (`brand.md` §Aquisição).
- **Só pesos que existem como arquivo.** Peso ausente vira negrito sintético: embute mal e
  alguns motores substituem a palavra inteira por outra família. Se a família é variável, o
  mesmo arquivo serve vários pesos — mas o `@font-face` precisa declarar cada um.
- **Sangria (full-bleed) é decisão de layout, não detalhe.** Fundo que morre antes da borda
  vira moldura branca e denuncia amadorismo. Em Chromium isso exige `margin: 0` no
  `page.pdf` — e `@page` nomeado **não funciona**, então não há "margem só no miolo": o
  respiro do corpo tem que vir do conteúdo. Ver `playwright.md` §PDF full-bleed
  para a receita completa (inclui o `<thead>` repetido, único jeito de ter margem superior
  em toda página).
- **Quebra de página é conteúdo.** Título órfão no pé da página, tabela partida ao meio,
  figura separada da legenda são defeitos tão reais quanto contraste. Use
  `page-break-inside: avoid` em blocos indivisíveis e `page-break-after: avoid` em headings.
- **Gradiente com `transparent` quebra.** Funde para uma cor **opaca** igual ao fundo real;
  alguns motores não compõem alpha em shading pattern e pintam um bloco sólido.
- **Verificação cruzada obrigatória** — `rebuild.md` §Verificação cruzada.

### print — o que deixa de valer

Hover, focus-visible, `prefers-reduced-motion`, transições, `min-h-[100dvh]`, breakpoints,
scrollbar estilizada. Tudo em `generate.md` §Hover/transições é inaplicável; a §Grid vale
só na parte de composição.

**Não pergunte escopo de breakpoints em alvo impresso.** Papel não reflui. A pergunta
correta é o formato da página (A4? 6×9"? sangria?), e ela normalmente já está respondida
pelo motor que gera o arquivo.

### slide — o que passa a valer

- **Piso de tipo muito mais alto.** Corpo raramente abaixo de 24 px no canvas de 1920×1080;
  o que é "legenda" na web é ilegível projetado.
- **Um assunto por frame.** Densidade de dashboard num slide é o defeito mais comum.
- **Contraste com margem folgada** — projetor lava a imagem; mire acima do piso WCAG, não
  nele.

## Amostragem — alvo com muitas páginas/telas

`audit.md` exige crítica perceptual em cada tela de um fluxo. Aplicado literalmente a um
livro de 80 páginas, isso é 80 críticas — e o resultado prático é desobediência silenciosa.

**Em documento longo, a unidade de amostragem é o TIPO de página, não a página.** Um
exemplar de cada: capa, folha de rosto, abertura de capítulo, corpo de texto, página com
tabela, página com figura, página com bloco de código, e o último tipo que existir
(sumário, referências). Tipicamente 6-8 prints cobrem um livro inteiro, porque tudo além
disso é repetição do mesmo tipo.

O que **não** pode ser amostrado: se um tipo aparece com variação relevante (uma tabela
larga e uma estreita; um capítulo com figura e outro sem), são dois tipos, não um.

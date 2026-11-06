# Galeria de motion

Abra [index.html](index.html) no navegador. Busque pelo nome, alias, coleção ou
ID do efeito. **Ver prévia na Skillry** abre a página do efeito no catálogo
oficial. **Ver prompt** mostra um pedido que você pode usar numa edição.
A galeria funciona por arquivo local e abre em **Seleção principal**, com
50 efeitos próprios em seis categorias. Use o filtro para consultar os 34
vídeos do **Acervo complementar** e as 271 entradas em **Referências da Skillry**.
A busca respeita o filtro ativo. Os vídeos próprios são lidos de `previews/`. A categoria **Edição comparada**
reúne as sete cenas do [comparativo de edições](comparativo-de-edicoes.md).
Abra pelo atalho no topo para ver os previews e os links de reutilização.
O Acervo complementar inclui moldura de vidro leitoso, clarão de câmera,
tablet em perspectiva, painel com três revelações, três cortes em sequência,
escritório com troca de equipe, marcas em volume, clique de logo 3D e
[Do Vídeo aos Formatos](scenes/do-video-aos-formatos/LEIA-ME.md).
[Fotograma em Sequência](scenes/fotograma-em-sequencia/LEIA-ME.md) abre o take em sete quadros e pode revelar a onda do áudio.
**Legenda de Palavra Ativa** e **Cena em Vidros** usam o take de boas-vindas
de Renato que já faz parte dos previews locais da galeria.

O [catálogo JSON](catalog.json) cobre 122 efeitos de CreatorMotion 1.0.1,
208 cenas de LaunchMotion 1.0.4 e o fluxo Paper Cutout Story Video 1.0.0.
Quando uma composição própria deriva de uma referência, ela ocupa a mesma
entrada e preserva o nome e os IDs anteriores como aliases. O campo `source`
identifica a referência. Identificação do Apresentador e as cenas de Edição comparada têm entradas próprias.
Os pacotes e seus assets são distribuídos pela Skillry. [Termos de uso](https://skillry.dev/terms)

## Usar um efeito em vídeo

Busque o efeito por `title`, `aliases` ou `id`. Para uma composição própria,
use as fontes e as entradas em `demo`. Para uma referência da Skillry,
siga o `SKILL.md` do pacote `source.package` instalado e use o ID do efeito.
A página oficial em `source.url` reúne a prévia e a instalação.

Para **Gráfico em Contracampo**, informe uma foto ou um take de pelo menos
6,8 s em `presenter` para ver o painel de vidro sobre a câmera. Para exportar
somente o gráfico e o painel translúcido, omita `presenter` e use
`--out grafico.mov`. A desfocagem da câmera é calculada quando o take faz
parte da composição. Caminhos relativos são resolvidos a partir da pasta do
JSON. Use `values` com dois valores não negativos para
comparar duas barras. O exemplo de tokens usa números ilustrativos. A
composição também aceita duas séries de 2 a 6 números de 0 a 100 em
`series`, com o mesmo número de pontos e os rótulos em `axisLabels`.
Use `title`, `labelA`, `labelB` e `accent` para adaptar o gráfico. `note` é
opcional na visualização com linhas.

O catálogo lista as entradas de cada composição em `demo.inputs`. Alguns
efeitos usam estruturas de dados específicas.

| Efeito | Entradas editáveis |
| --- | --- |
| Conversa em Camadas | `topic`, `question`, `followup`, `result` |
| Radar de Sinais | `question`, `result`, `posts` com três ou quatro objetos (`author`, `text`, `tag`), `total`, `themes` com três objetos (`label`, `percent`) e `nextStep` |
| Parede em Perspectiva | `title`, `filter`, `feature`, `detail`, `selected` de 0 a 5 e `sheet` |
| Resposta Revelada | `question`, `answer`, `detail` e `suggestions` com dois rótulos curtos |
| Ciclo em Duas Voltas | `topic`, `roundone`, `roundtwo` e `steps`, com quatro nomes curtos |
| Colagem em Torno da Câmera | `presenter`, com uma foto ou take de pelo menos 4,45 s, e `sheet` |
| Roteiro em Pastas | `title`, `summary`, `folders` com três nomes e `sheet` com nove fotos numa grade de 3 × 3 em 16:9 |
| Roteiro em Papel | `titles` e `details`, com uma posição por cena, da primeira à oitava |
| Legenda com Ênfase | `presenter`, `lines` com frases pontuadas, `accentWords` com candidatas à ênfase e `wordTimings` com o segundo de entrada de cada palavra. A palavra selecionada aparece sozinha, no máximo uma vez a cada duas frases |
| Título Atrás do Apresentador | `presenter`, `matte` e `title`. Use um WebM com transparência e mantenha o enquadramento e a duração do take em `matte` |
| Transição em Mosaico | `presenter`, `statement` e `markText` |
| Identificação do Apresentador | `name`, `role` e `presenter` opcional. Para sobrepor na edição, omita `presenter` e exporte com `--out identificacao.mov` |
| Apresentador e Citação | `portrait` com foto ou take em tela cheia, `quote`, `emphasis` e `attribution` |

Em Parede em Perspectiva e Colagem em Torno da Câmera, `sheet` é uma
imagem 3:2 com seis fotos em três colunas e duas linhas, sem margens.
Conte os índices por linha, da esquerda para a direita.
Os caminhos de imagem e vídeo são relativos ao arquivo de entradas.

As composições próprias usam Outfit em títulos, corpo e interface. A fonte
local e sua licença OFL acompanham as composições. [Outfit](https://github.com/google/fonts/tree/fbe81817505e8aeadc53cc7a38a2b76fb57c333e/ofl/outfit)

A **Parede em Perspectiva** e o **Roteiro em Pastas** usam
[fotografias licenciadas de Portugal](scenes/parede-em-perspectiva/art/CREDITOS.md).
A **Colagem em Torno da Câmera** usa quatro
[fotos licenciadas de Portugal](scenes/colagem-em-torno-da-camera/art/CREDITOS.md)
na demonstração e aceita um atlas personalizado em `sheet`.

```powershell
node scripts/render-motion.mjs "Gráfico em Contracampo" --inputs dados.json --out cena.mp4
node scripts/render-motion.mjs "Resposta Revelada" --out resposta.mp4
```

O comando gera 1920 × 1080 a 30 fps com HyperFrames 0.8.33. Sem `--out`,
atualiza o vídeo do cartão. Os vídeos, fotos e entradas da demonstração
ficam em `previews/` no checkout local.

Ao editar o catálogo, atualize o HTML com `node scripts/build-motion-gallery.mjs`
a partir da raiz. Valide com `node scripts/build-motion-gallery.mjs --check` e
`node --test tests/motion-gallery.test.mjs`.

## Demonstrações e oferta

As composições abaixo usam as mecânicas de apresentação e oferta observadas na
Anti-Black Friday da Adapta, com dados e imagens de exemplo próprios. As amostras
de conteúdo e os preços são ilustrativos. Troque o conteúdo pelo da sua edição.

| Motion | Entradas e uso |
| --- | --- |
| [Prompt e Resultado](index.html#prompt-e-resultado) | Informe `prompt`, `screen` com a captura real, `outputTitle` e até cinco `steps`. `revealAt` marca em segundos quando o screencast começa. A cena dura 8,6 s e começa o vídeo da captura no seu primeiro quadro. |
| [Oferta em Camadas](index.html#oferta-em-camadas) | Informe `title`, `subtitle`, `cover` opcional e até seis `items` com `name`, `detail`, `value` numérico e `icon` opcional. `referencePrice` usa a soma dos itens por padrão. Informe `finalPrice`, `finalLabel` e `currency` como BRL. |
| [CTA Expansível](index.html#cta-expansivel) | Edite `label`, `expandAt`, `hold` e `position` com `x` e `y` em porcentagem. A cena dura 8 s. Para usar sobre seu take, exporte em MOV com `transparent: true` e omita `presenter`. [Amostra](scenes/cta-expansivel/demo.json) |
| [Baralho de Bônus](index.html#baralho-de-bonus) | Informe até cinco `cards` com `name` e `detail`. Escolha a carta pelo índice `activeCard`, a partir de zero, e alinhe `unlockAt` à fala. |
| [Destaque de Região](index.html#destaque-de-regiao) | Passe `screen` e `cues` com `at` em segundos, `x`, `y`, `width`, `height` em porcentagem da captura e `label`. A opção `dimOutside` vai de 0 a 1. O destaque estático usa `documentImage` e `region`. [Amostra](scenes/destaque-de-regiao/demo.json) |
| [Matriz de Comparação](index.html#matriz-de-comparacao) | A variante de ferramentas recebe até cinco `tools` com `name`, `category`, `detail`, `price` e `replacement` opcional. Passe capturas em `screens`, na ordem das linhas, com `null` para pular um slot. A matriz em colunas aceita `options` e `rows`. [Amostra](scenes/matriz-de-comparacao/demo.json) |
| [Apresentador e Lista](index.html#apresentador-e-lista) | Use `presenter`, `heading` e de um a seis `items` com `title`, `detail` e `icon` opcional. Para retratos, passe `portraits` na mesma ordem e use `null` nos slots sem foto. A lista de cinco textos continua disponível. [Amostra](scenes/apresentador-e-lista/demo.json) |

Os exemplos de comparação e demonstração se apoiam nas referências
[One Query Multiple Screens](https://skillry.dev/skills/bs-creatormotion-comparison-query-screens)
e [Row Focus Cards](https://skillry.dev/skills/bs-creatormotion-comparison-row-focus-cards).

## Hospedagem no GitHub

O HTML e os recursos locais usam caminhos relativos. Para publicar com GitHub
Pages, inclua um `.nojekyll` na raiz e, em **Settings → Pages**, selecione
**Deploy from a branch**, a branch **main** e a pasta **/(root)**. Essa
configuração publica a raiz do repositório. Antes de publicar o acervo,
separe a seleção gratuita e confira o histórico do branch público.
Mídia privada e peças pagas ficam em uma fonte separada. Os MP4s de
`previews/` são locais. Uma publicação dos vídeos exige incluir as versões
autorizadas no artefato publicado.
[Configuração do GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

O endereço esperado é [squados.github.io/squados-plugins/motion-gallery/](https://squados.github.io/squados-plugins/motion-gallery/).
O [JSON bruto na main](https://raw.githubusercontent.com/squados/squados-plugins/main/motion-gallery/catalog.json)
fica disponível quando o arquivo chega à branch remota.

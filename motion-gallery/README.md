# Galeria de motion

Abra [index.html](index.html) no navegador. Busque pelo nome, alias, coleção ou
ID do efeito. **Ver prévia na Skillry** abre a página do efeito no catálogo
oficial. **Ver prompt** mostra um pedido que você pode usar numa edição.
A galeria funciona por arquivo local e abre em **Seleção principal**, com
50 efeitos próprios em seis categorias. Use o filtro para consultar os 23
vídeos do **Acervo complementar** e as 271 entradas em **Referências da Skillry**.
A busca respeita o filtro ativo. Os vídeos próprios são lidos de `previews/`. A categoria **Edição comparada**
reúne as 12 cenas do [comparativo de edições](comparativo-de-edicoes.md). Os
cartões mostram o **Vídeo original** à esquerda e a **Recriação** à direita, com
controles independentes e um link para a skill. Abra pela opção **Edição comparada**
no topo. O primeiro cartão mostra o original completo. Nos demais, a legenda
do player indica a faixa e o intervalo no vídeo original. Esses trechos ficam
em `previews/referencias-edicao/` no checkout local.

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

O comando gera 1920 × 1080 a 30 fps com HyperFrames 0.8.33. **Duelo em Dois
Takes** gera 1080 × 1920. Sem `--out`,
atualiza o vídeo do cartão. Os vídeos, fotos e entradas da demonstração
ficam em `previews/` no checkout local.

Ao editar o catálogo, atualize o HTML com `node scripts/build-motion-gallery.mjs`
a partir da raiz. Valide com `node scripts/build-motion-gallery.mjs --check` e
`node --test tests/motion-gallery.test.mjs`.

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

# Galeria de motion

Abra [index.html](index.html) no navegador. Busque pelo nome, alias, coleção ou
ID do efeito. **Ver prévia na Skillry** abre a página do efeito no catálogo
oficial. **Ver prompt** mostra um pedido que você pode usar numa edição.
A busca funciona por arquivo local. A galeria abre em **Motions próprios**.
O player desse cartão usa o vídeo local em `previews/`. As entradas de
referência abrem suas prévias no site da Skillry.

O [catálogo JSON](catalog.json) contém 122 efeitos de CreatorMotion 1.0.1,
208 cenas de LaunchMotion 1.0.4 e o fluxo Paper Cutout Story Video 1.0.0.
Os nomes, IDs, categorias e links identificam o material original da Skillry.
Os pacotes e seus assets são distribuídos pela Skillry. [Termos de uso](https://skillry.dev/terms)

## Usar um efeito em vídeo

Busque o efeito por `title`, `aliases` ou `id`. Para uma composição própria,
use as fontes e as entradas em `demo`. Para uma referência da Skillry,
siga o `SKILL.md` do pacote `source.package` instalado e use o ID do efeito.
A página oficial em `source.url` reúne a prévia e a instalação.

Para **Gráfico em Contracampo**, prepare um JSON com `presenter` apontando
para uma foto ou um take de 6,8 s ou mais. Caminhos relativos são resolvidos
a partir da pasta do JSON. Use `values` com dois valores não negativos para
comparar duas barras. O exemplo de tokens usa números ilustrativos. A
composição também aceita duas séries de 2 a 6 números de 0 a 100 em
`series`, com o mesmo número de pontos e os rótulos em `axisLabels`.
Use `title`, `labelA`, `labelB` e `accent` para adaptar o gráfico. `note` é
opcional na visualização com linhas.

O preview carrega Sora e Geist Sans dos arquivos que acompanham a composição.
As fontes vêm da revisão `fbe81817505e8aeadc53cc7a38a2b76fb57c333e` do Google Fonts.
As licenças OFL acompanham os arquivos. [Sora](https://github.com/google/fonts/tree/fbe81817505e8aeadc53cc7a38a2b76fb57c333e/ofl/sora)
· [Geist](https://github.com/google/fonts/tree/fbe81817505e8aeadc53cc7a38a2b76fb57c333e/ofl/geist)

```powershell
node scripts/render-motion.mjs "Gráfico em Contracampo" --inputs dados.json --out cena.mp4
```

O comando gera 1920 × 1080 a 30 fps com HyperFrames 0.8.33. Sem `--out`,
atualiza o vídeo do cartão. Os vídeos, fotos e entradas da demonstração
ficam em `previews/` no checkout local.

Ao editar o catálogo, atualize o HTML com `node scripts/build-motion-gallery.mjs`
a partir da raiz. Valide com `node scripts/build-motion-gallery.mjs --check` e
`node --test tests/motion-gallery.test.mjs`.

## Hospedagem no GitHub

O HTML e os recursos locais usam caminhos relativos. Para publicar com GitHub
Pages, inclua um `.nojekyll` na raiz e, em **Settings → Pages**, selecione
**Deploy from a branch**, a branch **main** e a pasta **/(root)**. Essa
configuração publica a raiz do repositório. [Configuração do GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

O endereço esperado é [squados.github.io/squados-plugins/motion-gallery/](https://squados.github.io/squados-plugins/motion-gallery/).
O [JSON bruto na main](https://raw.githubusercontent.com/squados/squados-plugins/main/motion-gallery/catalog.json)
fica disponível quando o arquivo chega à branch remota.

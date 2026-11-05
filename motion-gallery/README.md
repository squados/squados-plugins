# Galeria de motion

Abra [index.html](index.html) no navegador. Cada demo exibe o nome e o ID que
você pode citar numa edição. **Ver prompt** mostra a receita da animação.
Cada palco contém o efeito isolado. A página exibe sobre preto os efeitos
desenhados em transparência. As referências de motion-skills e do showcase
mantêm links para as fontes da iart.ai.

[catalog.json](catalog.json) é a fonte dos cartões e das receitas consultadas
pela Tarantino e pela ibeia-video-edit. Ao editar o catálogo, atualize o HTML
com `node scripts/build-motion-gallery.mjs` a partir da raiz do repositório.
Valide com `node scripts/build-motion-gallery.mjs --check` e
`node --test tests/motion-gallery.test.mjs`.

## Usar o efeito em um vídeo

Localize a entrada por `title`, `aliases` ou `id`. Carregue o script indicado
em `demo.file` e use `window.motionDemos[demo.key](contexto2d, progresso)`.
Use um canvas HTML com contexto 2D. O desenho ocupa um palco lógico de
480 × 270. Em resolução maior, escale o contexto antes de desenhar.
A progressão vai de 0 a 1 ao longo de `demo.seconds`. Limpe o quadro entre
amostras e use `save()` e `restore()` para isolar o estado do contexto.
Use o alpha na composição. Para exportar com o mesmo fundo da galeria,
preencha antes o canvas com branco ou preto conforme `demo.background`.
Posicione efeitos opacos na área destinada a eles. Para aplicar uma transição
a dois takes, o `prompt` descreve a direção e a coreografia a reproduzir.

## Hospedagem no GitHub

O HTML e os recursos usam caminhos relativos. Para publicar com GitHub Pages,
inclua um `.nojekyll` na raiz no commit de publicação para servir os arquivos
estáticos diretamente. Em **Settings → Pages**, selecione **Deploy from a branch**,
a branch **main** e a pasta **/(root)**. O endereço esperado sem domínio
personalizado é [squados.github.io/squados-plugins/motion-gallery/](https://squados.github.io/squados-plugins/motion-gallery/).
Essa configuração publica a raiz do repositório. [Configuração do GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

As skills leem o [JSON bruto na main](https://raw.githubusercontent.com/squados/squados-plugins/main/motion-gallery/catalog.json).
O endereço raw fica disponível quando o arquivo chega à branch remota.

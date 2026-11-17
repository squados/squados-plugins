# Galeria de motion

Abra [index.html](index.html) no navegador. A galeria abre na **Seleção principal**:
22 efeitos e componentes de edição genéricos, que servem a qualquer marca, com
câmera, transições, legendas, chamadas, cartões e uma cena 3D.
Em **Seleção**, escolha **Catálogo completo** para pesquisar todos os motions.
Escolha **Novidades** para ver as composições desta rodada.
Combine **Categoria**, **Uso**, **Tipo** e **Duração** para chegar ao efeito
do trecho. A busca inclui nome, descrição, apelidos e ID. Cada cartão tem
uma frase de uso, a duração, a prévia local e um prompt de exemplo.
A seção [Edição comparada](comparativo-de-edicoes.md) reúne sete cenas com
guias de reutilização.

## Usar um efeito em vídeo

Consulte `description` e `uses` no [catálogo JSON](catalog.json) para escolher
pelo objetivo da cena. Resolva o nome pelo `title`, `id`, `aliases` ou `previousIds`, abra
`demo.composition` e prepare um JSON com as entradas em `demo.inputs`.
Um efeito pode ter opções de movimento ou de mídia dentro da mesma composição.

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
atualiza o vídeo do cartão em `videos/`, versionado com o repositório em
960 px. Os takes, fotos e entradas privadas da demonstração ficam em
`previews/`, somente no checkout local.

Ao editar o catálogo, atualize o HTML com `node scripts/build-motion-gallery.mjs`
a partir da raiz. Valide com `node scripts/build-motion-gallery.mjs --check` e
`node --test tests/motion-gallery.test.mjs`.

## Novas composições e opções

| Motion | Entradas principais |
| --- | --- |
| [Câmera na Moldura](index.html#camera-vidro-leitoso) | Passe `presenter` e `screen`. Escolha `shape` entre `squircle`, `quadrada`, `redonda` e `oval`, `finish` entre `vidro`, `prata`, `ouro` e `cor` (com `accent`), `size` em px e `side: "left"` para o canto esquerdo. |
| [Zoom no Rosto](index.html#zoom-no-rosto) | Passe o take em `presenter`. Em `mode: "corte"`, o enquadramento alterna entre aberto e fechado em cada segundo de `cuts`; `suave` aproxima durante a cena e `pulso` fecha e volta na deixa. Ajuste `zoom` (1,02 a 1,35) e o ponto fixo em `focus` com `x` e `y` em porcentagem. |
| [Card de Vidro](index.html#card-de-vidro) | Informe `value`, `title`, `text` e `icon` (`grafico`, `venda`, `agenda`, `mensagem`, `estrela`, `pagamento`, `contrato`, `check`, `usuario`, `raio`, `relogio`, `alvo` ou um emoji). Use `theme: "claro"`, `side` e `accent`. |
| [Contador](index.html#contador) | Informe `value`, `from`, `decimals`, `prefix`, `suffix` e `label`. `at` e `duration` marcam a contagem; o quadro tem a largura do valor final. |
| [Confete](index.html#confete) | Alinhe `at` à fala, passe as cores da marca em `colors` e a quantidade por canhão em `amount`. Use `transparent: true` e MOV para sobrepor. |
| [Lista de Notificações](index.html#lista-de-notificacoes) | Passe até oito `items` com `icon`, `title`, `detail`, `time` e `color`. `start` e `interval` marcam a chegada de cada aviso. Composição própria, inspirada no [Animated List do Magic UI](https://magicui.design/docs/components/animated-list) (MIT). |
| [Título Cinético](index.html#titulo-cinetico) | `mode` aceita `echo`, `roll`, `glitch` e `stamp`. Informe `title`, `caption` e, no modo `roll`, até cinco termos em `words`. |
| [Transição por Máscara](index.html#transicao-por-mascara) | Passe dois planos em `first` e `second`. Escolha `mode` entre `ink`, `brush`, `pixel` e `iris`. Use `at` para marcar a passagem em segundos. |
| [Revelação de Marca](index.html#revelacao-de-marca) | Use `name`, `tagline` e `logo` para a revelação em pixels. Para desenhar o símbolo, use `mode: "trace"` e um `path` SVG no espaço 0 a 100. |
| [Pulso de Áudio](index.html#pulso-de-audio) | Use `mode: "ring"` ou `"bars"` e `amplitudes` com níveis de 0 a 1 amostrados em intervalos iguais ao longo de 6 s. |
| [Cena em Vidros](index.html#cena-em-vidros) | Passe o quadro inteiro em `presenter`, o elemento vertical em `middle` e o elemento dianteiro em `front`. Use `timing: "rapido"` para concentrar a abertura em três segundos. |
| [Tesla em Vista Explodida](index.html#tesla-em-vista-explodida) | Marque a desmontagem com `explodeAt` e use `transparent: true` para compor sobre vídeo. A estrutura interna é ilustrativa. |
| [Celular em Vista Explodida](index.html#celular-em-vista-explodida) | Passe até cinco mensagens em `messages`, com quadro, direção e texto. Use `transparent: true` e MOV para sobrepor ao take. [Créditos](scenes/celular-em-vista-explodida/SKILL.md) |
| [Oficina em Pixel Art](index.html#oficina-pixel-topdown) | Escolha `mode` entre `queue`, `knowledge`, `mural` e `farewell`. [Mural humano](videos/oficina-pixel-mural-humano.mp4) · [Mural de IA](videos/oficina-pixel-mural-ia.mp4) · [Saída](videos/oficina-pixel-saida.mp4) |
| [Do Feed à Galeria](index.html#feed-para-galeria) | Use `mobile: true` para o aparelho com toque. Passe quatro previews em `reelSheets` e três em `effectSheets`. O terceiro post segue até a biblioteca e origina os três cartões. |
| [Agenda em Contração](index.html#agenda-em-contracao) | Informe as quatro deixas em `beats`, as durações em `labels` e use `placement: "right"` em uma sobreposição. |
| [Controles de Vidro](index.html#controles-de-vidro) | Use `mode: "download"` para as plataformas e `exitAt` para recolher os cartões. Os modos `"value"`, `"details"`, `"cta"` e `"play"` cobrem os demais controles. Em `"play"`, sincronize `clickAt`, `dragAt` e `enterAt` com o som. [Prévia do botão](videos/controles-de-vidro-play.mp4) |
| [Legenda de Palavra Ativa](index.html#legenda-palavra-ativa) | Informe `cues` e use `layout: "roxo"` para destaque violeta e espaço natural entre palavras. |
| [Fábrica de Edição 3D](index.html#fabrica-de-edicao-3d) | Use `mode` igual a `queue`, `knowledge`, `mural` ou `epilogue`. Passe nove referências 16:9 em `atlas` para trocar as miniaturas. |
| [Arquivo Markdown em Edição](index.html#arquivo-markdown-em-edicao) | Informe `filename` e até seis textos Markdown em `lines`. Use `cues` para indicar a entrada de cada linha, `side` para posicionar o editor e `transparent: true` para compor sobre o take. |
| [Dispositivos em Cena](index.html#dispositivos-em-cena) | Use `phone`, `tablet` e `desktop` para as capturas de cada tamanho. Os três aceitam foto ou vídeo. |
| [Troca de Visual](index.html#troca-de-visual) | Passe imagens em `before` e `after`, ou aplique a uma imagem o `preset` `luz`, `cor`, `contraste` ou `nenhum`. |
| [Inspeção de Imagem](index.html#inspecao-de-imagem) | Passe `image` e até cinco `points` com `x`, `y` em porcentagem do quadro exibido e `label`. Escolha `lupa`, `varredura`, `marcacoes` ou `ambos` em `mode`. |
| [Painel em Operação](index.html#painel-em-operacao) | Passe até três `metrics` com `label`, `value` e `unit`, de 2 a 10 valores em `series`, rótulos em `labels` e até três `statuses` com `label`, `detail` e `state`. |
| [Decisão em Fluxo](index.html#decisao-em-fluxo) | Informe até quatro `items` com `title`, `source`, `detail` e `description`. Escolha o pedido por `selected`, a partir de zero. |
| [Dados em Unidades](index.html#dados-em-unidades) | Escolha `donut`, `units` ou `range` em `mode`. Informe até cinco `items` com `label` e `value`, ou `low` e `high` para intervalos. |
| [Funil em Etapas](index.html#funil-em-etapas) | Passe `stages` com `label` e `value` em ordem de execução e use `unit` para nomear o que está sendo contado. |
| [Mapa de Posicionamento](index.html#mapa-de-posicionamento) | Para quadrantes, use `points` com `label`, `x` e `y`, mais dois `axisLabels`. Para `mode: "radar"`, use `dimensions` com `label` e `value`. As escalas vão de 0 a 100. |
| [Partes em Conjunto](index.html#partes-em-conjunto) | Use `parts` com `label` e `detail` e escolha `assembly`, `nesting` ou `tiers` em `mode`. |
| [Prova Social em Mural](index.html#prova-social-em-mural) | Informe `cards` com `author`, `role` e `text`, e opcionalmente `images` na mesma ordem. Use `selected` para escolher o destaque, a partir de zero. |
| [Montagem em Órbita](index.html#montagem-em-orbita) | Passe até seis `images`, com rótulos em `captions`, e use `selected` para definir a imagem principal, a partir de zero. |
| [Barras Comparativas](index.html#barras-em-sequencia) | Use `categories` e `values` para colunas. Para comparar duas barras horizontais, use `mode: "ratio"`, `labels`, `values` e `ratioPrecision`. |
| [Logotipo em Volume](index.html#squados-em-volume) | Use `brand` como `squados`, `claude` ou `chatgpt`, ou passe seu arquivo em `logo`. |

## Demonstrações e oferta

As composições abaixo usam as mecânicas de apresentação e oferta observadas na
Anti-Black Friday da Adapta, com dados e imagens de exemplo próprios. As amostras
de conteúdo e os preços são ilustrativos. Troque o conteúdo pelo da sua edição.

| Motion | Entradas e uso |
| --- | --- |
| [Prompt e Resultado](index.html#prompt-e-resultado) | Informe `prompt`, `screen` com a captura real, `outputTitle` e até cinco `steps`. Para comparar resultados, passe também `screenTwo`, `screenThree` ou `screenFour`, com rótulos em `screenLabels`. `revealAt` marca em segundos quando as capturas começam. |
| [Oferta em Camadas](index.html#oferta-em-camadas) | Informe `title`, `subtitle`, `cover` opcional e até seis `items` com `name`, `detail`, `value` numérico e `icon` opcional. `referencePrice` usa a soma dos itens por padrão. Informe `finalPrice`, `finalLabel` e `currency` como BRL. |
| [CTA Expansível](index.html#cta-expansivel) | Edite `label`, `expandAt`, `hold` e `position` com `x` e `y` em porcentagem. A cena dura 8 s. Para usar sobre seu take, exporte em MOV com `transparent: true` e omita `presenter`. [Amostra](scenes/cta-expansivel/demo.json) |
| [Baralho de Bônus](index.html#baralho-de-bonus) | Informe até cinco `cards` com `name` e `detail`. Escolha a carta pelo índice `activeCard`, a partir de zero, e alinhe `unlockAt` à fala. |
| [Destaque de Região](index.html#destaque-de-regiao) | Passe `screen` e `cues` com `at` em segundos, `x`, `y`, `width`, `height` em porcentagem da captura e `label`. A opção `dimOutside` vai de 0 a 1. O destaque estático usa `documentImage` e `region`. [Amostra](scenes/destaque-de-regiao/demo.json) |
| [Matriz de Comparação](index.html#matriz-de-comparacao) | A variante de ferramentas recebe até cinco `tools` com `name`, `category`, `detail`, `price` e `replacement` opcional. Passe capturas em `screens`, na ordem das linhas, com `null` para pular um slot. A matriz em colunas aceita `options` e `rows`. [Amostra](scenes/matriz-de-comparacao/demo.json) |
| [Apresentador e Lista](index.html#apresentador-e-lista) | Use `presenter`, `heading` e de um a seis `items` com `title`, `detail` e `icon` opcional. Para retratos, passe `portraits` na mesma ordem e use `null` nos slots sem foto. A lista de cinco textos continua disponível. [Amostra](scenes/apresentador-e-lista/demo.json) |

## Hospedagem no GitHub

O HTML e os recursos locais usam caminhos relativos. Para publicar com GitHub
Pages, inclua um `.nojekyll` na raiz e, em **Settings → Pages**, selecione
**Deploy from a branch**, a branch **main** e a pasta **/(root)**. Essa
configuração publica a raiz do repositório. Antes de publicar o acervo,
separe a seleção gratuita e confira o histórico do branch público.
Mídia privada e peças pagas ficam em uma fonte separada. Os vídeos dos
cartões em `videos/` são publicados com o repositório; os insumos de
`previews/` continuam locais.
[Configuração do GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

O endereço esperado é [squados.github.io/squados-plugins/motion-gallery/](https://squados.github.io/squados-plugins/motion-gallery/).
O [JSON bruto na main](https://raw.githubusercontent.com/squados/squados-plugins/main/motion-gallery/catalog.json)
fica disponível quando o arquivo chega à branch remota.

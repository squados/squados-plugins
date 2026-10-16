# Verificação das identidades — 15/10/2026

Verificação local em Chromium 153 headless, com Playwright do checkout Desktop e
`http-server` 14.1.1. O [resultado integrado](QA.json) usa o prefixo real `/games/`;
as três prévias foram capturadas dos runtimes atuais e inspecionadas visualmente.
Cada jogo também possui evidência de controles, estado e reinício.

## Critérios e evidências

| Critério | Resultado e referência de implementação |
| --- | --- |
| ✅ Nomes próprios no catálogo | `index.html:70`, `index.html:104`: Simulador de Cidades, Corrida Espacial e Arcade 2D, com traduções em inglês |
| ✅ Cidade com apresentação própria | `3d-city/src/city3d/hub/Hub_Top.js:27`, `3d-city/src/city3d/hub/Hub_Build.js:13`: Prefeitura, indicadores, selo SVG e ferramentas vetoriais; materiais e fundo verde/mineral. Nome no título, loading e cabeçalho |
| ✅ Gestão urbana funcional | Construção real: tile **0→244**, fundos **35.000→34.900**; pausa, Serviços, save local, exportação JSON e reinício. Drawer e último item acessíveis em 390×568. Dez checks no [relatório da cidade](3d-city/VALIDATION.md) |
| ✅ Corrida com cenário orbital | `hexgl/space-racing.js:48`, `hexgl/space-racing.js:67`, `hexgl/space-racing.js:128`: emblema/banner, 1.400 estrelas, planeta anelado, lua, nave cobre/marfim, pista recolorida e instrumentos próprios |
| ✅ Pilotagem e resultados preservados | Teclado real acelera e muda direção; reinício durante corrida, queda e resultado; HUD acompanha estado nativo; som, idioma, resize e controles de toque. [Evidências da corrida](hexgl/QA.md) |
| ✅ Arcade com arte original | `clumsy-bird/js/game.js:5`: sete SVGs próprios, robô animado, cidade solar, plataforma e portais de energia; HUD e resultado novos. Engine, física e colisores preservados |
| ✅ Voo, colisão, pontos e áudio | Doze checks funcionais, incluindo dois pontos por comandos reais, mais cinco checks do loop de áudio. [Evidências do Arcade](clumsy-bird/QA.json) |
| ✅ Controles e telas pequenas | `clumsy-bird/js/game.js:56`, `clumsy-bird/js/entities/HUD.js:40`, `clumsy-bird/index.css:28`: Espaço/Enter nos botões sem disparar voo, clique devolve foco ao canvas, M curto e mantido com repeat alternam uma vez; resultado permite reinício em 568×320 e 844×390. Sete checks focados em `QA.json.uiRegression` |
| ✅ Índice PT-BR/EN e prévias atuais | `index.html:118`, `index.html:133`: três imagens decodificadas, idioma propagado e conservado no retorno; ações alinhadas em 1024px e ausência de overflow em 390px |
| ✅ Pacotes estáticos independentes | Três cenas prontas sob `/games/<id>/`, recursos exercitados dentro da própria pasta; zero chamada externa, HTTP 4xx/5xx, erro JS ou aviso no gate integrado final |
| ✅ Procedência preservada | Clones de origem intactos; licenças e avisos herdados mantidos, contribuições SquadOS identificadas nos UPSTREAMs. As pastas técnicas continuam `3d-city`, `hexgl`, `clumsy-bird` |
| ✅ Escopo local | Fontes, builds estáticos, arte, prévias e documentação em `games/`. Sem mudança no catálogo/interface do Desktop, push ou publicação |

A revisão independente leu as alterações, inspecionou as três prévias e exercitou
controles e telas pequenas. Seus achados de drawer da cidade, resultado landscape,
teclado do som, repeat de M e retorno de idioma foram corrigidos e revalidados.

## Eventos de stream após consumo completo

Algumas execuções da cidade registraram `net::ERR_ABORTED` no CDP após o consumo
completo de HDRs e do decoder Draco WASM. O diagnóstico preservou os loaders
upstream e distinguiu esses eventos de falhas reais de recurso:

- HDRs: HTTP 200, EOF e **5.376.993** / **1.411.630 bytes** exatos. Um teste mínimo
  com o wrapper `ReadableStream → Response.arrayBuffer()` reproduziu o evento sem
  AbortSignal e recebeu o corpo integral. O HDRLoader nativo decodificou envmap2
  em **1024×512**, com **2.097.152 componentes HalfFloat**, e SHA-256 igual ao local.
- Draco: HTTP 200, EOF e **192.420 bytes** exatos. SHA-256 do stream
  `a680d927bed9cb864ddbd63521868891af2bfbe755092761b4837487618df8ac`
  igual ao arquivo local; **WebAssembly.compile aprovado, com 149 exports**.
- A cidade só fica pronta depois do carregamento/decodificação nativos. O teste
  funcional também construiu e reiniciou a cidade. A frequência dos eventos
  variou; os testes não demonstraram causalidade determinística de um cabeçalho.

O gate classifica apenas esses três caminhos, exigindo HTTP 200, EOF, tamanho
esperado positivo, bytes integrais e cena pronta; WASM exige também hash e
compilação. Os eventos classificados permanecem em `completedStreamingCancellations`
do relatório integrado. Qualquer outra falha de rede/JavaScript reprova.
O gate integrado final não registrou cancelamentos; o [teste da cidade](3d-city/validation.json)
preserva quatro HDR e um WASM pós-consumo. Não se afirma zero eventos brutos em
todas as execuções. Nenhum loader ou engine foi alterado para esconder erros.

## Ambiente e limites

Flags do gate: `--use-gl=angle`, `--use-angle=d3d11`, `--ignore-gpu-blocklist`,
`--enable-gpu-rasterization`; navegador sempre headless. O servidor habitual
4387 foi reutilizado, e 4386 serviu temporariamente a raiz do acervo para validar
`/games/`. Scripts/screenhots complementares em `games/.verification/` são
ignorados e não são dependências dos jogos. A corrida também inclui seu script
reproduzível e evidências em `hexgl/qa/`.

A corrida combina pilotagem real com fixtures nativas de destruição e checkpoints
para resultados; **não houve pilotagem integral de três voltas**. Áudio foi
conferido por estado, sem escuta humana. Toque foi emulado. Alguns campos internos
de painéis avançados da cidade permanecem em inglês e não têm cobertura integral.
Firefox, Safari, aparelhos físicos e integração ao runtime do Studio não foram
exercitados. Tempos locais não são benchmarks de carregamento público ou FPS.

Sem push, deploy, hospedagem pública ou ativação no catálogo Desktop. Partes do
HexGL continuam sob CC BY-NC 3.0; identidade nova não resolve essa restrição para
uma publicação comercial. Créditos, fontes e demais termos acompanham os pacotes.

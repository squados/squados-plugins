# Verificação do conjunto — 15/10/2026

Verificação local de pacotes estáticos em Chromium 153 headless, com Playwright
emprestado do checkout Desktop. O servidor compartilhado usa `http-server` 14.1.1.
O resultado integrado está em [QA.json](QA.json). Os screenshots de cada jogo
foram inspecionados e são cenas reais dos respectivos runtimes.

## Critérios e evidências

| Critério | Resultado e referência de implementação |
| --- | --- |
| ✅ Três bases exatas preservadas | `git status --short` vazio nos três clones; hashes registrados no [README](README.md). `LICENSE`, `COPYING` de City e licenças de HexGL/Bird comparados byte a byte |
| ✅ Derivados no destino pedido | `games/3d-city/`, `games/hexgl/`, `games/clumsy-bird/`, sem dependência dos clones em tempo de execução |
| ✅ Cidade abre jogável | `3d-city/demo.js:32`, `3d-city/src/Main.js:90`: save nativo, aquecimento GPU e carga direta. Construção por seleção/clique real muda tile `0→244` e fundos `35000→34900`; reinício restaura ambos. [Evidência](3d-city/VALIDATION.md) |
| ✅ Corrida abre na pista | `hexgl/launch.js:132`: carrega Cityscape e inicia contagem/corrida. Aceleração e duas direções por teclado real; reinício durante corrida, queda e resultado. [Evidência](hexgl/QA.md) |
| ✅ Pássaro abre em cena segura | `clumsy-bird/js/game.js:69`: entra em PLAY, física inicia no primeiro comando. Dois pontos por teclado real, colisões de chão/cano e reinício. [Evidência](clumsy-bird/QA.json) |
| ✅ Som do pássaro não perde a trilha | `clumsy-bird/js/game.js:72`: o primeiro voo cria um único loop, inclusive silenciado. Falha reproduzida antes, corrigida e revalidada pelo implementador e revisor independentes |
| ✅ Índice PT-BR/EN e três prévias | `index.html:63`, `index.html:115`: três imagens decodificadas; alternância traduz o índice e leva `?lang=` aos jogos; sem overflow em 390px |
| ✅ Caminhos independentes | Os três jogos renderizam sob `/games/<id>/`. Todos os requests exercitados permaneceram dentro da própria pasta do jogo; nenhum request externo nem HTTP 4xx/5xx |
| ✅ Créditos/fontes/termos | README, UPSTREAM, fontes, assets e avisos preservados em cada pacote. Não há licença MIT global para todo o conteúdo; HexGL tem exceções não comerciais explícitas |
| ✅ Revisão independente | Comparação das mudanças com os clones, inspeção das prévias, leitura dos fontes e revalidação do áudio. Nenhum achado Critical/Important aberto; o Minor de áudio foi resolvido |
| ✅ Escopo de entrega | Somente arquivos estáticos, documentação e ferramenta de desenvolvimento local. `gallery.json` e a interface do Desktop não foram alterados para incorporar jogos |

## Cancelamentos de HDR no Chromium

O primeiro gate integrado falhou porque o CDP registrou `net::ERR_ABORTED` em
`envmap.hdr` e `envmap2.hdr`. Esperar `networkidle` não eliminou o evento. O caso
foi investigado sem suprimir erros nem alterar o renderer de terceiros:

- Ambos retornaram HTTP 200 e foram consumidos até `done: true`, com exatamente
  **5.376.993** e **1.411.630 bytes**, iguais ao `Content-Length`.
- Um teste mínimo com `fetch().arrayBuffer()` terminou normalmente. Envolver a
  leitura em `ReadableStream → Response → arrayBuffer`, como o FileLoader nativo,
  reproduziu o evento sem qualquer AbortSignal e ainda devolveu todos os bytes.
- O HDRLoader nativo decodificou o segundo arquivo em **1024 × 512**, com
  **2.097.152 componentes HalfFloat**. O SHA256 do buffer recebido foi igual ao
  arquivo local. A frequência variou entre execuções e o evento também ocorreu
  com resposta chunked; os testes não demonstraram causalidade de um cabeçalho.
- A cidade só sinaliza pronta depois de `Pool.loadEnvmap()` aguardar carregamento
  e parsing dos HDRs. A cena final foi capturada e a construção exercitada.

O gate aceita **apenas esses cancelamentos específicos após consumo completo**,
exigindo HTTP 200, `done`, tamanho esperado positivo, bytes exatos e cidade pronta.
Eles permanecem em `completedHdrCancellations` do JSON; qualquer outra falha de
rede/JavaScript continua reprovando. Não se declara zero eventos `requestfailed`
no servidor compartilhado. Não houve recurso obrigatório ausente, resposta HTTP
de erro, erro/aviso de console ou chamada externa na execução integrada final.

## Ambiente e limites

Flags do navegador: `--use-gl=angle`, `--use-angle=d3d11`,
`--ignore-gpu-blocklist`, `--enable-gpu-rasterization`; execução sempre headless.
Os scripts e screenshots complementares ficaram no scratch autorizado e em
`games/.verification/` (ignorado). Não são dependências dos jogos. A preparação
de runtime do Studio, Firefox/Safari e aparelhos físicos não foi exercitada.

A prova do HexGL combina pilotagem real de aceleração/direção com fixtures nativas
de destruição e checkpoints para os resultados. **Não houve pilotagem integral
de três voltas.** O estado de áudio foi conferido programaticamente, sem escuta
humana. Toque foi emulado. Painéis avançados da cidade não tiveram cobertura integral.
Tempos locais registrados não são benchmarks de carregamento público ou de FPS.

Não houve push, deploy, hospedagem pública ou ativação no catálogo do Desktop.
A restrição comercial de partes do HexGL permanece pendente de resolução para
uma publicação nesse contexto; funcionamento local não concede direitos adicionais.

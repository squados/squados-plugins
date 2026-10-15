# Validação local — 15/10/2026

O build Rollup (`npm run build`) passou após as últimas alterações de fontes.
O save inicial foi produzido por `npm run demo:generate`. `package-lock.json`
preserva a resolução de dependências; a pasta `node_modules` não é distribuída.

Playwright emprestado do checkout Desktop, Chromium **headless**, viewport
1440 × 900, servidor estático temporário na porta 4388, URL
`http://127.0.0.1:4388/games/3d-city/?lang=en`.
O relatório bruto está em [validation.json](validation.json); o resultado final
é `passed: true`.

- ✅ Abertura direta de cidade já construída, sem tela de mapa/configuração.
- ✅ Worker RUN ativo, população maior que zero, fundos iniciais 35.000.
- ✅ `?lang=en` inicia as instruções em inglês; botão PT/EN alterna o texto.
- ✅ Pausa pela barra original estabiliza a contagem de ticks do worker.
- ✅ Seleção real de `residential` na barra original e clique real no canvas
  em terreno vazio. O comando nativo chegou a **(13,32)**; houve **BUILD**;
  o tile mudou de **0 para 244** e os fundos de **35.000 para 34.900**.
  Após corrigir a altura no modo plano, essa construção também renderizou
  sem erro de página. A screenshot isolada do canvas não foi usada como prova única.
- ✅ Roda, arraste para girar e seta direita exercitados por eventos de navegador,
  sem erro durante a interação.
- ✅ Reiniciar pelo botão restaura o terreno original e os fundos 35.000.
  O boot envia uma única carga `MAKELOADGAME`, sem o antigo PLAYMAP duplicado.
- ✅ No smoke final: **0 pageerror, 0 console.error, 0 warning,
  0 requisição falhada, 0 HTTP 4xx/5xx e 0 requisição externa**.
- ✅ Preview final em [preview.png](preview.png).

## Observação da integração com http-server

O zero de requisições falhadas acima pertence àquela execução no servidor
temporário customizado. Na integração com `http-server` padrão, o Chromium pode
emitir `Network.loadingFailed: net::ERR_ABORTED`, `canceled: true`, para
`envmap.hdr` e `envmap2.hdr` **depois de o corpo inteiro ter sido consumido**,
antes de qualquer navegação. Os HTTPs retornam 200 e os tamanhos completos:
5.376.993 e 1.411.630 bytes. Isso não foi simplesmente descartado como unload.

Um probe isolado demonstrou a diferença entre `fetch().arrayBuffer()` e o fluxo
nativo `getReader() → ReadableStream → Response.arrayBuffer()`, sem AbortSignal:
o segundo pode produzir o evento CDP mesmo com `reader.read()` chegando a
`done: true` e devolvendo todos os bytes. Para `envmap2.hdr`, o buffer completo
tem SHA-256 `a12456127baeaef63c672581e72f10e0e046771980cc32deb214e63ce2ff5131`,
idêntico ao arquivo local. O `HDRLoader` nativo decodificou 1024 × 512 pixels,
2.097.152 componentes HalfFloat (4.194.304 bytes de dados decodificados), sem exceção.
`FileLoader` e `HDRLoader` usados nesse probe são idênticos por hash ao clone upstream.

O evento também variou entre respostas chunked e Content-Length em rodadas
distintas; não se atribui uma causa determinística a um header. Nenhuma alteração
de engine ou servidor foi feita para esconder o evento. A integração só classifica
esse caso delimitado quando HTTP 200, corpo completo/tamanho correto, EOF do
stream e cidade pronta estão comprovados. Outros cancelamentos, erros JS,
falhas HTTP ou corpos incompletos continuam falhas.

No cold load observado, a cidade ficou pronta em aproximadamente **2,76 s**.
Os 42 recursos registrados pelo navegador somaram cerca de **29,59 MB**
(28,22 MiB) transferidos. São medidas desta máquina e execução local, sem
promessa de desempenho em outros dispositivos; não se confundem com o tamanho
do pacote completo, que inclui fontes, builds, avisos legais e recursos upstream.

Antes do resultado final, a entrada direta expôs erros WebGL de atlas de terreno
porque pulava o aquecimento da introdução nativa. Esperar `compileAsync` e dois
frames resolveu essa causa e preservou o renderer original. O teste de construção
também revelou e levou à correção do acesso a `heightData` no modo plano.

Limites: os painéis avançados originais (orçamento completo, desastres, importação/
exportação manual de saves, premiações etc.) não receberam cobertura exaustiva.
A demo usa o HUD original em inglês e traduz a ajuda acrescentada. A turbina
eólica continua indisponível como no upstream, com identificação no controle.
Publicação externa e integração no commit do catálogo são responsabilidade da
entrega coordenada, não evidência deste smoke local.

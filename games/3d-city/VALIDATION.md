# Validação — Simulador de Cidades

Identidade adaptada em 15/10/2026, com build Rollup e navegação real no servidor
compartilhado `http://127.0.0.1:4387/3d-city/`. Chromium headless via Playwright
emprestado do Desktop. Sem servidor novo, janela visível, push ou publicação.

`npm run demo:generate` e `npm run build` passaram. O relatório atual
[validation.json](validation.json) tem **`passed: true`** após as últimas alterações
às fontes; não se usa apenas a presença de canvas como prova de gameplay.

## Critérios e provas

| Critério | Evidência em código | Resultado verificado |
|---|---|---|
| Nome próprio, favicon e apresentação | `index.html:8`, `index.html:18`, `src/city3d/Hub.js:62` | ✅ Simulador de Cidades / City Simulator no título, cabeçalho e loading real; selo SVG novo |
| HUD diferente da base | `src/city3d/hub/Hub_Top.js:27`, `src/city3d/hub/Hub_Build.js:13` | ✅ Prefeitura, indicadores e ferramentas vetoriais com nomes/preços, em verde/mineral |
| Ambientação e enquadramento | `src/Main.js:46`, `src/Main.js:171`, `src/city3d/Material.js:194`, `src/city3d/View.js:694` | ✅ Fundo mineral, materiais foscos e câmera por viewport, com renderer e modelos nativos |
| PT-BR/EN e retorno ao índice | `demo.js:18`, `demo.js:26`, `demo.js:27`, `src/city3d/Copy.js:1` | ✅ Troca nome, menus, métricas, ferramentas e ajuda; idioma permanece ao reiniciar; link relativo ao índice |
| Ferramentas e pausa | `src/city3d/hub/Hub_Build.js:100`, `src/city3d/hub/Hub_Build.js:104` | ✅ Botões novos chamam controles nativos; pausa estabiliza RUN do worker |
| Construção real | `src/city3d/hub/Hub_Build.js:108` | ✅ Moradias → clique canvas (13,32) → BUILD, tile **0 → 244**, fundos **35.000 → 34.900** |
| Serviços | `src/city3d/hub/Hub_Build.js:76` | ✅ Aba Serviços seleciona o tool nativo `park`; voltar a Construir limpa a seleção |
| Save e exportação | `src/city3d/hub/Hub_Save_Load.js:12` | ✅ Save local e download JSON nativos contêm 34.900 de fundos e mapa 64 × 64; BOM UTF-8 original respeitado ao ler o download |
| Reinício | `demo.js:9` | ✅ Restaura tile 0 / fundos 35.000; uma MAKELOADGAME e zero PLAYMAP duplicado; idioma conservado |
| Viewport estreito e baixo | `demo.css:18`, `demo.css:19` | ✅ 390 × 844 e 390 × 568 sem overflow da página; Gestão e último item Créditos + Fechar acessíveis |
| Créditos e licenças | `src/city3d/hub/Hub_About.js:14`, `UPSTREAM.md:1` | ✅ Distingue identidade SquadOS de motor/recursos lo-th, Three.js e MicropolisJS; avisos legais preservados |

A revisão detectou um limite de altura potencial no drawer em 390 × 568.
Foi confirmado no navegador: max-height 18 px / clientHeight 28 px para 256 px de
conteúdo. A correção usa o espaço abaixo do cabeçalho e scroll interno; o teste
final mediu **256 px de altura**, todos os itens e o botão Fechar alcançáveis.
Em telas baixas, a prancheta passa a uma faixa horizontal rolável: 650 px de
conteúdo em 346 px visíveis, sem alargar a página e com as últimas ferramentas acessíveis.

Previews finais no viewport real: [desktop 1440 × 900](preview.png),
[390 × 844](preview-mobile.png), [390 × 568](preview-mobile-short.png).
No teste final: **0 pageerror, 0 console.error, 0 warning, 0 HTTP 4xx/5xx,
0 requisição externa e 0 falha de recurso sem comprovação de consumo**.

## Eventos CDP após consumo completo

Não se afirma zero de eventos brutos `requestfailed`. O relatório separa quatro
cancelamentos HDR e um do decoder WASM, todos com `net::ERR_ABORTED`, preservados
na evidência. O Chromium pode sinalizar cancelamento ao terminar o wrapper de
stream do FileLoader, mesmo depois de EOF e consumo completo. Nenhum loader ou
servidor foi alterado para esconder esse evento.

Para os HDRs, foram registrados HTTP 200, `reader.read()` com `done: true`, bytes
iguais a Content-Length e cidade pronta: `envmap.hdr` **5.376.993 bytes**;
`envmap2.hdr` **1.411.630 bytes**. O diagnóstico anterior isolou
`getReader() → ReadableStream → Response.arrayBuffer()` sem AbortSignal e confirmou
o SHA-256 de envmap2 `a12456127baeaef63c672581e72f10e0e046771980cc32deb214e63ce2ff5131`,
com decoder HDR nativo retornando 1024 × 512 / 4.194.304 bytes de dados HalfFloat.
Os fontes FileLoader/HDRLoader são idênticos por hash ao clone upstream.

Para `draco_decoder.wasm`, o teste atual capturou HTTP 200, EOF e **192.420 bytes**
iguais ao Content-Length. O SHA-256 calculado sobre os bytes lidos do próprio
stream foi `a680d927bed9cb864ddbd63521868891af2bfbe755092761b4837487618df8ac`,
idêntico ao arquivo local. **WebAssembly.compile passou, com 149 exports**, e os
modelos da cidade foram decodificados normalmente antes de city-ready.

A classificação permite somente esses arquivos e somente com todas as provas
correspondentes. Qualquer corpo incompleto, HTTP incorreto, falha de compilação,
ausência de cidade pronta ou outro erro continua reprovando o gate. As diferenças
entre chunked e Content-Length variaram com timing; não se afirma causa determinística
em um header. Os detalhes por requisição estão em `validation.json`.

## Limites

A interface principal e os títulos dos painéis têm PT-BR/EN. Campos internos de
painéis avançados e algumas mensagens da simulação continuam no inglês herdado.
Não houve auditoria exaustiva de todas as regras econômicas, desastres, mapas de
informação ou importação manual. A turbina permanece indisponível como no upstream.
Requer HTTP e WebGL 2; viewport estreito não é prova de aplicativo nativo mobile.
Integração, revisão independente e commit do conjunto pertencem ao coordenador.
Push, hospedagem pública e publicação permanecem fora deste pedido.

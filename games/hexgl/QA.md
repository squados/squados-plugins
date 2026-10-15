# Verificação local — HexGL

Em 15/10/2026, a adaptação passou em Chromium headless do Playwright, servido
estaticamente em `http://127.0.0.1:4389/games/hexgl/`. Nenhuma janela foi aberta.
O servidor temporário fechou no `finally`; a porta 4389 foi conferida sem listener.

## Ambiente e comando executado

Playwright foi reutilizado do `node_modules` de `squados-desktop` via
`createRequire('D:/Coding Projects/squados-desktop/package.json')`, sem instalar
pacote dentro desta demo. Execução do script isolado:

```powershell
node 'D:\Coding Projects\_tempsandbox\hexgl-qa\verify.mjs'
```

O script hospeda arquivos estáticos durante a própria execução e fecha servidor e
browser ao sair. Logs e evidência estruturada permanecem no scratch autorizado:
`D:\Coding Projects\_tempsandbox\hexgl-qa\verify.log` e `evidence.json`.

Flags do browser: `headless: true`, `--use-gl=angle`, `--use-angle=d3d11`,
`--ignore-gpu-blocklist`, `--enable-gpu-rasterization`. A extensão
`WEBGL_debug_renderer_info` confirmou **ANGLE / NVIDIA GeForce RTX 3090 / D3D11**;
não foi usada rasterização SwiftShader para as medições de movimento.

## Evidência de comportamento

| Critério | Evidência da execução | Referência de implementação |
| --- | --- | --- |
| ✅ Abrir direto na corrida | Carregamento completo, overlay oculto e gameplay em `step=4` sem clique inicial | `launch.js:119`, `launch.js:131` |
| ✅ Contagem breve | Pista renderizada, três números, controle liberado após ~3 s | `launch.js:137` |
| ✅ Aceleração real por teclado | `ArrowUp` por 2,4 s: velocidade interna `0 → 2,891`; posição z `-886 → -675,587` | `bkcore/hexgl/ShipControls.js:432` |
| ✅ Direção real por teclado | `ArrowLeft` por 0,4 s: quaternion y `0 → 0,221`, x `-2268 → -2252,273`; `ArrowRight` por 0,45 s leva quaternion y a `-0,021` | `bkcore/hexgl/ShipControls.js:420` |
| ✅ Reinício durante corrida | Tecla `R` zera velocidade e repõe nave em z `-886` | `launch.js:76`, `bkcore/hexgl/Gameplay.js:116` |
| ✅ Reinício durante queda | Queda disparada como fixture, `R` antes do timeout; após 1,8 s `falling=false`, `destroyed=false` | `bkcore/hexgl/ShipControls.js:304` |
| ✅ Resultado de destruição | Fixture de queda atravessa o fluxo nativo de destruição e mostra “Nave destruída”; botão abre nova corrida | `launch.js:125`, `bkcore/hexgl/Gameplay.js:175` |
| ✅ Resultado de três voltas | Checkpoints controlados passam pelo contador nativo; resultado FINISH, 3 tempos e “Corrida concluída” | `bkcore/hexgl/Gameplay.js:61`, `launch.js:125` |
| ✅ Dados limpos após resultado | Nova corrida com `lap=1`, `lapTimes=[]`, `result=-1`; aceleração continua funcionando | `bkcore/hexgl/Gameplay.js:121` |
| ✅ Teclas liberadas ao perder foco | Evento de blur limpa `key.forward` enquanto a tecla estava pressionada | `launch.js:71` |
| ✅ Som opcional | Clique muda AudioContext para `running` e `aria-pressed=true`; segundo clique suspende | `launch.js:87`, `bkcore/Audio.js:75` |
| ✅ PT-BR/EN | Toggle muda `html.lang` e ajuda; novo contexto com `?lang=en` abre em inglês | `launch.js:40` |
| ✅ Redimensionamento | De 1440×900 para 390×844: os dois canvases tornam-se 390×844; sem overflow horizontal | `launch.js:143` |
| ✅ Controles em tela estreita | Contexto móvel 390×844 mostra botões; pressionar ↑ por 0,9 s atinge velocidade `1,084`; soltar limpa a entrada | `launch.js:110`, `index.html:37` |
| ✅ Renderer atual sem falha GLSL | Nenhum programa com falha de link; nenhum warning de matriz singular após destruição | `libs/hexgl-compat.js:8`, `bkcore/hexgl/ShipEffects.js:128` |

As velocidades acima são unidades internas da física; o HUD original converte
para a apresentação de velocidade. `preview.png` foi capturado em 1440×900,
durante aceleração e curva, e inspecionado visualmente. A captura móvel também foi
inspecionada; continua no scratch como `touch-en.png`.

## Console e recursos

Na última execução, incluindo contexto desktop, redimensionamento e contexto móvel:

- **162 requisições**, todas para o servidor local.
- **0** erros de console ou `pageerror`; **0** avisos de console.
- **0** requests falhas; **0** respostas HTTP 4xx/5xx; **0** chamadas externas.
- Todos os modelos, imagens, sons, shaders, scripts e fontes usados estavam locais.
- O clone upstream continuou com `git status --porcelain` vazio.

## Limites da evidência

A aceleração e as duas direções foram exercitadas com eventos reais de teclado.
O botão móvel foi mantido pressionado por eventos de ponteiro no contexto que
expõe toque. O estado do AudioContext foi verificado; isso não é uma escuta humana.

A destruição foi disparada por fixture da função nativa `fall()`. A chegada usou
uma sequência controlada de checkpoints (`2,0,2,0,2,0`) para validar contagem,
resultado e reinício. **Não houve pilotagem manual/automatizada de três voltas
inteiras**, nem teste físico em smartphone, Firefox ou Safari.

A QA confirma funcionamento local desta adaptação. A integração no catálogo é
responsabilidade do coordenador; não houve commit, push ou publicação nesta
subtarefa. Licenças mistas, especialmente CC BY-NC 3.0 em partes centrais, continuam
aplicáveis e não foram tratadas como autorização para distribuição comercial.

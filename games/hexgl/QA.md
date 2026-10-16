# QA — Corrida Espacial / Space Racing

Verificação da identidade atual em 15/10/2026. **PASS** em Chromium headless com
GPU real, reutilizando `http://127.0.0.1:4387/hexgl/`. Nenhuma janela ou novo
servidor foi aberto; o servidor compartilhado permaneceu ativo para o coordenador.

## Execução

Da raiz do repositório:

```powershell
node games/hexgl/qa/verify-identity.mjs
```

O script reutiliza Playwright do repositório irmão `squados-desktop`, via
`createRequire`. Outra instalação pode ser indicada com a variável
`PLAYWRIGHT_PACKAGE_JSON`. Não instala dependências nesta pasta. O próprio
`games/package.json` mantém o comando do servidor estático compartilhado.

Browser: `headless: true`, `--use-gl=angle`, `--use-angle=d3d11`,
`--ignore-gpu-blocklist`, `--enable-gpu-rasterization`. A extensão
`WEBGL_debug_renderer_info` confirmou **ANGLE / NVIDIA GeForce RTX 3090 / D3D11**.
Os testes não usaram SwiftShader para interpretar o movimento da nave.

Evidências atuais: [qa/evidence-identity.json](qa/evidence-identity.json),
[qa/verify-identity.log](qa/verify-identity.log), [preview.png](preview.png),
[mobile em inglês](qa/touch-en.png), [resultado PT](qa/result-pt.png) e
[resultado EN](qa/result-en.png).

## Critérios e evidência

| Critério | Resultado verificado | Código |
| --- | --- | --- |
| ✅ Nome próprio PT/EN | Título/documento “Corrida Espacial · SquadOS” / “Space Racing · SquadOS”; nome no loading e resultado | `launch.js:13`, `launch.js:26`, `launch.js:45` |
| ✅ Identidade além do título | Nave cobre/marfim, pavimento com faixas verdes, estação noturna, planeta anelado e estrelas renderizados; preview atual inspecionado | `space-racing.js:93` |
| ✅ Ambiente espacial nativo | 1.400 vértices no campo de estrelas, esfera noturna, planeta, anéis e lua presentes na cena; plano de fundo antigo oculto | `space-racing.js:67`, `space-racing.js:82` |
| ✅ Emblema/favicon/banner próprios | SVG novo usado na interface/favicon; banner de largada “SQUADOS / ORBITAL 01”, sem logo original | `index.html:8`, `space-racing.js:48` |
| ✅ Instrumentos próprios | HUD original oculto; volta, tempo, velocidade e escudo renderizados pela interface nova com estado nativo | `space-racing.js:128`, `index.html:24` |
| ✅ Entrada direta | Loading desaparece, cena abre, contagem breve libera a corrida sem clique inicial | `launch.js:142`, `launch.js:145` |
| ✅ Aceleração por teclado | `ArrowUp` por 2,4 s: velocidade interna `0 → aproximadamente 2,89`; z `-886 → aproximadamente -675,5` | `bkcore/hexgl/ShipControls.js:432` |
| ✅ Direção por teclado | `ArrowLeft` por 0,4 s muda quaternion y de `0 → aproximadamente 0,22` e x lateral em aproximadamente 16 unidades; `ArrowRight` reduz quaternion y para valor negativo | `bkcore/hexgl/ShipControls.js:420` |
| ✅ Reinício na corrida | `R` zera velocidade e repõe a nave em z `-886` | `launch.js:87`, `bkcore/hexgl/Gameplay.js:116` |
| ✅ Reinício durante queda | Fixture `fall()`, `R` antes do timeout e espera de 1,8 s: `falling=false`, `destroyed=false` | `bkcore/hexgl/ShipControls.js:304` |
| ✅ Destruição e nova corrida | Fixture nativo de queda mostra resultado; botão inicia nova corrida funcional | `launch.js:136`, `bkcore/hexgl/Gameplay.js:175` |
| ✅ Resultado PT/EN | Checkpoints controlados completam três voltas; resultado PT “Corrida concluída” / EN “Race complete”, com o nome próprio correspondente | `launch.js:136`, `bkcore/hexgl/Gameplay.js:61` |
| ✅ Estado limpo após resultado | Nova corrida volta a `lap=1`, `lapTimes=[]`, `result=-1`; acelerar continua funcionando | `bkcore/hexgl/Gameplay.js:121` |
| ✅ Teclas soltas ao perder foco | Blur limpa `key.forward` enquanto a tecla estava pressionada | `launch.js:82` |
| ✅ Som opcional | Clique leva AudioContext a `running`; segundo clique suspende, sem interromper a corrida | `launch.js:98` |
| ✅ Interface PT/EN | Idioma, títulos, controles, instrumentos, ajuda e resultado usam as duas cópias; novo contexto `?lang=en` abre em EN | `launch.js:42` |
| ✅ Índice e créditos | Links `../?lang=pt-BR` e `../?lang=en` conferidos no inicial, toggle e contexto móvel; “Derivado de HexGL por BKcore” acessível pelo rodapé; documentação mantém licenças e autoria reais | `index.html:60` |
| ✅ Resize e toque | Desktop 1440×900 para 390×844: canvases atualizados, sem overflow; contexto móvel mostra botões e pressionar ↑ por 0,9 s acelera; soltar limpa a entrada | `launch.js:155`, `launch.js:121` |
| ✅ Renderer e recursos | Nenhuma falha de link GLSL; bibliotecas/modelos/sons locais; zero chamada externa obrigatória | `libs/hexgl-compat.js:8`, `space-racing.js:149` |

A velocidade é uma unidade de apresentação herdada da física; o instrumento não
atribui uma unidade física nova. Os cenários de movimento usaram eventos reais de
teclado. O botão móvel usou eventos de ponteiro em contexto com toque disponível.
As capturas desktop, móvel e de resultado foram inspecionadas visualmente.

## Console e rede

A última rodada reuniu **162 requisições locais**, incluindo contexto desktop,
redimensionamento e contexto móvel:

- **0** erros de console ou `pageerror`.
- **0** avisos de console e **0** programas GLSL com falha de link.
- **0** requests falhas e **0** respostas HTTP 4xx/5xx.
- **0** chamadas externas; código, sons e recursos necessários são locais.

`node --check` também passou em `launch.js`, `space-racing.js`,
`libs/hexgl-compat.js` e no script de QA. O clone upstream permaneceu intacto.
`LICENSE`, `audio/LICENSE` e o README upstream preservado foram conferidos contra
o clone original. Não houve mudança nas bibliotecas vendorizadas nesta identidade.

## Limites e entrega

A destruição foi acionada pelo fixture nativo `fall()`. A chegada usa checkpoints
controlados (`2,0,2,0,2,0`) para validar contagem, resultado e reinício. **Não houve
pilotagem integral de três voltas**, validação em smartphone físico, Firefox ou
Safari. AudioContext ativo não equivale a uma escuta humana.

Esta QA confirma a adaptação local e a nova apresentação. Integração e revisão do
conjunto ficam com o coordenador. A subtarefa não fez commit, push, deploy ou
publicação. Os componentes herdados continuam sob licenças mistas, inclusive
**CC BY-NC 3.0**; nome e arte novos não autorizam distribuição comercial nem
transformam o conjunto em MIT integral.

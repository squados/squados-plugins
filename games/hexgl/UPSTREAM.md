# Origem, créditos e licenças — Corrida Espacial

## Proveniência

- Projeto: [BKcore/HexGL](https://github.com/BKcore/HexGL).
- Commit incorporado: [`6addc95a2fce3bf05f4d751823cc054c61a16d68`](https://github.com/BKcore/HexGL/tree/6addc95a2fce3bf05f4d751823cc054c61a16d68).
- Clone de origem: `D:\Coding Projects\_tempsandbox\HexGL`, preservado sem alteração.
- Adaptação local: `games/hexgl`, em 15/10/2026.
- README original preservado em [README.upstream.md](README.upstream.md).
- Não foram copiados `.git`, `package.zip`, manifests instaláveis nem appcache.
- Foram preservados código JavaScript/CoffeeScript, bibliotecas, geometria,
  texturas normais e completas, replay de exemplo, áudio, fontes e imagens.
- `libs/Editor.html` e `libs/Editor_files/` são utilitários upstream preservados;
  não são carregados pelo runtime da demo. Não há `node_modules` nesta pasta.

## Autoria

Conceito e desenvolvimento: **Thibaut Despoulain (BKcore)**. Colaboradores citados
na interface original: **townxelliot** e **mahesh.kk**. Modelo base HexMKI:
**Charnel**. Textura da pista: **Nobiax**. Áudio e ajustes: autores discriminados
abaixo, com **Licson** e **baleboy**. Tecnologias originais: WebGL, JavaScript,
CoffeeScript e Three.js; a biblioteca LeapMotion está preservada, mas não é
carregada nem exigida pela demo.

SquadOS fez a adaptação de entrada, interface e compatibilidade descrita abaixo;
a curadoria e a adaptação não transferem a autoria do jogo ou dos assets.

## Licenças e restrições

O [README upstream](README.upstream.md) declara código e recursos sob MIT **salvo
especificação em cada arquivo**. O [LICENSE](LICENSE) original contém MIT,
copyright © 2015 Thibaut Despoulain, e foi preservado literalmente.

Há exceções explícitas. Estes arquivos trazem cabeçalhos
[Creative Commons Attribution-NonCommercial 3.0 Unported](https://creativecommons.org/licenses/by-nc/3.0/):

| Arquivo | Licença declarada |
| --- | --- |
| `bkcore/hexgl/HexGL.js` | CC BY-NC 3.0 |
| `bkcore/hexgl/Gameplay.js` | CC BY-NC 3.0 |
| `bkcore/hexgl/ShipControls.js` | CC BY-NC 3.0 |
| `bkcore/hexgl/ShipEffects.js` | CC BY-NC 3.0 |
| `bkcore/hexgl/CameraChase.js` | CC BY-NC 3.0 |
| `bkcore/hexgl/HUD.js` | CC BY-NC 3.0 |
| `bkcore/hexgl/RaceData.js` | CC BY-NC 3.0 |
| `bkcore/hexgl/tracks/Cityscape.js` | CC BY-NC 3.0 |
| `bkcore/hexgl/Ladder.js` (preservado, não carregado) | CC BY-NC 3.0 |

Os cabeçalhos foram preservados, inclusive nos arquivos alterados. O pacote é de
**licenças mistas com partes não comerciais**; não é integralmente MIT nem deve
ser classificado como integralmente open source. O funcionamento local verificado
não comprova elegibilidade para hospedagem ou distribuição comercial. Uma futura
publicação deve respeitar essas restrições e resolver autorização apropriada para
o uso pretendido. Nada foi publicado por esta adaptação.

O áudio possui [audio/LICENSE](audio/LICENSE) próprio, também preservado:

| Arquivo | Autor e licença declarados |
| --- | --- |
| `boost.ogg` | IFartInUrGeneralDirection — CC BY 3.0 |
| `crash.ogg` | qubodup — domínio público |
| `wind.ogg` | kangaroovindaloo — CC BY 3.0; cortes/ajustes de Licson |
| `bg.ogg` | mu6k — domínio público; ajustes de Licson |
| `destroyed.ogg` | beman87 — CC BY 3.0; ajustes de Licson |

Conversão dos sons para OGG Vorbis: baleboy, com VLC Media Player. Bibliotecas e
utilitários preservam seus próprios avisos; por exemplo, o editor legado contém
KineticJS sob escolha MIT/GPLv2 e jshashtable sob Apache 2.0. Esses utilitários não
são parte do caminho carregado pela corrida. Em qualquer conflito, a declaração
específica do arquivo continua aplicável; o MIT da raiz não a substitui.

## Adaptação inicial de execução

- `index.html`, `launch.js`, `css/demo.css`: entrada direta em Cityscape com
  contagem de três segundos, interface PT-BR/EN, ajuda breve, botão de som,
  reinício, controles por toque e resultado com tempos locais à corrida.
- Removidos do caminho executado: menu inicial, escolha de qualidade/controles,
  telemetria Google Analytics, ícones remotos, ranking, compartilhamento e login.
- Modelos, shaders, texturas, câmera, física, colisão, escudo e checkpoints do
  HexGL permanecem; qualidade alta e controle original por teclado são usados.
- `libs/hexgl-compat.js`: precisão `mediump int` explícita para `renderType` nos
  shaders de lens flare do Three.js 50dev. O validador atual recusava o link por
  precisão diferente entre vertex e fragment; a biblioteca não foi substituída.
- `bkcore/Audio.js`: permite manter som desligado até ação do usuário. O botão
  retoma o AudioContext e inicia as faixas, sem bloquear a corrida.
- `bkcore/hexgl/ShipControls.js`: reinício limpa queda, temporizador pendente,
  rotação angular, repulsão e colisões. O timeout de queda usa referência local.
- `bkcore/hexgl/Gameplay.js`: reinício limpa tempos de volta, tempo acumulado e
  resultado para uma corrida não herdar dados da anterior.
- `bkcore/hexgl/HexGL.js`: Esc respeita o evento já tratado pela interface e não
  tenta reiniciar enquanto gameplay ainda não existe.
- `bkcore/hexgl/ShipEffects.js`: o propulsor destruído fica invisível em vez de
  usar escala zero, evitando matrizes singulares e avisos repetidos do renderer.
- Redimensionamento atualiza câmera, framebuffer, efeito hexagonal e HUD; soltar
  foco libera as teclas para não manter a aceleração presa.

## Identidade Corrida Espacial / Space Racing — SquadOS

O nome público da adaptação é **Corrida Espacial** em PT-BR e **Space Racing** em
EN. O traçado herdado de Cityscape é apresentado como estação **Orbital 01**.
A pasta técnica continua `games/hexgl`; isso não transforma o nome ou a autoria do
upstream. A obra derivada continua sujeita às licenças mistas acima.

Arquivos próprios criados ou alterados para esta identidade:

- `space-racing.js`: ambientação com esfera noturna, 1.400 estrelas determinísticas
  em `ParticleSystem`, planeta com bandas procedurais, anéis e uma lua. Usa
  `SphereGeometry`, `TorusGeometry`, `Geometry`, `ParticleBasicMaterial`,
  `MeshPhongMaterial`, `MeshBasicMaterial` e `Texture` do Three.js 50dev local.
- Texturas novas são desenhadas por código em canvas: casco cobre/marfim sem a
  pintura e inscrições originais, pavimento com linhas verdes, janelas da estação,
  planeta e banner **SQUADOS / ORBITAL 01**. São novos desenhos; os rasters originais
  permanecem preservados, sem edição, e não são os mapas usados nos materiais novos.
- A geometria original de nave/pista/edifícios é reutilizada. Física, colisão,
  checkpoints, aceleradores, câmera e efeitos continuam nativos; apenas materiais,
  iluminação e o último passe visual mudam. O contorno hexagonal antigo dá lugar
  ao passe `screen`, e o bloom nativo fica mais suave.
- `assets/emblem.svg`: emblema vetorial próprio usado também como favicon.
- `index.html`, `launch.js`, `css/demo.css`: nome e título PT/EN, tela de loading,
  resultado, instrumentos próprios de volta/tempo/velocidade/escudo e link discreto
  ao índice com `../?lang=pt-BR` ou `../?lang=en`, preservando o idioma. O canvas do HUD upstream é preservado, porém fica oculto; os
  mesmos estados da corrida alimentam os instrumentos HTML novos.
- `qa/verify-identity.mjs`: verificação headless da apresentação, mecânica e fluxos
  afetados. `qa/evidence-identity.json` e capturas de estados registram a execução.
- `preview.png`: substituída por captura atual da Corrida Espacial em movimento.

Os rótulos HexGL/Cityscape foram retirados das superfícies do produto (título,
loading, banner e instrumentos). **HexGL por BKcore** permanece explícito nos
créditos, nesta documentação, nos cabeçalhos e na proveniência. Os avisos legais,
`LICENSE`, `audio/LICENSE` e `README.upstream.md` permanecem preservados. Renomear
ou criar a arte procedural não autoriza relicenciar as partes herdadas.

## Execução e evidência

Veja [README.md](README.md) para execução estática e [QA.md](QA.md) para o que foi
verificado. `preview.png` é imagem real da corrida em andamento, gerada por browser
headless. Não há dependência obrigatória de domínio externo, conta ou serviço.

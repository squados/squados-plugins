# Arcade 2D — procedência e identidade

- Jogo público: **Arcade 2D**, em inglês **2D Arcade**; pasta técnica `clumsy-bird` preservada.
- Mecânica de origem: [ellisonleao/clumsy-bird](https://github.com/ellisonleao/clumsy-bird).
- Commit copiado: [`fae3d487d5102af29fb3f78431cbd45e9b83aed3`](https://github.com/ellisonleao/clumsy-bird/tree/fae3d487d5102af29fb3f78431cbd45e9b83aed3).
- Autor original: Ellison Leão; seus créditos em `humans.txt` foram mantidos.
- Engine: melonJS 4.0.0, `js/melonJS-min.js` copiado sem mudanças.
- Adaptação, arte e interface SquadOS: 15/10/2026. O clone de origem permaneceu intacto.

## Identidade visual original

A identidade nova usa um robô voador creme/coral, um núcleo verde profundo, terminais de energia iluminados e uma cidade solar com montanhas, arquitetura e plataforma em camadas. Não são filtros aplicados ao pássaro ou aos canos originais.

| Arquivo original SquadOS | Dimensões | Uso |
| --- | --- | --- |
| `data/art/robot.svg` | 255 × 60 | Robô e três quadros de 85 × 60 com propulsor variável |
| `data/art/skyline.svg` | 900 × 600 | Céu, sol, montanhas e cidade em camadas |
| `data/art/portal.svg` | 148 × 1664 | Pilares de energia com terminal coral; inversão nativa no inferior |
| `data/art/runway.svg` | 900 × 96 | Plataforma e piso modular em movimento |
| `data/art/marker.svg` | 148 × 60 | Gatilho de pontuação invisível, substituindo a imagem antiga |
| `data/art/robot-badge.svg` | 96 × 96 | Ilustração no resultado |
| `data/art/icon.svg` | 64 × 64 | Favicon e marca no cabeçalho |

Esses sete SVGs foram criados em código pelo SquadOS para esta adaptação e são distribuídos sob **GPL-3.0-only**. São arquivos locais, sem imagens, fontes, scripts, referências remotas ou serviços externos incorporados. O loader da engine cria `Image`, atribui `src` e desenha com `drawImage`, permitindo SVG sem extensão de engine. Dimensões efetivas foram conferidas em Chromium. A opção nativa `antiAlias: true` suaviza o desenho vetorial; resolução lógica, atlas, animações e colisores mantêm os tamanhos da mecânica anterior.

O HUD agora mostra portais em uma faixa legível, junto do nome e do retorno ao índice. O resultado usa um cartão próprio com robô, pontuação, recorde e reinício, sem o letreiro “Game Over” antigo. Nome, loading, controles e resultados têm PT-BR/EN.

## Licenças e conteúdo herdado

`LICENSE.md` upstream contém GNU GPL versão 3 e permanece byte a byte igual. O `package.json` original declarava MIT e apontava outro caminho de licença; esse metadado inconsistente foi corrigido na cópia para `GPL-3.0-only`, sem interpretar a inconsistência como autorização MIT. A licença MIT da raiz do catálogo não relicencia o jogo, a adaptação ou a arte.

melonJS permanece sem mudanças, com seus avisos de autoria e componentes internos. O texto [MIT da tag 4.0.0](https://github.com/melonjs/melonJS/blob/4.0.0/MIT-LICENSE) acompanha o pacote em `LICENSE-melonJS.txt`.

Continuam usados do upstream: código base da mecânica, engine e sons `theme`, `wing`, `hit` e `lose` em MP3/OGG. Os antigos PNGs em `data/img/` e a fonte `data/css/gamefont.woff` permanecem no pacote como recursos legados, mas não são carregados pela cena/interface atual. Não houve remoção de arquivos legais ou do clone original.

O upstream não traz um inventário separado de titulares/licenças de cada som ou asset legado. Sua presença no repositório não comprova direitos independentes sobre cada recurso nem autorização do titular de Flappy Bird. A arte nova SquadOS não muda os direitos sobre engine, mecânica ou sons herdados; a documentação preserva a licença disponível sem afirmar liberação mais ampla.

## Mecânica e correções preservadas

A entrada continua diretamente em PLAY, sem menu nem início automático. O robô aguarda sem gravidade até o primeiro comando, que inicia e aciona o propulsor. Mantidos física, shapes de colisão, atlas de 85 × 60, intervalo e abertura dos obstáculos, pontuação e retorno direto à nova rodada.

Foram preservadas as correções anteriores: fila de comandos curtos entre frames, um HUD por rodada, `newHiScore`, parada de geração/gatilhos na queda e ausência de resposta física do gatilho de pontos. O loading usa uma cena simples nativa para evitar o `CanvasTextAlign` inválido do loader legado.

O áudio mantém a correção revisada: `beginFlight` inicia uma única música em loop no primeiro comando, mesmo sob mute global. A API vendorizada mostra que `me.audio.disable()` chama `Howler.mute(true)` e não bloqueia `play()`. Reativar o som apenas remove mute e não cria outra reprodução.

Sem `.git`, Grunt, bundle antigo, deploy Heroku, backend, login ou chamadas externas obrigatórias. Fontes JS editáveis carregam diretamente; não há build para jogar.

## Verificação da identidade atual

`npm run check` passou. Chromium real headless, com Playwright já instalado no Desktop, reutilizou `http://127.0.0.1:4387/clumsy-bird/`. O contrato de identidade falhou primeiro sobre a demo anterior com o título “Clumsy Bird”; depois confirmou “Arcade 2D” e os quatro SVGs principais com dimensões corretas.

O teste funcional em [QA.json](QA.json) cobre cena segura por 3,5 segundos, título/marca/link, SVGs efetivos, primeiro Espaço curto, queda/chão, reinício pelo botão, mute sem iniciar voo, primeiro clique, dois pontos por comandos reais, sincronização do HUD/resultado, colisão com pilar, reinício por Espaço, nome/interface inglesa e toque em 390 × 844. O controlador lê a cena para escolher comandos, sem mover o robô, alterar pontos, desativar colisão ou substituir física. A evidência registra console, exceções, HTTP, requests falhadas e requests externas.

Cinco checks adicionais de áudio em `QA.json.audioRegression` cobrem início silenciado, reativação do mesmo loop, duas alternâncias conservando um único sound ID, parada no fim e música na rodada seguinte. `preview.png` foi substituído por um frame real da identidade nova durante o voo, com pontuação.

A revisão encontrou e corrigiu o Espaço consumido pelo jogo quando o botão de som
estava focado; os controles agora preservam a ativação nativa por Espaço/Enter e
um clique no canvas devolve o foco ao jogo. Também corrigimos o resultado cortado
em landscape baixo: há layout compacto e rolagem própria, com reinício clicável
em 568 × 320 e 844 × 390. O retorno ao índice preserva o idioma explícito. A tecla
M combina uma fila do evento nativo com o consumo do lock `isKeyPressed` por
frame: comandos curtos não se perdem e os eventos repetidos da tecla mantida não
alternam o som novamente. Sete checks focados em `QA.json.uiRegression` passaram,
incluindo comandos curtos e uma tecla mantida com dois eventos reais de repeat.

Limites: áudio não foi escutado; touch é emulado no Chromium. Firefox/Safari, hardware touch, instalação no Studio, hospedagem pública e publicação não foram exercitados. O servidor 4387 existente foi reutilizado e pertence ao coordenador. Integração central, revisão independente e commit ficam sob responsabilidade do coordenador; sem push/deploy nesta adaptação.

# Procedência e adaptação

- Origem: [ellisonleao/clumsy-bird](https://github.com/ellisonleao/clumsy-bird).
- Commit copiado: [`fae3d487d5102af29fb3f78431cbd45e9b83aed3`](https://github.com/ellisonleao/clumsy-bird/tree/fae3d487d5102af29fb3f78431cbd45e9b83aed3).
- Autor original: Ellison Leão; `humans.txt` preservado.
- Engine vendorizada: melonJS 4.0.0, `js/melonJS-min.js` copiado sem mudanças.
- Adaptação SquadOS: 15/10/2026. O clone de origem permaneceu intacto.

## Licenças e conteúdo herdado

`LICENSE.md` upstream contém GNU GPL versão 3 e foi preservado byte a byte. O `package.json` upstream declarava MIT e apontava para outro caminho de licença; essa inconsistência é registrada aqui, sem reinterpretá-la como autorização MIT. O metadado desta cópia usa `GPL-3.0-only` de forma conservadora. A licença MIT do repositório pai não relicencia este jogo.

O cabeçalho de melonJS declara MIT; preservamos o arquivo integral e incluímos [o texto MIT da tag 4.0.0](https://github.com/melonjs/melonJS/blob/4.0.0/MIT-LICENSE) em `LICENSE-melonJS.txt`. O bundle também conserva seus avisos internos de componentes incorporados.

Sprites, fundos, fonte e sons são os arquivos distribuídos naquele commit, sem redesenho nem origem externa acrescentada. O upstream não traz um inventário separado de titulares/licenças de cada asset; a presença no repositório não comprova direitos independentes sobre cada imagem ou som nem autorização do titular de Flappy Bird. Esta cópia preserva a documentação e a licença disponíveis, sem afirmar uma liberação mais ampla.

## Mudanças

1. `index.html` carrega diretamente os fontes editáveis. Removidos título, menu, redes sociais, metadados de publicação, bundle antigo e deploy Heroku. Não foram copiados `.git`, Grunt, dependências de desenvolvimento ou imagens de telas removidas.
2. A primeira cena já é PLAY. Eliminado o início automático após o fade de dois segundos. Gravidade, canos e pontuação só começam com o primeiro comando; esse mesmo comando bate asas.
3. O fim da rodada volta diretamente à cena jogável. Incluídos botão de reinício, instruções PT-BR/EN, botão de som e texto de placar traduzido. Preservados sprites, fundo, proporção, física de voo e colisores originais.
4. Comandos curtos ficam pendentes até o próximo frame, para não perder clique/toque/tecla entre frames. Corrigidos HUD persistente que acumulava no reinício, diferença `newHiscore/newHiScore`, medição de texto inexistente no fim de jogo, canos/gatilhos que continuavam durante a queda e resposta física indevida do gatilho de pontuação.
5. O loader usa uma cena simples da própria engine: o loader padrão de melonJS 4 enviava `middle` a `CanvasTextAlign` e gerava avisos no Chromium atual. A engine vendorizada permanece sem patch.
6. Foram mantidos MP3/OGG e somente WOFF para a fonte; removidos formatos antigos de fonte, WAV duplicado e placeholders. Não há chamadas externas obrigatórias durante o jogo.
7. Após revisão independente, corrigido o início com som silenciado: a música passa a iniciar uma única vez no primeiro comando de voo, respeitando o mute global de Howler. Reativar o som torna o loop existente audível, sem criar outra reprodução. A API vendorizada confirma que `me.audio.disable()` chama `Howler.mute(true)` e não bloqueia `me.audio.play()`.

## Verificação realizada

Em 15/10/2026, `npm run check` passou. Chromium real em modo headless, usando Playwright já instalado no Desktop, executou a rota HTTP `/games/clumsy-bird/` sob a porta temporária 4390. O mesmo contrato inicial falhou antes da adaptação porque o upstream abria MENU.

Os checks finais em [QA.json](QA.json) cobrem espera segura de 3,5 segundos, primeiro Espaço curto, queda/chão, reinício por botão, som sem disparar voo, clique curto, voo com dois pontos por teclado real, colisão com cano, reinício por Espaço, inglês e toque em viewport 390 × 844. O controlador de teste lê a cena para escolher os comandos, sem mover o pássaro, alterar pontuação, desativar colisão ou substituir física. O resultado inclui zero erros/avisos de console, zero exceções, zero HTTP 4xx/5xx, zero requests falhadas e zero requests externas. `preview.png` é um frame real durante o voo, com pontuação.

A revisão de áudio reproduziu primeiro a falha `PLAY parado → silenciar → Espaço → reativar`, na qual `theme.playing()` permanecia falso. Após a correção, cinco checks focados passaram: voo silenciado com mute global ativo, reativação do mesmo loop, duas alternâncias adicionais conservando um único sound ID, interrupção no fim da rodada e um único loop na rodada seguinte. A evidência está em `QA.json.audioRegression`, sem avisos/erros de console, exceções ou falhas HTTP/rede. `npm run check` passou novamente após essa alteração. A engine permanece sem mudanças.

Limites: o navegador não foi aberto visivelmente; a audibilidade dos sons não foi escutada e hardware touch real não foi exercitado. O teste mobile usa emulação de toque do Chromium. Firefox/Safari, instalação no Studio, hospedagem pública e publicação não foram executados. Servidor temporário encerrado após a validação. A integração no índice compartilhado e o commit ficam a cargo do coordenador.

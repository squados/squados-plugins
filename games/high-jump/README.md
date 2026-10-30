# Pulo Alto

Um jogo de plataforma 2D de uma fase, no estilo dos clássicos de pular e correr. **Pulo Alto** (**High Jump** em inglês) atravessa uma colina com buracos, degraus, blocos de moeda e slimes até a bandeira de chegada. Feito em Canvas 2D puro, com sprites e sons do [New Platformer Pack](https://kenney.nl/assets/new-platformer-pack) da [Kenney](https://kenney.nl/) (CC0).

- **← →** ou **A D** andam; **Espaço**, **↑**, **W** ou **Z** pulam (segurar pula mais alto).
- Bata a cabeça nos blocos amarelos para ganhar moedas; pule em cima dos slimes para derrotá-los.
- Encostar de lado em um slime ou cair em um buraco custa um coração; sem corações, a fase recomeça.
- **P** pausa; **Enter** ou o botão começa e retoma. Em telas de toque aparecem botões na tela.
- A interface está em português.

## Executar

Não há build nem dependências: abra `index.html` servido por HTTP (por exemplo, `npm start` na pasta `games/`) ou diretamente pelo navegador. Tudo é carregado por caminhos relativos a partir de `assets/`.

## Como replicar e modificar

O jogo inteiro são três arquivos de texto:

| Arquivo | O que muda nele |
| --- | --- |
| `level.js` | O mapa da fase, desenhado com caracteres. A legenda está no topo do arquivo: `#` terreno, `=` plataforma, `B` tijolo, `?` bloco de moeda, `o` moeda, `s` slime, `P` início e `F` bandeira. |
| `game.js` | Física e regras. As constantes do topo (gravidade, velocidade, altura do pulo, corações) ajustam a sensação do jogo; a lista `SPRITES` diz quais imagens carregar. |
| `index.html` | Tela, título, textos das janelas e botões de toque. |

Para trocar o personagem, substitua os arquivos `character_green_*` em `assets/sprites/` por outra cor do pacote Kenney (beige, pink, purple, yellow) com o mesmo nome, ou troque o prefixo em `game.js`. Para uma nova fase, copie a pasta inteira e edite somente `level.js`; mantenha 12 linhas no mapa.

## Verificação

Verificado em 30/10/2026 no Chromium headless (Playwright) servindo a pasta por HTTP: carregou sem erros de console, de página ou de rede; teclado real iniciou, moveu, pulou, pausou e retomou; os seis sons carregaram. Por script, foram exercitados bloco de moeda, pisão no slime, dano lateral, queda no buraco com volta ao último ponto seguro, fim de jogo e chegada à bandeira (fase completada de ponta a ponta). Som não foi conferido de ouvido; toque foi conferido apenas no código; Safari, Firefox e aparelhos físicos não foram testados.

## Licença e créditos

Código e interface: [MIT](LICENSE), SquadOS. Sprites e sons: Kenney, New Platformer Pack 1.1, [CC0](LICENSE-Kenney.txt).

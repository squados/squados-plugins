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
| `level.js` | O mapa da fase, desenhado com caracteres. A legenda está no topo do arquivo: `#` terreno, `=` plataforma, `B` tijolo, `?` bloco de moeda, `o` moeda, `s` inimigo, `P` início e `F` bandeira. |
| `game.js` | O tema (`THEME`) e as regras. As constantes do topo ajustam gravidade, velocidade, altura do pulo e corações. |
| `index.html` | Tela, título, textos das janelas e botões de toque. |

Para uma nova fase, copie a pasta inteira e edite somente `level.js`; mantenha 12 linhas no mapa.

## Personalizar: kit de assets

`assets/` traz o New Platformer Pack inteiro, não só o que a fase usa, para que cada cópia do jogo possa mudar de cara sem buscar arquivos em outro lugar:

| Pasta | Conteúdo |
| --- | --- |
| `assets/sprites/characters/` | 5 personagens (beige, green, pink, purple, yellow) em 9 poses, PNG 128×128 |
| `assets/sprites/enemies/` | 60 quadros de inimigos (slimes, abelha, mosca, rato, sapo, joaninha, caracol, peixes, minhoca, serra…), PNG 64×64 |
| `assets/sprites/tiles/` | 314 blocos e itens: 6 terrenos (grass, dirt, purple, sand, snow, stone), gemas, estrela, coração, chaves, molas, placas, lava, água, HUD |
| `assets/sprites/backgrounds/` | Céu, nuvens e 4 paisagens (desert, hills, mushrooms, trees) |
| `assets/vector/` | Os mesmos personagens e inimigos em SVG, para editar cores e formas |
| `assets/sounds/` | 10 efeitos sonoros |
| `assets/catalog-*.png` | Folhas de referência da Kenney para escolher peças de olho |

A troca de tema é feita no objeto `THEME`, no topo de `game.js`:

```js
const THEME = {
  character: 'pink',     // beige, green, pink, purple, yellow ou um nome próprio
  terrain: 'purple',     // grass, dirt, purple, sand, snow, stone
  background: 'mushrooms', // desert, hills, mushrooms, trees
  enemy: { walk: ['mouse_walk_a', 'mouse_walk_b'], defeated: 'mouse_rest' },
  coin: 'gem_red',       // qualquer item 64×64 de tiles/: gem_blue, star, heart…
};
```

### Personagem próprio (uma pessoa, um bicho, um unicórnio)

O pacote Kenney não tem pessoas nem unicórnios: esses personagens precisam ser desenhados ou gerados. Para entrar no jogo sem mudar código, siga o mesmo formato dos personagens Kenney:

1. **Cinco imagens obrigatórias**, com o nome `character_<nome>_<pose>.png` em `assets/sprites/characters/`: `idle` (parado), `walk_a` e `walk_b` (dois passos alternados), `jump` (no ar) e `hit` (machucado, usado no fim de jogo). Use `<nome>` em minúsculas, sem espaços nem acentos, por exemplo `character_ana_idle.png`.
2. **Formato:** PNG 128×128 com fundo transparente, olhando para a **direita**, pés encostados na borda de baixo e corpo centralizado, com cerca de 80 px de largura e 95 px de altura. O jogo desenha em 75% e espelha sozinho ao andar para a esquerda.
3. **Estilo Kenney:** formas arredondadas e simples, cores chapadas, contorno escuro grosso (#353541) e sombra leve. Use `character_*_idle.png`, os SVGs de `assets/vector/characters/` e `assets/catalog-characters.png` como referência visual.
4. Em `game.js`, troque `THEME.character` para o `<nome>`.

Inimigos e itens próprios seguem a mesma ideia em 64×64: um unicórnio inimigo precisa de dois quadros andando e um derrotado em `assets/sprites/enemies/` (olhando para a **esquerda**, como os da Kenney), apontados em `THEME.enemy`; um unicórnio colecionável é uma imagem 64×64 em `assets/sprites/tiles/`, apontada em `THEME.coin`. Imagens novas devem ficar na pasta da sua categoria; se faltar um arquivo, o jogo mostra o caminho ausente na tela inicial.

## Verificação

Verificado em 30/10/2026 no Chromium headless (Playwright) servindo a pasta por HTTP: carregou sem erros de console, de página ou de rede; teclado real iniciou, moveu, pulou, pausou e retomou; os seis sons carregaram. A troca de `THEME` foi conferida com personagem rosa, terreno roxo, fundo de cogumelos, rato como inimigo e gema como moeda, também sem erros. Por script, foram exercitados bloco de moeda, pisão no slime, dano lateral, queda no buraco com volta ao último ponto seguro, fim de jogo e chegada à bandeira (fase completada de ponta a ponta). Som não foi conferido de ouvido; toque foi conferido apenas no código; Safari, Firefox e aparelhos físicos não foram testados.

## Licença e créditos

Código e interface: [MIT](LICENSE), SquadOS. Sprites, vetores, folhas de referência e sons: Kenney, New Platformer Pack 1.1, [CC0](LICENSE-Kenney.txt).

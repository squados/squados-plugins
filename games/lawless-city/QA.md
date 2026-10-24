# Cidade Sem Lei — Relatório

## 1. Como rodar

Na pasta do projeto, rode:

```bash
npm install && npm start
```

O comando instala as dependências (Three.js e Vite), sobe o servidor local na porta **5199** e abre o jogo no navegador padrão. O endereço é http://localhost:5199/. Use o Chrome para desktop.

> A porta 5199 é fixa (`--strictPort`). Se outro programa estiver usando essa porta, o Vite avisa e não troca de porta sem avisar.

**Controles**
- A pé: `WASD` corre, o mouse gira a câmera, `Clique` ou `Espaço` atira para a frente do personagem, `E` entra no carro ou rouba um carro.
- No carro: `W` acelera, `S` freia e dá ré, `A`/`D` esterçam, `Espaço` puxa o freio de mão, `H` toca a buzina, `E` sai do carro.
- `P` ou `Esc` pausa o jogo. `Enter` ou um clique começa e retoma.

## 2. Situação dos critérios

**Como verifiquei.** Abri o jogo no **Chrome de verdade** (versão desktop instalada, modo headless com GPU, 1280×720), controlado por scripts do Puppeteer. Os scripts apertam as teclas como um jogador, leem o estado interno do jogo (posições, velocidades, estados dos pedestres e fps), capturam o console e tiram screenshots. Revisei as screenshots com análise de imagem. Não deu para **ouvir** os sons nem testar o **mouse com o ponteiro travado** (pointer lock), porque esse modo não funciona em headless. Esses dois pontos foram conferidos no código e pela ausência de erros.

| ID | Situação | Como foi verificado |
|---|---|---|
| C01 | ✅ | Testei no navegador: carregamento completo, nenhum erro no console nem `pageerror` em várias sessões. O `npm run build` também passa. |
| C02 | ✅ | Testei no navegador: a tela inicial mostra os controles, `Enter` inicia (estado `play`), `P` pausa (estado `pause`, tela "PAUSADO" com os controles) e `Enter` retoma. O clique também funciona, pelo código. |
| C03 | ✅ | Testei no navegador (screenshots aéreas e de rua): uma grade de 4×4 quarteirões com ruas conectadas, cruzamentos com faixa de pedestre, calçadas e prédios. Teste numérico: o personagem e um carro acelerado contra a borda param no muro (o carro parou em x = 130,3, com o muro em 132,5). Há também uma trava de segurança no código. |
| C04 | ✅ | Testei no navegador: com `W` a animação é de corrida e o personagem anda; ao soltar, fica parado (`idle`). Ele gira para a direção do movimento. Corri 3 s em quatro direções saindo de uma esquina e ele nunca terminou dentro de um prédio. |
| C05 | ✅ | Testei no navegador (screenshots a pé): a câmera fica atrás e acima do personagem, suavizada, e se aproxima ao bater numa parede para não perder o personagem de vista. O giro pelo mouse foi verificado no código. |
| C06 | ✅ | Testei no navegador: numa vista lateral, a pistola aparece presa à mão direita, com o cano para a frente. O tiro gera clarão, rastro e fumaça. O som é sintetizado e foi verificado no código. |
| C07 | ✅ | Testei no navegador: o pedestre atingido cai (sai do estado `walk`). Tiros em superfícies geram faíscas e marca de bala, pelo código e pelas screenshots de tiro. |
| C08 | ✅ | Testei no navegador: 42 pedestres com 12 modelos diferentes andam pelas calçadas. Depois dos tiros, vários passam ao estado `flee` (fuga). |
| C09 | ✅ | Testei no navegador: com `E` perto de um carro estacionado, o personagem entra, com dica na tela. Com `E` de novo, ele sai pelo lado livre. |
| C10 | ✅ | Testei no navegador: ao roubar um SUV do tráfego, o motorista surgiu fora do carro em estado `flee` e correu cerca de 11 m em 1,5 s. |
| C11 | ✅ | Testei no navegador: parado e sem acelerar, o motor fica em marcha lenta (rpm 0,08 e velocidade 0). `W` levou a velocidade a 13,9 m/s. `S` freou e deu ré (−7,4 m/s). `A`/`D` mudam a direção. O giro das rodas acompanha o movimento (o contador de rotação sobe com a distância). |
| C12 | ✅ | Testei no navegador: um carro acelerado contra prédios em quatro direções nunca entrou no prédio e ganhou dano. Contra um carro parado, bateu e empurrou o outro, sem atravessá-lo (distância final de 5,1 m, mínima de 4,6 m). |
| C13 | ✅ | Testei no navegador (screenshots dirigindo, em curva e em ré): a câmera fica atrás do carro, nivelada e estável, e o carro sempre aparece na tela. |
| C14 | ✅ | Testei no navegador: o pedestre atropelado a cerca de 17 m/s entrou em estado `fly` e subiu cerca de 1,5 m, com nuvem de poeira e estrela de impacto. Pelo código, abaixo de 5 m/s ele só cai e, acima disso, o impulso cresce com a velocidade. Depois de derrubar todos os pedestres e esperar 12 s, havia 42 pedestres e 40 de pé (eles se levantam ou são repostos fora da vista). O tráfego também é reposto. |
| C15 | ✅ | Testei no navegador: os carros da IA circulam pelas faixas da direita e fazem curvas nos cruzamentos (vistos nas screenshots aéreas). Com um carro parado posto à frente, uma van a 7,8 m/s freou até parar a cerca de 6,6 m do obstáculo e ficou parada. |
| C16 | ⚠️ | Verifiquei no código e sem erros de áudio no navegador, mas **não ouvi**. Tiro, motor (a altura e o volume seguem a rotação e a velocidade), buzina, freio, batidas e atropelos têm som, sintetizado pelo WebAudio ou tirado das amostras da Kenney. Marquei como parcial só por não ter sido verificado de ouvido. |
| C17 | ✅ | Testei no navegador: a legenda de controles fica no canto e muda entre a pé e no carro. As dicas contextuais aparecem, como "Corra com WASD…", "aperte E" perto de um carro e as instruções de direção ao entrar. O velocímetro em km/h só aparece no carro. |
| C18 | ✅ | Testei no navegador: 93 a 95 fps medidos durante todo o teste (a pé, dirigindo, com batidas e atropelos), em 1280×720 com sombras ligadas. Em outras máquinas, o valor depende da placa de vídeo. |
| C19 | ✅ | Testei no navegador: as escalas foram calibradas em metros (pessoa ~1,75 m, sedã ~4,5 m, rua de 15 m, calçada de 5 m). Uma varredura da cena não encontrou objetos estáticos flutuando; as únicas malhas acima do chão eram portas de carro, o que é normal. Nas screenshots, os personagens, carros, árvores e postes estão apoiados no chão. |

## 3. Assets escolhidos (Kenney, CC0)

| Pacote | Uso | Por quê |
|---|---|---|
| **Mini Characters** (12 personagens) | Jogador (`character-male-e`) e pedestres | São low-poly e cartunescos e já vêm com animações (`idle`, `sprint`, `holding-right`, `holding-right-shoot`, `drive`, `die`). Os 12 modelos dão variedade às calçadas. |
| **Car Kit** | 11 veículos (sedã, táxi, polícia, SUVs, van, esportivos, entrega, caminhão, ambulância) e destroços (para-choque, pneu, porta, placas) | O estilo combina com os personagens. As rodas vêm separadas, o que permite girá-las e esterçá-las. Os destroços deixam as batidas mais divertidas. |
| **City Kit - Commercial** | Prédios, arranha-céus e prédios de fundo em baixo detalhe | Dão fachadas variadas com a mesma paleta. Os prédios de fundo preenchem o horizonte sem pesar. |
| **City Kit - Roads** | Postes de luz | Combinam com a escala da rua. O asfalto, as calçadas e as faixas são gerados por código para formar uma grade contínua e leve. |
| **City Kit - Suburban** | Árvores e floreiras | Dão verde e vida às calçadas. |
| **Weapon Pack** | Pistola | É uma pistola simples e legível na mão de um personagem pequeno. |
| **Impact Sounds** | Passos, impactos de metal, soco e plástico | Usados nas batidas, nos atropelos e na queda de objetos. |
| **RPG Audio / Foley Sounds** | Trinco e porta, tecido, woosh | Usados ao entrar e sair do carro e quando um pedestre é arremessado. |

**Gerado por código:** asfalto, calçadas, faixas, muro e grama (texturas desenhadas em canvas), céu em degradê, neblina, partículas (clarão, fumaça, faíscas, poeira, estrelas), textos "POW!" e "CRASH!", e os sons de tiro, motor, buzina, freio e gritos (WebAudio).

## 4. Bugs e limitações conhecidos

- **Som e mouse não verificados de ouvido nem com a mão**: os testes rodaram num Chrome automatizado. O áudio só começa depois do primeiro clique ou tecla, como manda o Chrome.
- **Câmera pelo mouse**: o mouse fica preso à janela (pointer lock) depois do clique de início. `Esc` solta o mouse e pausa o jogo.
- **Física arcade**: os carros não capotam e não há deformação. O "dano" aparece como fumaça e destroços.
- **Tráfego simples**: não há semáforos. Os carros da IA freiam diante de obstáculos, mas podem ficar parados atrás de um carro largado no meio da rua até ele ser empurrado ou o jogador sair de perto. Em batidas, a IA buzina e às vezes desvia de forma brusca.
- **Pedestres**: andam por uma rede de calçadas e cruzam a rua só nas faixas. Ao fugir, podem atravessar a rua fora da faixa.
- **Tamanho do mapa**: a cidade é pequena (cerca de 265 m × 265 m), pensada para a experiência de cerca de 1 minuto. O limite é um muro.
- **Aviso no build** (não é erro): o pacote JavaScript passa de 500 kB por causa do Three.js. Isso não afeta o `npm start`.

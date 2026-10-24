# Cidade Sem Lei

Uma cidade 3D aberta, sem regras e sem missões. **Cidade Sem Lei** (**Lawless City** em inglês) é um jogo de ação em terceira pessoa no navegador: corra pelas calçadas, roube um carro, dirija pelo tráfego e veja os pedestres reagirem. Escrito sobre [Three.js](https://threejs.org/), com modelos e sons da [Kenney](https://kenney.nl/) (CC0).

- A pé: **WASD** corre, o mouse gira a câmera, **clique** ou **Espaço** atira, **E** entra ou rouba um carro.
- No carro: **W** acelera, **S** freia e dá ré, **A/D** esterçam, **Espaço** puxa o freio de mão, **H** buzina, **E** sai.
- **P** ou **Esc** pausa; **Enter** ou um clique começa e retoma.
- A interface está em português.

## Executar

O jogo pronto fica em [play/index.html](play/index.html) e lê os modelos e sons de `public/assets/` por caminhos relativos. Sirva a pasta do pacote por HTTP; não é preciso instalar nada para jogar.

Para editar, a partir desta pasta:

```powershell
npm ci
npm start      # desenvolvimento em http://localhost:5199/
npm run build  # regrava play/
```

As fontes estão em `src/` e `index.html`. Depois de mudar o código, rode `npm run build` para atualizar `play/`.

## Dentro do Studio

Em Nova conversa → Jogos, **Jogar demo** abre `play/index.html` dentro do Studio. Ali o mouse não fica preso à janela (pointer lock), então a câmera não gira pelo mouse; teclado, tiro pelo clique, carros e pausa funcionam. **Esc** fecha a demo.

## Verificação

[QA.md](QA.md) é o relatório original dos 19 critérios, verificado no Chrome com Puppeteer. A versão `play/` foi aberta em Chromium headless com a mesma política de conteúdo da demo do Studio: carregou, iniciou e correu sem erros de console, de página ou de rede. Som e mouse com ponteiro preso não foram verificados de ouvido nem à mão.

## Licença e créditos

Código e interface: [MIT](LICENSE), SquadOS. Three.js: [MIT](LICENSE-three.txt). Modelos 3D e sons: Kenney, [CC0](LICENSE-Kenney.txt) — pacotes Mini Characters, Car Kit, City Kit (Commercial, Roads, Suburban), Weapon Pack, Impact Sounds e RPG Audio/Foley. Asfalto, calçadas, céu, partículas e os sons de tiro, motor, buzina e freio são gerados por código.

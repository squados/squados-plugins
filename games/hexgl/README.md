# Corrida Espacial / Space Racing

Experiência de corrida com identidade visual do SquadOS, derivada de
[HexGL, de BKcore](https://github.com/BKcore/HexGL). Abre diretamente na estação
**Orbital 01**, com contagem de três segundos, planetas, estrelas e uma nave de
pintura cobre e marfim. O cenário noturno, os materiais procedurais, os
instrumentos, o emblema e a interface são a contribuição visual desta adaptação.
Geometria, física, colisão, escudo, checkpoints e três voltas vêm do HexGL.

**Licenças mistas:** arquivos centrais declaram **CC BY-NC 3.0**, apesar do MIT
geral upstream. O novo nome e a nova apresentação não removem as restrições da
obra derivada. Leia [UPSTREAM.md](UPSTREAM.md), [LICENSE](LICENSE) e
[audio/LICENSE](audio/LICENSE). Não houve publicação desta adaptação.

## Jogar

- `↑`: acelerar. `←` e `→`: direção.
- `A` / `Q` e `D` / `E`: freios laterais.
- `R`, `Esc` ou **Reiniciar**: nova corrida com contagem.
- Complete três voltas sem esgotar o escudo. O resultado permite correr novamente.
- O som começa desligado. **Som** libera ou desliga o áudio, sem bloquear o jogo.
- **EN** / **PT** troca o idioma; `?lang=en` abre como **Space Racing**.
- Em telas de toque, os botões `←`, `→` e `↑` oferecem direção e aceleração.
- **Jogos** volta ao índice local preservando o idioma; os créditos do HexGL continuam no rodapé.

## Execução

Conteúdo estático, sem build, login, ranking remoto ou backend. Sirva por HTTP(S):
os carregadores originais usam XHR para geometria e áudio, portanto `file://` não
é suportado. O servidor compartilhado está em `games/package.json`; da raiz:

```powershell
npm --prefix games start
```

A preparação das dependências do servidor usa `npm --prefix games install`.
O caminho local é `http://127.0.0.1:4387/hexgl/`. Quando o repositório é servido
pela raiz, o caminho é `/games/hexgl/`. O diretório e a URL técnica foram
preservados. Scripts e recursos são relativos e locais.

Requer navegador com WebGL e aceleração gráfica. Não há painel de qualidade.
O renderer Three.js 50dev, seus loaders e a física original foram preservados.
`space-racing.js` acrescenta uma esfera de céu, 1.400 estrelas, um planeta anelado,
uma lua, materiais e texturas gerados por código e instrumentos próprios em HTML.
O emblema `assets/emblem.svg` também é código vetorial próprio; nenhum raster
original foi editado e nenhuma biblioteca foi substituída.

## Verificação

[QA.md](QA.md) registra os testes da identidade atual. `preview.png` é captura
real da nave acelerando e virando com a cena espacial. O script
`qa/verify-identity.mjs` usa o servidor 4387 existente e Playwright headless do
Desktop; não inicia servidor nem abre janela. O relatório distingue controles
reais dos fixtures de chegada e destruição, e não declara pilotagem de três voltas.

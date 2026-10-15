# HexGL · Cityscape

Demo local de corrida adaptada de [HexGL, de BKcore](https://github.com/BKcore/HexGL).
Abre diretamente na pista Cityscape, carrega os recursos locais e inicia a contagem
regressiva. A nave, a física, a colisão, as três voltas e o visual são do jogo original.

**Licenças mistas:** o README upstream declara MIT salvo exceções, mas os arquivos
centrais do jogo especificam **CC BY-NC 3.0**. Esta pasta não deve ser apresentada
como integralmente MIT nem como pacote elegível para distribuição comercial.
Leia [UPSTREAM.md](UPSTREAM.md), [LICENSE](LICENSE) e [audio/LICENSE](audio/LICENSE).

## Jogar

- `↑`: acelerar. `←` e `→`: direção.
- `A` / `Q` e `D` / `E`: freios laterais.
- `R`, `Esc` ou **Reiniciar**: voltar ao início com uma nova contagem.
- Complete três voltas sem esgotar o escudo. O resultado permite correr novamente.
- **Som** é opcional e começa desligado; o botão libera o áudio por uma ação do usuário.
- **EN** / **PT** troca o idioma. `?lang=en` abre a interface em inglês.
- Em telas de toque, os botões `←`, `→` e `↑` oferecem direção e aceleração.

## Execução

Conteúdo estático, sem etapa de build, login, ranking remoto ou backend. Sirva por
HTTP(S): os carregadores originais usam XHR para geometria e áudio, portanto abrir
`index.html` diretamente com `file://` não é suportado.

O servidor compartilhado das demos está em `games/package.json`. A partir da raiz
do repositório, a preparação usa `npm --prefix games install`; a execução usa:

```powershell
npm --prefix games start
```

O caminho desse servidor é `http://127.0.0.1:4387/hexgl/`. Quando o repositório é
servido pela raiz, o caminho é `/games/hexgl/`. Scripts, fontes, texturas, modelos e
sons usam caminhos relativos e funcionam nos dois casos.

Requer navegador com WebGL e aceleração gráfica. A qualidade alta do HexGL é fixa,
sem painel de configuração. Three.js 50dev e os shaders originais são preservados;
há uma correção pontual de precisão GLSL em `libs/hexgl-compat.js`.

## Verificação e proveniência

[QA.md](QA.md) descreve os cenários exercitados em Chromium headless, as medições,
os limites e os cenários de resultado injetados. `preview.png` é uma captura da
corrida renderizada enquanto acelerava e virava. [UPSTREAM.md](UPSTREAM.md) registra
SHA, créditos, alterações e licenças. O clone de origem permanece intacto.

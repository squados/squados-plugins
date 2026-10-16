# Arcade 2D

Um pequeno robô, uma cidade solar e portais de energia. **Arcade 2D** (**2D Arcade** em inglês) tem arte vetorial original do SquadOS, com identidade creme, coral e verde profundo. A mecânica vem de [Clumsy Bird, de Ellison Leão](https://github.com/ellisonleao/clumsy-bird), sobre a engine melonJS 4.0.0 preservada.

A cena abre diretamente, sem menu. O robô aguarda o primeiro comando para começar o voo.

- Toque, clique ou aperte **Espaço** para acionar o propulsor. **↑** também funciona.
- Atravesse os vãos entre os pilares de energia para pontuar. Colidir com os pilares, chão ou sair pelo teto encerra a rodada.
- Use **Jogar novamente**, toque/clique na cena ou aperte **Espaço/Enter** para voltar à cena. O primeiro comando seguinte inicia o voo.
- O botão de som e **M** alternam o áudio. O primeiro voo inicia um único loop de música; quando silenciado, esse loop permanece sob mute e pode ser reativado durante o voo.
- A interface acompanha o idioma do navegador; `?lang=pt-BR` e `?lang=en` permitem escolher explicitamente. Branding, carregamento, instruções, placar e resultado têm as duas versões.
- **← Jogos / ← Games** retorna ao índice do Playground.

## Executar

Sem build, backend, conta, chave ou instalação de dependências para jogar. Sirva esta pasta por HTTP estático. No conjunto `games`, siga o [README compartilhado](../README.md): o servidor local usa `http://127.0.0.1:4387/clumsy-bird/`. Ao servir a raiz do repositório, a rota é `/games/clumsy-bird/`. A pasta técnica foi mantida para preservar os links existentes.

Scripts, SVGs e sons usam URLs relativas e estão no pacote. A resolução lógica é 900 × 600; o canvas mantém a proporção e fica centralizado em telas estreitas. O recorde usa o armazenamento local da engine.

`npm run check` nesta pasta verifica a sintaxe dos cinco arquivos modificados e usa apenas Node. A arte SVG é carregada diretamente pelo loader nativo, sem rasterização, serviço externo ou dependência adicional. A captura [preview.png](preview.png) é um frame real do jogo atual.

As evidências headless estão em [QA.json](QA.json); origem, alterações e limites em [UPSTREAM.md](UPSTREAM.md).

## Licença e créditos

A mecânica original e esta adaptação preservam a [GPLv3](LICENSE.md), também aplicada aos SVGs originais SquadOS em `data/art/`. A engine melonJS conserva sua [licença MIT própria](LICENSE-melonJS.txt), autoria e avisos. Os sons continuam sendo os distribuídos pelo upstream. A licença MIT da raiz do catálogo não relicencia este pacote; consulte [UPSTREAM.md](UPSTREAM.md) para inventário e ressalvas dos recursos herdados.

# Clumsy Bird

Demo estática adaptada de [Clumsy Bird, de Ellison Leão](https://github.com/ellisonleao/clumsy-bird), preservando a arte e a engine melonJS 4.0.0 do jogo. Abre diretamente na cena jogável: o pássaro aguarda parado até o primeiro comando.

- Toque, clique ou aperte **Espaço** para bater asas. **↑** também funciona.
- Passe entre os canos para pontuar; tocar canos, chão ou sair pelo teto encerra a rodada.
- No fim, use **Jogar novamente**, toque, clique ou aperte **Espaço/Enter** para voltar à cena. O primeiro comando seguinte inicia o voo.
- O botão de som e a tecla **M** alternam o áudio. A música começa com o primeiro voo.
- Os textos próprios acompanham o idioma do navegador; `?lang=pt-BR` e `?lang=en` permitem escolher explicitamente. As imagens originais, incluindo o letreiro “Game Over”, permanecem as do upstream.

## Executar

Não há build, instalação de dependências, backend, conta ou chave para jogar. Sirva esta pasta com um servidor HTTP estático. No conjunto `games`, use as instruções do [README compartilhado](../README.md); a rota esperada é `/games/clumsy-bird/`.

Todos os scripts, imagens, fontes e sons usam URLs relativas e estão no pacote. A resolução lógica original é 900 × 600; o canvas mantém essa proporção e fica centralizado em telas estreitas. O recorde usa o armazenamento local oferecido pela engine.

Para verificar a sintaxe dos cinco arquivos de jogo modificados, execute `npm run check` nesta pasta. Esse script usa apenas Node e não instala Grunt. As evidências do navegador estão em [QA.json](QA.json); detalhes, procedência e limitações estão em [UPSTREAM.md](UPSTREAM.md).

## Licença

O jogo e esta adaptação conservam a [GPLv3 do upstream](LICENSE.md); não são cobertos pela licença MIT da raiz do catálogo. O metadado MIT antigo de `package.json` foi corrigido na cópia para `GPL-3.0-only`, seguindo o arquivo de licença efetivamente distribuído. A engine melonJS conserva sua [licença MIT própria](LICENSE-melonJS.txt) e os avisos embutidos. Consulte [UPSTREAM.md](UPSTREAM.md) para a ressalva sobre os assets herdados.

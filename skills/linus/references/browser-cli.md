# Navegador e Playwright CLI

Use as ferramentas de navegador disponíveis no Studio ou o caminho de teste já
usado pelo projeto. Confira Node/npx e as dependências antes de executar. No Windows
use PowerShell; o wrapper scripts/playwright/playwright_cli.sh exige Bash e é opção
apenas quando esse shell já faz parte do ambiente. Não instale outro harness.

Com Node/npx disponíveis, `npx --yes --package @playwright/cli playwright-cli --help`
mostra o contrato real. Prefira a versão fixada no projeto. Use open, snapshot,
click, fill e screenshot conforme o help da versão disponível; escolha o modo
headless quando não houver necessidade de interação visível.

Obtenha o snapshot atual antes de escolher um elemento. Navegação, mudanças de DOM
ou referências inválidas exigem novo snapshot. Confira o estado depois da ação.
Tracing e capturas ajudam a explicar falhas. Nunca conclua que um fluxo passou
somente porque o comando terminou sem erro. Testes de regressão ficam no runner
existente do projeto; um auxiliar CLI não substitui essa escolha.

Consulte [o catálogo de comandos](playwright/cli.md) e adapte exemplos ao shell e
à ferramenta efetivamente disponíveis. Não peça à pessoa para executar comandos.

# Código, arquitetura e Git

Comece pelo comportamento solicitado e pelos contratos existentes. Localize entrada, transformação, persistência e saída antes de editar. Preserve trabalho paralelo e instruções locais. Uma inspeção estrutural deve registrar arquivos, relações e evidência, sem inventar arquitetura a partir de nomes.

Separe implementação, verificação, integração e publicação. Use os checks nomeados do projeto e teste o fluxo alterado; um teste que lê o disco não prova que o commit contém seus fornecedores. Em conflitos, preserve as intenções dos dois lados e verifique o comportamento integrado. Não crie worktree, branch, push ou deploy por hábito quando o projeto define outro fluxo.

# GitHub no projeto

Use a CLI gh já autenticada, mantendo conta, host e escopo. Ela fornece operações
REST/GraphQL via gh api quando não houver comando específico. Não manipule tokens
com curl nem importe helpers/configurações de outro perfil.

Leia somente o método da tarefa:

- [Autenticação](github/auth.md)
- [Issues](github/issues.md)
- [Pull requests e CI](github/pr-workflow.md)
- [Da issue à entrega](github/issue-to-pr.md)
- [Revisão de código](github/code-review.md)
- [Repositórios e releases](github/repo-management.md)
- [Diagnóstico de CI](github/ci-troubleshooting.md)
- [API via CLI](github/github-api-cheatsheet.md)

Textos multilinha são preparados em arquivo e passados por --body-file; verifique
o conteúdo exato antes de uma publicação autorizada. O workflow do projeto define
branch, commits, testes e integração; a referência não cria autorização de push.

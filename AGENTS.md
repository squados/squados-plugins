# squados-plugins — instruções do repositório

Leia este arquivo e `CLAUDE.md` como um par, se o segundo existir. Consulte também
`README.md` e `CONTRIBUTING.md`. Antes de trabalhar em outro repositório, leia o par
de instruções dele; não transfira regras de implementação do Desktop automaticamente.

## Finalidade e limites

Este é o repositório público de plugins do SquadOS Studio: o catálogo curado de
skills, os pacotes próprios mantidos pelo SquadOS e os templates open-source.
Websites têm quatro candidatos independentes em `sites/`; aplicações têm nove
candidatos independentes em `apps/`. Os jogos demonstrativos têm pacotes
em `games/`. Não reutilize `gallery.json` para indexar templates ou jogos.
Não é o código do aplicativo nem um espelho de todos os repositórios de skills de terceiros.

- `gallery.json`: índice que o Studio consulta para mostrar a vitrine de agentes no RH.
- `skills/<nome>/`: conteúdo das skills próprias; o pacote pode incluir arquivos de apoio.
- `games/`: jogos estáticos independentes, índice local, documentação e licenças próprias.
- `sites/`: quatro templates one-page, fontes, arte, previews e licenças. Metadados no manifesto único `templates.json`.
- `apps/`: nove templates web one-page, dados mock, temas, fontes e previews. Metadados no manifesto único `templates.json`.
- `README.md`: funcionamento, formato, curadoria e exceções de distribuição.
- `CONTRIBUTING.md`: orientação para contribuir com o índice e os pacotes.
- `LICENSE`: licença deste repositório; não substitui as licenças de conteúdo externo.

O índice editorial publica somente pacotes `squados`. O contrato do Desktop ainda
reconhece `hermes` e `github` para procedência e instalações diretas; essas fontes
não entram nesta vitrine. **Curadoria SquadOS não significa autoria SquadOS:**
informe as fontes incorporadas/consultadas, preserve autoria e licença e não
apresente código de terceiros como próprio.

A composição aprovada em 16/10/2026 contém dezenove especialistas próprios,
com modos internos. Confira `docs/skills-de-trabalho-catalogo.md` e a curadoria
completa em `docs/skill-curation/`. Prompts simples vão para `prompts/`;
instruções da plataforma ficam nos guias condicionais do Desktop. Fontes Cursor
e cortes aprovados não podem voltar por importação de variantes ou caches.

## Integração com o Desktop

O consumidor é `../squados-desktop`. O Studio usa o harness Hermes por meio do
contrato `ComputerRuntime`; a interface e os serviços de skills pertencem ao Desktop.
As referências de implementação são:

- `src/shared/skills/gallery.ts`: URL pública, schemas, origens e parsing do índice.
- `src/main/services/skills/gallery-service.ts`: carregamento HTTP, busca e preparação.
- `src/main/services/skills/native-skills-service.ts`: invocação do adaptador Hermes.
- `resources/hermes/skills.py`: busca, download, verificação e proposta para revisão.
- `src/renderer/src/features/skills/GalleryBrowser.tsx`: vitrine, origens e mais resultados.

O Desktop lê `https://raw.githubusercontent.com/squados/squados-plugins/main/gallery.json`.
Não usa este checkout local automaticamente. O consumidor usa seed e cache editorial; consulta sem credenciais, recusa
redirecionamentos e limita tamanho/tempo. O catálogo atual usa version: 2; o parser
conserva v1 histórico, mas o serviço não aceita catálogo v1 ou misto na vitrine.
Um catálogo v2 próprio substitui integralmente o snapshot anterior, incluindo
remoções; nunca unir cache antigo aos itens novos. Confira o contrato atual antes
de mudar versão ou requisitos.

O índice lista opções, sem instalar suas skills. Ao contratar, o adaptador resolve a
origem, verifica conteúdo com o guard do Hermes e prepara uma proposta nativa para a
pessoa revisar. A aprovação é uma etapa posterior. Resultados externos da busca são
separados da seleção editorial do JSON: excluir um item do índice não o remove
automaticamente de "Mais resultados".

## Contrato do catálogo

Confirme sempre o schema atual do Desktop antes de editar o índice:

- `id` e `area`: slugs em minúsculas, números e hífen, até 64 caracteres.
- Cada item pertence a uma área declarada; evite áreas vazias e IDs duplicados.
- Título de área até 60 caracteres; título de item até 80; descrição até 300.
- A curadoria exige `pt-BR` e `en`, texto de uma linha e linguagem de trabalho.
  O parser aceita ausência de `pt-BR`, mas isso não atende ao padrão editorial.
- `featured`, quando presente, é booleano e representa escolha editorial.
- `squados`: `{ "type": "squados", "path": "skills/<nome>" }`.
- `hermes`: caminho em `skills/...` ou `optional-skills/...` do acervo empacotado.
- `github`: identificador `<dono>/<repo>/<caminho>` somente de `openai/skills`,
  `anthropics/skills`, `anthropics/knowledge-work-plugins` ou `openai/plugins`.

A lista de fontes permitidas não garante licença adequada, compatibilidade ou qualidade
de cada pacote. Leia a skill inteira e seus recursos antes de incluí-la. Não altere
`version` sem uma mudança coordenada no consumidor. O parser limita a saída a 50 áreas
e 500 itens; não conte com esse truncamento para organizar o catálogo.

## Pacotes próprios e compatibilidade

Use `skills/<nome>/SKILL.md` com frontmatter que declare `name`, `description` e `license`.
O nome deve coincidir com a pasta. Preserve scripts, referências, templates, assets,
licenças e versões de dependências necessários à execução. Não prometa que copiar
apenas o Markdown instala um pacote que depende de outros arquivos.

Para contratação pela galeria, o adaptador atual aceita até 100 arquivos e 4 MiB de
conteúdo UTF-8, sem binários. Além de `SKILL.md`, os recursos devem estar em
`references/`, `templates/`, `scripts/` ou `assets/`. Arquivos de licença `LICENSE*`,
`LICENCE*`, `NOTICE*` e `COPYING*` na raiz são movidos para `references/` pelo adaptador,
desde que não haja colisão. Outros arquivos soltos ou pastas não aceitas impedem a
preparação. Confira também os limites e validações nativos do Hermes.

O adaptador e seu teste de integração são a referência para essas regras. Não remova
avisos legais para contornar restrições de empacotamento.

Não assuma que uma dependência mencionada por uma skill está instalada. O Desktop
atual possui bibliotecas Python de documentos instaladas sob demanda; confirme seu
perfil, locks e rotina de preparação antes de dizer que "o Studio já traz" uma biblioteca.

## Validação e entrega

Credenciais de provedores, incluindo OpenRouter, ficam na configuração local do
agente que executa a skill, fora deste repositório. Não coloque chaves em SKILL.md,
scripts, exemplos, projetos gerados, logs ou commits. A skill de vídeo usa o agente
já configurado e não exige uma chave própria de LLM. Arquivos `.env` locais são
ignorados; arquivos `.env.example` públicos só podem conter valores fictícios.
O `.gitignore` não remove segredos já rastreados nem protege contra `git add -f`:
confira o diff antes de cada commit. Se uma chave for publicada, revogue-a e
substitua-a; apagar o arquivo em um novo commit não apaga o histórico.

Não há runner npm na raiz. Use `python scripts/verify-skills.py`,
`python -m unittest discover -s tests` e `node --test tests/chrome-webstore.test.mjs`.
Pacotes independentes e o consumidor Desktop têm seus próprios checks.

Para o catálogo, valide JSON, campos, traduções, unicidade, referências de área,
caminhos e licenças com `node scripts/validate-skills-catalog.mjs` e
`node --test tests/validate-skills-catalog.test.mjs` neste repositório. O Desktop
não mantém espelho editorial nem capas embarcadas: testa o contrato com fixtures.

Para templates, a autoria única é `templates.json`: cada registro contém `template`
(metadados e `goal` bilíngue), `path` e a lista completa `files` com caminho,
tamanho e SHA-256. Sites/apps/jogos conservam seus diretórios; slides e bases
antigas estão em `templates/`. As seis bases antigas continuam fora da galeria.
Depois de revisar arquivos, rode `node scripts/templates-catalog.mjs --write` e
`node --test tests/templates-catalog.test.mjs`. O leitor baixa o pacote completo
sob demanda e confere todos os hashes. Não inclua node_modules, builds ou segredos.

No Desktop, use o script nomeado e um escopo focado:

```powershell
npm test -- src/shared/skills/gallery.test.ts src/main/services/skills/gallery-remote-source.test.ts src/main/services/creation-templates/creation-templates.remote.test.ts src/main/ipc/gallery.test.ts
```

Os testes de conteúdo Hermes e integração podem ser pulados quando o source/runtime
preparado não existe. Verifique o resumo e declare skips como pendentes. Não prepare
dependências nem abra a aplicação apenas para validar uma edição documental.

Separe as evidências: contrato válido, pacote verificável, proposta revisável,
aprovação/instalação e execução de um pedido real são etapas diferentes. Não declare
"100% funcional" apenas porque o JSON carrega ou os testes passam.

Trabalhe na branch principal, preserve WIP de outras sessões e faça commits cirúrgicos
dos próprios arquivos após validação. Use PowerShell 7 no Windows. Documentação e
comentários em PT-BR; identificadores novos em inglês. Não acrescente infraestrutura
ou copie dependências sem uma necessidade concreta. Push e publicação dependem de
pedido explícito; registre como estado quando ainda não ocorreram.

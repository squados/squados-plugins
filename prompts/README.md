# Prompts de trabalho / Work prompts

## Português

O [catálogo](catalog.json) reúne 136 pedidos iniciais em 14 categorias, com título,
descrição e texto completo em português e inglês. São prompts editáveis: o Studio
os apresenta na home de nova conversa, na entrada **Trabalhar**. Escolher um card
cola o texto na barra de mensagem, preservando o rascunho e sem enviar o pedido.

Cada prompt orienta a IA a consultar primeiro informações relevantes no
repositório ou na pasta de trabalho. Depois, ela entrevista a pessoa, uma pergunta
por vez, apenas sobre as lacunas e executa a tarefa quando tiver contexto
suficiente. A escolha do card não lê arquivos nem inicia o trabalho.

### Editar e remover

- Edite `catalog.json`; não use o `gallery.json` de skills para estes pedidos.
- A raiz contém `version`, `source`, `categories` e `items`.
- Cada item contém `id`, `category`, `title`, `description`, `prompt` e
  `sourcePath`. Título, descrição e prompt têm as chaves `pt-BR` e `en`.
- Mantenha equivalência de objetivo, pesquisa prévia, entrevista e entrega nos
  dois idiomas. As perguntas precisam ser específicas da tarefa.
- Para remover um pedido da galeria, remova seu objeto de `items`. Não existe
  obrigação de manter os 136 itens; essa contagem descreve a importação inicial.
- IDs devem ser únicos, em minúsculas com hífen, e apontar para uma categoria
  declarada. Títulos têm até 80 caracteres, descrições até 300 e corpos até 2.000.
  O arquivo tem até 1 MB, 500 itens e 50 categorias.

O Desktop inclui uma cópia validada e consulta a versão publicada em
`main/prompts/catalog.json` uma vez por sessão do aplicativo. A versão publicada
válida substitui a lista incluída, inclusive quando há remoções. Falha na consulta
mantém a cópia incluída. Editar este checkout não publica o catálogo.

No checkout do Desktop, use `npm run prompts:sync` para sincronizar a cópia
incluída. A validação e os testes pertencem ao consumidor; este repositório não
tem um runner de testes na raiz.

### Origem

Adaptações editoriais próprias baseadas nos objetivos e processos do
[Claude Office Skills](https://github.com/claude-office-skills/skills/tree/9c4c7d5cd2813a8936bf2c9fdb174ea883b85a11),
revisão `9c4c7d5cd2813a8936bf2c9fdb174ea883b85a11`. Os IDs e `sourcePath`
preservam a relação com cada pedido. Receitas de instalação, scripts, servidores,
metadados de skills e dependências não são distribuídos por este catálogo.
Preservamos o [aviso MIT integral da origem](LICENSE.claude-office-skills),
copyright 2026 Claude Office Skills Contributors.

## English

The [catalog](catalog.json) contains 136 initial requests in 14 categories, with
titles, descriptions, and full prompt text in Portuguese and English. These are
editable prompts: Studio presents them on the new conversation home under
**Work**. Selecting a card pastes its text into the message bar, preserving the
draft without submitting the request.

Each prompt asks AI to first consult relevant information in the repository or
working folder. It then interviews the person one question at a time about
remaining gaps and performs the task once enough context is available. Selecting
a card does not read files or start work.

### Editing and removal

- Edit `catalog.json`; the skills `gallery.json` is a separate catalog.
- The root contains `version`, `source`, `categories`, and `items`.
- Each item has `id`, `category`, `title`, `description`, `prompt`, and
  `sourcePath`. Title, description, and prompt contain both `pt-BR` and `en`.
- Preserve equivalent goals, context lookup, interview, and deliverables in both
  languages. Questions must address the specific task.
- To remove a request from the gallery, remove its object from `items`. The
  initial count of 136 is not a permanent catalog requirement.
- IDs must be unique lowercase slugs and reference a declared category. Titles
  are limited to 80 characters, descriptions to 300, and prompt bodies to 2,000.
  The file is limited to 1 MB, 500 items, and 50 categories.

Desktop ships a validated copy and requests the published
`main/prompts/catalog.json` once per app session. A valid published catalog
replaces the shipped list, including removals. A failed request preserves the
shipped copy. Editing this checkout does not publish the catalog.

From the Desktop checkout, run `npm run prompts:sync` to synchronize the shipped
copy. Validation and tests belong to the consuming application; this repository
has no root test runner.

### Attribution

Original editorial adaptations based on the goals and workflows in
[Claude Office Skills](https://github.com/claude-office-skills/skills/tree/9c4c7d5cd2813a8936bf2c9fdb174ea883b85a11),
revision `9c4c7d5cd2813a8936bf2c9fdb174ea883b85a11`. IDs and `sourcePath` preserve
the connection to each request. Installation recipes, scripts, servers, skill
metadata, and dependencies are not distributed through this catalog. The
[complete original MIT notice](LICENSE.claude-office-skills), copyright 2026
Claude Office Skills Contributors, is retained.

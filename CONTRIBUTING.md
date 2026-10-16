# Como contribuir

As contribuições de skills seguem os dois formatos abaixo. Jogos demonstrativos
ficam separados em `games/` e preservam fontes, recursos, licenças e autoria de
suas bases; consulte o [README dos jogos](games/README.md) antes de alterá-los.
Um jogo não deve ser acrescentado a `gallery.json`. A licença MIT da raiz não
substitui licenças por arquivo nem autoriza material com restrição comercial.

## Prompts de trabalho / Work prompts

Pedidos simples ficam em `prompts/catalog.json`, separados das skills. Consulte
o [formato e padrão editorial](prompts/README.md). Inclua título, descrição e
prompt completos nos dois idiomas, consulta prévia aos materiais existentes,
entrevista específica e entrega. Preserve origem e licença. Remover um item do
catálogo é a forma de retirá-lo da galeria; não é necessário instalar um pacote.

Simple requests belong in `prompts/catalog.json`, separately from skills. Read
the [format and editorial guidance](prompts/README.md#english). Provide complete
titles, descriptions, and prompts in both languages, prior context lookup, a
task-specific interview, and the deliverable. Preserve attribution and license.
Remove an item from the catalog to remove it from the gallery; no package
installation is needed.

## 1. Acrescentar um item ao índice

Edite `gallery.json` e acrescente um item (formato no [README](README.md)) apontando
para uma skill deste repositório (`"type": "squados"`). A seleção editorial é a
biblioteca própria; pacotes de terceiros podem ser instalados diretamente pelo
usuário, com sua procedência preservada, fora deste índice.

Antes de abrir o pull request:

- `title` e `description` em `pt-BR` e `en`, uma linha cada, na palavra que a pessoa usa no trabalho;
- abra o pacote inteiro, confirme licença e declare conexões/dependências reais; não inclua credenciais;
- confirme que todo arquivo além de `SKILL.md` está em `references/`, `templates/`, `scripts/` ou `assets/`, sem binário. Arquivos `LICENSE*`, `LICENCE*`, `NOTICE*` ou `COPYING*` na raiz são preservados em `references/` pelo adaptador do Studio, desde que não haja colisão com um arquivo já existente.

## 2. Acrescentar uma skill nossa

Crie `skills/<nome>/SKILL.md`:

- `name` igual ao nome da pasta (minúsculas, números e hífen);
- `description` de uma linha;
- `license` no frontmatter;
- somente texto no bundle; credenciais ficam fora do pacote; arquivos de apoio só em `references/`, `templates/`, `scripts/` ou `assets/`.

Evite criar outro cartão quando um modo de especialista existente resolver. Procedimentos internos não são skills selecionáveis. Rode `python scripts/verify-skills.py` e os checks afetados; preserve o limite de dezenove destinos salvo decisão explícita de produto.

Depois acrescente o item correspondente em `gallery.json`, com `"source": { "type": "squados", "path": "skills/<nome>" }`.

## O que o Studio faz com o seu pull request

O Studio nunca instala uma skill direto: toda skill passa pelo verificador do Hermes
(`tools/skills_guard.py`) antes de chegar à pessoa, e a pessoa revisa o que será contratado.
Uma skill barrada pelo verificador não é contratada e a pessoa vê o motivo.

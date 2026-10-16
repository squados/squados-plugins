# squados-plugins

Acervo público de plugins do SquadOS Studio: skills, templates e demonstrações,
com licenças próprias identificadas em cada pacote.
As skills têm um índice curado (`gallery.json`) para contratação pelo RH e pacotes
próprios em `skills/<nome>/SKILL.md`. Os quatro [templates de websites](sites/README.md)
têm pacotes independentes em `sites/`; os nove [templates de aplicativos web](apps/README.md)
têm páginas demonstrativas independentes em `apps/`, com dados fictícios e temas claro/escuro.
Os três [jogos demonstrativos](games/README.md) têm pacotes próprios
em `games/`, separados do índice de skills. Instalações diretas de outros
repositórios aparecem no Studio como Outras, fora da vitrine editorial.

## Prompts de trabalho / Work prompts

O [acervo de prompts](prompts/README.md) contém pedidos enxutos em português e
inglês para a galeria da entrada Trabalhar. Cada pedido consulta o contexto
existente, entrevista sobre as lacunas e define a entrega. Selecionar apenas
cola o texto na barra; o envio continua sendo uma ação da pessoa.

The [prompt collection](prompts/README.md#english) contains concise Portuguese
and English requests for the Work gallery. Each request consults existing
context, interviews the person about gaps, and defines the deliverable. Selecting
one only pastes its text into the message bar; the person still submits it.

## Biblioteca de especialistas

A [biblioteca de 19 especialistas](docs/skills-de-trabalho-pacotes.md) reúne métodos,
scripts e referências sob demanda. Inclui Michelangelo, Tarantino, Krug, Warren,
Zuck, Flavio, Gutenberg, Linus, Drucker, Maslow e Darwin, além de Áudio e
assistentes separados por aplicação. A pessoa descreve a tarefa; modos são internos.

As 35 skills próprias anteriores foram consolidadas. Prompts simples ficam em
`prompts/`; conduta e procedimentos do Studio ficam nas instruções condicionais
do produto. Não importamos caches ou instalações pessoais como biblioteca pública.
Os 408 registros históricos e seus destinos estão na
[classificação navegável](docs/skill-curation/classification.html).

## Como o Studio lê

O índice publicado fica em `main/gallery.json`. Este checkout e o seed incluído
no Desktop estão reconciliados; editar/commitar localmente não publica o remoto.
O parser conserva v1 histórico, mas a vitrine usa somente o catálogo editorial
v2 próprio. Um snapshot aceito substitui o anterior, incluindo remoções. Caches
mistos anteriores à curadoria e respostas v1 não sobrepõem a seleção embutida.
Consulte o contrato em `squados-desktop/src/shared/skills/gallery.ts`.

O índice tem até 1 MB, 500 itens e 50 áreas. Cada item tem `id`, `area`, `title`,
`description`, `source` e `editorial`. Os textos públicos vêm em PT-BR e inglês.
Nesta seleção, todas as fontes são `{ "type": "squados", "path": "skills/<nome>" }`.
Editorial contém apresentação, exemplos, capa, proveniência, licença e requisitos.
O catálogo pode evoluir sem transformar autoria de terceiros em autoria SquadOS.
As [capas](assets/README.md) são autorais e têm fonte SVG editável.

## Pacotes, requisitos e licenças

Cada pasta possui `SKILL.md`, licença e recursos necessários. Copiar somente a
entrada perde scripts, contratos, templates ou referências. Os dezenove bundles
atuais cabem em 100 arquivos/4 MiB e são texto UTF-8, sem binários embutidos.
Dependências e recursos de execução são preparados pelo procedimento do modo;
não se presume conta, programa ou biblioteca instalada.

Tarantino preserva o motor do editor em `scripts/editor`, com locks e preparação
verificada de fontes/modelos. Gutenberg preserva os motores DOCX/PDF/XLSX/PPTX.
As fontes incorporadas e consultadas são distinguidas em `references/provenance.json`;
avisos integrais e termos de componentes permanecem no pacote. A licença MIT da
raiz não substitui a licença de conteúdo externo.

Execute `python scripts/verify-skills.py` para conferir os dezenove pacotes e o índice.
Os checks do consumidor e a instalação isolada têm evidência no
[estado de entrega](docs/skills-de-trabalho-status.md). Estrutura, preparação,
instalação, uso real autenticado e publicação são estados diferentes.

## Contribuir

Veja [CONTRIBUTING.md](CONTRIBUTING.md). Preserve a curadoria, os recursos,
as licenças e os [termos dos jogos](games/README.md#licenças-e-publicação).

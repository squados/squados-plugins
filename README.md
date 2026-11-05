# squados-plugins

Acervo público de plugins do SquadOS Studio: skills, templates e demonstrações,
com licenças próprias identificadas em cada pacote.
As skills têm um índice curado (`gallery.json`) para contratação pelo RH e pacotes
próprios em `skills/<nome>/SKILL.md`. Os quatro [templates de websites](sites/README.md)
têm pacotes independentes em `sites/`; os nove [templates de aplicativos web](apps/README.md)
têm páginas demonstrativas independentes em `apps/`, com dados fictícios e temas claro/escuro.
Os cinco [jogos demonstrativos](games/README.md) têm pacotes próprios
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

## Galeria de motion

A [galeria de motion](motion-gallery/README.md) reúne demonstrações de edição,
motion design, b-roll e transições. Abra [motion-gallery/index.html](motion-gallery/index.html)
no navegador para ver os efeitos por categoria. A Tarantino consulta o
[catálogo JSON](motion-gallery/catalog.json) quando você pede um efeito pelo nome.

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

O Studio busca `main/gallery.json` e `main/templates.json` na abertura. Este
repositório é a fonte única dos metadados, objetivos, capas, previews e pacotes.
O Desktop não inclui cópias editoriais; guarda apenas cache automático do último
snapshot válido e arquivos de pacotes escolhidos. Uma publicação substitui a
seleção anterior, incluindo remoções. Instalações e preferências pessoais são locais.
Editar/commitar este checkout não publica o remoto: é necessário fazer push.

O manifesto [templates.json](templates.json) oferece as 22 opções aprovadas: quatro
slides, quatro sites, nove aplicativos e cinco jogos. Slides e as seis bases antigas
não listadas foram transferidos para `templates/`. Cada pacote declara todos os
arquivos, tamanhos e hashes; a abertura carrega o índice e a escolha baixa o pacote
completo. Não há instalação automática de todas as skills.

Os quatro sites e nove aplicativos incluem `demo/index.html` e seus recursos,
reaproveitados das prévias já criadas. O Studio usa essa distribuição para abrir
a interface completa, com rolagem e interações locais, nos detalhes de Nova
conversa. As fontes editáveis continuam no mesmo pacote, e `preview.png` permanece
como miniatura. Todos os arquivos da demo entram na verificação de tamanho e
SHA-256 do manifesto; não é necessário instalar dependências para experimentar.

O índice tem até 1 MB, 500 itens e 50 áreas. Cada item tem `id`, `area`, `title`,
`description`, `source` e `editorial`. Os textos públicos vêm em PT-BR e inglês.
Nesta seleção, todas as fontes são `{ "type": "squados", "path": "skills/<nome>" }`.
Editorial contém apresentação, exemplos, capa, proveniência, licença e requisitos.
O catálogo pode evoluir sem transformar autoria de terceiros em autoria SquadOS.
As [capas](assets/README.md) atuais são WebP autorais com o mascote SquadOS.

## Pacotes, requisitos e licenças

Cada pasta possui `SKILL.md`, licença e recursos necessários. Copiar somente a
entrada perde scripts, contratos, templates ou referências. Os dezenove bundles
atuais cabem em 100 arquivos/4 MiB e são texto UTF-8, sem binários embutidos.
Dependências e recursos de execução são preparados pelo procedimento do modo;
não se presume conta, programa ou biblioteca instalada.

As instruções orientam as decisões. Tarantino usa as ferramentas de mídia disponíveis e Gutenberg oferece auxiliares para operações pontuais de arquivo.
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

## Validação editorial

```powershell
python scripts/verify-skills.py
python -m unittest discover -s tests
node scripts/validate-skills-catalog.mjs
node scripts/templates-catalog.mjs
node --test tests/*.test.mjs
```

Após alterar arquivos de um template, revise o pacote e atualize seu manifesto
com `node scripts/templates-catalog.mjs --write` antes dos checks.

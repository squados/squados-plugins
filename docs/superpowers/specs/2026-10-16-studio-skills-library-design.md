# Biblioteca de especialistas do SquadOS Studio

Data: 16/10/2026. Estado: segunda curadoria, com decisões expressas incorporadas
ao mapa e consolidações adicionais propostas. Pacotes e catálogos ainda não migrados.

## Objetivo e destino

A biblioteca é `squados-plugins/skills`. A pessoa deve reconhecer poucos especialistas
e descrever o trabalho; o especialista escolhe o método e carrega as referências
necessárias. Não precisa decorar ferramentas, modos ou dezenas de nomes.

As instalações pessoais foram fontes da primeira auditoria. Não são o destino da
curadoria: não excluir nem alterar skills, caches, configurações ou credenciais do
computador do autor. A futura migração acontece nos pacotes deste repositório, com
reconciliação dos índices e, quando necessário, dos guias internos no Desktop.

O mapa integral mantém os 408 conjuntos de instruções e todos os 448 IDs originais,
incluindo aliases, em [classification.json](../../skill-curation/classification.json).
O [relatório navegável](../../skill-curation/classification.html) permite consultar
por especialista, decisão, categoria anterior, nome e ID. A tabela legível está em
[report.md](../../skill-curation/report.md).

## Referências e estrutura

Usar a [estrutura Agent Skills](https://agentskills.io/specification), que separa
metadados, instruções da skill e recursos carregados conforme a tarefa. A escolha
editorial é reunir referências por responsabilidade profissional, usando essa
estrutura existente. Não criar um novo mecanismo de modos, catálogo paralelo ou
roteador em código.

O consumidor continua sendo o Hermes do Studio, com as convenções existentes em
`resources/hermes/source/skills`, `resources/hermes/source/optional-skills` e os
guias `resources/instructions/*/guide.md` do Desktop. O formato da galeria é o de
`src/shared/skills/gallery.ts`; o formato de prompts é o de `prompts/catalog.json`.
Conferir os contratos reais ao executar a migração. Não importar instruções de
outro harness como se suas ferramentas existissem no Studio.

Cada especialista terá um `SKILL.md` enxuto com propósito, resultado esperado,
orientações comuns e mapa de referências. Os modos detalhados ficam em
`references/`; scripts, templates e recursos necessários ficam nos diretórios
aceitos. Ativar uma skill não carrega todos os modos. Os modos são detalhes do
pacote, não outra lista de itens contratáveis. Os nomes abaixo são os nomes de
exibição; `name` e pasta usam os identificadores em inglês indicados.

## Decisões fechadas pelo usuário

- Excluir toda fonte Cursor, inclusive SDK e skills que só ensinam a operar Cursor.
- Manter todos os descartes anteriores por incompatibilidade e baixo valor.
- Aplicar os 105 cortes explícitos por ID: 26 em Adaptar e 79 em Manter. O JSON
  preserva as listas exatas; a validação resolve aliases sem renumerar itens.
- Propagar cortes a variantes da mesma capacidade. Por exemplo, o diagnóstico
  individual não retorna como `ibeia-diagnostico-individual` depois do corte de 034.
- Excluir as famílias Jupyter, delegação de programação por CLI, deploy Cloudflare
  e arte p5.js. Não recuperar capacidades cortadas dentro de um pacote novo.
- Reunir direção e produção visual em Michelangelo, partindo da skill existente.
  Operações de Figma ficam em Assistente Figma separado.
- Reunir UX em Krug, partindo de dont-make-me-think.
- Reunir vídeo em Tarantino, partindo do editor de vídeos existente.
  Transcrição, Whisper, voz e áudio independentes ficam em outra skill técnica.
- Reunir finanças em Warren - CFO; marketing, redes sociais e tráfego em Zuck.
- Separar Vendas e Negociação de Zuck, reunindo propostas, prospecção,
  relacionamento, pesquisa comercial de mercado e e-commerce no papel comercial.
- Usar Gutenberg - Documentos e Dados, incluindo análise de dados;
  Drucker - Gestor de Operações; Darwin - Pesquisador.
- Usar Linus - Engenheiro de Software como nome do especialista de desenvolvimento.
- Manter assistentes próprios por aplicação; não criar um Assistente de Aplicativos
  genérico. Reunir os modos da mesma aplicação, como os modos do Notion.
- Unir 336 + 337; unir 347 + 348. Unir desenvolvimento MCP e operação via mcporter.
- Handoff continua skill, pois atende à continuidade em nova sessão. As outras
  promoções a prompt permanecem aprovadas.
- Nenhuma instrução da plataforma será uma skill plugável. Revisar seu conteúdo
  e usar progressive disclosure nos procedimentos do Studio.
- Preferir consolidação e modos a novas skills para cada caso ou ferramenta.

## Composição adicional proposta

O mapa resulta em 179 fontes retidas, reunidas em **20 especialistas e assistentes**; 173 fontes
removidas; 14 promovidas a prompt; 42 encaminhadas a instruções internas. Fontes
são conjuntos de instruções, não a quantidade de pacotes finais. Não se importam
179 skills para depois esconder seus cartões.

| Pasta | Especialista | Modos e responsabilidade |
|---|---|---|
| `skills/michelangelo` | Michelangelo - Designer | Marcas; interfaces; design por imagem; peças visuais; ilustração; infográficos; diagramas; apresentações; SVG/ícones; animação; canvases visuais. |
| `skills/tarantino` | Tarantino - Editor de Vídeos | Criação de vídeos; roteiro; montagem; cortes; motion; efeitos; legendas no vídeo; renderização e exportação. |
| `skills/audio` | Áudio, Voz e Transcrição | Transcrição; Whisper; síntese de voz; áudio e música; transcrições de vídeos. |
| `skills/krug` | Krug - Especialista em UX | Jornadas; clareza; fricção; usabilidade; checkout/conversão; engajamento e gamificação. |
| `skills/warren` | Warren - CFO | Planejamento; caixa; contas; demonstrações; conciliação; variações; valuation; modelos; preços; investimentos; operações de pagamento. |
| `skills/zuck` | Zuck - O Marketeiro | Estratégia de marketing; copy; conteúdo; redes; SEO; tráfego; mensuração e ideação de campanhas. |
| `skills/sales` | Vendas e Negociação — nome próprio em discussão | Inteligência comercial e mercado; prospecção; qualificação; propostas; negociação; fechamento; treinamento de vendas; e-commerce; catálogo; relacionamento e sucesso do cliente. |
| `skills/gutenberg` | Gutenberg - Documentos e Dados | DOCX; PDF/OCR/formulários; XLSX/fórmulas; PPTX/templates; tratamento/análise de dados; redação e comunicação de trabalho. |
| `skills/linus` | Linus - Engenheiro de Software | Código; arquitetura; GitHub; MCP; banco/Supabase; segurança; navegador/testes; APIs; infraestrutura/publicação; IA/modelos. |
| `skills/drucker` | Drucker - Gestor de Operações | Projetos; produto; prioridades; qualidade; fornecedores/compras; estoque/logística; contratos e obrigações; panorama do dia. |
| `skills/people` | Especialista em Pessoas | Recrutamento; seleção; integração; treinamento; feedback; desenvolvimento. |
| `skills/darwin` | Darwin - Pesquisador | Fontes/citações; artigos; arXiv; Reddit; RSS; mapas; verificação de informação pública; escrita científica. |
| `skills/figma` | Assistente Figma | Arquivos; criação e edição; componentes; bibliotecas; Plugin API; implementação a partir de Figma. |
| `skills/notion` | Assistente Notion | Páginas; bases; captura de conhecimento; reuniões; pesquisa; planos e implementação. |
| `skills/google-workspace` | Assistente Google Workspace | Serviços da suíte Google, com referências por serviço e operação. |
| `skills/obsidian` | Assistente Obsidian | Vaults; notas; links; busca e organização. |
| `skills/shop` | Assistente Shop | Busca de produtos; compras; pedidos e devoluções. |
| `skills/shopify` | Assistente Shopify | Operação da loja; produtos; pedidos; clientes; estoque e metafields. |
| `skills/telephony` | Assistente de Telefonia | Integração técnica existente de números, mensagens e chamadas; referências por provedor. |
| `skills/handoff` | Handoff | Passagem verificável de contexto para continuar em nova sessão. |

As junções adicionais desta revisão são escolhas propostas pelo agente, não nomes
ou agrupamentos já aprovados individualmente pelo usuário. Em especial:

- Zuck fica restrito a marketing. Vendas e Negociação é um especialista próprio;
  sua composição absorve as capacidades comerciais retiradas de Zuck. Contratos
  e obrigações seguem com Drucker; cálculos financeiros com Warren.
- Gutenberg reúne mecanismos de formatos e análise de dados. A junção preserva os
  motores DOCX/PDF/XLSX/PPTX, scripts e revisão visual; não os transforma em prompts.
- Engenheiro reúne ferramentas de desenvolvimento. MCP é um só modo, cobrindo
  desenvolvimento, descoberta, autenticação, inspeção de schema e chamada de
  servidores autorizados. Playwright e interativo são variantes de um modo.
- Assistentes de aplicação ficam separados, por correção explícita do usuário.
  Notion reúne somente seus próprios modos de captura, reunião, pesquisa e
  implementação. Shop e Shopify são pacotes diferentes. A suíte Google conserva
  uma entrada própria; telefonia preserva sua integração técnica independente.
  Panorama do dia passa a Operações. Os limites já propostos para ferramentas
  de desenvolvimento permanecem: GitHub, Supabase, MCP e Playwright em Linus;
  pagamentos em Warren. Figma tem assistente independente, com seus próprios modos.
- Pessoas reúne recrutamento, treinamento e desenvolvimento. Operações reúne os
  processos de execução; Pesquisador reúne os métodos de pesquisa restantes.
- Gamificação passa a ser modo de Krug. Áudio, voz, transcrição e Whisper ficam
  separados de Tarantino. O tratamento sonoro e as legendas necessários à montagem
  de um vídeo continuam no fluxo do editor; isso não o torna a skill de transcrição.

Não reduzir além disso por simples contagem: juntar Handoff, arquivos técnicos ou
integrações a um “faz tudo” tornaria o nome menos útil. A separação por aplicação
prevalece sobre minimizar o total de entradas.

### Nomes ainda em discussão

Gutenberg, Linus, Drucker e Darwin foram aprovados pelo usuário. Carnegie foi
rejeitado por dificuldade de pronúncia. Restam estas sugestões editoriais:

| Responsabilidade | Sugestão |
|---|---|
| Especialista em Pessoas | Elton (recomendado), Mayo, Maslow, Simon ou Dale |
| Vendas e Negociação | Zig (recomendado) ou Chris |

O agrupamento técnico Áudio, Voz e Transcrição usa título descritivo; um nome
próprio não é necessário para preservar a separação pedida nesta revisão.

## Fronteiras para tarefas que atravessam especialistas

O pedido determina a liderança; o especialista consulta a referência técnica
adequada sem duplicar motores. Exemplos:

- “Faça uma apresentação bonita”: Michelangelo define narrativa visual e layout;
  se a entrega for PPTX editável, usa os recursos de PowerPoint de Gutenberg.
- “Revise este fluxo de cadastro”: Krug identifica e valida a fricção;
  Michelangelo produz a solução visual quando a tarefa pedir.
- “Monte um DCF em Excel”: Warren conduz premissas, fórmulas e checks financeiros;
  Gutenberg fornece criação, preservação e verificação de XLSX.
- “Crie uma landing page para a campanha”: Zuck trabalha mensagem e copy da campanha e
  Michelangelo o design. Publicação segue o procedimento interno do Studio.
- “Crie um servidor MCP e teste a conexão”: um único modo do Engenheiro cobre o
  desenvolvimento e a operação via mcporter, sem contratar outra skill.

Não criar um orquestrador novo nem ativar todos os especialistas automaticamente.
Usar a leitura/invocação nativa de skills do Hermes e caminhos relativos realmente
resolvidos no ambiente. Uma referência cruzada não pode apontar para pasta pessoal
ou depender silenciosamente de outro especialista instalado. Na migração,
referências cruzadas precisam indicar a capacidade complementar e verificar sua
disponibilidade; a ausência é resolvida pelos mecanismos de preparação do Studio.

## Destino dos pacotes próprios atuais

| Pacotes atuais em `skills/` | Destino |
|---|---|
| `creative-designer`, `presentation-specialist` | Michelangelo |
| `editor-de-videos` | Tarantino, preservando o pacote técnico existente |
| `ecommerce-conversion` | Krug |
| `cfo`, `financial-assistant` | Warren |
| `content-creator`, `copywriter`, `marketing-strategist`, `marketing-traffic`, `seo-specialist` | Zuck |
| `commercial-proposals`, `customer-success`, `ecommerce-competitors`, `market-researcher`, `negotiation`, `product-catalog`, `prospecting`, `sales-coach`, `voice-of-customer` | Vendas e Negociação |
| `business-writer`, `data-specialist`, `spreadsheet-specialist` | Gutenberg |
| `contract-assistant`, `inventory`, `logistics`, `procurement`, `product-specialist`, `project-manager`, `quality-specialist` | Drucker |
| `people-development`, `recruitment`, `training-specialist` | Pessoas |
| `executive-assistant` | Catálogo de prompts |
| `skill-manager` | Procedimento interno do Studio, fora de `skills/` |

Os demais especialistas usam bases retidas no mapa, com autoria e licença reais.
Após a incorporação verificada, remover os pacotes substituídos e suas entradas
antigas dos índices. Não deixar aliases contratáveis nem a mesma capacidade em
vários pacotes, e não eliminar recursos antes de seu novo destino estar verificável.

## Instruções internas com progressive disclosure

As 39 fontes anteriores da categoria interna continuam fora das skills. Esta
revisão acrescenta controle do computador (108), captura de tela (340, alias 063)
e publicação de site (263): são instruções de operação da plataforma. Total: 42.

| Conteúdo a revisar | Destino no Desktop |
|---|---|
| Descoberta, briefing e planejamento | `resources/instructions/planning/guide.md` |
| Implementação, revisão, simplificação e verificação | `resources/instructions/development/guide.md` e referências existentes |
| Diagnóstico e spikes | `resources/instructions/diagnosis/guide.md` |
| Criação e edição de skills | `resources/instructions/skill-creation/guide.md` |
| Descobrir, contratar e manter skills | `resources/instructions/skill-manager/guide.md` |
| Preparação, controle do computador e captura de tela | `resources/instructions/prepare-computer/guide.md`, com referências por ferramenta |
| Publicação de site | `resources/instructions/publish-website/guide.md` |
| Recuperação e diagnóstico de pesquisa web | Referências internas de pesquisa, ligadas ao procedimento aplicável; sem exigir mecanismo de busca de terceiros |
| Diretrizes gerais e colaboração | Integração interna existente do Studio/Hermes; sem importar regras automáticas de subagentes, worktrees ou “usar superpowers sempre” |
| Atualização Hermes, publicação do aplicativo, manutenção de templates e referências externas | Documentação do mantenedor do projeto; fora do prompt de trabalho do usuário |

O mapa exato por ID fica em `internal_targets` no JSON. São destinos de revisão,
não autorização para copiar essas fontes integralmente. Uma instrução de outro
harness só entra se resolver uma necessidade concreta e usar as ferramentas reais
do Studio. Descartar o restante durante a revisão. Reaproveitar também os guias
existentes de design e criação de sites; não duplicar sua operação no Michelangelo.

Manter no prompt geral apenas os apontadores curtos existentes, com gatilho e
caminho do guia. Os corpos são lidos conforme a tarefa. Não criar frontmatter
`SKILL.md` para esses guias nem adicioná-los à galeria.

Separar instrução interna de dependência nativa: `hermes-agent` (119) e
`skill-search` (152) não viram produtos plugáveis, mas não serão apagados do
upstream/runtime se o prompt ou uma ferramenta nativa ainda exigir esses nomes.
Verificar a referência nativa antes de ocultar ou reorganizar sua distribuição.

Monitoramento e panorama do dia utilizam Rotinas quando o usuário pedir recorrência.
Nenhuma consolidação importa `/loop`, agendador próprio ou promessa de despertar de
Cursor/Codex. Os cortes de 040 e da família Cursor permanecem valendo.

## Prompts

São 14 fontes promovidas a prompts: 389, 390, 187, 312, 110, 113, 412, 029, 031,
122, 128, 243, 287 e 148. Handoff (030) fica fora dessa lista.

Usar `prompts/catalog.json`, com PT-BR e inglês, e aproveitar pedido equivalente
já existente antes de criar outro. A descrição do pedido não instala skill,
não envia mensagem, não agenda recorrência nem executa efeito externo. Os dois
presets visuais (029/031) podem apontar a Michelangelo, mas não voltam a skills.

## Distribuição e compatibilidade

O catálogo desejado tem uma entrada por especialista, apontando para seu pacote
em `skills/`. A reconciliação abrange `gallery.json` deste repositório e o espelho
usado pelo Desktop. Remover instruções internas e capacidades descartadas dos
índices; não alterar a configuração pessoal de busca ou ativação.

A restrição atual do adaptador é até 100 arquivos, 4 MiB de texto UTF-8 e sem
binários, com recursos nas pastas permitidas. A edição da biblioteca não altera
esses limites. Consolidar e editar referências redundantes; preservar scripts
necessários, licenças e atribuições. Conferir o pacote inteiro em vez de validar
somente seu Markdown. Não colocar código externo, fontes ou dependências em
base64 para contornar o contrato.

O editor de vídeos existente requer uma resolução específica de distribuição:
tem cerca de 241 arquivos, 4,7 MB e binários, com Python 3.11–3.12, Node 22+ e
FFmpeg. Renomeá-lo Tarantino não o torna compatível com a contratação atual.
Preservar o motor e sua instalação documentada, e produzir um pacote distribuível
pelos mecanismos existentes, com dependências obtidas de fontes oficiais e versões
fixadas quando o motor precisar. Não substituir o editor por um resumo de instruções.
Se isso exigir alterar o adaptador do Desktop, registrar o desvio e seu footprint
no plano coordenado antes dessa alteração. O pacote não ganha uma entrada que
prometa contratação funcional sem a preparação nativa passar.

A mesma checagem vale para fontes, modelos, ferramentas locais, software gráfico
e contas/conectores dos outros especialistas. O especialista pode existir com
modos que dependem de ferramenta opcional; a instrução verifica a disponibilidade
antes de usá-la e declara o requisito quando ele for material para a tarefa.

## Proveniência e incorporação de fontes

Os 179 itens retidos são fontes de capacidades; não são 179 autorizações para
copiar pacotes. A incorporação exige registrar autor, origem, revisão, licença,
arquivos adotados e mudanças. Usar bases próprias e redistribuíveis. Licença MIT
da raiz não transforma material externo em conteúdo MIT.

Os motores de formatos devem partir das bases nativas/redistribuíveis já usadas
pelo Studio. Não importar os pacotes source-available de documentos Anthropic
para esta biblioteca pública MIT. Referências de fontes não redistribuíveis
podem orientar a comparação, mas seu texto e código não entram no pacote.
Licença ausente ou incompatível significa manter somente a referência, escolher
base permitida ou escrever implementação própria; não usar cópia disfarçada.

O relatório público registra IDs, hashes normalizados e URLs de fontes quando
existem. Não publica corpos pessoais, caminhos de usuário ou credenciais. O
inventário privado permanece apenas como evidência local da análise anterior.

## Verificação e fronteira de entrega

A segunda curadoria deve demonstrar cobertura de 408 itens e 448 IDs, todos os
cortes explícitos, 26 conjuntos com origem Cursor removidos da composição, união
dos pares pedidos, ausência de instruções plugáveis, Handoff preservado e nenhum
item sem destino. Os filtros do relatório precisam encontrar aliases e IDs sem S.

A futura implementação deve verificar cada pacote, recursos/referências locais,
licenças, guard e preparação nativa; validar índice e espelho coordenados; exercitar
pelo menos os fluxos centrais DOCX, XLSX, PDF, PPTX, design, UX, vídeo e handoff.
Só checks estáticos não demonstram uso real. Contas, conectores ou dependências
ausentes ficam declarados por modo. Não executar suites inteiras do aplicativo
para fechar uma revisão documental.

Na entrega desta revisão: relatório e desenho estão no checkout. Migração de
skills/prompts/índices e revisão das instruções internas continuam pendentes.
Não houve push, publicação nem alteração de instalações pessoais.

## O que fica a cargo da implementação

O responsável pode escolher o agrupamento final de arquivos de referência,
aproveitar prompts equivalentes, eliminar redundâncias editoriais, adaptar paths
e comandos e definir checks por modo. Não pode reabrir cortes ou nomes definidos
pelo usuário, ressuscitar variantes removidas, apagar recursos necessários,
inventar ferramentas, importar fontes sem licença ou alegar execução não comprovada.

O plano de implementação deve separar migração da biblioteca, reconciliação de
índices/prompts, instruções internas do Desktop e preparação nativa dos pacotes,
com footprint e evidências de cada unidade. A biblioteca aprovada é o destino;
instalações pessoais e publicação remota permanecem fora do escopo.

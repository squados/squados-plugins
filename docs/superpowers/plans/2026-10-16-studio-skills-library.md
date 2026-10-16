# Migração da biblioteca de especialistas — plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans para executar este plano nesta sessão, tarefa por tarefa, com revisão independente final.

**Goal:** Entregar a biblioteca aprovada de 20 especialistas/assistentes em `squados-plugins/skills`, com Flavio para vendas e Maslow para pessoas, modos sob demanda, recursos técnicos preservados, prompts e instruções internas em seus destinos.

**Architecture:** Cada especialista usa o formato nativo Agent Skills: `SKILL.md` curto, referências por tarefa e scripts/recursos necessários. O catálogo público aponta somente aos pacotes consolidados; procedimentos do Studio continuam nos guias internos existentes. Reaproveitar os motores nativos Hermes de documentos e o editor de vídeo existente, sem criar um runtime de skills.

**Tech Stack:** Markdown, JSON, Python, Node; formato Agent Skills; guard/preparação nativa Hermes; contratos TypeScript existentes do Desktop.

**Spec:** `docs/superpowers/specs/2026-10-16-studio-skills-library-design.md`, com nomes finais Flavio e Maslow aprovados em 16/10/2026.

**FOOTPRINT:** neste repo: `skills/`, `gallery.json`, `prompts/`, `docs/skill-curation/`, documentação de skills em `docs/`, este plano e a spec, `scripts/verify-skills.py`; README/AGENTS somente nos trechos de biblioteca, preservando WIP. No Desktop: `docs/squados-skills/gallery.json`, cópia incluída do catálogo de prompts pelo sync existente, `resources/instructions/`, documentação de mantenedor e checks focados de conteúdo. Não alterar instalações pessoais, configurações ou credenciais. Mudança do adaptador só se o empacotamento não puder satisfazer seu contrato atual.

**ESTIMATIVA:** 2–4 horas de agente, incluindo preparação, leitura/licenças, edição, checks e revisão. Tarefas 2/3 são `▶ Paralelizáveis` por pasta; execução escolhida pelo agente é Native nesta sessão, conforme o pedido “prossiga”, sem nova rodada de aprovação do escopo já fechado.

## Restrições globais

- Main nos dois repositórios; preservar WIP de outras sessões; commits cirúrgicos; sem push/publicação.
- Excluir todos os cortes por ID/família e toda origem Cursor; não ressuscitar variantes.
- Vinte pacotes: michelangelo, tarantino, audio, krug, warren, zuck, flavio, gutenberg, linus, drucker, maslow, darwin, figma, notion, google-workspace, obsidian, shop, shopify, telephony, handoff.
- Figma separado; transcrição/Whisper fora de Tarantino; comercial fora de Zuck; Supabase/Playwright ficam em Linus.
- Nomes, descrições, licença e pasta válidos; descriptions próprias até 120 caracteres.
- Até 100 arquivos, 4 MiB UTF-8, sem binários no pacote preparado. Não codificar binários para contornar o contrato.
- Recursos executáveis, templates e licenças não podem ser perdidos por copiar apenas Markdown. Dependências podem ser preparadas pelo mecanismo documentado do pacote.
- Não redistribuir pacotes source-available de formatos Anthropic nem código/texto externo sem licença; registrar fontes consultadas sem copiar quando necessário.
- Procedimentos de plataforma ficam em `resources/instructions/*/guide.md`, com apontadores e referências sob demanda. Dependências nativas exigidas pelo Hermes permanecem no runtime.

## Review Focus

- Ativar Michelangelo não deve carregar operação Figma; pedir só transcrição não deve carregar Tarantino; pedir proposta comercial não deve carregar Zuck.
- Pacote baixado sem checkout de desenvolvimento deve resolver todos os scripts, imports, recursos, fontes e links relativos usados pelo seu modo.
- DOCX/XLSX/PPTX/PDF editados precisam conservar estrutura e passar por verificação de conteúdo; ler um ZIP não comprova renderização.
- Uma fonte sem licença clara deve aparecer como referência consultada, sem seu código/texto redistribuído disfarçadamente.
- O índice e seu espelho devem apontar aos mesmos 20 pacotes; nenhuma remoção pode desaparecer só da documentação e continuar como cartão antigo.

## Tarefa 1: fechar nomes e preparar evidências/contratos (15–25 min)

**Arquivos:** spec, ledger, `docs/skill-curation/`, `scripts/verify-skills.py`.

**Interfaces:** consome os 408 registros/448 aliases da classificação; produz mapa final de 20 pacotes e verificador do contrato de distribuição.

- [ ] Registrar Flavio e Maslow como definidos; eliminar sugestões antigas do desenho ativo.
- [ ] Fixar o inventário das fontes antes da migração e auditar licença, scripts e recursos das bases escolhidas. Identificar incorporação versus referência consultada.
- [ ] Criar verificador do contrato real: nomes/descrições/licenças, 20 caminhos, limites, recursos relativos, ausência de fontes pessoais/segredos e entradas antigas.
- [ ] Executar contra estado anterior; esperar falha por biblioteca ainda não migrada.

## Tarefa 2: consolidar especialistas de trabalho e integrações (35–70 min) ▶ Paralelizável

**Arquivos:** `skills/{krug,warren,zuck,flavio,drucker,maslow,darwin,figma,notion,google-workspace,obsidian,shop,shopify,telephony,handoff,audio,linus}/`.

**Interfaces:** cada pasta fornece `SKILL.md`, referências de modos e recursos técnicos próprios. Proveniência por pacote distingue métodos próprios, conteúdo licenciado incorporado e fontes apenas consultadas.

- [ ] Reaproveitar referências dos especialistas próprios e escrever entradas que escolham o modo pela tarefa, sem ler todo o pacote.
- [ ] Integrar técnicas complementares retidas, eliminar duplicações e comandos/caminhos de harness pessoal; não concatenar integralmente as fontes no prompt principal.
- [ ] Unificar MCP/mcporter e os dois Playwright dentro de Linus; separar integrações conforme a spec.
- [ ] Preservar os scripts reais necessários aos modos de integração e áudio. Ferramenta opcional exige detecção do requisito, sem alegar instalação universal.
- [ ] Rodar verificação de links/imports e checks locais de scripts sem credenciais, sem efetuar chamadas que alterem contas externas.

## Tarefa 3: preservar Gutenberg, Michelangelo e Tarantino (40–90 min) ▶ Paralelizável

**Arquivos:** `skills/{gutenberg,michelangelo,tarantino}/`, seus scripts, referências, templates e licenças.

**Interfaces:** Gutenberg fornece os quatro motores de arquivo; Michelangelo fornece métodos visuais e detector existente; Tarantino fornece o editor completo e preparação reproduzível.

- [ ] Gutenberg: incorporar as bases nativas Hermes DOCX/PDF/PPTX/XLSX e métodos próprios de análise de dados/redação, mantendo scripts e suas licenças. Rotear por formato e finalidade.
- [ ] Michelangelo: partir da skill existente, preservar detector e referências úteis; integrar os demais modos visuais retidos sem Figma e sem dependências pessoais.
- [ ] Tarantino: preservar motor, contratos, efeitos e instalação do editor. Reorganizar arquivos em diretórios aceitos; reduzir distribuição de desenvolvimento ao necessário; tratar dependências/binários por instalação documentada, sem perda de avisos legais.
- [ ] Exercitar criação/leitura/edição de DOCX/XLSX/PPTX/PDF com arquivos reais em scratch e validação estrutural. Render quando houver dependência disponível; registrar limitação real.
- [ ] Executar os checks existentes do detector e do editor de vídeo, incluindo prepare/render/QA com amostra local quando suportado; distinguir prova do motor e uso por agente.

## Tarefa 4: migrar prompts e instruções internas (20–35 min)

**Arquivos:** `prompts/catalog.json`, documentação do acervo; Desktop `resources/instructions/` e documentação do mantenedor.

**Interfaces:** prompts seguem o schema existente nos dois idiomas; guias são carregados pelos apontadores existentes, sem SKILL.md plugável.

- [ ] Reaproveitar pedidos equivalentes dos 136 prompts e acrescentar somente lacunas das 14 fontes promovidas. Handoff permanece skill.
- [ ] Rever as 42 fontes internas e integrar somente o método aplicável aos guias existentes, com referências por tema. Não importar exigências automáticas de outro harness.
- [ ] Preservar dependências nativas hermes-agent/skill-search; procedimentos de mantenedor não entram no prompt de usuário.
- [ ] Verificar links dos guias e ausência de procedimentos plugáveis; rodar testes focados de procedimentos e catálogo de prompts pelo script do Desktop.

## Tarefa 5: substituir pacotes/índices antigos e preparar nativamente (20–40 min)

**Arquivos:** pacotes próprios substituídos, `gallery.json`, espelho Desktop, documentação de biblioteca/estado, evidências de `docs/skill-curation/`.

**Interfaces:** ambos os índices apontam aos mesmos 20 pacotes, com títulos e descrições PT-BR/en; propostas passam pelo guard/preparação existente.

- [ ] Confirmar novos destinos antes de remover os 35 pacotes próprios anteriores e seus cartões. Resolver os caminhos e verificar escopo absoluto antes de qualquer remoção.
- [ ] Criar índice curado dos 20 pacotes e reconciliar espelho; sincronizar prompts pelo script existente.
- [ ] Conferir todo pacote com o verificador; exercitar guard e preparação real em perfil de teste dentro do repo, sem instalar no perfil pessoal.
- [ ] Rodar testes focados de galeria, conteúdo, serviço e procedimentos; ler skips/falhas e resolver causas no footprint.
- [ ] Atualizar relatório navegável e documentação para estado realmente implementado, com fontes incorporadas/consultadas e limitações de execução.

## Tarefa 6: revisão final, correções e entrega (15–25 min)

**Arquivos:** evidências, ledger, correções dentro do footprint.

- [ ] Revisar critério por critério contra os arquivos finais, com file:line e ✅/❌ em relatório de aceite.
- [ ] Despachar uma revisão independente final conforme executing-plans, com spec, plano, Review Focus e decisões do ledger. Corrigir problemas importantes e rever os checks afetados.
- [ ] Commitar unidades verificadas com paths explícitos; conferir conteúdo de HEAD, integração em main e preservação do WIP.
- [ ] Entregar contagem final, testes realizados, limitações concretas e estado sem publicação. Não alegar contas/conectores autenticados quando não foram exercitados.

# Segunda curadoria da biblioteca de skills

Segunda curadoria: decisões registradas; composição adicional proposta; pacotes e catálogos ainda não alterados.

O destino é `squados-plugins/skills`. As fontes pessoais foram evidência da primeira avaliação; não são destino de instalação, exclusão ou publicação.

Cobertura: **408 conjuntos de instruções, 448 IDs originais, 20 especialistas propostos**.

| Destino | Conjuntos de instruções |
|---|---:|
| Reunir em especialista | 179 |
| Promover a prompt | 14 |
| Instruções da plataforma | 42 |
| Remover da biblioteca | 173 |

## Biblioteca proposta

| Pacote | Especialista | Modos | Fontes |
|---|---|---|---:|
| `skills/michelangelo` | Michelangelo - Designer | Identidade e marcas; Interfaces web e mobile; Design por imagem; Peças gráficas e ilustração; Infográficos e diagramas; Apresentações e narrativa visual; SVG, ícones e animação; Canvases visuais | 44 |
| `skills/tarantino` | Tarantino - Editor de Vídeos | Criação de vídeos; Roteiro e decupagem; Montagem e cortes; Motion e efeitos; Legendas no vídeo; Renderização e exportação | 2 |
| `skills/audio` | Áudio, Voz e Transcrição | Transcrição e Whisper; Síntese de voz; Áudio e música; Transcrições de vídeos | 5 |
| `skills/krug` | Krug - Especialista em UX | Auditoria de jornadas; Clareza e fricção; Testes de usabilidade; Conversão e checkout; Engajamento e gamificação | 4 |
| `skills/warren` | Warren - CFO | Planejamento e caixa; Contas a pagar e receber; Demonstrações e conciliação; Análise de variações; Valuation e modelos financeiros; Preços e investimentos; Operações de pagamento | 13 |
| `skills/zuck` | Zuck - O Marketeiro | Estratégia de marketing; Conteúdo e copywriting; Redes sociais e carrosséis; SEO; Tráfego e mensuração; Ideação de campanhas | 8 |
| `skills/sales` | Vendas e Negociação | Inteligência comercial e mercado; Prospecção e qualificação; Propostas comerciais; Negociação e fechamento; Treinamento de vendas; E-commerce e catálogo comercial; Relacionamento e sucesso do cliente | 10 |
| `skills/gutenberg` | Gutenberg - Documentos e Dados | Word e documentos; PDF, OCR e formulários; Planilhas e fórmulas; PowerPoint e templates; Análise e tratamento de dados; Redação e comunicação de trabalho | 17 |
| `skills/linus` | Linus - Engenheiro de Software | Código e arquitetura; GitHub e revisão; Desenvolvimento e operação MCP; Banco e Supabase; Segurança; Navegador e testes; APIs e diagnóstico; Infraestrutura e publicação; IA e modelos | 35 |
| `skills/drucker` | Drucker - Gestor de Operações | Projetos e execução; Produto e prioridades; Qualidade; Compras e fornecedores; Estoque e logística; Contratos e obrigações; Panorama do dia | 8 |
| `skills/people` | Especialista em Pessoas | Recrutamento e seleção; Integração e capacitação; Treinamento; Feedback e desenvolvimento | 3 |
| `skills/darwin` | Darwin - Pesquisador | Pesquisa com fontes e citações; Artigos e arXiv; Reddit e RSS; Pesquisa geográfica; Verificação de informação pública; Escrita científica | 7 |
| `skills/figma` | Assistente Figma | Leitura de arquivos; Criação e edição; Componentes e bibliotecas; Plugin API; Implementação a partir do Figma | 8 |
| `skills/notion` | Assistente Notion | Páginas e bases; Captura de conhecimento; Reuniões; Pesquisa; Planos e implementação | 8 |
| `skills/google-workspace` | Assistente Google Workspace | Email e agenda; Drive; Docs, Sheets e Slides | 2 |
| `skills/obsidian` | Assistente Obsidian | Vaults e notas; Busca e links; Organização | 1 |
| `skills/shop` | Assistente Shop | Catálogo; Compras; Pedidos e devoluções | 1 |
| `skills/shopify` | Assistente Shopify | Produtos e catálogo; Pedidos e clientes; Estoque e metafields | 1 |
| `skills/telephony` | Assistente de Telefonia | Números e SMS/MMS; Chamadas; Diagnóstico de provedores | 1 |
| `skills/handoff` | Handoff | Continuação em nova sessão | 1 |

Os modos são referências internas escolhidas pela tarefa; a pessoa só precisa lembrar do especialista. Assistentes de aplicações ficam separados; somente modos da mesma aplicação são reunidos.

## Mapa completo por ID

Os IDs e aliases da primeira revisão foram preservados. Nenhum item ficou sem destino.

| ID e aliases | Origem avaliada | Classificação anterior | Destino revisado | Motivo |
|---|---|---|---|---|
| S001 | academy-guide | Descartar por baixo valor | Remover da biblioteca: Fora da biblioteca | Recomenda cursos do ecossistema Claude; pouco valor no catálogo de trabalho do Studio. |
| S002 | algorithmic-art | Juntar | Remover da biblioteca: Fora da biblioteca | Aplicar o corte à mesma capacidade/família, inclusive a variantes não agrupadas pelo texto: Arte generativa p5.js. |
| S003 | brand-guidelines | Descartar por baixo valor | Remover da biblioteca: Fora da biblioteca | Impõe cores e fontes da Anthropic; não é um sistema de marca genérico nem a identidade do usuário. |
| S004, S018 | canvas-design | Juntar | Reunir em especialista: Michelangelo - Designer | Toda a direção e produção visual; parte da skill Michelangelo existente. |
| S005 | claude-api | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S005. |
| S006 | discernment-nudge | Descartar por baixo valor | Remover da biblioteca: Fora da biblioteca | Acrescenta perguntas reflexivas a respostas comuns; regra conversacional não justifica pacote próprio. |
| S007 | doc-coauthoring | Juntar | Reunir em especialista: Gutenberg - Documentos e Dados | Reúne as capacidades técnicas DOCX, PDF, XLSX e PPTX, com scripts e verificação por formato. |
| S008 | docx | Juntar | Reunir em especialista: Gutenberg - Documentos e Dados | Reúne as capacidades técnicas DOCX, PDF, XLSX e PPTX, com scripts e verificação por formato. |
| S009 | frontend-design | Juntar | Reunir em especialista: Michelangelo - Designer | Toda a direção e produção visual; parte da skill Michelangelo existente. |
| S010 | internal-comms | Juntar | Reunir em especialista: Gutenberg - Documentos e Dados | Reúne as capacidades técnicas DOCX, PDF, XLSX e PPTX, com scripts e verificação por formato. |
| S011 | mcp-builder | Manter como skill | Reunir em especialista: Linus - Engenheiro de Software | Reúne desenvolvimento, ferramentas de programação e operação técnica. Desenvolvimento e operação MCP têm uma única entrada e referências próprias. |
| S012 | pptx | Juntar | Reunir em especialista: Gutenberg - Documentos e Dados | Reúne as capacidades técnicas DOCX, PDF, XLSX e PPTX, com scripts e verificação por formato. |
| S013 | skill-creator | Instruções da plataforma | Instruções da plataforma: skill-creation/guide.md | Orientação operacional do Studio, acessada por tarefa. Revisar o conteúdo útil e incorporar ao procedimento existente; sem cartão selecionável ou cópia integral de outro harness. |
| S014 | slack-gif-creator | Manter como skill | Reunir em especialista: Michelangelo - Designer | Toda a direção e produção visual; parte da skill Michelangelo existente. |
| S015 | theme-factory | Juntar | Reunir em especialista: Michelangelo - Designer | Toda a direção e produção visual; parte da skill Michelangelo existente. |
| S016 | webapp-testing | Manter como skill | Reunir em especialista: Linus - Engenheiro de Software | Reúne desenvolvimento, ferramentas de programação e operação técnica. |
| S017 | brandkit | Manter como skill | Reunir em especialista: Michelangelo - Designer | Toda a direção e produção visual; parte da skill Michelangelo existente. |
| S019 | carrossel-instagram | Manter como skill | Reunir em especialista: Zuck - O Marketeiro | Marketing, conteúdo, copy, redes sociais, SEO, tráfego e mensuração de campanhas. |
| S020 | deploy-vercel | Juntar | Reunir em especialista: Linus - Engenheiro de Software | Reúne desenvolvimento, ferramentas de programação e operação técnica. |
| S021 | design-taste-frontend | Juntar | Reunir em especialista: Michelangelo - Designer | Toda a direção e produção visual; parte da skill Michelangelo existente. |
| S022 | dnd-illustration | Adaptar antes de aproveitar | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S022. |
| S023 | docs | Descartar por incompatibilidade | Remover da biblioteca: Fora da biblioteca | Só encaminha a um conector Docs do Claude e exige seu protocolo de criação; não possui capacidade portável própria. |
| S024 | docx | Juntar | Reunir em especialista: Gutenberg - Documentos e Dados | Reúne as capacidades técnicas DOCX, PDF, XLSX e PPTX, com scripts e verificação por formato. |
| S025 | dont-make-me-think | Juntar | Reunir em especialista: Krug - Especialista em UX | Melhora como as pessoas entendem e usam um produto. |
| S026 | find-skills | Instruções da plataforma | Instruções da plataforma: skill-manager/guide.md | Orientação operacional do Studio, acessada por tarefa. Revisar o conteúdo útil e incorporar ao procedimento existente; sem cartão selecionável ou cópia integral de outro harness. |
| S027 | gamification | Manter como skill | Reunir em especialista: Krug - Especialista em UX | Melhora como as pessoas entendem e usam um produto. |
| S028 | google-workspace | Juntar | Reunir em especialista: Assistente Google Workspace | Opera a suíte Google Workspace, com referências por serviço e operação. |
| S029 | gpt-taste | Promover a prompt | Promover a prompt: Direção visual de uma página | Pedido reutilizável no catálogo de prompts. O especialista fornece o método ou mecanismo; o prompt só descreve a entrega. |
| S030 | handoff | Promover a prompt | Reunir em especialista: Handoff | Prepara uma passagem de contexto verificável para continuar o trabalho em outra sessão. |
| S031 | high-end-visual-design | Promover a prompt | Promover a prompt: Direção visual de uma página | Pedido reutilizável no catálogo de prompts. O especialista fornece o método ou mecanismo; o prompt só descreve a entrega. |
| S032 | ibeia-diagnostico-empresa | Adaptar antes de aproveitar | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S032. |
| S033 | ibeia-diagnostico-individual | Juntar | Remover da biblioteca: Fora da biblioteca | Aplicar o corte à mesma capacidade/família, inclusive a variantes não agrupadas pelo texto: Diagnóstico de IA individual. |
| S034 | ibeia-diagnostico-individuo | Adaptar antes de aproveitar | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S034. |
| S035 | image-to-code | Juntar | Reunir em especialista: Michelangelo - Designer | Toda a direção e produção visual; parte da skill Michelangelo existente. |
| S036 | imagegen-frontend-mobile | Juntar | Reunir em especialista: Michelangelo - Designer | Toda a direção e produção visual; parte da skill Michelangelo existente. |
| S037 | imagegen-frontend-web | Juntar | Reunir em especialista: Michelangelo - Designer | Toda a direção e produção visual; parte da skill Michelangelo existente. |
| S038 | impeccable | Juntar | Reunir em especialista: Michelangelo - Designer | Toda a direção e produção visual; parte da skill Michelangelo existente. |
| S039 | import-memory | Descartar por incompatibilidade | Remover da biblioteca: Fora da biblioteca | Importa para as ferramentas privadas de memória do Claude; não é o modelo de memória do Studio. |
| S040 | loop-goal | Adaptar antes de aproveitar | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S040. |
| S041 | michelangelo | Adaptar antes de aproveitar | Reunir em especialista: Michelangelo - Designer | Toda a direção e produção visual; parte da skill Michelangelo existente. |
| S042 | morning | Adaptar antes de aproveitar | Reunir em especialista: Drucker - Gestor de Operações | Organiza o trabalho e os processos operacionais da empresa. |
| S043 | pdf | Juntar | Reunir em especialista: Gutenberg - Documentos e Dados | Reúne as capacidades técnicas DOCX, PDF, XLSX e PPTX, com scripts e verificação por formato. |
| S044 | pptx | Juntar | Reunir em especialista: Gutenberg - Documentos e Dados | Reúne as capacidades técnicas DOCX, PDF, XLSX e PPTX, com scripts e verificação por formato. |
| S045 | publish-chrome-webstore | Adaptar antes de aproveitar | Reunir em especialista: Linus - Engenheiro de Software | Reúne desenvolvimento, ferramentas de programação e operação técnica. |
| S046 | redesign-existing-projects | Juntar | Reunir em especialista: Michelangelo - Designer | Toda a direção e produção visual; parte da skill Michelangelo existente. |
| S047 | relatorio-diario | Adaptar antes de aproveitar | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S047. |
| S048 | security-review | Juntar | Reunir em especialista: Linus - Engenheiro de Software | Reúne desenvolvimento, ferramentas de programação e operação técnica. |
| S049 | seo-audit | Juntar | Reunir em especialista: Zuck - O Marketeiro | Marketing, conteúdo, copy, redes sociais, SEO, tráfego e mensuração de campanhas. |
| S050 | skill-creator | Instruções da plataforma | Instruções da plataforma: skill-creation/guide.md | Orientação operacional do Studio, acessada por tarefa. Revisar o conteúdo útil e incorporar ao procedimento existente; sem cartão selecionável ou cópia integral de outro harness. |
| S051 | supabase | Manter como skill | Reunir em especialista: Linus - Engenheiro de Software | Reúne desenvolvimento, ferramentas de programação e operação técnica. |
| S052 | supabase-postgres-best-practices | Juntar | Reunir em especialista: Linus - Engenheiro de Software | Reúne desenvolvimento, ferramentas de programação e operação técnica. |
| S053 | svg | Manter como skill | Reunir em especialista: Michelangelo - Designer | Toda a direção e produção visual; parte da skill Michelangelo existente. |
| S054 | svg-icon | Juntar | Reunir em especialista: Michelangelo - Designer | Toda a direção e produção visual; parte da skill Michelangelo existente. |
| S055 | telegram-send | Adaptar antes de aproveitar | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S055. |
| S056 | web-artifacts-builder | Adaptar antes de aproveitar | Reunir em especialista: Michelangelo - Designer | Toda a direção e produção visual; parte da skill Michelangelo existente. |
| S057 | xlsx | Juntar | Reunir em especialista: Gutenberg - Documentos e Dados | Reúne as capacidades técnicas DOCX, PDF, XLSX e PPTX, com scripts e verificação por formato. |
| S058 | app-review-screencast | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S058. |
| S059 | imagegen | Juntar | Reunir em especialista: Michelangelo - Designer | Toda a direção e produção visual; parte da skill Michelangelo existente. |
| S060 | openai-docs | Juntar | Reunir em especialista: Linus - Engenheiro de Software | Reúne desenvolvimento, ferramentas de programação e operação técnica. |
| S062 | review-agent | Instruções da plataforma | Instruções da plataforma: development/guide.md | Orientação operacional do Studio, acessada por tarefa. Revisar o conteúdo útil e incorporar ao procedimento existente; sem cartão selecionável ou cópia integral de outro harness. |
| S064 | skill-creator | Instruções da plataforma | Instruções da plataforma: skill-creation/guide.md | Orientação operacional do Studio, acessada por tarefa. Revisar o conteúdo útil e incorporar ao procedimento existente; sem cartão selecionável ou cópia integral de outro harness. |
| S065 | skill-installer | Descartar por incompatibilidade | Remover da biblioteca: Fora da biblioteca | Instala skills em CODEX_HOME e orienta reiniciar Codex; o Studio já tem instalador e propostas nativos. |
| S066 | motion-react | Manter como skill | Reunir em especialista: Michelangelo - Designer | Toda a direção e produção visual; parte da skill Michelangelo existente. |
| S067 | automate | Descartar por incompatibilidade | Remover da biblioteca: Fora da biblioteca | Excluir todas as fontes Cursor, inclusive SDK, instruções internas e cópias pessoais. Técnicas independentes só sobrevivem nas bases não Cursor identificadas separadamente. |
| S068 | autopilot | Juntar | Remover da biblioteca: Fora da biblioteca | Excluir todas as fontes Cursor, inclusive SDK, instruções internas e cópias pessoais. Técnicas independentes só sobrevivem nas bases não Cursor identificadas separadamente. |
| S069 | canvas | Descartar por incompatibilidade | Remover da biblioteca: Fora da biblioteca | Excluir todas as fontes Cursor, inclusive SDK, instruções internas e cópias pessoais. Técnicas independentes só sobrevivem nas bases não Cursor identificadas separadamente. |
| S070 | create-hook | Descartar por incompatibilidade | Remover da biblioteca: Fora da biblioteca | Excluir todas as fontes Cursor, inclusive SDK, instruções internas e cópias pessoais. Técnicas independentes só sobrevivem nas bases não Cursor identificadas separadamente. |
| S071 | create-rule | Descartar por incompatibilidade | Remover da biblioteca: Fora da biblioteca | Excluir todas as fontes Cursor, inclusive SDK, instruções internas e cópias pessoais. Técnicas independentes só sobrevivem nas bases não Cursor identificadas separadamente. |
| S072 | create-skill | Descartar por incompatibilidade | Remover da biblioteca: Fora da biblioteca | Excluir todas as fontes Cursor, inclusive SDK, instruções internas e cópias pessoais. Técnicas independentes só sobrevivem nas bases não Cursor identificadas separadamente. |
| S073 | create-subagent | Descartar por incompatibilidade | Remover da biblioteca: Fora da biblioteca | Excluir todas as fontes Cursor, inclusive SDK, instruções internas e cópias pessoais. Técnicas independentes só sobrevivem nas bases não Cursor identificadas separadamente. |
| S074 | goal | Descartar por incompatibilidade | Remover da biblioteca: Fora da biblioteca | Excluir todas as fontes Cursor, inclusive SDK, instruções internas e cópias pessoais. Técnicas independentes só sobrevivem nas bases não Cursor identificadas separadamente. |
| S075 | loop | Descartar por incompatibilidade | Remover da biblioteca: Fora da biblioteca | Excluir todas as fontes Cursor, inclusive SDK, instruções internas e cópias pessoais. Técnicas independentes só sobrevivem nas bases não Cursor identificadas separadamente. |
| S076 | migrate-to-skills | Descartar por incompatibilidade | Remover da biblioteca: Fora da biblioteca | Excluir todas as fontes Cursor, inclusive SDK, instruções internas e cópias pessoais. Técnicas independentes só sobrevivem nas bases não Cursor identificadas separadamente. |
| S077 | new-repo | Descartar por incompatibilidade | Remover da biblioteca: Fora da biblioteca | Excluir todas as fontes Cursor, inclusive SDK, instruções internas e cópias pessoais. Técnicas independentes só sobrevivem nas bases não Cursor identificadas separadamente. |
| S078 | onboard | Descartar por incompatibilidade | Remover da biblioteca: Fora da biblioteca | Excluir todas as fontes Cursor, inclusive SDK, instruções internas e cópias pessoais. Técnicas independentes só sobrevivem nas bases não Cursor identificadas separadamente. |
| S079 | origin | Descartar por incompatibilidade | Remover da biblioteca: Fora da biblioteca | Excluir todas as fontes Cursor, inclusive SDK, instruções internas e cópias pessoais. Técnicas independentes só sobrevivem nas bases não Cursor identificadas separadamente. |
| S080 | rename-chat | Descartar por incompatibilidade | Remover da biblioteca: Fora da biblioteca | Excluir todas as fontes Cursor, inclusive SDK, instruções internas e cópias pessoais. Técnicas independentes só sobrevivem nas bases não Cursor identificadas separadamente. |
| S081 | review | Descartar por incompatibilidade | Remover da biblioteca: Fora da biblioteca | Excluir todas as fontes Cursor, inclusive SDK, instruções internas e cópias pessoais. Técnicas independentes só sobrevivem nas bases não Cursor identificadas separadamente. |
| S082 | review-bugbot | Descartar por incompatibilidade | Remover da biblioteca: Fora da biblioteca | Excluir todas as fontes Cursor, inclusive SDK, instruções internas e cópias pessoais. Técnicas independentes só sobrevivem nas bases não Cursor identificadas separadamente. |
| S083 | review-security | Descartar por incompatibilidade | Remover da biblioteca: Fora da biblioteca | Excluir todas as fontes Cursor, inclusive SDK, instruções internas e cópias pessoais. Técnicas independentes só sobrevivem nas bases não Cursor identificadas separadamente. |
| S084 | sdk | Manter como skill | Remover da biblioteca: Fora da biblioteca | Excluir todas as fontes Cursor, inclusive SDK, instruções internas e cópias pessoais. Técnicas independentes só sobrevivem nas bases não Cursor identificadas separadamente. |
| S085 | share | Descartar por incompatibilidade | Remover da biblioteca: Fora da biblioteca | Excluir todas as fontes Cursor, inclusive SDK, instruções internas e cópias pessoais. Técnicas independentes só sobrevivem nas bases não Cursor identificadas separadamente. |
| S086 | shell | Descartar por baixo valor | Remover da biblioteca: Fora da biblioteca | Excluir todas as fontes Cursor, inclusive SDK, instruções internas e cópias pessoais. Técnicas independentes só sobrevivem nas bases não Cursor identificadas separadamente. |
| S087 | split-to-prs | Juntar | Remover da biblioteca: Fora da biblioteca | Excluir todas as fontes Cursor, inclusive SDK, instruções internas e cópias pessoais. Técnicas independentes só sobrevivem nas bases não Cursor identificadas separadamente. |
| S088 | statusline | Descartar por incompatibilidade | Remover da biblioteca: Fora da biblioteca | Excluir todas as fontes Cursor, inclusive SDK, instruções internas e cópias pessoais. Técnicas independentes só sobrevivem nas bases não Cursor identificadas separadamente. |
| S089 | update-cli-config | Descartar por incompatibilidade | Remover da biblioteca: Fora da biblioteca | Excluir todas as fontes Cursor, inclusive SDK, instruções internas e cópias pessoais. Técnicas independentes só sobrevivem nas bases não Cursor identificadas separadamente. |
| S090 | update-cursor-settings | Descartar por incompatibilidade | Remover da biblioteca: Fora da biblioteca | Excluir todas as fontes Cursor, inclusive SDK, instruções internas e cópias pessoais. Técnicas independentes só sobrevivem nas bases não Cursor identificadas separadamente. |
| S091 | impeccable | Juntar | Remover da biblioteca: Fora da biblioteca | Excluir todas as fontes Cursor, inclusive SDK, instruções internas e cópias pessoais. Técnicas independentes só sobrevivem nas bases não Cursor identificadas separadamente. |
| S092 | svg | Juntar | Remover da biblioteca: Fora da biblioteca | Excluir todas as fontes Cursor, inclusive SDK, instruções internas e cópias pessoais. Técnicas independentes só sobrevivem nas bases não Cursor identificadas separadamente. |
| S093 | impeccable | Juntar | Reunir em especialista: Michelangelo - Designer | Toda a direção e produção visual; parte da skill Michelangelo existente. |
| S094 | airtable | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S094. |
| S095 | apple-notes | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S095. |
| S096 | apple-reminders | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S096. |
| S097 | architecture-diagram | Juntar | Reunir em especialista: Michelangelo - Designer | Toda a direção e produção visual; parte da skill Michelangelo existente. |
| S098 | arxiv | Manter como skill | Reunir em especialista: Darwin - Pesquisador | Método de investigação e fontes especializadas para perguntas de pesquisa. |
| S099 | ascii-video | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S099. |
| S100 | baoyu-infographic | Juntar | Reunir em especialista: Michelangelo - Designer | Toda a direção e produção visual; parte da skill Michelangelo existente. |
| S101 | blocked-page-recovery | Instruções da plataforma | Instruções da plataforma: Pesquisa web — referências de diagnóstico | Orientação operacional do Studio, acessada por tarefa. Revisar o conteúdo útil e incorporar ao procedimento existente; sem cartão selecionável ou cópia integral de outro harness. |
| S102 | box | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S102. |
| S103 | claude-code | Juntar | Remover da biblioteca: Fora da biblioteca | Aplicar o corte à mesma capacidade/família, inclusive a variantes não agrupadas pelo texto: Delegação de programação por CLI. |
| S104 | claude-design | Juntar | Reunir em especialista: Michelangelo - Designer | Toda a direção e produção visual; parte da skill Michelangelo existente. |
| S105 | codebase-inspection | Manter como skill | Reunir em especialista: Linus - Engenheiro de Software | Reúne desenvolvimento, ferramentas de programação e operação técnica. |
| S106 | codex | Juntar | Remover da biblioteca: Fora da biblioteca | Aplicar o corte à mesma capacidade/família, inclusive a variantes não agrupadas pelo texto: Delegação de programação por CLI. |
| S107 | competitor-news-monitor | Adaptar antes de aproveitar | Reunir em especialista: Vendas e Negociação | Reúne as capacidades comerciais retiradas de Zuck: vendas, negociação, prospecção, propostas, mercado, e-commerce e relacionamento. |
| S108 | computer-use | Adaptar antes de aproveitar | Instruções da plataforma: prepare-computer/guide.md | Orientação operacional do Studio, acessada por tarefa. Revisar o conteúdo útil e incorporar ao procedimento existente; sem cartão selecionável ou cópia integral de outro harness. |
| S109 | design-md | Juntar | Reunir em especialista: Michelangelo - Designer | Toda a direção e produção visual; parte da skill Michelangelo existente. |
| S110 | document-to-action-items | Promover a prompt | Promover a prompt: Extrair ações de documentos | Pedido reutilizável no catálogo de prompts. O especialista fornece o método ou mecanismo; o prompt só descreve a entrega. |
| S111 | docx | Manter como skill | Reunir em especialista: Gutenberg - Documentos e Dados | Reúne as capacidades técnicas DOCX, PDF, XLSX e PPTX, com scripts e verificação por formato. |
| S112 | dogfood | Adaptar antes de aproveitar | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S112. |
| S113 | email-inbox-triage | Promover a prompt | Promover a prompt: Organizar a caixa de entrada | Pedido reutilizável no catálogo de prompts. O especialista fornece o método ou mecanismo; o prompt só descreve a entrega. |
| S114 | findmy | Adaptar antes de aproveitar | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S114. |
| S115 | gif-search | Descartar por baixo valor | Remover da biblioteca: Fora da biblioteca | Busca/download de GIF por uma API simples; baixo ganho frente ao pedido e às ferramentas existentes. |
| S116 | github | Juntar | Reunir em especialista: Linus - Engenheiro de Software | Reúne desenvolvimento, ferramentas de programação e operação técnica. |
| S117 | google-workspace | Manter como skill | Reunir em especialista: Assistente Google Workspace | Opera a suíte Google Workspace, com referências por serviço e operação. |
| S118 | grounded-citations | Manter como skill | Reunir em especialista: Darwin - Pesquisador | Método de investigação e fontes especializadas para perguntas de pesquisa. |
| S119 | hermes-agent | Instruções da plataforma | Instruções da plataforma: skill-manager/guide.md | Orientação operacional do Studio, acessada por tarefa. Revisar o conteúdo útil e incorporar ao procedimento existente; sem cartão selecionável ou cópia integral de outro harness. Preservar a dependência nativa exigida pelo Hermes; ocultar da seleção não autoriza apagá-la do runtime. |
| S120 | hermes-agent-skill-authoring | Instruções da plataforma | Instruções da plataforma: skill-creation/guide.md | Orientação operacional do Studio, acessada por tarefa. Revisar o conteúdo útil e incorporar ao procedimento existente; sem cartão selecionável ou cópia integral de outro harness. |
| S121 | himalaya | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S121. |
| S122 | humanizer | Promover a prompt | Promover a prompt: Revisar voz e clareza de um texto | Pedido reutilizável no catálogo de prompts. O especialista fornece o método ou mecanismo; o prompt só descreve a entrega. |
| S123 | imessage | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S123. |
| S124 | inspecting-hermes-desktop-dom | Descartar por incompatibilidade | Remover da biblioteca: Fora da biblioteca | Depura o DOM do Hermes Desktop upstream/hgui e seu CDP, não a janela do SquadOS Studio. |
| S125 | llm-wiki | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S125. |
| S126 | manim-video | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S126. |
| S127 | maps | Manter como skill | Reunir em especialista: Darwin - Pesquisador | Método de investigação e fontes especializadas para perguntas de pesquisa. |
| S128 | meeting-action-items | Promover a prompt | Promover a prompt: Transformar reunião em decisões e tarefas | Pedido reutilizável no catálogo de prompts. O especialista fornece o método ou mecanismo; o prompt só descreve a entrega. |
| S129 | node-inspect-debugger | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S129. |
| S130 | notion | Juntar | Reunir em especialista: Assistente Notion | Opera o Notion; reúne as variantes de Notion em uma única skill da aplicação. |
| S131 | obsidian | Manter como skill | Reunir em especialista: Assistente Obsidian | Opera o Obsidian preservando notas, links e estrutura do vault. |
| S132 | opencode | Juntar | Remover da biblioteca: Fora da biblioteca | Aplicar o corte à mesma capacidade/família, inclusive a variantes não agrupadas pelo texto: Delegação de programação por CLI. |
| S133 | p5js | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S133. |
| S134 | pdf | Manter como skill | Reunir em especialista: Gutenberg - Documentos e Dados | Reúne as capacidades técnicas DOCX, PDF, XLSX e PPTX, com scripts e verificação por formato. |
| S135 | popular-web-designs | Juntar | Reunir em especialista: Michelangelo - Designer | Toda a direção e produção visual; parte da skill Michelangelo existente. |
| S136 | powerpoint | Manter como skill | Reunir em especialista: Gutenberg - Documentos e Dados | Reúne as capacidades técnicas DOCX, PDF, XLSX e PPTX, com scripts e verificação por formato. |
| S137 | product-price-monitor | Adaptar antes de aproveitar | Reunir em especialista: Warren - CFO | Finanças da empresa, modelagem e análise financeira. |
| S138 | python-debugpy | Manter como skill | Reunir em especialista: Linus - Engenheiro de Software | Reúne desenvolvimento, ferramentas de programação e operação técnica. |
| S139 | requesting-code-review | Instruções da plataforma | Instruções da plataforma: development/guide.md | Orientação operacional do Studio, acessada por tarefa. Revisar o conteúdo útil e incorporar ao procedimento existente; sem cartão selecionável ou cópia integral de outro harness. |
| S140 | sdlc-review | Descartar por incompatibilidade | Remover da biblioteca: Fora da biblioteca | Exige ferramentas kanban_show e review lanes de um Kanban não integrado como fluxo do Studio. |
| S141 | simplify-code | Instruções da plataforma | Instruções da plataforma: development/guide.md | Orientação operacional do Studio, acessada por tarefa. Revisar o conteúdo útil e incorporar ao procedimento existente; sem cartão selecionável ou cópia integral de outro harness. |
| S142 | songsee | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S142. |
| S143 | songwriting-and-ai-music | Manter como skill | Reunir em especialista: Áudio, Voz e Transcrição | Reúne transcrição, Whisper, fala e áudio em uma capacidade independente de edição de vídeos. |
| S144 | spike | Instruções da plataforma | Instruções da plataforma: diagnosis/guide.md | Orientação operacional do Studio, acessada por tarefa. Revisar o conteúdo útil e incorporar ao procedimento existente; sem cartão selecionável ou cópia integral de outro harness. |
| S145 | systematic-debugging | Instruções da plataforma | Instruções da plataforma: diagnosis/guide.md | Orientação operacional do Studio, acessada por tarefa. Revisar o conteúdo útil e incorporar ao procedimento existente; sem cartão selecionável ou cópia integral de outro harness. |
| S146 | teams-meeting-pipeline | Adaptar antes de aproveitar | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S146. |
| S147 | test-driven-development | Instruções da plataforma | Instruções da plataforma: development/guide.md | Orientação operacional do Studio, acessada por tarefa. Revisar o conteúdo útil e incorporar ao procedimento existente; sem cartão selecionável ou cópia integral de outro harness. |
| S148 | weekly-review-planning | Promover a prompt | Promover a prompt: Revisar e planejar a semana | Pedido reutilizável no catálogo de prompts. O especialista fornece o método ou mecanismo; o prompt só descreve a entrega. |
| S149 | xlsx | Manter como skill | Reunir em especialista: Gutenberg - Documentos e Dados | Reúne as capacidades técnicas DOCX, PDF, XLSX e PPTX, com scripts e verificação por formato. |
| S150 | xurl | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S150. |
| S151 | youtube-content | Manter como skill | Reunir em especialista: Áudio, Voz e Transcrição | Reúne transcrição, Whisper, fala e áudio em uma capacidade independente de edição de vídeos. |
| S152 | skill-search | Instruções da plataforma | Instruções da plataforma: skill-manager/guide.md | Orientação operacional do Studio, acessada por tarefa. Revisar o conteúdo útil e incorporar ao procedimento existente; sem cartão selecionável ou cópia integral de outro harness. Preservar a dependência nativa exigida pelo Hermes; ocultar da seleção não autoriza apagá-la do runtime. |
| S153 | 1password | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S153. |
| S154 | 3-statement-model | Juntar | Reunir em especialista: Warren - CFO | Finanças da empresa, modelagem e análise financeira. |
| S155 | accelerate | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S155. |
| S156 | actual-setup | Descartar por incompatibilidade | Remover da biblioteca: Fora da biblioteca | Troca/configura o provider de inferência Hermes diretamente, fora das contas/modelos geridos pelo Studio. |
| S157 | adversarial-ux-test | Juntar | Reunir em especialista: Krug - Especialista em UX | Melhora como as pessoas entendem e usam um produto. |
| S158 | agent-merge-conflict-arbiter | Juntar | Reunir em especialista: Linus - Engenheiro de Software | Reúne desenvolvimento, ferramentas de programação e operação técnica. |
| S159 | agentmail | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S159. |
| S160 | ai-presenter-video | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S160. |
| S161 | anatomy | Juntar | Reunir em especialista: Michelangelo - Designer | Toda a direção e produção visual; parte da skill Michelangelo existente. |
| S162 | antigravity-cli | Juntar | Remover da biblioteca: Fora da biblioteca | Aplicar o corte à mesma capacidade/família, inclusive a variantes não agrupadas pelo texto: Delegação de programação por CLI. |
| S163 | archify | Adaptar antes de aproveitar | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S163. |
| S164 | ascii-art | Descartar por baixo valor | Remover da biblioteca: Fora da biblioteca | Banners de terminal e texto ASCII têm baixo valor para o catálogo pretendido; decisão editorial. |
| S165 | ast-grep | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S165. |
| S166 | audiocraft-audio-generation | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S166. |
| S167 | auteur | Juntar | Reunir em especialista: Michelangelo - Designer | Toda a direção e produção visual; parte da skill Michelangelo existente. |
| S168 | axolotl | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S168. |
| S169 | baoyu-article-illustrator | Juntar | Reunir em especialista: Michelangelo - Designer | Toda a direção e produção visual; parte da skill Michelangelo existente. |
| S170 | baoyu-comic | Juntar | Reunir em especialista: Michelangelo - Designer | Toda a direção e produção visual; parte da skill Michelangelo existente. |
| S171 | bioinformatics | Adaptar antes de aproveitar | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S171. |
| S172 | blackbox | Juntar | Remover da biblioteca: Fora da biblioteca | Aplicar o corte à mesma capacidade/família, inclusive a variantes não agrupadas pelo texto: Delegação de programação por CLI. |
| S173 | blogwatcher | Adaptar antes de aproveitar | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S173. |
| S174 | brag | Adaptar antes de aproveitar | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S174. |
| S175 | brag-slim | Adaptar antes de aproveitar | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S175. |
| S176 | canvas | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S176. |
| S177 | chroma | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S177. |
| S178 | clip | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S178. |
| S179 | cloudflare-temporary-deploy | Juntar | Remover da biblioteca: Fora da biblioteca | Aplicar o corte à mesma capacidade/família, inclusive a variantes não agrupadas pelo texto: Deploy Cloudflare. |
| S180 | code-wiki | Manter como skill | Reunir em especialista: Linus - Engenheiro de Software | Reúne desenvolvimento, ferramentas de programação e operação técnica. |
| S181 | comfyui | Manter como skill | Reunir em especialista: Michelangelo - Designer | Toda a direção e produção visual; parte da skill Michelangelo existente. |
| S182 | comps-analysis | Juntar | Reunir em especialista: Warren - CFO | Finanças da empresa, modelagem e análise financeira. |
| S183 | concept-diagrams | Juntar | Reunir em especialista: Michelangelo - Designer | Toda a direção e produção visual; parte da skill Michelangelo existente. |
| S184 | creative-ideation | Manter como skill | Reunir em especialista: Zuck - O Marketeiro | Marketing, conteúdo, copy, redes sociais, SEO, tráfego e mensuração de campanhas. |
| S185 | darwinian-evolver | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S185. |
| S186 | dcf-model | Juntar | Reunir em especialista: Warren - CFO | Finanças da empresa, modelagem e análise financeira. |
| S187 | decision-questionnaire | Promover a prompt | Promover a prompt: Preparar questionário para uma decisão | Pedido reutilizável no catálogo de prompts. O especialista fornece o método ou mecanismo; o prompt só descreve a entrega. |
| S188 | docker-management | Manter como skill | Reunir em especialista: Linus - Engenheiro de Software | Reúne desenvolvimento, ferramentas de programação e operação técnica. |
| S189 | domain-intel | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S189. |
| S190 | draw-your-font | Manter como skill | Reunir em especialista: Michelangelo - Designer | Toda a direção e produção visual; parte da skill Michelangelo existente. |
| S191 | dream-loop | Adaptar antes de aproveitar | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S191. |
| S192 | drug-discovery | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S192. |
| S193 | dspy | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S193. |
| S194 | duckduckgo-search | Instruções da plataforma | Instruções da plataforma: Pesquisa web — referências de diagnóstico | Orientação operacional do Studio, acessada por tarefa. Revisar o conteúdo útil e incorporar ao procedimento existente; sem cartão selecionável ou cópia integral de outro harness. |
| S195 | dynamic-workflow | Instruções da plataforma | Instruções da plataforma: planning/guide.md | Orientação operacional do Studio, acessada por tarefa. Revisar o conteúdo útil e incorporar ao procedimento existente; sem cartão selecionável ou cópia integral de outro harness. |
| S196 | evaluating-llms-harness | Manter como skill | Reunir em especialista: Linus - Engenheiro de Software | Reúne desenvolvimento, ferramentas de programação e operação técnica. |
| S197 | evm | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S197. |
| S198 | excalidraw | Juntar | Reunir em especialista: Michelangelo - Designer | Toda a direção e produção visual; parte da skill Michelangelo existente. |
| S199 | excel-author | Juntar | Reunir em especialista: Warren - CFO | Finanças da empresa, modelagem e análise financeira. |
| S200 | faiss | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S200. |
| S201 | fastmcp | Manter como skill | Reunir em especialista: Linus - Engenheiro de Software | Reúne desenvolvimento, ferramentas de programação e operação técnica. Desenvolvimento e operação MCP têm uma única entrada e referências próprias. |
| S202 | first-task | Descartar por incompatibilidade | Remover da biblioteca: Fora da biblioteca | Fluxo inicial pressupõe ferramentas de setup/conexão/preview do Hermes Desktop upstream. |
| S203 | fitness-nutrition | Descartar por baixo valor | Remover da biblioteca: Fora da biblioteca | Planejamento de academia/nutrição foge do foco de trabalho/criação do catálogo; não é falta de conteúdo técnico. |
| S204 | flash-attention | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S204. |
| S205 | gitnexus-explorer | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S205. |
| S206 | godmode | Descartar por baixo valor | Remover da biblioteca: Fora da biblioteca | Objetivo central é aplicar jailbreaks de modelos; não corresponde a capacidade de trabalho desejada para este catálogo. |
| S207 | grill-me | Instruções da plataforma | Instruções da plataforma: planning/guide.md | Orientação operacional do Studio, acessada por tarefa. Revisar o conteúdo útil e incorporar ao procedimento existente; sem cartão selecionável ou cópia integral de outro harness. |
| S208 | grok | Juntar | Remover da biblioteca: Fora da biblioteca | Aplicar o corte à mesma capacidade/família, inclusive a variantes não agrupadas pelo texto: Delegação de programação por CLI. |
| S209 | guidance | Manter como skill | Reunir em especialista: Linus - Engenheiro de Software | Reúne desenvolvimento, ferramentas de programação e operação técnica. |
| S210 | har-derived-api-client | Adaptar antes de aproveitar | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S210. |
| S211 | heartmula | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S211. |
| S212 | here-now | Adaptar antes de aproveitar | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S212. |
| S213 | hermes-s6-container-supervision | Descartar por incompatibilidade | Remover da biblioteca: Fora da biblioteca | Administra o s6-overlay da imagem Docker Hermes; o Studio embarcado não é essa distribuição. |
| S214 | honcho | Descartar por incompatibilidade | Remover da biblioteca: Fora da biblioteca | Configura memória Honcho diretamente no Hermes; não corresponde ao modelo de memória aprovado no Studio. |
| S215 | huggingface-hub | Manter como skill | Reunir em especialista: Linus - Engenheiro de Software | Reúne desenvolvimento, ferramentas de programação e operação técnica. |
| S216 | huggingface-tokenizers | Manter como skill | Reunir em especialista: Linus - Engenheiro de Software | Reúne desenvolvimento, ferramentas de programação e operação técnica. |
| S217 | hyperframes | Manter como skill | Reunir em especialista: Tarantino - Editor de Vídeos | Cria e edita vídeos e motion, preservando o motor do editor existente. |
| S218 | hyperliquid | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S218. |
| S219 | impeccable | Juntar | Reunir em especialista: Michelangelo - Designer | Toda a direção e produção visual; parte da skill Michelangelo existente. |
| S220 | inference-sh-cli | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S220. |
| S221 | initiate-setup | Descartar por incompatibilidade | Remover da biblioteca: Fora da biblioteca | Onboarding altera layout, plugins e setup do Hermes Desktop upstream, um aplicativo diferente. |
| S222 | instructor | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S222. |
| S223 | ip-as-logo | Juntar | Reunir em especialista: Michelangelo - Designer | Toda a direção e produção visual; parte da skill Michelangelo existente. |
| S224 | jupyter-notebook | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S224. |
| S225 | kanban-video-orchestrator | Descartar por incompatibilidade | Remover da biblioteca: Fora da biblioteca | Gera perfis e pipeline Kanban externos de produção; não é o fluxo de execução/coordenação do Studio. |
| S226 | lambda-labs | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S226. |
| S227 | lbo-model | Juntar | Reunir em especialista: Warren - CFO | Finanças da empresa, modelagem e análise financeira. |
| S228 | live-dashboard | Adaptar antes de aproveitar | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S228. |
| S229 | llama-cpp | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S229. |
| S230 | llava | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S230. |
| S231 | mcp-oauth-remote-gateway | Descartar por incompatibilidade | Remover da biblioteca: Fora da biblioteca | Gerencia tokens e OAuth de gateway Hermes remoto manualmente; não é a autenticação suportada do Studio. |
| S232 | mcporter | Manter como skill | Reunir em especialista: Linus - Engenheiro de Software | Reúne desenvolvimento, ferramentas de programação e operação técnica. Desenvolvimento e operação MCP têm uma única entrada e referências próprias. |
| S233 | meme-generation | Manter como skill | Reunir em especialista: Michelangelo - Designer | Toda a direção e produção visual; parte da skill Michelangelo existente. |
| S234 | memento-flashcards | Adaptar antes de aproveitar | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S234. |
| S235 | merger-model | Juntar | Reunir em especialista: Warren - CFO | Finanças da empresa, modelagem e análise financeira. |
| S236 | minecraft-modpack-server | Descartar por baixo valor | Remover da biblioteca: Fora da biblioteca | Administração de servidor Minecraft tem baixo encaixe no catálogo de trabalho; técnica não é confundida com utilidade editorial. |
| S237 | modal | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S237. |
| S238 | mono-color | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S238. |
| S239 | mpp-agent | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S239. |
| S240 | nemo-curator | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S240. |
| S241 | neuroskill-bci | Descartar por baixo valor | Remover da biblioteca: Fora da biblioteca | Integração com wearable BCI é específica de hardware e pouco pertinente ao catálogo pretendido. |
| S242 | obliteratus | Descartar por baixo valor | Remover da biblioteca: Fora da biblioteca | Modificação de pesos para remover recusas não é finalidade de trabalho deste catálogo; não confundir com demais skills de fine-tuning. |
| S243 | one-three-one-rule | Promover a prompt | Promover a prompt: Comparar três opções e recomendar uma | Pedido reutilizável no catálogo de prompts. O especialista fornece o método ou mecanismo; o prompt só descreve a entrega. |
| S244 | openclaw-migration | Descartar por incompatibilidade | Remover da biblioteca: Fora da biblioteca | Migra setup OpenClaw para perfis/config Hermes diretamente, sem o contrato de importação do Studio. |
| S245 | openhands | Juntar | Remover da biblioteca: Fora da biblioteca | Aplicar o corte à mesma capacidade/família, inclusive a variantes não agrupadas pelo texto: Delegação de programação por CLI. |
| S246 | openhue | Descartar por baixo valor | Remover da biblioteca: Fora da biblioteca | Controle de iluminação residencial tem baixo encaixe no catálogo de trabalho atual. |
| S247 | osint-investigation | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S247. |
| S248 | oss-forensics | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S248. |
| S249 | outlines | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S249. |
| S250 | page-agent | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S250. |
| S251 | parallel-cli | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S251. |
| S252 | peft | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S252. |
| S253 | pinecone | Manter como skill | Reunir em especialista: Linus - Engenheiro de Software | Reúne desenvolvimento, ferramentas de programação e operação técnica. |
| S254 | pinecone-research | Adaptar antes de aproveitar | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S254. |
| S255 | pinggy-tunnel | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S255. |
| S256 | pixel-art | Manter como skill | Reunir em especialista: Michelangelo - Designer | Toda a direção e produção visual; parte da skill Michelangelo existente. |
| S257 | pokemon-player | Descartar por baixo valor | Remover da biblioteca: Fora da biblioteca | Jogar Pokémon por emulação não atende o foco de produtividade/criação desta seleção. |
| S258 | polymarket | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S258. |
| S259 | pptx-author | Juntar | Reunir em especialista: Gutenberg - Documentos e Dados | Reúne as capacidades técnicas DOCX, PDF, XLSX e PPTX, com scripts e verificação por formato. |
| S260 | pr-lens | Juntar | Reunir em especialista: Michelangelo - Designer | Toda a direção e produção visual; parte da skill Michelangelo existente. |
| S261 | pretext | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S261. |
| S262 | property-listings | Descartar por incompatibilidade | Remover da biblioteca: Fora da biblioteca | Promete cartões listing e lightbox renderizados pelo Hermes Desktop upstream; o Studio não oferece esse contrato. |
| S263 | publish-site | Adaptar antes de aproveitar | Instruções da plataforma: publish-website/guide.md | Orientação operacional do Studio, acessada por tarefa. Revisar o conteúdo útil e incorporar ao procedimento existente; sem cartão selecionável ou cópia integral de outro harness. |
| S264 | pytorch-fsdp | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S264. |
| S265 | pytorch-lightning | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S265. |
| S266 | qdrant | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S266. |
| S267 | qmd | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S267. |
| S268 | reddit-reading | Manter como skill | Reunir em especialista: Darwin - Pesquisador | Método de investigação e fontes especializadas para perguntas de pesquisa. |
| S269 | research-paper-writing | Manter como skill | Reunir em especialista: Darwin - Pesquisador | Método de investigação e fontes especializadas para perguntas de pesquisa. |
| S270 | rest-graphql-debug | Manter como skill | Reunir em especialista: Linus - Engenheiro de Software | Reúne desenvolvimento, ferramentas de programação e operação técnica. |
| S271 | rss-feeds | Manter como skill | Reunir em especialista: Darwin - Pesquisador | Método de investigação e fontes especializadas para perguntas de pesquisa. |
| S272 | saelens | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S272. |
| S273 | scrapling | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S273. |
| S274 | scrollcraft | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S274. |
| S275 | searxng-search | Instruções da plataforma | Instruções da plataforma: Pesquisa web — referências de diagnóstico | Orientação operacional do Studio, acessada por tarefa. Revisar o conteúdo útil e incorporar ao procedimento existente; sem cartão selecionável ou cópia integral de outro harness. |
| S276 | segment-anything-model | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S276. |
| S277 | serving-llms-vllm | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S277. |
| S278 | setup-wizard-generator | Adaptar antes de aproveitar | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S278. |
| S279 | sherlock | Manter como skill | Reunir em especialista: Darwin - Pesquisador | Método de investigação e fontes especializadas para perguntas de pesquisa. |
| S280 | shop | Manter como skill | Reunir em especialista: Assistente Shop | Opera o Shop para busca de produtos e acompanhamento de compras. |
| S281 | shopify | Manter como skill | Reunir em especialista: Assistente Shopify | Opera a loja Shopify e seus dados autorizados. |
| S282 | simple-english | Descartar por baixo valor | Remover da biblioteca: Fora da biblioteca | Retirada editorial expressamente indicada pelo usuário; há método ASD-STE100, mas não merece espaço neste catálogo. |
| S283 | simpo | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S283. |
| S284 | siyuan | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S284. |
| S285 | sketch | Juntar | Reunir em especialista: Michelangelo - Designer | Toda a direção e produção visual; parte da skill Michelangelo existente. |
| S286 | slime | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S286. |
| S287 | social-media-content-calendar | Promover a prompt | Promover a prompt: Montar calendário de conteúdo | Pedido reutilizável no catálogo de prompts. O especialista fornece o método ou mecanismo; o prompt só descreve a entrega. |
| S288 | solana | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S288. |
| S289 | stable-diffusion | Manter como skill | Reunir em especialista: Michelangelo - Designer | Toda a direção e produção visual; parte da skill Michelangelo existente. |
| S290 | stocks | Manter como skill | Reunir em especialista: Warren - CFO | Finanças da empresa, modelagem e análise financeira. |
| S291 | stripe-link-cli | Manter como skill | Reunir em especialista: Warren - CFO | Finanças da empresa, modelagem e análise financeira. |
| S292 | stripe-projects | Manter como skill | Reunir em especialista: Linus - Engenheiro de Software | Reúne desenvolvimento, ferramentas de programação e operação técnica. |
| S293 | subagent-driven-development | Instruções da plataforma | Instruções da plataforma: development/guide.md | Orientação operacional do Studio, acessada por tarefa. Revisar o conteúdo útil e incorporar ao procedimento existente; sem cartão selecionável ou cópia integral de outro harness. |
| S294 | system-atlas | Juntar | Reunir em especialista: Michelangelo - Designer | Toda a direção e produção visual; parte da skill Michelangelo existente. |
| S295 | telephony | Manter como skill | Reunir em especialista: Assistente de Telefonia | Opera a integração de telefonia existente com referências para os provedores disponíveis. |
| S296 | tensorrt-llm | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S296. |
| S297 | tldraw-offline | Manter como skill | Reunir em especialista: Michelangelo - Designer | Toda a direção e produção visual; parte da skill Michelangelo existente. |
| S298 | torchtitan | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S298. |
| S299 | trl-fine-tuning | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S299. |
| S300 | unbroker | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S300. |
| S301 | unreal-mcp | Manter como skill | Reunir em especialista: Michelangelo - Designer | Toda a direção e produção visual; parte da skill Michelangelo existente. |
| S302 | unsloth | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S302. |
| S303 | watchers | Adaptar antes de aproveitar | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S303. |
| S304 | web-pentest | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S304. |
| S305 | weights-and-biases | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S305. |
| S306 | whisper | Manter como skill | Reunir em especialista: Áudio, Voz e Transcrição | Reúne transcrição, Whisper, fala e áudio em uma capacidade independente de edição de vídeos. |
| S307 | yuanbao | Descartar por incompatibilidade | Remover da biblioteca: Fora da biblioteca | Trata a resposta como envio ao grupo Yuanbao e exige ferramentas yb_* do gateway ausente. |
| S308, S352 | aspnet-core | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S308. |
| S309, S353 | chatgpt-apps | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S309. |
| S310, S354 | cli-creator | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S310. |
| S311, S355 | cloudflare-deploy | Adaptar antes de aproveitar | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S311. |
| S312, S356 | define-goal | Promover a prompt | Promover a prompt: Definir um objetivo verificável | Pedido reutilizável no catálogo de prompts. O especialista fornece o método ou mecanismo; o prompt só descreve a entrega. |
| S313, S357 | figma | Juntar | Reunir em especialista: Assistente Figma | Opera o Figma e reúne seus próprios modos em uma skill da aplicação. |
| S314, S358 | figma-code-connect-components | Juntar | Reunir em especialista: Assistente Figma | Opera o Figma e reúne seus próprios modos em uma skill da aplicação. |
| S315, S359 | figma-create-design-system-rules | Juntar | Reunir em especialista: Assistente Figma | Opera o Figma e reúne seus próprios modos em uma skill da aplicação. |
| S316, S360 | figma-create-new-file | Juntar | Reunir em especialista: Assistente Figma | Opera o Figma e reúne seus próprios modos em uma skill da aplicação. |
| S317, S361 | figma-generate-design | Juntar | Reunir em especialista: Assistente Figma | Opera o Figma e reúne seus próprios modos em uma skill da aplicação. |
| S318, S362 | figma-generate-library | Juntar | Reunir em especialista: Assistente Figma | Opera o Figma e reúne seus próprios modos em uma skill da aplicação. |
| S319, S363 | figma-implement-design | Juntar | Reunir em especialista: Assistente Figma | Opera o Figma e reúne seus próprios modos em uma skill da aplicação. |
| S320, S364 | figma-use | Juntar | Reunir em especialista: Assistente Figma | Opera o Figma e reúne seus próprios modos em uma skill da aplicação. |
| S321, S365 | gh-address-comments | Juntar | Reunir em especialista: Linus - Engenheiro de Software | Reúne desenvolvimento, ferramentas de programação e operação técnica. |
| S322, S366 | gh-fix-ci | Juntar | Reunir em especialista: Linus - Engenheiro de Software | Reúne desenvolvimento, ferramentas de programação e operação técnica. |
| S323, S367 | hatch-pet | Descartar por incompatibilidade | Remover da biblioteca: Fora da biblioteca | Cria pets no formato/lifecycle do Codex; não é uma capacidade de pet do Studio. |
| S324 | imagegen | Adaptar antes de aproveitar | Reunir em especialista: Michelangelo - Designer | Toda a direção e produção visual; parte da skill Michelangelo existente. |
| S325, S368 | jupyter-notebook | Juntar | Remover da biblioteca: Fora da biblioteca | Aplicar o corte à mesma capacidade/família, inclusive a variantes não agrupadas pelo texto: Notebooks e kernel Jupyter. |
| S326, S369 | linear | Adaptar antes de aproveitar | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S326. |
| S327, S370 | migrate-to-codex | Descartar por incompatibilidade | Remover da biblioteca: Fora da biblioteca | Migra configurações/agents para Codex; destino e runtime são outros. |
| S328, S371 | netlify-deploy | Adaptar antes de aproveitar | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S328. |
| S329, S372 | notion-knowledge-capture | Juntar | Reunir em especialista: Assistente Notion | Opera o Notion; reúne as variantes de Notion em uma única skill da aplicação. |
| S330, S373 | notion-meeting-intelligence | Juntar | Reunir em especialista: Assistente Notion | Opera o Notion; reúne as variantes de Notion em uma única skill da aplicação. |
| S331, S374 | notion-research-documentation | Juntar | Reunir em especialista: Assistente Notion | Opera o Notion; reúne as variantes de Notion em uma única skill da aplicação. |
| S332, S375 | notion-spec-to-implementation | Juntar | Reunir em especialista: Assistente Notion | Opera o Notion; reúne as variantes de Notion em uma única skill da aplicação. |
| S333, S376 | openai-docs | Juntar | Reunir em especialista: Linus - Engenheiro de Software | Reúne desenvolvimento, ferramentas de programação e operação técnica. |
| S334 | openai-docs | Juntar | Reunir em especialista: Linus - Engenheiro de Software | Reúne desenvolvimento, ferramentas de programação e operação técnica. |
| S335, S377 | pdf | Juntar | Reunir em especialista: Gutenberg - Documentos e Dados | Reúne as capacidades técnicas DOCX, PDF, XLSX e PPTX, com scripts e verificação por formato. |
| S061, S336 | playwright | Adaptar antes de aproveitar | Reunir em especialista: Linus - Engenheiro de Software | Reúne desenvolvimento, ferramentas de programação e operação técnica. Atende à união explícita de 336 + 337 no modo Navegador e testes. |
| S337, S378 | playwright-interactive | Adaptar antes de aproveitar | Reunir em especialista: Linus - Engenheiro de Software | Reúne desenvolvimento, ferramentas de programação e operação técnica. Atende à união explícita de 336 + 337 no modo Navegador e testes. |
| S338 | plugin-creator | Descartar por incompatibilidade | Remover da biblioteca: Fora da biblioteca | Gera plugin .codex-plugin/plugin.json; não é pacote de extensão Hermes/Studio. |
| S339, S379 | render-deploy | Adaptar antes de aproveitar | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S339. |
| S063, S340 | screenshot | Adaptar antes de aproveitar | Instruções da plataforma: prepare-computer/guide.md | Orientação operacional do Studio, acessada por tarefa. Revisar o conteúdo útil e incorporar ao procedimento existente; sem cartão selecionável ou cópia integral de outro harness. |
| S341, S380 | security-best-practices | Juntar | Reunir em especialista: Linus - Engenheiro de Software | Reúne desenvolvimento, ferramentas de programação e operação técnica. |
| S342, S381 | security-ownership-map | Juntar | Reunir em especialista: Linus - Engenheiro de Software | Reúne desenvolvimento, ferramentas de programação e operação técnica. |
| S343, S382 | security-threat-model | Juntar | Reunir em especialista: Linus - Engenheiro de Software | Reúne desenvolvimento, ferramentas de programação e operação técnica. |
| S344, S383 | sentry | Manter como skill | Reunir em especialista: Linus - Engenheiro de Software | Reúne desenvolvimento, ferramentas de programação e operação técnica. |
| S345 | skill-creator | Instruções da plataforma | Instruções da plataforma: skill-creation/guide.md | Orientação operacional do Studio, acessada por tarefa. Revisar o conteúdo útil e incorporar ao procedimento existente; sem cartão selecionável ou cópia integral de outro harness. |
| S346 | skill-installer | Descartar por incompatibilidade | Remover da biblioteca: Fora da biblioteca | Instala skills em CODEX_HOME e orienta reiniciar Codex; o Studio já tem instalador e propostas nativos. |
| S347, S384 | speech | Adaptar antes de aproveitar | Reunir em especialista: Áudio, Voz e Transcrição | Reúne transcrição, Whisper, fala e áudio em uma capacidade independente de edição de vídeos. Atende à união explícita de 347 + 348 nos modos de áudio. |
| S348, S385 | transcribe | Adaptar antes de aproveitar | Reunir em especialista: Áudio, Voz e Transcrição | Reúne transcrição, Whisper, fala e áudio em uma capacidade independente de edição de vídeos. Atende à união explícita de 347 + 348 nos modos de áudio. |
| S349, S386 | vercel-deploy | Juntar | Reunir em especialista: Linus - Engenheiro de Software | Reúne desenvolvimento, ferramentas de programação e operação técnica. |
| S350, S387 | winui-app | Manter como skill | Remover da biblioteca: Fora da biblioteca | Remover esta capacidade e suas variantes da biblioteca pública. IDs indicados: S350. |
| S351, S388 | yeet | Juntar | Reunir em especialista: Linus - Engenheiro de Software | Reúne desenvolvimento, ferramentas de programação e operação técnica. |
| S389 | call-prep | Promover a prompt | Promover a prompt: Preparar reunião comercial | Pedido reutilizável no catálogo de prompts. O especialista fornece o método ou mecanismo; o prompt só descreve a entrega. |
| S390 | content-creation | Promover a prompt | Promover a prompt: Criar conteúdo para um canal | Pedido reutilizável no catálogo de prompts. O especialista fornece o método ou mecanismo; o prompt só descreve a entrega. |
| S391 | notion-meeting-intelligence | Juntar | Reunir em especialista: Assistente Notion | Opera o Notion; reúne as variantes de Notion em uma única skill da aplicação. |
| S392 | notion-research-documentation | Juntar | Reunir em especialista: Assistente Notion | Opera o Notion; reúne as variantes de Notion em uma única skill da aplicação. |
| S393 | notion-spec-to-implementation | Juntar | Reunir em especialista: Assistente Notion | Opera o Notion; reúne as variantes de Notion em uma única skill da aplicação. |
| S394 | reconciliation | Juntar | Reunir em especialista: Warren - CFO | Finanças da empresa, modelagem e análise financeira. |
| S395 | variance-analysis | Juntar | Reunir em especialista: Warren - CFO | Finanças da empresa, modelagem e análise financeira. |
| S396 | hermes-update | Instruções da plataforma | Instruções da plataforma: Documentação do mantenedor — atualizar Hermes | Orientação operacional do Studio, acessada por tarefa. Revisar o conteúdo útil e incorporar ao procedimento existente; sem cartão selecionável ou cópia integral de outro harness. |
| S397 | squados-studio-publish | Instruções da plataforma | Instruções da plataforma: Documentação do mantenedor — publicar Studio | Orientação operacional do Studio, acessada por tarefa. Revisar o conteúdo útil e incorporar ao procedimento existente; sem cartão selecionável ou cópia integral de outro harness. |
| S398 | squados-studio-templates | Instruções da plataforma | Instruções da plataforma: Documentação do mantenedor — templates e referências | Orientação operacional do Studio, acessada por tarefa. Revisar o conteúdo útil e incorporar ao procedimento existente; sem cartão selecionável ou cópia integral de outro harness. |
| S399 | referencias-externas | Instruções da plataforma | Instruções da plataforma: Documentação do mantenedor — templates e referências | Orientação operacional do Studio, acessada por tarefa. Revisar o conteúdo útil e incorporar ao procedimento existente; sem cartão selecionável ou cópia integral de outro harness. |
| S400 | business-writer | Manter como skill | Reunir em especialista: Gutenberg - Documentos e Dados | Reúne as capacidades técnicas DOCX, PDF, XLSX e PPTX, com scripts e verificação por formato. |
| S401 | cfo | Manter como skill | Reunir em especialista: Warren - CFO | Finanças da empresa, modelagem e análise financeira. |
| S402 | commercial-proposals | Manter como skill | Reunir em especialista: Vendas e Negociação | Reúne as capacidades comerciais retiradas de Zuck: vendas, negociação, prospecção, propostas, mercado, e-commerce e relacionamento. |
| S403 | content-creator | Manter como skill | Reunir em especialista: Zuck - O Marketeiro | Marketing, conteúdo, copy, redes sociais, SEO, tráfego e mensuração de campanhas. |
| S404 | contract-assistant | Manter como skill | Reunir em especialista: Drucker - Gestor de Operações | Organiza o trabalho e os processos operacionais da empresa. |
| S405 | copywriter | Manter como skill | Reunir em especialista: Zuck - O Marketeiro | Marketing, conteúdo, copy, redes sociais, SEO, tráfego e mensuração de campanhas. |
| S406 | creative-designer | Manter como skill | Reunir em especialista: Michelangelo - Designer | Toda a direção e produção visual; parte da skill Michelangelo existente. |
| S407 | customer-success | Manter como skill | Reunir em especialista: Vendas e Negociação | Reúne as capacidades comerciais retiradas de Zuck: vendas, negociação, prospecção, propostas, mercado, e-commerce e relacionamento. |
| S408 | data-specialist | Manter como skill | Reunir em especialista: Gutenberg - Documentos e Dados | Reúne as capacidades técnicas DOCX, PDF, XLSX e PPTX, com scripts e verificação por formato. |
| S409 | ecommerce-competitors | Manter como skill | Reunir em especialista: Vendas e Negociação | Reúne as capacidades comerciais retiradas de Zuck: vendas, negociação, prospecção, propostas, mercado, e-commerce e relacionamento. |
| S410 | ecommerce-conversion | Manter como skill | Reunir em especialista: Krug - Especialista em UX | Melhora como as pessoas entendem e usam um produto. |
| S411 | editor-de-videos | Manter como skill | Reunir em especialista: Tarantino - Editor de Vídeos | Cria e edita vídeos e motion, preservando o motor do editor existente. |
| S412 | executive-assistant | Promover a prompt | Promover a prompt: Preparar reuniões e prioridades | Pedido reutilizável no catálogo de prompts. O especialista fornece o método ou mecanismo; o prompt só descreve a entrega. |
| S413 | financial-assistant | Manter como skill | Reunir em especialista: Warren - CFO | Finanças da empresa, modelagem e análise financeira. |
| S414 | inventory | Manter como skill | Reunir em especialista: Drucker - Gestor de Operações | Organiza o trabalho e os processos operacionais da empresa. |
| S415 | logistics | Manter como skill | Reunir em especialista: Drucker - Gestor de Operações | Organiza o trabalho e os processos operacionais da empresa. |
| S416 | market-researcher | Manter como skill | Reunir em especialista: Vendas e Negociação | Reúne as capacidades comerciais retiradas de Zuck: vendas, negociação, prospecção, propostas, mercado, e-commerce e relacionamento. |
| S417 | marketing-strategist | Manter como skill | Reunir em especialista: Zuck - O Marketeiro | Marketing, conteúdo, copy, redes sociais, SEO, tráfego e mensuração de campanhas. |
| S418 | marketing-traffic | Manter como skill | Reunir em especialista: Zuck - O Marketeiro | Marketing, conteúdo, copy, redes sociais, SEO, tráfego e mensuração de campanhas. |
| S419 | negotiation | Manter como skill | Reunir em especialista: Vendas e Negociação | Reúne as capacidades comerciais retiradas de Zuck: vendas, negociação, prospecção, propostas, mercado, e-commerce e relacionamento. |
| S420 | people-development | Manter como skill | Reunir em especialista: Especialista em Pessoas | Contratação, aprendizagem e desenvolvimento de pessoas. |
| S421 | presentation-specialist | Manter como skill | Reunir em especialista: Michelangelo - Designer | Toda a direção e produção visual; parte da skill Michelangelo existente. |
| S422 | procurement | Manter como skill | Reunir em especialista: Drucker - Gestor de Operações | Organiza o trabalho e os processos operacionais da empresa. |
| S423 | product-catalog | Manter como skill | Reunir em especialista: Vendas e Negociação | Reúne as capacidades comerciais retiradas de Zuck: vendas, negociação, prospecção, propostas, mercado, e-commerce e relacionamento. |
| S424 | product-specialist | Manter como skill | Reunir em especialista: Drucker - Gestor de Operações | Organiza o trabalho e os processos operacionais da empresa. |
| S425 | project-manager | Manter como skill | Reunir em especialista: Drucker - Gestor de Operações | Organiza o trabalho e os processos operacionais da empresa. |
| S426 | prospecting | Manter como skill | Reunir em especialista: Vendas e Negociação | Reúne as capacidades comerciais retiradas de Zuck: vendas, negociação, prospecção, propostas, mercado, e-commerce e relacionamento. |
| S427 | quality-specialist | Manter como skill | Reunir em especialista: Drucker - Gestor de Operações | Organiza o trabalho e os processos operacionais da empresa. |
| S428 | recruitment | Manter como skill | Reunir em especialista: Especialista em Pessoas | Contratação, aprendizagem e desenvolvimento de pessoas. |
| S429 | sales-coach | Manter como skill | Reunir em especialista: Vendas e Negociação | Reúne as capacidades comerciais retiradas de Zuck: vendas, negociação, prospecção, propostas, mercado, e-commerce e relacionamento. |
| S430 | seo-specialist | Juntar | Reunir em especialista: Zuck - O Marketeiro | Marketing, conteúdo, copy, redes sociais, SEO, tráfego e mensuração de campanhas. |
| S431 | skill-manager | Instruções da plataforma | Instruções da plataforma: skill-manager/guide.md | Orientação operacional do Studio, acessada por tarefa. Revisar o conteúdo útil e incorporar ao procedimento existente; sem cartão selecionável ou cópia integral de outro harness. |
| S432 | spreadsheet-specialist | Juntar | Reunir em especialista: Gutenberg - Documentos e Dados | Reúne as capacidades técnicas DOCX, PDF, XLSX e PPTX, com scripts e verificação por formato. |
| S433 | training-specialist | Manter como skill | Reunir em especialista: Especialista em Pessoas | Contratação, aprendizagem e desenvolvimento de pessoas. |
| S434 | voice-of-customer | Manter como skill | Reunir em especialista: Vendas e Negociação | Reúne as capacidades comerciais retiradas de Zuck: vendas, negociação, prospecção, propostas, mercado, e-commerce e relacionamento. |
| S435 | brainstorming | Instruções da plataforma | Instruções da plataforma: planning/guide.md | Orientação operacional do Studio, acessada por tarefa. Revisar o conteúdo útil e incorporar ao procedimento existente; sem cartão selecionável ou cópia integral de outro harness. |
| S436 | dispatching-parallel-agents | Instruções da plataforma | Instruções da plataforma: Orientação geral do Studio — integração existente | Orientação operacional do Studio, acessada por tarefa. Revisar o conteúdo útil e incorporar ao procedimento existente; sem cartão selecionável ou cópia integral de outro harness. |
| S437 | executing-plans | Instruções da plataforma | Instruções da plataforma: planning/guide.md | Orientação operacional do Studio, acessada por tarefa. Revisar o conteúdo útil e incorporar ao procedimento existente; sem cartão selecionável ou cópia integral de outro harness. |
| S438 | finishing-a-development-branch | Instruções da plataforma | Instruções da plataforma: development/guide.md | Orientação operacional do Studio, acessada por tarefa. Revisar o conteúdo útil e incorporar ao procedimento existente; sem cartão selecionável ou cópia integral de outro harness. |
| S439 | receiving-code-review | Instruções da plataforma | Instruções da plataforma: development/guide.md | Orientação operacional do Studio, acessada por tarefa. Revisar o conteúdo útil e incorporar ao procedimento existente; sem cartão selecionável ou cópia integral de outro harness. |
| S440 | requesting-code-review | Instruções da plataforma | Instruções da plataforma: development/guide.md | Orientação operacional do Studio, acessada por tarefa. Revisar o conteúdo útil e incorporar ao procedimento existente; sem cartão selecionável ou cópia integral de outro harness. |
| S441 | subagent-driven-development | Instruções da plataforma | Instruções da plataforma: development/guide.md | Orientação operacional do Studio, acessada por tarefa. Revisar o conteúdo útil e incorporar ao procedimento existente; sem cartão selecionável ou cópia integral de outro harness. |
| S442 | systematic-debugging | Instruções da plataforma | Instruções da plataforma: diagnosis/guide.md | Orientação operacional do Studio, acessada por tarefa. Revisar o conteúdo útil e incorporar ao procedimento existente; sem cartão selecionável ou cópia integral de outro harness. |
| S443 | test-driven-development | Instruções da plataforma | Instruções da plataforma: development/guide.md | Orientação operacional do Studio, acessada por tarefa. Revisar o conteúdo útil e incorporar ao procedimento existente; sem cartão selecionável ou cópia integral de outro harness. |
| S444 | using-git-worktrees | Instruções da plataforma | Instruções da plataforma: development/guide.md | Orientação operacional do Studio, acessada por tarefa. Revisar o conteúdo útil e incorporar ao procedimento existente; sem cartão selecionável ou cópia integral de outro harness. |
| S445 | using-superpowers | Instruções da plataforma | Instruções da plataforma: Orientação geral do Studio — integração existente | Orientação operacional do Studio, acessada por tarefa. Revisar o conteúdo útil e incorporar ao procedimento existente; sem cartão selecionável ou cópia integral de outro harness. |
| S446 | verification-before-completion | Instruções da plataforma | Instruções da plataforma: development/guide.md | Orientação operacional do Studio, acessada por tarefa. Revisar o conteúdo útil e incorporar ao procedimento existente; sem cartão selecionável ou cópia integral de outro harness. |
| S447 | writing-plans | Instruções da plataforma | Instruções da plataforma: planning/guide.md | Orientação operacional do Studio, acessada por tarefa. Revisar o conteúdo útil e incorporar ao procedimento existente; sem cartão selecionável ou cópia integral de outro harness. |
| S448 | writing-skills | Instruções da plataforma | Instruções da plataforma: skill-creation/guide.md | Orientação operacional do Studio, acessada por tarefa. Revisar o conteúdo útil e incorporar ao procedimento existente; sem cartão selecionável ou cópia integral de outro harness. |

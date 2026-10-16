# Biblioteca de especialistas do SquadOS Studio

Composição aprovada e implementada em 16/10/2026: **19 pacotes** com modos sob
demanda. Flavio cuida de vendas e negociação; Maslow, de pessoas. Cada entrada
carrega só o método necessário. Assistentes permanecem separados por aplicação.

| Especialista | Modos |
|---|---|
| [Michelangelo - Designer](../skills/michelangelo/SKILL.md) | Identidade e marcas; Interfaces web e mobile; Design por imagem; Peças gráficas e ilustração; Infográficos e diagramas; Apresentações e narrativa visual; SVG, ícones e animação; Canvases visuais |
| [Tarantino - Editor de Vídeos](../skills/tarantino/SKILL.md) | Criação de vídeos; Roteiro e decupagem; Montagem e cortes; Motion e efeitos; Legendas no vídeo; Renderização e exportação |
| [Áudio, Voz e Transcrição](../skills/audio/SKILL.md) | Transcrição e Whisper; Síntese de voz; Áudio e música; Transcrições de vídeos |
| [Krug - Especialista em UX](../skills/krug/SKILL.md) | Auditoria de jornadas; Clareza e fricção; Testes de usabilidade; Conversão e checkout; Engajamento e gamificação |
| [Warren - CFO](../skills/warren/SKILL.md) | Planejamento e caixa; Contas a pagar e receber; Demonstrações e conciliação; Análise de variações; Valuation e modelos financeiros; Preços e investimentos; Operações de pagamento |
| [Zuck - O Marketeiro](../skills/zuck/SKILL.md) | Estratégia de marketing; Conteúdo e copywriting; Redes sociais e carrosséis; SEO; Tráfego e mensuração; Ideação de campanhas |
| [Flavio - Vendas e Negociação](../skills/flavio/SKILL.md) | Inteligência comercial e mercado; Prospecção e qualificação; Propostas comerciais; Negociação e fechamento; Treinamento de vendas; E-commerce e catálogo comercial; Relacionamento e sucesso do cliente |
| [Gutenberg - Documentos e Dados](../skills/gutenberg/SKILL.md) | Word e documentos; PDF, OCR e formulários; Planilhas e fórmulas; PowerPoint e templates; Análise e tratamento de dados; Redação e comunicação de trabalho |
| [Linus - Engenheiro de Software](../skills/linus/SKILL.md) | Código e arquitetura; GitHub e revisão; Desenvolvimento e operação MCP; Banco e Supabase; Segurança; Navegador e testes; APIs e diagnóstico; Infraestrutura e publicação; IA e modelos |
| [Drucker - Gestor de Operações](../skills/drucker/SKILL.md) | Projetos e execução; Produto e prioridades; Qualidade; Compras e fornecedores; Estoque e logística; Contratos e obrigações; Panorama do dia |
| [Maslow - Especialista em Pessoas](../skills/maslow/SKILL.md) | Recrutamento e seleção; Integração e capacitação; Treinamento; Feedback e desenvolvimento |
| [Darwin - Pesquisador](../skills/darwin/SKILL.md) | Pesquisa com fontes e citações; Artigos e arXiv; Reddit e RSS; Pesquisa geográfica; Verificação de informação pública; Escrita científica |
| [Assistente Figma](../skills/figma/SKILL.md) | Leitura de arquivos; Criação e edição; Componentes e bibliotecas; Plugin API; Implementação a partir do Figma |
| [Assistente Notion](../skills/notion/SKILL.md) | Páginas e bases; Captura de conhecimento; Reuniões; Pesquisa; Planos e implementação |
| [Assistente Google Workspace](../skills/google-workspace/SKILL.md) | Email e agenda; Drive; Docs, Sheets e Slides |
| [Assistente Obsidian](../skills/obsidian/SKILL.md) | Vaults e notas; Busca e links; Organização |
| [Assistente Shop](../skills/shop/SKILL.md) | Catálogo; Compras; Pedidos e devoluções |
| [Assistente Shopify](../skills/shopify/SKILL.md) | Produtos e catálogo; Pedidos e clientes; Estoque e metafields |
| [Assistente de Telefonia](../skills/telephony/SKILL.md) | Números e SMS/MMS; Chamadas; Diagnóstico de provedores |

Figma é independente de Michelangelo. Transcrição e voz ficam em Áudio; Tarantino
cria e edita vídeos. Zuck concentra marketing, conteúdo, copy, redes, SEO e tráfego;
mercado comercial, propostas e relacionamento ficam em Flavio. Gutenberg inclui
análise de dados e motores de arquivos; Linus reúne MCP/mcporter, Supabase e Playwright.

Os 35 pacotes próprios anteriores foram substituídos por estes destinos. Os cortes
por baixo valor, incompatibilidade, origem Cursor e IDs explícitos estão no
[relatório completo](skill-curation/report.md). Os IDs históricos continuam
pesquisáveis na [classificação navegável](skill-curation/classification.html).

O catálogo [gallery.json](../gallery.json) e seu espelho no Desktop contêm somente
os dezenove pacotes. A apresentação v2 inclui exemplos, requisitos e capas editoriais
próprias, com SVGs editáveis em assets; a capa ilustra a categoria, sem provar execução.
Cada pacote registra conteúdo incorporado, licenças e fontes apenas consultadas
em references/provenance.json. Fontes consultadas não significam código copiado.

Os 14 objetivos simples foram mapeados para prompts: três pedidos existentes e
11 novos, totalizando 147. As 42 fontes de operação da plataforma foram revistas
nos guias condicionais existentes e documentos do mantenedor, fora das skills
selecionáveis. Consulte [o mapa de destinos](skill-curation/migration-map.json).

Verificação e limites: [estado de entrega](skills-de-trabalho-status.md).

Handoff foi transferido para o procedimento interno sob demanda
`resources/instructions/handoff/guide.md` no Desktop.

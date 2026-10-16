# Aceite da biblioteca — 16/10/2026

Escopo: biblioteca pública em squados-plugins e integração documental/contratual no
Desktop, em main. Instalações pessoais, contas externas e publicação não fazem parte
da migração. A verificação local separa conteúdo, distribuição e execução observada.

| Critério | Evidência e resultado |
|---|---|
| ✅ Vinte destinos, com Flavio e Maslow | Vinte diretórios e entradas em skills/, gallery.json e espelho Desktop; scripts/verify-skills.py confere a composição exata. |
| ✅ Modos sob demanda e fronteiras aprovadas | SKILL.md curtos encaminham às referências. Figma independente; áudio/transcrição fora de Tarantino; comercial em Flavio; marketing em Zuck; Supabase/Playwright e MCP/mcporter em Linus; Handoff permanece skill. |
| ✅ Cortes integrais e histórico auditável | classification.json e verification.json preservam 408 conjuntos, 448 IDs e as sete categorias anteriores; 173 removidos, incluindo fontes Cursor e todos os cortes explícitos/variantes. Não há pacote legado no índice ou na raiz skills/. |
| ✅ Scripts, recursos, licenças e proveniência | Contrato confere limites, UTF-8, caminhos, inclusive dentro de comandos, recursos e avisos. Proveniência distingue incorporado/consultado e valida SHA fixado na URL. Figma usa orientação própria; clientes incompatíveis de credenciais e templates sem termos completos não foram redistribuídos. |
| ✅ Integridade editorial | Hash sha256-lf da árvore completa, ordenação estável e normalização CRLF/LF; edição sem atualizar catálogo é recusada pelo verificador. |
| ✅ Prompts simples no destino correto | 14 objetivos: três pedidos existentes e 11 novos; catálogo de 147 prompts bilingues validado e sincronizado. Mapa explícito em migration-map.json. |
| ✅ Instruções da plataforma fora das skills | 42 fontes revistas em guias condicionais e documentação do mantenedor; testes confirmam apontadores e ausência de corpos injetados como skills. Dependências nativas Hermes preservadas. |
| ✅ Preparação e instalação nativas | Todos os 20 bundles passaram por guard, estágio, aprovação e instalação reais em perfil isolado dentro do repo. Transporte GitHub substituído pelo checkout local. Conteúdo instalado comparado arquivo a arquivo com a fonte. |
| ✅ Gutenberg com arquivos reais | DOCX29, XLSX11, PPTX21 e PDF21 testes passaram usando os helpers distribuídos: 82 testes. Um teste de recálculo foi pulado por LibreOffice ausente. |
| ✅ Michelangelo | 31 testes do detector, incluindo Chromium headless. Não é prova de qualidade de toda geração visual possível. |
| ✅ Tarantino | Preparação real pelos locks/manifesto; 39 testes Python e 11 Node. Amostra sintética compilou e gerou preview/master de 2s com áudio/vídeo; frame inspecionado e QA de navegador passou com zero problemas de layout. |
| ✅ Auxiliares e contrato | 14 testes Python públicos e três Node passaram. Incluem recursos/hashes, scaffold MCP fora do cwd, caminhos em comandos, proveniência e revisão editorial. |
| ✅ Consumidor Desktop | 107 testes focados passaram, sem skips; validador v2, dois testes do catálogo, sync de prompts e typecheck passaram. Checks de formatação próprios passaram. |
| ✅ Revisão independente e correções | Parecer inicial identificou problemas materiais; todos tratados numa passada de correção, com regressões e contrato ampliado. Ver review.md; não foi solicitada uma segunda aprovação independente. |
| ❌ Gate geral do Desktop | gate:dev foi executado e parou no Biome. Após corrigir os arquivos desta entrega, resta uma falha de formatação em docs/superpowers/verification/2026-10-16-home-templates/post-integration.json, de outra entrega. Não foi alterada para esconder a condição do repositório. |

## Limites de execução

Contas Figma/Notion/Google/Shop/Shopify/telefonia e provedores de geração não foram
acionados. Telefonia e Google precisam de conexão segura disponível; os clientes
legados que gravavam segredos em arquivos foram excluídos. Não há nova camada de
armazenamento de credenciais ou autenticação implementada por esta curadoria.

Não foram executados OCR, renderização visual DOCX/PPTX, recálculo com LibreOffice,
compilação científica, transcrição/inferência ou escuta/revisão editorial de vídeo
real. Esses são requisitos do trabalho que usar o modo, não provas obtidas pela
presença do pacote. Os 82 testes de arquivos e a amostra de renderização não são
apresentados como sucesso autenticado de todos os modos.

O conteúdo está implementado localmente. A URL remota, caches anteriores e
instalações pessoais não foram alterados. Push/publicação são etapas separadas.
Detalhes estruturados em [implementation.json](implementation.json).

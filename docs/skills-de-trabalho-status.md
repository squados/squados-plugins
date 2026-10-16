# Estado da biblioteca — 16/10/2026

Implementada localmente nos dois repositórios, sem push/publicação. Biblioteca com
20 pacotes; prompts com 147 pedidos; instruções internas em progressive disclosure.
O relatório histórico cobre 408 conjuntos, 448 IDs e 498 exemplares originais.

## Evidência observada

- Vinte pacotes válidos no contrato de distribuição e índice/espelho reconciliados.
- Preparação, guard, aprovação e instalação dos vinte bundles pelo Hermes real
  em um perfil isolado dentro do repo. Somente o transporte GitHub usou o checkout
  local; nenhum perfil pessoal foi alterado. Não é download da versão publicada.
- Gutenberg: 29 testes DOCX, 11 XLSX, 21 PPTX e 21 PDF passaram com os helpers
  distribuídos. Um teste de recálculo foi pulado porque LibreOffice não existe
  no ambiente. Renderização visual de Word/PowerPoint e OCR não foram comprovados.
- Michelangelo: 31 testes do detector, incluindo Chromium headless, passaram.
- Tarantino: preparação real pelos locks e manifesto, 39 testes Python e 11 Node
  passaram. Amostra sintética compilou e gerou preview/master MP4 com vídeo e áudio
  de 2 segundos. Um frame foi inspecionado. Transcrição, inferência, escuta e revisão
  editorial de material real não foram exercitadas. A entrega de cada vídeo exige
  suas próprias conferências.
- Preparador de recursos: sete regressões passaram. Cliente Chrome Web Store:
  três regressões passaram, incluindo dry-run offline sem mutações e restrição
  do endpoint de troca de credenciais. Upload externo não executado.
- Desktop: 107 testes focados passaram, cobrindo galeria, integração nativa,
  procedimentos e prompts, sem skips nesse lote. Validador editorial v2 passou.

## Limites e distribuição

Conexões autenticadas Figma/Notion/Google/Shop/Shopify/telefonia e provedores de
geração variam por ambiente e não foram acionados. As instruções conferem
ferramentas, permissões, dependências e schemas reais na execução. Presença do
pacote não garante conta, modelo ou ferramenta instalada.

Tarantino distribui motor, contratos, locks e avisos legais completos em texto;
fontes e modelos são preparados por SHA-256. Os modelos vêm da versão exata do
SDK instalado. Recursos binários não são embutidos nem codificados para contornar
limites. Gutenberg usa motores nativos Hermes e bibliotecas do fluxo sob demanda.

A fonte exata squados/squados-plugins foi registrada no conjunto trusted nativo
da integração; findings dangerous continuam bloqueados, assim como a política
community de outros repositórios. Não houve edição do guard upstream.

O Desktop inclui o novo seed; catálogos já publicados, caches e instalações pessoais
existentes não foram migrados no computador. A publicação remota é uma etapa separada.
Não há prova de uso autenticado de todas as capacidades por um agente.

Detalhes de aceite: [acceptance.md](skill-curation/acceptance.md).

A revisão final removeu os clientes legados de telefonia/Google que salvavam segredos
em arquivo. Essas integrações usam conexão segura disponível, sem novo armazenamento
de credenciais. O template científico é autoral; formatos de conferência são preparados
no projeto com seus termos. Quatorze regressões Python públicas e três Node passaram;
o contrato também confere caminhos em comandos, SHAs de origem e árvore editorial.

O gate geral continua bloqueado por uma falha Biome de outra entrega, detalhada no
aceite. Typecheck e os checks dos arquivos desta entrega passaram.

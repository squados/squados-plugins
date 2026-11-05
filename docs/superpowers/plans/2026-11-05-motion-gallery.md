# Galeria de motion e edição de vídeo

> **Execução.** Usar a divisão independente da skill superpowers:dispatching-parallel-agents para as coleções de demos. A integração e a validação ficam com a sessão principal.

**Objetivo.** Publicar no checkout canônico a galeria visual de nomes e efeitos aprovada, consultável pelas duas skills.

**Arquitetura.** `motion-gallery/catalog.json` fornece os cartões do HTML e as receitas para agentes. Um build Node embute o JSON no HTML estático para abrir por `file://`. Previews autorais desenham em Canvas 2D sob demanda, por ID, com tempo normalizado. Demos e prompts usam conteúdo fictício onde a origem exige substituição.

**Stack.** HTML, CSS, JavaScript clássico, Canvas 2D e Node nativo.

**Spec.** [Desenho aprovado](../specs/2026-11-05-motion-gallery-design.md).

**FOOTPRINT.** `motion-gallery/`, `scripts/build-motion-gallery.mjs`, `tests/motion-gallery.test.mjs`, `README.md`, `skills/tarantino/SKILL.md`, entrada ativa da `ibeia-video-edit` e README interno da galeria anterior. Estimativa de 15–30 min, condicionada à revisão das cenas. Integração na main local. A aprovação de 05/11 autoriza a implementação e consulta sobre hospedagem.

## Contrato e verificações

- Catálogo UTF-8 `{ version: 1, entries: [...] }`. Cada registro tem `id`, `title`, `category`, `prompt`, `demo: { key, seconds, posterAt? }`, `source: { collection, id, url? }` e `material: "original" | "fictional"`. `collection` distingue `ibeia`, `motion-skills` e `showcase`. As URLs do benchmark identificam a referência específica. IDs existentes são preservados e a chave da demo aponta à função registrada.
- Registro de demos em `window.motionDemos[key]`. A função recebe `(ctx, t)` com palco 480×270 e progresso de 0 a 1. O player prepara o contexto em cada frame e controla play, pause e replay. O resultado publicado contém somente os recursos necessários ao site e seu catálogo.
- O risco de cobertura exige contagem por fonte, paridade de IDs com a origem e paridade de chaves e nomes com a página gerada. O risco de demos intercambiáveis exige quadros comparáveis e revisão da técnica. O risco de dados de produção exige inspeção de procedência e do diff. O risco de navegação por nome exige busca com e sem acentos, links por ID e teste por teclado. O risco de arquivo local exige abrir com a rede bloqueada e sem servidor.

## 1. Contrato e página estática · 4–7 min

- [x] Adicionar `tests/motion-gallery.test.mjs` e observar falha por catálogo/página ausentes.
- [x] Implementar `scripts/build-motion-gallery.mjs` com geração determinística a partir de `scripts/motion-gallery-template.html` e `catalog.json`. `--check` verifica a saída versionada. Implementar UI e player em arquivos estáticos. Conferir registro, nomes, caminhos, busca e ausência de duplicações no teste.

## 2. Conteúdo e demos · 8–20 min em paralelo

- [x] Migração editorial de 176 IDs em dois blocos disjuntos, com 35 efeitos de edição e 41 entradas de remarketing incluídas. Manter os nomes adequados, dar nomes próprios aos demais e escrever prompts com composição e ritmo. Representar a técnica em cada demo e manter os masters operacionais no local atual.
- [x] Incorporar como referências os 56 pares pacote/skill da iart.ai e as 11 demos do showcase. Conferir atribuição, licença dos materiais usados e distinção entre os dois lower thirds.
- [x] Mesclar os inventários, gerar o HTML e validar os 243 registros e quadros. Reproduzir e revisar a galeria em desktop e móvel, incluindo categorias, busca, links por ID e prompts pelo teclado. Fechar o browser de validação.

## 3. Integração e instrução de publicação · 3–5 min

- [x] Apontar Tarantino e ibeia-video-edit para `https://raw.githubusercontent.com/squados/squados-plugins/main/motion-gallery/catalog.json` com leitura local de desenvolvimento. Atualizar a documentação da galeria antiga e o README de plugins.
- [x] Documentar GitHub Pages para o HTML e o endereço raw para agentes. Configuração da publicação e push ficam em operação futura.
- [x] Rodar o build em modo de verificação, o teste de catálogo e o gate do README de plugins.
- Integrar esta unidade na main local e registrar o commit, o encerramento e a limpeza no controle da sessão.

## Evidências de aceite

1. Inventário com 176 IDs da casa, 56 referências de workflows e 11 entradas da vitrine. A paridade entre o catálogo e o HTML, incluindo os nomes preservados, é testada em `tests/motion-gallery.test.mjs:12` e `:68`.
2. Chromium desenhou as 243 entradas offline em oito posições da linha do tempo. São 242 prévias distintas porque dois IDs já compartilhavam o master. Revisão visual dos contatos e da passagem entre as cenas das cinco transições. O comparativo de cor em `motion-gallery/demos-house-b.js:1651` foi verificado com o filtro Canvas desativado.
3. O player e os prompts estão em `motion-gallery/gallery.js:31`, os filtros em `:189` e os links por ID em `:209`. Smoke Chromium com busca sem acentos, filtro, ID, teclado e toque em viewport móvel.
4. Consulta canônica em `skills/tarantino/SKILL.md:21` e `ibeia-marketing/skills/ibeia-video-edit/SKILL.md:29`. Os 175 arquivos de produção do acervo interno seguem acessíveis. O pacote público contém só texto e código de prévias fictícias. A revisão confirmou 57 URLs únicas de referência.
5. Hospedagem documentada em `motion-gallery/README.md:14`. O teste do endereço público pertence à etapa de publicação.

# Templates de aplicativos web

Nove pacotes independentes para ilustrar a página principal de um produto. Todos
são one-page, responsivos, com dados fictícios, interações locais e temas claro e
escuro. Lume abre em modo escuro. A galeria local é `index.html`; os pacotes são
candidatos ao contrato CreationTemplate, separados do índice de skills e dos sites.

| Pacote | Identidade | Experiência principal |
| --- | --- | --- |
| [app-crm](app-crm/README.md) | Vínculo | Pipeline kanban, oportunidades, contatos e atividades. |
| [app-management](app-management/README.md) | Balanço | Visão financeira, fluxo de caixa, lançamentos e conta. |
| [app-people](app-people/README.md) | Pulso | Diretório, perfis, calendário e onboarding. |
| [app-ai-chat](app-ai-chat/README.md) | Lume | Chat escuro, histórico, busca e respostas demonstrativas. |
| [app-members](app-members/README.md) | Forma | Academia com frames de aulas com Bia, play e progresso. |
| [app-community](app-community/README.md) | Pátio | Feed, comentários, publicações e encontros. |
| [app-quiz](app-quiz/README.md) | Prisma | Quiz de cinco perguntas e perfil criativo. |
| [app-calculator](app-calculator/README.md) | Escopo | Estimativa e comparação de cenários. |
| [app-conversion-tracker](app-conversion-tracker/README.md) | Sinal | Atribuição, campanhas, métricas e funil. |

## Usar um template

Copie o diretório completo do pacote escolhido para um projeto próprio. Com Node
compatível com Vite 7, execute `npm ci`, `npm run build` e
`npm run preview -- --host 127.0.0.1` dentro da cópia. Cada pacote tem seu próprio
manifesto, lockfile, fontes, imagens, licença, README e previews. Não depende de
arquivos irmãos, deste README ou da galeria. `base: './'` permite build em subpasta.

Dados de trabalho ficam na memória e reiniciam ao recarregar. Tema é preferência
local por template. Não há autenticação, backend, serviços de IA, pixels, cobrança
ou envio de dados. A navegação explora seções e diálogos da página demonstrativa;
não implementa os outros módulos de cada software. As aulas usam frames estáticos.

## Construir a galeria local

Na pasta `apps/`:

```powershell
npm ci
npm run build
npm test
npm run preview -- --port=65081
```

`build.mjs` instala e builda cópias em `.build/`, preservando os candidatos sem
`node_modules`. Os builds são copiados para `.preview/`. `preview.mjs` serve apenas
a galeria, o índice, previews/documentação permitidos e os builds dos nove IDs,
em loopback. Não há instalação de dependências na raiz do repositório.

O leitor nativo recusa um pacote com `.git` ou `node_modules`; não distribua caches
ou builds como fonte do template. Para publicar um site estático no futuro,
distribua o `dist/` da cópia adaptada. Publicação não é feita por estes scripts.

## Catálogo, autoria e adaptação

`index.json` usa os campos `id`, `kind: web`, `name`/`description` em PT-BR e EN,
`entry`, `preview`, `adaptation`, `license` e `origin`, conforme o schema atual do
Desktop. A entrada é `src/app.js`; o preview é um PNG do aplicativo renderizado.
O catálogo embutido do Desktop e `gallery.json` permanecem separados.

As direções visuais foram aprovadas no [spike](concepts/2026-10-16-web-apps/README.md).
A IA foi substituída pelo chat solicitado. Referências em
[sites/references](../sites/references/2026-10-16-web-apps.md); ChatGPT foi a referência
adicional para a hierarquia do Lume. Nenhum código ou asset dessas marcas foi copiado.

Código e arte própria sob Apache-2.0; DM Sans sob OFL-1.1, com avisos completos em
cada pacote. Bia é uma embaixadora virtual; as pessoas dos dados são fictícias.
Hashes e origem dos recursos estão nos manifestos `assets.json` de cada pacote.

Para adaptar, copie o pacote completo, substitua marca/contexto/dados e mantenha
licenças, fontes e interações úteis. Integrações reais exigem um pedido e sua
configuração. Build e adaptação local não equivalem à adaptação pelo Hermes ou à
publicação do catálogo.

## Validação desta versão

Em 16/10/2026: os nove pacotes passaram por instalação e build isolados, resolução
pelo schema/leitor nativos do Desktop e conferência de recursos/licenças. Foram
verificadas as duas opções de tema em desktop e celular (36 renderizações), as
interações principais e 14 testes de regras do chat, cálculo e filtro financeiro.
Cada pacote também foi copiado, adaptado com outra marca e conteúdo fictício,
compilado e renderizado. As fontes candidatas, a base Desktop e o spike aprovado
permaneceram intactos durante essa prova. Revisão independente sem achados
acionáveis pendentes. Isso não representa publicação ou execução pelo Hermes.

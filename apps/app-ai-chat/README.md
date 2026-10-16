# Lume — Chat de IA

Chat em modo escuro com histórico, sugestões e respostas demonstrativas. Template one-page independente, com identidade própria, temas claro/escuro, fonte local e dados fictícios. Layout aprovado no spike do SquadOS; chat redesenhado por pedido do usuário.

## Executar

Com Node.js 20.19+ ou 22.12+ compatível com Vite7, copie este pacote inteiro para outra pasta e execute:

```powershell
npm ci
npm run build
npm run preview -- --host 127.0.0.1
```

O build gera `dist/`; `base: './'` permite hospedagem estática na raiz ou em subpasta. `npm run dev` abre o servidor de desenvolvimento. Não abra o HTML-fonte via file://: ele importa módulos. Na raiz de `apps/`, `npm run build` instala/builda cópias ignoradas e preserva os candidatos sem node_modules; `npm run preview` serve a galeria e os builds.

## Interações demonstrativas

- Nova conversa, histórico, busca sem distinção de acentos e rascunho por conversa.
- Enviar com Enter; Shift+Enter insere uma linha. Entradas vazias não enviam.
- Respostas locais para planejamento, campanha e texto; sugestões e biblioteca.
- Direções Equilibrado, Criativo e Direto alteram a extensão dos exemplos.
- Copiar resposta, feedback positivo/negativo e histórico móvel em diálogo.
- Tema pelo botão claro/escuro, com preferência local por template. `?theme=light` e `?theme=dark` permitem iniciar em um tema específico.
- Diálogos nativos com Escape, fechar, clique no fundo e retorno de foco; campos validados no navegador.

O chat abre em modo escuro por padrão; a preferência de tema é salva localmente. Respostas são predefinidas e instantâneas, sem modelo, credenciais, upload ou rede. O campo aceita até4000caracteres. O histórico não persiste ao recarregar. Não usa nome, logo ou recursos visuais da OpenAI.

Dados de trabalho existem somente na memória. Recarregar reinicia os exemplos. Não há autenticação, backend, cobrança ou envio de dados. A navegação explora seções/diálogos da página principal; não implementa outros módulos de um software completo. Marcas, pessoas e empresas dos dados são fictícias.

## Personalizar uma cópia

- `src/app.js`: marca visível, composição, textos e interações.
- `src/model.js`: conversas iniciais, rascunhos, busca e respostas de exemplo.
- `src/model.test.js`: regras de estado; rode `npm test`.
- `src/style.css`: tokens de cores, layout e breakpoints; respeita movimento reduzido.
- `src/assets/`: fonte local. Preserve a licença OFL.
- `index.html`: título inicial, descrição, idioma e favicon.
- `assets.json`: origem e hashes dos recursos.

Adapte marca, textos e conteúdo antes de publicar um projeto próprio. Copie o pacote INTEIRO, preserve o original e suas licenças, instale pelo lockfile e verifique a cópia em desktop e celular. Adicione integrações reais somente quando solicitadas e configuradas. Não coloque segredos no frontend.

## Referência e licenças

Referência de hierarquia: [ChatGPT](https://chatgpt.com/). A interface, código, conteúdo e arte são próprios; nenhum recurso desses produtos foi copiado.

Código/base técnica e arte própria: Apache-2.0, com LICENSE e NOTICE. Fonte DM Sans: OFL-1.1 integral em `src/assets/DM-Sans-OFL.txt`. Previews reais em `preview.png`, `preview-light.png` e `preview-dark.png`.

O índice `../index.json` é candidato para o contrato CreationTemplate. Esta autoria não altera o catálogo embutido no Desktop e não comprova execução pelo Hermes nem publicação.

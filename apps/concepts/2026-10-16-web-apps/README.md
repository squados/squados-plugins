# Numa — spike dos nove aplicativos web

Protótipo visual descartável para revisão das telas, criado em 16/10/2026. Temas
claro e escuro, dados fictícios e nove direções de produto. Não é ainda um pacote
de template curado ou uma aplicação pronta para produção.

Abra `index.html` em um navegador comum. O navegador interno usado nesta revisão
aceita somente HTTP/HTTPS; `preview.mjs` oferece uma prévia Node sem dependências,
restrita a dez arquivos públicos do spike e ao endereço de loopback. Sua saída
informa a URL local; `node preview.mjs --port=65081` permite escolher uma porta.
Não há build nem instalação de pacotes.

Capturas reais da galeria: [modo claro](preview-light.png) e [modo escuro](preview-dark.png).

## Explorar

A galeria abre em `#galeria` (ou sem hash). Cada miniatura abre uma tela. O seletor
superior e as setas percorrem os nove aplicativos; o botão de tema troca a
aparência das telas. Cada aplicativo tem marca, paleta, hierarquia e navegação
próprias. `style.css` fornece os elementos básicos; `directions.css` define as
composições específicas e suas variações responsivas/claro/escuro.

| Produto fictício | Direção |
| --- | --- |
| Vínculo — CRM | Mesa comercial compacta, sidebar azul profunda, métricas discretas e kanban em destaque. |
| Balanço — Gestão | Navegação horizontal, resumo financeiro, conta e fluxo de caixa lado a lado. |
| Pulso — RH | Tons quentes, formas suaves, pessoas e calendário com espaço generoso. |
| Lume — IA | Rail mínimo, conversa e documento lado a lado, tipografia editorial no documento. |
| Forma — Membros | Academia editorial, navegação superior e aula em destaque com play central. |
| Pátio — Comunidade | Espaços e identidade da comunidade à esquerda, feed ao centro e encontros à direita. |
| Prisma — Quiz | Experiência focada de pergunta/resposta, sem sidebar de gestão, painel ilustrado amarelo. |
| Escopo — Calculadora | Configuração numerada, resumo mineral amarelo, valores monoespaçados e comparação. |
| Sinal — Conversões | Rail, painel denso em ciano, métricas, funil e tabela de atribuição. |

| Tela | Hash | Interações demonstrativas |
| --- | --- | --- |
| CRM | `#crm` | Buscar, filtrar, kanban/lista, adicionar oportunidade e mudar etapa por arraste ou formulário. |
| Gestão | `#gestao` | Filtrar lançamentos, criar lançamento e marcar como recebido/pago. |
| RH e pessoas | `#pessoas` | Buscar, filtrar por departamento, ver perfil e adicionar pessoa fictícia. |
| IA | `#ia` | Sugestões e mensagens abrem respostas predefinidas, documento editável e cópia. Não usa modelo de IA. |
| Área de membros | `#membros` | Play nas capas abre frame de aula, barra ilustrativa e atividade correspondente. Concluir atualiza o progresso. |
| Comunidade | `#comunidade` | Filtrar feed, curtir, salvar, comentar, publicar localmente e confirmar participação ilustrativa em evento. |
| Quiz | `#quiz` | Cinco perguntas, seleção, voltar, pontuação local, perfil e reinício. Não é avaliação psicológica. |
| Calculadora | `#calculadora` | Tipo, quantidade, complexidade, prazo, valor/hora, adicionais e comparação dos últimos dois cenários. |
| Conversões | `#conversoes` | Filtrar período/canal, recalcular indicadores e abrir detalhe de campanha/UTMs. |

A navegação secundária compõe a aparência da página principal e não abre outros
módulos. O spike não implementa aplicativos inteiros. Diálogos, perfil e
notificações são locais. Algumas métricas são cenários fixos ilustrativos;
indicadores derivados de filtros/ações usam os dados da respectiva demonstração.

Dados ficam na memória da página. Recarregar reinicia tudo. Tema se mantém na
navegação da sessão; `?theme=dark` permite iniciar no escuro. Não há autenticação,
backend, pixels, anúncios conectados, matrícula, streaming de vídeo, pagamento
ou envio de dados. As aulas usam frames estáticos com controles ilustrativos;
o play da capa abre a prévia local, sem reproduzir um vídeo real.

## Cálculos

O orçamento usa horas-base por tipo (24/48/16), mais três horas por peça/tela e
adicionais de 12/8/6 horas. Complexidade multiplica por 0,85/1/1,35 e arredonda as
horas para cima. Total = horas × valor/hora × fator do prazo (1/1,1/1,25).
Design/produção/revisão dividem o total em 35%/50%/restante, preservando a soma.

No rastreador, receita, visitas e conversões vêm da soma dos canais selecionados.
Períodos escalam os cenários de 30 dias; taxa = conversões ÷ visitas. ROAS usa
somente receita de canais com investimento pago dividida por esse investimento.
E-mail, sem investimento em anúncios neste cenário, não entra no ROAS.

## Arte, fontes e origem

- `assets/lesson-design.png`, `assets/lesson-ai.png` e
  `assets/lesson-strategy.png`: três frames de aulas criados no ImageGen nativo,
  com Bia apresentando conteúdo de design, IA e estratégia. O retrato próprio de
  Bia, embaixadora virtual, foi usado como referência de identidade. O play e as
  informações do player são HTML. Prompts completos em `art-prompts.json`.
- `assets/avatars.png`: cinco rostos fictícios, arte nativa própria reutilizada
  de `sites/website-digital-marketing`. Outros perfis usam iniciais.
- `assets/body.woff2`: DM Sans local, com OFL integral no diretório de assets.
- `assets.json`: origem, dimensões, tamanhos e hashes dos recursos.

Código original do spike sob Apache-2.0; licença e avisos incluídos. Nenhum código
ou asset dos produtos de referência foi copiado. A [curadoria de referência](../../../sites/references/2026-10-16-web-apps.md)
é a base de direção: Attio/Linear, Pennylane/ERPNext, Humaans, Claude, Kajabi,
Circle, Typeform, involve.me e Triple Whale.

## Limites e próxima etapa

Esta entrega permite avaliar a direção visual e experimentar interações-chave.
Não passou pelos gates de pacote do catálogo, adaptação por Hermes ou revisão
de produção. A criação dos nove templates independentes vem após a revisão
editorial do spike. O catálogo do Desktop não foi alterado.

Conferência da revisão: nove telas × dois temas × desktop/390px e interações-chave,
incluindo as três prévias de aula, progresso, filtros, documento de IA, quiz completo,
feed, calculadora e atribuição. Sem erros registrados no Chromium. Sintaxe JavaScript
e integridade dos cinco recursos conferidas. Essa é uma verificação focada de spike;
não houve suíte extensa, revisão independente ou prova em aparelho físico.

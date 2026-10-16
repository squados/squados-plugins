# Numa — spike dos nove aplicativos web

Protótipo visual descartável para revisão das telas, criado em 16/10/2026. Temas
claro e escuro, dados fictícios e uma família visual comum. Não é ainda um pacote
de template curado ou uma aplicação pronta para produção.

Abra `index.html` em um navegador comum. O navegador interno usado nesta revisão
aceita somente HTTP/HTTPS; `preview.mjs` oferece uma prévia Node sem dependências,
restrita a sete arquivos públicos do spike e ao endereço de loopback. Sua saída
informa a URL local. Não há build nem instalação de pacotes.

Capturas reais da galeria: [modo claro](preview-light.png) e [modo escuro](preview-dark.png).

## Explorar

A galeria abre em `#galeria` (ou sem hash). Cada miniatura abre uma tela. O seletor
superior e as setas percorrem os nove aplicativos; o botão de tema troca a
aparência de toda a família. Marca, tipografia, cores, espaçamentos e componentes
são os mesmos, com composição específica para cada nicho.

| Tela | Hash | Interações demonstrativas |
| --- | --- | --- |
| CRM | `#crm` | Buscar, filtrar, kanban/lista, adicionar oportunidade e mudar etapa por arraste ou formulário. |
| Gestão | `#gestao` | Filtrar lançamentos, criar lançamento e marcar como recebido/pago. |
| RH e pessoas | `#pessoas` | Buscar, filtrar por departamento, ver perfil e adicionar pessoa fictícia. |
| IA | `#ia` | Sugestões e mensagens abrem respostas predefinidas, documento editável e cópia. Não usa modelo de IA. |
| Área de membros | `#membros` | Abrir prévia textual de aula e marcar conclusão, atualizando o progresso. |
| Comunidade | `#comunidade` | Filtrar feed, curtir, salvar, comentar, publicar localmente e confirmar participação ilustrativa em evento. |
| Quiz | `#quiz` | Cinco perguntas, seleção, voltar, pontuação local, perfil e reinício. Não é avaliação psicológica. |
| Calculadora | `#calculadora` | Tipo, quantidade, complexidade, prazo, valor/hora, adicionais e comparação dos últimos dois cenários. |
| Conversões | `#conversoes` | Filtrar período/canal, recalcular indicadores e abrir detalhe de campanha/UTMs. |

A sidebar secundária compõe a aparência da página principal e não abre outros
módulos. O spike não implementa aplicativos inteiros. Diálogos, perfil e
notificações são locais. Algumas métricas são cenários fixos ilustrativos;
indicadores derivados de filtros/ações usam os dados da respectiva demonstração.

Dados ficam na memória da página. Recarregar reinicia tudo. Tema se mantém na
navegação da sessão; `?theme=dark` permite iniciar no escuro. Não há autenticação,
backend, pixels, anúncios conectados, matrícula, vídeo, pagamento ou envio de dados.

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

- `assets/course-covers.png`: tríptico de três capas criado no ImageGen nativo
  nesta produção. Recortes em CSS mantêm a proporção da arte. Prompt completo
  em `art-prompts.json`.
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

Conferência local: nove telas × dois temas × desktop/390px, mais 14 observações
de interações-chave, sem erros registrados no Chromium. Sintaxe JavaScript e
integridade dos três recursos conferidas. Essa é uma verificação focada de spike;
não houve suíte extensa, revisão independente ou prova em aparelho físico.

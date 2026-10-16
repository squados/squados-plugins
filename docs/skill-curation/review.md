# Revisão independente e correções

Revisão final realizada por um revisor com contexto novo, em modo somente leitura,
contra a spec, o plano, Review Focus e os arquivos dos dois repositórios. O primeiro
parecer recusou o fechamento: um achado crítico, quatro grupos importantes e um
menor. Não houve segunda rodada independente; a implementação aplicou uma passada
de correção e verificou cada achado abaixo.

| Achado | Correção e evidência |
|---|---|
| Telefonia persistia segredos em .env | Cliente legado excluído do bundle e receitas substituídas por operação através de conexão segura. A mesma revisão retirou os clientes Google que persistiam OAuth em arquivos. As duas skills declaram conexão segura como requisito; não oferecem setup alternativo em arquivos. Contrato de publicação passou de RED a GREEN e inclui regressão contra esses clientes. |
| Caminhos de comando ausentes | Corrigidos executável de transcrição, auxiliares de recálculo, referências científicas e workflows ComfyUI. O verificador passou a conferir também spans inline e blocos de comando. A passada encontrou e corrigiu 52 referências antigas; caminhos do projeto são marcados explicitamente PROJECT/. |
| Depuração Linus dependia de wrapper ausente/Unix | Modo reescrito para interpretador e runner reais do projeto, PowerShell/Windows e alternativas de outros sistemas, sem alterar ptrace ou instalar outro editor. Pdb interativo só com terminal adequado; DAP quando disponível. |
| Exigências de outro harness | Crítica visual funciona na sessão atual; delegação é opcional e depende de ferramenta/autorização nativas. Retirados modelos obrigatórios, receitas Cron e native-mcp inexistente. Pesquisa científica recebeu um modo próprio que encaminha às referências técnicas pertinentes. Rotinas somente quando solicitadas. |
| SHA da proveniência divergente da URL | Revisões corrigidas pelos commits imutáveis já fixados nas URLs. Verificador rejeita nova divergência; teste exercita par incorreto e correto. |
| Hash editorial sem guarda | Revisão sha256-lf cobre a árvore inteira, com ordem estável e normalização de CRLF/LF. O verificador compara índice e pacote e falha após edição sem regeneração. Regressão prova invariância de newline e detecção de mudança real. |

A revisão também identificou templates científicos com componentes LPPL e fontes
originais obrigatórios ausentes. Eles foram retirados da distribuição; Darwin
fornece um template autoral MIT e preparação do formato oficial no projeto quando
solicitado. Guia e referências científicas redistribuíveis foram preservados.

Não foram julgados como sucesso ponta a ponta: contas externas autenticadas,
transcrição/inferência, OCR, renderização Word/PowerPoint, compilação científica,
publicação e alterações concorrentes. O gate geral do Desktop conserva uma falha
de formatação fora do footprint, explicitada no [aceite](acceptance.md).

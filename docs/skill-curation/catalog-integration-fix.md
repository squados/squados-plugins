# Correção da biblioteca exibida — 16/10/2026

A curadoria dos pacotes estava entregue, mas o aplicativo ainda somava catálogos
e mostrava cópias de fábrica como se fossem instalações escolhidas pela pessoa.
Esta correção trata o consumo da biblioteca, suas capas e os defaults antigos.

## Causa comprovada

- O cache de desenvolvimento tinha vinte entradas anteriores: onze GitHub e nove
  Hermes. O serviço somava essas entradas ao seed e não propagava remoções.
- O endpoint público ainda retornava v1, com 48 itens, durante esta verificação.
  Publicação remota continua separada dos commits locais.
- Os dois perfis do Studio tinham dezenove/dezoito skills; seus manifestos
  registravam os exemplos apontados pelo usuário como cópias de fábrica.
- O filtro de origem vinha de publisher editorial, que não prova instalação.
- As capas reaproveitadas ainda imprimiam marcas de fornecedores.

## Critérios de aceite

| Critério | Implementação e prova |
| --- | --- |
| Não ressuscitar entradas removidas | GalleryService aceita somente snapshot editorial v2 próprio e substitui integralmente a seleção. Cache misto/v1 não prevalece. Quatro regressões do serviço passaram. |
| Um catálogo público para todos os leitores | list, library e catalog SquadOS usam o mesmo carregamento; o leitor legado também preserva a curadoria. |
| Descobrir sem filtro de origem | SkillLibraryPage oferece somente filtros de função e busca nessa aba; regressão renderer passou. |
| Minhas skills: SquadOS e Outras | Classificação por source.type, sem confiar no publisher. Teste usa uma instalação sem procedência SquadOS que se autodenomina SquadOS e confirma Outras. |
| Dependências internas fora da lista de especialistas | GalleryService omite cópias de fábrica; escolhas humanas explícitas continuam gerenciáveis. |
| Defaults retirados fora do uso automático | skill_defaults usa manifesto nativo/seleção atual, desativa doze cópias antigas e preserva arquivos, escolhas humanas, instalações diretas e dependências atuais. |
| Perfis antigos recebem novas dependências | Sync nativo quando a seleção contém nomes ainda ausentes do manifesto; exclusões/edições seguem upstream. Regressão RED→GREEN. |
| Capas sem marca Anthropic/OpenAI/Hermes | Vinte SVGs autorais e vinte WebPs800×450, máximo12346bytes, renderizados em Chromium sem erros. Capas históricas retiradas dos dois índices de assets. |
| Terceiros não voltam ao índice oficial | Validador recusa source externo, com regressão RED→GREEN; a procedência de instalações diretas permanece suportada. |

## Verificação

- 81 testes focados em onze arquivos passaram; mais três testes do validador.
- Cinco testes Hermes passaram, incluindo duas leituras sucessivas da migração,
  preservação de arquivo/escolha humana e a inclusão de dependência nova.
- Prova em cópias isoladas dos dois perfis existentes: dezenove SKILL.md
  preservados por cópia, sete dependências ativas, doze defaults antigos
  desativados e zero problemas. O perfil com dezoito recebeu skill-search.
- O contrato dos vinte pacotes passou; seus scripts/conteúdos não foram alterados.
- Typecheck passou. Abertura da aplicação/renderer passou no smoke headless.

O gate:dev não ficou verde: parou no Biome com formatação em trabalho paralelo.
O segundo caso do smoke, referente à renderização do escritório, falhou no
limiar de tamanho do PNG do canvas (boot-smoke.spec.ts:236); duas capturas
opcionais foram puladas. Não há claim de gate geral ou smoke completo aprovado.

Nenhum perfil pessoal foi alterado diretamente pela sessão. As provas usam
cópias dentro do scratch dos repositórios. A reconciliação roda no aplicativo
atualizado; não é uma limpeza manual do computador. Push/publicação não executados.

## Integração local

Plugins: 42e258d. Desktop: 9485bb9f, a81e5f90 e affbf426, em main. Catálogos e
vinte imagens foram comparados diretamente nos blobs HEAD dos dois repositórios,
sem diferenças. As alterações simultâneas de importação/remoção de skills ficaram
fora destes commits e foram preservadas no worktree. O lote posterior à integração
passou com81testes/11arquivos; typecheck e check dos onze paths passaram.

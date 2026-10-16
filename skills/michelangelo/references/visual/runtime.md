# Execução no Studio

Resolva SKILL_DIR pela pasta desta skill e saídas pela pasta de trabalho escolhida.
Use os procedimentos internos de design/criação/publicação do Studio quando a
tarefa depender da plataforma. Não importe um diretório pessoal de outro aplicativo.

O detector e a captura usam Node e Playwright. Há manifesto/lock em scripts/;
prepare dependências nesse diretório da instalação quando necessário e autorizado.
Execute o detector com o arquivo ou URL real, meio e design system aplicáveis:
`node SKILL_DIR/scripts/detector/run.mjs ALVO --medium web --ds DESIGN.md`.
Use print ou slide para esses meios. A captura usa scripts/shot.mjs e oferece
folha de contato, recorte e variantes. Descubra --help/opções no script instalado.

Use o navegador disponível e siga as instruções do projeto para processos e
janelas. Pare servidores/processos que criou. Entrega local fica em arquivos e
preview do Studio. Publicação externa só ocorre quando fizer parte do pedido.

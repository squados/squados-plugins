# Biblioteca de motions próprios

## Resultado

Criar 331 peças individuais, uma para cada referência do catálogo Skillry
do commit 7ca573b. A coleção cobre 122 efeitos CreatorMotion, 208 cenas
LaunchMotion e um fluxo Paper Cutout. Na galeria, a pessoa vê o vídeo da
nossa peça e cita o nome em uma edição com Tarantino ou ibeia-video-edit.
Paper Cutout conta como uma entrada, com um curta original de demonstração
e uma forma de trocar o storyboard para produzir outro filme.

Cada peça tem um nome próprio em português, ID estável, vídeo próprio,
composição editável, descrição de quando usar, entradas que o agente pode
trocar e prompt de exemplo. O nome identifica a peça no catálogo e nas duas
skills de edição. Uma entrada individual é uma composição executável por
nome. As duas skills existentes dão acesso à biblioteca inteira.

## Direção criativa

A referência identifica a função na edição e a ação que deve ficar clara,
como dirigir o olhar, comparar valores, ligar etapas ou atravessar um corte.
Conceito visual, tipografia, textos, enquadramento, ritmo, máscaras, código e
materiais das novas peças são criados para a nossa biblioteca. Os termos da
Skillry permitem usar o pacote adquirido no trabalho, mas reservam a
redistribuição do pacote e a atribuição de seus materiais. O benchmark
identifica o problema que cada peça resolve. Os arquivos executáveis,
previews, exemplos e recursos da Skillry ficam no acervo licenciado.
[Termos da Skillry, seções 6 e 8](https://skillry.dev/terms)

A primeira passada em cada peça define o estado inicial, a transformação
principal e o quadro de leitura. Aproveite curvas, luz, profundidade e
textura onde ajudam a entender a ação. Use fundos branco, preto ou
transparente conforme o efeito. A demonstração contém a própria composição
que vai para a edição. Quando uma cena se destina a interfaces, use um recorte
da interface real do projeto, ou arte gráfica autoral que permita demonstrar
o mesmo gesto. Quando a função envolver um apresentador, mostre o gesto com
um sujeito gráfico próprio e teste também a entrada de mídia real em um
teste local autorizado. A demonstração mantém o foco no motion. Use texto e
dados de demonstração próprios, identificáveis como ilustrativos.

## Produção e acesso

- Use composições independentes de HyperFrames, com HTML, CSS e SVG como
  ponto de partida e render por frame. Use recursos adicionais do motor
  apenas nas peças que dependam deles. Trave a versão após validar render,
  parâmetros e reprodução no Windows com a primeira rodada. O cache local
  já tem a versão 0.8.33 como candidata ao teste inicial. A solução
  aproveita o motor já documentado na Tarantino, e a licença Apache 2.0
  permite distribuir nossa biblioteca com o fluxo de reprodução documentado.
  Remotion é uma alternativa viável no acervo ibe.IA, mas ligaria a biblioteca
  a um segundo fluxo de instalação e reprodução nesta primeira entrega.
  [Composições](https://hyperframes.heygen.com/concepts/compositions)
  · [Variáveis](https://hyperframes.heygen.com/concepts/variables)
  · [HyperFrames no GitHub](https://github.com/heygen-com/hyperframes)
- Mantenha código e catálogo em squados-plugins. Compartilhe entre peças
  funções de renderização e recursos de composição quando houver reuso real.
  Cada peça tem sua própria sequência visual. O catálogo registra o caminho
  editável, o vídeo, as entradas de projeto, o prompt e o vínculo com a
  referência. O vínculo serve à conferência do inventário e à atribuição.
- A galeria abre por arquivo local e usa o mesmo fluxo de busca por nome e
  categorias, com player MP4 no cartão. Renderize previews leves a 30 fps
  a partir da composição final. O master de uso sai a 1080p por padrão, ou
  com alpha quando a peça for uma sobreposição. Use H.264 no preview sobre
  um fundo neutro e um formato com alpha no master quando aplicável.
  [Alpha no HyperFrames](https://github.com/heygen-com/hyperframes/blob/main/packages/producer/README.md)
- Deixe previews renderizados no diretório local da galeria, ignorado pelo
  Git, com instrução de regeneração por ID e para a coleção. O volume das
  referências é de 47 minutos mesmo antes do Paper Cutout. A 1 Mbit/s,
  seriam cerca de 350 MB de previews. O Git carrega as fontes e o índice.
  A publicação de um artefato com vídeos é uma etapa de distribuição separada.
- Na Tarantino e na ibeia-video-edit, resolver um nome leva à composição
  própria e às suas entradas, com exemplo de render. O agente troca texto,
  imagens, takes ou dados do projeto nos pontos declarados pela peça.
  Efeitos atrás de um sujeito recebem o take e uma máscara alinhada ou
  recorte com alpha como entradas. A edição prepara o recorte pelo seu
  fluxo quando só tiver o take. A biblioteca concentra-se na composição.
  As duas skills mantêm as regras de montagem do projeto, incluindo
  a câmera contínua onde a ibeia-video-edit exige.
- Adote 16:9 como formato da galeria. O render de uso segue o formato do
  projeto quando a composição comportar o reenquadramento. Durante a
  produção, cada peça própria entra na galeria após sua verificação. Os
  demais registros continuam identificados como referências até sua troca.

## Primeira rodada

Cinco peças, com nomes de trabalho em português. Os nomes e as decisões
visuais finas são decisões editoriais do implementador, sujeitas à revisão
junto dos clipes.

| Peça proposta | Referência de função | O que a amostra precisa demonstrar |
| --- | --- | --- |
| Luz em Facetas | Light Spectrum | Um feixe interage com um material e entrega a atenção a outra forma, com arte e desenho óptico próprios. |
| Letra em Relevo | Title Behind Subject | O título entra por trás de um sujeito e continua legível, com sobreposição testada em fundo claro e escuro. |
| Corte por Dobra | Polygon Scene Wipe | A dobra conecta dois quadros, cobre a área no instante da troca e assenta no segundo take. |
| Pedido em Pulso | Agent Checklist | Um pedido vira resposta visível em etapas, com continuidade entre o primeiro gesto e o resultado. |
| Histórias em Camadas | Paper Cutout Story Video | Um curta autoral monta um mundo em camadas, dá movimento aos recortes e muda de cena a partir de um storyboard trocável. |

A rodada produz cinco vídeos finais da biblioteca para Renato aprovar o
acabamento antes de replicar o padrão nos outros lotes. Depois desse aceite,
os demais lotes seguem a régua aprovada e a revisão por peça.
Os testes de aceite incluem tocar cada vídeo em velocidade normal, examinar
a transição entre estados e montar uma peça com conteúdo trocado pelo nome
através das instruções que a skill usará. A validação técnica do motor e o
tempo medido para criar e renderizar essa rodada informam a estimativa dos
lotes seguintes. A amostra define o padrão e conta na cobertura das 331.

## Aceite do catálogo

1. Os 331 registros originais do benchmark têm um correspondente próprio,
   e cada correspondente tem identidade, vídeo e fonte executável distintos.
   A conferência usa o inventário fixado em 7ca573b.
2. O movimento principal é legível sem o título do cartão. Cada vídeo passa
   por revisão visual em velocidade normal e nos quadros de entrada, ação e
   repouso ou corte. Peça que falhar volta para ajuste antes de entrar na
   galeria de produção.
3. O preview abre na galeria e sai da mesma composição que o master de uso.
   A duração registrada corresponde ao vídeo. Entradas parametrizadas
   aceitam material do projeto. Teste pelo nome nas duas skills com uma
   edição de exemplo, inclusive uma sobreposição ou transição.
4. O checkout identifica as fontes e permite reproduzir as demonstrações.
   O plano lista a revisão e as verificações de cada lote até 331 de 331.

# Galeria de motion e edição de vídeo

## Uso

A galeria permite reconhecer um efeito pelo movimento e pelo nome. Durante uma edição posterior, a pessoa pode pedir ao Codex ou à Tarantino que use os efeitos X, Y e Z. O nome exibido é a referência. O prompt abaixo do efeito descreve o movimento que a pessoa vê. A revisão de acabamento de 05/11 define a galeria como acervo de animações isoladas para uso na montagem, sobre transparência, preto ou branco.

## Acervo

- Migrar as 176 entradas publicadas no índice interno de b-rolls de `ibeia-videos`, em 26 categorias. O inventário editorial vem de `src/compositions/brolls/catalog.json`. O registro `galeria-brolls/producao.json` confirma 175 masters para 176 IDs. A entrada `06-E3` compartilha a mídia de `07-G`. Manter ambos os IDs. O conjunto inclui 35 efeitos de edição e 41 exemplos de remarketing.
- Preservar os IDs e os nomes existentes que possam ser publicados. Dar um nome pesquisável e próprio a cada entrada cujo título hoje repete o nome da categoria. Manter o vínculo entre cada registro de origem e sua demo pública.
- Recriar os 243 registros como efeitos isolados. Nos exemplos de processo, extrair o gesto de edição e desenhá-lo em abstrato. Para transições, usar somente os elementos gráficos necessários para mostrar a troca. As categorias descrevem o tipo de movimento. Títulos anteriores seguem pesquisáveis como aliases. A procedência continua registrada.
- O acervo operacional do Nextcloud conserva os masters, as versões de produção, os registros e as referências dos projetos que ainda os usam. O catálogo de consulta e as demonstrações públicas passam para `squados-plugins`. A migração é da coleção visual e dos nomes, incluindo as recriações, com arquivos de produção preservados na origem para reedição. A documentação no endereço antigo aponta para a nova galeria oficial e identifica o acervo interno como material de produção.
- Cobrir as 56 referências dos 19 pacotes enumerados no checkout fornecido de `motion-skills`, uma entrada por par pacote/skill. Os dois pacotes com `lower-thirds` terão exemplos distintos, um para vídeo curto e outro para a sobreposição transparente. Guias de processo, como briefing, revisão e formatos de entrega, terão um exemplo visual do resultado ou da comparação que o método orienta.
- Acrescentar as cinco transições nomeadas em `showcase.html` como demos isoladas entre duas cenas fictícias: implosão em espiral, varredura de faixas, persiana, whip pan com desfoque e íris. Os seis trechos do showcase também entram como exemplos individuais de entrada tipográfica, escalonamento, composição ou assinatura, com seus movimentos distintos demonstrados. A linha de base é de 243 entradas, 176 da casa e 67 do benchmark.
- Manter autoria e referência específica de cada item do benchmark. As demos e os prompts serão criações da galeria que ensinam a técnica. Qualquer trecho incorporado exige verificação da licença do pacote e os respectivos avisos. Para o pacote de ilustração generativa, cuja árvore consultada não apresenta `LICENSE` na raiz, usar referência e demonstração própria.

## Página e contrato

- Diretório canônico `motion-gallery/` no `squados-plugins`, com `index.html`, catálogo JSON e recursos da galeria. O JSON é a fonte do HTML e da consulta por agentes. Cada entrada contém ID estável, nome, categoria, demonstração, prompt e procedência. O HTML abre por arquivo local e funciona em hospedagem estática.
- Cada categoria agrupa cartões. Cada cartão mostra nome, demo acionável e, imediatamente abaixo, o controle nativo **Ver prompt**, inicialmente recolhido. Uma busca por nome e ID ajuda a localizar uma entrada quando já se sabe como ela se chama. Links por ID permitem citar uma demo. A reprodução é voluntária e funciona com mouse ou teclado.
- Para os efeitos já documentados, usar o prompt original somente quando adequado para distribuição. Escrever uma receita de adaptação explícita quando a origem registra apenas a descrição ou quando o prompt depende de insumos internos. A receita informa entrada, movimento, ritmo e resultado esperados, e corresponde à demonstração exibida.
- O efeito mostrado é desenhado pela função identificada em `demo.file` e `demo.key`. O metadado `demo.background` indica transparência, preto ou branco. O HTML abre sem CDN, conta, instalação ou servidor e carrega os palcos conforme aparecem na tela.
- A Tarantino já é distribuída ao Studio de `skills/tarantino/`. Acrescentar o ponto de consulta nessa skill, fora do pacote de mídia, e na entrada canônica de `ibeia-video-edit`. Ambas consultam nome/ID no mesmo JSON público quando ele estiver disponível. Em desenvolvimento, podem ler o checkout local quando acessível. Quem consome o catálogo usa o prompt como referência para adaptar o efeito ao material pedido. A Tarantino mantém seus modos e formato de instalação atuais.
- O resultado desta execução fica na `main` local de `squados-plugins`. A publicação futura é um passo separado. A URL canônica do catálogo usa o padrão que o Studio já usa para ler arquivos do repositório no GitHub. O HTML pode ser servido como está na publicação.

## Aceite

1. O inventário cruza os 176 IDs internos, os 56 pares pacote/skill e as 11 entradas do showcase com suas demos e prompts. Cada título do site corresponde ao título recuperado pelo agente.
2. Cada preview abre e exibe a ação que o título descreve. As transições mostram os dois lados do corte. Entradas oriundas de fluxos mostram seu movimento como animação isolada. O renderer mantém o alpha quando indicado e o prompt descreve a animação apresentada.
3. No navegador, o HTML funciona aberto do disco em desktop e em viewport móvel. Conferir navegação por categoria, busca, acesso direto por ID, reprodução e abertura do prompt por teclado. Checar automaticamente a paridade de IDs, caminhos locais e presença de demos e prompts. Para demos de vídeo, testar decodificação. Para animações, conferir mudança de quadro. Revisar visualmente a fidelidade das demonstrações.
4. As duas skills apontam para o mesmo catálogo. A atualização da Tarantino passa nos checks do pacote de plugins. O acervo e as referências operacionais existentes continuam acessíveis. O diff público não inclui masters de campanha, retratos de alunos, material de terceiros sem autorização, logs nem dados internos.
5. A verificação do catálogo publicado e da URL pública ocorre após a publicação futura.

## Referências

A vitrine atual de b-rolls já oferece busca por categoria e ID. O catálogo de prompts do Studio estabelece o padrão de JSON no repositório público. O novo HTML aproxima demo, nome e prompt no mesmo cartão. [Catálogo de prompts do Studio](https://github.com/squados/squados-plugins/tree/main/prompts) · [Elemento HTML details](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details)

A coleção local do benchmark está na revisão `238dfc55aac123d4649be39adfe58c43193ca349`. O showcase contém as seis cenas e as cinco transições de referência. Os links de origem das 56 entradas devem apontar aos arquivos específicos dos seus pacotes. [Repositório iart.ai Motion Skills](https://github.com/iart-ai/motion-skills)

O GitHub recomenda manter o checkout pequeno. O acervo histórico de b-rolls tem cerca de 470 MiB, incluindo produção e versões anteriores. A galeria usará demos compactas e código local conforme a necessidade de cada técnica. [Limites e recomendações de armazenamento do GitHub](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github)

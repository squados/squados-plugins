# Origem e alterações

**Simulador de Cidades / City Simulator** é uma versão modificada de **3d.city**, de **lo-th**:

- Repositório: https://github.com/lo-th/3d.city
- Commit-base: `60fc6de2451ac6cf4df211a7cdae6c55c97e73c7`.
- Fontes originais de simulação: MicropolisJS, de Graeme McCutcheon, adaptado de Micropolis.
- Renderer: Three.js e módulos auxiliares incluídos pelo upstream, com seus cabeçalhos de licença.
- Clone de referência preservado sem alterações; `.git`, dependências instaladas,
  exemplos HTML de desenvolvimento e a implementação histórica `micro_old` não fazem parte da cópia.

## Licenças e autoria

O README, package.json e cabeçalhos de builds do commit-base dizem MIT. Entretanto,
o arquivo `LICENSE` do mesmo commit declara **GNU GPL v3 com termos adicionais
para MicropolisJS** e exige preservar o aviso de copyright e esses termos.
`COPYING` contém a GPL v3 completa. Diversas fontes `src/micro/` também declaram GPLv3.
Esses textos foram preservados integralmente. O README original foi guardado em
`UPSTREAM-README.md`; não se resolveu a divergência atribuindo MIT ao pacote todo.
O manifesto local usa `SEE LICENSE IN LICENSE` para evitar essa afirmação.

Os termos adicionais não concedem direitos à marca SimCity nem associação à
Electronic Arts; exigem identificar modificações e não falsear a origem, entre
outras condições descritas em `LICENSE`. Esta demo é identificada como modificada
e credita o projeto. A licença MIT da raiz de `squados-plugins` não substitui esses termos.
Modelos, imagens e sons herdados foram preservados com a origem upstream; não se inventa
uma licença separada para recursos sem aviso individual.

O SquadOS contribuiu a identidade da adaptação, o selo e os ícones SVG da nova
interface, a composição do HUD, os textos PT-BR/EN e o empacotamento demonstrativo.
O novo nome não reivindica a autoria do motor, simulação, modelos, texturas ou sons
herdados. Os créditos continuam acessíveis em `Gestão / Créditos` e neste documento.

## Adaptação desta demo

- Novo save inicial gerado offline por `scripts/generate-demo.mjs` com o mapa,
  ferramentas, zonas e formato de save nativos. Não há engine paralela.
- Entrada automática pelo carregador nativo, sem escolha de mapa/dificuldade.
- Compilação/aquecimento nativo dos materiais antes de entrar no mapa; a transição
  direta precisa preservar esse preparo que a introdução original já realizava.
- Correção mínima em `Main.playMap`/`WorkerBridge`: o carregamento de save já inicia
  a simulação no worker; enviar PLAYMAP novamente zerava o estado restaurado.
- Enquadramento inicial da cidade, terreno plano compatível com as coordenadas do save.
- Construção em terreno plano usa altura zero; protege também a resposta assíncrona
  de construção quando a ferramenta já foi desmarcada.
- Ambiente mineral, materiais de solo foscos, enquadramento por viewport e saída
  nativa NeutralToneMapping. O filtro LUT opcional fica desativado nesta identidade;
  seus recursos e fontes permanecem preservados.
- Evento padrão `wheel` no controle de zoom; rótulos de acessibilidade e teclado
  nos controles principais. Turbina eólica está marcada indisponível, como no upstream.
- HUD próprio: cabeçalho SquadOS com nome novo e selo SVG, Prefeitura lateral,
  indicadores urbanos e prancheta de ferramentas com SVGs próprios, nomes e preços.
  As cores semânticas das ferramentas, seus IDs e comandos nativos são preservados.
- Interface principal, ajuda, métricas, ferramentas e títulos dos painéis em PT-BR/EN;
  escolha de idioma conservada no URL ao reiniciar. Link relativo ao índice.
- Gestão e painéis têm scroll interno em telas estreitas. Em telas baixas, a faixa
  de ferramentas rola horizontalmente, mantendo a área de construção utilizável.
- Save local e exportação JSON continuam nativos. A ação NEW MAP herdada chamava
  funções inexistentes; a adaptação apresenta `Reiniciar Nova Aurora`, com o mesmo
  contrato de restauração do cabeçalho, sem menu de geração.
- Painel de créditos distingue a identidade SquadOS da origem do motor e recursos.

## Limites

Requer HTTP para Worker/assets e um navegador com WebGL 2. Não é uma implementação
nativa de celular. Recursos de orçamento, desastre, saves manuais e todos os
painéis avançados upstream são preservados, porém o smoke desta adaptação se
concentra no carregamento, construção, simulação, navegação, pausa e reinício.
Campos internos dos painéis avançados e algumas mensagens herdadas continuam
em inglês. Esta adaptação não se apresenta como tradução integral da simulação.
O jogo não contém rede externa para rodar; links de crédito só abrem mediante clique.
Nenhum push, hospedagem pública ou publicação é inferido pela presença destes arquivos.

Na integração com `http-server`, o Chromium pode reportar `net::ERR_ABORTED`
para os HDRs depois do consumo completo do stream. O comportamento foi reproduzido
fora da engine com o mesmo padrão de streaming de FileLoader, sem AbortSignal,
com HTTP 200, EOF, bytes/SHA corretos e HDR decodificado. Os loaders estão intactos
em relação ao upstream; não foram modificados para ocultar eventos de rede.
Leia a delimitação e os critérios estritos de evidência em [VALIDATION.md](VALIDATION.md).

O mesmo evento pós-consumo foi observado uma vez no decoder Draco WASM. O teste
capturou HTTP 200, EOF, 192.420 bytes integrais, SHA-256 igual ao arquivo local
(`a680d927bed9cb864ddbd63521868891af2bfbe755092761b4837487618df8ac`) e
WebAssembly.compile bem-sucedido com 149 exports, além da cidade decodificada.
Essa evidência está separada dos HDRs no relatório; não se ignora falha sem essas provas.

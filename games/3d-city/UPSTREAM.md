# Origem e alterações

Esta é uma versão modificada de **3d.city**, de **lo-th**:

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
Modelos, imagens e sons foram preservados com a origem upstream; não se inventa
uma licença separada para recursos sem aviso individual.

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
- Apenas os dois LUTs usados no caminho inicial são carregados; todos os recursos
  originais de qualidade permanecem na pasta, para evolução e consulta das fontes.
- Evento padrão `wheel` no controle de zoom; rótulos de acessibilidade e teclado
  nos controles principais. Turbina eólica está marcada indisponível, como no upstream.
- Barra discreta de reinício e instruções PT-BR/EN; HUD original preservado.
- Link malformado do painel About corrigido e avisos da modificação acrescentados.

## Limites

Requer HTTP para Worker/assets e um navegador com WebGL 2. Não é uma implementação
nativa de celular. Recursos de orçamento, desastre, saves manuais e todos os
painéis avançados upstream são preservados, porém o smoke desta adaptação se
concentra no carregamento, construção, simulação, navegação, pausa e reinício.
O jogo não contém rede externa para rodar; links de crédito só abrem mediante clique.
Nenhum push, hospedagem pública ou publicação é inferido pela presença destes arquivos.

Na integração com `http-server`, o Chromium pode reportar `net::ERR_ABORTED`
para os HDRs depois do consumo completo do stream. O comportamento foi reproduzido
fora da engine com o mesmo padrão de streaming de FileLoader, sem AbortSignal,
com HTTP 200, EOF, bytes/SHA corretos e HDR decodificado. Os loaders estão intactos
em relação ao upstream; não foram modificados para ocultar eventos de rede.
Leia a delimitação e os critérios estritos de evidência em [VALIDATION.md](VALIDATION.md).

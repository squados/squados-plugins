# Quatro aberturas para validação — 16/10/2026

**Estado: Nortea, Orbe e Pipa aprovadas; Trama revisada, aguardando validação.** As páginas finais
e suas interações ainda não foram implementadas. O usuário autorizou os quatro
templates e pediu validar primeiro aqui no chat, usando ImageGen nativo.

Abra [index.html](index.html) diretamente no navegador, sem servidor. Cada imagem
é uma seção de abertura, em formato horizontal; clique para inspecionar a original.
Essas imagens são propostas de composição, não capturas de páginas funcionando.

## Marcas e direções propostas

| Template futuro | Marca fictícia proposta | Referência escolhida | Conceito |
| --- | --- | --- | --- |
| `website-digital-marketing` | **Trama**, escola de negócios digitais | [Flux Academy](https://www.flux-academy.com/courses/web-design-masterclass) | Fundo ameixa/carvão, creme/coral, foco na instrutora fictícia, sem cabeçalho e com prova social demonstrativa |
| `website-corporate` | **Nortea**, consultoria de operações | [BCG](https://www.bcg.com/) | Composição editorial, marfim e verde-petróleo, fotografias e relatórios próprios, animação discreta |
| `website-futuristic` | **Orbe**, workspace de inteligência | [Reflect](https://reflect.app/) | Azul-noite, arcos luminosos 2D e painel de produto frontal, sem modelos 3D complexos |
| `website-playful` | **Pipa**, escola criativa | [Headspace](https://www.headspace.com/) | Creme, amarelo/coral/menta, personagens ilustrados próprios, mascote-pipa e movimentos suaves |

As referências visuais foram escolhidas pelo usuário. Os nomes, conteúdo e arte
acima são próprios desta etapa; apenas a revisão da Trama ainda aguarda validação. Os personagens e
fotografias das propostas são sintéticos; não representam professores/clientes
reais nem resultados de empresas reais.

## Conteúdo e interações previstas para as one-pages

### Trama

Promessa: **Crie um negócio digital com método.** A one-page terá abertura,
transformação/método, programa, instrutora, oferta e FAQ. Sem cabeçalho, com
retrato em fundo limpo e faixa de avatares/estrelas abaixo dos botões, identificada
como “Avaliações demonstrativas”. Os botões usarão âncoras quando apropriado;
selecionar um módulo trocará sua prévia; “Ver uma aula” abrirá uma demonstração
local; inscrição terá formulário e confirmação local, sem compra ou envio real.

### Nortea

Promessa: **Clareza para decidir. Método para crescer.** A página terá serviços,
método, casos ilustrativos, equipe e contato. Seletores de serviços/casos mudarão
o conteúdo local; os casos poderão ser expandidos; contato terá validação e
confirmação demonstrativa. Movimento discreto, adequado à referência corporativa.

### Orbe

Promessa: **Conecte ideias. Encontre o próximo passo.** A página terá capacidades,
demonstração visual, aplicações, planos e FAQ. Selecionar uma capacidade trocará
o painel, diagrama e dados mock; comparar planos alterará a apresentação local.
O brilho/halo será feito em CSS/SVG e os controles/textos serão HTML real.

### Pipa

Promessa: **Criatividade para dar cor ao seu dia.** A página terá experiências,
atividades, escola, convite e perguntas. “Desenhar”, “Escrever” e “Inventar”
trocarão a ilustração/conteúdo; escolher uma experiência abrirá sua demonstração;
inscrição terá resposta local. Arte plana, personagens próprios e movimento suave.

Os exemplos não incluem autenticação ou backend. As interações acima são o
escopo previsto após validação, não funcionalidades comprovadas por estas imagens.

## Geração e arquivos

Quatro chamadas separadas ao **ImageGen nativo**, uma para cada hero. Não foi usado
CLI, API externa ou engine local. Os prompts completos estão em [prompts.json](prompts.json).
Após o feedback, uma quinta chamada nativa editou somente a Trama, preservando
instrutora, paleta e tipografia. Os três conceitos aprovados mantêm os mesmos bytes.
As saídas foram copiadas do diretório padrão do ImageGen, sem modificar seus bytes.
Hashes e dimensões estão em [assets.json](assets.json).

A [verificação da galeria](QA.json) passou: quatro PNGs 1586×992 íntegros,
imagens decodificadas, links locais existentes, primeiro acesso por teclado e
ausência de overflow horizontal em 1440px e 390px. A galeria foi renderizada e
inspecionada na entrega inicial. Após a revisão, foram conferidos os quatro hashes,
dimensões, links, status e preservação dos três PNGs aprovados, sem repetir o browser
para uma troca de imagem/texto. Esse resultado não valida interações dos templates finais.

- [Trama](trama-hero.png)
- [Nortea](nortea-hero.png)
- [Orbe](orbe-hero.png)
- [Pipa](pipa-hero.png)

Texto pequeno incidental gerado dentro das imagens não define a copy do site
final. Após a validação, o conteúdo final será escrito e revisado em HTML, com
arte separada produzida nativamente. Uma imagem inteira não será usada como página.

## Limites desta entrega

Validação pedida: nomes, direção visual, composição de abertura e linguagem de
arte dos quatro templates. A implementação, responsividade dos sites finais,
animações e prova funcional das interações vêm depois da resposta do usuário.
As referências não foram copiadas como fontes/assets. Não houve incorporação ao
catálogo do Desktop, alteração nos jogos, push ou publicação.

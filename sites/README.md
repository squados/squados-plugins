# Templates de websites

Quatro one-pages independentes para inspirar a criação de um projeto no SquadOS
Studio. Cada pacote contém fontes React/Vite, lockfile, arte/fontes locais,
preview renderizado, README, licenças e instruções de adaptação.

| Pacote | Marca | Direção | Referência visual aprovada |
| --- | --- | --- | --- |
| [website-digital-marketing](website-digital-marketing/README.md) | Trama | Infoproduto dark, currículo e cards | [Flux Academy](https://www.flux-academy.com/courses/web-design-masterclass) |
| [website-corporate](website-corporate/README.md) | Nortea | Consultoria editorial sóbria | [BCG](https://www.bcg.com/) |
| [website-futuristic](website-futuristic/README.md) | Orbe | Produto escuro, luz e diagramas 2D | [Reflect](https://reflect.app/) |
| [website-playful](website-playful/README.md) | Pipa | Escola criativa ilustrada | [Headspace](https://www.headspace.com/) |

As referências orientam o estilo; não fornecem código, marcas, textos ou assets
a estes pacotes. Trama não tem cabeçalho: retrato limpo, título e botões com faixa
de avaliações demonstrativas abaixo. A revisão da Trama mantém toda a página
escura, com títulos sem serifa, cards, currículo expansível, projetos e oferta em
planos. Nortea usa movimento discreto; Orbe usa
CSS/SVG em vez de modelos 3D; Pipa tem personagens originais em arte plana.

## Executar e explorar

Node.js 20.19+ ou 22.12+ e npm compatível com o lockfile. Cada pacote é autônomo:

```powershell
cd website-digital-marketing
npm ci
npm run build
npm run preview -- --host 127.0.0.1
```

O build estático fica em `dist/`, com base relativa. Não há configuração de
segredo, conta, backend ou serviço pago. Os arquivos de arte e fontes ficam em
`public/`; não há dependência de uma CDN durante a navegação. Abrir o `index.html`
fonte com `file://` não executa um aplicativo Vite: use a prévia HTTP.

Para construir os quatro e abrir a galeria interativa a partir desta pasta:

```powershell
npm run build
npm run preview
```

O script de build instala cada pacote com seu lockfile, executa seu build e
reúne os resultados em `.preview/`, ignorado pelo Git. A prévia informa uma URL
HTTP em `127.0.0.1` com porta livre. Pode receber `-- --port 4400` no npm.
`Ctrl+C` encerra. Nenhum comando publica ou acessa uma conta de hospedagem.
A [galeria](index.html) e os PNGs também podem ser inspecionados como arquivos locais.

## Adaptar um template

Copie o pacote inteiro para outra pasta, preservando LICENSE, NOTICE.md e
licenças em `public/fonts/`. Exclua `node_modules/` e `dist/` da cópia; instale
pelo lockfile. Troque a marca, copy, dados e arte na cópia, conforme o README do
pacote. As ações demonstrativas já têm estados e feedback; ao integrar um serviço
real, substitua o comportamento local e revise validação, erro e sucesso.

Os templates estão em [templates.json](../templates.json), no contrato `CreationTemplate`
do Desktop: nomes/descrições PT-BR e inglês, origem/licenças, entry real,
preview.png e instrução de adaptação. A interface de cada exemplo está em PT-BR.
O manifesto é a fonte publicada consumida pelo Desktop, incluindo objetivos e
inventários com SHA-256. O índice de skills `gallery.json` permanece separado.
Testes locais não significam push.

## Arte, exemplos e licenças

As sete artes foram geradas com **ImageGen nativo**, separadas do HTML. A Orbe
usa arte própria em CSS/SVG. [art-prompts.json](art-prompts.json) preserva os
prompts; cada pacote inclui sua cópia e um `assets.json` com origem, dimensões,
SHA-256 e fontes. `preview.png` é uma captura da implementação real, nunca a
imagem do conceito usada como substituta da página.

Código/base: Apache-2.0 em cada pacote. Fontes: SIL OFL-1.1, com copyright e
licença integral locais. A licença MIT da raiz do repositório não substitui
essas licenças. Marcas, instrutora, personagens, avaliações e situações são
fictícios. Não há depoimentos nem resultados empresariais reais alegados.

## Limites e evidências

Formulários validam e confirmam localmente; não enviam nem persistem dados.
Planos são ilustrativos, sem assinatura ou compra. A mini-aula e o workspace
são interações locais, sem vídeo/IA ou integrações externas. A Pipa oferece
experiências demonstrativas, sem conta ou salvamento na nuvem.

Consulte `QA.json` para a verificação entregue e `base-provenance.json` para
os hashes da base técnica antes/depois. Os conceitos aprovados e seu histórico
visual estão em [concepts/2026-10-16-four-landings](concepts/2026-10-16-four-landings/README.md).

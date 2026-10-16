# Nortea — consultoria brasileira

One-page editorial responsiva em React 19 + Vite 7. A marca Nortea, a equipe descrita
e os casos são fictícios, criados para demonstrar o template. Não há clientes,
depoimentos ou resultados históricos alegados.

## Executar

Requer Node.js compatível com Vite 7 (20.19+ ou 22.12+) e npm.

```powershell
npm ci
npm run build
npm run preview -- --host 127.0.0.1
```

O preview serve o build de `dist/`. Para personalizar com atualização em tempo real,
use `npm run dev`. O build usa base relativa e pode ser hospedado na raiz ou em
subpasta. Não é necessário configurar variáveis de ambiente.

## Conteúdo e ações

- Navegação por âncoras, link de pular conteúdo e menu compacto em telas menores;
  `Escape` fecha o menu e devolve o foco ao botão.
- Serviços selecionáveis: Estratégia, Operação e Pessoas mudam texto, entregáveis
  e diagrama. Teclado: setas, Home e End dentro do seletor.
- Casos demonstrativos filtráveis por setor, com detalhes expansíveis nativos.
- Perguntas frequentes expansíveis por mouse, toque ou teclado.
- Contato local: nome, email válido e desafio obrigatórios; empresa opcional.
  O navegador valida a sintaxe do email. A confirmação
  recebe foco também ao enviar por Enter. Nenhum dado é enviado ou salvo em storage.
  Retornar ao formulário limpa os campos e leva o foco ao nome.

O formulário **não envia mensagens reais**. Integre o serviço de sua escolha para
isso e revise consentimento, privacidade, validação no servidor e mensagens de
confirmação antes de publicar. Não há backend, login, analytics ou chamadas de rede
no runtime além dos arquivos locais do próprio site.

## Personalizar

Em `src/App.jsx`, edite `services`, `steps` e `cases`, além dos textos e âncoras.
Os diagramas e o compasso são SVGs inline próprios. As cores, fontes, espaçamentos
e adaptações responsivas estão em `src/style.css`. A página inclui estados de
foco visíveis, labels, landmarks e respeito a `prefers-reduced-motion`.

O título, a descrição, a cor do navegador e o favicon SVG estão em `index.html`.
Atualize-os para sua marca. Troque as situações fictícias por evidências reais
somente quando houver autorização e documentação correspondente.

## Arte, fontes e licença

`public/art/editorial.png` é uma arte original gerada para este pacote; o hero usa
a faixa completa proporcionalmente, e seções posteriores reutilizam recortes CSS.
Consulte `assets.json`, `art-prompts.json` e `NOTICE.md` para proveniência e limites.
Os caminhos de arte usam `import.meta.env.BASE_URL`, e Vite resolve as fontes locais.

`public/fonts/display.woff2` contém Newsreader variável e `body.woff2`, DM Sans
variável. Os arquivos de licença OFL estão na mesma pasta. As duas usam
`font-display: swap`; o site não depende de Google Fonts nem de CDNs.

O código do pacote preserva a licença Apache-2.0 em `LICENSE`. As fontes mantêm
suas licenças próprias. A referência de direção visual não implica afiliação com
nenhuma consultoria real.

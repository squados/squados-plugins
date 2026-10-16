# Pipa — escola criativa

One-page em português com ilustrações próprias, três mini-experiências de criação,
manifesto, inscrição demonstrativa e FAQ. Pipa é uma escola fictícia; todo conteúdo
é exemplo para adaptação. A referência visual aprovada é Headspace, sem relação
com a marca nem reaproveitamento de seus personagens ou código.

## Executar

Node.js 20.19+ ou 22.12+ e npm. Na pasta deste pacote:

```powershell
npm ci
npm run build
npm run preview -- --host 127.0.0.1
```

Abra a URL local informada. `npm run dev` também está disponível para edição.
O build estático fica em `dist/`, com base relativa para publicar em subpastas.
Abrir o HTML fonte por `file://` não executa o aplicativo Vite. Não há serviço,
conta, chave, CDN ou conexão externa durante o uso.

## Ações disponíveis

- O seletor Desenhar/Escrever/Inventar troca a cena, a frase e a atividade aberta.
  Setas, Home e End também selecionam as abas.
- Desenhar oferece canvas por mouse/toque, cinco cores, botão de adicionar uma
  flor pelo teclado e limpar. Um estado textual descreve traços e flores.
- Escrever valida uma história não vazia, apresenta uma composição com seu texto,
  permite editar e recomeçar. Limite de 1.200 caracteres.
- Inventar compõe até 16 recortes de quatro formas e quatro cores. É possível
  girar o último, organizar, mudar a ordem e limpar a composição.
- Cada atividade abre em dialog nativo com foco, Escape, clique fora, botão de
  fechar e restauração do foco. Ao reabrir, a atividade começa vazia.
- Inscrição valida nome/e-mail e apresenta uma confirmação explicitamente
  demonstrativa. O retorno ao formulário limpa os campos. Nenhum dado é enviado
  ou salvo; textos, desenhos, recortes e dados pessoais ficam só na memória da
  página. Não existe inscrição real, conta, exportação ou compartilhamento.
- FAQ usa elementos details/summary; menu mobile fecha por Escape, seleção ou
  clique fora. Navegação interna, skip link e reduced-motion estão presentes.

## Personalizar

Edite a marca, `activities`, textos, perguntas e formulário em `src/App.jsx`.
As cores, espaçamentos, layout e tipografia estão em `src/style.css`. Título,
descrição e favicon próprio estão em `index.html`. Troque as três cenas em
`public/art/` preservando a proporção e atualize os textos alternativos. URLs de
arte usam `import.meta.env.BASE_URL`; as fontes são resolvidas pelo build.

Ao conectar uma inscrição real, implemente envio/erro/sucesso, política de
privacidade e tratamento apropriado dos dados. O exemplo atual não faz `fetch`,
não usa cookies, localStorage ou sessionStorage.

## Arte, fontes e licenças

- Código e base: Apache-2.0, consulte `LICENSE` e `NOTICE.md`.
- `public/art/draw.png`, `write.png`, `invent.png`: artes originais geradas com
  ImageGen nativo. Origem, prompts e hashes em `assets.json` e `art-prompts.json`.
- Display: Bricolage Grotesque variável, `public/fonts/display.woff2`.
- Corpo: DM Sans variável, `public/fonts/body.woff2`.
- Fontes sob SIL OFL-1.1; licenças completas em `public/fonts/*-OFL.txt`.
- Pipa, diagramas e pequenos ícones SVG próprios, em código.

Copie o pacote inteiro e preserve licenças e avisos. `preview.png` é uma captura
do template; não é usada como substituta de HTML na página.

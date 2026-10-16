# Orbe — ideias em movimento

One-page de um workspace de conhecimento, com identidade navy, ciano e lilás,
halo SVG e demonstração HTML interativa. React 19.2.8 e Vite 7.3.6; sem dependências
adicionais, modelos 3D, imagens de interface, serviços ou recursos remotos.

## Executar

Na pasta deste pacote, com Node.js compatível com Vite 7:

```powershell
npm ci
npm run build
npm run preview -- --host 127.0.0.1
```

O comando preview serve o build de `dist/`. `vite.config.js` usa `base: "./"`,
permitindo hospedagem estática na raiz ou em uma subpasta. A fonte local usa
`import.meta.env.BASE_URL`. O site não faz requisições externas em execução.

## Ações disponíveis

- Navegação por seções e menu compacto no celular; o CTA principal leva à demo
  e foca o seletor Ideias para começar pelo teclado.
- Ideias, Projetos e Conexões mudam os exemplos, as listas, o mapa e seus detalhes.
  Os links nas capacidades também selecionam a área correspondente.
- Busca local de ideias, estado sem resultado e botão para limpar.
- Adição de ideias com validação de texto vazio, limite de 160 caracteres e
  confirmação visível. As notas existem só na memória; recarregar reinicia a demo.
- Três nós selecionáveis por mouse, toque, Enter ou espaço, com detalhe acessível.
- Planos ilustrativos Livre, Essencial e Juntos; o seletor mensal/anual altera
  valores e explicações. Os valores anuais são equivalentes mensais, com total
  anual informado, e não representam uma oferta comercial.
- Experimentar abre um `<dialog>` nativo com email requerido, validação local e
  confirmação de simulação. Enter envia; Escape, fechar ou clicar fora encerram.
  O foco fica no dialog, vai à confirmação após o envio e retorna ao botão de origem.
- FAQ com `<details>` nativo.

Nenhuma conta, assinatura, cobrança, email, IA ou integração real é executada.
O formulário não envia nem persiste dados pessoais. Marca, conteúdo e planos são
demonstrativos. Para lançar um produto real, integre seus serviços e substitua os
avisos de demonstração por informações verdadeiras e verificadas.

## Personalizar

- `src/App.jsx`: textos, exemplos em `modes`/`initialNotes`, capacidades, planos,
  FAQ e interações locais. `Brand`, `Icon`, `Halo` e `ConnectionMap` são SVG/HTML próprios.
- `src/style.css`: tokens em `:root`, tipografia, composição e breakpoints para
  desktop, tablet e mobile. Respeita `prefers-reduced-motion` e `focus-visible`.
- `index.html`: idioma, título, descrição, cor do navegador e favicon SVG inline.
- `public/fonts/body.woff2`: DM Sans variável local, de 100 a 1000, com
  `font-display: swap`; fallback do sistema. Preserve `public/fonts/DM-Sans-OFL.txt`.

O halo, os ícones, o logotipo e o mapa são vetoriais, feitos no código. Não há arte
raster ou screenshot de UI. A imagem do conceito aprovado não é asset de runtime.

## Licenças

Código e base técnica SquadOS sob Apache-2.0, preservada em `LICENSE`; veja
`NOTICE.md` para origem. DM Sans sob SIL Open Font License 1.1, com copyright e
licença integrais em `public/fonts/DM-Sans-OFL.txt`. Este pacote deve ser copiado
completo, incluindo seus avisos e fontes locais.

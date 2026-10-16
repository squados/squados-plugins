# Trama — formação em negócios digitais

Landing page one-page em PT-BR para uma formação fictícia. Parte da base React/Vite do SquadOS Studio e preserva sua licença Apache-2.0. A composição usa retrato central, Newsreader, DM Sans e superfícies ameixa, creme, lilás e coral. Sem serviços externos no runtime.

## Executar

Requer Node.js compatível com Vite 7 e npm. Na pasta deste pacote:

```sh
npm ci
npm run build
npm run preview -- --host 127.0.0.1
```

O build fica em `dist/`. `npm run dev` serve para edição; a verificação da entrega usa o build de produção e o preview. O `base: "./"` da configuração Vite permite hospedar a pasta em uma subpasta. Os assets usam `import.meta.env.BASE_URL`.

## Interações locais

- **Conhecer a formação** vai ao programa na mesma página. Os links do rodapé retornam ao início.
- Os quatro módulos trocam a prévia, os tópicos, a entrega e a duração. O seletor usa tabs acessíveis: setas, Home e End também mudam o módulo.
- **Ver uma aula** e **Experimente a mini-aula** abrem um `<dialog>` nativo com uma atividade em três etapas. Você escreve um problema, escolhe o formato da primeira entrega e vê uma proposta de próximo passo. É uma atividade textual interativa. Não há vídeo.
- O diálogo fecha pelo botão, Escape ou clique no fundo. O foco permanece no diálogo aberto e volta ao botão que o abriu. O listener é removido ao fechar ou desmontar o componente.
- **Quero fazer parte** abre uma inscrição demonstrativa. Nome e e-mail são obrigatórios e validados pelo navegador; o nome exige ao menos dois caracteres. O envio apenas troca o conteúdo pela confirmação local. **Explorar novamente** fecha e reinicia o formulário.
- O FAQ usa `<details>` e `<summary>` nativos, inclusive pelo teclado.
- Há skip link, estados `focus-visible`, landmarks, feedback `aria-live` e suporte a `prefers-reduced-motion`. A animação de abertura do hero e as transições de conteúdo param quando a pessoa reduz movimento.

O formulário e a atividade não fazem `fetch`, não usam armazenamento local, não enviam dados e não processam pagamentos. Campos existem somente na memória da página. Recarregar ou reabrir a atividade reinicia o conteúdo.

## Personalizar

Em `src/App.jsx`, altere a marca e os textos, o array `modules`, as perguntas de `questions`, a instrutora e a oferta. Para mudar o número de etapas da mini-aula, ajuste conteúdo e navegação juntos. Mantenha rótulos de campos, IDs de tabs, feedback e relações ARIA coerentes.

Em `src/style.css`, as variáveis de `:root` concentram a paleta. Os estilos do hero, programa, instrutora, oferta e FAQ são independentes. Os breakpoints adaptam a página a partir de 360px. O símbolo Trama é SVG escrito no componente `Mark`, sem biblioteca de ícones.

Substitua os assets abaixo por arquivos de mesmo nome ou atualize os caminhos em `App.jsx`. Preserve proporção, recorte e textos alternativos adequados ao material novo.

| Arquivo | Uso |
| --- | --- |
| `public/art/instructor.png` | Retrato fictício central no hero e na seção da instrutora |
| `public/art/avatars.png` | Faixa de cinco rostos fictícios na prova social |
| `public/art/course.png` | Composição de materiais didáticos da formação |
| `public/fonts/display.woff2` | Newsreader variável, títulos e marca |
| `public/fonts/body.woff2` | DM Sans variável, corpo e controles |

As fontes usam `font-display: swap` e fallback Georgia/Arial. Imagens e fontes são locais. Consulte os avisos de assets/fontes fornecidos com o pacote; a licença Apache da base não substitui licenças de terceiros.

## Limites da demonstração

Trama, Nora Vasconcelos, os retratos, as avaliações, o conteúdo dos módulos, as durações e o valor da oferta são demonstrativos. Não representam uma formação disponível, alunos, depoimentos ou resultados reais. As imagens foram geradas por IA. Não há matrícula, autenticação, backend ou envio de e-mail.

Antes de usar para uma formação real, substitua o conteúdo fictício, faça revisão de oferta e direitos de imagem e conecte o formulário ao serviço escolhido, com os avisos e a política de privacidade correspondentes. A integração com o serviço deve ser testada separadamente da experiência local deste template.

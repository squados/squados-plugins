# Trama — formação em negócios digitais

Landing page one-page em PT-BR para uma formação fictícia. Parte da base React/Vite do SquadOS Studio e preserva sua licença Apache-2.0. A composição é toda dark: preto e índigo, títulos grandes em DM Sans, cards, currículo expansível e acentos pêssego/lilás. O hero mantém o retrato focal na instrutora, prova social após os CTAs e ausência de cabeçalho. Sem serviços externos no runtime.

A [Web Design Masterclass da Flux Academy](https://www.flux-academy.com/courses/web-design-masterclass) foi revisitada em 16/10/2026 como referência de estrutura: abertura escura, grids de recursos, currículo com prévia lateral, projetos, mentoria, avaliações, oferta em cards e FAQ. Marca, textos, código e arte são próprios; nenhum asset ou código da Flux foi copiado. Os conceitos em `sites/concepts/` preservam a fase visual anterior, não a revisão dark atual.

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
- Os quatro módulos usam `<details name="curriculum">` nativos. Clique ou Enter/Space abre aulas, duração e entrega; abrir um fecha o anterior. São 12 aulas ilustrativas, em quatro grupos de três.
- **Experimentar uma aula**, o poster lateral e a aula aberta do primeiro módulo abrem um `<dialog>` nativo com uma atividade em três etapas. Você escreve um problema, escolhe o formato da primeira entrega e vê uma proposta de próximo passo. É uma atividade textual interativa. Não há vídeo. Referências longas quebram linha sem perder o texto.
- **Explorar Clareia/Prumo/Casa Viva** abre a situação, decisões e resultado de cada projeto fictício. Os desenhos dos projetos são HTML/CSS próprios; não são outros aplicativos nem screenshots rasterizadas da interface.
- **À vista/Parcelado** alterna os três valores mock. O parcelado mostra 12 parcelas e seu total; não oferece pagamento real. **Escolher Essencial/Acompanhada/Mentoria** leva o plano selecionado à inscrição demonstrativa.
- O diálogo fecha pelo botão, Escape ou clique no fundo. O foco permanece no diálogo aberto e volta ao botão que o abriu. O listener é removido ao fechar ou desmontar o componente.
- Nome e e-mail são obrigatórios e validados pelo navegador; o nome exige ao menos dois caracteres. O envio apenas troca o conteúdo pela confirmação local e foca **Explorar novamente**, inclusive ao enviar por Enter. Essa ação fecha e reinicia o formulário.
- O FAQ usa `<details>` e `<summary>` nativos, inclusive pelo teclado.
- Há skip link, estados `focus-visible`, landmarks, feedback `aria-live` e suporte a `prefers-reduced-motion`. A animação de abertura do hero e as transições de conteúdo param quando a pessoa reduz movimento.

O formulário e a atividade não fazem `fetch`, não usam armazenamento local, não enviam dados e não processam pagamentos. Campos existem somente na memória da página. Recarregar ou reabrir a atividade reinicia o conteúdo.

## Personalizar

Em `src/App.jsx`, altere a marca e os textos, `modules`/`lessonMinutes`, `features`, `projects`, `plans`, perguntas de `questions` e instrutora. Preços são inteiros em centavos; `installment` é o valor de cada uma das 12 parcelas. Para mudar o número de aulas ou etapas, ajuste os dados e a navegação juntos. Mantenha rótulos, feedback, IDs de seções e relações ARIA coerentes.

Em `src/style.css`, as variáveis de `:root` concentram a paleta. Os estilos do hero, recursos, programa, projetos, mentoria, instrutora, avaliações, oferta e FAQ são independentes. Os breakpoints adaptam a página a partir de 360px. Os símbolos são SVG inline; `ProjectArt` usa HTML/CSS para composições próprias, sem biblioteca de ícones ou 3D.

Substitua os assets abaixo por arquivos de mesmo nome ou atualize os caminhos em `App.jsx`. Preserve proporção, recorte e textos alternativos adequados ao material novo.

| Arquivo | Uso |
| --- | --- |
| `public/art/instructor.png` | Bia sorridente e confiante no hero, mini-aula e apresentação |
| `public/art/avatars.png` | Faixa de cinco rostos fictícios na prova social |
| `public/art/course.png` | Composição de materiais didáticos da formação |
| `public/fonts/display.woff2` | Newsreader variável, assinatura e detalhe de um projeto |
| `public/fonts/body.woff2` | DM Sans variável, títulos, corpo e controles |

As fontes usam `font-display: swap` e fallback Arial/Georgia apropriado ao uso. Imagens e fontes são locais. O retrato da Bia foi criado no ImageGen nativo com sua referência canônica da ibe.IA. Avatares e materiais didáticos foram preservados; a composição usa HTML/CSS real. Prompts e referência por SHA estão em art-prompts.json. O caderno e o painel da formação ocupam áreas distintas de uma grade responsiva, sem encobrir títulos ou módulos. Consulte os avisos de assets/fontes fornecidos com o pacote; a licença Apache da base não substitui licenças de terceiros.

## Limites da demonstração

Bia é a embaixadora de IA da ibe.IA, apresentada aqui com retrato gerado por IA e sem biografia ou depoimento real. Trama, avatares de alunos, avaliações, projetos, mentoria/comunidade, módulos, durações, planos e valores são demonstrativos. Não representam uma formação disponível, alunos, depoimentos ou resultados reais. As imagens foram geradas por IA. Não há matrícula, autenticação, backend, chat, compra, cobrança ou envio de e-mail.

Antes de usar para uma formação real, substitua o conteúdo fictício, faça revisão de oferta e direitos de imagem e conecte o formulário ao serviço escolhido, com os avisos e a política de privacidade correspondentes. A integração com o serviço deve ser testada separadamente da experiência local deste template.

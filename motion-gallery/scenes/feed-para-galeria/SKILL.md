---
name: feed-para-galeria
description: Leve um post do feed para uma galeria e revele três efeitos a partir do ponto onde ele foi solto.
license: MIT
---

# Do Feed à Galeria

Use a cena para mostrar uma referência que sai de um feed em movimento e
entra em uma biblioteca de efeitos. O cursor pega o terceiro post, arrasta
o mesmo quadro e solta no destino. Três cartões entram com mola após o
contato. A interface é uma simulação.

## Renderização

Execute na raiz de `squados-plugins`:

```powershell
node scripts/render-motion.mjs "feed-para-galeria" --inputs dados.json --out cena.mp4
```

As entradas são opcionais. `reelTitles` aceita quatro textos e `effectTitles`
aceita três. `reelSheets` e `effectSheets` recebem os atlas correspondentes,
com 24 fotogramas 16:9 em 4 colunas e 6 linhas, na ordem da leitura, a 8 fps.
`gallery` recebe uma imagem de destino. Sem essa entrada, a galeria fictícia
da composição aparece. Caminhos são relativos ao JSON.

O clique está em 2,32 s. O arraste ocorre entre 2,44 s e 4,10 s. Os três efeitos
começam a entrar em 4,33 s, 4,46 s e 4,59 s. A cena tem 6,8 s. Rode o comando sem --inputs para conferir a amostra.

Preserve os créditos dos atlas substituídos. Em edição falada, combine
a cena com a câmera sincronizada conforme o briefing.

Use `mobile: true` para a versão em telefone, com barra de status, navegação inferior e gesto de toque.

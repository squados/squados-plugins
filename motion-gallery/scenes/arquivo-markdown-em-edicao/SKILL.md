---
name: arquivo-markdown-em-edicao
description: Digita linhas de Markdown em um editor com numeração, cursor e destaque para títulos e checklists.
license: MIT
---

# Arquivo Markdown em Edição

Use a janela para mostrar uma instrução sendo escrita enquanto a pessoa
explica a mudança. Separe as linhas pelas deixas da fala. Mantenha a janela
na área livre do quadro.

- `filename` recebe o nome ou caminho exibido no editor.
- `lines` aceita de uma a seis linhas Markdown. Use `#` para títulos e
  `- [x]` ou `- [ ]` para itens marcados ou pendentes.
- `cues` aceita um tempo por linha, em segundos. Use valores crescentes de
  0,35 a 6,55, com pelo menos 0,25 s entre eles. Por padrão, as linhas
  começam em 0,58 s e entram em intervalos de 0,96 s.
- `side` aceita `left`, `center` ou `right`. O padrão é `right`.
- `transparent: true` deixa o fundo livre para composição sobre a câmera.

O take dura oito segundos. Exporte em MOV quando precisar de transparência.

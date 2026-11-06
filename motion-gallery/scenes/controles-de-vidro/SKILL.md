---
name: controles-de-vidro
description: Revela controles de vidro com margens, hierarquia e mola curta sobre o vídeo.
license: MIT
---

# Controles de Vidro

Escolha `mode: "download"` para duas plataformas, `"value"` para destacar um
valor com duas marcas ou `"cta"` para uma chamada com seta. Use `label`,
`value`, `left`, `right`, `leftLogo` e `rightLogo` conforme o modo.
`side` aceita `left`, `center` ou `right`. Exporte com
`transparent: true` em MOV para compor por cima do take.

Use `mode: "play"` para um botão de reprodução com ícone vetorial, sem texto.
O ponteiro chega ao centro, pressiona o botão com um anel de contato, arrasta
o controle e o solta com um salto curto no destino. `side` define de onde o
botão sai, com `left` como padrão neste modo. A composição dura 9 s.

| Entrada | Padrão | Deixa no relógio da composição |
| --- | --- | --- |
| `clickAt` | `2.91` | Clique. O botão atinge a compressão máxima e o anel aparece. |
| `dragAt` | `4.32` | Início do arrasto. Ponteiro e botão viajam juntos. |
| `enterAt` | `5.46` | Encaixe no destino. O botão sobe e assenta. |

Passe números em segundos. A cena ajusta as três deixas para manter a ordem,
o espaço de aproximação do ponteiro e a saída dentro dos 9 s. O clique fica
entre 0,75 e 6,25 s, o arrasto começa pelo menos 0,42 s depois e até 6,95 s, e
o encaixe acontece pelo menos 0,60 s depois do arrasto e até 7,65 s.

Use a [amostra](demo-play.json) como ponto de partida para uma sobreposição.
A cena é silenciosa. Na montagem, alinhe o pico do clique a `clickAt`, o
ataque do swipe a `dragAt` e o pop ao encaixe em `enterAt`.

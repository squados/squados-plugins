---
name: fabrica-de-edicao-3d
description: Contrasta a fila manual com o fluxo em equipe num galpão 3D com editor e mascotes do SquadOS.
---

# Fábrica de Edição 3D

As esteiras do galpão ligam os postos de montagem e revisão às duas linhas de
exportação. O editor trabalha sentado na bancada. Os mascotes Cerâmica operam
suas estações enquanto os vídeos passam pelos scanners.

| Entrada mode | Quadros a 30 fps | Ação |
| --- | ---: | --- |
| queue | 466 | A fila trava na linha manual. A câmera atravessa o galpão e acompanha os vídeos passando pela linha com IA. |
| knowledge | 325 | O editor abre sua biblioteca de referências e revisa o novo projeto no posto. |
| mural | 292 | A nona referência aparece na biblioteca da equipe e nas fichas exportadas. |
| epilogue | 363 | O editor e os mascotes trabalham lado a lado e a fila continua. |

Envie um atlas opcional na entrada atlas, com nove miniaturas 16:9 em três
colunas e três linhas, sem margens. A nona miniatura é a que entra no mural.
Cada miniatura do mural e tela de monitor tem geometria 16:9. O padrão é
1920 × 1080 a 30 fps. Componha a câmera sincronizada no canto em que o rosto
e a ação da fábrica permaneçam visíveis.

O palco, os monitores e a câmera são editáveis em [factory.mjs](factory.mjs).
Os personagens e poses ficam em [factory-actors.mjs](factory-actors.mjs).
Para a captura direta, aguarde window.motionReady e envie o tempo em segundos
a window.renderMotion. As fontes de arte e os avisos estão nos [créditos](CREDITOS.md).

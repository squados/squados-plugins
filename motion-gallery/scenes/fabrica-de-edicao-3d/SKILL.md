---
name: fabrica-de-edicao-3d
description: Encena filas, passagem de referências e troca de equipe com esteiras, editores e robôs em 3D.
---

# Fábrica de Edição 3D

Use uma das quatro cenas para mostrar o que muda no processo de edição. A
câmera acompanha as fichas de vídeo e preserva a continuidade dos dois galpões.

| Entrada mode | Quadros a 30 fps | Ação |
| --- | ---: | --- |
| queue | 466 | Os vídeos travam na esteira manual. Na troca de galpão, os robôs escaneiam e entregam os vídeos em fluxo. |
| knowledge | 325 | O editor treinado retira as referências do mural e sai com o arquivo. |
| mural | 292 | A equipe recebe a nona referência. A miniatura reaparece nos vídeos processados. |
| farewell | 367 | O editor deixa a linha manual. Na outra fábrica, o editor opera a linha com os robôs. |

Envie um atlas de imagens em atlas para trocar o conteúdo do mural. Use nove
miniaturas 16:9 em três colunas e três linhas, sem margens. A nona miniatura
é a que entra no plano mural. Os quadros gerados pela cena são 1920 × 1080
a 30 fps, em 16:9. Para incluir a fala e o rosto, componha o take
sincronizado na montagem. O canto inferior esquerdo fica disponível para
a moldura de aula.

As câmeras, ações e materiais são editáveis em [factory.mjs](factory.mjs).
O HTML registra a timeline no carregamento. Aguarde window.motionReady
antes de buscar quadros diretamente com window.renderMotion(segundos).
Veja as [fontes e licenças](CREDITOS.md).

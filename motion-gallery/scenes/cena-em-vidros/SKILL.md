---
name: cena-em-vidros
description: Mostra o quadro inteiro do apresentador atrás de duas mídias independentes em vidro com profundidade e paralaxe.
license: MIT
---

# Cena em Vidros

Passe o take retangular completo em `presenter`. Preserve o fundo real e o
enquadramento da câmera. Passe mídia independente em `middle` e `front`.
Use o plano intermediário para objetos verticais e o dianteiro para uma
composição mais larga. Esses dois arquivos podem ter fundo transparente.

`labels` aceita até três rótulos opcionais na ordem câmera, meio e frente.
Use `layout: "aninhado"` para reduzir a distância entre os planos.
`timing: "rapido"` concentra a ação nos primeiros três segundos.
Confira a leitura do rosto e das mídias enquanto a câmera virtual muda de
ângulo. O gesto funciona com imagens ou vídeos de cada elemento.

## Renderização

Com os caminhos relativos ao JSON de entradas, execute na raiz da galeria:

```powershell
node scripts/render-motion.mjs "cena-em-vidros" --inputs dados.json --out cena.mp4
```

A [composição](index.html) dura oito segundos. A amostra sem entradas usa
conteúdo genérico para demonstrar a ordem e a distância entre os planos.

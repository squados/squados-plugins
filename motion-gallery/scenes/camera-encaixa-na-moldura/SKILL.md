---
name: camera-encaixa-na-moldura
description: Reduza, recorte e deslize a câmera atual para a moldura da direita.
license: MIT
---

# Câmera Encaixa na Moldura

Use o take com o rosto central em `presenter`. `layout` aceita `vidro` para a área escura ou `papel` para uma área de demonstração clara. Ajuste `label`, `title` e `detail` para descrever uma ação.

## Renderização

Abra a raiz do checkout `squados-plugins`, crie um JSON com as entradas da cena e execute:

```powershell
node scripts/render-motion.mjs "camera-encaixa-na-moldura" --inputs dados.json --out cena.mp4
```

O JSON aceita `presenter`, `label`, `title`, `detail`, `layout`. Caminhos de mídia são relativos ao JSON. A [composição](index.html) dura 6 s. Para ver a amostra da galeria, execute o mesmo comando sem `--inputs`.

Revise o rosto na abertura, em quadros contíguos do encaixe e na volta. O recorte deve acontecer no próprio take durante toda a trajetória.

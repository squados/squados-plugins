---
name: casa-em-vista-explodida
description: Mostre a maquete montada, tire o telhado, abra paredes e andares, deixe as partes flutuarem e encaixe tudo de novo.
license: MIT
---

# Casa em Vista Explodida

Use `labels` para quatro etapas na ordem cobertura, paredes, pavimentos e retorno. Passe `layout` igual a `fixo` para manter a vista isométrica ou `orbita` para girar durante a abertura. Em `presenter`, use o take cujo rosto fica no centro do recorte à esquerda.

## Renderização

Abra a raiz do checkout `squados-plugins`, crie um JSON com as entradas da cena e execute:

```powershell
node scripts/render-motion.mjs "casa-em-vista-explodida" --inputs dados.json --out cena.mp4
```

O JSON aceita `presenter`, `title`, `labels`, `layout`. Caminhos de mídia são relativos ao JSON. A [composição](index.html) dura 9 s. Para ver a amostra da galeria, execute o mesmo comando sem `--inputs`.

Compare a estrutura fechada no início e no fim. Inspecione a altura da cobertura e as juntas de paredes e andares antes de fechar a cena.

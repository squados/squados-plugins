---
name: cena-em-vidros
description: Separe o fundo, os ícones e o apresentador em três planos de vidro, gire o conjunto e reúna as camadas.
license: MIT
---

# Cena em Vidros

Passe o take com alpha em `matte` por 8 s. Use `labels` na ordem fundo, ícones e apresentador. `layout` aceita `aberto` para distâncias laterais maiores ou `aninhado` para planos mais próximos em profundidade. A composição desenha o fundo e os ícones da demonstração em camadas separadas.

## Renderização

Abra a raiz do checkout `squados-plugins`, crie um JSON com as entradas da cena e execute:

```powershell
node scripts/render-motion.mjs "cena-em-vidros" --inputs dados.json --out cena.mp4
```

O JSON aceita `matte`, `title`, `labels`, `layout`. Caminhos de mídia são relativos ao JSON. A [composição](index.html) dura 8 s. Sem `--inputs`, a composição usa a amostra genérica. O preview do cartão usa um take em movimento.

Verifique a ordem física antes, durante e depois da volta. Mantenha a face legível no giro e faça os planos voltar ao mesmo enquadramento do início.

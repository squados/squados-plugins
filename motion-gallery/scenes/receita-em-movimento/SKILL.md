---
name: receita-em-movimento
description: Revele os ingredientes, derrube-os no copo, suba a mistura, despeje na forma e passe do forno ao resultado com vapor.
license: MIT
---

# Receita em Movimento

Informe até cinco ingredientes em `ingredients`. `steps` recebe os quatro rótulos na ordem da sequência. Use `layout` igual a `papel` para painel claro ou `vidro` para fundo escuro. Passe o mesmo take de fala em `presenter` por 10 s.

## Renderização

Abra a raiz do checkout `squados-plugins`, crie um JSON com as entradas da cena e execute:

```powershell
node scripts/render-motion.mjs "receita-em-movimento" --inputs dados.json --out cena.mp4
```

O JSON aceita `presenter`, `title`, `ingredients`, `steps`, `layout`. Caminhos de mídia são relativos ao JSON. A [composição](index.html) dura 10 s. Para ver a amostra da galeria, execute o mesmo comando sem `--inputs`.

Confira se o nível da mistura só sobe quando o ingrediente entra, se o fio alcança a forma e se o prato pronto fica tempo suficiente em repouso.

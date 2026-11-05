---
name: legenda-palavra-ativa
description: Mantenha o bloco de legenda na mesma posição e destaque uma palavra por vez, seguindo os tempos do take.
license: MIT
---

# Legenda de Palavra Ativa

Passe `cues` como objetos `{start, end, words, times}`. Cada item de `words` tem um início correspondente em `times`, dentro de `[start, end)`, em segundos do take. Em `tarja`, use a caixa escura com menta. Em `quente`, use texto sem caixa e destaque quente. Escreva blocos de até duas linhas.

## Renderização

Abra a raiz do checkout `squados-plugins`, crie um JSON com as entradas da cena e execute:

```powershell
node scripts/render-motion.mjs "legenda-palavra-ativa" --inputs dados.json --out cena.mp4
```

O JSON aceita `presenter`, `layout`, `cues`. Caminhos de mídia são relativos ao JSON. A [composição](index.html) dura 6 s. Para ver a amostra da galeria, execute o mesmo comando sem `--inputs`.

Confira o começo de cada palavra na fala, a posição das linhas nas trocas de bloco e o fim da legenda dentro da área segura.

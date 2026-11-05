---
name: pergunta-e-confronto
description: Revele a pergunta em dois tempos, mostre os dois candidatos no ritmo da fala e feche com o confronto.
license: MIT
---

# Pergunta e Confronto

Use `question` e `emphasis` para dividir a pergunta entre texto neutro e colorido. Informe nomes curtos em `firstName` e `secondName`. Em `cartoes`, a pergunta sai e cada cartão entra de um lado. Em `lateral`, a pergunta fica à esquerda e os nomes se acumulam à direita.

## Renderização

Abra a raiz do checkout `squados-plugins`, crie um JSON com as entradas da cena e execute:

```powershell
node scripts/render-motion.mjs "pergunta-e-confronto" --inputs dados.json --out cena.mp4
```

O JSON aceita `presenter`, `question`, `emphasis`, `firstName`, `secondName`, `layout`. Caminhos de mídia são relativos ao JSON. A [composição](index.html) dura 6 s. Para ver a amostra da galeria, execute o mesmo comando sem `--inputs`.

A pessoa continua legível no meio das duas áreas. Confira se a entrada do segundo candidato coincide com a fala e se o VS só chega depois dos dois nomes.

---
name: duelo-em-dois-takes
description: Empilha dois takes sincronizados em um quadro vertical para comparar edições.
license: MIT
---

# Duelo em Dois Takes

Exporte ambas as versões com o mesmo início e ao menos 5 s de duração. Passe os arquivos em `first` e `second` e nomeie as faixas em `firstName` e `secondName`. Preserve as legendas já queimadas nos takes. `firstResult` e `secondResult` aparecem apenas na demonstração sem mídia.

## Renderização

Abra a raiz do checkout `squados-plugins`, crie um JSON com as entradas da cena e execute:

```powershell
node scripts/render-motion.mjs "duelo-em-dois-takes" --inputs dados.json --out cena.mp4
```

O JSON aceita `title`, `first`, `second`, `firstName`, `secondName`, `firstResult`, `secondResult`. Caminhos de mídia são relativos ao JSON. A [composição](index.html) dura 5 s. Para ver a amostra da galeria, execute o mesmo comando sem `--inputs`.

Compare lado a lado os quadros de entrada e saída. Confira se o mesmo gesto ocupa o mesmo ponto de cada faixa, inclusive quando uma das edições dá zoom.

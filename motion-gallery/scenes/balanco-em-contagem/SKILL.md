---
name: balanco-em-contagem
description: Abra um painel de balanço, escreva as confirmações em cascata e some cada tarefa no contador quando o traço terminar.
license: MIT
---

# Balanço em Contagem

Informe até 13 ações concluídas em `tasks`, um título curto em `title` e a unidade plural em `unit`. Enquadre o rosto para a direita no take em `presenter`. Use os nomes de ações que o vídeo acabou de demonstrar.

## Renderização

Abra a raiz do checkout `squados-plugins`, crie um JSON com as entradas da cena e execute:

```powershell
node scripts/render-motion.mjs "balanco-em-contagem" --inputs dados.json --out cena.mp4
```

O JSON aceita `presenter`, `title`, `tasks`, `unit`. Caminhos de mídia são relativos ao JSON. A [composição](index.html) dura 6 s. Para ver a amostra da galeria, execute o mesmo comando sem `--inputs`.

Confira se a contagem final corresponde às linhas e se nenhum número muda antes da respectiva confirmação.

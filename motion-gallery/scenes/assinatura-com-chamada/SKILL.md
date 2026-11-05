---
name: assinatura-com-chamada
description: Revele a assinatura ao lado da câmera e atrase a entrada da chamada até a deixa da fala.
license: MIT
---

# Assinatura com Chamada

Em `marca`, use `mark` para o logo autorizado, `title` e `emphasis` para a assinatura. Em `editorial`, o texto entra pelo lado esquerdo e a marca fica oculta. Informe em `action` a instrução curta que aparece no segundo tempo.

## Renderização

Abra a raiz do checkout `squados-plugins`, crie um JSON com as entradas da cena e execute:

```powershell
node scripts/render-motion.mjs "assinatura-com-chamada" --inputs dados.json --out cena.mp4
```

O JSON aceita `presenter`, `mark`, `title`, `emphasis`, `action`, `layout`. Caminhos de mídia são relativos ao JSON. A [composição](index.html) dura 6 s. Para ver a amostra da galeria, execute o mesmo comando sem `--inputs`.

Veja a sequência em tamanho de cartão. A assinatura deve assentar antes da chamada, e a chamada precisa caber em uma linha curta.

---
name: do-comentario-ao-direct
description: Abra a interface de comentários, digite a palavra, confirme o envio e revele a entrega pelo direct.
license: MIT
---

# Do Comentário ao Direct

Use `comment` como exemplo de pergunta, `keyword` para a palavra falada e `message` para a confirmação de entrega. A composição ilustra o fluxo e usa uma interface fictícia. Passe o take em `presenter`.

## Renderização

Abra a raiz do checkout `squados-plugins`, crie um JSON com as entradas da cena e execute:

```powershell
node scripts/render-motion.mjs "do-comentario-ao-direct" --inputs dados.json --out cena.mp4
```

O JSON aceita `presenter`, `comment`, `keyword`, `message`. Caminhos de mídia são relativos ao JSON. A [composição](index.html) dura 6 s. Para ver a amostra da galeria, execute o mesmo comando sem `--inputs`.

Leia em ordem o comentário, a palavra e o direct. Confira se a mensagem só entra depois do envio.

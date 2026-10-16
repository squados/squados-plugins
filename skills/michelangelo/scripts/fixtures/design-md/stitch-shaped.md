---
name: Stitch-shaped
description: Cabeçalho escrito por outra ferramenta — chave entre aspas, sem `shadows`
colors:
  ink: "#111111"
typography:
  body:
    fontFamily: "Georgia, serif"
spacing:
  xs: "4px"
  md: "16px"
  "2xl": "48px"
rounded: { md: "8px" }
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    rounded: "{rounded.md}"
---

Cabeçalho no formato Stitch: `components` carrega props de token, não caminho de arquivo.

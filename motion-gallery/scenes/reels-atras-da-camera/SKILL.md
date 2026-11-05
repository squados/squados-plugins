---
name: reels-atras-da-camera
description: Faça três telas verticais percorrerem uma pista em perspectiva atrás do recorte da câmera.
license: MIT
---

# Reels Atrás da Câmera

Passe um take de 8 s com alpha em `matte`. Informe até três clipes verticais com pelo menos 8 s em `first`, `second` e `third`. Sem os clipes, a cena usa três cartões fictícios editáveis em `titles`. Passe `direction` igual a `esquerda` para inverter o giro.

## Renderização

Abra a raiz do checkout `squados-plugins`, crie um JSON com as entradas da cena e execute:

```powershell
node scripts/render-motion.mjs "reels-atras-da-camera" --inputs dados.json --out cena.mp4
```

O JSON aceita `matte`, `first`, `second`, `third`, `titles`, `direction`. Caminhos de mídia são relativos ao JSON. A [composição](index.html) dura 8 s. Para ver a amostra da galeria, execute o mesmo comando sem `--inputs`.

Confira as passagens pelo rosto e pelos ombros. As telas devem continuar o movimento quando cruzam a parte escondida e reaparecer com a mesma fase da órbita.

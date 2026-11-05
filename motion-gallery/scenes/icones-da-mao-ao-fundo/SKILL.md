---
name: icones-da-mao-ao-fundo
description: Aproxime o quadro de cada palma, prenda um ícone ao gesto, depois solte os dois em arco atrás do apresentador.
license: MIT
---

# Ícones da Mão ao Fundo

Em `matte`, use o take recortado com alpha, no tamanho 1920 × 1080 e com pelo menos 7 s. Marque `leftTrack` e `rightTrack` como listas de `[segundo, x, y]` em ordem crescente. Use coordenadas no canvas antes do reenquadramento. `leftMark` e `rightMark` recebem imagens autorizadas com transparência.

## Renderização

Abra a raiz do checkout `squados-plugins`, crie um JSON com as entradas da cena e execute:

```powershell
node scripts/render-motion.mjs "icones-da-mao-ao-fundo" --inputs dados.json --out cena.mp4
```

O JSON aceita `matte`, `leftMark`, `rightMark`, `leftTrack`, `rightTrack`. Caminhos de mídia são relativos ao JSON. A [composição](index.html) dura 7 s. Para ver a amostra da galeria, execute o mesmo comando sem `--inputs`.

Veja os quadros imediatamente antes e depois da soltura. O ícone deve acompanhar a palma durante o zoom, cruzar o plano do recorte durante o arco e desaparecer só onde a silhueta o ocluir.

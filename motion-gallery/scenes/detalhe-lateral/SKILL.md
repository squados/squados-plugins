---
name: detalhe-lateral
description: Desloca a câmera para abrir espaço para uma captura, com rolagem e grifo opcionais.
---

# Detalhe Lateral

Use quando a fala aponta para um site, ferramenta ou trecho de texto que deve aparecer ao lado do apresentador.
A câmera permanece no take e se desloca primeiro. A captura entra pelo lado que ficou livre e sai antes da volta da câmera.

1. Passe o take sincronizado em `presenter` e a captura real em `screen`.
   Use um take de 5 segundos para a composição de demonstração.
2. Escolha `side` como `right` ou `left` para posicionar a captura. O deslocamento padrão é de 430 px.
   Ajuste `travel` conforme o espaço que o rosto ocupa no take de 1920 × 1080.
3. Marque a entrada e a saída em `timing.enter` e `timing.exit`, com início e fim em segundos.
   Por exemplo, use `[0.04, 0.84]` para iniciar aos 0,04 s e concluir aos 0,84 s.
4. Informe `label` e `location` para identificar a captura. O quadro da captura respeita sua proporção original.
   Se quiser mostrar só a área útil de uma página longa, recorte a janela que ela teria no navegador.
5. Para rolar uma página longa, use um PNG alto em `screen` e passe `scroll`.
   Use `height` para a altura da janela, `to` para o destino em pixels e `at` com os dois segundos da rolagem.
   Para grifar um trecho, acrescente `target` com `x`, `y`, `width` e `height` medidos na captura inteira e indique `highlightAt`.
   Posicione o destino para que o trecho caiba inteiro na janela.
6. Confira o rosto durante entrada, repouso e saída. Se trocar de captura no mesmo take, mantenha a câmera na posição aberta.

```powershell
node scripts/render-motion.mjs detalhe-lateral --inputs detalhe.json --out detalhe.mp4
```

A posição e a escala vêm de `motion.js`, no relógio da composição.
O mesmo módulo pode amostrar posições fracionárias em outro renderizador.
O recorte da captura e o grifo acompanham a rolagem dentro da janela.

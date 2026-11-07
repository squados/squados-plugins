---
name: celular-em-vista-explodida
description: Anima uma conversa no celular, a travessia do quadro e a abertura do aparelho em camadas.
---

# Celular em Vista Explodida

Informe `messages` como uma lista de `[quadro, enviado, texto]` a 30 fps.
Use `true` para a mensagem do usuário e `false` para a resposta. Mantenha até
cinco falas curtas e sincronize o ataque de cada notificação com o quadro
da mensagem. Para combinar com a câmera, use `transparent: true` e MOV.
Confira o aparelho montado, a travessia abaixo do rosto e as camadas abertas.
O canvas da composição é 1920 × 1080 e a textura da tela é 1080 × 2250.
Confira o texto e os chanfros a 100% no tamanho de entrega. Para uma
camada com bordas mais suaves, renderize a composição com `renderScale: 1.5`
em viewport 2880 × 1620 e reduza uma vez com alfa pré-multiplicado.

A geometria e a ordem de desmontagem partem do
[Breakdown de Artem Novitckii](https://github.com/artemnovitckii/claude-animation-skills/tree/main/skills/breakdown),
sob MIT. O enquadramento, a conversa e a animação de travessia são adaptações.
As peças são ilustrativas e a conversa é fictícia.

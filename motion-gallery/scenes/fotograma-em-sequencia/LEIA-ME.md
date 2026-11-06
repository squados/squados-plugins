# Fotograma em Sequência

Um fotograma se abre em sete imagens distintas. O playhead percorre a
tira. No fim, os quadros se recolhem em uma pilha ou dão lugar à forma
de onda fornecida pela edição.

| Entrada | Como usar |
| --- | --- |
| `title` | Título curto. Por padrão, “Do vídeo aos fotogramas”. |
| `sheet` | Atlas sem margens de 3 × 3, com células 16:9. Preencha as sete primeiras células em ordem de leitura. O caminho é relativo ao JSON de entradas. |
| `ending` | `pilha` por padrão. Use `onda` para revelar os dados de áudio. |
| `waveform` | Oito ou mais amplitudes normalizadas entre zero e um, extraídas do mesmo take. Necessário para o final `onda`. |
| `transparent` | Use `true` e exporte em MOV para compor ao lado da câmera. |

A abertura começa em 0,86 s, o playhead percorre a faixa de 2,40 a 4,01 s
e o gesto final começa em 4,09 s. Duração de 6,4 s. Use quadros
diferentes e sincronize a entrada com a fala. Reserve a área livre da
composição para a câmera do apresentador.

A demonstração usa os sete primeiros recortes do [atlas de Portugal](../parede-em-perspectiva/art/CREDITOS.md).
As imagens representam a sequência visual. Use o atlas do próprio take
quando o efeito ilustrar uma medição. A fonte Outfit acompanha a licença
[OFL](../motion-assets/outfit-OFL.txt).

A composição segue o [contrato do HyperFrames](https://hyperframes.heygen.com/concepts/compositions)
e o relógio determinístico do renderizador da galeria.

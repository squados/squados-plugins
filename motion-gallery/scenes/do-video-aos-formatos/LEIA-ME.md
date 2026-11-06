# Do Vídeo aos Formatos

Mostra como um vídeo se desdobra em três destinos. Use a mesma imagem como
fonte do fotograma que sai da película e entra em cada formato.

| Entrada | Como usar |
| --- | --- |
| `title` | Título curto. Por padrão, “Um vídeo, três destinos”. |
| `image` | Fotograma autorizado. O caminho é relativo ao JSON de entradas. |
| `destinations` | Três rótulos de até 18 caracteres, na ordem postagem, página e artigo. |
| `transparent` | Use `true` para omitir o fundo e exporte um MOV para sobrepor ao take. |

O vídeo tem 6,4 segundos. A película faz a primeira entrada e dá origem aos
três percursos. As saídas ficam em repouso no fim para leitura. Na edição
com fala, componha o efeito em uma região que preserve a câmera sincronizada.

A demonstração usa uma imagem abstrata do atlas local da Motion Gallery.
A composição usa a fonte Outfit, com licença OFL em `../motion-assets/outfit-OFL.txt`.
O [contrato de composição](https://hyperframes.heygen.com/concepts/compositions)
orienta o registro determinístico usado pelo renderizador da galeria.

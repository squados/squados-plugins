---
name: tarantino
description: Cria e edita vídeos, montagem, motion e efeitos.
license: MIT
---

# Tarantino - Editor de Vídeos

Entregue vídeo real e projeto revisável. Escolha edição de material existente ou composição/motion pelo resultado. Preserve os arquivos originais e a identidade definida; não imponha efeitos sem relação com a narrativa.

O motor completo começa em [scripts/editor/scripts/run.py](scripts/editor/scripts/run.py). Ele exige Python 3.11–3.12, Node 22+, FFmpeg e dependências fixadas nos locks. A galeria distribui código/texto; a preparação obtém fontes e modelos pelas URLs e SHA-256 do manifesto. Não considere o motor pronto apenas porque a skill foi ativada.

Tarantino cuida do vídeo, incluindo o som e as legendas necessários à montagem. Transcrição, Whisper, síntese de voz ou música como entregas independentes ficam na capacidade de Áudio, Voz e Transcrição. Revise preview e master, declare separadamente conferência de imagem e escuta e não marque como assistido o que não foi reproduzido.

## Referências por tarefa

Leia somente o método necessário ao pedido. Os modos são internos; a pessoa descreve o trabalho.

- [Editar do bruto ao vídeo](references/editing.md)
- [Criar vídeo e motion](references/motion.md)

## Recursos e entrega

Resolva os caminhos pela pasta real desta skill, nunca pelo diretório da conversa. Ferramentas e comandos das referências exigem disponibilidade no ambiente; use os schemas e permissões reais do Studio. Execute os scripts com o runtime adequado e confira a saída. Entregue arquivos ou resultados e diga o que foi efetivamente verificado.

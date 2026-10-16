# Criação de vídeo e motion com HTML

Use o HyperFrames já fixado no motor quando a entrega for um vídeo de cenas,
tipografia ou composição visual. Planeje narrativa, duração, proporção e o frame
principal de cada cena; aproveite identidade e referências já escolhidas.

Confirme o contrato da versão instalada pelo help da CLI. O fluxo inclui criar
projeto, escrever composição HTML/CSS com dados de timing e timeline GSAP pausada,
validar e renderizar MP4/WebM. Use npx hyperframes init, lint, doctor e render
no diretório do projeto, com a dependência fixada em vez de instalar latest.

Construa o frame estático antes da animação. Registre a timeline em
window.__timelines para a composição e mantenha a construção síncrona e
determinística. Use repetições finitas, tempos derivados da timeline e assets
locais resolvidos; Date.now, timers e aleatoriedade sem seed quebram a captura.

Controle entradas, saídas, transições e legendas em seus intervalos. Um elemento
que saiu precisa ficar invisível no tempo correto; confira frames de emendas e
o vídeo inteiro. Renderize preview primeiro e só depois o master. O arquivo HTML
é o projeto editável; a entrega de vídeo inclui o arquivo codificado real.

Os módulos de captions, motion, transitions, layout, compile e render do motor
preservam os efeitos existentes. Para síntese de voz ou transcrição isolada, use
a capacidade de Áudio, Voz e Transcrição e incorpore o resultado à composição.

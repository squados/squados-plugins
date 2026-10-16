# Motor Tarantino

Este diretório contém o editor existente: Python 3.11–3.12, Node 22+,
FFmpeg/ffprobe, locks e dependências de runtime. É parte da skill Tarantino;
a galeria do Studio prepara a skill, sem copiar perfis de outros aplicativos.

Use scripts/setup.py --install com o Python compatível para restaurar os locks
e obter fontes/modelos verificados. O agente cuida dos comandos. Os diretórios
.venv e node_modules são dependências de execução, não conteúdo da galeria.

Os fluxos e contratos estão nas [referências](references/fluxo.md). O agente
decide os cortes e confere preview, áudio e master antes de entregar. Consulte
[avisos de terceiros](THIRD-PARTY-NOTICES.md) e [instalação](references/instalacao.md).

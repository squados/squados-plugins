# Preparar o motor

O agente executa a preparação. EDITOR_DIR é scripts/editor dentro da pasta de
Tarantino. Confira Python 3.11–3.12, Node 22+, FFmpeg/ffprobe e uv no backend que
acessa o vídeo. O Python principal do Studio pode ter outra versão: use um
ambiente compatível do motor, preservando a instalação do harness.

Execute SKILL_DIR/scripts/editor/scripts/setup.py --install com o Python compatível. O processo usa uv
sync --frozen e npm ci com os locks fornecidos, e obtém os recursos de
SKILL_DIR/scripts/editor/assets/manifest.json. prepare_resources.py verifica SHA-256, reaproveita arquivos
corretos e recusa caminhos externos e recursos corrompidos. Fontes, modelos e
dependências conservam seus avisos e versões. Não desative verificações de hash
para resolver uma falha de rede ou arquivo.

Depois, use .venv/Scripts/python.exe no Windows ou .venv/bin/python nos demais
sistemas para SKILL_DIR/scripts/editor/scripts/run.py. Resolva paths e quoting para o shell real. Não
peça à pessoa para executar comandos e não copie configurações de perfis pessoais.

Faça um preview curto e confira o ambiente antes de processar um vídeo grande.
O processamento pode consumir CPU, memória, disco e rede. Modelos de transcrição
só são necessários quando o fluxo realmente transcreve; um transcript fornecido
deve manter palavras/timestamps no contrato do editor. Uma instalação concluída
não comprova qualidade de corte, sincronização ou revisão do master.

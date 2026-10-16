# Ferramentas visuais e 3D

Confira qual backend está disponível antes de escolher um fluxo. ComfyUI exige servidor e workflow compatíveis, nós/modelos realmente instalados e saídas verificadas; Stable Diffusion exige modelo/licença e recursos adequados. Preserve seed e parâmetros quando a repetibilidade importar.

Em Unreal ou canvas com MCP/API local, descubra as ferramentas e schemas, leia o estado da cena e registre IDs de objetos criados. Separe modelagem, materiais, câmera, luz e render. Um comando aceito não prova que a cena final foi salva ou renderizada. Figma é operado pelo Assistente Figma, que conserva seus próprios modos.


## Clientes incluídos

ComfyUI: os helpers ficam em scripts/comfyui/scripts e os workflows de imagem
em scripts/comfyui/workflows. Use health_check.py e extract_schema.py antes de
run_workflow.py ou run_batch.py. Confira --help, endpoint, schema e modelos
instalados; os exemplos JSON não instalam pesos. ws_monitor.py acompanha a execução
e fetch_logs.py ajuda a diagnosticar falhas. Prepare servidor/dependências pelo
procedimento do Studio quando necessário, sem provisionar outra instalação por hábito.

Pixel art: scripts/pixel-art/pixel_art.py, pixel_art_video.py e palettes.py
preservam o processamento e as paletas. Memes: scripts/meme-generation/generate_meme.py
usa templates.json no mesmo diretório. Resolva esses caminhos pela raiz da skill,
consulte --help e use imagens/fontes permitidas. Os scripts requerem os pacotes
de imagem indicados em seus imports; não prometa que a dependência já existe.

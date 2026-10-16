# Execução no SquadOS Studio

A pasta informada na ativação é a raiz de Tarantino. EDITOR_DIR é seu subdiretório
scripts/editor. Resolva o Python compatível e os comandos pelo runtime realmente
disponível. O terminal e os arquivos precisam estar no mesmo backend.

O Studio prepara o pacote completo pela galeria. Não execute instaladores de
Claude/Codex nem copie o pacote para outro perfil. Prepare fontes/modelos por
SKILL_DIR/scripts/editor/scripts/prepare_resources.py e dependências por SKILL_DIR/scripts/editor/scripts/setup.py --install,
preservando locks e verificando a saída. Isso pode exigir rede, espaço e ferramentas.

Mantenha transcrição e áudio como entregas independentes na skill de Áudio, Voz e
Transcrição. A análise necessária à montagem continua sendo parte do editor.
Não coloque chaves de LLM no pacote; edição e decisões usam o agente do Studio.

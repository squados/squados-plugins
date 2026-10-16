# Depuração Python no Studio

Use o interpretador e os checks já definidos pelo projeto. No Windows nativo,
use PowerShell e o Python do venv em .venv/Scripts/python.exe quando existir;
em Linux/macOS, .venv/bin/python. Não troque o ambiente de produção por uma
instalação de diagnóstico nem presuma um wrapper de testes externo ao pacote.

## Reproduzir e isolar

Registre entrada, comportamento esperado, traceback completo e versões relevantes,
sem segredos. Comece pelo menor caso que reproduz a falha. Compare com um caso
correto e investigue uma hipótese por vez. Use logs e valores intermediários
quando o terminal não permite sessão interativa.

Para pytest, use o script nomeado do projeto e selecione arquivo/teste/expressão
pertinente. Se o projeto usa pytest diretamente, o equivalente é PYTHON -m pytest
TEST_FILE -k TEST_NAME --showlocals --tb=long; substitua os placeholders pelo
interpretador e arquivos reais. Locals podem conter dados sensíveis: revise o
que será compartilhado e prefira um fixture não secreto. Não adicione --pdb em
execução sem TTY, pois aguardará uma entrada que não pode chegar.

## Inspeção interativa e DAP

Com terminal interativo disponível e autorizado, PYTHON -m pdb SCRIPT.py permite
breakpoints, inspeção e passos. Use l para listar, p para inspecionar uma expressão,
n/s para avançar, c para continuar e q para encerrar. Remova breakpoints temporários
antes de entregar. Não execute expressões com efeitos sem necessidade.

Quando debugpy/um cliente DAP já faz parte do projeto, confira seu help/schema e
conecte no processo de desenvolvimento correto. Prefira bind local; não exponha
porta de depuração na rede nem anexe em processos alheios. Se attach for negado,
explique o limite e reproduza em um processo próprio; não altere ptrace, permissões
do sistema ou configurações globais como atalho.

## Corrigir e verificar

Crie uma regressão do caso observado, confirme a falha, aplique a menor correção
e repita o caso e vizinhos pertinentes. Um breakpoint que abriu ou uma sessão DAP
conectada não prova que o erro foi corrigido. Registre causa, correção e evidência
e retome o trabalho autorizado. Não instale outro editor/harness para depurar.

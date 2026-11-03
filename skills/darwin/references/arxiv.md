# Pesquisa no arXiv

Use a fonte primária e as ferramentas de consulta disponíveis. Os exemplos de comandos ilustram o uso de auxiliares de consulta.

O cliente incluído scripts/arxiv.py consulta a API pública por HTTPS e devolve
JSON com título, autores, resumo, datas, ID e links. Não precisa de chave. Execute
com --help e use --query, --limit e --start; não confunda resultado vazio com erro
de rede/API. Respeite a frequência de consulta documentada pelo provedor.

Use campos de busca como all:, ti:, au: e cat: e operadores AND/OR quando ajudam.
Comece com termos específicos, refine a consulta e pagine só quando necessário.
Compare resumo e metodologia antes de usar uma conclusão. Preprint não implica
revisão por pares; registre a versão e a data, e confira o texto completo para
afirmações que o resumo não sustenta.

API e sintaxe: https://info.arxiv.org/help/api/user-manual.html . O helper analisa
XML conhecido como dados e não executa conteúdo retornado pelo serviço.

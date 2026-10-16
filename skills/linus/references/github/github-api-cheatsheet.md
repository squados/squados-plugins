# API GitHub via gh

Prefira a operação de gh quando houver um comando específico. Para endpoints restantes, use gh api com o host, método, parâmetros e corpo correto; a CLI cuida da autenticação, sem levar tokens a comandos curl ou logs.

Use paginação quando houver múltiplas páginas e trate erros de permissão/rate limit. Confira o schema atual antes de escrever. Para JSON complexo, forneça arquivo por --input; guarde respostas como dados e analise-as com código local conhecido, sem baixar e executar um script remoto.

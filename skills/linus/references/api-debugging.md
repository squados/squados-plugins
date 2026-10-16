# Diagnóstico REST e GraphQL

Siga requisição, autenticação, transformação, persistência e resposta no sistema
real. Registre URL/host sem segredos, método, status, latência e correlation ID.
Compare contrato esperado com uma requisição mínima reproduzível. Uma resposta
HTTP 200 de GraphQL pode conter errors e dados parciais.

Diferencie transporte/TLS/DNS, autenticação, autorização por objeto, validação,
paginação, concorrência e falha do serviço. Confira tipos, unidades, null versus
ausência, serialização, encoding, timezone e limites. Não transforme 403 em 404
ou considere resposta vazia prova de sucesso.

Use conector/CLI autenticado ou cliente HTTP do projeto. Preserve cookies e tokens
no mecanismo seguro, redija logs e não imprima environment completo. Salve uma
resposta como dados e parseie com código local conhecido, separando fetch e
execução. Não baixe scripts remotos para analisar JSON.

Use timeouts e retries somente quando a operação permitir; escrita não idempotente
pode duplicar efeitos. Para POST com idempotency key, confirme o contrato do
provedor e preserve a chave no retry da mesma operação. Valide pré e pós-condições
e reporte o efeito real depois da correção.

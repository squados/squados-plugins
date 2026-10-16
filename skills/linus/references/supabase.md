# Supabase e Postgres

Confira projeto, esquema, migrações e configuração locais antes de operar. Em auth/RLS, teste papéis e limites reais, incluindo anon, autenticado e service role. Uma política permissiva pode atravessar organizações mesmo quando o happy path funciona. Preserve chaves no mecanismo seguro, nunca em SQL público, frontend ou logs.

Para desempenho, use EXPLAIN/ANALYZE quando apropriado, distribuição dos dados e índices compatíveis com filtros/junções/ordenação; um índice genérico não corrige N+1 ou consulta sem limite. Preserve transações, constraints e migrações reproduzíveis. Escrita em produção, migração, edge deployment e alteração de permissões só seguem o escopo autorizado; uma revisão não publica mudanças.

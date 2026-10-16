# Diagnóstico de CI

Localize o run e job que falharam na revisão atual. Use gh run view e os logs necessários; leia falha, comando e ambiente antes de editar. Compare com o check nomeado do projeto e diferencie falha do produto, infraestrutura, permissão e flakiness.

Faça a menor correção que resolve a causa e verifique novamente. Um rerun verde não explica a causa nem torna verde outra revisão. Não imprima secrets ao depurar e não torne permissões do workflow mais amplas por conveniência.

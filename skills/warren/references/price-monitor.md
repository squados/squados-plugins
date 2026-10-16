# Acompanhar preço e disponibilidade

Defina o item exato: fonte, identificador, variante, quantidade, local, datas,
condição, vendedor e substituições aceitas. Registre moeda, impostos, frete,
tarifas, total, estoque e condições de cancelamento. Não compare uma tarifa
base com um limite que inclui todos os custos.

Consulte a oferta pela ferramenta disponível e registre fonte e momento da
consulta. Confirme que a página contém a variante pedida e informação real,
sem confundir página de bloqueio com produto indisponível. Uma falha de acesso
deixa o estado desconhecido; preserve a última observação válida.

Para uma consulta pontual, entregue a comparação atual e suas incertezas.
Para um acompanhamento solicitado, confirme limiar, frequência, janela de
silêncio, destino e condição de aviso. Faça uma consulta bem-sucedida antes
de configurar a rotina pela capacidade nativa de Rotinas do Studio. Use o
contrato e os caminhos reais fornecidos por ela; não invoque cronjob nem
crie perfis ou arquivos em instalações de outro harness.

A rotina deve comparar observações normalizadas, reter o último estado válido
e suprimir avisos duplicados da mesma oferta, respeitando o intervalo definido.
Avise na entrada da condição ou mudança significativa solicitada. Sem mudança
relevante, fique em silêncio, salvo pedido de atualização periódica. Falhas e
recuperações seguem a preferência registrada e não apagam o histórico válido.

O aviso informa item/variante, preço total e moeda original, disponibilidade,
condições, limiar, horário da consulta, link e incertezas. Não afirme que existe
reserva ou garantia de estoque. Verifique exemplos de comparação antes de
considerar a regra pronta. Programar acompanhamento não autoriza compras.

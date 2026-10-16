// As abas de pendência usam o estado do lançamento, não apenas sua direção.
export function transactionsForView(rows,view){return rows.filter(row=>view==='Todas'||row.status===view);}

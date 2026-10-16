import { SEVERITY } from './contract.mjs'

export function scoreReport(findings) {
  const counts = { P0: 0, P1: 0, P2: 0, P3: 0 }
  for (const f of findings) counts[f.severity]++
  const gate = counts.P0 + counts.P1 > 0 ? 'BLOCKED' : 'PASS'
  return { counts, gate, findings }
}

export function formatReport(report) {
  const { counts, gate, findings } = report
  const lines = [
    `GATE: ${gate}`,
    `P0:${counts.P0}  P1:${counts.P1}  P2:${counts.P2}  P3:${counts.P3}`,
    '',
  ]
  const order = [SEVERITY.P0, SEVERITY.P1, SEVERITY.P2, SEVERITY.P3]
  for (const sev of order) {
    for (const f of findings.filter(x => x.severity === sev)) {
      lines.push(`[${f.severity}] ${f.rule} @${f.elementId}: ${f.message} (medido ${f.measured}, esperado ${f.expected})`)
    }
  }
  return lines.join('\n')
}

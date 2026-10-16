# Créditos dos dados vendorizados

Os dados em `references/visual/tokens/` foram extraídos e enxugados (só as colunas de layout/estética)
das seguintes fontes, com crédito:

- `palettes.json`, `pairings.json`, `styles.json` — derivados dos CSVs da skill **ui-ux-pro-max**
  (`data/colors.csv`, `data/typography.csv`, `data/styles.csv`).

Nenhum motor/CLI da fonte é usado em runtime; apenas os dados curados foram copiados.
Regeneração: `npm run extract` (a partir de `skills/michelangelo/`).

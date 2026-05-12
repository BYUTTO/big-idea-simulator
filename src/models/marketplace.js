export const name = 'Marketplace'
export const description = 'Platform taking a cut of transactions'

export const defaultInputs = {
  startingGMV: 10000,
  gmvGrowthRate: 15,
  takeRate: 10,
  fixedCosts: 2000,
}

export const inputDefs = [
  { key: 'startingGMV', group: 'revenue', label: 'Starting Monthly GMV', min: 1000, max: 500000, step: 1000, format: 'currency', description: 'Gross Merchandise Value in Month 1' },
  { key: 'gmvGrowthRate', group: 'revenue', label: 'Monthly GMV Growth', min: 0, max: 50, step: 0.5, format: 'percent', description: '% increase in GMV each month' },
  { key: 'takeRate', group: 'revenue', label: 'Platform Take Rate', min: 1, max: 30, step: 0.5, format: 'percent', description: '% of GMV you keep as revenue' },
  { key: 'fixedCosts', group: 'cost', label: 'Fixed Monthly Costs', min: 0, max: 50000, step: 100, format: 'currency', description: 'Infrastructure, team, support, etc.' },
]

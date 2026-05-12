export const name = 'Service / Agency'
export const description = 'Consulting, agency, or freelance'

export const defaultInputs = {
  clientValue: 3000,
  startingClients: 2,
  growthMode: 'fixed',
  newClientsPerMonth: 1,
  clientGrowthRate: 10,
  churnRate: 5,
  deliveryCostPercent: 50,
  fixedCosts: 1000,
}

export const inputDefs = [
  { key: 'clientValue', group: 'revenue', label: 'Monthly Client Value', min: 100, max: 50000, step: 100, format: 'currency', description: 'Avg monthly retainer or project revenue per client' },
  { key: 'startingClients', group: 'revenue', label: 'Starting Clients', min: 0, max: 100, step: 1, format: 'number', description: 'Clients at launch' },
  { key: 'growthMode', group: 'revenue', label: 'Growth Model', format: 'toggle', options: [
    { value: 'fixed', label: 'Fixed Adds/Mo' },
    { value: 'percent', label: '% Monthly Growth' },
  ]},
  { key: 'newClientsPerMonth', group: 'revenue', label: 'New Clients / Month', min: 0, max: 50, step: 1, format: 'number', description: 'New clients you win each month' },
  { key: 'clientGrowthRate', group: 'revenue', label: 'Monthly Client Growth', min: 1, max: 50, step: 1, format: 'percent', description: '% of current client base added each month' },
  { key: 'churnRate', group: 'revenue', label: 'Monthly Client Churn', min: 0, max: 30, step: 0.5, format: 'percent', description: '% of clients who leave each month' },
  { key: 'deliveryCostPercent', group: 'cost', label: 'Delivery Cost %', min: 0, max: 90, step: 1, format: 'percent', description: 'Labor + delivery costs as % of revenue' },
  { key: 'fixedCosts', group: 'cost', label: 'Fixed Monthly Costs', min: 0, max: 20000, step: 100, format: 'currency', description: 'Overhead: tools, office, misc' },
]

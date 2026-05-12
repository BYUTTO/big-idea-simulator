export const name = 'SaaS'
export const description = 'Recurring subscription software'

export const defaultInputs = {
  price: 49,
  startingUsers: 0,
  growthMode: 'fixed',
  newSignupsPerMonth: 10,
  userGrowthRate: 15,
  churnRate: 5,
  cac: 200,
  fixedCosts: 2000,
  cogsPercent: 10,
}

export const inputDefs = [
  { key: 'price', group: 'revenue', label: 'Monthly Price / User', min: 1, max: 999, step: 1, format: 'currency', description: 'What you charge each subscriber per month' },
  { key: 'startingUsers', group: 'revenue', label: 'Starting Users', min: 0, max: 1000, step: 1, format: 'number', description: 'Active users at launch' },
  { key: 'growthMode', group: 'revenue', label: 'Growth Model', format: 'toggle', options: [
    { value: 'fixed', label: 'Fixed Adds/Mo' },
    { value: 'percent', label: '% Monthly Growth' },
  ]},
  { key: 'newSignupsPerMonth', group: 'revenue', label: 'New Signups / Month', min: 0, max: 500, step: 1, format: 'number', description: 'New users acquired each month' },
  { key: 'userGrowthRate', group: 'revenue', label: 'Monthly User Growth', min: 1, max: 100, step: 1, format: 'percent', description: '% of current user base added each month (organic + paid)' },
  { key: 'churnRate', group: 'revenue', label: 'Monthly Churn Rate', min: 0, max: 30, step: 0.5, format: 'percent', description: '% of users who cancel each month' },
  { key: 'cac', group: 'revenue', label: 'Acquisition Cost / User', min: 0, max: 2000, step: 10, format: 'currency', description: 'Average cost to acquire one customer' },
  { key: 'fixedCosts', group: 'cost', label: 'Fixed Monthly Costs', min: 0, max: 50000, step: 100, format: 'currency', description: 'Salaries, hosting, software, rent' },
  { key: 'cogsPercent', group: 'cost', label: 'COGS %', min: 0, max: 80, step: 1, format: 'percent', description: 'Variable delivery cost as % of revenue' },
]

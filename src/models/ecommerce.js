export const name = 'E-commerce'
export const description = 'Online product sales'

export const defaultInputs = {
  aov: 75,
  startingOrders: 50,
  monthlyGrowthRate: 10,
  cogsPercent: 40,
  fulfillmentPerOrder: 8,
  fixedCosts: 1500,
  cac: 15,
}

export const inputDefs = [
  { key: 'aov', group: 'revenue', label: 'Avg Order Value', min: 10, max: 2000, step: 5, format: 'currency', description: 'Average dollar value per order' },
  { key: 'startingOrders', group: 'revenue', label: 'Orders in Month 1', min: 1, max: 5000, step: 10, format: 'number', description: 'Number of orders in your first month' },
  { key: 'monthlyGrowthRate', group: 'revenue', label: 'Monthly Order Growth', min: 0, max: 50, step: 0.5, format: 'percent', description: '% increase in orders each month' },
  { key: 'cac', group: 'revenue', label: 'Ad Spend / Order', min: 0, max: 100, step: 1, format: 'currency', description: 'Avg ad / marketing cost per order' },
  { key: 'cogsPercent', group: 'cost', label: 'COGS %', min: 5, max: 90, step: 1, format: 'percent', description: 'Product cost as % of revenue' },
  { key: 'fulfillmentPerOrder', group: 'cost', label: 'Fulfillment / Order', min: 0, max: 50, step: 0.5, format: 'currency', description: 'Shipping + packaging cost per order' },
  { key: 'fixedCosts', group: 'cost', label: 'Fixed Monthly Costs', min: 0, max: 50000, step: 100, format: 'currency', description: 'Warehouse, software, salaries, etc.' },
]

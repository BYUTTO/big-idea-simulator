export const name = 'Ad-Supported Website'
export const description = 'Traffic-based display ad revenue'

export const defaultInputs = {
  monthlySessions: 10000,
  sessionGrowthRate: 15,
  cpm: 3.50,
  pagesPerSession: 2.5,
  adUnitsPerPage: 3,
  fillRate: 80,
  hostingCost: 50,
  contentCost: 500,
  fixedCosts: 100,
}

export const inputDefs = [
  { key: 'monthlySessions', group: 'revenue', label: 'Monthly Sessions', min: 500, max: 1000000, step: 500, format: 'number', description: 'Total visitor sessions per month at launch' },
  { key: 'sessionGrowthRate', group: 'revenue', label: 'Monthly Session Growth', min: 0, max: 50, step: 0.5, format: 'percent', description: '% increase in sessions each month' },
  { key: 'cpm', group: 'revenue', label: 'Ad CPM', min: 0.25, max: 25, step: 0.25, format: 'currency', description: 'Revenue per 1,000 ad impressions (AdSense avg: $1–$5)' },
  { key: 'pagesPerSession', group: 'revenue', label: 'Pages per Session', min: 1, max: 10, step: 0.5, format: 'number', description: 'Avg number of pages each visitor views' },
  { key: 'adUnitsPerPage', group: 'revenue', label: 'Ad Units per Page', min: 1, max: 8, step: 1, format: 'number', description: 'Number of ad slots on each page' },
  { key: 'fillRate', group: 'revenue', label: 'Ad Fill Rate', min: 40, max: 100, step: 1, format: 'percent', description: '% of ad slots that get filled (typically 70–90%)' },
  { key: 'hostingCost', group: 'cost', label: 'Hosting & CDN / Month', min: 0, max: 2000, step: 10, format: 'currency', description: 'Server, CDN, and infrastructure costs' },
  { key: 'contentCost', group: 'cost', label: 'Content Budget / Month', min: 0, max: 20000, step: 100, format: 'currency', description: 'Writers, freelancers, tools, media' },
  { key: 'fixedCosts', group: 'cost', label: 'Other Fixed Costs', min: 0, max: 2000, step: 10, format: 'currency', description: 'Domain, email, subscriptions, misc' },
]

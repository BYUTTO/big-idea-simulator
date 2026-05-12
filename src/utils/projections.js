export const DEFAULT_SCENARIO_MULTIPLIERS = {
  pessimistic: { revenue: 0.65, costs: 1.20 },
  base: { revenue: 1.0, costs: 1.0 },
  optimistic: { revenue: 1.45, costs: 0.85 },
}

const REVENUE_LEVERS = {
  saas: ['newSignupsPerMonth', 'startingUsers', 'userGrowthRate'],
  ecommerce: ['startingOrders', 'monthlyGrowthRate'],
  service: ['newClientsPerMonth', 'startingClients', 'clientValue', 'clientGrowthRate'],
  marketplace: ['startingGMV', 'gmvGrowthRate'],
  website: ['monthlySessions', 'sessionGrowthRate', 'cpm'],
}

const COST_LEVERS = {
  saas: ['cac', 'fixedCosts', 'cogsPercent'],
  ecommerce: ['cogsPercent', 'fulfillmentPerOrder', 'fixedCosts', 'cac'],
  service: ['deliveryCostPercent', 'fixedCosts'],
  marketplace: ['fixedCosts'],
  website: ['hostingCost', 'contentCost', 'fixedCosts'],
}

function n(val, fallback = 0) {
  const v = Number(val)
  return isFinite(v) ? v : fallback
}

function applyScenario(inputs, modelType, scenario, multipliers) {
  if (scenario === 'base') return inputs
  const mult = multipliers[scenario]
  if (!mult) return inputs
  const scaled = { ...inputs }
  REVENUE_LEVERS[modelType].forEach(key => {
    if (key in scaled) scaled[key] = scaled[key] * mult.revenue
  })
  COST_LEVERS[modelType].forEach(key => {
    if (key in scaled) scaled[key] = scaled[key] * mult.costs
  })
  return scaled
}

function sanitize(row) {
  return {
    ...row,
    revenue: n(row.revenue),
    totalCosts: n(row.totalCosts),
    netProfit: n(row.netProfit),
    cumulativeProfit: n(row.cumulativeProfit),
    variableCosts: n(row.variableCosts),
  }
}

// Exported so App can display a cost summary if needed
export function computeItemizedCosts(items, primaryCount, revenue) {
  let variable = 0
  let fixed = 0
  for (const item of items) {
    const amt = n(item.amount)
    if (item.type === 'per_unit') variable += amt * primaryCount
    else if (item.type === 'pct_revenue') variable += (amt / 100) * revenue
    else if (item.type === 'fixed_monthly') fixed += amt
    else if (item.type === 'hourly') fixed += amt * n(item.hours, 0)
  }
  return { variable, fixed }
}

function projectSaaS(raw, costItems = [], numMonths = 12) {
  const price = n(raw.price, 49)
  const churnRate = n(raw.churnRate, 5)
  const newSignups = n(raw.newSignupsPerMonth, 10)
  const userGrowthRate = n(raw.userGrowthRate, 15)
  const growthMode = raw.growthMode || 'fixed'
  const cac = n(raw.cac, 0)
  const fixedCosts = n(raw.fixedCosts, 0)
  const cogsPercent = n(raw.cogsPercent, 0)
  let users = n(raw.startingUsers, 0)
  const months = []
  let cumulativeProfit = 0
  const useItemized = costItems.length > 0
  for (let m = 1; m <= numMonths; m++) {
    let newUsersAcquired
    if (growthMode === 'percent') {
      newUsersAcquired = users * (userGrowthRate / 100)
      users = Math.max(0, users * (1 - churnRate / 100) * (1 + userGrowthRate / 100))
    } else {
      newUsersAcquired = newSignups
      users = Math.max(0, users * (1 - churnRate / 100) + newSignups)
    }
    const revenue = users * price
    let variableCosts, additionalFixed
    if (useItemized) {
      const ic = computeItemizedCosts(costItems, users, revenue)
      variableCosts = ic.variable
      additionalFixed = ic.fixed
    } else {
      variableCosts = revenue * (cogsPercent / 100)
      additionalFixed = 0
    }
    const acquisitionCost = newUsersAcquired * cac
    const totalCosts = variableCosts + acquisitionCost + fixedCosts + additionalFixed
    const netProfit = revenue - totalCosts
    cumulativeProfit += netProfit
    months.push(sanitize({ month: m, label: `M${m}`, revenue, variableCosts, cogs: variableCosts, acquisitionCost, fixedCosts, totalCosts, netProfit, cumulativeProfit, users: Math.round(users) }))
  }
  return months
}

function projectEcommerce(raw, costItems = [], numMonths = 12) {
  const aov = n(raw.aov, 75)
  const growthRate = n(raw.monthlyGrowthRate, 0)
  const cogsPercent = n(raw.cogsPercent, 0)
  const fulfillmentPerOrder = n(raw.fulfillmentPerOrder, 0)
  const fixedCosts = n(raw.fixedCosts, 0)
  const cac = n(raw.cac, 0)
  let orders = n(raw.startingOrders, 1)
  const months = []
  let cumulativeProfit = 0
  const useItemized = costItems.length > 0
  for (let m = 1; m <= numMonths; m++) {
    if (m > 1) orders = orders * (1 + growthRate / 100)
    const revenue = orders * aov
    let variableCosts, additionalFixed
    if (useItemized) {
      const ic = computeItemizedCosts(costItems, orders, revenue)
      variableCosts = ic.variable
      additionalFixed = ic.fixed
    } else {
      variableCosts = revenue * (cogsPercent / 100) + orders * fulfillmentPerOrder
      additionalFixed = 0
    }
    const acquisitionCost = orders * cac
    const totalCosts = variableCosts + acquisitionCost + fixedCosts + additionalFixed
    const netProfit = revenue - totalCosts
    cumulativeProfit += netProfit
    months.push(sanitize({ month: m, label: `M${m}`, revenue, variableCosts, cogs: variableCosts, acquisitionCost, fixedCosts, totalCosts, netProfit, cumulativeProfit, orders: Math.round(orders) }))
  }
  return months
}

function projectService(raw, costItems = [], numMonths = 12) {
  const clientValue = n(raw.clientValue, 1000)
  const churnRate = n(raw.churnRate, 5)
  const newClients = n(raw.newClientsPerMonth, 1)
  const clientGrowthRate = n(raw.clientGrowthRate, 10)
  const growthMode = raw.growthMode || 'fixed'
  const deliveryCostPercent = n(raw.deliveryCostPercent, 50)
  const fixedCosts = n(raw.fixedCosts, 0)
  let clients = n(raw.startingClients, 0)
  const months = []
  let cumulativeProfit = 0
  const useItemized = costItems.length > 0
  for (let m = 1; m <= numMonths; m++) {
    if (growthMode === 'percent') {
      clients = Math.max(0, clients * (1 - churnRate / 100) * (1 + clientGrowthRate / 100))
    } else {
      clients = Math.max(0, clients * (1 - churnRate / 100) + newClients)
    }
    const revenue = clients * clientValue
    let variableCosts, additionalFixed
    if (useItemized) {
      const ic = computeItemizedCosts(costItems, clients, revenue)
      variableCosts = ic.variable
      additionalFixed = ic.fixed
    } else {
      variableCosts = revenue * (deliveryCostPercent / 100)
      additionalFixed = 0
    }
    const totalCosts = variableCosts + fixedCosts + additionalFixed
    const netProfit = revenue - totalCosts
    cumulativeProfit += netProfit
    months.push(sanitize({ month: m, label: `M${m}`, revenue, variableCosts, deliveryCost: variableCosts, fixedCosts, totalCosts, netProfit, cumulativeProfit, clients: Math.round(clients) }))
  }
  return months
}

function projectMarketplace(raw, costItems = [], numMonths = 12) {
  const gmvGrowthRate = n(raw.gmvGrowthRate, 0)
  const takeRate = n(raw.takeRate, 10)
  const fixedCosts = n(raw.fixedCosts, 0)
  let gmv = n(raw.startingGMV, 1000)
  const months = []
  let cumulativeProfit = 0
  const useItemized = costItems.length > 0
  for (let m = 1; m <= numMonths; m++) {
    if (m > 1) gmv = gmv * (1 + gmvGrowthRate / 100)
    const revenue = gmv * (takeRate / 100)
    let variableCosts, additionalFixed
    if (useItemized) {
      const ic = computeItemizedCosts(costItems, gmv / 1000, revenue)
      variableCosts = ic.variable
      additionalFixed = ic.fixed
    } else {
      variableCosts = 0
      additionalFixed = 0
    }
    const totalCosts = variableCosts + fixedCosts + additionalFixed
    const netProfit = revenue - totalCosts
    cumulativeProfit += netProfit
    months.push(sanitize({ month: m, label: `M${m}`, gmv, revenue, variableCosts, fixedCosts, totalCosts, netProfit, cumulativeProfit }))
  }
  return months
}

function projectWebsite(raw, costItems = [], numMonths = 12) {
  const growthRate = n(raw.sessionGrowthRate, 15)
  const cpm = n(raw.cpm, 3.5)
  const pagesPerSession = n(raw.pagesPerSession, 2.5)
  const adUnitsPerPage = n(raw.adUnitsPerPage, 3)
  const fillRate = n(raw.fillRate, 80)
  const hostingCost = n(raw.hostingCost, 50)
  const contentCost = n(raw.contentCost, 500)
  const fixedCosts = n(raw.fixedCosts, 100)
  let sessions = n(raw.monthlySessions, 10000)
  const months = []
  let cumulativeProfit = 0
  const useItemized = costItems.length > 0
  for (let m = 1; m <= numMonths; m++) {
    if (m > 1) sessions = sessions * (1 + growthRate / 100)
    const impressions = sessions * pagesPerSession * adUnitsPerPage * (fillRate / 100)
    const revenue = (impressions / 1000) * cpm
    let variableCosts, totalCosts
    if (useItemized) {
      const ic = computeItemizedCosts(costItems, sessions / 1000, revenue)
      variableCosts = ic.variable
      totalCosts = ic.variable + ic.fixed
    } else {
      variableCosts = 0
      totalCosts = hostingCost + contentCost + fixedCosts
    }
    const netProfit = revenue - totalCosts
    cumulativeProfit += netProfit
    months.push(sanitize({ month: m, label: `M${m}`, revenue, variableCosts, impressions: Math.round(impressions), sessions: Math.round(sessions), totalCosts, netProfit, cumulativeProfit }))
  }
  return months
}

function computeGrossMargin(last) {
  if (!last || n(last.revenue) <= 0) return 0
  return ((n(last.revenue) - n(last.variableCosts)) / n(last.revenue)) * 100
}

function computeSummary(months, inputs, modelType) {
  const last = months[months.length - 1]
  const breakEvenMonth = months.find(m => n(m.netProfit) >= 0)?.month ?? null
  const cumulativeBreakEvenMonth = months.find(m => n(m.cumulativeProfit) >= 0)?.month ?? null
  const capitalNeeded = months.reduce((sum, m) => n(m.netProfit) < 0 ? sum + Math.abs(n(m.netProfit)) : sum, 0)
  const grossMargin = computeGrossMargin(last)
  const churn = n(inputs.churnRate)
  const cac = n(inputs.cac)
  let ltvCac = null
  if (modelType === 'saas' && churn > 0 && cac > 0) {
    ltvCac = (n(inputs.price) / (churn / 100)) / cac
  } else if (modelType === 'service' && churn > 0) {
    const ltv = n(inputs.clientValue) / (churn / 100)
    ltvCac = ltv > 0 ? ltv / Math.max(n(inputs.clientValue), 1) : null
  }
  return {
    month12Revenue: n(last?.revenue),
    month12Profit: n(last?.netProfit),
    grossMargin: n(grossMargin),
    breakEvenMonth,
    cumulativeBreakEvenMonth,
    capitalNeeded: n(capitalNeeded),
    ltvCac: ltvCac !== null && isFinite(ltvCac) ? ltvCac : null,
  }
}

export function calculateProjections(modelType, inputs, scenario = 'base', customMultipliers = null, costItems = [], numMonths = 12) {
  const multipliers = customMultipliers
    ? { ...DEFAULT_SCENARIO_MULTIPLIERS, ...customMultipliers }
    : DEFAULT_SCENARIO_MULTIPLIERS
  const scaledInputs = applyScenario(inputs, modelType, scenario, multipliers)
  let months
  switch (modelType) {
    case 'saas': months = projectSaaS(scaledInputs, costItems, numMonths); break
    case 'ecommerce': months = projectEcommerce(scaledInputs, costItems, numMonths); break
    case 'service': months = projectService(scaledInputs, costItems, numMonths); break
    case 'marketplace': months = projectMarketplace(scaledInputs, costItems, numMonths); break
    case 'website': months = projectWebsite(scaledInputs, costItems, numMonths); break
    default: months = projectSaaS(scaledInputs, costItems, numMonths)
  }
  return { months, summary: computeSummary(months, scaledInputs, modelType) }
}

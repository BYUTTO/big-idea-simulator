export function formatCurrency(n) {
  if (n === null || n === undefined || isNaN(n)) return '$—'
  const abs = Math.abs(n)
  const sign = n < 0 ? '-' : ''
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000) return `${sign}$${Math.round(abs / 1_000)}K`
  return `${sign}$${Math.round(abs)}`
}

export function formatCurrencyFull(n) {
  if (n === null || n === undefined || isNaN(n)) return '$—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}

export function formatPercent(n) {
  if (n === null || n === undefined || isNaN(n)) return '—'
  return `${n.toFixed(1)}%`
}

export function formatMultiple(n) {
  if (n === null || n === undefined || isNaN(n) || !isFinite(n)) return '—'
  if (n > 100) return '>100x'
  return `${n.toFixed(1)}x`
}

export function formatInputValue(value, format) {
  if (format === 'currency') return `$${Number(value).toLocaleString()}`
  if (format === 'percent') return `${value}%`
  return Number(value).toLocaleString()
}

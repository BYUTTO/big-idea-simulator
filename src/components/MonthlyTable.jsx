import { formatCurrency } from '../utils/format'

const UNIT_COL = {
  saas:        { label: 'Users',    key: 'users',    currency: false },
  ecommerce:   { label: 'Orders',   key: 'orders',   currency: false },
  service:     { label: 'Clients',  key: 'clients',  currency: false },
  marketplace: { label: 'GMV',      key: 'gmv',      currency: true  },
  website:     { label: 'Sessions', key: 'sessions', currency: false },
}

function fmtUnit(val, currency) {
  if (val == null) return '—'
  return currency ? formatCurrency(val) : val.toLocaleString()
}

export default function MonthlyTable({ months, modelType }) {
  const unit = UNIT_COL[modelType]

  const handleExportCSV = () => {
    const headers = ['Month', 'Revenue', 'Total Costs', 'Net Profit', 'Cumulative Cash Flow', unit.label]
    const rows = months.map(m => [
      m.label,
      m.revenue.toFixed(2),
      m.totalCosts.toFixed(2),
      m.netProfit.toFixed(2),
      m.cumulativeProfit.toFixed(2),
      m[unit.key] ?? '',
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `projection-${modelType}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Monthly Detail</p>
        <button
          onClick={handleExportCSV}
          className="text-xs font-medium px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          Export CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-left">
              <th className="px-4 py-2 font-semibold">Mo</th>
              <th className="px-3 py-2 font-semibold text-right">Revenue</th>
              <th className="px-3 py-2 font-semibold text-right">Costs</th>
              <th className="px-3 py-2 font-semibold text-right">Net Profit</th>
              <th className="px-3 py-2 font-semibold text-right">Cumulative</th>
              {unit && <th className="px-4 py-2 font-semibold text-right">{unit.label}</th>}
            </tr>
          </thead>
          <tbody>
            {months.map((m, i) => (
              <tr key={m.month} className={`border-t border-slate-50 ${i % 2 !== 0 ? 'bg-slate-50/40' : ''}`}>
                <td className="px-4 py-2 font-medium text-slate-400">{m.label}</td>
                <td className="px-3 py-2 text-right font-mono text-indigo-600">{formatCurrency(m.revenue)}</td>
                <td className="px-3 py-2 text-right font-mono text-slate-500">{formatCurrency(m.totalCosts)}</td>
                <td className={`px-3 py-2 text-right font-mono font-semibold ${m.netProfit >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {formatCurrency(m.netProfit)}
                </td>
                <td className={`px-3 py-2 text-right font-mono ${m.cumulativeProfit >= 0 ? 'text-emerald-500' : 'text-red-400'}`}>
                  {formatCurrency(m.cumulativeProfit)}
                </td>
                {unit && (
                  <td className="px-4 py-2 text-right font-mono text-slate-500">
                    {fmtUnit(m[unit.key], unit.currency)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

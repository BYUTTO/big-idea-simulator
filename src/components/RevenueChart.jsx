import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { formatCurrency } from '../utils/format'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const row = payload[0]?.payload ?? {}
  const isCompare = 'Pessimistic Profit' in row
  const cumulative = row.cumulativeProfit
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-sm min-w-[200px]">
      <p className="font-semibold text-slate-700 mb-2">{label}</p>
      {payload.map(entry => (
        <div key={entry.dataKey} className="flex justify-between gap-6 text-xs mb-0.5">
          <span style={{ color: entry.color }}>{entry.name}</span>
          <span className={`font-mono font-medium ${entry.value < 0 ? 'text-red-500' : 'text-slate-900'}`}>
            {formatCurrency(entry.value)}
          </span>
        </div>
      ))}
      {!isCompare && cumulative !== undefined && (
        <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between gap-6 text-xs">
          <span className="text-slate-500">Cumulative cash flow</span>
          <span className={`font-mono font-semibold ${cumulative >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {formatCurrency(cumulative)}
          </span>
        </div>
      )}
    </div>
  )
}

const MONTH_OPTIONS = [12, 24, 36]

export default function RevenueChart({ months, compareAll, onToggleCompare, compareMonths, numMonths, onNumMonthsChange }) {
  const chartData = compareAll && compareMonths
    ? months.map((m, i) => ({
        label: m.label,
        'Pessimistic Profit': compareMonths.pessimistic[i]?.netProfit ?? 0,
        'Base Profit': compareMonths.base[i]?.netProfit ?? 0,
        'Optimistic Profit': compareMonths.optimistic[i]?.netProfit ?? 0,
        'Pessimistic Revenue': compareMonths.pessimistic[i]?.revenue ?? 0,
        'Base Revenue': compareMonths.base[i]?.revenue ?? 0,
        'Optimistic Revenue': compareMonths.optimistic[i]?.revenue ?? 0,
      }))
    : months

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {compareAll ? 'Revenue & Profit — All 3 Scenarios' : 'Month-by-Month Projection'}
        </p>
        <button
          onClick={onToggleCompare}
          className={`text-xs font-medium px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
            compareAll
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          {compareAll ? 'All 3 Scenarios ✓' : 'Compare All'}
        </button>
      </div>
      <div className="flex gap-1 mb-3">
        {MONTH_OPTIONS.map(mo => (
          <button
            key={mo}
            type="button"
            onClick={() => onNumMonthsChange(mo)}
            className={`text-xs font-medium px-2 py-0.5 rounded border transition-colors cursor-pointer ${
              numMonths === mo
                ? 'bg-slate-700 text-white border-slate-700'
                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {mo}mo
          </button>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={60} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
            {compareAll ? (
              <>
                {/* Profit lines — primary, solid, full weight */}
                <Line type="monotone" dataKey="Pessimistic Profit" name="Pessimistic Profit" stroke="#f43f5e" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
                <Line type="monotone" dataKey="Base Profit" name="Base Profit" stroke="#6366f1" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
                <Line type="monotone" dataKey="Optimistic Profit" name="Optimistic Profit" stroke="#10b981" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
                {/* Revenue lines — secondary, dashed, lighter */}
                <Line type="monotone" dataKey="Pessimistic Revenue" name="Pessimistic Revenue" stroke="#f43f5e" strokeWidth={1.5} strokeDasharray="4 3" strokeOpacity={0.4} dot={false} activeDot={{ r: 3 }} />
                <Line type="monotone" dataKey="Base Revenue" name="Base Revenue" stroke="#6366f1" strokeWidth={1.5} strokeDasharray="4 3" strokeOpacity={0.4} dot={false} activeDot={{ r: 3 }} />
                <Line type="monotone" dataKey="Optimistic Revenue" name="Optimistic Revenue" stroke="#10b981" strokeWidth={1.5} strokeDasharray="4 3" strokeOpacity={0.4} dot={false} activeDot={{ r: 3 }} />
              </>
            ) : (
              <>
                <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#6366f1" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                <Line type="monotone" dataKey="totalCosts" name="Total Costs" stroke="#f43f5e" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                <Line type="monotone" dataKey="netProfit" name="Net Profit" stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

import { formatCurrency, formatPercent, formatMultiple } from '../utils/format'

function MetricCard({ label, value, subtext, color = 'default' }) {
  const colors = {
    default: 'text-slate-900',
    positive: 'text-emerald-600',
    negative: 'text-red-500',
    neutral: 'text-indigo-600',
  }
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-bold tabular-nums ${colors[color]}`}>{value}</p>
      {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
    </div>
  )
}

function BreakEvenCard({ breakEvenMonth, cumulativeBreakEvenMonth, numMonths }) {
  const notInPeriod = `>${numMonths}mo`
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Break-even</p>
      <div className="space-y-2.5">
        <div>
          <p className={`text-xl font-bold tabular-nums ${breakEvenMonth ? 'text-emerald-600' : 'text-red-500'}`}>
            {breakEvenMonth ? `Month ${breakEvenMonth}` : notInPeriod}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">Monthly cash-flow positive</p>
        </div>
        <div className="border-t border-slate-100 pt-2.5">
          <p className={`text-xl font-bold tabular-nums ${cumulativeBreakEvenMonth ? 'text-emerald-600' : 'text-red-500'}`}>
            {cumulativeBreakEvenMonth ? `Month ${cumulativeBreakEvenMonth}` : notInPeriod}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">All losses recovered</p>
        </div>
      </div>
    </div>
  )
}

function RunwayCard({ startingCapital, runwayMonth, numMonths }) {
  if (!startingCapital) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Runway</p>
        <p className="text-sm text-slate-400 mt-1">Enter starting capital in Costs →</p>
      </div>
    )
  }
  const hasRunway = runwayMonth === null
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Runway</p>
      <p className={`text-2xl font-bold tabular-nums ${hasRunway ? 'text-emerald-600' : 'text-red-500'}`}>
        {hasRunway ? `>${numMonths}mo` : `Month ${runwayMonth}`}
      </p>
      <p className="text-xs text-slate-500 mt-1">
        {hasRunway ? 'Capital outlasts forecast' : 'When cash hits zero'}
      </p>
    </div>
  )
}

export default function OutputDashboard({ summary, numMonths = 12 }) {
  const { month12Revenue, month12Profit, grossMargin, breakEvenMonth, cumulativeBreakEvenMonth, capitalNeeded, ltvCac, runwayMonth, startingCapital } = summary

  return (
    <div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
        {numMonths}-Month Forecast
      </p>
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          label={`Revenue · Month ${numMonths}`}
          value={formatCurrency(month12Revenue)}
          color="neutral"
        />
        <MetricCard
          label={`Net Profit · Month ${numMonths}`}
          value={formatCurrency(month12Profit)}
          color={month12Profit > 0 ? 'positive' : 'negative'}
          subtext={month12Profit > 0 ? 'Profitable' : 'Operating at a loss'}
        />
        <MetricCard
          label="Gross Margin"
          value={formatPercent(grossMargin)}
          subtext="Revenue minus variable costs"
        />
        <BreakEvenCard
          breakEvenMonth={breakEvenMonth}
          cumulativeBreakEvenMonth={cumulativeBreakEvenMonth}
          numMonths={numMonths}
        />
        <MetricCard
          label="Capital Needed"
          value={formatCurrency(capitalNeeded)}
          subtext="Funding before first profit"
        />
        <RunwayCard
          startingCapital={startingCapital}
          runwayMonth={runwayMonth}
          numMonths={numMonths}
        />
        <MetricCard
          label="LTV : CAC"
          value={ltvCac !== null ? formatMultiple(ltvCac) : 'N/A'}
          color={ltvCac !== null ? (ltvCac >= 3 ? 'positive' : ltvCac < 1 ? 'negative' : 'default') : 'default'}
          subtext={ltvCac !== null ? (ltvCac >= 3 ? 'Healthy' : ltvCac < 1 ? 'Unsustainable' : 'Below 3x target') : 'Not applicable'}
        />
      </div>
    </div>
  )
}

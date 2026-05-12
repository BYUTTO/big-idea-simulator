const SCENARIOS = [
  { id: 'pessimistic', label: 'Pessimistic', color: 'text-red-500' },
  { id: 'base', label: 'Base Case', color: 'text-slate-500' },
  { id: 'optimistic', label: 'Optimistic', color: 'text-emerald-600' },
]

function MultiplierSlider({ label, value, min, max, step, onChange, color }) {
  const pct = Math.round(value * 100)
  return (
    <div className="space-y-0.5">
      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-600">{label}</span>
        <span className={`text-xs font-mono font-semibold ${color}`}>{pct}% of base</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={pct}
        onChange={e => onChange(parseFloat(e.target.value) / 100)}
        className="w-full accent-indigo-600 cursor-pointer"
      />
    </div>
  )
}

export default function ScenarioToggle({ scenario, onChange, settings, onSettingsChange }) {
  const isAdjustable = scenario !== 'base'
  const current = settings[scenario]

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
        Scenario
      </p>
      <div className="flex rounded-lg border border-slate-200 overflow-hidden bg-white">
        {SCENARIOS.map(s => (
          <button
            key={s.id}
            onClick={() => onChange(s.id)}
            className={`flex-1 py-2 px-3 text-sm font-medium transition-all cursor-pointer ${
              scenario === s.id
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {scenario === 'base' && (
        <p className="text-xs text-slate-500">Your numbers exactly as entered — no adjustments applied.</p>
      )}

      {isAdjustable && current && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Adjust {scenario === 'pessimistic' ? 'Pessimistic' : 'Optimistic'} Assumptions
          </p>
          <MultiplierSlider
            label="Revenue drivers"
            value={current.revenue}
            min={10}
            max={250}
            step={5}
            onChange={v => onSettingsChange(scenario, 'revenue', v)}
            color={scenario === 'pessimistic' ? 'text-red-500' : 'text-emerald-600'}
          />
          <MultiplierSlider
            label="Cost drivers"
            value={current.costs}
            min={50}
            max={250}
            step={5}
            onChange={v => onSettingsChange(scenario, 'costs', v)}
            color={scenario === 'pessimistic' ? 'text-red-500' : 'text-emerald-600'}
          />
          <p className="text-xs text-slate-400">
            Revenue drivers include signups, growth rate, and starting volume.
            Cost drivers include fixed costs, CAC, and COGS.
          </p>
        </div>
      )}
    </div>
  )
}

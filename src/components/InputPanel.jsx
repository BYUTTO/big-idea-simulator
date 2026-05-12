import { useState, useEffect } from 'react'

function ToggleRow({ def, value, onChange }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-700 leading-tight">{def.label}</label>
      <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs font-medium">
        {def.options.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(def.key, opt.value)}
            className={`flex-1 px-3 py-1.5 cursor-pointer transition-colors ${
              value === opt.value
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 bg-white hover:bg-slate-50'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function InputRow({ def, value, onChange }) {
  const [textVal, setTextVal] = useState(String(value))

  // Keep text input in sync when slider or parent changes the value
  useEffect(() => {
    setTextVal(String(value))
  }, [value])

  const handleSlider = (e) => {
    const v = parseFloat(e.target.value)
    onChange(def.key, v)
  }

  const handleText = (e) => {
    setTextVal(e.target.value)
    const v = parseFloat(e.target.value)
    if (!isNaN(v) && v >= def.min && v <= def.max) {
      onChange(def.key, v)
    }
  }

  const handleBlur = () => {
    const v = parseFloat(textVal)
    if (isNaN(v)) {
      setTextVal(String(value))
    } else {
      const clamped = Math.min(def.max, Math.max(def.min, v))
      setTextVal(String(clamped))
      onChange(def.key, clamped)
    }
  }

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center gap-2">
        <label className="text-sm font-medium text-slate-700 flex-1 leading-tight">{def.label}</label>
        <input
          type="number"
          value={textVal}
          onChange={handleText}
          onBlur={handleBlur}
          step={def.step}
          className="w-20 text-sm font-mono font-semibold text-indigo-600 text-right border border-slate-200 rounded-md px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400"
        />
      </div>
      <input
        type="range"
        min={def.min}
        max={def.max}
        step={def.step}
        value={value}
        onChange={handleSlider}
        className="w-full accent-indigo-600 cursor-pointer"
      />
      {def.description && (
        <p className="text-xs text-slate-400">{def.description}</p>
      )}
    </div>
  )
}

export default function InputPanel({ inputDefs, inputs, onChange, hiddenKeys = [] }) {
  const visibleDefs = hiddenKeys.length > 0
    ? inputDefs.filter(def => !hiddenKeys.includes(def.key))
    : inputDefs
  return (
    <div className="space-y-5">
      {visibleDefs.map(def =>
        def.format === 'toggle' ? (
          <ToggleRow
            key={def.key}
            def={def}
            value={inputs[def.key] ?? def.options[0].value}
            onChange={onChange}
          />
        ) : (
          <InputRow
            key={def.key}
            def={def}
            value={inputs[def.key] ?? def.min}
            onChange={onChange}
          />
        )
      )}
    </div>
  )
}

import { useState } from 'react'

const UNIT_LABELS = {
  saas: 'per user/mo',
  ecommerce: 'per order',
  service: 'per client/mo',
  marketplace: 'per $1K GMV',
  website: 'per 1K sessions',
}

const TYPE_LABELS = {
  per_unit: 'Per Unit',
  pct_revenue: '% Revenue',
  fixed_monthly: 'Fixed/Mo',
  hourly: 'Hourly',
}

let nextId = 1

function newItem(name = '', amount = 0, type = 'per_unit') {
  return { id: nextId++, name, amount, type, hours: 0 }
}

function CostItem({ item, unitLabel, onChange, onRemove }) {
  const isHourly = item.type === 'hourly'

  return (
    <div className="flex gap-2 items-center">
      <input
        type="text"
        value={item.name}
        onChange={e => onChange(item.id, 'name', e.target.value)}
        placeholder="e.g. Packaging"
        className="flex-1 min-w-0 text-sm border border-slate-200 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400"
      />

      {isHourly ? (
        <div className="flex gap-1 items-center shrink-0">
          <input
            type="number"
            value={item.amount}
            min={0}
            step={0.01}
            onChange={e => onChange(item.id, 'amount', parseFloat(e.target.value) || 0)}
            className="w-14 text-sm font-mono font-semibold text-indigo-600 text-right border border-slate-200 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400"
          />
          <span className="text-xs text-slate-400 shrink-0">/hr ×</span>
          <input
            type="number"
            value={item.hours ?? 0}
            min={0}
            step={1}
            onChange={e => onChange(item.id, 'hours', parseFloat(e.target.value) || 0)}
            className="w-12 text-sm font-mono font-semibold text-indigo-600 text-right border border-slate-200 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400"
          />
          <span className="text-xs text-slate-400 shrink-0">hrs</span>
        </div>
      ) : (
        <input
          type="number"
          value={item.amount}
          min={0}
          step={0.01}
          onChange={e => onChange(item.id, 'amount', parseFloat(e.target.value) || 0)}
          className="w-20 text-sm font-mono font-semibold text-indigo-600 text-right border border-slate-200 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400"
        />
      )}

      <select
        value={item.type}
        onChange={e => onChange(item.id, 'type', e.target.value)}
        className="text-xs border border-slate-200 rounded-md px-1.5 py-1 text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-400 bg-white shrink-0"
      >
        {Object.entries(TYPE_LABELS).map(([val, label]) => (
          <option key={val} value={val}>{label}</option>
        ))}
      </select>
      <button
        onClick={() => onRemove(item.id)}
        className="text-slate-300 hover:text-red-400 transition-colors flex-shrink-0 cursor-pointer text-lg leading-none"
        aria-label="Remove item"
      >
        ×
      </button>
    </div>
  )
}

export default function CostBreakdown({ modelType, items, useItemized, onToggle, onItemsChange }) {
  const unitLabel = UNIT_LABELS[modelType] ?? 'per unit'

  const handleChange = (id, field, value) => {
    onItemsChange(items.map(item => item.id === id ? { ...item, [field]: value } : item))
  }

  const handleAdd = () => {
    onItemsChange([...items, newItem()])
  }

  const handleRemove = (id) => {
    onItemsChange(items.filter(item => item.id !== id))
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cost Breakdown</p>
        <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs font-medium">
          <button
            onClick={() => onToggle(false)}
            className={`px-3 py-1.5 cursor-pointer transition-colors ${!useItemized ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Simple
          </button>
          <button
            onClick={() => onToggle(true)}
            className={`px-3 py-1.5 cursor-pointer transition-colors ${useItemized ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Itemize
          </button>
        </div>
      </div>

      {useItemized && (
        <div className="space-y-3">
          {items.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-2">No cost items yet — add one below.</p>
          )}

          {items.map(item => (
            <CostItem
              key={item.id}
              item={item}
              unitLabel={unitLabel}
              onChange={handleChange}
              onRemove={handleRemove}
            />
          ))}

          <div className="text-xs text-slate-400 leading-relaxed pt-1">
            <span className="font-medium text-slate-500">Per Unit</span> = {unitLabel} &nbsp;·&nbsp;
            <span className="font-medium text-slate-500">% Revenue</span> = share of revenue &nbsp;·&nbsp;
            <span className="font-medium text-slate-500">Fixed/Mo</span> = flat monthly &nbsp;·&nbsp;
            <span className="font-medium text-slate-500">Hourly</span> = $/hr × hrs/mo
          </div>

          <button
            onClick={handleAdd}
            className="w-full text-sm text-indigo-600 font-medium border border-dashed border-indigo-300 rounded-lg py-2 hover:bg-indigo-50 transition-colors cursor-pointer"
          >
            + Add Cost Item
          </button>
        </div>
      )}

      {!useItemized && (
        <p className="text-xs text-slate-400">
          Using model defaults — switch to <span className="font-medium text-slate-500">Itemize</span> to build a custom cost structure.
        </p>
      )}
    </div>
  )
}

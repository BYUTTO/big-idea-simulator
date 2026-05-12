import { useState } from 'react'

export default function CollapsibleSection({ title, defaultOpen = true, children, badge }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-slate-50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-700">{title}</span>
          {badge && (
            <span className="text-xs font-medium bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-5 pb-5 pt-4 border-t border-slate-100 space-y-5">
          {children}
        </div>
      )}
    </div>
  )
}

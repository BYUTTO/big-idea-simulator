const CONFIGS = {
  leaderboard: { h: 'h-[90px]', label: 'Leaderboard · 728×90' },
  rectangle: { h: 'h-[250px]', label: 'Rectangle · 300×250' },
  skyscraper: { h: 'h-[600px]', label: 'Skyscraper · 160×600' },
  banner: { h: 'h-16', label: 'Banner · 468×60' },
}

export default function AdSlot({ size = 'rectangle', className = '' }) {
  const cfg = CONFIGS[size] || CONFIGS.rectangle
  return (
    <div
      className={`bg-slate-100 border border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 gap-1 flex-shrink-0 w-full ${cfg.h} ${className}`}
    >
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">Ad</span>
    </div>
  )
}

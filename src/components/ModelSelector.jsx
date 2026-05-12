import * as saas from '../models/saas'
import * as ecommerce from '../models/ecommerce'
import * as service from '../models/service'
import * as marketplace from '../models/marketplace'
import * as website from '../models/website'

const MODELS = [
  { id: 'saas', ...saas },
  { id: 'ecommerce', ...ecommerce },
  { id: 'service', ...service },
  { id: 'marketplace', ...marketplace },
  { id: 'website', ...website },
]

export default function ModelSelector({ modelType, onChange }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
        Business Model
      </p>
      <div className="grid grid-cols-2 gap-2">
        {MODELS.map((model, i) => (
          <button
            key={model.id}
            onClick={() => onChange(model.id)}
            className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
              MODELS.length % 2 !== 0 && i === MODELS.length - 1 ? 'col-span-2' : ''
            } ${
              modelType === model.id
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
            }`}
          >
            <div className="font-semibold text-sm">{model.name}</div>
            <div className="text-xs text-slate-500 mt-0.5 leading-tight">{model.description}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

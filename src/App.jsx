import { Component, useState, useEffect, useCallback } from 'react'
import ModelSelector from './components/ModelSelector'
import InputPanel from './components/InputPanel'
import CollapsibleSection from './components/CollapsibleSection'
import ScenarioToggle from './components/ScenarioToggle'
import OutputDashboard from './components/OutputDashboard'
import RevenueChart from './components/RevenueChart'
import MonthlyTable from './components/MonthlyTable'
import AdSlot from './components/AdSlot'
import CostBreakdown from './components/CostBreakdown'
import { calculateProjections, DEFAULT_SCENARIO_MULTIPLIERS } from './utils/projections'
import { encodeState, decodeState } from './utils/urlState'
import * as saasModel from './models/saas'
import * as ecommerceModel from './models/ecommerce'
import * as serviceModel from './models/service'
import * as marketplaceModel from './models/marketplace'
import * as websiteModel from './models/website'

const MODELS = {
  saas: saasModel,
  ecommerce: ecommerceModel,
  service: serviceModel,
  marketplace: marketplaceModel,
  website: websiteModel,
}

const DEFAULT_MODEL = 'saas'
const DEFAULT_SCENARIO = 'base'
const DEFAULT_SETTINGS = {
  pessimistic: { ...DEFAULT_SCENARIO_MULTIPLIERS.pessimistic },
  optimistic: { ...DEFAULT_SCENARIO_MULTIPLIERS.optimistic },
}

// Input keys to hide when itemized cost mode is active, per model
const COGS_KEYS = {
  saas: ['cogsPercent'],
  ecommerce: ['cogsPercent', 'fulfillmentPerOrder'],
  service: ['deliveryCostPercent'],
  marketplace: [],
  website: ['hostingCost', 'contentCost', 'fixedCosts'],
}

class ChartErrorBoundary extends Component {
  state = { error: false }
  static getDerivedStateFromError() { return { error: true } }
  componentDidCatch() { this.setState({ error: true }) }
  render() {
    if (this.state.error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm text-center">
          Chart unavailable — try adjusting your inputs.
          <button className="ml-2 underline cursor-pointer" onClick={() => this.setState({ error: false })}>
            Retry
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default function App() {
  const [modelType, setModelType] = useState(DEFAULT_MODEL)
  const [inputs, setInputs] = useState(MODELS[DEFAULT_MODEL].defaultInputs)
  const [scenario, setScenario] = useState(DEFAULT_SCENARIO)
  const [scenarioSettings, setScenarioSettings] = useState(DEFAULT_SETTINGS)
  const [compareAll, setCompareAll] = useState(false)
  const [copied, setCopied] = useState(false)
  const [useItemizedCosts, setUseItemizedCosts] = useState(false)
  const [costItems, setCostItems] = useState([])
  const [numMonths, setNumMonths] = useState(12)
  const [startingCapital, setStartingCapital] = useState(0)

  useEffect(() => {
    const state = decodeState(MODELS, DEFAULT_MODEL, DEFAULT_SCENARIO)
    setModelType(state.modelType)
    setInputs(state.inputs)
    setScenario(state.scenario)
  }, [])

  useEffect(() => {
    encodeState(modelType, inputs, scenario)
  }, [modelType, inputs, scenario])

  const handleModelChange = useCallback((newModel) => {
    setModelType(newModel)
    setInputs(MODELS[newModel].defaultInputs)
    setUseItemizedCosts(false)
    setCostItems([])
  }, [])

  const handleInputChange = useCallback((key, value) => {
    setInputs(prev => ({ ...prev, [key]: value }))
  }, [])

  const handleSettingsChange = useCallback((scenarioId, lever, value) => {
    setScenarioSettings(prev => ({
      ...prev,
      [scenarioId]: { ...prev[scenarioId], [lever]: value },
    }))
  }, [])

  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  const currentModel = MODELS[modelType]

  const revenueInputDefs = currentModel.inputDefs.filter(d => d.group === 'revenue')
  const costInputDefs = currentModel.inputDefs.filter(d => d.group === 'cost')

  const growthHiddenKeys =
    modelType === 'saas'
      ? (inputs.growthMode === 'percent' ? ['newSignupsPerMonth'] : ['userGrowthRate'])
      : modelType === 'service'
        ? (inputs.growthMode === 'percent' ? ['newClientsPerMonth'] : ['clientGrowthRate'])
        : []

  const effectiveHiddenKeys = [
    ...(useItemizedCosts ? (COGS_KEYS[modelType] ?? []) : []),
    ...growthHiddenKeys,
  ]

  const effectiveMultipliers = {
    pessimistic: scenarioSettings.pessimistic,
    optimistic: scenarioSettings.optimistic,
  }
  const activeCostItems = useItemizedCosts ? costItems : []

  const { months, summary: rawSummary } = calculateProjections(modelType, inputs, scenario, effectiveMultipliers, activeCostItems, numMonths)

  const runwayMonth = startingCapital > 0
    ? (months.find(m => startingCapital + m.cumulativeProfit < 0)?.month ?? null)
    : null
  const summary = { ...rawSummary, runwayMonth, startingCapital }

  const compareMonths = compareAll ? {
    pessimistic: calculateProjections(modelType, inputs, 'pessimistic', effectiveMultipliers, activeCostItems, numMonths).months,
    base: calculateProjections(modelType, inputs, 'base', effectiveMultipliers, activeCostItems, numMonths).months,
    optimistic: calculateProjections(modelType, inputs, 'optimistic', effectiveMultipliers, activeCostItems, numMonths).months,
  } : null

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-tight">Big Idea Simulator</h1>
            <p className="text-sm text-slate-500">Model your business before you build it</p>
          </div>
          <button
            onClick={handleShare}
            className="text-sm font-medium px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {copied ? 'Copied!' : 'Share Model'}
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 pt-4">
        <AdSlot size="leaderboard" />
      </div>

      <div className="flex gap-3 px-3 py-4 items-start justify-center">
        <div className="hidden xl:block w-[160px] flex-shrink-0 sticky top-4">
          <AdSlot size="skyscraper" />
        </div>

        <div className="flex-1 min-w-0 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-5 items-start">
            <div className="space-y-3 lg:sticky lg:top-4 lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto lg:pb-2">
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <ModelSelector modelType={modelType} onChange={handleModelChange} />
              </div>

              <CollapsibleSection title="Revenue" defaultOpen={true}>
                <InputPanel
                  inputDefs={revenueInputDefs}
                  inputs={inputs}
                  onChange={handleInputChange}
                  hiddenKeys={effectiveHiddenKeys}
                />
              </CollapsibleSection>

              <CollapsibleSection title="Costs" defaultOpen={false}>
                <div className="space-y-1">
                  <div className="flex justify-between items-center gap-2">
                    <label className="text-sm font-medium text-slate-700 flex-1 leading-tight">Starting Capital</label>
                    <input
                      type="number"
                      min="0"
                      value={startingCapital || ''}
                      placeholder="0"
                      onChange={e => setStartingCapital(Math.max(0, Number(e.target.value) || 0))}
                      className="w-24 text-sm font-mono font-semibold text-indigo-600 text-right border border-slate-200 rounded-md px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400"
                    />
                  </div>
                  <p className="text-xs text-slate-400">Cash on hand at launch — calculates runway</p>
                </div>
                <hr className="border-slate-100" />
                <InputPanel
                  inputDefs={costInputDefs}
                  inputs={inputs}
                  onChange={handleInputChange}
                  hiddenKeys={effectiveHiddenKeys}
                />
                <CostBreakdown
                  modelType={modelType}
                  items={costItems}
                  useItemized={useItemizedCosts}
                  onToggle={setUseItemizedCosts}
                  onItemsChange={setCostItems}
                />
              </CollapsibleSection>

              <AdSlot size="rectangle" />
            </div>

            <div className="space-y-4">
              <ScenarioToggle
                scenario={scenario}
                onChange={setScenario}
                settings={scenarioSettings}
                onSettingsChange={handleSettingsChange}
              />
              <OutputDashboard summary={summary} numMonths={numMonths} />
              <AdSlot size="banner" />
              <ChartErrorBoundary>
                <RevenueChart
                  months={months}
                  compareAll={compareAll}
                  onToggleCompare={() => setCompareAll(v => !v)}
                  compareMonths={compareMonths}
                  numMonths={numMonths}
                  onNumMonthsChange={setNumMonths}
                />
              </ChartErrorBoundary>
              <MonthlyTable months={months} modelType={modelType} />
              <AdSlot size="rectangle" />
            </div>
          </div>
        </div>

        <div className="hidden xl:block w-[160px] flex-shrink-0 sticky top-4">
          <AdSlot size="skyscraper" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-4">
        <AdSlot size="leaderboard" />
      </div>

      <footer className="text-center text-xs text-slate-400 py-6">
        Big Idea Simulator — projections are estimates, not financial advice
      </footer>
    </div>
  )
}

# Big Idea Simulator

**Purpose:** Browser-based financial projection tool for early-stage founders — models 5 business types with 12–36 month projections, scenario toggles, and shareable URLs.

**Live:** https://big-idea-simulator.vercel.app
**Repo:** https://github.com/BYUTTO/big-idea-simulator

## Repo Map

- `src/App.jsx` — root state and layout; owns modelType, inputs, scenario, numMonths, startingCapital, costItems
- `src/components/` — all UI components (see README for full list)
- `src/models/` — one file per business model; each exports defaultInputs + inputDefs
- `src/utils/projections.js` — core projection engine; `calculateProjections()` is the main export
- `src/utils/urlState.js` — encodes/decodes full app state into URL query params
- `src/utils/format.js` — formatCurrency, formatPercent, formatMultiple

## Rules

- Planning-first. Never build without explicit go-ahead.
- No backend, no auth, no API keys — keep it pure client-side.
- Prefer simple, minimal solutions. Don't over-engineer.
- Never say "done" unless the action actually happened.
- Deploy via `vercel --prod --yes` from the project root.

## Architecture Notes

- `inputDefs` in each model file carry `group: 'revenue' | 'cost'` — used by App.jsx to split inputs into two accordion sections
- `calculateProjections(modelType, inputs, scenario, multipliers, costItems, numMonths)` returns `{ months, summary }`
- Scenario scaling happens in `applyScenario()` — only keys listed in `REVENUE_LEVERS` and `COST_LEVERS` get multiplied; string inputs like `growthMode` must NOT be in those arrays
- `runwayMonth` is computed in App.jsx (not inside projections.js) since `startingCapital` is app-level state
- URL state encoding is in `urlState.js` — model switches reset inputs to model defaults, not URL state
- `CostBreakdown` uses a module-level `nextId` counter that resets on HMR — causes harmless duplicate key warnings in dev only

## Sharp Edges

- `src/utils/projections.js` — core math; test any change against all 5 models before deploying
- `src/utils/urlState.js` — changing input key names or model IDs will break existing shared URLs
- `growthMode` is a string stored in `inputs` — do NOT add it to `REVENUE_LEVERS` or `COST_LEVERS` in projections.js or scenario scaling will try to multiply a string

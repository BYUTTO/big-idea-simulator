# Big Idea Simulator

Model the financial viability of a business idea in under 2 minutes — no spreadsheet required.

**Live demo:** https://big-idea-simulator.vercel.app

---

## What it does

Pick a business model, dial in your assumptions, and instantly see 12–36 month projections across pessimistic, base, and optimistic scenarios. No login, no install — runs entirely in the browser.

**Supported business models:**
- SaaS (subscription software)
- E-commerce (product sales)
- Service / Agency (consulting, retainer)
- Marketplace (take-rate on GMV)
- Ad-Supported Website (CPM-based display ads)

**Key features:**
- 3-scenario toggle (pessimistic / base / optimistic) with customizable multipliers
- 12 / 24 / 36 month projection range
- Itemized cost builder (per-unit, % revenue, fixed monthly, hourly)
- Runway calculator — enter starting capital, see when cash hits zero
- Break-even tracking — both monthly cash-flow positive and cumulative payback
- Monthly data table with CSV export
- Shareable URLs (full model state encoded in the URL)
- Growth mode toggle — fixed adds/month or % monthly growth (SaaS + Service)

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Hosting | Vercel (static SPA — no backend) |

No database, no auth, no API keys. Pure client-side.

---

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:5173.

```bash
npm run build    # production build → dist/
npm run preview  # preview production build locally
```

---

## Project structure

```
src/
  App.jsx                  # root state, layout
  components/
    ModelSelector.jsx      # business model picker
    InputPanel.jsx         # slider + toggle input rows
    CollapsibleSection.jsx # accordion wrapper for left panel
    ScenarioToggle.jsx     # pessimistic / base / optimistic selector
    OutputDashboard.jsx    # KPI metric cards
    RevenueChart.jsx       # Recharts line chart + scenario compare
    MonthlyTable.jsx       # M1–M36 data table + CSV export
    CostBreakdown.jsx      # itemized cost builder
    AdSlot.jsx             # ad placement layout markers
  models/
    saas.js                # defaultInputs + inputDefs
    ecommerce.js
    service.js
    marketplace.js
    website.js
  utils/
    projections.js         # core projection engine + scenario scaling
    format.js              # currency / percent / multiple formatters
    urlState.js            # encode/decode model state in URL
```

---

## Adding a new business model

1. Create `src/models/yourmodel.js` — export `name`, `description`, `defaultInputs`, `inputDefs` (with `group: 'revenue' | 'cost'` on each def)
2. Add a `projectYourModel()` function in `src/utils/projections.js`
3. Register it in the `MODELS` object and `switch` in `App.jsx` and `projections.js`
4. Add a `COGS_KEYS` entry in `App.jsx` for itemized cost mode

---

Built at BYU Technology Transfer Office.

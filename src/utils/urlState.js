export function encodeState(modelType, inputs, scenario) {
  const params = new URLSearchParams()
  params.set('m', modelType)
  params.set('s', scenario)
  Object.entries(inputs).forEach(([k, v]) => params.set(k, String(v)))
  window.history.replaceState({}, '', `?${params}`)
}

export function decodeState(models, defaultModelType, defaultScenario) {
  const params = new URLSearchParams(window.location.search)
  const modelType = params.get('m') in models ? params.get('m') : defaultModelType
  const scenario = ['pessimistic', 'base', 'optimistic'].includes(params.get('s'))
    ? params.get('s')
    : defaultScenario
  const model = models[modelType]
  const inputs = { ...model.defaultInputs }
  model.inputDefs.forEach(({ key }) => {
    if (params.has(key)) {
      const val = parseFloat(params.get(key))
      if (!isNaN(val)) inputs[key] = val
    }
  })
  return { modelType, inputs, scenario }
}

import { useState } from 'react'
import { WizardLayout } from '../components/ui/WizardLayout'
import { Button } from '../components/ui/Button'
import { SelectableTile } from '../components/ui/SelectableTile'
import { RUNTIME_OPTIONS } from '../data/runtime.config'
import { useSession, WIZARD_STEP_ORDER } from '../state/SessionContext'

export function SelectRuntimeScreen() {
  const { state, dispatch } = useSession()
  const [runtimeFilter, setRuntimeFilter] = useState(state.runtimeFilter ?? 'any')

  return (
    <WizardLayout
      title="How much time do you have?"
      subtitle="Optional — defaults to any length"
      step={WIZARD_STEP_ORDER.indexOf('runtime')}
      totalSteps={WIZARD_STEP_ORDER.length - 1}
      onBack={() => dispatch({ type: 'GO_TO_STEP', step: 'language' })}
      footer={<Button onClick={() => dispatch({ type: 'SET_RUNTIME', runtimeFilter })}>Continue</Button>}
    >
      <div className="flex flex-col gap-3">
        {RUNTIME_OPTIONS.map((option) => (
          <SelectableTile
            key={option.value}
            label={option.label}
            selected={runtimeFilter === option.value}
            onClick={() => setRuntimeFilter(option.value)}
          />
        ))}
      </div>
    </WizardLayout>
  )
}

import { useState } from 'react'
import { WizardLayout } from '../components/ui/WizardLayout'
import { Button } from '../components/ui/Button'
import { SelectableTile } from '../components/ui/SelectableTile'
import { LANGUAGE_OPTIONS } from '../data/languages.config'
import { useSession, WIZARD_STEP_ORDER } from '../state/SessionContext'
import type { LanguageCode } from '../types/family'

export function SelectLanguageScreen() {
  const { state, dispatch } = useSession()
  const [languagePriority, setLanguagePriority] = useState(state.languagePriority)

  return (
    <WizardLayout
      title="Which language?"
      step={WIZARD_STEP_ORDER.indexOf('language')}
      totalSteps={WIZARD_STEP_ORDER.length - 1}
      onBack={() => dispatch({ type: 'GO_TO_STEP', step: 'mood' })}
      footer={
        <Button
          disabled={!languagePriority}
          onClick={() => languagePriority && dispatch({ type: 'SET_LANGUAGE', languagePriority })}
        >
          Continue
        </Button>
      }
    >
      <div className="flex flex-col gap-3">
        {LANGUAGE_OPTIONS.map((option) => (
          <SelectableTile
            key={option.code}
            label={option.label}
            selected={languagePriority === option.code}
            onClick={() => setLanguagePriority(option.code as LanguageCode | 'any')}
          />
        ))}
      </div>
    </WizardLayout>
  )
}

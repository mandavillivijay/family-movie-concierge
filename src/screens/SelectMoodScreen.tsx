import { useState } from 'react'
import { WizardLayout } from '../components/ui/WizardLayout'
import { Button } from '../components/ui/Button'
import { SelectableTile } from '../components/ui/SelectableTile'
import { getMoodOptions } from '../data/moods.config'
import { useFamilyMembers } from '../hooks/useFamilyMembers'
import { useSession, WIZARD_STEP_ORDER } from '../state/SessionContext'

export function SelectMoodScreen() {
  const { state, dispatch } = useSession()
  const { members } = useFamilyMembers()
  const [moodId, setMoodId] = useState(state.moodId)

  const participants = members.filter((member) => state.participantIds.includes(member.id))
  const hasChild = participants.some((member) => member.isChild)
  const moods = getMoodOptions(hasChild)

  return (
    <WizardLayout
      title="What's the mood tonight?"
      step={WIZARD_STEP_ORDER.indexOf('mood')}
      totalSteps={WIZARD_STEP_ORDER.length - 1}
      onBack={() => dispatch({ type: 'GO_TO_STEP', step: 'family' })}
      footer={
        <Button disabled={!moodId} onClick={() => moodId && dispatch({ type: 'SET_MOOD', moodId })}>
          Continue
        </Button>
      }
    >
      <div className="grid grid-cols-2 gap-3">
        {moods.map((mood) => (
          <SelectableTile
            key={mood.id}
            label={mood.label}
            selected={moodId === mood.id}
            onClick={() => setMoodId(mood.id)}
          />
        ))}
      </div>
    </WizardLayout>
  )
}

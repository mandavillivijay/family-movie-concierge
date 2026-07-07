import { useState } from 'react'
import { WizardLayout } from '../components/ui/WizardLayout'
import { Button } from '../components/ui/Button'
import { SelectableTile } from '../components/ui/SelectableTile'
import { FamilyMemberEditorScreen } from './FamilyMemberEditorScreen'
import { useFamilyMembers } from '../hooks/useFamilyMembers'
import { useSession, WIZARD_STEP_ORDER } from '../state/SessionContext'

export function SelectFamilyScreen() {
  const { members, loading, addMember } = useFamilyMembers()
  const { state, dispatch } = useSession()
  const [selected, setSelected] = useState<string[]>(state.participantIds)
  const [showAddForm, setShowAddForm] = useState(false)

  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((memberId) => memberId !== id) : [...prev, id]))
  }

  if (!loading && (showAddForm || members.length === 0)) {
    return (
      <FamilyMemberEditorScreen
        onCancel={members.length > 0 ? () => setShowAddForm(false) : undefined}
        onSave={async (data) => {
          const member = await addMember(data)
          setSelected((prev) => [...prev, member.id])
          setShowAddForm(false)
        }}
      />
    )
  }

  return (
    <WizardLayout
      title="Who's watching?"
      step={WIZARD_STEP_ORDER.indexOf('family')}
      totalSteps={WIZARD_STEP_ORDER.length - 1}
      footer={
        <Button
          disabled={selected.length === 0}
          onClick={() => dispatch({ type: 'SET_PARTICIPANTS', participantIds: selected })}
        >
          Continue
        </Button>
      }
    >
      <div className="flex flex-col gap-3">
        {members.map((member) => (
          <SelectableTile
            key={member.id}
            label={member.name}
            sublabel={`Age ${member.age}`}
            selected={selected.includes(member.id)}
            onClick={() => toggle(member.id)}
          />
        ))}
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="min-h-14 rounded-2xl border-2 border-dashed border-slate-700 text-slate-400 active:bg-slate-900"
        >
          + Add someone
        </button>
      </div>
    </WizardLayout>
  )
}

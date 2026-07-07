import { useEffect } from 'react'
import { WizardLayout } from '../components/ui/WizardLayout'
import { Button } from '../components/ui/Button'
import { MovieCard } from '../components/MovieCard'
import { useSession, WIZARD_STEP_ORDER } from '../state/SessionContext'
import { useFamilyMembers } from '../hooks/useFamilyMembers'
import { useRecommendations } from '../hooks/useRecommendations'
import { findMood } from '../data/moods.config'
import { describeRelaxedSteps } from './relaxationMessage'

export function RecommendationsScreen() {
  const { state, dispatch } = useSession()
  const { members, loading: membersLoading } = useFamilyMembers()
  const { recommended, relaxedSteps, loading, generate } = useRecommendations()

  const participants = members.filter((member) => state.participantIds.includes(member.id))
  const hasChild = participants.some((member) => member.isChild)
  const moodLabel = findMood(state.moodId ?? '', hasChild)?.label ?? 'that mood'

  useEffect(() => {
    if (membersLoading || !state.moodId || !state.languagePriority || !state.runtimeFilter) {
      return
    }
    if (participants.length === 0) return

    generate({
      participants,
      moodId: state.moodId,
      languagePriority: state.languagePriority,
      runtimeFilter: state.runtimeFilter,
    })
    // participants is derived from members + state.participantIds, both of
    // which are already deps below — including the derived array itself
    // would just re-add the same identity-changes-every-render problem.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [membersLoading, members, state.participantIds, state.moodId, state.languagePriority, state.runtimeFilter, generate])

  return (
    <WizardLayout
      title="Tonight's picks"
      subtitle={describeRelaxedSteps(relaxedSteps, moodLabel)}
      step={WIZARD_STEP_ORDER.indexOf('recommendations')}
      totalSteps={WIZARD_STEP_ORDER.length - 1}
      onBack={() => dispatch({ type: 'GO_TO_STEP', step: 'runtime' })}
      footer={
        <Button
          disabled={loading || recommended.length === 0}
          onClick={() => {
            dispatch({
              type: 'SET_RECOMMENDATIONS',
              recommendations: recommended.map((entry) => entry.movie),
              relaxedSteps,
            })
            dispatch({ type: 'GO_TO_STEP', step: 'spinner' })
          }}
        >
          Spin the Wheel
        </Button>
      }
    >
      {loading ? (
        <p className="mt-8 text-center text-slate-400">Finding great picks...</p>
      ) : (
        <div className="flex flex-col gap-3">
          {recommended.map(({ movie, explanation }) => (
            <MovieCard key={movie.id} movie={movie} explanation={explanation} />
          ))}
          {recommended.length === 0 ? (
            <p className="mt-8 text-center text-slate-400">
              No movies match yet — go back and try a different mood or language.
            </p>
          ) : null}
        </div>
      )}
    </WizardLayout>
  )
}

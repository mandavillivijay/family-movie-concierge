import { Button } from '../components/ui/Button'
import { useSession } from '../state/SessionContext'

/** Placeholder — replaced with the real spinner wheel + MovieNight persistence in the next phase. */
export function SpinnerScreen() {
  const { state, dispatch } = useSession()

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-md flex-col items-center justify-center gap-6 px-5 text-center">
      <h1 className="text-2xl font-semibold text-slate-50">Spinner coming next</h1>
      <p className="text-slate-400">
        {state.recommendations.length} movies are ready to spin — this screen lands in the next build phase.
      </p>
      <Button variant="secondary" onClick={() => dispatch({ type: 'RESET' })}>
        Start Over
      </Button>
    </div>
  )
}

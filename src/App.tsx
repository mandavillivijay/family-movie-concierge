import { SessionProvider, useSession } from './state/SessionContext'
import { SelectFamilyScreen } from './screens/SelectFamilyScreen'
import { SelectMoodScreen } from './screens/SelectMoodScreen'
import { SelectLanguageScreen } from './screens/SelectLanguageScreen'
import { SelectRuntimeScreen } from './screens/SelectRuntimeScreen'
import { RecommendationsScreen } from './screens/RecommendationsScreen'
import { SpinnerScreen } from './screens/SpinnerScreen'
import { FeedbackScreen } from './screens/FeedbackScreen'
import { usePendingFeedback } from './hooks/usePendingFeedback'

function Wizard() {
  const { state } = useSession()

  switch (state.step) {
    case 'family':
      return <SelectFamilyScreen />
    case 'mood':
      return <SelectMoodScreen />
    case 'language':
      return <SelectLanguageScreen />
    case 'runtime':
      return <SelectRuntimeScreen />
    case 'recommendations':
      return <RecommendationsScreen />
    case 'spinner':
      return <SpinnerScreen />
  }
}

function AppShell() {
  const { pending, loading, refresh } = usePendingFeedback()

  if (loading) return null
  if (pending.length > 0) {
    return <FeedbackScreen key={pending[0].id} movieNight={pending[0]} onDone={refresh} />
  }
  return <Wizard />
}

function App() {
  return (
    <SessionProvider>
      <AppShell />
    </SessionProvider>
  )
}

export default App

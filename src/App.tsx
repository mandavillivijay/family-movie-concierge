import { SessionProvider, useSession } from './state/SessionContext'
import { SelectFamilyScreen } from './screens/SelectFamilyScreen'
import { SelectMoodScreen } from './screens/SelectMoodScreen'
import { SelectLanguageScreen } from './screens/SelectLanguageScreen'
import { SelectRuntimeScreen } from './screens/SelectRuntimeScreen'
import { RecommendationsScreen } from './screens/RecommendationsScreen'
import { SpinnerScreen } from './screens/SpinnerScreen'

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

function App() {
  return (
    <SessionProvider>
      <Wizard />
    </SessionProvider>
  )
}

export default App

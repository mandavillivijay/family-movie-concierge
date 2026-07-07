import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react'
import type { LanguageCode, RuntimePreference } from '../types/family'
import type { Movie } from '../types/movie'

export type WizardStep = 'family' | 'mood' | 'language' | 'runtime' | 'recommendations' | 'spinner'

// eslint-disable-next-line react-refresh/only-export-components -- constant shared alongside the Provider/hook in this context module
export const WIZARD_STEP_ORDER: WizardStep[] = [
  'family',
  'mood',
  'language',
  'runtime',
  'recommendations',
  'spinner',
]

export interface WizardState {
  step: WizardStep
  participantIds: string[]
  moodId?: string
  languagePriority?: LanguageCode | 'any'
  runtimeFilter?: RuntimePreference
  recommendations: Movie[]
  relaxedSteps: string[]
  winner?: Movie
}

const INITIAL_STATE: WizardState = {
  step: 'family',
  participantIds: [],
  recommendations: [],
  relaxedSteps: [],
}

export type WizardAction =
  | { type: 'SET_PARTICIPANTS'; participantIds: string[] }
  | { type: 'SET_MOOD'; moodId: string }
  | { type: 'SET_LANGUAGE'; languagePriority: LanguageCode | 'any' }
  | { type: 'SET_RUNTIME'; runtimeFilter: RuntimePreference }
  | { type: 'SET_RECOMMENDATIONS'; recommendations: Movie[]; relaxedSteps: string[] }
  | { type: 'SET_WINNER'; winner: Movie }
  | { type: 'GO_TO_STEP'; step: WizardStep }
  | { type: 'RESET' }

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SET_PARTICIPANTS':
      return { ...state, participantIds: action.participantIds, step: 'mood' }
    case 'SET_MOOD':
      return { ...state, moodId: action.moodId, step: 'language' }
    case 'SET_LANGUAGE':
      return { ...state, languagePriority: action.languagePriority, step: 'runtime' }
    case 'SET_RUNTIME':
      return { ...state, runtimeFilter: action.runtimeFilter, step: 'recommendations' }
    case 'SET_RECOMMENDATIONS':
      return { ...state, recommendations: action.recommendations, relaxedSteps: action.relaxedSteps }
    case 'SET_WINNER':
      return { ...state, winner: action.winner }
    case 'GO_TO_STEP':
      return { ...state, step: action.step }
    case 'RESET':
      return INITIAL_STATE
    default:
      return state
  }
}

const SessionContext = createContext<
  { state: WizardState; dispatch: Dispatch<WizardAction> } | undefined
>(undefined)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wizardReducer, INITIAL_STATE)
  return <SessionContext.Provider value={{ state, dispatch }}>{children}</SessionContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- hook shared alongside the Provider in this context module
export function useSession() {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return context
}

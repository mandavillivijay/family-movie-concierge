import type { LanguageCode, RuntimePreference } from './family'

export type FeedbackStatus = 'pending' | 'completed' | 'skipped'

export interface MovieNight {
  id: string
  date: string
  participantIds: string[]
  mood: string
  languagePriority: LanguageCode | 'any'
  runtimeFilter: RuntimePreference
  candidateMovieIds: string[]
  winnerMovieId: string
  platformOpened?: string
  feedbackStatus: FeedbackStatus
}

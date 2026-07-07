import type { FamilyMember, LanguageCode, RuntimePreference } from '../types/family'
import type { Movie } from '../types/movie'
import type { MovieNight } from '../types/movieNight'

export interface RecommendationInput {
  catalog: Movie[]
  participants: FamilyMember[]
  moodId: string
  languagePriority: LanguageCode | 'any'
  runtimeFilter: RuntimePreference
  history: MovieNight[]
  subscribedPlatforms: string[]
}

export interface RankedMovie extends Movie {
  score: number
}

export type RelaxableStage = 'runtime' | 'mood' | 'language'

export interface PipelineResult {
  top3: Movie[]
  relaxedSteps: RelaxableStage[]
}

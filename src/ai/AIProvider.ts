import type { FamilyMember } from '../types/family'
import type { Movie } from '../types/movie'

export interface RecommendationContext {
  participants: FamilyMember[]
  moodLabel: string
}

export interface ParsedPreferenceUpdate {
  memberId: string
  theme: string
  delta: number
}

export interface FeedbackParseContext {
  movie: Movie
  participants: FamilyMember[]
}

export interface ParsedFeedbackResult {
  updates: ParsedPreferenceUpdate[]
}

/**
 * AI is a supplementary explanation/parsing layer, never a source of truth
 * (see the PRD's "AI as a recommendation layer, not a database" principle).
 * Every implementation, including NullAIProvider, must be safe to use with
 * no configured key.
 */
export interface AIProvider {
  explainRecommendation(movie: Movie, context: RecommendationContext): Promise<string>
  parseFeedback(freeText: string, context: FeedbackParseContext): Promise<ParsedFeedbackResult>
}

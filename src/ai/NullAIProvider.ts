import type {
  AIProvider,
  FeedbackParseContext,
  ParsedFeedbackResult,
  RecommendationContext,
} from './AIProvider'
import type { Movie } from '../types/movie'

/** Deterministic, templated fallback — the app must stay fully usable with no AI configured. */
export class NullAIProvider implements AIProvider {
  async explainRecommendation(movie: Movie, context: RecommendationContext): Promise<string> {
    const themes = movie.themes.slice(0, 2).join(' + ')
    const moodLabel = context.moodLabel.toLowerCase()
    return themes ? `A ${themes} pick for ${moodLabel} night.` : `A solid pick for ${moodLabel} night.`
  }

  async parseFeedback(_freeText: string, _context: FeedbackParseContext): Promise<ParsedFeedbackResult> {
    return { updates: [] }
  }
}

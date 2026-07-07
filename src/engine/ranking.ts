import type { FamilyMember } from '../types/family'
import type { Movie } from '../types/movie'
import type { MovieNight } from '../types/movieNight'
import type { RankedMovie } from './types'

const RECENCY_WINDOW = 5
const RECENCY_PENALTY_PER_STEP = 2

function scoreThemeMatch(movie: Movie, participants: FamilyMember[]): number {
  return participants.reduce((total, member) => {
    const memberScore = movie.themes.reduce((sum, theme) => sum + (member.themeWeights[theme] ?? 0), 0)
    return total + memberScore
  }, 0)
}

/** Recently-won movies are penalized so the same picks don't resurface every night. */
function buildRecencyPenalties(history: MovieNight[]): Map<string, number> {
  const mostRecentFirst = [...history].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
  const penalties = new Map<string, number>()
  mostRecentFirst.slice(0, RECENCY_WINDOW).forEach((night, index) => {
    const penalty = RECENCY_PENALTY_PER_STEP * (RECENCY_WINDOW - index)
    penalties.set(night.winnerMovieId, (penalties.get(night.winnerMovieId) ?? 0) + penalty)
  })
  return penalties
}

export function rankByPreference(
  movies: Movie[],
  participants: FamilyMember[],
  history: MovieNight[],
): RankedMovie[] {
  const recencyPenalties = buildRecencyPenalties(history)
  return movies
    .map((movie) => ({
      ...movie,
      score: scoreThemeMatch(movie, participants) - (recencyPenalties.get(movie.id) ?? 0),
    }))
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
}

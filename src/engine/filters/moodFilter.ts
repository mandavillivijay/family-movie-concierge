import type { Movie } from '../../types/movie'
import { SURPRISE_MOOD_ID } from '../../data/moods.config'

export function moodFilter(movies: Movie[], moodId: string): Movie[] {
  if (moodId === SURPRISE_MOOD_ID) return movies
  return movies.filter((movie) => movie.moodTags.includes(moodId))
}

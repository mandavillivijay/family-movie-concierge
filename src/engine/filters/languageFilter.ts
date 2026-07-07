import type { LanguageCode } from '../../types/family'
import type { Movie } from '../../types/movie'

export function languageFilter(movies: Movie[], languagePriority: LanguageCode | 'any'): Movie[] {
  if (languagePriority === 'any') return movies
  return movies.filter((movie) => movie.language === languagePriority)
}

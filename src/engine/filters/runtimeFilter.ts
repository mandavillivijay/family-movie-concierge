import type { RuntimePreference } from '../../types/family'
import type { Movie } from '../../types/movie'

export function runtimeFilter(movies: Movie[], runtimeBucket: RuntimePreference): Movie[] {
  switch (runtimeBucket) {
    case 'any':
      return movies
    case 'lt90':
      return movies.filter((movie) => movie.runtimeMinutes < 90)
    case '90to150':
      return movies.filter((movie) => movie.runtimeMinutes >= 90 && movie.runtimeMinutes <= 150)
    case '150plus':
      return movies.filter((movie) => movie.runtimeMinutes > 150)
  }
}

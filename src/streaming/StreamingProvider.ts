import type { Movie } from '../types/movie'

export interface StreamingProvider {
  /** Builds the best available URL to open for watching this movie on the given platform. */
  buildWatchUrl(movie: Movie, platformId: string): string
}

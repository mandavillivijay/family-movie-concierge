import type { Movie } from '../../types/movie'

/** An empty subscribedPlatforms list means "no restriction configured yet" — passthrough. */
export function platformFilter(movies: Movie[], subscribedPlatforms: string[]): Movie[] {
  if (subscribedPlatforms.length === 0) return movies
  const subscribed = new Set(subscribedPlatforms)
  return movies.filter((movie) =>
    movie.platformAvailability.some((availability) => subscribed.has(availability.platform)),
  )
}

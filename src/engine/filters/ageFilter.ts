import type { FamilyMember } from '../../types/family'
import type { Movie } from '../../types/movie'
import { isRatingAllowed, maxAllowedRatingForAges } from '../../data/ageRatingRules'

/** Hard safety constraint — never relaxed by the pipeline's relaxation ladder. */
export function ageFilter(movies: Movie[], participants: FamilyMember[]): Movie[] {
  const ceiling = maxAllowedRatingForAges(participants.map((member) => member.age))
  return movies.filter((movie) => isRatingAllowed(movie.ageRating, ceiling))
}

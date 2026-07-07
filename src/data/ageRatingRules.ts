import type { NormalizedAgeRating } from '../types/movie'

// Order matters: index = strictness rank, lowest first.
const RATING_ORDER: NormalizedAgeRating[] = ['ALL', '7+', '13+', '16+', '18+']

export function ratingRank(rating: NormalizedAgeRating): number {
  return RATING_ORDER.indexOf(rating)
}

/**
 * Best-effort UX filter, not a parental-control guarantee (see ADR-005 /
 * README security notes) — ratings come from manually curated catalog data.
 */
export function maxAllowedRatingForAge(age: number): NormalizedAgeRating {
  if (age < 7) return 'ALL'
  if (age < 13) return '7+'
  if (age < 16) return '13+'
  if (age < 18) return '16+'
  return '18+'
}

export function maxAllowedRatingForAges(ages: number[]): NormalizedAgeRating {
  if (ages.length === 0) return '18+'
  const ranks = ages.map((age) => ratingRank(maxAllowedRatingForAge(age)))
  return RATING_ORDER[Math.min(...ranks)]
}

export function isRatingAllowed(rating: NormalizedAgeRating, ceiling: NormalizedAgeRating): boolean {
  return ratingRank(rating) <= ratingRank(ceiling)
}

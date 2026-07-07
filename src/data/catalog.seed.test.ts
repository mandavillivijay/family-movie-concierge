import { describe, expect, it } from 'vitest'
import catalog from './catalog.seed.json'
import type { Movie, NormalizedAgeRating, LanguageCode } from '../types'
import { PLATFORMS } from '../streaming/platforms.config'
import { ADULT_MOODS, KID_FRIENDLY_MOODS } from './moods.config'

const VALID_RATINGS: NormalizedAgeRating[] = ['ALL', '7+', '13+', '16+', '18+']
const VALID_LANGUAGES: LanguageCode[] = ['te', 'en', 'hi']
const VALID_MOOD_IDS = new Set([...ADULT_MOODS, ...KID_FRIENDLY_MOODS].map((mood) => mood.id))

const movies = catalog as Movie[]

describe('catalog.seed.json', () => {
  it('has a reasonable number of entries', () => {
    expect(movies.length).toBeGreaterThanOrEqual(30)
    expect(movies.length).toBeLessThanOrEqual(60)
  })

  it('has unique ids', () => {
    const ids = movies.map((movie) => movie.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it.each(movies)('$id matches the Movie shape', (movie) => {
    expect(movie.title.length).toBeGreaterThan(0)
    expect(movie.posterUrl.length).toBeGreaterThan(0)
    expect(movie.runtimeMinutes).toBeGreaterThan(0)
    expect(VALID_LANGUAGES).toContain(movie.language)
    expect(VALID_RATINGS).toContain(movie.ageRating)
    expect(movie.themes.length).toBeGreaterThan(0)
    expect(movie.moodTags.length).toBeGreaterThan(0)
    expect(movie.platformAvailability.length).toBeGreaterThan(0)

    for (const moodTag of movie.moodTags) {
      expect(VALID_MOOD_IDS.has(moodTag), `unknown moodTag "${moodTag}" on ${movie.id}`).toBe(true)
    }
    for (const availability of movie.platformAvailability) {
      expect(PLATFORMS[availability.platform], `unknown platform "${availability.platform}" on ${movie.id}`).toBeDefined()
    }
  })

  it('covers all three languages', () => {
    const languages = new Set(movies.map((movie) => movie.language))
    expect(languages).toEqual(new Set(VALID_LANGUAGES))
  })

  it('covers every non-surprise mood at least once', () => {
    const coveredMoods = new Set(movies.flatMap((movie) => movie.moodTags))
    const requiredMoods = [...VALID_MOOD_IDS].filter((id) => id !== 'surprise')
    for (const moodId of requiredMoods) {
      expect(coveredMoods.has(moodId), `no movie tagged with mood "${moodId}"`).toBe(true)
    }
  })
})

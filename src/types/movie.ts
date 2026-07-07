import type { LanguageCode } from './family'

export type NormalizedAgeRating = 'ALL' | '7+' | '13+' | '16+' | '18+'

export interface PlatformAvailability {
  platform: string
  url?: string
  externalId?: string
}

export interface Movie {
  id: string
  title: string
  tmdbId?: number
  posterUrl: string
  runtimeMinutes: number
  language: LanguageCode
  ageRating: NormalizedAgeRating
  themes: string[]
  moodTags: string[]
  platformAvailability: PlatformAvailability[]
  synopsis?: string
  releaseYear?: number
}

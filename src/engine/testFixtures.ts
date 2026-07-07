import type { FamilyMember } from '../types/family'
import type { Movie } from '../types/movie'
import type { MovieNight } from '../types/movieNight'

export function makeMovie(overrides: Partial<Movie> & Pick<Movie, 'id'>): Movie {
  return {
    title: overrides.id,
    posterUrl: 'https://example.test/poster.jpg',
    runtimeMinutes: 120,
    language: 'en',
    ageRating: 'ALL',
    themes: [],
    moodTags: [],
    platformAvailability: [{ platform: 'netflix' }],
    ...overrides,
  }
}

export function makeMember(overrides: Partial<FamilyMember> & Pick<FamilyMember, 'id'>): FamilyMember {
  return {
    name: overrides.id,
    age: 30,
    isChild: false,
    preferredLanguages: ['en'],
    themeWeights: {},
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  }
}

export function makeMovieNight(overrides: Partial<MovieNight> & Pick<MovieNight, 'id' | 'winnerMovieId'>): MovieNight {
  return {
    date: '2026-01-01T00:00:00.000Z',
    participantIds: [],
    mood: 'surprise',
    languagePriority: 'any',
    runtimeFilter: 'any',
    candidateMovieIds: [],
    feedbackStatus: 'completed',
    ...overrides,
  }
}

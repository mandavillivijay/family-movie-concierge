import { describe, expect, it } from 'vitest'
import { languageFilter } from './languageFilter'
import { makeMovie } from '../testFixtures'

describe('languageFilter', () => {
  const movies = [
    makeMovie({ id: 'a', language: 'te' }),
    makeMovie({ id: 'b', language: 'en' }),
    makeMovie({ id: 'c', language: 'hi' }),
  ]

  it('passes through everything for "any"', () => {
    expect(languageFilter(movies, 'any')).toEqual(movies)
  })

  it('filters to an exact language match', () => {
    expect(languageFilter(movies, 'te').map((m) => m.id)).toEqual(['a'])
  })
})

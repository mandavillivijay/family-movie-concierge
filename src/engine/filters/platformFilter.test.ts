import { describe, expect, it } from 'vitest'
import { platformFilter } from './platformFilter'
import { makeMovie } from '../testFixtures'

describe('platformFilter', () => {
  const movies = [
    makeMovie({ id: 'a', platformAvailability: [{ platform: 'netflix' }] }),
    makeMovie({ id: 'b', platformAvailability: [{ platform: 'primevideo' }] }),
    makeMovie({ id: 'c', platformAvailability: [{ platform: 'netflix' }, { platform: 'youtube' }] }),
  ]

  it('passes through everything when no platforms are subscribed', () => {
    expect(platformFilter(movies, [])).toEqual(movies)
  })

  it('keeps only movies available on a subscribed platform', () => {
    const result = platformFilter(movies, ['netflix'])
    expect(result.map((m) => m.id)).toEqual(['a', 'c'])
  })

  it('matches a movie available on any of multiple subscribed platforms', () => {
    const result = platformFilter(movies, ['primevideo', 'youtube'])
    expect(result.map((m) => m.id)).toEqual(['b', 'c'])
  })
})

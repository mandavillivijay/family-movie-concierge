import { describe, expect, it } from 'vitest'
import { runtimeFilter } from './runtimeFilter'
import { makeMovie } from '../testFixtures'

describe('runtimeFilter', () => {
  const movies = [
    makeMovie({ id: 'short', runtimeMinutes: 80 }),
    makeMovie({ id: 'medium', runtimeMinutes: 120 }),
    makeMovie({ id: 'long', runtimeMinutes: 170 }),
  ]

  it('passes through everything for "any"', () => {
    expect(runtimeFilter(movies, 'any')).toEqual(movies)
  })

  it('filters under 90 minutes', () => {
    expect(runtimeFilter(movies, 'lt90').map((m) => m.id)).toEqual(['short'])
  })

  it('filters the 90-150 minute bucket inclusively', () => {
    expect(runtimeFilter(movies, '90to150').map((m) => m.id)).toEqual(['medium'])
  })

  it('filters over 150 minutes', () => {
    expect(runtimeFilter(movies, '150plus').map((m) => m.id)).toEqual(['long'])
  })
})

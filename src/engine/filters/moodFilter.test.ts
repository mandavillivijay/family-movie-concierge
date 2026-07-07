import { describe, expect, it } from 'vitest'
import { moodFilter } from './moodFilter'
import { makeMovie } from '../testFixtures'

describe('moodFilter', () => {
  const movies = [
    makeMovie({ id: 'a', moodTags: ['comedy'] }),
    makeMovie({ id: 'b', moodTags: ['thriller'] }),
    makeMovie({ id: 'c', moodTags: ['comedy', 'romance'] }),
  ]

  it('passes through everything for "surprise"', () => {
    expect(moodFilter(movies, 'surprise')).toEqual(movies)
  })

  it('filters to movies tagged with the selected mood', () => {
    expect(moodFilter(movies, 'comedy').map((m) => m.id)).toEqual(['a', 'c'])
  })
})

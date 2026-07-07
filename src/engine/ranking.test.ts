import { describe, expect, it } from 'vitest'
import { rankByPreference } from './ranking'
import { makeMember, makeMovie, makeMovieNight } from './testFixtures'

describe('rankByPreference', () => {
  it('scores movies higher when their themes match participant weights', () => {
    const movies = [
      makeMovie({ id: 'comedy-movie', themes: ['comedy'] }),
      makeMovie({ id: 'thriller-movie', themes: ['thriller'] }),
    ]
    const participants = [makeMember({ id: 'p1', themeWeights: { comedy: 5, thriller: 1 } })]

    const ranked = rankByPreference(movies, participants, [])

    expect(ranked[0].id).toBe('comedy-movie')
    expect(ranked[0].score).toBe(5)
    expect(ranked[1].id).toBe('thriller-movie')
    expect(ranked[1].score).toBe(1)
  })

  it('sums theme weights across all participants', () => {
    const movies = [makeMovie({ id: 'family-movie', themes: ['family', 'comedy'] })]
    const participants = [
      makeMember({ id: 'p1', themeWeights: { family: 3, comedy: 2 } }),
      makeMember({ id: 'p2', themeWeights: { family: 1 } }),
    ]

    const [ranked] = rankByPreference(movies, participants, [])
    expect(ranked.score).toBe(6)
  })

  it('breaks ties alphabetically by title for determinism', () => {
    const movies = [makeMovie({ id: 'b', title: 'Bravo' }), makeMovie({ id: 'a', title: 'Alpha' })]
    const ranked = rankByPreference(movies, [], [])
    expect(ranked.map((m) => m.title)).toEqual(['Alpha', 'Bravo'])
  })

  it('penalizes movies won recently so they resurface less often', () => {
    const movies = [
      makeMovie({ id: 'recent-winner', themes: ['comedy'] }),
      makeMovie({ id: 'never-shown', themes: ['comedy'] }),
    ]
    const participants = [makeMember({ id: 'p1', themeWeights: { comedy: 5 } })]
    const history = [
      makeMovieNight({ id: 'night-1', winnerMovieId: 'recent-winner', date: '2026-07-01T00:00:00.000Z' }),
    ]

    const ranked = rankByPreference(movies, participants, history)
    expect(ranked[0].id).toBe('never-shown')
    expect(ranked[1].id).toBe('recent-winner')
  })
})

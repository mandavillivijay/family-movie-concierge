import { describe, expect, it } from 'vitest'
import { ageFilter } from './ageFilter'
import { makeMember, makeMovie } from '../testFixtures'

describe('ageFilter', () => {
  const movies = [
    makeMovie({ id: 'all', ageRating: 'ALL' }),
    makeMovie({ id: 'seven', ageRating: '7+' }),
    makeMovie({ id: 'thirteen', ageRating: '13+' }),
    makeMovie({ id: 'sixteen', ageRating: '16+' }),
    makeMovie({ id: 'eighteen', ageRating: '18+' }),
  ]

  it('allows everything for an all-adult group', () => {
    const adults = [makeMember({ id: 'p1', age: 35 }), makeMember({ id: 'p2', age: 40 })]
    expect(ageFilter(movies, adults).map((m) => m.id)).toEqual([
      'all',
      'seven',
      'thirteen',
      'sixteen',
      'eighteen',
    ])
  })

  it('uses the youngest participant to set the ceiling', () => {
    const withChild = [makeMember({ id: 'p1', age: 35 }), makeMember({ id: 'kid', age: 8, isChild: true })]
    expect(ageFilter(movies, withChild).map((m) => m.id)).toEqual(['all', 'seven'])
  })

  it('is maximally restrictive for a toddler', () => {
    const withToddler = [makeMember({ id: 'kid', age: 3, isChild: true })]
    expect(ageFilter(movies, withToddler).map((m) => m.id)).toEqual(['all'])
  })
})

import { describe, expect, it } from 'vitest'
import { runPipeline } from './pipeline'
import { makeMember, makeMovie } from './testFixtures'
import type { RecommendationInput } from './types'

function baseInput(overrides: Partial<RecommendationInput> = {}): RecommendationInput {
  return {
    catalog: [],
    participants: [makeMember({ id: 'p1', age: 30 })],
    moodId: 'surprise',
    languagePriority: 'any',
    runtimeFilter: 'any',
    history: [],
    subscribedPlatforms: [],
    ...overrides,
  }
}

describe('runPipeline', () => {
  it('returns exactly 3 movies when enough candidates match every filter', () => {
    const catalog = Array.from({ length: 5 }, (_, i) =>
      makeMovie({ id: `m${i}`, moodTags: ['comedy'], language: 'en' }),
    )
    const result = runPipeline(baseInput({ catalog, moodId: 'comedy', languagePriority: 'en' }))

    expect(result.top3).toHaveLength(3)
    expect(result.relaxedSteps).toEqual([])
  })

  it('never relaxes the age constraint', () => {
    const catalog = [
      makeMovie({ id: 'kid-safe', ageRating: 'ALL', moodTags: ['comedy'] }),
      makeMovie({ id: 'adult-only-1', ageRating: '18+', moodTags: ['comedy'] }),
      makeMovie({ id: 'adult-only-2', ageRating: '18+', moodTags: ['comedy'] }),
      makeMovie({ id: 'adult-only-3', ageRating: '18+', moodTags: ['comedy'] }),
    ]
    const result = runPipeline(
      baseInput({
        catalog,
        moodId: 'comedy',
        participants: [makeMember({ id: 'kid', age: 6, isChild: true })],
      }),
    )

    expect(result.top3.map((m) => m.id)).toEqual(['kid-safe'])
    expect(result.relaxedSteps).not.toContain('age')
  })

  it('relaxes runtime first, then language, then mood, in that order', () => {
    const catalog = [
      makeMovie({ id: 'te-comedy-long-1', language: 'te', moodTags: ['comedy'], runtimeMinutes: 170 }),
      makeMovie({ id: 'te-comedy-long-2', language: 'te', moodTags: ['comedy'], runtimeMinutes: 175 }),
      makeMovie({ id: 'en-comedy-short', language: 'en', moodTags: ['comedy'], runtimeMinutes: 80 }),
      makeMovie({ id: 'te-thriller-short', language: 'te', moodTags: ['thriller'], runtimeMinutes: 80 }),
    ]

    const result = runPipeline(
      baseInput({
        catalog,
        moodId: 'comedy',
        languagePriority: 'te',
        runtimeFilter: 'lt90',
      }),
    )

    // Only 2 'te'+'comedy' movies exist and both are long, so runtime relaxes
    // first (picking up the 2 long comedies). That's still only 2, so
    // language relaxes next, pulling in the English comedy for exactly 3 —
    // mood is never abandoned, since it's the intent the user picked.
    expect(result.relaxedSteps).toEqual(['runtime', 'language'])
    expect(result.top3.map((m) => m.id).sort()).toEqual(
      ['te-comedy-long-1', 'te-comedy-long-2', 'en-comedy-short'].sort(),
    )
  })

  it('only abandons mood as a last resort, after language has already relaxed', () => {
    const catalog = [
      makeMovie({ id: 'te-comedy', language: 'te', moodTags: ['comedy'] }),
      makeMovie({ id: 'en-comedy', language: 'en', moodTags: ['comedy'] }),
      makeMovie({ id: 'te-thriller', language: 'te', moodTags: ['thriller'] }),
    ]

    const result = runPipeline(
      baseInput({
        catalog,
        moodId: 'comedy',
        languagePriority: 'te',
        runtimeFilter: 'any',
      }),
    )

    // Only 1 'te'+'comedy' movie exists; relaxing language reaches 2, still
    // short of 3, so mood relaxes last, pulling in the thriller.
    expect(result.relaxedSteps).toEqual(['language', 'mood'])
    expect(result.top3.map((m) => m.id).sort()).toEqual(['te-comedy', 'en-comedy', 'te-thriller'].sort())
  })

  it('can return fewer than 3 movies if even full relaxation is not enough', () => {
    const catalog = [makeMovie({ id: 'only-one', ageRating: 'ALL' })]
    const result = runPipeline(
      baseInput({ catalog, participants: [makeMember({ id: 'kid', age: 5, isChild: true })] }),
    )

    expect(result.top3.map((m) => m.id)).toEqual(['only-one'])
  })

  it('ranks the surviving candidates by preference before slicing to 3', () => {
    const catalog = [
      makeMovie({ id: 'low', themes: ['comedy'] }),
      makeMovie({ id: 'high', themes: ['comedy', 'family'] }),
      makeMovie({ id: 'mid', themes: ['family'] }),
      makeMovie({ id: 'zero', themes: [] }),
    ]
    const result = runPipeline(
      baseInput({
        catalog,
        participants: [makeMember({ id: 'p1', themeWeights: { comedy: 1, family: 2 } })],
      }),
    )

    expect(result.top3.map((m) => m.id)).toEqual(['high', 'mid', 'low'])
  })
})

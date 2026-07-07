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

  it('relaxes runtime first, then mood, then language, in that order', () => {
    const catalog = [
      makeMovie({ id: 'te-comedy-long-1', language: 'te', moodTags: ['comedy'], runtimeMinutes: 170 }),
      makeMovie({ id: 'te-comedy-long-2', language: 'te', moodTags: ['comedy'], runtimeMinutes: 175 }),
      makeMovie({ id: 'te-thriller-short', language: 'te', moodTags: ['thriller'], runtimeMinutes: 80 }),
      makeMovie({ id: 'en-thriller-short', language: 'en', moodTags: ['thriller'], runtimeMinutes: 80 }),
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
    // first (picking up the 2 long comedies), then mood relaxes to reach 3.
    expect(result.relaxedSteps).toEqual(['runtime', 'mood'])
    expect(result.top3.map((m) => m.id).sort()).toEqual(
      ['te-comedy-long-1', 'te-comedy-long-2', 'te-thriller-short'].sort(),
    )
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

import { describe, expect, it } from 'vitest'
import { describeRelaxedSteps } from './relaxationMessage'

describe('describeRelaxedSteps', () => {
  it('returns nothing when no filters were relaxed', () => {
    expect(describeRelaxedSteps([], 'Romance')).toBeUndefined()
  })

  it('mentions the mood by name when only runtime relaxed', () => {
    expect(describeRelaxedSteps(['runtime'], 'Romance')).toBe(
      'Included other runtimes to find great matches.',
    )
  })

  it('explains a language relaxation without abandoning the mood', () => {
    expect(describeRelaxedSteps(['runtime', 'language'], 'Romance')).toBe(
      'Not enough Romance picks in your chosen language, so we included others too.',
    )
  })

  it('explains when mood itself had to be abandoned as a last resort', () => {
    expect(describeRelaxedSteps(['runtime', 'language', 'mood'], 'Romance')).toBe(
      'Not enough exact matches, so we broadened beyond Romance too.',
    )
  })
})

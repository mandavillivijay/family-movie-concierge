import { describe, expect, it } from 'vitest'
import { pickRandomWinner } from './spinner'

describe('pickRandomWinner', () => {
  it('throws on an empty list', () => {
    expect(() => pickRandomWinner([])).toThrow()
  })

  it('returns the only item when there is just one', () => {
    expect(pickRandomWinner(['solo'])).toBe('solo')
  })

  it('is deterministic given an injected rng', () => {
    const items = ['a', 'b', 'c'];
    expect(pickRandomWinner(items, () => 0)).toBe('a')
    expect(pickRandomWinner(items, () => 0.34)).toBe('b')
    expect(pickRandomWinner(items, () => 0.99)).toBe('c')
  })
})

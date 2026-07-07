import { describe, expect, it } from 'vitest'
import { NullAIProvider } from './NullAIProvider'
import { makeMovie } from '../engine/testFixtures'

describe('NullAIProvider', () => {
  const provider = new NullAIProvider()

  it('produces a templated explanation from the movie themes', async () => {
    const movie = makeMovie({ id: 'm1', themes: ['comedy', 'family'] })
    const explanation = await provider.explainRecommendation(movie, {
      participants: [],
      moodLabel: 'Family Comedy',
    })
    expect(explanation).toBe('A comedy + family pick for family comedy night.')
  })

  it('falls back gracefully when a movie has no themes', async () => {
    const movie = makeMovie({ id: 'm1', themes: [] })
    const explanation = await provider.explainRecommendation(movie, {
      participants: [],
      moodLabel: 'Surprise Me',
    })
    expect(explanation).toBe('A solid pick for surprise me night.')
  })

  it('parses feedback into no preference updates', async () => {
    const movie = makeMovie({ id: 'm1' })
    const result = await provider.parseFeedback('loved it', { movie, participants: [] })
    expect(result).toEqual({ updates: [] })
  })
})

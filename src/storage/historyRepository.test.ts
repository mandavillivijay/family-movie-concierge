import { beforeEach, describe, expect, it } from 'vitest'
import { historyRepository } from './historyRepository'
import { db } from './db'

beforeEach(async () => {
  await db.del('movie-nights')
})

function nightInput() {
  return {
    date: '2026-07-07T20:00:00.000Z',
    participantIds: ['p1'],
    mood: 'comedy',
    languagePriority: 'te' as const,
    runtimeFilter: 'any' as const,
    candidateMovieIds: ['m1', 'm2', 'm3'],
    winnerMovieId: 'm1',
    feedbackStatus: 'pending' as const,
  }
}

describe('historyRepository', () => {
  it('adds a movie night with a generated id', async () => {
    const night = await historyRepository.add(nightInput())
    expect(night.id).toBeTruthy()
    expect(await historyRepository.getAll()).toEqual([night])
  })

  it('updates feedback status', async () => {
    const night = await historyRepository.add(nightInput())
    const updated = await historyRepository.updateFeedbackStatus(night.id, 'completed')
    expect(updated?.feedbackStatus).toBe('completed')
  })

  it('returns undefined when updating a missing id', async () => {
    expect(await historyRepository.updateFeedbackStatus('missing', 'completed')).toBeUndefined()
  })

  it('finds only pending nights', async () => {
    const pending = await historyRepository.add(nightInput())
    const completed = await historyRepository.add({ ...nightInput(), feedbackStatus: 'completed' })

    const result = await historyRepository.getPending()

    expect(result.map((n) => n.id)).toEqual([pending.id])
    expect(result.map((n) => n.id)).not.toContain(completed.id)
  })
})

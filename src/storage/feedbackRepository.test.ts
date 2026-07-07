import { beforeEach, describe, expect, it } from 'vitest'
import { feedbackRepository } from './feedbackRepository'
import { db } from './db'

beforeEach(async () => {
  await db.del('feedback')
})

describe('feedbackRepository', () => {
  it('adds feedback with a generated id and timestamp', async () => {
    const feedback = await feedbackRepository.add({
      movieNightId: 'night-1',
      movieId: 'movie-1',
      watched: true,
      finished: false,
      freeTextComment: 'Loved the mythology but got bored in the second half.',
    })

    expect(feedback.id).toBeTruthy()
    expect(feedback.createdAt).toBeTruthy()
    expect(await feedbackRepository.getAll()).toEqual([feedback])
  })

  it('finds feedback for a specific movie night', async () => {
    await feedbackRepository.add({ movieNightId: 'night-1', movieId: 'm1', watched: true })
    const target = await feedbackRepository.add({ movieNightId: 'night-2', movieId: 'm2', watched: false })

    const found = await feedbackRepository.getForMovieNight('night-2')

    expect(found).toEqual(target)
  })

  it('returns undefined when no feedback exists for a movie night', async () => {
    expect(await feedbackRepository.getForMovieNight('missing')).toBeUndefined()
  })
})

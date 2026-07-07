import { db } from './db'
import type { FeedbackStatus, MovieNight } from '../types/movieNight'

const KEY = 'movie-nights'

async function getAll(): Promise<MovieNight[]> {
  return (await db.get<MovieNight[]>(KEY)) ?? []
}

async function add(data: Omit<MovieNight, 'id'>): Promise<MovieNight> {
  const night: MovieNight = { ...data, id: crypto.randomUUID() }
  await db.set(KEY, [...(await getAll()), night])
  return night
}

async function updateFeedbackStatus(
  id: string,
  feedbackStatus: FeedbackStatus,
): Promise<MovieNight | undefined> {
  const all = await getAll()
  const index = all.findIndex((night) => night.id === id)
  if (index === -1) return undefined

  const updated: MovieNight = { ...all[index], feedbackStatus }
  const next = [...all]
  next[index] = updated
  await db.set(KEY, next)
  return updated
}

async function getPending(): Promise<MovieNight[]> {
  const all = await getAll()
  return all.filter((night) => night.feedbackStatus === 'pending')
}

export const historyRepository = { getAll, add, updateFeedbackStatus, getPending }

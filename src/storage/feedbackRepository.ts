import { db } from './db'
import type { Feedback } from '../types/feedback'

const KEY = 'feedback'

async function getAll(): Promise<Feedback[]> {
  return (await db.get<Feedback[]>(KEY)) ?? []
}

async function add(data: Omit<Feedback, 'id' | 'createdAt'>): Promise<Feedback> {
  const feedback: Feedback = { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
  await db.set(KEY, [...(await getAll()), feedback])
  return feedback
}

async function getForMovieNight(movieNightId: string): Promise<Feedback | undefined> {
  const all = await getAll()
  return all.find((feedback) => feedback.movieNightId === movieNightId)
}

export const feedbackRepository = { getAll, add, getForMovieNight }

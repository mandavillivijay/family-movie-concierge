import { db } from './db'
import type { FamilyMember } from '../types/family'

const KEY = 'family-members'

async function getAll(): Promise<FamilyMember[]> {
  return (await db.get<FamilyMember[]>(KEY)) ?? []
}

async function add(data: Omit<FamilyMember, 'id' | 'createdAt' | 'updatedAt'>): Promise<FamilyMember> {
  const now = new Date().toISOString()
  const member: FamilyMember = { ...data, id: crypto.randomUUID(), createdAt: now, updatedAt: now }
  await db.set(KEY, [...(await getAll()), member])
  return member
}

async function update(
  id: string,
  changes: Partial<Omit<FamilyMember, 'id' | 'createdAt'>>,
): Promise<FamilyMember | undefined> {
  const all = await getAll()
  const index = all.findIndex((member) => member.id === id)
  if (index === -1) return undefined

  const updated: FamilyMember = { ...all[index], ...changes, updatedAt: new Date().toISOString() }
  const next = [...all]
  next[index] = updated
  await db.set(KEY, next)
  return updated
}

async function remove(id: string): Promise<void> {
  const all = await getAll()
  await db.set(
    KEY,
    all.filter((member) => member.id !== id),
  )
}

export const familyRepository = { getAll, add, update, remove }

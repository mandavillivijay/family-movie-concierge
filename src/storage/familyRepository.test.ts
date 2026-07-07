import { beforeEach, describe, expect, it } from 'vitest'
import { familyRepository } from './familyRepository'
import { db } from './db'

beforeEach(async () => {
  await db.del('family-members')
})

describe('familyRepository', () => {
  it('starts empty', async () => {
    expect(await familyRepository.getAll()).toEqual([])
  })

  it('adds a member with a generated id and timestamps', async () => {
    const member = await familyRepository.add({
      name: 'Vijay',
      age: 35,
      isChild: false,
      preferredLanguages: ['te', 'en'],
      themeWeights: {},
    })

    expect(member.id).toBeTruthy()
    expect(member.createdAt).toBeTruthy()
    expect(member.updatedAt).toBe(member.createdAt)
    expect(await familyRepository.getAll()).toEqual([member])
  })

  it('updates a member and bumps updatedAt', async () => {
    const member = await familyRepository.add({
      name: 'Daughter',
      age: 8,
      isChild: true,
      preferredLanguages: ['te'],
      themeWeights: { animation: 2 },
    })

    const updated = await familyRepository.update(member.id, { themeWeights: { animation: 3 } })

    expect(updated?.themeWeights).toEqual({ animation: 3 })
    expect(updated?.name).toBe('Daughter')
    const [stored] = await familyRepository.getAll()
    expect(stored).toEqual(updated)
  })

  it('returns undefined when updating a missing id', async () => {
    expect(await familyRepository.update('missing', { age: 99 })).toBeUndefined()
  })

  it('removes a member', async () => {
    const a = await familyRepository.add({
      name: 'A',
      age: 30,
      isChild: false,
      preferredLanguages: ['en'],
      themeWeights: {},
    })
    const b = await familyRepository.add({
      name: 'B',
      age: 32,
      isChild: false,
      preferredLanguages: ['en'],
      themeWeights: {},
    })

    await familyRepository.remove(a.id)

    expect(await familyRepository.getAll()).toEqual([b])
  })
})

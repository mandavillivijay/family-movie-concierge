import { useCallback, useEffect, useState } from 'react'
import { familyRepository } from '../storage/familyRepository'
import type { FamilyMember } from '../types/family'

export function useFamilyMembers() {
  const [members, setMembers] = useState<FamilyMember[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setMembers(await familyRepository.getAll())
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addMember = useCallback(
    async (data: Omit<FamilyMember, 'id' | 'createdAt' | 'updatedAt'>) => {
      const member = await familyRepository.add(data)
      await refresh()
      return member
    },
    [refresh],
  )

  return { members, loading, addMember, refresh }
}

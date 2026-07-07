import { useCallback, useEffect, useState } from 'react'
import { historyRepository } from '../storage/historyRepository'
import type { MovieNight } from '../types/movieNight'

export function usePendingFeedback() {
  const [pending, setPending] = useState<MovieNight[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setPending(await historyRepository.getPending())
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { pending, loading, refresh }
}

import { useCallback, useState } from 'react'
import { runPipeline } from '../engine/pipeline'
import { getAIProvider } from '../ai'
import catalogSeed from '../data/catalog.seed.json'
import { findMood } from '../data/moods.config'
import { historyRepository } from '../storage/historyRepository'
import { settingsRepository } from '../storage/settingsRepository'
import type { FamilyMember, LanguageCode, RuntimePreference } from '../types/family'
import type { Movie } from '../types/movie'

const catalog = catalogSeed as Movie[]

export interface RecommendedMovie {
  movie: Movie
  explanation: string
}

export interface GenerateParams {
  participants: FamilyMember[]
  moodId: string
  languagePriority: LanguageCode | 'any'
  runtimeFilter: RuntimePreference
}

export function useRecommendations() {
  const [recommended, setRecommended] = useState<RecommendedMovie[]>([])
  const [relaxedSteps, setRelaxedSteps] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const generate = useCallback(async (params: GenerateParams) => {
    setLoading(true)
    try {
      const history = await historyRepository.getAll()
      const { subscribedPlatforms } = settingsRepository.getSettings()

      const { top3, relaxedSteps: relaxed } = runPipeline({
        catalog,
        participants: params.participants,
        moodId: params.moodId,
        languagePriority: params.languagePriority,
        runtimeFilter: params.runtimeFilter,
        history,
        subscribedPlatforms,
      })

      const hasChild = params.participants.some((member) => member.isChild)
      const mood = findMood(params.moodId, hasChild)
      const aiProvider = getAIProvider()

      const withExplanations = await Promise.all(
        top3.map(async (movie) => ({
          movie,
          explanation: await aiProvider.explainRecommendation(movie, {
            participants: params.participants,
            moodLabel: mood?.label ?? 'Surprise Me',
          }),
        })),
      )

      setRecommended(withExplanations)
      setRelaxedSteps(relaxed)
    } finally {
      setLoading(false)
    }
  }, [])

  return { recommended, relaxedSteps, loading, generate }
}

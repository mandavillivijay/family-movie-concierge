import type { Movie } from '../types/movie'
import { SURPRISE_MOOD_ID } from '../data/moods.config'
import { platformFilter } from './filters/platformFilter'
import { languageFilter } from './filters/languageFilter'
import { ageFilter } from './filters/ageFilter'
import { moodFilter } from './filters/moodFilter'
import { runtimeFilter } from './filters/runtimeFilter'
import { rankByPreference } from './ranking'
import type { PipelineResult, RecommendationInput } from './types'

const TOP_N = 3

/**
 * Filters + ranks the catalog down to exactly 3 movies where possible.
 * Order: platform -> age (both hard constraints, never relaxed) -> language
 * -> mood -> runtime, then preference ranking. If fewer than 3 candidates
 * survive, relaxes runtime, then language, then mood (in that order) until 3
 * are available or every relaxable filter has been dropped. Language is
 * relaxed before mood because mood is the intent the user explicitly picked
 * (e.g. "Romance") — better to offer a Romance pick in another language than
 * to abandon Romance and surface an unrelated kids' cartoon just because it
 * happens to be in the requested language. With a very small/restrictive
 * catalog (e.g. few subscribed platforms or a very young participant), fewer
 * than 3 may still result — the pipeline returns whatever it has rather than
 * fabricating movies.
 */
export function runPipeline(input: RecommendationInput): PipelineResult {
  const relaxedSteps: PipelineResult['relaxedSteps'] = []

  const hardFiltered = ageFilter(
    platformFilter(input.catalog, input.subscribedPlatforms),
    input.participants,
  )

  let languagePriority = input.languagePriority
  let moodId = input.moodId
  let runtimeBucket = input.runtimeFilter

  const applyRelaxableFilters = (): Movie[] =>
    runtimeFilter(moodFilter(languageFilter(hardFiltered, languagePriority), moodId), runtimeBucket)

  let candidates = applyRelaxableFilters()

  if (candidates.length < TOP_N && runtimeBucket !== 'any') {
    runtimeBucket = 'any'
    relaxedSteps.push('runtime')
    candidates = applyRelaxableFilters()
  }
  if (candidates.length < TOP_N && languagePriority !== 'any') {
    languagePriority = 'any'
    relaxedSteps.push('language')
    candidates = applyRelaxableFilters()
  }
  if (candidates.length < TOP_N && moodId !== SURPRISE_MOOD_ID) {
    moodId = SURPRISE_MOOD_ID
    relaxedSteps.push('mood')
    candidates = applyRelaxableFilters()
  }

  const ranked = rankByPreference(candidates, input.participants, input.history)

  return { top3: ranked.slice(0, TOP_N), relaxedSteps }
}

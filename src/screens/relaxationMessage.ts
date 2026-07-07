/**
 * Explains *what* the recommendation pipeline's relaxation ladder widened,
 * so a language/mood swap (see engine/pipeline.ts) reads as intentional to
 * the user instead of looking like a bug.
 */
export function describeRelaxedSteps(relaxedSteps: string[], moodLabel: string): string | undefined {
  if (relaxedSteps.length === 0) return undefined
  if (relaxedSteps.includes('mood')) {
    return `Not enough exact matches, so we broadened beyond ${moodLabel} too.`
  }
  if (relaxedSteps.includes('language')) {
    return `Not enough ${moodLabel} picks in your chosen language, so we included others too.`
  }
  return 'Included other runtimes to find great matches.'
}

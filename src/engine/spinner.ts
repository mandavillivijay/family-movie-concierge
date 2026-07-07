/** Pure random selection; rng is injectable so tests can be deterministic. */
export function pickRandomWinner<T>(items: T[], rng: () => number = Math.random): T {
  if (items.length === 0) {
    throw new Error('Cannot pick a winner from an empty list')
  }
  const index = Math.floor(rng() * items.length)
  return items[index]
}

import type { Movie } from '../types/movie'
import type { StreamingProvider } from './StreamingProvider'
import { getPlatform } from './platforms.config'

export class StaticStreamingProvider implements StreamingProvider {
  buildWatchUrl(movie: Movie, platformId: string): string {
    const platform = getPlatform(platformId)
    if (!platform) {
      throw new Error(`Unknown streaming platform: ${platformId}`)
    }

    const availability = movie.platformAvailability.find((entry) => entry.platform === platformId)
    const encodedTitle = encodeURIComponent(movie.title)

    if (availability?.url) {
      return availability.url
    }
    if (availability?.externalId && platform.urlTemplate) {
      return platform.urlTemplate.replace('{externalId}', availability.externalId)
    }
    return platform.searchUrlTemplate.replace('{title}', encodedTitle)
  }
}

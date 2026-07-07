export interface PlatformConfig {
  id: string
  name: string
  /** {externalId} is substituted with Movie.platformAvailability[].externalId */
  urlTemplate?: string
  /** {title} is substituted with the URL-encoded movie title */
  searchUrlTemplate: string
}

// FR-6: adding a new platform is just a new entry here — no code changes.
export const PLATFORMS: Record<string, PlatformConfig> = {
  netflix: {
    id: 'netflix',
    name: 'Netflix',
    urlTemplate: 'https://www.netflix.com/title/{externalId}',
    searchUrlTemplate: 'https://www.netflix.com/search?q={title}',
  },
  jiohotstar: {
    id: 'jiohotstar',
    name: 'JioHotstar',
    searchUrlTemplate: 'https://www.hotstar.com/in/search?q={title}',
  },
  primevideo: {
    id: 'primevideo',
    name: 'Amazon Prime Video',
    searchUrlTemplate: 'https://www.primevideo.com/search?phrase={title}',
  },
  sunnxt: {
    id: 'sunnxt',
    name: 'Sun NXT',
    searchUrlTemplate: 'https://www.sunnxt.com/search/{title}',
  },
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    urlTemplate: 'https://www.youtube.com/watch?v={externalId}',
    searchUrlTemplate: 'https://www.youtube.com/results?search_query={title}',
  },
}

export function getPlatform(id: string): PlatformConfig | undefined {
  return PLATFORMS[id]
}

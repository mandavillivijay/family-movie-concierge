export interface ParsedPreferenceUpdate {
  memberId: string
  theme: string
  delta: number
}

export interface Feedback {
  id: string
  movieNightId: string
  movieId: string
  watched: boolean
  finished?: boolean
  rating?: number
  freeTextComment?: string
  parsedPreferenceUpdates?: ParsedPreferenceUpdate[]
  createdAt: string
}

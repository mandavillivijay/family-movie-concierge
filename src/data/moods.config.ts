export interface Mood {
  id: string
  label: string
  /** Themes in the movie catalog that satisfy this mood. */
  themes: string[]
}

// FR-3: shown when every selected participant is an adult.
export const ADULT_MOODS: Mood[] = [
  { id: 'romance', label: 'Romance', themes: ['romance'] },
  { id: 'comedy', label: 'Comedy', themes: ['comedy'] },
  { id: 'thriller', label: 'Thriller', themes: ['thriller'] },
  { id: 'suspense', label: 'Suspense', themes: ['suspense', 'thriller'] },
  { id: 'scifi', label: 'Sci-Fi', themes: ['sci-fi'] },
  { id: 'emotional', label: 'Emotional', themes: ['emotional', 'drama'] },
  { id: 'drama', label: 'Drama', themes: ['drama'] },
  { id: 'action', label: 'Action', themes: ['action'] },
  { id: 'surprise', label: 'Surprise Me', themes: [] },
]

// FR-3: shown whenever at least one selected participant is a child.
export const KID_FRIENDLY_MOODS: Mood[] = [
  { id: 'telugu-mythology', label: 'Telugu Mythology', themes: ['mythology'] },
  { id: 'mahabharata', label: 'Mahabharata', themes: ['mythology', 'mahabharata'] },
  { id: 'ramayana', label: 'Ramayana', themes: ['mythology', 'ramayana'] },
  { id: 'socio-fantasy', label: 'Socio Fantasy', themes: ['fantasy', 'social'] },
  { id: 'family-comedy', label: 'Family Comedy', themes: ['comedy', 'family'] },
  { id: 'adventure', label: 'Adventure', themes: ['adventure'] },
  { id: 'animation', label: 'Animation', themes: ['animation'] },
  { id: 'festival', label: 'Festival Movies', themes: ['festival'] },
  { id: 'surprise', label: 'Surprise Me', themes: [] },
]

export function getMoodOptions(hasChildParticipant: boolean): Mood[] {
  return hasChildParticipant ? KID_FRIENDLY_MOODS : ADULT_MOODS
}

export function findMood(moodId: string, hasChildParticipant: boolean): Mood | undefined {
  return getMoodOptions(hasChildParticipant).find((mood) => mood.id === moodId)
}

export const SURPRISE_MOOD_ID = 'surprise'

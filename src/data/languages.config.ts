import type { LanguageCode } from '../types/family'

export interface LanguageOption {
  code: LanguageCode | 'any'
  label: string
}

// FR-4: priority order shown to the user; a single primary choice per movie
// night keeps this a one-tap screen (matches the "one question per screen"
// design principle) and lines up with the engine's single languagePriority input.
export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'te', label: 'Telugu' },
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'any', label: 'Any Language' },
]

export const LANGUAGE_LABELS: Record<LanguageCode, string> = {
  te: 'Telugu',
  en: 'English',
  hi: 'Hindi',
}

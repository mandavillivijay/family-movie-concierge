export type LanguageCode = 'te' | 'en' | 'hi'

export type RuntimePreference = 'lt90' | '90to150' | '150plus' | 'any'

export interface FamilyMember {
  id: string
  name: string
  age: number
  isChild: boolean
  preferredLanguages: LanguageCode[]
  themeWeights: Record<string, number>
  runtimePreference?: RuntimePreference
  contentRestrictions?: string[]
  createdAt: string
  updatedAt: string
}

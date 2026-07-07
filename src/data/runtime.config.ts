import type { RuntimePreference } from '../types/family'

export interface RuntimeOption {
  value: RuntimePreference
  label: string
}

// FR-5: optional, so screens default to 'any' rather than blocking progress.
export const RUNTIME_OPTIONS: RuntimeOption[] = [
  { value: 'lt90', label: 'Under 90 min' },
  { value: '90to150', label: '90-150 min' },
  { value: '150plus', label: '150+ min' },
  { value: 'any', label: 'Any length' },
]

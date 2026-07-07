import { useState } from 'react'
import { Button } from '../components/ui/Button'
import { SelectableTile } from '../components/ui/SelectableTile'
import { LANGUAGE_OPTIONS } from '../data/languages.config'
import type { FamilyMember, LanguageCode } from '../types/family'

interface FamilyMemberEditorScreenProps {
  onSave: (data: Omit<FamilyMember, 'id' | 'createdAt' | 'updatedAt'>) => void
  onCancel?: () => void
}

const SELECTABLE_LANGUAGES = LANGUAGE_OPTIONS.filter(
  (option): option is { code: LanguageCode; label: string } => option.code !== 'any',
)

export function FamilyMemberEditorScreen({ onSave, onCancel }: FamilyMemberEditorScreenProps) {
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [languages, setLanguages] = useState<LanguageCode[]>([])

  const toggleLanguage = (code: LanguageCode) => {
    setLanguages((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]))
  }

  const ageNumber = Number(age)
  const canSave = name.trim().length > 0 && age !== '' && ageNumber >= 0 && languages.length > 0

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-md flex-col px-5 pb-6 pt-3">
      <div className="mt-4 mb-6 text-center">
        <h1 className="text-2xl font-semibold text-slate-50">Add a family member</h1>
        <p className="mt-1 text-sm text-slate-400">
          Just the basics — themes get learned from feedback over time.
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-5">
        <div>
          <label className="mb-2 block text-sm text-slate-400" htmlFor="member-name">
            Name
          </label>
          <input
            id="member-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Priya"
            className="min-h-14 w-full rounded-2xl border-2 border-slate-800 bg-slate-900 px-4 text-base text-slate-50 placeholder:text-slate-600 focus:border-indigo-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-400" htmlFor="member-age">
            Age
          </label>
          <input
            id="member-age"
            type="number"
            inputMode="numeric"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="e.g. 8"
            className="min-h-14 w-full rounded-2xl border-2 border-slate-800 bg-slate-900 px-4 text-base text-slate-50 placeholder:text-slate-600 focus:border-indigo-400 focus:outline-none"
          />
        </div>

        <div>
          <p className="mb-2 text-sm text-slate-400">Preferred languages</p>
          <div className="grid grid-cols-3 gap-2">
            {SELECTABLE_LANGUAGES.map((option) => (
              <SelectableTile
                key={option.code}
                label={option.label}
                selected={languages.includes(option.code)}
                onClick={() => toggleLanguage(option.code)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <Button
          disabled={!canSave}
          onClick={() =>
            onSave({
              name: name.trim(),
              age: ageNumber,
              isChild: ageNumber < 13,
              preferredLanguages: languages,
              themeWeights: {},
            })
          }
        >
          Save
        </Button>
        {onCancel ? (
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
      </div>
    </div>
  )
}

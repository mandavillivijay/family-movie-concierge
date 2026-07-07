import type { ReactNode } from 'react'

interface SelectableTileProps {
  label: string
  sublabel?: ReactNode
  selected: boolean
  onClick: () => void
}

export function SelectableTile({ label, sublabel, selected, onClick }: SelectableTileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex min-h-16 w-full flex-col items-center justify-center gap-0.5 rounded-2xl border-2 px-4 py-3 text-center transition-colors ${
        selected
          ? 'border-indigo-400 bg-indigo-500/20 text-white'
          : 'border-slate-800 bg-slate-900 text-slate-200 active:bg-slate-800'
      }`}
    >
      <span className="text-base font-medium">{label}</span>
      {sublabel ? <span className="text-xs text-slate-400">{sublabel}</span> : null}
    </button>
  )
}

import type { Movie } from '../types/movie'
import { LANGUAGE_LABELS } from '../data/languages.config'
import { getPlatform } from '../streaming/platforms.config'

interface MovieCardProps {
  movie: Movie
  explanation?: string
  selected?: boolean
  onClick?: () => void
}

export function MovieCard({ movie, explanation, selected, onClick }: MovieCardProps) {
  const platformNames = movie.platformAvailability
    .map((availability) => getPlatform(availability.platform)?.name ?? availability.platform)
    .join(', ')

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`flex w-full gap-3 rounded-2xl border-2 p-3 text-left transition-colors disabled:cursor-default ${
        selected ? 'border-indigo-400 bg-indigo-500/10' : 'border-slate-800 bg-slate-900'
      }`}
    >
      <img src={movie.posterUrl} alt="" className="h-28 w-20 shrink-0 rounded-lg object-cover" />
      <div className="flex min-w-0 flex-1 flex-col gap-1 py-0.5">
        <h3 className="truncate text-base font-semibold text-slate-50">{movie.title}</h3>
        <p className="text-xs text-slate-400">
          {movie.runtimeMinutes} min &middot; {LANGUAGE_LABELS[movie.language]} &middot; {movie.ageRating}
        </p>
        <p className="truncate text-xs text-slate-500">{platformNames}</p>
        {explanation ? <p className="mt-1 text-sm text-slate-200">{explanation}</p> : null}
      </div>
    </button>
  )
}

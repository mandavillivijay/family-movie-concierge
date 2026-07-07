import { useEffect, useState } from 'react'
import { Button } from '../components/ui/Button'
import { SelectableTile } from '../components/ui/SelectableTile'
import { MovieCard } from '../components/MovieCard'
import catalogSeed from '../data/catalog.seed.json'
import { feedbackRepository } from '../storage/feedbackRepository'
import { historyRepository } from '../storage/historyRepository'
import { familyRepository } from '../storage/familyRepository'
import { getAIProvider } from '../ai'
import { useFamilyMembers } from '../hooks/useFamilyMembers'
import type { Movie } from '../types/movie'
import type { MovieNight } from '../types/movieNight'

const catalog = catalogSeed as Movie[]

interface FeedbackScreenProps {
  movieNight: MovieNight
  onDone: () => void
}

type YesNo = 'yes' | 'no'
type Enjoyment = 'loved' | 'okay' | 'not-really'

const ENJOYMENT_RATING: Record<Enjoyment, number> = { loved: 5, okay: 3, 'not-really': 1 }

export function FeedbackScreen({ movieNight, onDone }: FeedbackScreenProps) {
  const { members } = useFamilyMembers()
  const movie = catalog.find((entry) => entry.id === movieNight.winnerMovieId)

  const [watched, setWatched] = useState<YesNo | undefined>()
  const [finished, setFinished] = useState<YesNo | undefined>()
  const [enjoyment, setEnjoyment] = useState<Enjoyment | undefined>()
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // The movie was removed from the catalog since this night was recorded —
  // nothing meaningful to ask about, so close it out without user input.
  useEffect(() => {
    if (!movie) {
      historyRepository.updateFeedbackStatus(movieNight.id, 'skipped').then(onDone)
    }
  }, [movie, movieNight.id, onDone])

  if (!movie) return null

  const canSubmit = watched === 'no' || (watched === 'yes' && finished !== undefined && enjoyment !== undefined)

  const skip = async () => {
    await historyRepository.updateFeedbackStatus(movieNight.id, 'skipped')
    onDone()
  }

  const submit = async () => {
    if (watched === undefined) return
    setSubmitting(true)
    try {
      const participants = members.filter((member) => movieNight.participantIds.includes(member.id))
      const trimmedComment = comment.trim()
      const aiProvider = getAIProvider()
      const parsed = trimmedComment
        ? await aiProvider.parseFeedback(trimmedComment, { movie, participants })
        : { updates: [] }

      await feedbackRepository.add({
        movieNightId: movieNight.id,
        movieId: movie.id,
        watched: watched === 'yes',
        finished: watched === 'yes' ? finished === 'yes' : undefined,
        rating: enjoyment ? ENJOYMENT_RATING[enjoyment] : undefined,
        freeTextComment: trimmedComment || undefined,
        parsedPreferenceUpdates: parsed.updates,
      })

      for (const update of parsed.updates) {
        const member = members.find((entry) => entry.id === update.memberId)
        if (!member) continue
        await familyRepository.update(member.id, {
          themeWeights: {
            ...member.themeWeights,
            [update.theme]: (member.themeWeights[update.theme] ?? 0) + update.delta,
          },
        })
      }

      await historyRepository.updateFeedbackStatus(movieNight.id, 'completed')
      onDone()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-md flex-col px-5 pb-6 pt-3">
      <div className="mt-3 mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-50">How was movie night?</h1>
        <button type="button" onClick={skip} className="text-sm text-slate-500 active:text-slate-300">
          Skip
        </button>
      </div>

      <MovieCard movie={movie} />

      <div className="mt-6 flex flex-col gap-6">
        <div>
          <p className="mb-2 text-sm text-slate-400">Did you watch it?</p>
          <div className="grid grid-cols-2 gap-3">
            <SelectableTile label="Yes" selected={watched === 'yes'} onClick={() => setWatched('yes')} />
            <SelectableTile
              label="No"
              selected={watched === 'no'}
              onClick={() => {
                setWatched('no')
                setFinished(undefined)
                setEnjoyment(undefined)
              }}
            />
          </div>
        </div>

        {watched === 'yes' ? (
          <>
            <div>
              <p className="mb-2 text-sm text-slate-400">Did you finish it?</p>
              <div className="grid grid-cols-2 gap-3">
                <SelectableTile label="Yes" selected={finished === 'yes'} onClick={() => setFinished('yes')} />
                <SelectableTile label="No" selected={finished === 'no'} onClick={() => setFinished('no')} />
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm text-slate-400">Did you enjoy it?</p>
              <div className="grid grid-cols-3 gap-2">
                <SelectableTile label="Loved it" selected={enjoyment === 'loved'} onClick={() => setEnjoyment('loved')} />
                <SelectableTile label="It was okay" selected={enjoyment === 'okay'} onClick={() => setEnjoyment('okay')} />
                <SelectableTile
                  label="Not really"
                  selected={enjoyment === 'not-really'}
                  onClick={() => setEnjoyment('not-really')}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-400" htmlFor="feedback-comment">
                Anything else? (optional)
              </label>
              <textarea
                id="feedback-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="e.g. My daughter loved the mythology but got bored during the second half."
                rows={3}
                className="w-full rounded-2xl border-2 border-slate-800 bg-slate-900 px-4 py-3 text-base text-slate-50 placeholder:text-slate-600 focus:border-indigo-400 focus:outline-none"
              />
            </div>
          </>
        ) : null}
      </div>

      <div className="mt-6">
        <Button disabled={!canSubmit || submitting} onClick={submit}>
          Submit
        </Button>
      </div>
    </div>
  )
}

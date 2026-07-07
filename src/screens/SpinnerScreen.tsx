import { useEffect, useRef, useState } from 'react'
import { Button } from '../components/ui/Button'
import { BackButton } from '../components/ui/BackButton'
import { MovieCard } from '../components/MovieCard'
import { useSession } from '../state/SessionContext'
import { useFamilyMembers } from '../hooks/useFamilyMembers'
import { pickRandomWinner } from '../engine/spinner'
import { historyRepository } from '../storage/historyRepository'
import { StaticStreamingProvider } from '../streaming/StaticStreamingProvider'
import { findMood } from '../data/moods.config'
import type { Movie } from '../types/movie'

const streamingProvider = new StaticStreamingProvider()

const SPIN_TICK_START_MS = 90
const SPIN_TICK_GROWTH = 1.18
const SPIN_MIN_TICKS = 14

type Phase = 'idle' | 'spinning' | 'landed' | 'watching'

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

export function SpinnerScreen() {
  const { state, dispatch } = useSession()
  const { members } = useFamilyMembers()
  const movies = state.recommendations

  const [phase, setPhase] = useState<Phase>('idle')
  const [highlightIndex, setHighlightIndex] = useState(0)
  const [winner, setWinner] = useState<Movie | null>(null)
  const timeoutRef = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timeoutRef.current), [])

  const spin = () => {
    if (movies.length === 0) return

    const finalWinner = pickRandomWinner(movies)
    const finalIndex = movies.findIndex((movie) => movie.id === finalWinner.id)

    if (prefersReducedMotion()) {
      setHighlightIndex(finalIndex)
      setWinner(finalWinner)
      setPhase('landed')
      return
    }

    setPhase('spinning')
    setHighlightIndex(0)

    const remainder = SPIN_MIN_TICKS % movies.length
    const extra = (finalIndex - remainder + movies.length) % movies.length
    const totalTicks = SPIN_MIN_TICKS + extra

    let tick = 0
    let delay = SPIN_TICK_START_MS
    const step = () => {
      tick += 1
      setHighlightIndex((prev) => (prev + 1) % movies.length)
      if (tick < totalTicks) {
        delay *= SPIN_TICK_GROWTH
        timeoutRef.current = window.setTimeout(step, delay)
      } else {
        setWinner(finalWinner)
        setPhase('landed')
      }
    }
    timeoutRef.current = window.setTimeout(step, delay)
  }

  const handleWatchNow = async () => {
    if (!winner) return
    const participants = members.filter((member) => state.participantIds.includes(member.id))
    const hasChild = participants.some((member) => member.isChild)
    const mood = findMood(state.moodId ?? '', hasChild)
    const platformId = winner.platformAvailability[0]?.platform

    await historyRepository.add({
      date: new Date().toISOString(),
      participantIds: state.participantIds,
      mood: mood?.label ?? state.moodId ?? 'Surprise Me',
      languagePriority: state.languagePriority ?? 'any',
      runtimeFilter: state.runtimeFilter ?? 'any',
      candidateMovieIds: movies.map((movie) => movie.id),
      winnerMovieId: winner.id,
      platformOpened: platformId,
      feedbackStatus: 'pending',
    })

    if (platformId) {
      window.open(streamingProvider.buildWatchUrl(winner, platformId), '_blank', 'noopener,noreferrer')
    }
    setPhase('watching')
  }

  if (movies.length === 0) {
    return (
      <div className="mx-auto flex min-h-svh w-full max-w-md flex-col items-center justify-center gap-4 px-5 text-center">
        <p className="text-slate-400">No recommendations to spin yet.</p>
        <Button onClick={() => dispatch({ type: 'GO_TO_STEP', step: 'recommendations' })}>Go Back</Button>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-md flex-col px-5 pb-6 pt-3">
      <div className="mb-2 flex items-center">
        <BackButton onClick={() => dispatch({ type: 'GO_TO_STEP', step: 'recommendations' })} />
      </div>

      <div className="mt-2 mb-6 text-center">
        <h1 className="text-2xl font-semibold text-slate-50">
          {phase === 'watching' ? 'Enjoy the movie!' : phase === 'landed' ? "Tonight's winner" : 'Spin for tonight'}
        </h1>
      </div>

      {phase === 'watching' && winner ? (
        <div className="flex flex-1 flex-col items-center gap-4">
          <MovieCard movie={winner} selected />
          <p className="text-center text-slate-400">
            We'll ask how it went next time you open the app.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {movies.map((movie, index) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              selected={phase === 'landed' ? winner?.id === movie.id : index === highlightIndex}
            />
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {phase === 'idle' ? <Button onClick={spin}>Spin</Button> : null}
        {phase === 'spinning' ? <Button disabled>Spinning...</Button> : null}
        {phase === 'landed' ? (
          <>
            <Button onClick={handleWatchNow}>Watch Now</Button>
            <Button variant="secondary" onClick={spin}>
              Spin Again
            </Button>
          </>
        ) : null}
        {phase === 'watching' ? (
          <Button variant="secondary" onClick={() => dispatch({ type: 'RESET' })}>
            Done
          </Button>
        ) : null}
      </div>
    </div>
  )
}

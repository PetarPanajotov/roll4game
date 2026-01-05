'use client'
import { CurveSeparator } from '@/components/ui/curve-seperator/CurveSeperator'
import { GameCover } from '@/components/ui/game-cover/GameCover'
import { ScreenshotCarousel } from '@/components/ui/screenshot-carousel/ScreenshotCarousel'
import { IgdbGame } from '@/lib/igdb/igdb.types'
import { useEffect, useState, useTransition } from 'react'
import Loading from '../loading'
import { FilterCard, FilterFormData } from './FilterCard'
import { GameHero } from './GameHero'
import { GameMetadata } from './GameMetadata'
import { GameSummary } from './GameSummary'
import { GameTitle } from './GameTitle'
import { Rating } from './Rating'

export function RandomGamePageClient() {
  const [game, setGame] = useState<IgdbGame | null>(null)
  const [screenshotUrls, setScreenshotUrl] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const onRollClick = (form: FilterFormData) => {
    setError(null)
    setScreenshotUrl([])

    startTransition(async () => {
      try {
        const res = await fetch('/api/random-game', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data?.error ?? `Request failed: ${res.status}`)
        }

        setGame(data as IgdbGame)
      } catch (e) {
        console.error(e)
        setGame(null)
        setError(e instanceof Error ? e.message : 'Unknown error')
      }
    })
  }

  useEffect(() => {
    setScreenshotUrl(game?.screenshots?.map((s) => s.url) ?? [])
  }, [game])

  return (
    <>
      {isPending && <Loading />}

      <div
        className="relative bg-[url('/mushrooms.png')] w-full object-cover bg-center h-120 bg-no-repeat bg-cover
          before:absolute before:inset-0 before:bg-black/40 before:z-0 before:content-['']"
      >
        <div className="relative z-10 flex justify-center items-center h-full w-full">
          <FilterCard onRollClick={onRollClick} />
        </div>
      </div>

      <div className="w-full h-1 bg-primary" />

      {error && (
        <div className="py-6 flex justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {game ? (
        <>
          <GameHero backgroundImageUrl={screenshotUrls[0]}>
            <div className="flex gap-4 w-full md:w-auto">
              <GameCover
                src={game.cover?.url ?? ''}
                width={game.cover?.width}
                height={game.cover?.height}
                alt={`${game.name} cover`}
                className="w-24 h-auto md:w-auto"
              />
              <div className="md:hidden">
                <GameTitle
                  name={game.name}
                  releaseDate={game.first_release_date}
                  url={game.url}
                />
              </div>
            </div>

            <div className="hidden md:flex md:ps-8 flex-col md:w-[50%]">
              <GameTitle
                name={game.name}
                releaseDate={game.first_release_date}
                url={game.url}
              />
              <CurveSeparator />
              <div className="flex flex-col gap-2">
                <GameMetadata genres={game.genres} platforms={game.platforms} />
                <GameSummary summary={game.summary} />
              </div>
            </div>

            <div className="w-full md:hidden space-y-3">
              <CurveSeparator />
              <GameMetadata genres={game.genres} platforms={game.platforms} />
              <GameSummary summary={game.summary} />
            </div>

            <div className="w-full md:w-auto md:self-center">
              <Rating
                rating={game.rating}
                rating_count={game.rating_count}
                aggregated_rating={game.aggregated_rating}
                aggregated_rating_count={game.aggregated_rating_count}
              />
            </div>
          </GameHero>

          <div className="w-full h-1 bg-primary" />

          {screenshotUrls.length > 0 && (
            <ScreenshotCarousel images={screenshotUrls} />
          )}
        </>
      ) : (
        !isPending &&
        !error && (
          <>
            <div className="h-52 flex items-center justify-center">
              <h3 className="text-3xl opacity-50">No game generated yet</h3>
            </div>
            <div className="w-full h-1 bg-primary" />
          </>
        )
      )}
    </>
  )
}

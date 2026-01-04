'use client'
import { CurveSeparator } from '@/components/ui/curve-seperator/CurveSeperator'
import { GameCover } from '@/components/ui/game-cover/GameCover'
import { ScreenshotCarousel } from '@/components/ui/screenshot-carousel/ScreenshotCarousel'
import { IgdbGame } from '@/lib/igdb/igdb.types'
import { useState } from 'react'
import { FilterCard, FilterFormData } from './_components/FilterCard'
import { GameHero } from './_components/GameHero'
import { GameMetadata } from './_components/GameMetadata'
import { GameSummary } from './_components/GameSummary'
import { GameTitle } from './_components/GameTitle'
import { Rating } from './_components/Rating'
import { WhyDifferentCard } from './_components/WhyDifferentCard'
import Loading from './loading'

export default function RandomPage() {
  /*TODO: Refactor this component. It can be split into smaller ones. */
  const [game, setGame] = useState<IgdbGame | null>(null)
  const [isLoading, setLoading] = useState<boolean>(false)

  const fetchgame = async (form: FilterFormData) => {
    setLoading(true)
    return await fetch('/api/random-game', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data: IgdbGame) => {
        setGame(data)
        setLoading(false)
      })
  }

  const screenshotUrls = game?.screenshots?.map((s) => s.url) ?? []

  return (
    <>
      {isLoading && <Loading />}
      <div
        className="relative bg-[url('/mushrooms.png')] w-[100%] object-cover bg-center h-120 bg-no-repeat bg-cover before:absolute
    before:inset-0            
    before:bg-black/40          
    before:z-0                
    before:content-['']"
      >
        <div className="relative z-2 flex justify-center align items-center h-[100%] w-[100%]">
          <FilterCard onRollClick={fetchgame} />
        </div>
      </div>
      <div className="w-full h-1 bg-primary"></div>
      {game && (
        <GameHero backgroundImageUrl={screenshotUrls[0]}>
          {/* Game Cover and Title Section */}
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

          {/* Desktop Title Section */}
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

          {/* Mobile Summary Section */}
          <div className="w-full md:hidden space-y-3">
            <CurveSeparator />
            <GameMetadata genres={game.genres} platforms={game.platforms} />
            <GameSummary summary={game.summary} />
          </div>

          {/* Rating for both views */}
          <div className="w-full md:w-auto md:self-center">
            <Rating
              rating={game.rating}
              rating_count={game.rating_count}
              aggregated_rating={game.aggregated_rating}
              aggregated_rating_count={game.aggregated_rating_count}
            />
          </div>
        </GameHero>
      )}
      {!game && (
        <div className="h-52 flex items-center justify-center">
          <h3 className="text-3xl opacity-50">No game generated yet</h3>
        </div>
      )}
      <div className="w-full h-1 bg-primary"></div>
      {screenshotUrls.length > 0 && (
        <ScreenshotCarousel images={screenshotUrls} />
      )}
      <WhyDifferentCard />
    </>
  )
}

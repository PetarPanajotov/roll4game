'use client'
import { CurveSeparator } from '@/components/ui/curve-seperator/CurveSeperator'
import { GameCover } from '@/components/ui/game-cover/GameCover'
import { ScreenshotCarousel } from '@/components/ui/screenshot-carousel/ScreenshotCarousel'
import { IgdbGame } from '@/lib/igdb/igdb.types'
import { useEffect, useState } from 'react'
import { FilterCard, FilterFormData } from './_components/FilterCard'
import { Rating } from './_components/Rating'
import { WhyDifferentCard } from './_components/WhyDifferentCard'
import Loading from './loading'

export default function RandomPage() {
  /*TODO: Refactor this component. It can be split into smaller ones. */
  const [game, setGame] = useState<IgdbGame | null>(null)
  const [screenshotUrls, setScreenshotUrls] = useState<string[]>([])
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

  useEffect(() => {
    if (game && game.screenshots && game.screenshots.length > 0) {
      const screenshots = game.screenshots.map((screenshot) => screenshot.url)
      setScreenshotUrls([...screenshots])
    } else {
      setScreenshotUrls([])
    }
  }, [game])

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
        <>
          <main
            className="px-15 h-auto py-10 w-[100%] object-cover bg-top relative bg-no-repeat bg-cover before:absolute
    before:inset-0            
    before:bg-black/70          
    before:z-0                
    before:content-['']"
            style={{ backgroundImage: `url(${game.screenshots?.[0]?.url})` }}
          >
            <div className="flex flex-col md:flex-row justify-center items-start md:items-center relative z-10 gap-4 p-4">
              {/* Game Cover and Title Section */}
              <div className="flex gap-4 w-full md:w-auto">
                <GameCover
                  src={game.cover?.url ?? ''}
                  width={game.cover?.width}
                  height={game.cover?.height}
                  alt={`${game.name} cover`}
                  className="w-24 h-auto md:w-auto"
                />
                <div className="flex flex-col justify-start md:hidden flex-1">
                  <h2 className="text-xl font-bold leading-tight">
                    {game.name}
                  </h2>
                  {game.first_release_date && (
                    <p className="text-sm opacity-70 mt-1">
                      {new Intl.DateTimeFormat('en-BG', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      }).format(new Date(game.first_release_date * 1000))}
                    </p>
                  )}
                  {game.url && (
                    <a
                      href={game.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs underline mt-1"
                    >
                      View on IGDB
                    </a>
                  )}
                </div>
              </div>

              {/* Desktop Title Section */}
              <div className="hidden md:flex md:ps-8 flex-col md:w-[50%]">
                <div>
                  <h2 className="text-3xl font-bold">{game.name}</h2>
                  {game.first_release_date && (
                    <p className="text-lg opacity-70">
                      {new Intl.DateTimeFormat('en-BG', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      }).format(new Date(game.first_release_date * 1000))}
                    </p>
                  )}
                  {game.url && (
                    <a
                      href={game.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm underline"
                    >
                      View on IGDB
                    </a>
                  )}
                </div>
                <CurveSeparator />
                {game.genres && (
                  <p className="font-bold">
                    Genre:{' '}
                    <span className="font-normal">
                      {game.genres.map((genre) => genre.name).join(', ')}
                    </span>
                  </p>
                )}
                {game.platforms && (
                  <p className="font-bold">
                    Platforms:{' '}
                    <span className="font-normal">
                      {game.platforms
                        .map((platform) => platform.name)
                        .join(', ')}
                    </span>
                  </p>
                )}
                {game.summary && (
                  <p className="mt-4">{game.summary ?? 'No summary'}</p>
                )}
              </div>

              {/* Mobile Summary Section */}
              <div className="w-full md:hidden space-y-3">
                <CurveSeparator />
                {game.genres && (
                  <p className="text-sm">
                    <span className="font-bold">Genre: </span>
                    {game.genres.map((genre) => genre.name).join(', ')}
                  </p>
                )}
                {game.platforms && (
                  <p className="text-sm">
                    <span className="font-bold">Platforms: </span>
                    {game.platforms.map((platform) => platform.name).join(', ')}
                  </p>
                )}
                {game.summary && (
                  <div>
                    <p className="text-sm">{game.summary}</p>
                  </div>
                )}
              </div>
              <div className="w-full md:w-auto md:self-center">
                <Rating
                  rating={game.rating}
                  rating_count={game.rating_count}
                  aggregated_rating={game.aggregated_rating}
                  aggregated_rating_count={game.aggregated_rating_count}
                />
              </div>
            </div>
          </main>
        </>
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

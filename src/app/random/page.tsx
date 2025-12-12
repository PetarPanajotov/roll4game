'use client'
import { Card, CardBody, CardHeader } from '@/components/ui/card/Card'
import { GameCover } from '@/components/ui/game-cover/GameCover'
import { Label } from '@/components/ui/label/Label'
import RangeInput from '@/components/ui/range-input/RangeInput'
import { ScreenshotCarousel } from '@/components/ui/screenshot-carousel/ScreenshotCarousel'
import { TagSelectInput } from '@/components/ui/tag-select-input/TagSelectInput'
import {
  GAME_LEGACY_PLATFORMS,
  GAME_MODERN_PLATFORMS,
} from '@/lib/constants/game-platforms'
import { GENRES } from '@/lib/constants/genres'
import { IgdbGame } from '@/lib/igdb/igdb.types'
import { Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import Loading from './loading'
import { useFormState } from '@/hooks/useFormState'

export default function RandomPage() {
  /*TODO: Refactor this component. It can be split into smaller ones. */
  const [game, setGame] = useState<IgdbGame | null>(null)
  const [screenshotUrls, setScreenshotUrls] = useState<string[]>([])
  const [isLoading, setLoading] = useState<boolean>(false)
  const { form, setField, reset } = useFormState({
    platforms: [] as (string | number | object)[],
    genres: [] as (string | number | object)[],
    userScore: [0, 10] as number[],
    criticScore: [0, 10] as number[],
  })

  const fetchgame = async () => {
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
          <Card className="max-w-2xl w-[100%] p-6 bg-black/92">
            <CardHeader>
              <h1 className="text-2xl font-semibold text-center mb-4">
                Random Game Picker
              </h1>
            </CardHeader>
            <CardBody className="p-0">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-6">
                  <Label htmlFor="tag">Platform</Label>
                  <TagSelectInput
                    id="tag"
                    placeholder="Select platforms..."
                    options={[
                      { label: 'Modern', options: [...GAME_MODERN_PLATFORMS] },
                      { label: 'Legacy', options: [...GAME_LEGACY_PLATFORMS] },
                    ]}
                    value={form.platforms}
                    onChange={(v) => setField('platforms', v)}
                  />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <Label htmlFor="tag">Genres</Label>
                  <TagSelectInput
                    id="tag"
                    placeholder="Select Genres..."
                    options={[...GENRES]}
                    value={form.genres}
                    onChange={(v) => setField('genres', v)}
                  />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <Label>User Score</Label>
                  <RangeInput
                    marks={{ 0: '0', 5: '5', 10: '10' }}
                    value={form.userScore}
                    step={0.1}
                    onChange={(v) => setField('userScore', v)}
                  />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <Label>Critics Score</Label>
                  <RangeInput
                    marks={{ 0: '0', 5: '5', 10: '10' }}
                    value={form.criticScore}
                    step={0.1}
                    onChange={(v) => setField('criticScore', v)}
                  />
                </div>
                <div className="col-span-12 flex align-middle justify-center pt-6">
                  <button
                    onClick={fetchgame}
                    className="rounded-2xl font-bold bg-gray-800 px-12 py-1 cursor-pointer"
                  >
                    Roll for game
                  </button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
      <div className="w-full h-1 bg-purple-600"></div>
      {game && (
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
                <h2 className="text-xl font-bold leading-tight">{game.name}</h2>
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
              <svg
                className="separator"
                width="100%"
                height="60"
                viewBox="0 0 600 80"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="arcGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#667eea" stopOpacity="1" />
                    <stop offset="50%" stopColor="#764ba2" stopOpacity="1" />
                    <stop offset="100%" stopColor="#f093fb" stopOpacity="1" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0 60 Q 300 10, 600 60"
                  stroke="url(#arcGradient)"
                  strokeWidth="3"
                  fill="none"
                />
              </svg>
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
                    {game.platforms.map((platform) => platform.name).join(', ')}
                  </span>
                </p>
              )}
              {game.summary && (
                <p className="mt-4">{game.summary ?? 'No summary'}</p>
              )}
            </div>

            {/* Mobile Summary Section */}
            <div className="w-full md:hidden space-y-3">
              <svg
                className="separator"
                width="100%"
                height="40"
                viewBox="0 0 600 80"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="arcGradientMobile"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#667eea" stopOpacity="1" />
                    <stop offset="50%" stopColor="#764ba2" stopOpacity="1" />
                    <stop offset="100%" stopColor="#f093fb" stopOpacity="1" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0 60 Q 300 10, 600 60"
                  stroke="url(#arcGradientMobile)"
                  strokeWidth="3"
                  fill="none"
                />
              </svg>
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

            {/* TODO: Hardcoded Ratings Section */}
            <div className="w-full md:w-auto md:self-center">
              <div className="flex flex-row md:flex-col gap-6 md:gap-0 justify-around md:justify-start">
                <div className="flex flex-col gap-1 items-center">
                  <h4 className="text-lg md:text-xl text-center font-bold">
                    Players score
                  </h4>
                  <div className="flex gap-2 md:gap-3 items-center">
                    <Star
                      className="fill-green-700 text-green-600"
                      strokeWidth={1}
                      size={36}
                    />
                    <span className="text-3xl md:text-4xl leading-none">
                      {game.rating ? (game.rating / 10).toFixed(1) : 'NaN'}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-center">
                    Based on{' '}
                    <span className="font-bold underline">
                      {game.rating_count ?? 0}
                    </span>{' '}
                    player reviews
                  </p>
                </div>
                <div className="flex flex-col gap-1 items-center md:pt-12">
                  <h4 className="text-lg md:text-xl text-center font-bold">
                    Critics score
                  </h4>
                  <div className="flex gap-2 md:gap-3 items-center">
                    <Star
                      className="fill-orange-200 text-orange-100"
                      strokeWidth={1}
                      size={36}
                    />
                    <span className="text-3xl md:text-4xl leading-none">
                      {game.aggregated_rating
                        ? (game.aggregated_rating / 10).toFixed(1)
                        : 'NaN'}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-center">
                    Based on{' '}
                    <span className="font-bold underline">
                      {game.aggregated_rating_count ?? 0}
                    </span>{' '}
                    critic reviews
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
      <div className="w-full h-1 bg-purple-600"></div>
      {screenshotUrls.length > 0 && (
        <ScreenshotCarousel images={screenshotUrls} />
      )}
    </>
  )
}

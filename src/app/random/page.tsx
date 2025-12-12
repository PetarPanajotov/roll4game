'use client'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { GameCover } from '@/components/ui/game-cover/GameCover'
import { Label } from '@/components/ui/label'
import RangeInput from '@/components/ui/range-input/RangeInput'
import { ScreenshotCarousel } from '@/components/ui/screenshot-carousel/ScreenshotCarousel'
import { TagSelectInput } from '@/components/ui/tag-select-input'
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
    fetchgame()
  }, [])

  useEffect(() => {
    if (game && game.screenshots && game.screenshots.length > 0) {
      const screenshots = game.screenshots.map((screenshot) => screenshot.url)
      setScreenshotUrls([...screenshots])
    }
  }, [game])

  return (
    <>
      {isLoading && <Loading />}
      <div className="bg-[url('/mountain-bg.png')] w-[100%] object-cover bg-center h-120 bg-no-repeat bg-cover">
        <div className="flex justify-center align items-center h-[100%] w-[100%]">
          <Card className="max-w-2xl w-[100%] p-6">
            <CardHeader>
              <h1 className="text-2xl font-semibold text-center mb-4">
                Random Game Picker
              </h1>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6">
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
                <div className="col-span-6">
                  <Label htmlFor="tag">Genres</Label>
                  <TagSelectInput
                    id="tag"
                    placeholder="Select Genres..."
                    options={[...GENRES]}
                    value={form.genres}
                    onChange={(v) => setField('genres', v)}
                  />
                </div>
                <div className="col-span-6">
                  <Label>User Score</Label>
                  <RangeInput
                    marks={{ 0: '0', 5: '5', 10: '10' }}
                    value={form.userScore}
                    step={0.1}
                    onChange={(v) => setField('userScore', v)}
                  />
                </div>
                <div className="col-span-6">
                  <Label>Critics Score</Label>
                  <RangeInput
                    marks={{ 0: '0', 5: '5', 10: '10' }}
                    value={form.criticScore}
                    onChange={(v) => setField('criticScore', v)}
                  />
                </div>
                <div className="col-span-12 flex align-middle justify-center pt-6">
                  <button
                    onClick={fetchgame}
                    className="rounded-2xl font-bold bg-gray-800 px-12 py-1"
                  >
                    Roll for game
                  </button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
      <div className="w-full h-2 bg-purple-600"></div>
      {game && (
        <main
          className="px-15 h-auto py-10 w-[100%] object-cover bg-top relative bg-no-repeat bg-cover before:absolute
    before:inset-0            
    before:bg-black/70          
    before:z-0                
    before:content-['']"
          style={{ backgroundImage: `url(${game.screenshots?.[0]?.url})` }}
        >
          <div className="flex justify-center relative z-10 gap-4">
            {
              <GameCover
                src={game.cover?.url ?? ''}
                width={game.cover?.width}
                height={game.cover?.height}
                alt={`${game.name} cover`}
              />
            }
            <div className="ps-8 flex flex-col w-[50%]">
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
                  Pltaforms:{' '}
                  <span className="font-normal">
                    {game.platforms.map((platform) => platform.name).join(', ')}
                  </span>
                </p>
              )}
              {game.summary && (
                <p className="mt-4">{game.summary ?? 'No summary'}</p>
              )}
            </div>
            <div className="self-center">
              <div className="flex flex-col gap-1 items-center">
                <h4 className="text-xl text-center font-bold">Players score</h4>
                <div className="flex gap-3 items-center">
                  <Star
                    className="fill-green-700 text-green-600"
                    strokeWidth={1}
                    size={48}
                  />
                  <span className="text-4xl leading-none">{86 / 10}</span>
                </div>

                <p className="text-sm">Based on 537 player reviews</p>
              </div>
              <div className="flex flex-col gap-1 items-center pt-12">
                <h4 className="text-xl text-center font-bold">Critics score</h4>
                <div className="flex gap-3 items-center">
                  <Star
                    className="fill-orange-200 text-orange-100"
                    strokeWidth={1}
                    size={48}
                  />
                  <span className="text-4xl leading-none">{86 / 10}</span>
                </div>

                <p className="text-sm">Based on 537 critic reviews</p>
              </div>
            </div>
          </div>
        </main>
      )}
      <ScreenshotCarousel images={screenshotUrls} />
      <button onClick={fetchgame} className="mt-6 px-4 py-2 rounded border">
        Pick another
      </button>
    </>
  )
}

'use client'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import RangeInput from '@/components/ui/range-input/RangeInput'
import { TagSelectInput } from '@/components/ui/tag-select-input'
import {
  GAME_LEGACY_PLATFORMS,
  GAME_MODERN_PLATFORMS,
} from '@/lib/constants/game-platforms'
import { GENRES } from '@/lib/constants/genres'
import { Game } from '@/types/game.types'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Loading from './loading'
import { IgdbGame } from '@/lib/igdb/igdb.types'
import { normalizeUrl } from '@/lib/normalizeUrl'
import { GameCover } from '@/components/ui/game-cover/GameCover'
import { ScreenshotCarousel } from '@/components/ui/screenshot-carousel/ScreenshotCarousel'

export default function RandomPage() {
  const [game, setGame] = useState<IgdbGame | null>(null)
  const [screenshotUrls, setScreenshotUrls] = useState<string[]>([])
  const [isLoading, setLoading] = useState<boolean>(false)

  const fetchgame = async () => {
    setLoading(true)
    return await fetch('/api/random-game', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
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
                  />
                </div>
                <div className="col-span-6">
                  <Label htmlFor="tag">Genres</Label>
                  <TagSelectInput
                    id="tag"
                    placeholder="Select Genres..."
                    options={[...GENRES]}
                  />
                </div>
                <div className="col-span-6">
                  <Label>User Score</Label>
                  <RangeInput
                    marks={{ 0: '0', 50: '50', 100: '100' }}
                    defaultValue={[0, 100]}
                  />
                </div>
                <div className="col-span-6">
                  <Label>Critics Score</Label>
                  <RangeInput
                    marks={{ 0: '0', 50: '50', 100: '100' }}
                    defaultValue={[0, 100]}
                  />
                </div>
                <div className="col-span-12 flex align-middle justify-center pt-6">
                  <button className="rounded-2xl font-bold bg-gray-800 px-12 py-1">
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
          className="px-15 h-auto py-10 w-[100%] object-cover bg-center relative bg-no-repeat bg-cover before:absolute
    before:inset-0            
    before:bg-black/70          
    before:z-0                
    before:content-['']"
          style={{ backgroundImage: `url(${game.screenshots?.[0]?.url})` }}
        >
          <div className="flex justify-center relative z-10">
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
              {game.summary && (
                <p className="mt-4">{game.summary ?? 'No summary'}</p>
              )}
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

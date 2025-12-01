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

export default function RandomPage() {
  const [game, setGame] = useState<Game | null>(null)
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
      .then((data: Game) => {
        setGame(data)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchgame()
  }, [])

  return (
    <React.Fragment>
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
      <main className="max-w-2xl mx-auto p-6">
        {game && (
          <div
            className={`bg-card rounded-2xl border p-4 shadow-sm bg-cover bg-center bg-no-repeat`}
          >
            <header className="flex gap-4 items-start">
              {game.cover && (
                <Image
                  src={game?.cover.url}
                  alt={`${game.name} cover`}
                  width={200}
                  height={150}
                />
              )}
              <div>
                <h2 className="text-xl font-bold">{game.name}</h2>
                {game.first_release_date && (
                  <p className="text-sm opacity-70">
                    {new Date(game.first_release_date * 1000).getFullYear()}
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
            </header>

            {game.summary && <p className="mt-4">{game.summary}</p>}
          </div>
        )}
        <button onClick={fetchgame} className="mt-6 px-4 py-2 rounded border">
          Pick another
        </button>
      </main>
    </React.Fragment>
  )
}

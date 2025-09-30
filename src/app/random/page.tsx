'use client'
import { Game } from '@/types/game.types'
import { Suspense, useEffect, useState } from 'react'
import Loading from './loading'
import Image from 'next/image'
import React from 'react'

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
      <main className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Random Game</h1>

        {game && (
          <article className="rounded-2xl border p-4 shadow-sm">
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
          </article>
        )}

        {/* Simple reload (server re-render) */}
        <button onClick={fetchgame} className="mt-6 px-4 py-2 rounded border">
          Pick another
        </button>
      </main>
    </React.Fragment>
  )
}

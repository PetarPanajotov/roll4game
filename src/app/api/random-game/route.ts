import { fetchGameCoverById, getRandomGame } from '@/lib/igdb'
import { NextRequest } from 'next/server'

// Proxy the request from IGDB. Transform the cover to  valid url path.
export async function GET(request: NextRequest) {
  const game = await getRandomGame()
  const cover = game?.cover ? await fetchGameCoverById(game.cover) : null

  const transformed = { ...game, cover: { ...cover } }
  return new Response(JSON.stringify(transformed))
}

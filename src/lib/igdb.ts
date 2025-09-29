import 'server-only'
import { getTwitchToken } from './twitchToken'
import { unstable_cache } from 'next/cache'

const IGDB_GAMESENDPOINT = 'https://api.igdb.com/v4/games'
const IGDB_COVERENDPOINT = 'https://api.igdb.com/v4/covers'

type IgdbGame = {
  id: number
  name: string
  cover?: number
  first_release_date?: number
  summary?: string
  url?: string
}

type IgdbCover = {
  height: number
  id: number
  image_id: string
  width: number
  url: string
}

async function igdbGamesRequest(query: string): Promise<Response> {
  const token = await getTwitchToken()

  return fetch(IGDB_GAMESENDPOINT, {
    method: 'POST',
    headers: {
      'Client-ID': process.env.AUTH_TWITCH_ID!,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'text/plain',
    },
    body: query,
    cache: 'no-store',
  })
}

async function fetchGamesCount(): Promise<number> {
  const token = await getTwitchToken()

  const res = await igdbGamesRequest('*;')

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`IGDB count error: ${res.status} ${text}`)
  }

  return Number(res.headers.get('x-count') ?? 0)
}

export const getGamesCountCached = unstable_cache(
  async () => fetchGamesCount(),
  ['igdb-games-count'],
  { revalidate: 86_400 }
)

async function fetchOneAt(offset: number): Promise<IgdbGame | null> {
  const q = `
    fields cover, name, url, summary, first_release_date;
    limit 1;
    offset ${offset};
  `
  const data = await igdbGamesRequest(q)
    .then((res) => {
      return res.json()
    })
    .catch((err) => {
      throw new Error('igdbFetch failed:', err)
    })
  return data?.[0] ?? null
}

export async function fetchGameCoverById(coverId: number): Promise<IgdbCover> {
  const token = await getTwitchToken()

  try {
    const res = await fetch(IGDB_COVERENDPOINT, {
      method: 'POST',
      headers: {
        'Client-ID': process.env.AUTH_TWITCH_ID!,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'text/plain',
      },
      body: `fields id,height,image_id,url,width; where id = ${coverId};`,
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`IGDB cover fetch failed: ${res.status} ${text}`)
    }

    const data: any[] = await res.json()
    const cover = data?.[0] ?? null

    if (cover?.url) {
      // Replace the default "t_thumb" with "t_cover_big"
      cover.url = cover.url.replace('t_thumb', 't_cover_big')
    }

    return cover
  } catch (err) {
    throw new Error('igdbFetch failed', { cause: err })
  }
}

export async function getRandomGame(): Promise<IgdbGame | null> {
  const count = await getGamesCountCached()
  const offset = Math.floor(Math.random() * Math.max(1, Number(count)))
  return fetchOneAt(offset)
}

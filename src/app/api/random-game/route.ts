import { IgdbClient } from '@/lib/igdb/igdbClient'
import { IgdbGame } from '@/lib/igdb/igdb.types'
import { NextRequest, NextResponse } from 'next/server'

function transformIgdbImage(url: string, size: string) {
  let out = url.replace(/t_.+?\//, `${size}/`)
  out = out.replace(/\.(jpg|jpeg|png)$/, '.webp')
  return 'https:' + out
}

type Filters = {
  platforms?: (string | number)[]
  genres?: (string | number)[]
  userScore?: number[]
  criticScore?: number[]
}

function buildWhere(filters: Filters) {
  const parts: string[] = []
  if (filters.platforms?.length) {
    parts.push(`platforms = (${filters.platforms.join(',')})`)
  }

  if (filters.genres?.length) {
    parts.push(`genres = (${filters.genres.join(',')})`)
  }

  if (filters.userScore?.length === 2) {
    const [min, max] = filters.userScore

    /* This is important, as if we send even 0, it wont look for games with no raiting present. */
    if (min !== 0) {
      parts.push(`rating >= ${min * 10} & rating <= ${max * 10}`)
    }
  }

  if (filters.criticScore?.length === 2) {
    const [min, max] = filters.criticScore

    /* This is important, as if we send even 0, it wont look for games with no aggregated_rating present. */
    if (min !== 0) {
      parts.push(
        `aggregated_rating >= ${min * 10} & aggregated_rating <= ${max * 10}`
      )
    }
  }

  return parts.join(' & ')
}

export async function POST(req: NextRequest) {
  try {
    const filters = (await req.json()) as Filters
    const where = buildWhere(filters)

    const igdb = new IgdbClient()
    const game = await igdb.getRandomGame({ where })
    const g = game[0]

    if (!g) {
      return NextResponse.json(
        { error: 'No game matched filters' },
        { status: 404 }
      )
    }

    if (g.cover?.url) {
      g.cover.url = transformIgdbImage(g.cover.url, 't_cover_big')
    }

    if (g.screenshots?.length) {
      g.screenshots = g.screenshots.map((shot) =>
        shot.url
          ? { ...shot, url: transformIgdbImage(shot.url, 't_1080p') }
          : shot
      )
    }

    return NextResponse.json<IgdbGame>(g, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch game' }, { status: 500 })
  }
}

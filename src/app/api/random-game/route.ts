import { IgdbGame } from '@/lib/igdb/igdb.types'
import { IgdbClient } from '@/lib/igdb/igdbClient'
import { NextRequest, NextResponse } from 'next/server'

function transformIgdbImage(url: string, size: string) {
  // Replace size section (t_thumb, t_screenshot_med, etc.)
  let out = url.replace(/t_.+?\//, `${size}/`)
  // Replace extension with webp
  out = out.replace(/\.(jpg|jpeg|png)$/, '.webp')
  // Add https:
  return 'https:' + out
}

export async function GET(request: NextRequest) {
  try {
    const igdb = new IgdbClient()
    const game = await igdb.getRandomGame()
    const g = game[0]

    // Transform cover
    if (g.cover?.url) {
      g.cover.url = transformIgdbImage(g.cover.url, 't_cover_big')
    }

    // Transform screenshots
    if (g.screenshots?.length) {
      g.screenshots = g.screenshots.map((shot) => {
        if (!shot.url) return shot
        return {
          ...shot,
          url: transformIgdbImage(shot.url, 't_1080p'),
        }
      })
    }

    return NextResponse.json<IgdbGame>(g, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch game' }, { status: 500 })
  }
}

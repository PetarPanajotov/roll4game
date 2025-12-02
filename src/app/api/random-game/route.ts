import { fetchGameCoverById, getRandomGame } from '@/lib/igdb'
import { IgdbGame } from '@/lib/igdb/igdb.types'
import { IgdbClient } from '@/lib/igdb/igdbClient'
import { normalizeUrl } from '@/lib/normalizeUrl'
import { NextRequest, NextResponse } from 'next/server'

// Proxy the request from IGDB. Transform the cover to  valid url path.
export async function GET(request: NextRequest) {
  try {
    const igdb = new IgdbClient()
    const game = await igdb.getRandomGame()

    // Return typed response
    return NextResponse.json<IgdbGame>(game[0], {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch game' }, { status: 500 })
  }
}

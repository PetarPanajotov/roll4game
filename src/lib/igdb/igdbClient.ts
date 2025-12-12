import { getTwitchToken } from '../twitchToken'
import { IgdbGame } from './igdb.types'

export class IgdbClient {
  IGDB_GAMESENDPOINT = 'https://api.igdb.com/v4/games'
  IGDB_COVERENDPOINT = 'https://api.igdb.com/v4/covers'

  private async igdbGamesRequest(query: string): Promise<Response> {
    const token = await getTwitchToken()

    const res = await fetch(this.IGDB_GAMESENDPOINT, {
      method: 'POST',
      headers: {
        'Client-ID': process.env.AUTH_TWITCH_ID!,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'text/plain',
      },
      body: query,
      cache: 'no-store',
    })

    if (!res.ok) {
      throw new Error(`IGDB error: ${res.status} ${await res.text()}`)
    }

    return res
  }

  public async getGames(opts: {
    fields?: string
    where?: string
    limit?: number
    offset?: number
  }): Promise<IgdbGame[]> {
    const {
      fields = 'aggregated_rating,aggregated_rating_count,cover.*,first_release_date,genres.name,id,name,platforms.name,rating,rating_count,screenshots.*,summary,videos.*,url',
      where = '',
      limit = 20,
      offset = 0,
    } = opts

    const query = `
      fields ${fields};
      ${where ? `where ${where};` : ''}
      limit ${limit};
      offset ${offset};
    `

    console.log(query)

    const res = await this.igdbGamesRequest(query)
    return res.json()
  }

  public async getGamesCount(where?: string): Promise<number> {
    const query = `
    fields id;
    ${where ? `where ${where};` : ''}
    limit 1;
  `

    const res = await this.igdbGamesRequest(query)
    return Number(res.headers.get('x-count') ?? 0)
  }

  public async getRandomGame(opts?: { where?: string }) {
    const where = opts?.where ?? ''
    const count = await this.getGamesCount(where)

    if (count <= 0) return []

    const offset = Math.floor(Math.random() * count)

    return this.getGames({
      offset,
      limit: 1,
      where,
    })
  }
}

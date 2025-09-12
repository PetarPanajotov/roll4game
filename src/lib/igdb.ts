import 'server-only';
import { getTwitchToken } from './twitchToken';
import { off } from 'process';

const IGDB_ENDPOINT = 'https://api.igdb.com/v4/games';

const IGDB_FILTER = `
  where category = 0 & total_rating_count >= 50 & aggregated_rating != null;
`;

type IgdbGame = {
  id: number;
  name: string;
  cover?: { image_id: string } | number;
  first_release_date?: number;
  summary?: string;
  url?: string;
};

async function igdbGamesRequest(query: string): Promise<Response> {
    const token = await getTwitchToken();

    return fetch(IGDB_ENDPOINT, {
    method: 'POST',
    headers: {
      'Client-ID': process.env.AUTH_TWITCH_ID!,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'text/plain',
    },
    body: query,
    cache: 'no-store',
  });
}


async function fetchOneAt(offset: number): Promise<IgdbGame | null> {
  const q = `
    fields *;
    sort total_rating desc;
    limit 1;
    offset ${offset};
  `;
  const data = await igdbGamesRequest(q).then((res) => {
    return res.json();
  }).catch(err => {
    throw new Error("igdbFetch failed:", err);
  });
  return data?.[0] ?? null;
}

export async function getRandomGame(): Promise<IgdbGame | null> {
  const count = await igdbGamesRequest('*;').then(response => {
    return response.headers.get('x-count')
  });
  const offset = Math.floor(Math.random() * Math.max(1, Number(count)));
  return fetchOneAt(offset)
}

export function igdbCoverUrl(imageId: string, size: 'cover_big' | 'cover_small' = 'cover_big') {
  return `https://images.igdb.com/igdb/image/upload/t_${size}/${imageId}.jpg`;
}
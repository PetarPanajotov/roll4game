import 'server-only'

type CachedToken = { value: string; expiresAt: number } | null

const g = globalThis as { __twitchToken?: CachedToken }
g.__twitchToken ??= null

export async function getTwitchToken(): Promise<string> {
  if (g.__twitchToken && Date.now() < g.__twitchToken.expiresAt - 60_000) {
    return g.__twitchToken.value
  }

  const params = new URLSearchParams({
    client_id: process.env.AUTH_TWITCH_ID!,
    client_secret: process.env.AUTH_TWITCH_SECRET!,
    grant_type: 'client_credentials',
  })

  const res = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
    cache: 'no-store',
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(`Twitch token error: ${JSON.stringify(data)}`)
  }

  g.__twitchToken = {
    value: data.access_token as string,
    expiresAt: Date.now() + (data.expires_in as number) * 1000,
  }

  return g.__twitchToken.value
}

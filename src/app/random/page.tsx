import { getRandomGame, igdbCoverUrl } from '@/lib/igdb'
export const revalidate = 0 // no caching
export const dynamic = 'force-dynamic' // always render on server

export default async function RandomPage() {
  const game = await getRandomGame()

  if (!game) {
    return (
      <main className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Random Game</h1>
        <p>Couldn’t find a game. Try again.</p>
        <form>
          <button formAction="" className="mt-4 px-4 py-2 rounded border">
            Try again
          </button>
        </form>
      </main>
    )
  }

  const cover =
    typeof game.cover === 'object' && game.cover?.image_id
      ? igdbCoverUrl(game.cover.image_id, 'cover_big')
      : null

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Random Game</h1>

      <article className="rounded-2xl border p-4 shadow-sm">
        <header className="flex gap-4 items-start">
          {cover && (
            <img
              src={cover}
              alt={`${game.name} cover`}
              className="w-32 h-44 object-cover rounded"
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

      {/* Simple reload (server re-render) */}
      <form>
        <button formAction="" className="mt-6 px-4 py-2 rounded border">
          Pick another
        </button>
      </form>
    </main>
  )
}

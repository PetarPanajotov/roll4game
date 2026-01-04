import { IgdbGenre, IgdbPlatform } from '@/lib/igdb/igdb.types'

export interface GameMetadataProps {
  genres?: IgdbGenre[]
  platforms?: IgdbPlatform[]
}

export function GameMetadata({ genres, platforms }: GameMetadataProps) {
  const formatList = (items?: { name: string }[]) =>
    items?.map((i) => i.name).join(', ') || null

  const genreList = formatList(genres)
  const platformList = formatList(platforms)

  return (
    <>
      {genres && (
        <p className="text-sm md:text-base">
          <span className="font-bold">Genres: </span>
          <i>{genreList}</i>
        </p>
      )}
      {platforms && (
        <p className="text-sm md:text-base">
          <span className="font-bold">Platforms: </span>
          <i>{platformList}</i>
        </p>
      )}
    </>
  )
}

export interface GameTitleProps {
  name: string
  releaseDate?: number
  url?: string
}

export function GameTitle({ name, releaseDate, url }: GameTitleProps) {
  const formattedDate = releaseDate
    ? new Intl.DateTimeFormat('en-BG', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(releaseDate * 1000))
    : null

  return (
    <div className="flex flex-col justify-start gap-1 flex-1">
      <h2 className="text-xl font-bold">{name}</h2>
      {formattedDate && <p className="text-sm opacity-70">{formattedDate}</p>}
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="text-xs inline underline"
        >
          View on IGDB
        </a>
      )}
    </div>
  )
}

export interface GameSummaryProps {
  summary?: string
}

export function GameSummary({ summary }: GameSummaryProps) {
  return (
    <>
      {summary && (
        <div className="">
          <p className="text-sm md:text-base">{summary}</p>
        </div>
      )}
    </>
  )
}

import { Star } from 'lucide-react'

export function Rating({
  rating = 0,
  rating_count = 0,
  aggregated_rating = 0,
  aggregated_rating_count = 0,
}) {
  return (
    <div className="flex flex-row md:flex-col gap-6 md:gap-0 justify-around md:justify-start">
      <div className="flex flex-col gap-1 items-center">
        <h4 className="text-lg md:text-xl text-center font-bold">
          Players score
        </h4>
        <div className="flex gap-2 md:gap-3 items-center">
          <Star
            className="fill-green-700 text-green-600"
            strokeWidth={1}
            size={36}
          />
          <span className="text-3xl md:text-4xl leading-none">
            {rating ? (rating / 10).toFixed(1) : 'NaN'}
          </span>
        </div>
        <p className="text-xs md:text-sm text-center">
          Based on{' '}
          <span className="font-bold underline">{rating_count ?? 0}</span>{' '}
          player reviews
        </p>
      </div>
      <div className="flex flex-col gap-1 items-center md:pt-12">
        <h4 className="text-lg md:text-xl text-center font-bold">
          Critics score
        </h4>
        <div className="flex gap-2 md:gap-3 items-center">
          <Star
            className="fill-orange-200 text-orange-100"
            strokeWidth={1}
            size={36}
          />
          <span className="text-3xl md:text-4xl leading-none">
            {aggregated_rating ? (aggregated_rating / 10).toFixed(1) : 'NaN'}
          </span>
        </div>
        <p className="text-xs md:text-sm text-center">
          Based on{' '}
          <span className="font-bold underline">
            {aggregated_rating_count ?? 0}
          </span>{' '}
          critic reviews
        </p>
      </div>
    </div>
  )
}

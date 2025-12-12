import Image, { ImageProps } from 'next/image'
import { normalizeUrl } from '@/lib/normalizeUrl'
import { useState } from 'react'

type GameCoverProps = ImageProps & {
  fallback?: string
}

export function GameCover({
  width = 300,
  height = 450,
  loading = 'lazy',
  fallback = 'Cover is missing',
  src,
  alt,
  ...props
}: GameCoverProps) {
  const [error, setError] = useState(false)

  if (!src || error) {
    return (
      <div
        style={{
          width,
          height,
        }}
        className="flex items-center justify-center bg-neutral-800 text-white text-sm md:text-lg rounded-lg !w-[100px] !h-[150px] sm:!h-[250px]  sm:!w-[150px] md:!h-[450px] md:!w-[300px]"
      >
        {fallback}
      </div>
    )
  }

  return (
    <Image
      className={`self-center !w-[100px] !h-[150px] sm:!h-[250px]  sm:!w-[150px] md:!h-[450px] md:!w-[300px]  rounded-lg`}
      src={normalizeUrl(src as string)}
      alt={alt ?? 'IGDB cover'}
      loading={loading}
      width={width}
      height={height}
      onError={() => setError(true)}
    />
  )
}

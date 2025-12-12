import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

type ScreenshotCarouselProps = {
  images: string[]
}

export function ScreenshotCarousel({ images }: ScreenshotCarouselProps) {
  const [start, setStart] = useState(0)
  const [visibleCount, setVisibleCount] = useState(3)

  const canPrev = start > 0
  const canNext = start + visibleCount < images.length

  const containerRef = useRef<HTMLDivElement>(null)
  const dragStartX = useRef(0)
  const dragOffset = useRef(0)
  const isDragging = useRef(false)

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setVisibleCount(1)
      else if (window.innerWidth < 1024) setVisibleCount(2)
      else setVisibleCount(3)
    }

    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const handlePrev = () => canPrev && setStart((s) => s - 1)
  const handleNext = () => canNext && setStart((s) => s + 1)

  const onDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true
    dragOffset.current = 0
    dragStartX.current = 'touches' in e ? e.touches[0].clientX : e.clientX
  }

  const onDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging.current) return

    const x = 'touches' in e ? e.touches[0].clientX : e.clientX
    dragOffset.current = x - dragStartX.current

    const track = containerRef.current
    if (track) {
      track.style.transition = 'none'
      track.style.transform = `translateX(calc(-${
        (start * 100) / visibleCount
      }% + ${dragOffset.current}px))`
    }
  }

  const onDragEnd = () => {
    if (!isDragging.current) return
    isDragging.current = false

    const threshold = 50
    if (dragOffset.current > threshold && canPrev) {
      setStart((s) => s - 1)
    } else if (dragOffset.current < -threshold && canNext) {
      setStart((s) => s + 1)
    }

    const track = containerRef.current
    if (track) {
      track.style.transition = 'transform 0.3s ease'
      track.style.transform = `translateX(-${(start * 100) / visibleCount}%)`
    }
  }

  return (
    <div
      className="py-8 flex items-center gap-4 bg-black select-none"
      onMouseLeave={onDragEnd}
    >
      {/* Prev */}
      <button
        onClick={handlePrev}
        disabled={!canPrev}
        className="rounded-full border cursor-pointer border-neutral-600 p-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent hover:bg-neutral-800"
      >
        <ChevronLeft />
      </button>

      {/* Viewport */}
      <div
        className="overflow-hidden flex-1"
        onMouseDown={onDragStart}
        onMouseMove={onDragMove}
        onMouseUp={onDragEnd}
        onTouchStart={onDragStart}
        onTouchMove={onDragMove}
        onTouchEnd={onDragEnd}
      >
        <div
          ref={containerRef}
          className="flex transition-transform duration-300 ease-out"
          style={{
            transform: `translateX(-${(start * 100) / visibleCount}%)`,
          }}
        >
          {images.map((src, i) => (
            <div
              key={i}
              className="px-2"
              style={{ flex: `0 0 ${100 / visibleCount}%` }}
            >
              <img
                src={src}
                className="w-full h-auto rounded-lg object-cover pointer-events-none"
                alt=""
              />
            </div>
          ))}
        </div>
      </div>

      {/* Next */}
      <button
        onClick={handleNext}
        disabled={!canNext}
        className="rounded-full border cursor-pointer border-neutral-600 p-2 text-sm disabled:opacity-40 hover:bg-neutral-800"
      >
        <ChevronRight />
      </button>
    </div>
  )
}

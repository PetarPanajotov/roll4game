import React, {
  CSSProperties,
  ReactNode,
  useMemo,
  useRef,
  useState,
} from 'react'
import styles from './RangeInput.module.scss'

type RangeSliderProps = {
  min?: number
  max?: number
  step?: number
  value?: [number, number]
  defaultValue?: [number, number]
  marks?: Marks
  onChange?: (value: [number, number]) => void
}

type MarkObject = {
  style?: CSSProperties
  label: ReactNode
}

type MarkValue = ReactNode | MarkObject

type Marks = Record<number, MarkValue>

export type NormalizedMark = {
  value: number
  left: number
  label: ReactNode
  style: CSSProperties
}

export default function RangeInput({
  min = 0,
  max = 100,
  step = 1,
  marks = {},
  defaultValue = [20, 80],
  onChange,
}: RangeSliderProps) {
  const [range, setRange] = useState<[number, number]>(defaultValue)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const dragging = useRef<'min' | 'max' | null>(null)

  const pct = (value: number) => ((value - min) / (max - min)) * 100

  const leftValue = Math.min(range[0], range[1])
  const rightValue = Math.max(range[0], range[1])

  const leftPct = pct(leftValue)
  const widthPct = pct(rightValue) - pct(leftValue)

  const normalizedMarks = useMemo(
    () => normalizeMarks(marks, min, max),
    [marks, min, max]
  )

  const updateValue = (clientX: number, forcedThumb?: 'min' | 'max') => {
    if (!trackRef.current) return

    const rect = trackRef.current.getBoundingClientRect()
    let ratio = (clientX - rect.left) / rect.width
    ratio = Math.min(1, Math.max(0, ratio))

    // convert to stepped value
    const newValue = Math.round((min + ratio * (max - min)) / step) * step

    let [valMin, valMax] = range
    const thumb = forcedThumb ?? dragging.current
    if (!thumb) return

    if (thumb === 'min') {
      valMin = newValue
    } else if (thumb === 'max') {
      valMax = newValue
    }

    const next: [number, number] = [valMin, valMax]
    setRange(next)
    onChange?.(next)
  }

  const startDrag = (thumb: 'min' | 'max') => (e: React.PointerEvent) => {
    dragging.current = thumb
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const onMove = (e: React.PointerEvent) => {
    if (!dragging.current) return
    updateValue(e.clientX)
  }

  const stopDrag = (e: React.PointerEvent) => {
    dragging.current = null
    ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
  }

  const handleTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!trackRef.current) return

    const target = e.target as HTMLElement

    // Ignore clicks on thumbs – let drag logic handle these
    if (target.classList.contains(styles.riThumb)) {
      return
    }

    const rect = trackRef.current.getBoundingClientRect()
    let ratio = (e.clientX - rect.left) / rect.width
    ratio = Math.min(1, Math.max(0, ratio))

    const clickedValue = Math.round((min + ratio * (max - min)) / step) * step

    const [valMin, valMax] = range
    const distToMin = Math.abs(clickedValue - valMin)
    const distToMax = Math.abs(clickedValue - valMax)

    const closestThumb: 'min' | 'max' = distToMin <= distToMax ? 'min' : 'max'

    updateValue(e.clientX, closestThumb)
  }

  return (
    <div className={styles.riWrapper}>
      <div
        className={styles.riTrack}
        ref={trackRef}
        onPointerDown={handleTrackPointerDown}
      >
        <div
          className={styles.riRange}
          style={{
            left: `${leftPct}%`,
            width: `${widthPct}%`,
          }}
        />
        <div
          className={styles.riThumb}
          style={{ left: `${pct(range[0])}%` }}
          onPointerDown={startDrag('min')}
          onPointerMove={onMove}
          onPointerUp={stopDrag}
          onPointerEnter={(e) =>
            e.currentTarget.classList.add(styles.riThumbActive)
          }
          onPointerLeave={(e) =>
            e.currentTarget.classList.remove(styles.riThumbActive)
          }
        />
        <div
          className={styles.riThumb}
          style={{ left: `${pct(range[1])}%` }}
          onPointerDown={startDrag('max')}
          onPointerMove={onMove}
          onPointerUp={stopDrag}
          onPointerEnter={(e) =>
            e.currentTarget.classList.add(styles.riThumbActive)
          }
          onPointerLeave={(e) =>
            e.currentTarget.classList.remove(styles.riThumbActive)
          }
        />
        {/* MARKS */}
        {normalizedMarks.map((mark) => (
          <div
            key={mark.value}
            className={styles.riMark}
            style={{ left: `${mark.left}%` }}
          >
            <div className={styles.riMarkDot} />
            <div className={styles.riMarkLabel} style={mark.style}>
              {mark.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function normalizeMarks(
  marks: Marks | undefined,
  min: number,
  max: number
): NormalizedMark[] {
  if (!marks || min === max) return []

  return Object.entries(marks).reduce<NormalizedMark[]>((acc, [key, mark]) => {
    const value = Number(key)
    if (Number.isNaN(value)) return acc

    // ignore values outside [min, max]
    if (value < min || value > max) return acc

    const left = ((value - min) / (max - min)) * 100

    let label: ReactNode
    let style: CSSProperties = {}

    if (isMarkObject(mark)) {
      label = mark.label
      style = mark.style ?? {}
    } else {
      label = mark
    }

    acc.push({ value, left, label, style })
    return acc
  }, [])
}

function isMarkObject(mark: MarkValue): mark is MarkObject {
  return typeof mark === 'object' && mark !== null && 'label' in mark
}

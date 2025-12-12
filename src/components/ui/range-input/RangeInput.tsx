import React, {
  CSSProperties,
  ReactNode,
  useMemo,
  useRef,
  useState,
} from 'react'
import styles from './RangeInput.module.scss'
import {
  MarkObject,
  Marks,
  MarkValue,
  NormalizedMark,
  RangeSliderProps,
} from './RangeInput.types'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/Tooltip'

export default function RangeInput({
  min = 0,
  max = 10,
  step = 1,
  marks = {},
  defaultValue = [0, 10],
  value,
  onChange,
}: RangeSliderProps) {
  const stepDecimals = (s: number) => {
    const str = s.toString()
    if (str.includes('e-')) return parseInt(str.split('e-')[1], 10)
    const dot = str.indexOf('.')
    return dot === -1 ? 0 : str.length - dot - 1
  }

  const roundTo = (n: number, decimals: number) => {
    const p = 10 ** decimals
    return Math.round((n + Number.EPSILON) * p) / p
  }
  const isControlled = value !== undefined

  const trackRef = useRef<HTMLDivElement | null>(null)
  const draggingIndex = useRef<number | null>(null)

  const [internalValues, setInternalValues] = useState<number[]>(defaultValue)

  const values = isControlled ? (value as number[]) : internalValues

  const pct = (value: number) => ((value - min) / (max - min)) * 100

  let leftPct = 0
  let widthPct = 0

  if (values.length === 1) {
    const v = values[0]
    const start = pct(min)
    const end = pct(v)

    leftPct = Math.min(start, end)
    widthPct = Math.abs(end - start)
  } else if (values.length > 1) {
    const minValue = Math.min(...values)
    const maxValue = Math.max(...values)

    leftPct = pct(minValue)
    widthPct = pct(maxValue) - pct(minValue)
  }

  const setValues = (next: number[]) => {
    if (!isControlled) {
      setInternalValues(next)
    }
    onChange?.(next)
  }

  const normalizedMarks = useMemo(
    () => normalizeMarks(marks, min, max),
    [marks, min, max]
  )

  const updateValue = (clientX: number, forcedIndex?: number) => {
    if (!trackRef.current) return

    const rect = trackRef.current.getBoundingClientRect()
    let ratio = (clientX - rect.left) / rect.width
    ratio = Math.min(1, Math.max(0, ratio))

    const decimals = stepDecimals(step)

    let newValue = Math.round((min + ratio * (max - min)) / step) * step
    newValue = roundTo(newValue, decimals)

    const index = forcedIndex ?? draggingIndex.current
    if (index == null) return

    const next = [...values]
    next[index] = newValue
    setValues(next)
  }

  const startDrag =
    (index: number) =>
    (e: React.PointerEvent<HTMLDivElement>): void => {
      draggingIndex.current = index
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    }

  const onMove = (e: React.PointerEvent) => {
    if (draggingIndex.current == null) return
    updateValue(e.clientX)
  }

  const stopDrag = (e: React.PointerEvent) => {
    draggingIndex.current = null
    ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
  }

  const handleTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!trackRef.current) return

    const target = e.target as HTMLElement

    if (target.classList.contains(styles.riThumb)) {
      return
    }

    const rect = trackRef.current.getBoundingClientRect()
    let ratio = (e.clientX - rect.left) / rect.width
    ratio = Math.min(1, Math.max(0, ratio))

    const clickedValue = Math.round((min + ratio * (max - min)) / step) * step

    let closestIndex = 0
    let smallestDist = Infinity
    values.forEach((v, i) => {
      const dist = Math.abs(clickedValue - v)
      if (dist < smallestDist) {
        smallestDist = dist
        closestIndex = i
      }
    })

    updateValue(e.clientX, closestIndex)
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
        {values.map((val, index) => (
          <Tooltip key={index}>
            <TooltipTrigger>
              <div
                className={styles.riThumb}
                style={{ left: `${pct(val)}%` }}
                onPointerDown={startDrag(index)}
                onPointerMove={onMove}
                onPointerUp={stopDrag}
                onPointerEnter={(e) =>
                  e.currentTarget.classList.add(styles.riThumbActive)
                }
                onPointerLeave={(e) =>
                  e.currentTarget.classList.remove(styles.riThumbActive)
                }
              />
            </TooltipTrigger>
            <TooltipContent>
              <span>{val}</span>
            </TooltipContent>
          </Tooltip>
        ))}

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

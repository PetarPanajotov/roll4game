import React, { CSSProperties, ReactNode, useMemo } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

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

  const normalizedMarks = useMemo(
    () => normalizeMarks(marks, min, max),
    [marks, min, max]
  )

  const updateValue = (clientX: number) => {
    if (!trackRef.current) return

    const rect = trackRef.current.getBoundingClientRect()
    let ratio = (clientX - rect.left) / rect.width
    ratio = Math.min(1, Math.max(0, ratio))

    // convert to stepped value
    let newValue = Math.round((min + ratio * (max - min)) / step) * step

    let [valMin, valMax] = range

    if (dragging.current === 'min') {
      valMin = Math.min(newValue, valMax)
    } else if (dragging.current === 'max') {
      valMax = Math.max(newValue, valMin)
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

  function isMarkObject(mark: MarkValue): mark is MarkObject {
    return typeof mark === 'object' && mark !== null && 'label' in mark
  }

  return (
    <div className="slider-wrapper">
      <div className="slider-track" ref={trackRef}>
        <div
          className="slider-range"
          style={{
            left: `${pct(range[0])}%`,
            width: `${pct(range[1]) - pct(range[0])}%`,
          }}
        />
        <div
          className="slider-thumb"
          style={{ left: `${pct(range[0])}%` }}
          onPointerDown={startDrag('min')}
          onPointerMove={onMove}
          onPointerUp={stopDrag}
        />
        <div
          className="slider-thumb"
          style={{ left: `${pct(range[1])}%` }}
          onPointerDown={startDrag('max')}
          onPointerMove={onMove}
          onPointerUp={stopDrag}
        />
        {/* MARKS */}
        {normalizedMarks.map((mark) => (
          <div
            key={mark.value}
            className="ts-mark"
            style={{ left: `${mark.left}%` }}
          >
            <div className="ts-mark-dot" />
            <div className="ts-mark-label" style={mark.style}>
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

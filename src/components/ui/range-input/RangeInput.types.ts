import { CSSProperties, ReactNode } from 'react'

export type RangeSliderProps = {
  min?: number
  max?: number
  step?: number
  value?: number[]
  defaultValue?: number[]
  marks?: Marks
  onChange?: (value: number[]) => void
}

export type MarkObject = {
  style?: CSSProperties
  label: ReactNode
}

export type MarkValue = ReactNode | MarkObject

export type Marks = Record<number, MarkValue>

export type NormalizedMark = {
  value: number
  left: number
  label: ReactNode
  style: CSSProperties
}

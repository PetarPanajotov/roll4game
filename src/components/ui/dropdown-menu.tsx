'use client'

import { ExtendedRefs, FloatingPortal } from '@floating-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check } from 'lucide-react'
import React, { useEffect, useMemo, useRef, useState } from 'react'

export type Option = Readonly<{ text: string; value: string | number | object }>
export type OptionGroup = Readonly<{
  label: string
  options: ReadonlyArray<Option>
}>
export type OptionsConfig = ReadonlyArray<Option> | ReadonlyArray<OptionGroup>

interface DropdownMenuProps {
  refs: ExtendedRefs<HTMLElement | null>
  floatingStyles: React.CSSProperties
  getFloatingProps: (
    props?: React.HTMLProps<HTMLElement> | undefined
  ) => Record<string, unknown>
  isOpen: boolean
  options: OptionsConfig
  selectedValues: (string | number | object)[]
  onSelect: (values: (string | number | object)[]) => void
  onClose: () => void
}

type FlatLabel = { kind: 'label'; label: string }
type FlatOption = {
  kind: 'option'
  text: string
  value: string | number | object
}
type FlatItem = FlatLabel | FlatOption

/**
 * Type guard that determines if provided options
 * are grouped (`OptionGroup[]`) instead of flat (`Option[]`).
 */
const isGroupedOptions = (
  opts: OptionsConfig
): opts is ReadonlyArray<OptionGroup> =>
  Array.isArray(opts) && opts.length > 0 && 'label' in (opts as any)[0]

const normalize = (v: string | number | object) => String(v)

export function DropdownMenu(props: DropdownMenuProps) {
  const [lastInput, setLastInput] = useState<'mouse' | 'keyboard'>('keyboard')
  const [cursor, setCursor] = useState(0) // only selectable options
  const optionRefs = useRef<HTMLLIElement[]>([])

  const {
    refs,
    floatingStyles,
    getFloatingProps,
    isOpen,
    options,
    selectedValues,
    onSelect,
    onClose,
  } = props

  /**
   * Flattens input options (grouped or not) into a single linear array.
   * Each group label and option become one entry in the final list.
   */
  const flat: FlatItem[] = useMemo(() => {
    const out: FlatItem[] = []
    if (isGroupedOptions(options)) {
      for (const group of options) {
        out.push({ kind: 'label', label: group.label })
        for (const opt of group.options) {
          out.push({ kind: 'option', text: opt.text, value: opt.value })
        }
      }
    } else {
      for (const opt of options) {
        out.push({ kind: 'option', text: opt.text, value: opt.value })
      }
    }
    return out
  }, [options])

  /**
   * Indexes of only the selectable (option) items inside the `flat` array.
   * Used to keep keyboard navigation from landing on labels.
   */
  const optionIndices: number[] = useMemo(
    () =>
      flat.reduce<number[]>(
        (acc, item, i) => (item.kind === 'option' ? (acc.push(i), acc) : acc),
        []
      ),
    [flat]
  )

  const optionCount = optionIndices.length
  const focusedFlatIndex = optionCount > 0 ? optionIndices[cursor] : -1
  const toCursorPos = (flatIndex: number) => optionIndices.indexOf(flatIndex)

  /**
   * Resets focus to the first option whenever the dropdown opens or the list changes.
   */
  useEffect(() => {
    if (isOpen) {
      setLastInput('keyboard')
      setCursor(0)
    }
  }, [isOpen, optionCount])

  /**
   * Automatically scrolls the focused option into view
   * when using keyboard navigation.
   */
  useEffect(() => {
    if (!isOpen || lastInput === 'mouse' || optionCount === 0) return
    optionRefs.current[cursor]?.scrollIntoView({
      behavior: 'instant',
      block: 'nearest',
    })
  }, [cursor, isOpen, lastInput, optionCount])

  /**
   * Handles global keyboard navigation and selection.
   * Attached to the Floating UI "reference" element (trigger).
   */
  useEffect(() => {
    if (!isOpen || optionCount === 0) return
    const refEl = refs.domReference.current as HTMLElement | null
    if (!refEl) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setLastInput('keyboard')
          setCursor((c) => (c + 1) % optionCount)
          break
        case 'ArrowUp':
          e.preventDefault()
          setLastInput('keyboard')
          setCursor((c) => (c - 1 + optionCount) % optionCount)
          break
        case 'Home':
          e.preventDefault()
          setLastInput('keyboard')
          setCursor(0)
          break
        case 'End':
          e.preventDefault()
          setLastInput('keyboard')
          setCursor(optionCount - 1)
          break
        case 'Enter':
          e.preventDefault()
          if (focusedFlatIndex >= 0) handleSelectByFlatIndex(focusedFlatIndex)
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
      }
    }

    refEl.addEventListener('keydown', handleKeyDown)
    return () => {
      refEl.removeEventListener('keydown', handleKeyDown)
      refEl.setAttribute('aria-expanded', 'false')
    }
  }, [isOpen, refs.domReference, optionCount, focusedFlatIndex, onClose])

  /**
   * Toggles selection of a given flat item index (adds/removes value).
   */
  const handleSelectByFlatIndex = (flatIndex: number) => {
    const item = flat[flatIndex]
    if (!item || item.kind !== 'option') return
    const v = item.value
    const idx = selectedValues.findIndex((x) => normalize(x) === normalize(v))
    const next =
      idx === -1
        ? [...selectedValues, v]
        : selectedValues.filter((_, i) => i !== idx)
    onSelect(next)
  }

  /**
   * Determines whether a given value is currently selected.
   */
  const isSelected = (v: string | number | object) =>
    selectedValues.some((x) => normalize(x) === normalize(v))

  /** True if any selectable options exist. */
  const hasAnyOption = optionCount > 0

  return (
    <FloatingPortal>
      <div
        ref={refs.setFloating}
        style={{
          ...floatingStyles,
          zIndex: 1000,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
        {...getFloatingProps({
          className:
            'border-[1] border-white bg-black rounded-xl p-1 overflow-hidden shadow-xl',
        })}
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -4 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 28,
                mass: 0.6,
              }}
            >
              <div className="min-h-26 max-h-60 w-full overflow-auto">
                <ul role="listbox" aria-multiselectable>
                  {!hasAnyOption && (
                    <li className="px-4 py-2 text-neutral-400 select-none">
                      No results
                    </li>
                  )}
                  {flat.map((item, i) => {
                    if (item.kind === 'label') {
                      return (
                        <li
                          key={`label-${i}`}
                          role="presentation"
                          className="px-3 py-1 text-xs uppercase tracking-wide text-neutral-400 sticky top-0 bg-black/90 backdrop-blur"
                        >
                          {item.label}
                        </li>
                      )
                    }

                    const optPos = toCursorPos(i)
                    const focused = i === focusedFlatIndex
                    const selected = isSelected(item.value)

                    return (
                      <li
                        key={`opt-${i}`}
                        ref={(el) => {
                          if (el && optPos !== -1)
                            optionRefs.current[optPos] = el
                        }}
                        onMouseDown={(e) => e.preventDefault()}
                        onMouseMove={() => {
                          if (optPos !== -1) {
                            requestAnimationFrame(() => {
                              setLastInput('mouse')
                              setCursor(optPos)
                            })
                          }
                        }}
                        onClick={() => handleSelectByFlatIndex(i)}
                        id={`option-${i}`}
                        role="option"
                        aria-selected={focused}
                        className={[
                          'rounded-2xl px-4 py-2 cursor-pointer flex items-center justify-between',
                          selected ? 'bg-neutral-900' : '',
                          focused ? 'bg-neutral-700' : '',
                        ].join(' ')}
                      >
                        <span className="truncate">{item.text}</span>
                        {selected && <Check className="h-4 w-4 shrink-0" />}
                      </li>
                    )
                  })}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FloatingPortal>
  )
}

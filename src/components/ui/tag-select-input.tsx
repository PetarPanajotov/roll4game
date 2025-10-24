'use client'

import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { DropdownMenu, OptionGroup, OptionsConfig } from './dropdown-menu'
import { ChevronDown } from 'lucide-react'

type Value = string | number | object

interface TagSelectInputProps {
  value?: Value[]
  defaultValue?: Value[]
  onChange?: (tags: Value[]) => void
  options?: OptionsConfig
  placeholder?: string
  id: string
  className?: string
  disabled?: boolean
}

const normalize = (v: Value) => String(v)
const isGrouped = (opts: OptionsConfig): opts is ReadonlyArray<OptionGroup> =>
  Array.isArray(opts) && opts.length > 0 && 'label' in (opts as any)[0]

export function TagSelectInput(props: TagSelectInputProps) {
  const {
    value,
    defaultValue,
    onChange,
    options = [],
    placeholder,
    id,
    className = '',
    disabled = false,
  } = props

  // controlled vs uncontrolled
  const isControlled = value !== undefined
  const [internalTags, setInternalTags] = useState<Value[]>(defaultValue ?? [])
  const tags = (isControlled ? value! : internalTags) as Value[]

  const [displayValue, setDisplayValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [visibleTags, setVisibleTags] = useState<number>(tags.length)

  const inputRef = useRef<HTMLInputElement>(null)
  const span = useRef<HTMLSpanElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const tagsContainerRef = useRef<HTMLDivElement>(null)

  const tagsSizerRef = useRef<HTMLDivElement>(null)
  const moreSizerRef = useRef<HTMLSpanElement>(null)

  /** Build value → label map once per options change */
  const valueToLabel = useMemo(() => {
    const entries: Array<[string, string]> = []
    if (isGrouped(options)) {
      for (const g of options)
        for (const o of g.options) entries.push([normalize(o.value), o.text])
    } else {
      for (const o of options) entries.push([normalize(o.value), o.text])
    }
    return new Map<string, string>(entries)
  }, [options])

  const getLabel = (v: Value) => valueToLabel.get(normalize(v)) ?? normalize(v)

  const updateTags = (next: Value[]) => {
    if (isControlled) onChange?.(next)
    else {
      setInternalTags(next)
      onChange?.(next)
    }
  }

  /** FILTER OPTIONS based on displayValue (case-insensitive, matches text) */
  const filteredOptions: OptionsConfig = useMemo(() => {
    const q = displayValue.trim().toLowerCase()
    if (!q) return options

    if (isGrouped(options)) {
      const groups = options
        .map((g) => ({
          label: g.label,
          options: g.options.filter(
            (o) =>
              o.text.toLowerCase().includes(q) ||
              String(o.value).toLowerCase().includes(q)
          ),
        }))
        .filter((g) => g.options.length > 0)
      return groups
    } else {
      return options.filter(
        (o) =>
          o.text.toLowerCase().includes(q) ||
          String(o.value).toLowerCase().includes(q)
      )
    }
  }, [options, displayValue])

  // Resize input to its ghost span
  useEffect(() => {
    if (span.current && inputRef.current) {
      inputRef.current.style.width = `${span.current.offsetWidth}px`
    }
  }, [displayValue])

  /**
   * Recompute how many tags fit within ~60% of the input container.
   * Uses hidden sizers to avoid measuring the already-truncated UI.
   */
  useEffect(() => {
    const containerEl = containerRef.current
    const sizerEl = tagsSizerRef.current
    const moreEl = moreSizerRef.current

    if (!containerEl || !sizerEl || tags.length === 0) {
      setVisibleTags(tags.length)
      return
    }

    const containerWidth = containerEl.offsetWidth
    const maxTagsWidth = containerWidth * 0.6
    const chipEls = Array.from(
      sizerEl.querySelectorAll('[data-chip="1"]')
    ) as HTMLElement[]
    const chipWidths = chipEls.map((el) => el.offsetWidth)

    if (chipWidths.length !== tags.length) {
      setVisibleTags(Math.max(1, Math.min(tags.length, visibleTags)))
      return
    }

    // Helper: width of the “+N more” chip
    const moreWidthFor = (hiddenCount: number) => {
      if (!moreEl || hiddenCount <= 0) return 0
      moreEl.textContent = `+${hiddenCount} more`
      return moreEl.offsetWidth
    }

    // Fit as many as possible; include “+N more” if not all fit.
    let best = tags.length
    let running = 0

    for (let i = 0; i < tags.length; i++) {
      running += chipWidths[i]
      const hiddenCount = tags.length - (i + 1)
      const totalNeeded =
        hiddenCount > 0 ? running + moreWidthFor(hiddenCount) : running

      if (totalNeeded <= maxTagsWidth) {
        best = i + 1
      } else {
        break
      }
    }

    setVisibleTags(tags.length > 0 ? Math.max(1, best) : 0)
  }, [tags, getLabel])

  /**
   * Keep visibleTags responsive to container size changes (e.g., window resize).
   */
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      setVisibleTags((v) => v)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    strategy: 'fixed',
    middleware: [
      offset(4),
      flip(),
      shift(),
      size({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
          })
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  })

  const click = useClick(context, { keyboardHandlers: false, toggle: true })
  const dismiss = useDismiss(context, { outsidePress: true, escapeKey: true })
  const role = useRole(context, { role: 'menu' })
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ])

  // Open the menu as the user types
  useEffect(() => {
    if (displayValue && !isOpen) setIsOpen(true)
  }, [displayValue, isOpen])

  return (
    <div
      ref={refs.setReference}
      {...getReferenceProps({
        onMouseDown: (e) => {
          e.preventDefault()
          if (document.activeElement !== inputRef.current)
            inputRef.current?.focus()
        },
        className: `border-[1] focus-within:border-white rounded-xl px-1 cursor-text relative ${className}`,
      })}
    >
      <div
        ref={containerRef}
        className="h-full flex flex-row items-center flex-12"
      >
        <span className="opacity-0 absolute whitespace-pre" ref={span}>
          {displayValue}
        </span>

        {!displayValue && tags.length === 0 && (
          <span className="align-middle ms-2 opacity-25 absolute top-6/12 -translate-y-6/12">
            {placeholder}
          </span>
        )}

        <div ref={tagsContainerRef}>
          <Tag
            tags={tags}
            visibleTags={visibleTags}
            getLabel={getLabel}
            removeTag={(indexToRemove: number) =>
              updateTags(tags.filter((_, index) => index !== indexToRemove))
            }
          />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={(e) => setDisplayValue(e.target.value)}
          disabled={disabled}
          id={id}
          className="h-12/12 ms-2 py-1.5 border-0 outline-0 w-full min-w-[4.1] bg-transparent"
        />
      </div>

      <ChevronDown className="absolute top-[50%] left-[95%] -translate-[50%]" />

      {isOpen && (
        <DropdownMenu
          options={filteredOptions}
          onSelect={(selectedValues) => {
            updateTags(selectedValues)
            setDisplayValue('')
            setIsOpen(false)
            inputRef.current?.focus()
          }}
          selectedValues={tags}
          onClose={() => setIsOpen(false)}
          refs={refs}
          floatingStyles={getFloatingStylesForMenu(floatingStyles)}
          getFloatingProps={getFloatingProps}
          isOpen={isOpen}
        />
      )}

      {/* ===== Hidden sizer: offscreen measurement (no feedback loop) ===== */}
      <div
        ref={tagsSizerRef}
        aria-hidden
        className="invisible absolute -z-50 pointer-events-none"
        style={{ left: -9999, top: -9999 }}
      >
        {tags.map((t, i) => (
          <span
            key={`s-${i}`}
            data-chip="1"
            className="bg-blue-500 font-semibold rounded-xl px-1.5 py-1 inline-block mr-1"
          >
            {getLabel(t)}
          </span>
        ))}
        <span
          ref={moreSizerRef}
          className="bg-blue-500 font-semibold rounded-xl px-1.5 py-1 inline-block"
        >
          +0 more
        </span>
      </div>
    </div>
  )
}

function getFloatingStylesForMenu(styles: React.CSSProperties) {
  return styles
}

function Tag(props: {
  tags: Value[]
  visibleTags: number
  getLabel: (v: Value) => string
  removeTag: (index: number) => void
}) {
  const { tags, visibleTags, getLabel, removeTag } = props
  const hiddenCount = tags.length - visibleTags

  const handleRemoveTag = (event: React.MouseEvent, i: number) => {
    event.preventDefault()
    event.stopPropagation()
    removeTag(i)
  }

  return (
    <>
      {tags.slice(0, visibleTags).map((tag, i) => (
        <span
          key={i}
          className={`bg-blue-500 font-semibold rounded-xl px-1.5 py-1 ${
            i !== 0 && 'ms-1'
          }`}
        >
          {getLabel(tag)}
          <span
            className="text-[12px] cursor-pointer font-semibold ps-1"
            onClick={(event) => handleRemoveTag(event, i)}
            aria-label="Remove tag"
            role="button"
          >
            &#10005;
          </span>
        </span>
      ))}
      {hiddenCount > 0 && (
        <span className="bg-blue-500 font-semibold rounded-xl px-1.5 py-1 ms-1">
          +{hiddenCount} more
        </span>
      )}
    </>
  )
}

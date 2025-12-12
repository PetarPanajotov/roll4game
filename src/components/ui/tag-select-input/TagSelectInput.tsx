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
import {
  DropdownMenu,
  OptionGroup,
  OptionsConfig,
} from '../dropdown-menu/DropdownMenu'
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
  Array.isArray(opts) && opts.length > 0 && 'label' in opts[0]

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

  const isControlled = value !== undefined

  const [internalTags, setInternalTags] = useState<Value[]>(defaultValue ?? [])

  const selectedTags = (isControlled ? value : internalTags) ?? []

  const [displayTags, setDisplayTags] = useState<string[]>([])
  const [displayValue, setDisplayValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const span = useRef<HTMLSpanElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const tagsContainerRef = useRef<HTMLDivElement>(null)

  const normalizedOptions = useMemo(() => {
    const entries: { label: string; value: Value }[] = []
    if (isGrouped(options)) {
      for (const g of options)
        for (const o of g.options)
          entries.push({ label: o.text, value: o.value })
    } else {
      for (const o of options) entries.push({ label: o.text, value: o.value })
    }
    return entries
  }, [options])

  const getLabelByValue = (valueForSearch: Value) => {
    const foundOption = normalizedOptions.find(
      (option) => option.value === valueForSearch
    )
    return foundOption ? foundOption.label : ''
  }

  useEffect(() => {
    setDisplayTags(selectedTags.map((el) => getLabelByValue(el)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTags, normalizedOptions])

  const updateTags = (nextTags: Value[]) => {
    if (!isControlled) {
      setInternalTags(nextTags)
    }
    onChange?.(nextTags)
  }

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

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: (open) => {
      setIsOpen(open)
      if (!open) setDisplayValue('')
    },
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

  useEffect(() => {
    if (displayValue && !isOpen) setIsOpen(true)
  }, [displayValue, isOpen])

  useEffect(() => {
    const handleWindowBlur = () => {
      setIsOpen(false)
      setDisplayValue('')
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setIsOpen(false)
        setDisplayValue('')
      }
    }

    window.addEventListener('blur', handleWindowBlur)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('blur', handleWindowBlur)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

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

        {!displayValue && selectedTags.length === 0 && (
          <span className="align-middle ms-2 opacity-25 absolute top-6/12 -translate-y-6/12">
            {placeholder}
          </span>
        )}

        <div className="flex" ref={tagsContainerRef}>
          <Tag
            tags={displayTags}
            removeTag={(indexToRemove: number) =>
              updateTags(
                selectedTags.filter((_, index) => index !== indexToRemove)
              )
            }
          />
        </div>

        <input
          ref={inputRef}
          autoComplete="off"
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
          selectedValues={selectedTags}
          onClose={() => setIsOpen(false)}
          refs={refs}
          floatingStyles={getFloatingStylesForMenu(floatingStyles)}
          getFloatingProps={getFloatingProps}
          isOpen={isOpen}
        />
      )}
    </div>
  )
}

function getFloatingStylesForMenu(styles: React.CSSProperties) {
  return styles
}

function Tag(props: { tags: string[]; removeTag: (index: number) => void }) {
  const { tags, removeTag } = props

  const handleRemoveTag = (event: React.MouseEvent, i: number) => {
    event.preventDefault()
    event.stopPropagation()
    removeTag(i)
  }

  const transformLabel = (text: string) => {
    const t = normalize(text)
    return t.length > 5 ? t.substring(0, 5) + '...' : t
  }

  return (
    <>
      {tags.slice(0, 2).map((tag, i) => (
        <span
          key={i}
          className={`bg-blue-500 px-[3px] py-[2px] text-[0.85rem] rounded-sm ${
            i !== 0 ? 'ms-2' : ''
          }`}
        >
          {transformLabel(tag)}
          <span
            className="text-[0.65rem] cursor-pointer font-semibold ps-1"
            onClick={(event) => handleRemoveTag(event, i)}
            aria-label="Remove tag"
            role="button"
          >
            &#10005;
          </span>
        </span>
      ))}

      {tags.length > 2 && (
        <span className="bg-blue-500 px-[3px] py-[2px] text-[0.85rem] rounded-sm ms-2">
          +{tags.length - 2}...
        </span>
      )}
    </>
  )
}

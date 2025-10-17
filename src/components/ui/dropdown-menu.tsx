'use client'
import { ExtendedRefs, FloatingPortal } from '@floating-ui/react'
import { useEffect, useRef, useState } from 'react'

interface DropdownMenuProps {
  refs: ExtendedRefs<HTMLElement | null>
  floatingStyles: React.CSSProperties
  getFloatingProps: (
    props?: React.HTMLProps<HTMLElement> | undefined
  ) => Record<string, unknown>
  isOpen: boolean
  options: { text: string; value?: string | number | object }[]
  onSelect: (value: string | number | object) => void
  onClose: () => void
}

export function DropdownMenu(props: DropdownMenuProps) {
  const [lastInput, setLastInput] = useState<'mouse' | 'keyboard'>('keyboard')
  const [cursor, setCursor] = useState(0)
  const itemRefs = useRef<HTMLLIElement[]>([])

  const {
    refs,
    floatingStyles,
    getFloatingProps,
    isOpen,
    options,
    onSelect,
    onClose,
  } = props

  const max = options.length

  useEffect(() => {
    if (isOpen) {
      setCursor(0)
      setLastInput('keyboard')
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || lastInput === 'mouse') return
    const el = itemRefs.current[cursor]
    el?.scrollIntoView({ behavior: 'instant', block: 'nearest' })
  }, [cursor, isOpen, lastInput])

  useEffect(() => {
    if (!isOpen) return
    const refEl = refs.domReference.current as HTMLElement | null
    if (!refEl) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setLastInput('keyboard')
          setCursor((c) => (c + 1) % max)
          break
        case 'ArrowUp':
          e.preventDefault()
          setLastInput('keyboard')
          setCursor((c) => (c - 1 + max) % max)
          break
        case 'Home':
          e.preventDefault()
          setLastInput('keyboard')
          setCursor(0)
          break
        case 'End':
          e.preventDefault()
          setLastInput('keyboard')
          setCursor(max - 1)
          break
        case 'Enter':
          e.preventDefault()
          /* Set value at given index if present, otherwise set the text as value */
          onSelect(options[cursor].value ?? options[cursor].text)
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
  }, [isOpen, refs.domReference, cursor, max, onClose, onSelect, options])

  return (
    <FloatingPortal>
      <div
        ref={refs.setFloating}
        style={{
          ...floatingStyles,
          zIndex: 1000,
        }}
        {...getFloatingProps({
          className: 'border-[1] bg-black rounded-xl p-1 overflow-hidden',
        })}
      >
        <div className="min-h-26 max-h-32 w-full overflow-auto">
          <ul role="listbox">
            {options.map((option, i) => (
              <li
                ref={(el) => {
                  if (el) itemRefs.current[i] = el
                }}
                onMouseMove={() => {
                  requestAnimationFrame(() => {
                    setLastInput('mouse')
                    setCursor(i)
                  })
                }}
                onClick={() =>
                  onSelect(options[cursor].value ?? options[cursor].text)
                }
                key={i}
                id={`option-${i}`}
                role="option"
                aria-selected={i === cursor}
                className={`rounded-2xl px-4 cursor-pointer ${
                  i === cursor ? 'bg-secondary' : ''
                }`}
              >
                {option.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </FloatingPortal>
  )
}

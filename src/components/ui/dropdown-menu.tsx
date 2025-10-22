'use client'
import { ExtendedRefs, FloatingPortal } from '@floating-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface DropdownMenuProps {
  refs: ExtendedRefs<HTMLElement | null>
  floatingStyles: React.CSSProperties
  getFloatingProps: (
    props?: React.HTMLProps<HTMLElement> | undefined
  ) => Record<string, unknown>
  isOpen: boolean
  options: { text: string; value?: string | number | object }[]
  selectedValues: (string | number | object)[]
  onSelect: (values: (string | number | object)[]) => void
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
    selectedValues,
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
          handleSelect(cursor)
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

  const handleSelect = (index: number) => {
    /* Check if element is already selected */
    const value = options[index].value ?? options[index].text
    const indexToRemove = selectedValues.findIndex((v) => v === value) //

    let newSelected: (string | number | object)[]
    /* Toggle: add if not selected, remove if already selected */
    if (indexToRemove === -1) {
      newSelected = [...selectedValues, value] // Use selectedValues
    } else {
      newSelected = selectedValues.filter((_, i) => i !== indexToRemove)
    }

    onSelect(newSelected)
  }

  const isSelected = (option: {
    text: string
    value?: string | number | object
  }) => {
    const value = option.value ?? option.text
    /* Your selectedValues are strings – normalize compare: */
    return selectedValues.map(String).includes(String(value))
  }

  return (
    <FloatingPortal>
      {/* DO NOT animate this wrapper; it’s what Floating UI positions */}
      <div
        ref={refs.setFloating}
        style={{
          ...floatingStyles,
          zIndex: 1000,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
        {...getFloatingProps({
          className:
            'border-[1] bg-black rounded-xl p-1 overflow-hidden shadow-xl',
        })}
      >
        <AnimatePresence>
          {isOpen && (
            // Animate only the child
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
              {/* your scrollable list */}
              <div className="min-h-26 max-h-32 w-full overflow-auto">
                <ul role="listbox">
                  {options.map((option, i) => (
                    <li
                      ref={(el) => {
                        if (el) itemRefs.current[i] = el
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault() // Prevent focus loss on item click
                      }}
                      onMouseMove={() => {
                        requestAnimationFrame(() => {
                          setLastInput('mouse')
                          setCursor(i)
                        })
                      }}
                      onClick={() => handleSelect(i)}
                      key={i}
                      id={`option-${i}`}
                      role="option"
                      aria-selected={i === cursor}
                      className={`rounded-2xl px-4 py-2 cursor-pointer flex items-center justify-between ${
                        isSelected(option) ? 'bg-neutral-900' : ''
                      }
                      ${i === cursor && 'bg-neutral-700'}`}
                    >
                      <span>{option.text}</span>
                      {isSelected(option) && (
                        <Check className="text-blue-400 text-[12px]" />
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FloatingPortal>
  )
}

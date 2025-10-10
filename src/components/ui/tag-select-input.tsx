'use client'
import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react'
import { useEffect, useRef, useState } from 'react'

export function TagSelectInput() {
  const [value, setValue] = useState('')
  const [open, setOpen] = useState(false)
  const [lastInput, setLastInput] = useState<'mouse' | 'keyboard'>('keyboard')

  const inputRef = useRef<HTMLInputElement>(null)
  const span = useRef<HTMLSpanElement>(null)
  const itemRefs = useRef<HTMLLIElement[]>([])

  useEffect(() => {
    if (span.current && inputRef.current) {
      /** Here we update the input width directly to improve the performance. This way we have less rerenders. */
      inputRef.current.style.width = `${span.current.offsetWidth}px`
    }
  }, [value])

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    middleware: [
      offset(4),
      flip(),
      shift(),
      size({
        /** Get the parent element width and sync it */
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
          })
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  })

  const click = useClick(context, { keyboardHandlers: false })
  const dismiss = useDismiss(context, {
    outsidePress: true,
    escapeKey: true,
  })
  const role = useRole(context, { role: 'menu' })

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ])

  const [cursor, setCursor] = useState(0)

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      cursor !== 14 ? setCursor(cursor + 1) : setCursor(0)
      setLastInput('keyboard')
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      cursor !== 0 ? setCursor(cursor - 1) : setCursor(14)
      setLastInput('keyboard')
    }
  }

  useEffect(() => {
    if (!open || lastInput === 'mouse') return
    const el = itemRefs.current[cursor]
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [cursor, open])

  return (
    <div
      ref={refs.setReference}
      {...getReferenceProps({
        onClick: () => {
          inputRef.current?.focus()
        },
        className:
          'border-[1] rounded-xl px-4 py-2 relative focus-within:border-white',
      })}
    >
      <div className="h-full flex flex-row flex-12">
        <span className="opacity-0 absolute whitespace-pre" ref={span}>
          {value}
        </span>
        {!value && (
          <span className="align-middle opacity-25 absolute top-6/12 -translate-y-6/12">
            Select platforms...
          </span>
        )}
        <div>{/* <span>Tag</span> */}</div>
        <input
          ref={inputRef}
          onKeyDown={handleKeyDown}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="h-12/12 border-0 outline-0 w-full min-w-[4.1] "
        ></input>
      </div>
      {/* Dropdown menu */}
      {open && (
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
                {/* For now its dummy array */}
                {[...Array(15)].map((_, i) => (
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
                    key={i}
                    role="listitem"
                    className={`rounded-2xl px-4 cursor-pointer ${
                      i === cursor ? 'bg-secondary' : ''
                    }`}
                  >
                    PC (Microsoft Windows)
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </FloatingPortal>
      )}
    </div>
  )
}

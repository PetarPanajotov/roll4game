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
import { useEffect, useRef, useState } from 'react'
import { DropdownMenu } from './dropdown-menu'

export function TagSelectInput() {
  const [value, setValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const span = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (span.current && inputRef.current) {
      /** Here we update the input width directly to improve the performance. This way we have less rerenders. */
      inputRef.current.style.width = `${span.current.offsetWidth}px`
    }
  }, [value])

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
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

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    console.log('here')
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setIsOpen(true)
      // Dropdown will handle cursor internally
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setIsOpen(true)
      // Dropdown will handle cursor internally
    }
  }

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
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="h-12/12 border-0 outline-0 w-full min-w-[4.1] "
        ></input>
      </div>
      {isOpen && (
        <DropdownMenu
          options={[
            'test1',
            'test2',
            'test3',
            'test4',
            'test5',
            'test6',
            'test7',
            'test8',
            'test9',
            'test10',
            'test11',
            'test12',
            'test13',
          ]}
          onSelect={(opt) => {
            setValue(opt)
            setIsOpen(false)
            inputRef.current?.focus()
          }}
          onClose={() => setIsOpen(false)}
          refs={refs}
          floatingStyles={floatingStyles}
          getFloatingProps={getFloatingProps}
          isOpen={isOpen}
        />
      )}
    </div>
  )
}

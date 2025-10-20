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
import { ChevronDown } from 'lucide-react'

export function TagSelectInput() {
  const [displayValue, setDisplayValue] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [visibleTags, setVisibleTags] = useState<number>(tags.length)

  const inputRef = useRef<HTMLInputElement>(null)
  const span = useRef<HTMLSpanElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const tagsContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (span.current && inputRef.current) {
      /** Here we update the input width directly to improve the performance. This way we have less rerenders. */
      inputRef.current.style.width = `${span.current.offsetWidth}px`
    }
  }, [displayValue])

  /* Calculate the width of the input and replace the tags with +1 More etc. */
  useEffect(() => {
    if (
      !containerRef.current ||
      !tagsContainerRef.current ||
      tags.length === 0
    ) {
      setVisibleTags(tags.length)
      return
    }

    const containerWidth = containerRef.current.offsetWidth
    const maxTagsWidth = containerWidth * 0.6
    const tagElements = tagsContainerRef.current.children

    let totalWidth = 0
    let count = 0

    for (let i = 0; i < tagElements.length; i++) {
      const tagWidth = (tagElements[i] as HTMLElement).offsetWidth
      if (totalWidth + tagWidth > maxTagsWidth) {
        break
      }
      totalWidth += tagWidth
      count++
    }

    setVisibleTags(Math.max(1, count)) // Always show at least 1 tag
  }, [tags])

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

  return (
    <div
      ref={refs.setReference}
      {...getReferenceProps({
        onClick: () => {
          inputRef.current?.focus()
        },
        className:
          'border-[1] rounded-xl px-1 py-2 relative focus-within:border-white',
      })}
    >
      <div ref={containerRef} className="h-full flex flex-row flex-12">
        <span className="opacity-0 absolute whitespace-pre" ref={span}>
          {displayValue}
        </span>
        {!displayValue && tags.length === 0 && (
          <span className="align-middle ms-2 opacity-25 absolute top-6/12 -translate-y-6/12">
            Select platforms...
          </span>
        )}
        <div ref={tagsContainerRef}>
          <Tag
            tags={tags}
            visibleTags={visibleTags}
            removeTag={(indexToRemove: number) =>
              setTags(tags.filter((_, index) => index !== indexToRemove))
            }
          />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={(e) => setDisplayValue(e.target.value)}
          className="h-12/12 ms-2 border-0 outline-0 w-full min-w-[4.1] "
        ></input>
      </div>
      <ChevronDown className="absolute top-[50%] left-[95%] -translate-[50%]" />
      {isOpen && (
        <DropdownMenu
          options={[{ text: 'test1', value: 'test545' }]}
          onSelect={(opt) => {
            setTags([...tags, opt as string])
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

function Tag(props: {
  tags: string[]
  visibleTags: number
  removeTag: (index: number) => void
}) {
  const { tags, visibleTags, removeTag } = props
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
          className={`bg-blue-500 font-semibold rounded-xl px-1.5 py-1.5 ${
            i !== 0 && 'ms-1'
          }`}
        >
          {tag}
          <span
            className="text-[12px] cursor-pointer font-semibold ps-1"
            onClick={(event) => handleRemoveTag(event, i)}
          >
            &#10005;
          </span>
        </span>
      ))}
      {hiddenCount > 0 && (
        <span className="bg-blue-500 font-semibold rounded-xl px-1.5 py-1.5 ms-1">
          +{hiddenCount} more
        </span>
      )}
    </>
  )
}

import {
  arrow,
  autoUpdate,
  FloatingArrow,
  FloatingPortal,
  offset,
  Placement,
  shift,
  Strategy,
  useFloating,
  UseFloatingReturn,
  useTransitionStyles,
} from '@floating-ui/react'
import { createContext, useContext, useEffect, useRef, useState } from 'react'

type TooltipContextValue = UseFloatingReturn<HTMLElement> & {
  animationDuration: number
  arrowRef: React.RefObject<SVGSVGElement | null>
}

const TooltipContext = createContext<TooltipContextValue | null>(null)

export function useTooltipContext() {
  const ctx = useContext(TooltipContext)
  if (!ctx) {
    throw new Error('Tooltip components must be used inside <Tooltip />')
  }
  return ctx
}

export function TooltipTrigger({ children }: { children: React.ReactElement }) {
  const { refs } = useTooltipContext()
  const childRef = (children as any).ref

  const setRef = (node: HTMLElement | null) => {
    refs.setReference(node)
    if (typeof childRef === 'function') childRef(node)
    else if (childRef) (childRef as React.MutableRefObject<any>).current = node
  }

  return {}
}

export function TooltipContent({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(false)
  const arrowRef = useRef(null)
  const { refs, floatingStyles, context, animationDuration } =
    useTooltipContext()

  const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
    duration: animationDuration,
    initial: {
      opacity: 0,
    },
    open: {
      opacity: 1,
    },
    close: {
      opacity: 0,
    },
    common: {
      transitionProperty: 'opacity',
    },
  })

  useEffect(() => {
    const el = refs.domReference.current
    if (!el) return

    const onEnter = () => setIsVisible(true)
    const onLeave = () => setIsVisible(false)

    refs.setReference(el)
    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [refs.domReference.current])

  return (
    <FloatingPortal>
      {isMounted && (
        <div
          className="bg-red-500 py-1 px-2 rounded-[9px]"
          ref={refs.setFloating}
          style={{ ...floatingStyles, ...transitionStyles }}
        >
          <FloatingArrow
            className="fill-red-500"
            ref={arrowRef}
            context={context}
          />
          Test
        </div>
      )}
    </FloatingPortal>
  )
}

type TooltipProps = React.PropsWithChildren<{
  initialOpen?: boolean
  placement?: Placement
  strategy?: Strategy
  offset?: number
  animation?: boolean
  animationDuration?: number
  openEvent?: 'click' | 'hover'
  onOpen?: () => void
  onClose?: () => void
}>

export function Tooltip({
  children,
  initialOpen = false,
  placement = 'top',
  strategy = 'absolute',
  offset: offsetNumber = 10,
  animation = true,
  animationDuration = 150,
  openEvent = 'hover',
  onOpen,
  onClose,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const arrowRef = useRef<SVGSVGElement | null>(null)

  const floating = useFloating({
    placement: placement,
    strategy: strategy,
    whileElementsMounted: autoUpdate,
    middleware: [arrow({ element: arrowRef }), offset(offsetNumber), shift()],
    open: isVisible,
    onOpenChange: setIsVisible,
  })

  const contextValue = {
    ...floating,
    animationDuration,
    arrowRef,
  } as TooltipContextValue

  return (
    <TooltipContext.Provider value={contextValue}>
      {children}
    </TooltipContext.Provider>
  )
}

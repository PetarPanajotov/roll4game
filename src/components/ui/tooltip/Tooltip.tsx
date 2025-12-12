import {
  arrow,
  autoUpdate,
  FloatingArrow,
  FloatingPortal,
  offset,
  Placement,
  Strategy,
  useClick,
  useFloating,
  UseFloatingReturn,
  useHover,
  useInteractions,
  UseInteractionsReturn,
  useTransitionStyles,
} from '@floating-ui/react'
import {
  cloneElement,
  createContext,
  ReactElement,
  Ref,
  RefObject,
  useContext,
  useRef,
  useState,
} from 'react'
import { twMerge } from 'tailwind-merge'

type TooltipContextValue = UseFloatingReturn<HTMLElement> &
  UseInteractionsReturn & {
    animationDuration: number
    arrowRef: React.RefObject<SVGSVGElement | null>
    withAnimation: boolean
  }

const TooltipContext = createContext<TooltipContextValue | null>(null)

export function useTooltipContext() {
  const ctx = useContext(TooltipContext)
  if (!ctx) {
    throw new Error('Tooltip components must be used inside <Tooltip />')
  }
  return ctx
}

type TooltipProps = React.PropsWithChildren<{
  initialOpen?: boolean
  placement?: Placement
  strategy?: Strategy
  offset?: number
  withAnimation?: boolean
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
  withAnimation = true,
  animationDuration = 150,
  openEvent = 'hover',
  onOpen,
  onClose,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(initialOpen)
  const arrowRef = useRef<SVGSVGElement | null>(null)

  const floating = useFloating({
    placement: placement,
    strategy: strategy,
    whileElementsMounted: (ref, float, update) =>
      autoUpdate(ref, float, update, { animationFrame: true }),
    middleware: [offset(offsetNumber), arrow({ element: arrowRef })],
    open: isVisible,
    onOpenChange: (open) => {
      setIsVisible(open)
      open ? onOpen?.() : onClose?.()
    },
  })

  const hover = useHover(floating.context, {
    enabled: openEvent === 'hover',
    move: false,
  })
  const click = useClick(floating.context, {
    enabled: openEvent === 'click',
  })

  const interactions = useInteractions([hover, click])

  const contextValue = {
    ...floating,
    ...interactions,
    animationDuration,
    arrowRef,
    withAnimation,
  } as TooltipContextValue

  return (
    <TooltipContext.Provider value={contextValue}>
      {children}
    </TooltipContext.Provider>
  )
}

type TooltipTriggerProps<T extends HTMLElement = HTMLElement> = {
  children: ReactElement<{ ref?: Ref<T> }>
}

export function TooltipTrigger<T extends HTMLElement = HTMLElement>({
  children,
}: TooltipTriggerProps<T>) {
  const { refs } = useTooltipContext()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const childRef = (children as any).ref

  const setRef = (node: T | null) => {
    // give Floating UI the reference
    refs.setReference(node as unknown as HTMLElement | null)

    // preserve the original child's ref (if any)
    if (typeof childRef === 'function') {
      childRef(node)
    } else if (childRef && 'current' in childRef) {
      ;(childRef as RefObject<T | null>).current = node
    }
  }

  return cloneElement(children, {
    ref: setRef,
  })
}

export function TooltipContent({
  children,
  className,
  arrowClassName,
}: {
  children: React.ReactNode
  className?: string
  arrowClassName?: string
}) {
  const {
    refs,
    floatingStyles,
    context,
    animationDuration,
    getFloatingProps,
    arrowRef,
  } = useTooltipContext()

  const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
    duration: animationDuration,
    initial: { opacity: 0 },
    open: { opacity: 1 },
    close: { opacity: 0 },
    common: { transitionProperty: 'opacity' },
  })

  return (
    <FloatingPortal>
      {isMounted && (
        <div
          {...getFloatingProps({
            ref: refs.setFloating,
            style: { ...floatingStyles, ...transitionStyles },
            className: twMerge(
              'bg-[rgba(42,10,61,0.85)] px-2 py-1 rounded-[9px] border border-purple-500/20 z-9999',
              className
            ),
          })}
        >
          <FloatingArrow
            width={8}
            height={5}
            className={twMerge(
              'fill-[rgba(42,10,61,0.85)] stroke-purple-500/20',
              arrowClassName
            )}
            strokeWidth={1}
            ref={arrowRef}
            context={context}
          />
          {children}
        </div>
      )}
    </FloatingPortal>
  )
}

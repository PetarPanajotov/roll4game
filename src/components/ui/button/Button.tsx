import * as React from 'react'
import { twMerge } from 'tailwind-merge'

type Variant =
  | 'primary'
  | 'primaryLight'
  | 'secondary'
  | 'secondaryLight'
  | 'outline'
  | 'ghost'
  | 'danger'
type Size = 'sm' | 'md' | 'lg' | 'icon'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  isLoading?: boolean
}

const base =
  'relative cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg font-medium select-none ' +
  'transition-[box-shadow,background-color,border-color,color,filter] duration-150 ease-out ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
  'disabled:pointer-events-none disabled:opacity-50 ' +
  'shadow-[0_1px_2px_rgba(0,0,0,0.25)] hover:shadow-[0_4px_10px_rgba(0,0,0,0.25)] ' +
  'active:shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)]'

const variants: Record<Variant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary/50 focus-visible:ring-primary/70',
  primaryLight:
    'bg-primary/12 text-primary hover:bg-primary/20 ' +
    'focus-visible:ring-2 focus-visible:ring-primary',
  secondary:
    'bg-secondary text-white hover:bg-secondary/50 focus-visible:ring-secondary/70',
  secondaryLight:
    'bg-secondary/12 text-secondary hover:bg-secondary/20 ' +
    'focus-visible:ring-2 focus-visible:ring-secondary              ',
  outline:
    'border border-slate-300 text-slate-900 hover:bg-slate-100 focus-visible:ring-slate-300',
  ghost: 'text-slate-900 hover:bg-slate-100 focus-visible:ring-slate-300',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-400',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-6 text-base',
  icon: 'h-10 w-10 p-0',
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden>
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
      />
    </svg>
  )
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={twMerge(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Spinner />}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

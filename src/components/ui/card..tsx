import { twMerge } from 'tailwind-merge'

/* Card Wrapper. */
export function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={twMerge(
        'bg-card flex flex-col gap-4 rounded-xl border py-4 shadow-sm',
        className
      )}
      {...props}
    />
  )
}

/** Card Header */
export function CardHeader({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={twMerge('flex flex-col gap-1 px-4', className)}
      {...props}
    />
  )
}

/** Card Body */
export function CardBody({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={twMerge('p-3', className)} {...props} />
}

/** Card Footer */
export function CardFooter({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return <div className={twMerge('flex p-3', className)} {...props}></div>
}

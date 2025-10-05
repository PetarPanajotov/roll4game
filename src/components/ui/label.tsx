import { twMerge } from 'tailwind-merge'

export function Label({ className, ...props }: React.ComponentProps<'label'>) {
  return (
    <label
      className={twMerge('font-semibold text-[14px] leading-8', className)}
      {...props}
    ></label>
  )
}

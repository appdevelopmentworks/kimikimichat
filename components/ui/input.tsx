import * as React from 'react'
import { cn } from './cn'

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        'w-full rounded-md border border-transparent bg-white/60 px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]',
        className
      )}
      {...props}
    />
  )
})
Input.displayName = 'Input'

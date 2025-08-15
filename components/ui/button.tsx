import * as React from 'react'
import { cn } from './cn'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium shadow-soft transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
          variant === 'default'
            ? 'bg-sakura text-[var(--fg)] hover:bg-sakura-soft'
            : 'bg-transparent text-[var(--fg)] hover:bg-[rgba(0,0,0,0.03)]',
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

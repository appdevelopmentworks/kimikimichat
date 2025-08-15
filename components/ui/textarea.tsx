import * as React from 'react'

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className = '', ...props }, ref) => (
    <textarea
      ref={ref}
      className={[
        'w-full px-3 py-2 border border-black/10 bg-white/80 outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)]/60',
        'placeholder:text-black/40',
        'text-[15px] leading-6',
        className,
      ].join(' ')}
      {...props}
    />
  )
)
Textarea.displayName = 'Textarea'

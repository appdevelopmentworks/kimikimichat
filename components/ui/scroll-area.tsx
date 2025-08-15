import * as React from 'react'

export function ScrollArea({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={[
      'overflow-y-auto overflow-x-hidden',
      'scroll-smooth',
      className,
    ].join(' ')} {...props}>
      {children}
    </div>
  )
}

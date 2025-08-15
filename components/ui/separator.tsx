import * as React from 'react'

export function Separator({ className = '', orientation = 'horizontal' as 'horizontal' | 'vertical', ...props }) {
  if (orientation === 'vertical') {
    return <div role="separator" className={["w-px h-full bg-black/10", className].join(' ')} {...props} />
  }
  return <div role="separator" className={["h-px w-full bg-black/10", className].join(' ')} {...props} />
}

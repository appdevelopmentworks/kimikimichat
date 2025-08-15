import * as React from 'react'

export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className = '', ...props }, ref) => (
    <label ref={ref} className={["text-sm font-medium", className].join(' ')} {...props} />
  )
)
Label.displayName = 'Label'

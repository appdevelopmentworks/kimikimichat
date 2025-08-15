import * as React from 'react'

type SwitchProps = {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

export function Switch({ checked, onCheckedChange, disabled, className = '' }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={!!checked}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={() => onCheckedChange?.(!checked)}
      className={[
        'inline-flex items-center h-6 w-10 rounded-full transition-colors',
        checked ? 'bg-[var(--accent)]' : 'bg-black/20',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        className,
      ].join(' ')}
    >
      <span
        className={[
          'inline-block h-5 w-5 bg-white rounded-full shadow transform transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0.5',
        ].join(' ')}
      />
    </button>
  )
}

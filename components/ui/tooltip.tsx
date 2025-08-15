'use client'
import * as React from 'react'

type TooltipContextType = { content?: React.ReactNode; open: boolean; setOpen: (v: boolean) => void }
const TooltipContext = React.createContext<TooltipContextType | null>(null)

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function Tooltip({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  return (
    <TooltipContext.Provider value={{ open, setOpen }}>
      {children}
    </TooltipContext.Provider>
  )
}

export function TooltipTrigger({ children }: { children: React.ReactElement }) {
  const ctx = React.useContext(TooltipContext)
  if (!ctx) return children
  return React.cloneElement(children, {
    onMouseEnter: () => ctx.setOpen(true),
    onMouseLeave: () => ctx.setOpen(false),
  } as any)
}

export function TooltipContent({ children }: { children: React.ReactNode }) {
  const ctx = React.useContext(TooltipContext)
  const ref = React.useRef<HTMLDivElement | null>(null)
  const [style, setStyle] = React.useState<React.CSSProperties>({})

  React.useEffect(() => {
    if (!ctx?.open) return
    const el = ref.current?.parentElement
    if (!el) return
    const rect = el.getBoundingClientRect()
    setStyle({ position: 'fixed', top: rect.bottom + 6, left: rect.left, zIndex: 50 })
  }, [ctx?.open])

  if (!ctx?.open) return null
  return (
    <div ref={ref} style={style} className="rounded-md bg-black text-white text-xs px-2 py-1 shadow">
      {children}
    </div>
  )
}

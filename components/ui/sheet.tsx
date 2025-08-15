'use client'
import * as React from 'react'

// Minimal Sheet implementation (no external deps)

type Side = 'left' | 'right' | 'top' | 'bottom'

type SheetContextType = {
  open: boolean
  setOpen: (v: boolean) => void
}

const SheetContext = React.createContext<SheetContextType | null>(null)

export function Sheet({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  return <SheetContext.Provider value={{ open, setOpen }}>{children}</SheetContext.Provider>
}

export function SheetTrigger({ asChild, children }: { asChild?: boolean; children: React.ReactElement }) {
  const ctx = React.useContext(SheetContext)
  if (!ctx) return children
  const props = {
    onClick: (e: React.MouseEvent) => {
      children.props.onClick?.(e)
      ctx.setOpen(true)
    },
  }
  return asChild ? React.cloneElement(children, props) : <button {...props}>{children}</button>
}

export function SheetContent({ side = 'right', className = '', children }: { side?: Side; className?: string; children: React.ReactNode }) {
  const ctx = React.useContext(SheetContext)
  const onClose = () => ctx?.setOpen(false)

  if (!ctx?.open) return null

  const basePanel = 'fixed bg-white shadow-xl border border-black/10'
  const panelPos =
    side === 'left'
      ? 'left-0 top-0 h-dvh w-[90vw] max-w-sm rounded-r-2xl'
      : side === 'right'
      ? 'right-0 top-0 h-dvh w-[90vw] max-w-sm rounded-l-2xl'
      : side === 'top'
      ? 'top-0 left-0 w-dvw h-[70vh] rounded-b-2xl'
      : 'bottom-0 left-0 w-dvw h-[70vh] rounded-t-2xl'

  return (
    <>
      <div className="fixed inset-0 bg-black/20" onClick={onClose} />
      <div className={[basePanel, panelPos, className].join(' ')}>
        {children}
      </div>
    </>
  )
}

export function SheetHeader({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={["px-4 py-3 border-b border-black/10", className].join(' ')} {...props} />
}

export function SheetTitle({ className = '', ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={["text-base font-semibold", className].join(' ')} {...props} />
}

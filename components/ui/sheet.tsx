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
      const childProps = children.props as any
      childProps.onClick?.(e)
      ctx.setOpen(true)
    },
  }
  return asChild ? React.cloneElement(children, props) : <button {...props}>{children}</button>
}

export function SheetContent({ side = 'right', className = '', children }: { side?: Side; className?: string; children: React.ReactNode }) {
  const ctx = React.useContext(SheetContext)
  const onClose = () => ctx?.setOpen(false)

  // Keep mounted for exit animation
  const [render, setRender] = React.useState(!!ctx?.open)
  const [show, setShow] = React.useState(!!ctx?.open)

  React.useEffect(() => {
    if (!ctx) return
    if (ctx.open) {
      setRender(true)
      // next frame to ensure transition
      const id = requestAnimationFrame(() => setShow(true))
      return () => cancelAnimationFrame(id)
    } else {
      setShow(false)
      const t = setTimeout(() => setRender(false), 220)
      return () => clearTimeout(t)
    }
  }, [ctx?.open])

  if (!render) return null

  const basePanel = 'fixed z-50 bg-white shadow-xl border border-black/10 overflow-y-auto transition-transform duration-200 ease-out will-change-transform'
  // Responsive positions: on small screens, side sheets behave like a bottom sheet.
  const panelPos =
    side === 'left'
      ? [
          // mobile: bottom sheet style
          'left-0 right-0 bottom-0 top-auto w-dvw h-[85dvh] rounded-t-2xl',
          // ≥sm: left drawer
          'sm:left-0 sm:top-0 sm:bottom-auto sm:right-auto sm:h-dvh sm:w-[90vw] sm:max-w-sm sm:rounded-r-2xl',
        ].join(' ')
      : side === 'right'
      ? [
          // mobile: bottom sheet style
          'left-0 right-0 bottom-0 top-auto w-dvw h-[85dvh] rounded-t-2xl',
          // ≥sm: right drawer
          'sm:right-0 sm:top-0 sm:bottom-auto sm:left-auto sm:h-dvh sm:w-[420px] sm:rounded-l-2xl',
        ].join(' ')
      : side === 'top'
      ? 'top-0 left-0 w-dvw h-[70vh] rounded-b-2xl'
      : 'bottom-0 left-0 w-dvw h-[70vh] rounded-t-2xl'

  // Enter/exit transforms
  const hiddenTf =
    side === 'left'
      ? 'translate-y-full sm:translate-y-0 sm:-translate-x-full'
      : side === 'right'
      ? 'translate-y-full sm:translate-y-0 sm:translate-x-full'
      : side === 'top'
      ? '-translate-y-full'
      : 'translate-y-full'
  const showTf =
    side === 'top' || side === 'bottom'
      ? 'translate-y-0'
      : 'translate-y-0 sm:translate-x-0'

  return (
    <>
      <div
        className={[
          'fixed inset-0 z-40 transition-opacity duration-200',
          'bg-black/30 sm:bg-black/20',
          show ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
        onClick={onClose}
      />
      <div className={[basePanel, panelPos, show ? showTf : hiddenTf, className].join(' ')}>
        <button
          aria-label="閉じる"
          onClick={onClose}
          className="absolute right-3 top-3 z-[60] rounded-md p-2 text-slate-600 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40"
        >
          ✕
        </button>
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

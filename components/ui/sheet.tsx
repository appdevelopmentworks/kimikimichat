'use client'
import * as React from 'react'
import { createPortal } from 'react-dom'

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
    onPointerDown: (e: React.PointerEvent) => {
      // Open as early as possible and prevent the follow-up click
      const childProps = children.props as any
      childProps.onPointerDown?.(e)
      ctx.setOpen(true)
      e.preventDefault()
      e.stopPropagation()
    },
    onClick: (e: React.MouseEvent) => {
      const childProps = children.props as any
      childProps.onClick?.(e)
      // Fallback for keyboard / non-pointer activation
      ctx.setOpen(true)
    },
  }
  return asChild ? React.cloneElement(children, props) : <button {...props}>{children}</button>
}

export function SheetContent({ side = 'right', className = '', children }: { side?: Side; className?: string; children: React.ReactNode }) {
  const ctx = React.useContext(SheetContext)
  const onClose = () => ctx?.setOpen(false)

  // Keep mounted for exit animation and guard initial tap
  const [render, setRender] = React.useState(!!ctx?.open)
  const [show, setShow] = React.useState(!!ctx?.open)
  const openedAt = React.useRef<number>(0)

  React.useEffect(() => {
    // Prevent background scroll while visible
    if (show) {
      const prev = document.documentElement.style.overflow
      document.documentElement.style.overflow = 'hidden'
      return () => {
        document.documentElement.style.overflow = prev
      }
    }
  }, [show])

  React.useEffect(() => {
    if (!ctx) return
    if (ctx.open) {
      setRender(true)
      setShow(true) // show immediately to avoid overlay-only frame
      openedAt.current = Date.now()
      return () => {}
    } else {
      setShow(false)
      const t = setTimeout(() => setRender(false), 220)
      return () => clearTimeout(t)
    }
  }, [ctx?.open])

  if (!render) return null

  // Ensure we render at document.body level to avoid iOS fixed-position issues
  const [portalEl, setPortalEl] = React.useState<HTMLElement | null>(null)
  React.useEffect(() => {
    if (typeof document === 'undefined') return
    let el = document.getElementById('sheet-portal') as HTMLElement | null
    if (!el) {
      el = document.createElement('div')
      el.id = 'sheet-portal'
      document.body.appendChild(el)
    }
    setPortalEl(el)
  }, [])
  if (!portalEl) return null

  const basePanel = 'fixed z-50 bg-white shadow-xl border border-black/10 overflow-y-auto transition-transform duration-200 ease-out will-change-transform pb-[env(safe-area-inset-bottom)]'
  // Responsive positions: on small screens, side sheets behave like a bottom sheet.
  const panelPos =
    side === 'left'
      ? [
          // mobile: bottom sheet style
          'left-0 right-0 bottom-0 top-auto w-screen h-[85vh] rounded-t-2xl',
          // ≥sm: left drawer
          'sm:left-0 sm:top-0 sm:bottom-auto sm:right-auto sm:h-dvh sm:w-[90vw] sm:max-w-sm sm:rounded-r-2xl',
        ].join(' ')
      : side === 'right'
      ? [
          // mobile: bottom sheet style
          'left-0 right-0 bottom-0 top-auto w-screen h-[85vh] rounded-t-2xl',
          // ≥sm: right drawer
          'sm:right-0 sm:top-0 sm:bottom-auto sm:left-auto sm:h-dvh sm:w-[420px] sm:rounded-l-2xl',
        ].join(' ')
      : side === 'top'
      ? 'top-0 left-0 w-screen h-[70vh] rounded-b-2xl'
      : 'bottom-0 left-0 w-screen h-[70vh] rounded-t-2xl'

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

  return createPortal(
    <>
      <div
        className={[
          'fixed inset-0 z-40 transition-opacity duration-200',
          'bg-black/30 sm:bg-black/20',
          show ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
        onClick={() => {
          if (Date.now() - openedAt.current < 300) return
          onClose()
        }}
      />
      <div
        className={[basePanel, panelPos, show ? showTf : hiddenTf, className].join(' ')}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          aria-label="閉じる"
          onClick={onClose}
          className="absolute right-3 top-3 z-[60] rounded-md p-2 text-slate-600 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40"
        >
          ✕
        </button>
        {children}
      </div>
    </>,
    portalEl
  )
}

export function SheetHeader({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={["px-4 py-3 border-b border-black/10", className].join(' ')} {...props} />
}

export function SheetTitle({ className = '', ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={["text-base font-semibold", className].join(' ')} {...props} />
}

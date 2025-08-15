import { RibbonIcon, Heart } from 'lucide-react'

export function Logo() {
  return (
    <div className="inline-flex items-center gap-3 select-none">
      <span className="inline-flex items-center justify-center h-9 w-9 rounded-full" style={{background:'var(--bubble-ai)'}}>
        <Heart className="h-4 w-4 text-pink-600" />
      </span>
      <span className="inline-flex items-center gap-1">
        <RibbonIcon className="h-4 w-4 text-[var(--accent)]" />
        <span className="font-semibold tracking-wide">Kimi Chat</span>
      </span>
    </div>
  )
}

// Simple localStorage-backed settings helpers

export type EmojiMode = 'normal' | 'low' | 'high'

const K_TEMPERATURE = 'kimi-settings-temperature'
const K_MAXTOKENS = 'kimi-settings-maxTokens'
const K_EMOJI = 'kimi-settings-emoji'

export function loadTemperature(defaultValue = 0.4): number {
  if (typeof window === 'undefined') return defaultValue
  try {
    const v = localStorage.getItem(K_TEMPERATURE)
    return v ? Math.min(1, Math.max(0, parseFloat(v))) : defaultValue
  } catch {
    return defaultValue
  }
}

export function saveTemperature(v: number) {
  try { localStorage.setItem(K_TEMPERATURE, String(v)) } catch {}
}

export function loadMaxTokens(defaultValue?: number): number | undefined {
  if (typeof window === 'undefined') return defaultValue
  try {
    const v = localStorage.getItem(K_MAXTOKENS)
    return v ? parseInt(v, 10) : defaultValue
  } catch {
    return defaultValue
  }
}

export function saveMaxTokens(v: number | undefined) {
  try {
    if (v == null || Number.isNaN(v)) localStorage.removeItem(K_MAXTOKENS)
    else localStorage.setItem(K_MAXTOKENS, String(v))
  } catch {}
}

export function loadEmojiMode(defaultValue: EmojiMode = 'normal'): EmojiMode {
  if (typeof window === 'undefined') return defaultValue
  try {
    const v = localStorage.getItem(K_EMOJI) as EmojiMode | null
    return v === 'low' || v === 'normal' || v === 'high' ? v : defaultValue
  } catch {
    return defaultValue
  }
}

export function saveEmojiMode(v: EmojiMode) {
  try { localStorage.setItem(K_EMOJI, v) } catch {}
}


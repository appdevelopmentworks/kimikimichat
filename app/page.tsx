 'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Logo } from '@/components/logo'
import { loadTemperature, saveTemperature, loadMaxTokens, saveMaxTokens, loadEmojiMode, saveEmojiMode, type EmojiMode } from '@/lib/settings'
import { Trash2, Settings2, Send, Copy } from 'lucide-react'

// 型
type Role = 'system' | 'user' | 'assistant'
interface Msg { id: string; role: Role; content: string; createdAt: number }

// ローカル保存
const LS_KEY = 'kimi-chat-threads'

export default function Page() {
  const [messages, setMessages] = useState<Msg[]>(() => [])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [temperature, setTemperature] = useState<number>(() => loadTemperature(0.4))
  const [maxTokens, setMaxTokens] = useState<number | undefined>(() => loadMaxTokens(undefined))
  const [emojiMode, setEmojiMode] = useState<EmojiMode>(() => loadEmojiMode('normal'))
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (raw) setMessages(JSON.parse(raw))
    } catch {}
  }, [])

  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(messages)) } catch {}
  }, [messages])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  // Persist settings changes
  useEffect(() => { saveTemperature(temperature) }, [temperature])
  useEffect(() => { saveMaxTokens(maxTokens) }, [maxTokens])
  useEffect(() => { saveEmojiMode(emojiMode) }, [emojiMode])

  const systemPrompt = useMemo(() => (
    'あなたは思いやりのあるアシスタントです。語尾は丁寧でやさしく、女性好みの表現を心がけます。' +
    '必要に応じて簡潔な箇条書きを用い、絵文字は控えめ〜普通の頻度で使います。'
  ), [])

  async function onSend() {
    const text = input.trim()
    if (!text || busy) return
    setInput('')

    const id = crypto.randomUUID()
    const base: Msg[] = messages.length ? messages : [{ id: crypto.randomUUID(), role: 'system' as Role, content: systemPrompt, createdAt: Date.now() }]
    const next = [...base, { id, role: 'user' as Role, content: text, createdAt: Date.now() }]
    setMessages(next)

    setBusy(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next.map(m => ({ role: m.role, content: m.content })),
          temperature,
          max_tokens: maxTokens,
        }),
      })

      if (!res.body) throw new Error('No stream')
      const reader = res.body.getReader()
      const decoder = new TextDecoder('utf-8')
      let aiText = ''
      const aiId = crypto.randomUUID()
      setMessages(prev => [...prev, { id: aiId, role: 'assistant' as Role, content: '', createdAt: Date.now() }])

      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        aiText += decoder.decode(value, { stream: true })
        setMessages(prev => prev.map(m => m.id === aiId ? { ...m, content: aiText } : m))
      }
    } catch (e) {
      console.error(e)
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'assistant' as Role, content: '申し訳ありません。通信で問題が発生しました。もう一度お試しください。', createdAt: Date.now() }])
    } finally {
      setBusy(false)
    }
  }

  function resetAll() {
    if (confirm('全ての会話を削除しますか？')) {
      setMessages([])
      localStorage.removeItem(LS_KEY)
    }
  }

  function copyAll() {
    const txt = messages.map(m => `${m.role}: ${m.content}`).join('\n')
    navigator.clipboard.writeText(txt)
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/40 border-b">
        <div className="max-w-3xl mx-auto flex items-center justify-between p-3">
          <Logo />
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={copyAll} title="コピー"><Copy className="h-5 w-5"/></Button>
            <Button variant="ghost" onClick={resetAll} title="全削除"><Trash2 className="h-5 w-5"/></Button>
            <SettingsSheet temperature={temperature} setTemperature={setTemperature} maxTokens={maxTokens} setMaxTokens={setMaxTokens} emojiMode={emojiMode} setEmojiMode={setEmojiMode} />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-3 pt-4 pb-0">
          <ScrollArea className="h-[calc(100dvh-220px)] rounded-2xl bg-white/70 pt-4 px-4 pb-4 shadow-soft">
            <div className="space-y-2 sm:space-y-3">
              {messages.length === 0 && (
                <Card className="bg-white/80">
                  <CardContent className="p-4 text-sm">
                    はじめまして。ご質問をどうぞ。やさしく丁寧にお答えします☺️
                  </CardContent>
                </Card>
              )}

              {messages.map((m) =>
                React.createElement((motion as any).div, {
                  key: m.id,
                  initial: { opacity: 0, y: 4 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.15 },
                  className: `max-w-[92%] md:max-w-[80%] rounded-2xl px-4 py-3 shadow-soft ${m.role === 'user' ? 'ml-auto' : ''}`,
                  style: { background: m.role === 'user' ? 'var(--bubble-user)' : m.role === 'assistant' ? 'var(--bubble-ai)' : 'transparent' },
                },
                  <div className="text-xs opacity-60 pb-1">{m.role}</div>,
                  <div className="whitespace-pre-wrap leading-7">{m.content}</div>
                )
              )}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>
        </div>
      </main>

      <footer className="sticky bottom-0 safe-bottom border-t bg-white/70 backdrop-blur">
        <div className="max-w-3xl mx-auto p-3">
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="メッセージを入力..."
              className="min-h-[48px] max-h-40 resize-y rounded-2xl"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault(); onSend();
                }
              }}
            />
            <Button onClick={onSend} disabled={busy || !input.trim()} className="rounded-2xl" title="送信">
              <Send className="h-5 w-5"/>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}

function SettingsSheet({ temperature, setTemperature, maxTokens, setMaxTokens, emojiMode, setEmojiMode }:{
  temperature: number; setTemperature: (n:number)=>void;
  maxTokens?: number; setMaxTokens: (n:number|undefined)=>void;
  emojiMode: 'normal'|'low'|'high'; setEmojiMode: (v:'normal'|'low'|'high')=>void;
}) {
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  if (isMobile) {
    return (
      <Button variant="ghost" title="設定" onClick={() => router.push('/settings')}>
        <Settings2 className="h-5 w-5"/>
      </Button>
    )
  }
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" title="設定"><Settings2 className="h-5 w-5"/></Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>設定</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4 px-4 pb-6 break-words">
          <div className="space-y-2">
            <Label>温度（創造性）: {temperature.toFixed(2)}</Label>
            <input type="range" min={0} max={1} step={0.05} value={temperature}
              onChange={(e)=>setTemperature(parseFloat(e.target.value))} className="w-full"/>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>最大トークン（任意）</Label>
            <Input type="number" placeholder="例: 2048" value={maxTokens ?? ''}
              onChange={(e)=> setMaxTokens(e.target.value ? parseInt(e.target.value,10) : undefined)} />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>絵文字の強さ</Label>
            <div className="flex flex-wrap items-center gap-3 gap-y-2 text-sm">
              <label className="inline-flex items-center gap-2 min-w-0"><input type="radio" name="emoji" onChange={()=>setEmojiMode('low')} checked={emojiMode==='low'} />控えめ</label>
              <label className="inline-flex items-center gap-2 min-w-0"><input type="radio" name="emoji" onChange={()=>setEmojiMode('normal')} checked={emojiMode==='normal'} />普通</label>
              <label className="inline-flex items-center gap-2 min-w-0"><input type="radio" name="emoji" onChange={()=>setEmojiMode('high')} checked={emojiMode==='high'} />多め</label>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { loadTemperature, saveTemperature, loadMaxTokens, saveMaxTokens, loadEmojiMode, saveEmojiMode, type EmojiMode } from '@/lib/settings'

export default function SettingsPage(){
  const router = useRouter()
  const [temperature, setTemperature] = useState<number>(() => loadTemperature(0.4))
  const [maxTokens, setMaxTokens] = useState<number | undefined>(() => loadMaxTokens(undefined))
  const [emojiMode, setEmojiMode] = useState<EmojiMode>(() => loadEmojiMode('normal'))

  useEffect(() => { saveTemperature(temperature) }, [temperature])
  useEffect(() => { saveMaxTokens(maxTokens) }, [maxTokens])
  useEffect(() => { saveEmojiMode(emojiMode) }, [emojiMode])

  return (
    <div className="min-h-dvh flex flex-col bg-[var(--bg)]">
      <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
        <div className="max-w-3xl mx-auto flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => router.back()} title="戻る">←</Button>
            <h1 className="text-base font-semibold">設定</h1>
          </div>
          <div />
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-3xl mx-auto p-4">
          <div className="space-y-6">
            <section className="space-y-2">
              <Label>温度（創造性）: {temperature.toFixed(2)}</Label>
              <input type="range" min={0} max={1} step={0.05} value={temperature}
                onChange={(e)=>setTemperature(parseFloat(e.target.value))} className="w-full" />
            </section>

            <Separator />

            <section className="space-y-2">
              <Label>最大トークン（任意）</Label>
              <Input type="number" placeholder="例: 2048" value={maxTokens ?? ''}
                onChange={(e)=> setMaxTokens(e.target.value ? parseInt(e.target.value,10) : undefined)} />
            </section>

            <Separator />

            <section className="space-y-2">
              <Label>絵文字の強さ</Label>
              <div className="flex flex-wrap items-center gap-3 gap-y-2 text-sm">
                <label className="inline-flex items-center gap-2 min-w-0"><input type="radio" name="emoji" onChange={()=>setEmojiMode('low')} checked={emojiMode==='low'} />控えめ</label>
                <label className="inline-flex items-center gap-2 min-w-0"><input type="radio" name="emoji" onChange={()=>setEmojiMode('normal')} checked={emojiMode==='normal'} />普通</label>
                <label className="inline-flex items-center gap-2 min-w-0"><input type="radio" name="emoji" onChange={()=>setEmojiMode('high')} checked={emojiMode==='high'} />多め</label>
              </div>
            </section>

            <Separator />

            <section className="space-y-2">
              <Label>メモ</Label>
              <p className="text-sm text-black/60">設定は端末のローカルに保存され、メイン画面に戻ると直ちに反映されます。</p>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}


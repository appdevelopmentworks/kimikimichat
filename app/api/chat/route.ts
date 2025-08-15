import { NextRequest } from 'next/server'
import { openai, MODEL_ID } from '@/lib/ai'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function POST(req: NextRequest) {
  const { messages, temperature = 0.4, max_tokens } = await req.json()

  const stream = await openai.chat.completions.create({
    model: MODEL_ID,
    messages: messages ?? [],
    temperature,
    max_tokens,
    stream: true,
  })

  const encoder = new TextEncoder()

  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const delta = (chunk as any).choices?.[0]?.delta?.content || ''
          if (delta) controller.enqueue(encoder.encode(delta))
        }
      } catch (err: any) {
        controller.error(err)
      } finally {
        controller.close()
      }
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  })
}

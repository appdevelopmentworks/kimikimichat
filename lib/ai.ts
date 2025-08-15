// lib/ai.ts — Groq(OpenAI互換)クライアント
import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
})

export const MODEL_ID = process.env.MODEL_ID || 'moonshotai/kimi-k2-instruct'

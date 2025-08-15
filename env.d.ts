/// <reference types="next" />
/// <reference types="next/image-types/global" />

declare namespace NodeJS {
  interface ProcessEnv {
    GROQ_API_KEY?: string
    MODEL_ID?: string
  }
}

import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://example.com'),
  title: {
    default: 'Kimi Chat',
    template: '%s | Kimi Chat',
  },
  description: '生成り×桜ピンク×ラベンダー×落ち着きブルーで彩る、やさしいKimiチャット。',
  applicationName: 'Kimi Chat',
  keywords: ['Chat', 'AI', 'Next.js', 'かわいい', 'Kimi'],
  appleWebApp: { title: 'Kimi Chat', statusBarStyle: 'default', capable: true },
  formatDetection: { telephone: false },
  themeColor: '#FAF7F2',
  openGraph: {
    title: 'Kimi Chat',
    description: 'やさしい会話体験をどうぞ。',
    type: 'website',
    url: 'https://example.com',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-dvh bg-[var(--bg)] text-[var(--fg)] antialiased font-sans">
        {children}
      </body>
    </html>
  )
}

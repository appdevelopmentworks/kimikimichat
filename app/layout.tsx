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
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
  },
  openGraph: {
    title: 'Kimi Chat',
    description: 'やさしい会話体験をどうぞ。',
    type: 'website',
    url: 'https://example.com',
    images: [
      {
        url: '/icon-512.png',
        width: 512,
        height: 512,
        alt: 'Kimi Chat',
      },
    ],
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

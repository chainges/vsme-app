import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '../index.css'
import { ErrorBoundary } from '@/components/common/error-boundary'
import { FocusManager } from '@/components/common/focus-manager'
import { Providers } from '@/components/layout'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'vsme-guru',
  description: 'vsme-guru',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ErrorBoundary>
          <Providers>
            <FocusManager />
            <a className="skip-link" href="#main-content">
              Skip to main content
            </a>
            <div className="grid h-svh grid-rows-[auto_1fr]" id="main-content">
              {children}
            </div>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
}

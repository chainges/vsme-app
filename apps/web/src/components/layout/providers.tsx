'use client'

import { ErrorBoundary } from '@/components/common/error-boundary'
import { AuthProvider } from '@/contexts/mock-auth-context'
import { Toaster } from '../ui/sonner'
import { ThemeProvider } from './theme-provider'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange enableSystem>
        <ErrorBoundary>
          <AuthProvider>
            {children}
            <Toaster richColors />
          </AuthProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

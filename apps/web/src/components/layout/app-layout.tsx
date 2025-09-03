'use client'

import Link from 'next/link'
import type * as React from 'react'
import { useEffect } from 'react'
import { AppSidebar } from '@/components/navigation'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { useMockAuth } from '@/contexts/mock-auth-context'
import { Header } from './index'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: DashboardLayoutProps) {
  const { isAuthenticated, isLoading } = useMockAuth()

  // Redirect to home if not authenticated (this will be handled by Clerk later)
  useEffect(() => {
    if (!(isLoading || isAuthenticated)) {
      // Use window.location for immediate redirect
      window.location.href = '/'
    }
  }, [isAuthenticated, isLoading])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-primary border-b-2" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 font-semibold text-2xl">Access Denied</h2>
          <p className="mb-4 text-muted-foreground">Please sign in to access the dashboard.</p>
          <Link
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            href="/"
          >
            Go to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header className="sticky top-0 z-10 bg-background" isDashboard={true} />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}

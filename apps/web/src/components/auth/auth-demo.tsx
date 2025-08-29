'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { ErrorBoundary } from '@/components/common/error-boundary'
import { ErrorDisplay } from '@/components/common/error-display'
import { InlineLoader } from '@/components/common/loading'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'

export function AuthDemo() {
  const { isAuthenticated, user, signIn, signOut, isLoading } = useAuth()
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSignIn = async () => {
    setActionLoading(true)
    setError(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call
      signIn()
      toast.success('Successfully signed in!')
      // The redirect will be handled by the home page useEffect
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setActionLoading(false)
    }
  }

  const handleSignOut = async () => {
    setActionLoading(true)
    setError(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 300)) // Simulate API call
      signOut()
      toast.success('Successfully signed out!')
      // Stay on home page after sign out
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign out'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setActionLoading(false)
    }
  }

  const handleRetry = () => {
    setError(null)
    if (isAuthenticated) {
      handleSignOut()
    } else {
      handleSignIn()
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <div className="flex items-center gap-2">
            <InlineLoader />
            <span className="text-muted-foreground text-sm">Loading authentication...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <ErrorBoundary>
      <Card>
        <CardHeader>
          <CardTitle>Mock Authentication Demo</CardTitle>
          <CardDescription>
            This demonstrates the authentication system with loading states and error handling.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <ErrorDisplay
              error={error}
              onRetry={handleRetry}
              retryText="Try Again"
              variant="minimal"
            />
          )}

          <div className="space-y-2">
            <p>
              <strong>Status:</strong>{' '}
              {isAuthenticated ? '✅ Authenticated' : '❌ Not authenticated'}
            </p>

            {user && (
              <div className="space-y-1 rounded-md bg-muted p-3">
                <p>
                  <strong>User ID:</strong> {user.id}
                </p>
                <p>
                  <strong>Name:</strong> {user.name}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Role:</strong> {user.role}
                </p>
                {user.avatar && (
                  <p>
                    <strong>Avatar:</strong> {user.avatar}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {isAuthenticated ? (
              <Button
                className="min-w-[120px]"
                disabled={actionLoading}
                onClick={handleSignOut}
                variant="outline"
              >
                {actionLoading ? (
                  <>
                    <InlineLoader className="mr-2" />
                    Signing Out...
                  </>
                ) : (
                  'Sign Out'
                )}
              </Button>
            ) : (
              <Button className="min-w-[120px]" disabled={actionLoading} onClick={handleSignIn}>
                {actionLoading ? (
                  <>
                    <InlineLoader className="mr-2" />
                    Signing In...
                  </>
                ) : (
                  'Sign In (Mock)'
                )}
              </Button>
            )}
          </div>

          <p className="text-muted-foreground text-sm">
            This is a mock authentication system for UI development. Authentication state persists
            across page refreshes.
            {!isAuthenticated && " Click 'Sign In' to be redirected to the dashboard."}
          </p>
        </CardContent>
      </Card>
    </ErrorBoundary>
  )
}

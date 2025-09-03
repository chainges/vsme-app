'use client'

import { AlertTriangle, RefreshCw, Wifi, WifiOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ErrorDisplayProps {
  error: string | Error
  title?: string
  description?: string
  onRetry?: () => void
  retryText?: string
  className?: string
  variant?: 'default' | 'minimal' | 'inline'
  showIcon?: boolean
}

export function ErrorDisplay({
  error,
  title,
  description,
  onRetry,
  retryText = 'Try Again',
  className,
  variant = 'default',
  showIcon = true,
}: ErrorDisplayProps) {
  const errorMessage = typeof error === 'string' ? error : error.message
  const isNetworkError =
    errorMessage.toLowerCase().includes('network') ||
    errorMessage.toLowerCase().includes('fetch') ||
    errorMessage.toLowerCase().includes('connection')

  if (variant === 'inline') {
    return (
      <div
        className={cn('flex items-center gap-2 text-red-600 text-sm dark:text-red-400', className)}
      >
        {showIcon && <AlertTriangle className="h-4 w-4" />}
        <span>{errorMessage}</span>
        {onRetry && (
          <Button className="h-auto p-1" onClick={onRetry} size="sm" variant="ghost">
            <RefreshCw className="h-3 w-3" />
          </Button>
        )}
      </div>
    )
  }

  if (variant === 'minimal') {
    return (
      <div
        className={cn(
          'rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/10',
          className
        )}
      >
        <div className="flex items-start gap-3">
          {showIcon && <AlertTriangle className="mt-0.5 h-5 w-5 text-red-600 dark:text-red-400" />}
          <div className="flex-1">
            <p className="font-medium text-red-800 text-sm dark:text-red-200">{title || 'Error'}</p>
            <p className="mt-1 text-red-700 text-sm dark:text-red-300">{errorMessage}</p>
            {onRetry && (
              <Button
                className="mt-3 border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/20"
                onClick={onRetry}
                size="sm"
                variant="outline"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                {retryText}
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Default card variant
  return (
    <Card className={cn('mx-auto max-w-md', className)}>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
          {isNetworkError ? (
            <WifiOff className="h-6 w-6 text-red-600 dark:text-red-400" />
          ) : (
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
          )}
        </div>
        <CardTitle className="text-red-900 dark:text-red-100">
          {title || (isNetworkError ? 'Connection Error' : 'Error')}
        </CardTitle>
        <CardDescription>{description || errorMessage}</CardDescription>
      </CardHeader>
      {onRetry && (
        <CardContent>
          <Button className="w-full" onClick={onRetry}>
            <RefreshCw className="mr-2 h-4 w-4" />
            {retryText}
          </Button>
        </CardContent>
      )}
    </Card>
  )
}

// Specific error components for common scenarios
export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorDisplay
      error="Unable to connect to the server. Please check your internet connection."
      onRetry={onRetry}
      retryText="Retry Connection"
      title="Connection Error"
    />
  )
}

export function NotFoundError({
  resource = 'resource',
  onRetry,
}: {
  resource?: string
  onRetry?: () => void
}) {
  return (
    <ErrorDisplay
      error={`The ${resource} you're looking for could not be found.`}
      onRetry={onRetry}
      retryText="Go Back"
      title="Not Found"
    />
  )
}

export function UnauthorizedError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorDisplay
      error="You don't have permission to access this resource."
      onRetry={onRetry}
      retryText="Try Again"
      title="Access Denied"
    />
  )
}

export function ServerError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorDisplay
      error="Something went wrong on our end. Please try again later."
      onRetry={onRetry}
      retryText="Retry"
      title="Server Error"
    />
  )
}

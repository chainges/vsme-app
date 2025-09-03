'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useApiCall } from '@/hooks/use-async'
import { apiCalls } from '@/lib/api'
import { ErrorDisplay } from './error-display'
import { InlineLoader } from './loading'

interface HealthCheckResponse {
  status: string
  message: string
  timestamp: string
}

export function ApiStatus() {
  const {
    data: healthData,
    error,
    isLoading,
    isError,
    isSuccess,
    execute: checkApiStatus,
  } = useApiCall<HealthCheckResponse>(apiCalls.healthCheck)

  useEffect(() => {
    checkApiStatus()
  }, [checkApiStatus])

  const getStatusColor = () => {
    if (isSuccess) return 'text-green-600'
    if (isError) return 'text-red-600'
    return 'text-yellow-600'
  }

  const getStatusText = () => {
    if (isSuccess) return '✅ Connected'
    if (isError) return '❌ Error'
    return '⏳ Loading...'
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">API Status</h3>
        <Button disabled={isLoading} onClick={checkApiStatus} size="sm" variant="outline">
          {isLoading ? <InlineLoader className="mr-2" /> : null}
          Refresh
        </Button>
      </div>

      <div className="space-y-2">
        <p className={`font-medium ${getStatusColor()}`}>{getStatusText()}</p>

        {isError && (
          <ErrorDisplay
            error={error || 'Unknown error'}
            onRetry={checkApiStatus}
            retryText="Retry Connection"
            showIcon={false}
            variant="minimal"
          />
        )}

        {isSuccess && healthData && (
          <>
            <p className="text-muted-foreground text-sm">{healthData.message || 'API Connected'}</p>
            {healthData.timestamp && (
              <p className="text-muted-foreground text-xs">
                Last checked: {new Date(healthData.timestamp).toLocaleString()}
              </p>
            )}
          </>
        )}
      </div>

      <div className="text-muted-foreground text-xs">
        <p>Server URL: {process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}</p>
        <p>RPC Type Safety: ✅ Enabled</p>
      </div>
    </div>
  )
}

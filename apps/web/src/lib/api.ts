import { hc } from 'hono/client'

// Create the RPC client - simplified to avoid deep type instantiation issues
const client = hc(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000')

export { client }

// Export the API client for use in components and hooks
export const api = client

// Helper function to handle API errors
export function handleApiError(error: any): string {
  if (error?.message) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
    return 'Network error: Unable to connect to server'
  }
  return 'An unexpected error occurred'
}

// Type-safe API response handler with enhanced error handling
export async function handleApiResponse<T>(
  response: Response
): Promise<{ data?: T; error?: string }> {
  try {
    if (!response.ok) {
      let errorMessage: string

      try {
        const errorData = await response.json()
        errorMessage = errorData.error || errorData.message || `HTTP ${response.status}`
      } catch {
        // If response is not JSON, use status text
        errorMessage = response.statusText || `HTTP ${response.status}`
      }

      // Map common HTTP status codes to user-friendly messages
      switch (response.status) {
        case 400:
          errorMessage = errorMessage || 'Invalid request data'
          break
        case 401:
          errorMessage = 'Authentication required'
          break
        case 403:
          errorMessage = 'Access denied'
          break
        case 404:
          errorMessage = 'Resource not found'
          break
        case 429:
          errorMessage = 'Too many requests. Please try again later'
          break
        case 500:
          errorMessage = 'Server error. Please try again later'
          break
        case 503:
          errorMessage = 'Service temporarily unavailable'
          break
      }

      return { error: errorMessage }
    }

    const data = await response.json()
    return { data }
  } catch (error) {
    return { error: handleApiError(error) }
  }
}

// Retry utility for API calls
export async function withRetry<T>(
  apiCall: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      // Don't retry on client errors (4xx) except 429 (rate limit)
      if (
        error instanceof Response &&
        error.status >= 400 &&
        error.status < 500 &&
        error.status !== 429
      ) {
        throw lastError
      }

      if (attempt === maxRetries) {
        throw lastError
      }

      // Exponential backoff
      await new Promise((resolve) => setTimeout(resolve, delay * 2 ** (attempt - 1)))
    }
  }

  throw lastError!
}

// Example usage functions for common API calls with retry logic
export const apiCalls = {
  // Health check with retry
  async healthCheck(): Promise<{ data?: any; error?: string }> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/v1/health`
      )
      return await handleApiResponse(response)
    } catch (error) {
      return { error: handleApiError(error) }
    }
  },

  // Auth endpoints (for future Clerk integration)
  auth: {
    async register(data: { name: string; email: string; password: string }) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/v1/auth/register`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          }
        )
        return await handleApiResponse(response)
      } catch (error) {
        return { error: handleApiError(error) }
      }
    },

    async login(data: { email: string; password: string }) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/v1/auth/login`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          }
        )
        return await handleApiResponse(response)
      } catch (error) {
        return { error: handleApiError(error) }
      }
    },

    async logout() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/v1/auth/logout`,
          {
            method: 'POST',
          }
        )
        return await handleApiResponse(response)
      } catch (error) {
        return { error: handleApiError(error) }
      }
    },
  },
}

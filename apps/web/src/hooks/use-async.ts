import { useCallback, useEffect, useState } from 'react'

interface AsyncState<T> {
  data: T | null
  error: string | null
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
}

interface UseAsyncOptions {
  immediate?: boolean
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
}

export function useAsync<T>(asyncFunction: () => Promise<T>, options: UseAsyncOptions = {}) {
  const { immediate = false, onSuccess, onError } = options

  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
  })

  const execute = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      isError: false,
      isSuccess: false,
    }))

    try {
      const data = await asyncFunction()
      setState({
        data,
        error: null,
        isLoading: false,
        isError: false,
        isSuccess: true,
      })
      onSuccess?.(data)
      return data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      setState({
        data: null,
        error: errorMessage,
        isLoading: false,
        isError: true,
        isSuccess: false,
      })
      onError?.(errorMessage)
      throw error
    }
  }, [asyncFunction, onSuccess, onError])

  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      isLoading: false,
      isError: false,
      isSuccess: false,
    })
  }, [])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  return {
    ...state,
    execute,
    reset,
  }
}

// Hook for handling API calls with automatic error handling
export function useApiCall<T>(
  apiCall: () => Promise<{ data?: T; error?: string }>,
  options: UseAsyncOptions = {}
) {
  const wrappedApiCall = useCallback(async () => {
    const result = await apiCall()
    if (result.error) {
      throw new Error(result.error)
    }
    return result.data as T
  }, [apiCall])

  return useAsync(wrappedApiCall, options)
}

// Hook for handling form submissions
export function useAsyncSubmit<T>(
  submitFunction: (data: any) => Promise<T>,
  options: UseAsyncOptions = {}
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
  })

  const submit = useCallback(
    async (formData: any) => {
      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
        isError: false,
        isSuccess: false,
      }))

      try {
        const data = await submitFunction(formData)
        setState({
          data,
          error: null,
          isLoading: false,
          isError: false,
          isSuccess: true,
        })
        options.onSuccess?.(data)
        return data
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Submission failed'
        setState({
          data: null,
          error: errorMessage,
          isLoading: false,
          isError: true,
          isSuccess: false,
        })
        options.onError?.(errorMessage)
        throw error
      }
    },
    [submitFunction, options]
  )

  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      isLoading: false,
      isError: false,
      isSuccess: false,
    })
  }, [])

  return {
    ...state,
    submit,
    reset,
  }
}

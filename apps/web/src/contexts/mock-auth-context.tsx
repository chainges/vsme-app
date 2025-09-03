'use client'

import type React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'

interface MockUser {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
}

interface MockAuthContextType {
  isAuthenticated: boolean
  user: MockUser | null
  isLoading: boolean
  signIn: () => void
  signOut: () => void
}

const MockAuthContext = createContext<MockAuthContextType | undefined>(undefined)

const MOCK_USER: MockUser = {
  id: 'mock-user-1',
  name: 'John Doe',
  email: 'john.doe@vsme-guru.com',
  avatar: 'https://github.com/shadcn.png',
  role: 'user',
}

export function MockAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check for persisted auth state on mount
  useEffect(() => {
    try {
      const savedAuthState = localStorage.getItem('mock-auth-state')
      if (savedAuthState === 'true') {
        setIsAuthenticated(true)
      }
    } catch (error) {
      console.error('Failed to load mock auth state:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Persist auth state changes
  useEffect(() => {
    try {
      localStorage.setItem('mock-auth-state', isAuthenticated.toString())
    } catch (error) {
      console.error('Failed to save mock auth state:', error)
    }
  }, [isAuthenticated])

  const signIn = () => {
    setIsAuthenticated(true)
  }

  const signOut = () => {
    setIsAuthenticated(false)
  }

  const value: MockAuthContextType = {
    isAuthenticated,
    user: isAuthenticated ? MOCK_USER : null,
    isLoading,
    signIn,
    signOut,
  }

  return <MockAuthContext.Provider value={value}>{children}</MockAuthContext.Provider>
}

export function useMockAuth() {
  const context = useContext(MockAuthContext)
  if (context === undefined) {
    throw new Error('useMockAuth must be used within a MockAuthProvider')
  }
  return context
}

// Environment-based auth provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Use mock auth when explicitly enabled or in development mode
  const shouldUseMockAuth =
    process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true' ||
    (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_MOCK_AUTH !== 'false')

  if (shouldUseMockAuth) {
    return <MockAuthProvider>{children}</MockAuthProvider>
  }

  // This would be ClerkProvider in the final implementation
  // For now, return children without auth context (will cause errors if auth is used)
  console.warn('Mock auth is disabled but no real auth provider is configured')
  return <>{children}</>
}

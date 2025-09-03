'use client'

import { createContext, type ReactNode, useContext, useEffect, useState } from 'react'

// User interface based on design document
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  createdAt: Date
  lastLoginAt: Date
}

// Authentication context interface
export interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  signIn: (userData: User) => void
  signOut: () => void
  isLoading: boolean
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Storage key for localStorage
const AUTH_STORAGE_KEY = 'vsme-guru-auth'

// AuthProvider component with localStorage persistence
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load authentication state from localStorage on mount
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY)
        if (storedAuth) {
          const parsedAuth = JSON.parse(storedAuth)
          // Convert date strings back to Date objects
          if (parsedAuth.user) {
            parsedAuth.user.createdAt = new Date(parsedAuth.user.createdAt)
            parsedAuth.user.lastLoginAt = new Date(parsedAuth.user.lastLoginAt)
            setUser(parsedAuth.user)
          }
        }
      } catch (error) {
        console.error('Failed to load authentication state:', error)
        // Clear invalid data
        try {
          localStorage.removeItem(AUTH_STORAGE_KEY)
        } catch (clearError) {
          console.error('Failed to clear invalid auth data:', clearError)
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadAuthState()
  }, [])

  // Sign in function
  const signIn = (userData: User) => {
    const userWithTimestamp = {
      ...userData,
      lastLoginAt: new Date(),
    }

    setUser(userWithTimestamp)

    // Persist to localStorage
    try {
      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          user: userWithTimestamp,
          timestamp: new Date().toISOString(),
        })
      )
    } catch (error) {
      console.error('Failed to save authentication state:', error)
    }
  }

  // Sign out function
  const signOut = () => {
    setUser(null)

    // Remove from localStorage
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    } catch (error) {
      console.error('Failed to clear authentication state:', error)
    }
  }

  const value: AuthContextType = {
    isAuthenticated: !!user,
    user,
    signIn,
    signOut,
    isLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use authentication context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}

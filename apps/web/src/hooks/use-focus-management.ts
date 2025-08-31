'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

/**
 * Hook to manage focus for route changes and accessibility
 */
export function useFocusManagement() {
  const pathname = usePathname()
  const previousPathnameRef = useRef<string | undefined>(undefined)

  useEffect(() => {
    // Skip focus management on initial load
    if (previousPathnameRef.current === undefined) {
      previousPathnameRef.current = pathname
      return
    }

    // Only manage focus if the route actually changed
    if (previousPathnameRef.current !== pathname) {
      // Focus the main content area or first heading
      const mainContent = document.querySelector('main')
      const firstHeading = document.querySelector('h1, h2, h3, h4, h5, h6')

      if (mainContent) {
        // Make main content focusable temporarily
        mainContent.setAttribute('tabindex', '-1')
        mainContent.focus()

        // Remove tabindex after focus to avoid interfering with normal tab flow
        setTimeout(() => {
          mainContent.removeAttribute('tabindex')
        }, 100)
      } else if (firstHeading) {
        // Fallback to first heading
        ;(firstHeading as HTMLElement).focus()
      }

      // Announce route change to screen readers
      announceRouteChange(pathname)
    }

    previousPathnameRef.current = pathname
  }, [pathname])
}

/**
 * Announce route changes to screen readers
 */
function announceRouteChange(pathname: string) {
  // Create or update a live region for route announcements
  let liveRegion = document.getElementById('route-announcer')

  if (!liveRegion) {
    liveRegion = document.createElement('div')
    liveRegion.id = 'route-announcer'
    liveRegion.setAttribute('aria-live', 'polite')
    liveRegion.setAttribute('aria-atomic', 'true')
    liveRegion.className = 'sr-only'
    document.body.appendChild(liveRegion)
  }

  // Convert pathname to readable text
  const routeName = getRouteDisplayName(pathname)
  liveRegion.textContent = `Navigated to ${routeName}`
}

/**
 * Convert pathname to user-friendly display name
 */
function getRouteDisplayName(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 0) {
    return 'Home page'
  }

  // Convert segments to readable names
  const readableSegments = segments.map((segment) =>
    segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  )

  return readableSegments.join(' - ') + ' page'
}

/**
 * Hook for managing keyboard navigation within components
 */
export function useKeyboardNavigation() {
  const handleKeyDown = (event: KeyboardEvent) => {
    // Handle common keyboard navigation patterns
    switch (event.key) {
      case 'Escape': {
        // Close modals, dropdowns, etc.
        const activeElement = document.activeElement as HTMLElement
        if (activeElement && activeElement.blur) {
          activeElement.blur()
        }
        break
      }

      case 'Tab':
        // Ensure focus is visible
        document.body.classList.add('keyboard-navigation')
        break
    }
  }

  const handleMouseDown = () => {
    // Remove keyboard navigation class when using mouse
    document.body.classList.remove('keyboard-navigation')
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])
}

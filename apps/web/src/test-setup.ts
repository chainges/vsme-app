import '@testing-library/jest-dom'
import { beforeEach, vi } from 'vitest'
import React from 'react'

// Make React available globally for JSX
globalThis.React = React

// Mock framer-motion globally for all tests
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion')
  const React = await import('react')
  return {
    ...actual,
    motion: {
      div: ({ children, ...props }: any) => React.createElement('div', props, children),
    },
    AnimatePresence: ({ children }: any) => children,
  }
})

// Mock localStorage for testing
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
}

// Mock navigator
const navigatorMock = {
  userAgent: 'test-user-agent',
}

// Mock window object
const windowMock = {
  localStorage: localStorageMock,
  navigator: navigatorMock,
} as any

// Set up global mocks
Object.defineProperty(globalThis, 'window', {
  value: windowMock,
  writable: true,
  configurable: true,
})

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
})

Object.defineProperty(globalThis, 'navigator', {
  value: navigatorMock,
  writable: true,
  configurable: true,
})

// Mock ResizeObserver for Radix UI components
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = MockResizeObserver as any

// Mock IntersectionObserver for Radix UI components
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.IntersectionObserver = MockIntersectionObserver as any

// Mock clearTimeout and setTimeout with proper types
if (!globalThis.clearTimeout) {
  globalThis.clearTimeout = vi.fn()
}
if (!globalThis.setTimeout) {
  globalThis.setTimeout = vi.fn()
}

// Mock DOMRect for getBoundingClientRect
class MockDOMRect {
  bottom = 0
  height = 0
  left = 0
  right = 0
  top = 0
  width = 0
  x = 0
  y = 0
  toJSON() {
    return JSON.stringify(this)
  }
}

// Add window methods to the window mock
Object.assign(windowMock, {
  clearTimeout: vi.fn(),
  setTimeout: vi.fn(),
  ResizeObserver: MockResizeObserver,
  IntersectionObserver: MockIntersectionObserver,
})

// Mock element methods for DOM interactions
if (typeof Element !== 'undefined') {
  Element.prototype.getBoundingClientRect = vi.fn(() => new MockDOMRect())
  Element.prototype.scrollIntoView = vi.fn()
  Element.prototype.hasPointerCapture = vi.fn()
  Element.prototype.setPointerCapture = vi.fn()
  Element.prototype.releasePointerCapture = vi.fn()
}

// Reset localStorage mock before each test
beforeEach(() => {
  localStorageMock.getItem.mockClear()
  localStorageMock.setItem.mockClear()
  localStorageMock.removeItem.mockClear()
  localStorageMock.clear.mockClear()
  localStorageMock.key.mockClear()
})

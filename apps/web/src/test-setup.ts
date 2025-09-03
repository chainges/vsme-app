import '@testing-library/jest-dom'
import React from 'react'
import { beforeEach, vi } from 'vitest'

// Set up JSDOM environment
const { JSDOM } = require('jsdom')

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost:3000',
  pretendToBeVisual: true,
  resources: 'usable',
})

// Set up global objects - single consistent setup
globalThis.window = dom.window as any
globalThis.document = dom.window.document
globalThis.navigator = dom.window.navigator
globalThis.HTMLElement = dom.window.HTMLElement
globalThis.Element = dom.window.Element
globalThis.Node = dom.window.Node
globalThis.history = dom.window.history
globalThis.location = dom.window.location

// Make React available globally for JSX
globalThis.React = React

// Mock localStorage - single implementation
const localStorageMock = {
  store: {} as Record<string, string>,

  getItem(key: string) {
    return this.store[key] || null
  },

  setItem(key: string, value: string) {
    this.store[key] = value.toString()
  },

  removeItem(key: string) {
    delete this.store[key]
  },

  clear() {
    this.store = {}
  },

  key(index: number) {
    const keys = Object.keys(this.store)
    return keys[index] || null
  },

  get length() {
    return Object.keys(this.store).length
  },
}

// Set up global localStorage mock
Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
})

Object.defineProperty(globalThis.window, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
})

// Mock framer-motion globally for all tests
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion')
  return {
    ...actual,
    motion: {
      div: ({ children, ...props }: any) => React.createElement('div', props, children),
    },
    AnimatePresence: ({ children }: any) => children,
  }
})

// Mock @radix-ui/react-select
vi.mock('@radix-ui/react-select', async () => {
  const actual = await vi.importActual('@radix-ui/react-select')
  return {
    ...actual,
    Root: ({ children, onValueChange, value, disabled }: any) =>
      React.createElement(
        'div',
        {
          'data-testid': 'select-root',
          role: 'combobox',
          'aria-expanded': false,
        },
        children
      ),
    Trigger: ({ children, ...props }: any) =>
      React.createElement(
        'button',
        {
          ...props,
          'data-testid': 'select-trigger',
          role: 'combobox',
          'aria-expanded': false,
        },
        children
      ),
    Content: ({ children, ...props }: any) =>
      React.createElement(
        'div',
        {
          ...props,
          'data-testid': 'select-content',
          role: 'listbox',
        },
        children
      ),
    Portal: ({ children }: any) => children,
    Viewport: ({ children, ...props }: any) =>
      React.createElement('div', { ...props, 'data-testid': 'select-viewport' }, children),
    Item: ({ children, value, ...props }: any) =>
      React.createElement(
        'div',
        {
          ...props,
          'data-testid': 'select-item',
          'data-value': value,
          role: 'option',
        },
        children
      ),
    ItemText: ({ children }: any) => React.createElement('span', null, children),
    ItemIndicator: ({ children }: any) =>
      React.createElement('span', { 'data-testid': 'select-indicator' }, children),
    Value: ({ placeholder }: any) =>
      React.createElement('span', { 'data-testid': 'select-value' }, placeholder),
    Icon: ({ children }: any) =>
      React.createElement('span', { 'data-testid': 'select-icon' }, children),
    ScrollUpButton: ({ children, ...props }: any) =>
      React.createElement('div', { ...props, 'data-testid': 'select-scroll-up' }, children),
    ScrollDownButton: ({ children, ...props }: any) =>
      React.createElement('div', { ...props, 'data-testid': 'select-scroll-down' }, children),
    Group: ({ children, ...props }: any) =>
      React.createElement('div', { ...props, 'data-testid': 'select-group' }, children),
    Label: ({ children, ...props }: any) =>
      React.createElement('div', { ...props, 'data-testid': 'select-label' }, children),
    Separator: (props: any) =>
      React.createElement('div', {
        ...props,
        'data-testid': 'select-separator',
      }),
  }
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
globalThis.clearTimeout = vi.fn() as any
globalThis.setTimeout = vi.fn() as any

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

// Add observer classes to window
globalThis.window.ResizeObserver = MockResizeObserver as any
globalThis.window.IntersectionObserver = MockIntersectionObserver as any

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
  localStorageMock.clear()
})

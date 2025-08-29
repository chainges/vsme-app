/**
 * Bun Test Setup
 * Simplified setup for Bun's test runner
 */

import React from 'react'
import { JSDOM } from 'jsdom'

// Set up JSDOM environment for DOM testing
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost:3000',
  pretendToBeVisual: true,
  resources: 'usable',
})

// Assign DOM globals
globalThis.window = dom.window as any
globalThis.document = dom.window.document
globalThis.navigator = dom.window.navigator
globalThis.HTMLElement = dom.window.HTMLElement
globalThis.Element = dom.window.Element
globalThis.Node = dom.window.Node
globalThis.history = dom.window.history
globalThis.location = dom.window.location

// Make React available globally
globalThis.React = React

// Mock localStorage for testing
const localStorageMock = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
  length: 0,
  key: () => null,
}

// Set up localStorage
Object.defineProperty(globalThis.window, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
})

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
})

// Mock ResizeObserver
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = MockResizeObserver as any
globalThis.window.ResizeObserver = MockResizeObserver as any

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.IntersectionObserver = MockIntersectionObserver as any
globalThis.window.IntersectionObserver = MockIntersectionObserver as any

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

// Add element methods for DOM interactions
if (typeof Element !== 'undefined') {
  Element.prototype.getBoundingClientRect = () => new MockDOMRect()
  Element.prototype.scrollIntoView = () => {}
  Element.prototype.hasPointerCapture = () => false
  Element.prototype.setPointerCapture = () => {}
  Element.prototype.releasePointerCapture = () => {}
}

// Mock alert for tests
globalThis.alert = () => {}

console.log('Bun test setup loaded successfully - DOM environment ready')

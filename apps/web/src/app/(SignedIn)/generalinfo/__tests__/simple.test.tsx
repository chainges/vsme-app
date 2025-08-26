import { render } from '@testing-library/react'
import { describe, expect, test, vi, beforeEach } from 'vitest'
import GeneralInfoPage from '../page'

beforeEach(() => {
  global.alert = vi.fn()
})

describe('Simple test', () => {
  test('can render GeneralInfoPage', () => {
    const { container } = render(<GeneralInfoPage />)
    expect(container).toBeTruthy()
  })
})

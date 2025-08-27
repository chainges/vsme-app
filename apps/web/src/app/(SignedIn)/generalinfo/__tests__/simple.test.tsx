import '../../../../bun-test-setup'
import { render } from '@testing-library/react'
import { describe, expect, test, beforeEach } from 'vitest'
import GeneralInfoPage from '../page'

beforeEach(() => {
  // Any test-specific setup
})

describe('Simple test', () => {
  test('can render GeneralInfoPage', () => {
    const { container } = render(<GeneralInfoPage />)
    expect(container).toBeTruthy()
  })
})

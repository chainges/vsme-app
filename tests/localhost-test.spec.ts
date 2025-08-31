import { expect, test } from '@playwright/test'

test('can access localhost:3001/test', async ({ page }) => {
  // Navigate to the test page
  await page.goto('/test')

  // Wait for the page to load
  await page.waitForLoadState('networkidle')

  // Verify the page loaded successfully
  expect(page.url()).toContain('/test')

  // Take a screenshot for debugging
  await page.screenshot({ path: 'test-results/localhost-3001-test.png' })

  // Log the page title
  const title = await page.title()
  console.log('Page title:', title)

  // Check if the page has content
  const bodyText = await page.textContent('body')
  expect(bodyText).toBeTruthy()
})

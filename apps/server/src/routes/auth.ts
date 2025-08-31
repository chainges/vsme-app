import { Hono } from 'hono'

const auth = new Hono()

/**
 * Placeholder Auth Routes
 *
 * These routes are placeholders since we're using Clerk for authentication.
 * They will be replaced with proper Clerk-based authentication middleware
 * when we implement the API layer in the data fetching strategy.
 */

// Placeholder register endpoint
auth.post('/register', async (c) => {
  return c.json(
    {
      message:
        'Authentication is handled by Clerk. Please use the frontend authentication flow.',
      status: 'placeholder',
    },
    501
  )
})

// Placeholder login endpoint
auth.post('/login', async (c) => {
  return c.json(
    {
      message:
        'Authentication is handled by Clerk. Please use the frontend authentication flow.',
      status: 'placeholder',
    },
    501
  )
})

// Placeholder logout endpoint
auth.post('/logout', async (c) => {
  return c.json({
    message:
      'Authentication is handled by Clerk. Please use the frontend authentication flow.',
    status: 'placeholder',
  })
})

export default auth

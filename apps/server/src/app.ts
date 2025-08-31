import 'dotenv/config'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import routes from './routes/index'

const app = new Hono()

// Configure middleware
app.use(logger())
app.use(
  '/*',
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
)

// Mount routes
app.route('/api/v1', routes)

// Health check endpoint
app.get('/', (c) => {
  return c.json({ status: 'OK', message: 'VSME Guru API Server' })
})

export default app

// Export the app type for RPC integration
export type AppType = typeof app

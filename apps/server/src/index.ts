import app from './app'

const port = Number(process.env.PORT) || 3000

// Start the server using Bun.serve
const server = Bun.serve({
  port,
  fetch: app.fetch,
})

console.log(`🚀 Server running on http://localhost:${server.port}`)

// Export for potential testing or other uses
export default {
  port: server.port,
  fetch: app.fetch,
}

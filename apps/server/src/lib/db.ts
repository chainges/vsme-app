import { PrismaClient } from '../../prisma/generated/client'

declare global {
  var __prisma: PrismaClient | undefined
}

// Singleton pattern for Prisma client to prevent multiple instances
export const db =
  globalThis.__prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = db
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await db.$disconnect()
})

export default db

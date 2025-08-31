import { PrismaClient } from '../../prisma/generated/client'

declare global {
  var __prisma: PrismaClient | undefined
}

// Singleton pattern for Prisma client to avoid multiple connections
export const prisma =
  globalThis.__prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

// Export service instances
import { CompanyService } from './services/company-service'
import { ReportService } from './services/report-service'

export const companyService = new CompanyService(prisma)
export const reportService = new ReportService(prisma)

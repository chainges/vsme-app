import { MongoClient } from 'mongodb'
import { PrismaClient } from '../../prisma/generated/client'

// Test primary database connection
export async function testPrimaryDatabase() {
  const prisma = new PrismaClient()

  try {
    // Test connection by attempting to count records in all collections
    const [userCount, companyCount, reportCount] = await Promise.all([
      prisma.user.count(),
      prisma.company.count(),
      prisma.report.count(),
    ])

    console.log('✅ Primary database connected successfully.')
    console.log(`   - Users: ${userCount}`)
    console.log(`   - Companies: ${companyCount}`)
    console.log(`   - Reports: ${reportCount}`)
    return true
  } catch (error) {
    console.error('❌ Primary database connection failed:', error)
    return false
  } finally {
    await prisma.$disconnect()
  }
}

// Test external database connection
export async function testExternalDatabase() {
  try {
    // Use the external database client for testing
    const { externalDb } = await import('./external-db')

    // Test connection health
    const isHealthy = await externalDb.testConnection()
    if (!isHealthy) {
      console.error('❌ External database health check failed')
      return false
    }

    // List available databases
    const databases = await externalDb.listDatabases()

    // Test basic query operation using configured database name
    const { getExternalDbConfig } = await import('./external-db-config')
    const config = getExternalDbConfig()
    const testQuery = await externalDb.find(
      config.databaseName,
      'resources',
      {},
      { limit: 1 }
    )

    console.log('✅ External database connected successfully.')
    console.log(`   - Available databases: ${databases.length}`)
    console.log(
      `   - Test query successful: ${testQuery.length >= 0 ? 'Yes' : 'No'}`
    )
    console.log(
      `   - Databases: ${databases.slice(0, 5).join(', ')}${databases.length > 5 ? '...' : ''}`
    )

    return true
  } catch (error) {
    console.error('❌ External database connection failed:', error)
    return false
  }
}

// Test both database connections
export async function testAllDatabases() {
  console.log('🔍 Testing database connections...')

  const primaryResult = await testPrimaryDatabase()
  const externalResult = await testExternalDatabase()

  if (primaryResult && externalResult) {
    console.log('🎉 All database connections successful!')
    return true
  }
  console.log('⚠️  Some database connections failed')
  return false
}

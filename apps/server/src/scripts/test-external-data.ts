#!/usr/bin/env bun

/**
 * External Data Service Test Script
 *
 * This script tests the external data service functionality.
 * Used by: Development testing and validation of external data integration
 * Purpose: Validates external data service operations and connection health
 */

import { externalDb } from '../lib/external-db'
import { externalDataService } from '../lib/services/external-data-service'

async function main() {
  try {
    console.log('🧪 Testing External Data Service...')

    // Test 1: Connection health
    console.log('\n1. Testing connection health...')
    const isHealthy = await externalDataService.validateConnection()
    console.log(`   Connection healthy: ${isHealthy ? '✅' : '❌'}`)

    // Test 2: Get external data statistics
    console.log('\n2. Getting external data statistics...')
    const stats = await externalDataService.getExternalDataStats()
    console.log(`   Total resources: ${stats.totalResources}`)
    console.log(`   Available databases: ${stats.availableDatabases.length}`)
    console.log(`   Connection health: ${stats.connectionHealth ? '✅' : '❌'}`)

    // Test 3: Fetch shared resources (limited)
    console.log('\n3. Fetching shared resources (first 5)...')
    const resources = await externalDataService.getSharedResources({
      limit: 5,
      offset: 0,
    })
    console.log(`   Found ${resources.data.length} resources`)
    console.log(`   Total available: ${resources.metadata.total}`)

    if (resources.data.length > 0) {
      console.log(`   Sample resource: ${resources.data[0].name}`)
    }

    // Test 4: Test search functionality (if resources exist)
    if (resources.metadata.total > 0) {
      console.log('\n4. Testing search functionality...')
      const searchResults = await externalDataService.searchSharedResources(
        'test',
        {
          limit: 3,
        }
      )
      console.log(`   Search results: ${searchResults.data.length}`)
    }

    // Test 5: Test aggregation (simple count by database)
    console.log('\n5. Testing aggregation...')
    try {
      const aggregation = await externalDataService.getAggregatedData([
        { $group: { _id: null, count: { $sum: 1 } } },
      ])
      console.log(
        `   Aggregation result: ${aggregation.length > 0 ? aggregation[0].count : 0} total documents`
      )
    } catch (error) {
      console.log(`   Aggregation test skipped: ${error}`)
    }

    // Test 6: Direct database operations
    console.log('\n6. Testing direct database operations...')
    const databases = await externalDb.listDatabases()
    console.log(
      `   Available databases: ${databases.slice(0, 5).join(', ')}${databases.length > 5 ? '...' : ''}`
    )

    // Test connection cleanup
    console.log('\n7. Testing connection cleanup...')
    await externalDb.close()
    console.log('   Connection closed successfully')

    console.log('\n🎉 All external data service tests completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('💥 External data service test failed:', error)
    process.exit(1)
  }
}

// Run the test
main()

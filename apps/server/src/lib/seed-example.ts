import { prisma } from './prisma'

// Example seed data for testing the models
export async function seedExampleData() {
  try {
    // Create a test user if it doesn't exist
    const testUser = await prisma.user.upsert({
      where: { clerkId: 'test-clerk-id' },
      update: {},
      create: {
        clerkId: 'test-clerk-id',
        email: 'test@example.com',
        name: 'Test User',
        organizationId: 'test-org-123',
      },
    })

    // Create a test company
    const testCompany = await prisma.company.create({
      data: {
        year: 2024,
        name: 'Test Company AS',
        organizationId: 'test-org-123',
        registrationNumber: '123456789',
        revenue: 1_000_000,
        naceCode: '62.01',
        industry: 'Software Development',
        industryCo2Intensity: 8.5,
        createdBy: testUser.id,
      },
    })

    // Create a test report with ESG data
    const testReport = await prisma.report.create({
      data: {
        organizationId: 'test-org-123',
        year: 2024,
        companyId: testCompany.id,
        createdBy: testUser.id,
        environmental: {
          energyAndEmissions: {
            scope1: 100.5,
            scope2: 200.3,
            scope3Market: 300.7,
            scope3Location: 250.2,
            renewableEnergy: 150.0,
            nonRenewableEnergy: 350.0,
            climateDataCollectionMethod: 'Direct measurement',
            climateDataUncertainty: 'Low',
            reported: true,
          },
        },
        social: {
          employees: {
            fullTimeEmployees: 25,
            partTimeEmployees: 5,
            tempEmployees: 2,
            reported: true,
          },
        },
        governance: {
          ethics: {
            corruptionCases: 0,
            whistleBlowerReports: 1,
            reported: true,
          },
          finesAndPenalties: {
            fnp: false,
            description: 'No fines or penalties reported',
            reported: true,
          },
        },
      },
    })

    console.log('✅ Seed data created successfully:')
    console.log(`   - User: ${testUser.name} (${testUser.email})`)
    console.log(
      `   - Company: ${testCompany.name} (${testCompany.registrationNumber})`
    )
    console.log(`   - Report: ${testReport.year} ESG Report`)

    return { testUser, testCompany, testReport }
  } catch (error) {
    console.error('❌ Error seeding data:', error)
    throw error
  }
}

// Clean up test data
export async function cleanupTestData() {
  try {
    await prisma.report.deleteMany({
      where: { organizationId: 'test-org-123' },
    })

    await prisma.company.deleteMany({
      where: { organizationId: 'test-org-123' },
    })

    await prisma.user.deleteMany({
      where: { clerkId: 'test-clerk-id' },
    })

    console.log('✅ Test data cleaned up successfully')
  } catch (error) {
    console.error('❌ Error cleaning up test data:', error)
    throw error
  }
}

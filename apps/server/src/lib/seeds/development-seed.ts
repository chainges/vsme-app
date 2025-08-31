/**
 * Development Database Seeding
 *
 * This module provides seeding functionality for development environments.
 * Used by:
 * - Development setup scripts to populate initial data
 * - Testing environments to create consistent test data
 * - Local development to have realistic data for UI development
 *
 * Purpose: Creates a complete set of realistic ESG data for testing
 * the Company and Report models with various scenarios
 */

import type { CompanyData, ReportData } from '../../types/esg-models'
import { prisma } from '../prisma'

/**
 * Seed development data with realistic ESG companies and reports
 * Used by: npm scripts and development setup to populate the database
 * Purpose: Provides realistic data for frontend development and testing
 */
export async function seedDevelopmentData() {
  try {
    // biome-ignore lint/suspicious/noConsole: Script output for user feedback
    console.log('🌱 Starting development data seeding...')

    // Create development users for different organizations
    const users = await createDevelopmentUsers()

    // Create companies for each organization
    const companies = await createDevelopmentCompanies(users)

    // Create ESG reports for the companies
    const reports = await createDevelopmentReports(companies, users)

    console.log('✅ Development seeding completed successfully!')
    console.log(`   - Created ${users.length} users`)
    console.log(`   - Created ${companies.length} companies`)
    console.log(`   - Created ${reports.length} ESG reports`)

    return { users, companies, reports }
  } catch (error) {
    console.error('❌ Development seeding failed:', error)
    throw error
  }
}

/**
 * Create development users representing different organizations
 * Used by: seedDevelopmentData() to establish user context for companies
 * Purpose: Creates users that represent different organizations for multi-tenant testing
 */
async function createDevelopmentUsers() {
  const userData = [
    {
      clerkId: 'dev-user-1',
      email: 'admin@greentech.no',
      name: 'Admin User',
      organizationId: 'org-greentech-123',
    },
    {
      clerkId: 'dev-user-2',
      email: 'manager@sustaincorp.no',
      name: 'ESG Manager',
      organizationId: 'org-sustaincorp-456',
    },
    {
      clerkId: 'dev-user-3',
      email: 'analyst@ecoventures.no',
      name: 'Data Analyst',
      organizationId: 'org-ecoventures-789',
    },
  ]

  const users = []
  for (const user of userData) {
    const createdUser = await prisma.user.upsert({
      where: { clerkId: user.clerkId },
      update: user,
      create: user,
    })
    users.push(createdUser)
  }

  return users
}

/**
 * Create development companies with realistic ESG profiles
 * Used by: seedDevelopmentData() to create companies for ESG reporting
 * Purpose: Provides diverse company profiles for testing different ESG scenarios
 */
async function createDevelopmentCompanies(users: any[]) {
  const companiesData: (CompanyData & { createdBy: string })[] = [
    // Technology companies
    {
      year: 2024,
      name: 'GreenTech Solutions AS',
      organizationId: users[0].organizationId,
      registrationNumber: '987654321',
      revenue: 15_000_000,
      naceCode: '62.01',
      industry: 'Software Development',
      industryCo2Intensity: 0.3,
      createdBy: users[0].id,
    },
    {
      year: 2024,
      name: 'Nordic Data Center AS',
      organizationId: users[0].organizationId,
      registrationNumber: '987654322',
      revenue: 45_000_000,
      naceCode: '63.11',
      industry: 'Data Processing',
      industryCo2Intensity: 2.1,
      createdBy: users[0].id,
    },
    // Manufacturing companies
    {
      year: 2024,
      name: 'SustainCorp Manufacturing',
      organizationId: users[1].organizationId,
      registrationNumber: '123456789',
      revenue: 85_000_000,
      naceCode: '25.50',
      industry: 'Metal Products Manufacturing',
      industryCo2Intensity: 4.2,
      createdBy: users[1].id,
    },
    {
      year: 2024,
      name: 'EcoFriendly Textiles AS',
      organizationId: users[1].organizationId,
      registrationNumber: '123456790',
      revenue: 25_000_000,
      naceCode: '13.10',
      industry: 'Textile Manufacturing',
      industryCo2Intensity: 3.1,
      createdBy: users[1].id,
    },
    // Service companies
    {
      year: 2024,
      name: 'EcoVentures Consulting',
      organizationId: users[2].organizationId,
      registrationNumber: '555666777',
      revenue: 8_000_000,
      naceCode: '70.22',
      industry: 'Business Consulting',
      industryCo2Intensity: 0.5,
      createdBy: users[2].id,
    },
  ]

  const companies = []
  for (const companyData of companiesData) {
    const company = await prisma.company.create({
      data: companyData,
    })
    companies.push(company)
  }

  return companies
}

/**
 * Create development ESG reports with varied data completeness
 * Used by: seedDevelopmentData() to create realistic ESG reporting scenarios
 * Purpose: Provides reports with different levels of data completeness for testing UI states
 */
async function createDevelopmentReports(companies: any[], users: any[]) {
  const reports = []

  // Create reports for each company with different data patterns
  for (let i = 0; i < companies.length; i++) {
    const company = companies[i]
    const user = users[i % users.length]

    // Create 2023 report (previous year)
    const report2023 = await createESGReport(
      company,
      user,
      2023,
      getESGData2023(i)
    )
    reports.push(report2023)

    // Create 2024 report (current year) - some incomplete for testing
    const report2024 = await createESGReport(
      company,
      user,
      2024,
      getESGData2024(i)
    )
    reports.push(report2024)
  }

  return reports
}

/**
 * Create individual ESG report with specified data
 * Used by: createDevelopmentReports() to create each report record
 * Purpose: Centralizes report creation logic with proper validation
 */
async function createESGReport(
  company: any,
  user: any,
  year: number,
  esgData: any
) {
  const reportData: ReportData & { createdBy: string } = {
    organizationId: company.organizationId,
    year,
    companyId: company.id,
    createdBy: user.id,
    ...esgData,
  }

  return await prisma.report.create({
    data: reportData,
  })
}

/**
 * Generate 2023 ESG data patterns (complete data)
 * Used by: createDevelopmentReports() to create historical complete reports
 * Purpose: Provides baseline complete data for year-over-year comparisons
 */
function getESGData2023(companyIndex: number) {
  const baseEmissions = [100, 250, 500, 150, 75][companyIndex] || 100
  const baseEmployees = [25, 120, 350, 80, 15][companyIndex] || 50

  return {
    environmental: {
      energyAndEmissions: {
        scope1: baseEmissions * 1.2,
        scope2: baseEmissions * 0.8,
        scope3Market: baseEmissions * 2.1,
        scope3Location: baseEmissions * 1.9,
        renewableEnergy: baseEmissions * 0.3,
        nonRenewableEnergy: baseEmissions * 1.7,
        climateDataCollectionMethod:
          'Direct measurement with third-party verification',
        climateDataUncertainty: 'Low - verified data',
        reported: true,
      },
    },
    social: {
      employees: {
        fullTimeEmployees: baseEmployees,
        partTimeEmployees: Math.floor(baseEmployees * 0.2),
        tempEmployees: Math.floor(baseEmployees * 0.1),
        reported: true,
      },
    },
    governance: {
      ethics: {
        corruptionCases: 0,
        whistleBlowerReports: companyIndex > 2 ? 1 : 0,
        reported: true,
      },
      finesAndPenalties: {
        fnp: false,
        description: 'No fines or penalties in 2023',
        reported: true,
      },
    },
  }
}

/**
 * Generate 2024 ESG data patterns (mixed completeness for testing)
 * Used by: createDevelopmentReports() to create current year reports with varied completeness
 * Purpose: Tests UI handling of incomplete data and different reporting states
 */
function getESGData2024(companyIndex: number) {
  const baseEmissions = [95, 240, 480, 145, 70][companyIndex] || 95
  const baseEmployees = [28, 125, 360, 85, 18][companyIndex] || 55

  // Vary data completeness for different testing scenarios
  switch (companyIndex) {
    case 0: // Complete data
      return {
        environmental: {
          energyAndEmissions: {
            scope1: baseEmissions * 1.1,
            scope2: baseEmissions * 0.75,
            scope3Market: baseEmissions * 2.0,
            scope3Location: baseEmissions * 1.8,
            renewableEnergy: baseEmissions * 0.4,
            nonRenewableEnergy: baseEmissions * 1.5,
            climateDataCollectionMethod: 'Direct measurement with IoT sensors',
            climateDataUncertainty: 'Very Low - automated collection',
            reported: true,
          },
        },
        social: {
          employees: {
            fullTimeEmployees: baseEmployees,
            partTimeEmployees: Math.floor(baseEmployees * 0.25),
            tempEmployees: Math.floor(baseEmployees * 0.05),
            reported: true,
          },
        },
        governance: {
          ethics: {
            corruptionCases: 0,
            whistleBlowerReports: 0,
            reported: true,
          },
          finesAndPenalties: {
            fnp: false,
            description: 'No fines or penalties in 2024',
            reported: true,
          },
        },
      }

    case 1: // Partial environmental data
      return {
        environmental: {
          energyAndEmissions: {
            scope1: baseEmissions * 1.05,
            scope2: baseEmissions * 0.7,
            // Missing scope 3 data for testing
            renewableEnergy: baseEmissions * 0.45,
            climateDataCollectionMethod:
              'Estimation based on industry averages',
            climateDataUncertainty: 'Medium - estimated values',
            reported: false, // Not fully reported
          },
        },
        social: {
          employees: {
            fullTimeEmployees: baseEmployees,
            partTimeEmployees: Math.floor(baseEmployees * 0.3),
            tempEmployees: Math.floor(baseEmployees * 0.08),
            reported: true,
          },
        },
        // Missing governance data for testing
      }

    case 2: // Only social data reported
      return {
        social: {
          employees: {
            fullTimeEmployees: baseEmployees,
            partTimeEmployees: Math.floor(baseEmployees * 0.15),
            tempEmployees: Math.floor(baseEmployees * 0.12),
            reported: true,
          },
        },
        governance: {
          ethics: {
            corruptionCases: 0,
            whistleBlowerReports: 2,
            reported: true,
          },
          finesAndPenalties: {
            fnp: true,
            description: 'Minor environmental compliance fine - €5,000',
            reported: true,
          },
        },
        // Missing environmental data for testing
      }

    default: // Minimal data
      return {
        environmental: {
          energyAndEmissions: {
            reported: false,
          },
        },
        social: {
          employees: {
            fullTimeEmployees: baseEmployees,
            reported: true,
          },
        },
        governance: {
          ethics: {
            reported: false,
          },
          finesAndPenalties: {
            fnp: false,
            reported: false,
          },
        },
      }
  }
}

/**
 * Clean up all development seed data
 * Used by: Development reset scripts and testing cleanup
 * Purpose: Removes all seeded data to start fresh or clean up after tests
 */
export async function cleanupDevelopmentData() {
  try {
    console.log('🧹 Cleaning up development data...')

    // Delete in reverse order of dependencies
    await prisma.report.deleteMany({
      where: {
        organizationId: {
          in: [
            'org-greentech-123',
            'org-sustaincorp-456',
            'org-ecoventures-789',
          ],
        },
      },
    })

    await prisma.company.deleteMany({
      where: {
        organizationId: {
          in: [
            'org-greentech-123',
            'org-sustaincorp-456',
            'org-ecoventures-789',
          ],
        },
      },
    })

    await prisma.user.deleteMany({
      where: {
        clerkId: {
          in: ['dev-user-1', 'dev-user-2', 'dev-user-3'],
        },
      },
    })

    console.log('✅ Development data cleanup completed')
  } catch (error) {
    console.error('❌ Development data cleanup failed:', error)
    throw error
  }
}

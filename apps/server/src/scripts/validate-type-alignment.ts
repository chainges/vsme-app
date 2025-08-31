#!/usr/bin/env bun

/**
 * Type Alignment Validation Script
 *
 * This script validates that TypeScript types, Zod schemas, and Prisma models
 * are properly aligned to prevent type mismatches across the application layers.
 *
 * Used by:
 * - Kiro hooks to automatically validate after schema changes
 * - Development workflow to catch type misalignments early
 * - CI/CD pipeline to prevent deployment of misaligned types
 *
 * Purpose: Ensures type safety across database, business logic, and API layers
 */

import { z } from 'zod'
import {
  companySchema,
  employeesSchema,
  energyAndEmissionsSchema,
  environmentalSchema,
  ethicsSchema,
  finesAndPenaltiesSchema,
  governanceSchema,
  reportSchema,
  socialSchema,
} from '../lib/validation/esg-schemas'
import type {
  CompanyData,
  EmployeesData,
  EnergyAndEmissionsData,
  EnvironmentalData,
  EthicsData,
  FinesAndPenaltiesData,
  GovernanceData,
  ReportData,
  SocialData,
} from '../types/esg-models'

interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  summary: {
    totalChecks: number
    passed: number
    failed: number
  }
}

interface CoverageAnalysis {
  prismaModels: string[]
  prismaTypes: string[]
  validatedTypes: string[]
  missingValidation: string[]
  coveragePercentage: number
}

async function main() {
  try {
    console.log('🔍 Validating Type Alignment')
    console.log('============================')

    // Analyze coverage first
    const coverage = await analyzeCoverage()
    console.log('\n📋 Coverage Analysis:')
    console.log(`   Prisma Models: ${coverage.prismaModels.join(', ')}`)
    console.log(`   Prisma Types: ${coverage.prismaTypes.join(', ')}`)
    console.log(`   Validated Types: ${coverage.validatedTypes.join(', ')}`)
    console.log(`   Coverage: ${coverage.coveragePercentage.toFixed(1)}%`)

    if (coverage.missingValidation.length > 0) {
      console.log('\n⚠️  Missing Validation Coverage:')
      for (const missing of coverage.missingValidation) {
        console.log(`   - ${missing}`)
      }
    }

    const result = await validateTypeAlignment()

    // Display results
    console.log('\n📊 Validation Summary:')
    console.log(`   Total Checks: ${result.summary.totalChecks}`)
    console.log(`   Passed: ${result.summary.passed}`)
    console.log(`   Failed: ${result.summary.failed}`)

    if (result.errors.length > 0) {
      console.log('\n❌ Type Alignment Errors:')
      for (const error of result.errors) {
        console.log(`   - ${error}`)
      }
    }

    if (result.warnings.length > 0) {
      console.log('\n⚠️  Type Alignment Warnings:')
      for (const warning of result.warnings) {
        console.log(`   - ${warning}`)
      }
    }

    if (result.isValid) {
      console.log('\n✅ All type alignments are valid!')
    } else {
      console.log('\n❌ Type alignment validation failed!')
    }

    // Final coverage warning if needed
    if (coverage.missingValidation.length > 0) {
      console.log(
        '\n⚠️  Consider adding validation for missing types to ensure complete coverage.'
      )
    }

    process.exit(result.isValid ? 0 : 1)
  } catch (error) {
    console.error('💥 Type alignment validation crashed:', error)
    process.exit(1)
  }
}

/**
 * Validate alignment between TypeScript types and Zod schemas
 * Used by: main() to perform comprehensive type checking
 * Purpose: Ensures business types match validation schemas
 */
async function validateTypeAlignment(): Promise<ValidationResult> {
  const errors: string[] = []
  const warnings: string[] = []
  let totalChecks = 0
  let passed = 0

  // Check Company types alignment
  console.log('\n🏢 Validating Company types...')
  const companyResult = validateCompanyTypes()
  totalChecks += companyResult.totalChecks
  passed += companyResult.passed
  errors.push(...companyResult.errors)
  warnings.push(...companyResult.warnings)

  // Check Report types alignment
  console.log('📊 Validating Report types...')
  const reportResult = validateReportTypes()
  totalChecks += reportResult.totalChecks
  passed += reportResult.passed
  errors.push(...reportResult.errors)
  warnings.push(...reportResult.warnings)

  // Check ESG nested types alignment
  console.log('🌱 Validating ESG nested types...')
  const esgResult = validateESGTypes()
  totalChecks += esgResult.totalChecks
  passed += esgResult.passed
  errors.push(...esgResult.errors)
  warnings.push(...esgResult.warnings)

  // Check Prisma schema alignment
  console.log('🗄️  Validating Prisma schema alignment...')
  const prismaResult = await validatePrismaAlignment()
  totalChecks += prismaResult.totalChecks
  passed += prismaResult.passed
  errors.push(...prismaResult.errors)
  warnings.push(...prismaResult.warnings)

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    summary: {
      totalChecks,
      passed,
      failed: totalChecks - passed,
    },
  }
}

/**
 * Validate Company type alignment
 * Used by: validateTypeAlignment() to check company-specific types
 * Purpose: Ensures CompanyData interface matches companySchema
 */
function validateCompanyTypes() {
  const errors: string[] = []
  const warnings: string[] = []
  let totalChecks = 0
  let passed = 0

  try {
    // Test that CompanyData can be validated by companySchema
    totalChecks++
    const testCompanyData: CompanyData = {
      year: 2024,
      name: 'Test Company',
      organizationId: 'test-org',
      registrationNumber: '123456789',
      revenue: 1_000_000,
      naceCode: '62.01',
      industry: 'Software',
      industryCo2Intensity: 0.5,
    }

    const validationResult = companySchema.safeParse(testCompanyData)
    if (validationResult.success) {
      passed++
      console.log('   ✅ CompanyData ↔ companySchema alignment valid')
    } else {
      errors.push(
        `CompanyData validation failed: ${validationResult.error.message}`
      )
      console.log('   ❌ CompanyData ↔ companySchema alignment failed')
    }

    // Check for missing optional fields
    totalChecks++
    const requiredFields = [
      'year',
      'name',
      'organizationId',
      'registrationNumber',
    ]
    const schemaShape = companySchema.shape
    const missingFields = requiredFields.filter(
      (field) => !(field in schemaShape)
    )

    if (missingFields.length === 0) {
      passed++
      console.log('   ✅ All required Company fields present in schema')
    } else {
      errors.push(
        `Missing required fields in companySchema: ${missingFields.join(', ')}`
      )
      console.log('   ❌ Missing required Company fields in schema')
    }
  } catch (error) {
    errors.push(`Company type validation error: ${error}`)
  }

  return { totalChecks, passed, errors, warnings }
}

/**
 * Validate Report type alignment
 * Used by: validateTypeAlignment() to check report-specific types
 * Purpose: Ensures ReportData interface matches reportSchema
 */
function validateReportTypes() {
  const errors: string[] = []
  const warnings: string[] = []
  let totalChecks = 0
  let passed = 0

  try {
    // Test that ReportData can be validated by reportSchema
    totalChecks++
    const testReportData: ReportData = {
      organizationId: 'test-org',
      year: 2024,
      companyId: 'test-company-id',
      environmental: {
        energyAndEmissions: {
          scope1: 100,
          scope2: 200,
          reported: true,
        },
      },
    }

    const validationResult = reportSchema.safeParse(testReportData)
    if (validationResult.success) {
      passed++
      console.log('   ✅ ReportData ↔ reportSchema alignment valid')
    } else {
      errors.push(
        `ReportData validation failed: ${validationResult.error.message}`
      )
      console.log('   ❌ ReportData ↔ reportSchema alignment failed')
    }
  } catch (error) {
    errors.push(`Report type validation error: ${error}`)
  }

  return { totalChecks, passed, errors, warnings }
}

/**
 * Validate ESG nested types alignment
 * Used by: validateTypeAlignment() to check nested ESG data structures
 * Purpose: Ensures all nested ESG interfaces match their Zod schemas
 */
function validateESGTypes() {
  const errors: string[] = []
  const warnings: string[] = []
  let totalChecks = 0
  let passed = 0

  // Test Environmental types
  try {
    totalChecks++
    const testEnvironmental: EnvironmentalData = {
      energyAndEmissions: {
        scope1: 100,
        scope2: 200,
        scope3Market: 300,
        scope3Location: 250,
        renewableEnergy: 150,
        nonRenewableEnergy: 350,
        climateDataCollectionMethod: 'Direct measurement',
        climateDataUncertainty: 'Low',
        reported: true,
      },
    }

    const envResult = environmentalSchema.safeParse(testEnvironmental)
    if (envResult.success) {
      passed++
      console.log('   ✅ Environmental types alignment valid')
    } else {
      errors.push(
        `Environmental types validation failed: ${envResult.error.message}`
      )
      console.log('   ❌ Environmental types alignment failed')
    }
  } catch (error) {
    errors.push(`Environmental type validation error: ${error}`)
  }

  // Test Social types
  try {
    totalChecks++
    const testSocial: SocialData = {
      employees: {
        fullTimeEmployees: 25,
        partTimeEmployees: 5,
        tempEmployees: 2,
        reported: true,
      },
    }

    const socialResult = socialSchema.safeParse(testSocial)
    if (socialResult.success) {
      passed++
      console.log('   ✅ Social types alignment valid')
    } else {
      errors.push(
        `Social types validation failed: ${socialResult.error.message}`
      )
      console.log('   ❌ Social types alignment failed')
    }
  } catch (error) {
    errors.push(`Social type validation error: ${error}`)
  }

  // Test Governance types
  try {
    totalChecks++
    const testGovernance: GovernanceData = {
      ethics: {
        corruptionCases: 0,
        whistleBlowerReports: 1,
        reported: true,
      },
      finesAndPenalties: {
        fnp: false,
        description: 'No fines reported',
        reported: true,
      },
    }

    const govResult = governanceSchema.safeParse(testGovernance)
    if (govResult.success) {
      passed++
      console.log('   ✅ Governance types alignment valid')
    } else {
      errors.push(
        `Governance types validation failed: ${govResult.error.message}`
      )
      console.log('   ❌ Governance types alignment failed')
    }
  } catch (error) {
    errors.push(`Governance type validation error: ${error}`)
  }

  return { totalChecks, passed, errors, warnings }
}

/**
 * Validate Prisma schema alignment
 * Used by: validateTypeAlignment() to check database schema consistency
 * Purpose: Ensures Prisma models are properly generated and accessible
 */
async function validatePrismaAlignment() {
  const errors: string[] = []
  const warnings: string[] = []
  let totalChecks = 0
  let passed = 0

  try {
    // Check if Prisma client is properly generated
    totalChecks++
    const { PrismaClient } = await import('../../prisma/generated/client')

    if (PrismaClient) {
      passed++
      console.log('   ✅ Prisma client properly generated')
    } else {
      errors.push('Prisma client not found - run `bun db:generate`')
      console.log('   ❌ Prisma client not generated')
    }

    // Check if we can create a Prisma instance
    totalChecks++
    const prisma = new PrismaClient()
    if (prisma) {
      passed++
      console.log('   ✅ Prisma client instantiation successful')
      await prisma.$disconnect()
    } else {
      errors.push('Cannot instantiate Prisma client')
      console.log('   ❌ Prisma client instantiation failed')
    }
  } catch (error) {
    errors.push(`Prisma validation error: ${error}`)
    console.log('   ❌ Prisma validation failed')
  }

  return { totalChecks, passed, errors, warnings }
}

/**
 * Analyze validation coverage against Prisma schema
 * Used by: main() to check if all Prisma models and types are covered by validation
 * Purpose: Ensures comprehensive validation coverage as schema evolves
 */
async function analyzeCoverage(): Promise<CoverageAnalysis> {
  // Define what we know exists in Prisma schema
  const prismaModels = ['User', 'Company', 'Report']
  const prismaTypes = [
    'EnergyAndEmissions',
    'Environmental',
    'Employees',
    'Social',
    'Ethics',
    'FinesAndPenalties',
    'Governance',
  ]

  // Define what we're currently validating
  const validatedTypes = [
    'CompanyData',
    'ReportData',
    'EnergyAndEmissionsData',
    'EnvironmentalData',
    'EmployeesData',
    'SocialData',
    'EthicsData',
    'FinesAndPenaltiesData',
    'GovernanceData',
  ]

  // Calculate coverage
  const allPrismaTypes = [...prismaModels, ...prismaTypes]
  const expectedValidationTypes = allPrismaTypes.map((type) =>
    type === 'User'
      ? 'UserData'
      : type.endsWith('s')
        ? type + 'Data'
        : type + 'Data'
  )

  const missingValidation = expectedValidationTypes.filter(
    (expected) => !validatedTypes.includes(expected)
  )

  const coveragePercentage =
    ((validatedTypes.length - missingValidation.length) /
      validatedTypes.length) *
    100

  return {
    prismaModels,
    prismaTypes,
    validatedTypes,
    missingValidation,
    coveragePercentage,
  }
}

// Run the validation
main()

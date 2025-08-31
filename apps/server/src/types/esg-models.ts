// TypeScript types for ESG data structures
// These complement the Prisma models with additional type safety

export interface EnergyAndEmissionsData {
  scope1?: number
  scope2?: number
  scope3Market?: number
  scope3Location?: number
  renewableEnergy?: number
  nonRenewableEnergy?: number
  climateDataCollectionMethod?: string
  climateDataUncertainty?: string
  reported: boolean
}

export interface EnvironmentalData {
  energyAndEmissions?: EnergyAndEmissionsData
}

export interface EmployeesData {
  fullTimeEmployees?: number
  partTimeEmployees?: number
  tempEmployees?: number
  reported: boolean
}

export interface SocialData {
  employees?: EmployeesData
}

export interface EthicsData {
  corruptionCases?: number
  whistleBlowerReports?: number
  reported: boolean
}

export interface FinesAndPenaltiesData {
  fnp: boolean
  description?: string
  reported: boolean
}

export interface GovernanceData {
  ethics?: EthicsData
  finesAndPenalties?: FinesAndPenaltiesData
}

export interface ESGReportData {
  environmental?: EnvironmentalData
  social?: SocialData
  governance?: GovernanceData
}

export interface CompanyData {
  year: number
  name: string
  organizationId: string
  registrationNumber: string
  revenue?: number
  naceCode?: string
  industry?: string
  industryCo2Intensity?: number
}

export interface ReportData extends ESGReportData {
  organizationId: string
  year: number
  companyId: string
}

// Utility types for partial updates
export type PartialCompanyData = Partial<CompanyData>
export type PartialReportData = Partial<ReportData>
export type PartialESGData = Partial<ESGReportData>

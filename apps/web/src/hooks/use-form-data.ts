import { useState, useEffect } from 'react'

// Types for API responses
interface SubsidiaryData {
  name: string
  organizationNumber: string
  address: string
}

interface CompanyFinancialData {
  balanceSheetSize?: number
  turnover?: number
  numberOfEmployees?: number
  organizationNumber?: string
}

interface ReportingData {
  lastReportingYear?: number
  previousReportBasis?: 'individual' | 'consolidated'
  previousSubsidiaries?: SubsidiaryData[]
}

interface SustainabilityData {
  certifications?: string
  practicesTemplate?: string
  hasPreviousPractices?: boolean
}

// Custom hook for fetching form data from APIs
export const useFormData = () => {
  const [companyData, setCompanyData] = useState<CompanyFinancialData | null>(null)
  const [reportingData, setReportingData] = useState<ReportingData | null>(null)
  const [sustainabilityData, setSustainabilityData] = useState<SustainabilityData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch company financial data
  const fetchCompanyData = async (orgNumber?: string) => {
    if (!orgNumber) return null

    setLoading(true)
    try {
      const response = await fetch(`/api/company/${orgNumber}/financial-data`)
      if (response.ok) {
        const data = await response.json()
        setCompanyData(data)
        return data
      }
      throw new Error('Failed to fetch company data')
    } catch (err) {
      console.warn('Failed to fetch company data:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
      return null
    } finally {
      setLoading(false)
    }
  }

  // Fetch last reporting year and preferences
  const fetchReportingData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/reports/metadata')
      if (response.ok) {
        const data = await response.json()
        setReportingData(data)
        return data
      }
      throw new Error('Failed to fetch reporting data')
    } catch (err) {
      console.warn('Failed to fetch reporting data:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
      return null
    } finally {
      setLoading(false)
    }
  }

  // Fetch sustainability templates and previous data
  const fetchSustainabilityData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/sustainability/templates')
      if (response.ok) {
        const data = await response.json()
        setSustainabilityData(data)
        return data
      }
      throw new Error('Failed to fetch sustainability data')
    } catch (err) {
      console.warn('Failed to fetch sustainability data:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
      return null
    } finally {
      setLoading(false)
    }
  }

  // Get enriched defaults for a specific step
  const getEnrichedDefaults = (step: number, formData: any = {}) => {
    switch (step) {
      case 0: // company-info step
        return {
          ...formData,
          // Static defaults
          country: formData.country || 'norway',
          legalForm: formData.legalForm || 'as',

          // API data (if available)
          ...(companyData && {
            balanceSheetSize: formData.balanceSheetSize || companyData.balanceSheetSize,
            turnover: formData.turnover || companyData.turnover,
            numberOfEmployees: formData.numberOfEmployees || companyData.numberOfEmployees,
          }),
        }

      case 1: // reporting-setup step
        return {
          ...formData,
          // Static defaults
          reportBasis: formData.reportBasis || 'individual',
          reportingOption: formData.reportingOption || 'basic',

          // API data (if available)
          ...(reportingData && {
            reportingYear: formData.reportingYear || reportingData.lastReportingYear?.toString(),
            reportBasis: formData.reportBasis || reportingData.previousReportBasis || 'individual',
            subsidiaries: formData.subsidiaries || reportingData.previousSubsidiaries || [],
          }),
        }

      case 2: // sustainability step
        return {
          ...formData,
          // Static defaults
          hasPracticesPolicies:
            formData.hasPracticesPolicies !== undefined ? formData.hasPracticesPolicies : false,

          // API data (if available)
          ...(sustainabilityData && {
            sustainabilityCertifications:
              formData.sustainabilityCertifications || sustainabilityData.certifications,
            practicesDescription:
              formData.practicesDescription || sustainabilityData.practicesTemplate,
            hasPracticesPolicies:
              formData.hasPracticesPolicies !== undefined
                ? formData.hasPracticesPolicies
                : sustainabilityData.hasPreviousPractices,
          }),
        }

      default:
        return formData
    }
  }

  return {
    // Data
    companyData,
    reportingData,
    sustainabilityData,
    loading,
    error,

    // Actions
    fetchCompanyData,
    fetchReportingData,
    fetchSustainabilityData,
    getEnrichedDefaults,

    // Utilities
    clearError: () => setError(null),
  }
}

// Example usage in the multi-step form:
/*
const { getEnrichedDefaults, fetchCompanyData } = useFormData();

// In getSchemaDefaults function:
const getSchemaDefaults = (schema: any, existingData: any = {}) => {
  return getEnrichedDefaults(step, existingData);
};

// When organization number changes:
useEffect(() => {
  if (formData.organizationNumber) {
    fetchCompanyData(formData.organizationNumber);
  }
}, [formData.organizationNumber]);
*/

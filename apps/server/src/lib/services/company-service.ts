import type { PrismaClient } from '../../../prisma/generated/client'
import type { CompanyData, PartialCompanyData } from '../../types/esg-models'

export class CompanyService {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  // Create a new company
  async createCompany(data: CompanyData, createdBy: string) {
    try {
      const company = await this.prisma.company.create({
        data: {
          ...data,
          createdBy,
        },
      })
      return { success: true, data: company }
    } catch (error) {
      console.error('Error creating company:', error)
      return { success: false, error: 'Failed to create company' }
    }
  }

  // Get companies by organization
  async getCompaniesByOrganization(organizationId: string) {
    try {
      const companies = await this.prisma.company.findMany({
        where: { organizationId },
        orderBy: { createdAt: 'desc' },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              reports: true,
            },
          },
        },
      })
      return { success: true, data: companies }
    } catch (error) {
      console.error('Error fetching companies:', error)
      return { success: false, error: 'Failed to fetch companies' }
    }
  }

  // Get company by ID
  async getCompanyById(id: string, organizationId: string) {
    try {
      const company = await this.prisma.company.findFirst({
        where: {
          id,
          organizationId,
        },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          reports: {
            orderBy: { year: 'desc' },
          },
        },
      })

      if (!company) {
        return { success: false, error: 'Company not found' }
      }

      return { success: true, data: company }
    } catch (error) {
      console.error('Error fetching company:', error)
      return { success: false, error: 'Failed to fetch company' }
    }
  }

  // Update company
  async updateCompany(
    id: string,
    data: PartialCompanyData,
    organizationId: string
  ) {
    try {
      const company = await this.prisma.company.updateMany({
        where: {
          id,
          organizationId,
        },
        data,
      })

      if (company.count === 0) {
        return { success: false, error: 'Company not found or access denied' }
      }

      // Fetch the updated company
      const updatedCompany = await this.prisma.company.findUnique({
        where: { id },
      })

      return { success: true, data: updatedCompany }
    } catch (error) {
      console.error('Error updating company:', error)
      return { success: false, error: 'Failed to update company' }
    }
  }

  // Delete company
  async deleteCompany(id: string, organizationId: string) {
    try {
      const company = await this.prisma.company.deleteMany({
        where: {
          id,
          organizationId,
        },
      })

      if (company.count === 0) {
        return { success: false, error: 'Company not found or access denied' }
      }

      return { success: true, message: 'Company deleted successfully' }
    } catch (error) {
      console.error('Error deleting company:', error)
      return { success: false, error: 'Failed to delete company' }
    }
  }

  // Get companies by year
  async getCompaniesByYear(organizationId: string, year: number) {
    try {
      const companies = await this.prisma.company.findMany({
        where: {
          organizationId,
          year,
        },
        orderBy: { name: 'asc' },
      })
      return { success: true, data: companies }
    } catch (error) {
      console.error('Error fetching companies by year:', error)
      return { success: false, error: 'Failed to fetch companies' }
    }
  }
}

import type { PrismaClient } from '../../../prisma/generated/client'
import type {
  ESGReportData,
  PartialReportData,
  ReportData,
} from '../../types/esg-models'

export class ReportService {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  // Create a new report
  async createReport(data: ReportData, createdBy: string) {
    try {
      // Verify the company exists and belongs to the organization
      const company = await this.prisma.company.findFirst({
        where: {
          id: data.companyId,
          organizationId: data.organizationId,
        },
      })

      if (!company) {
        return { success: false, error: 'Company not found or access denied' }
      }

      const report = await this.prisma.report.create({
        data: {
          ...data,
          createdBy,
        },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              year: true,
            },
          },
        },
      })
      return { success: true, data: report }
    } catch (error) {
      console.error('Error creating report:', error)
      return { success: false, error: 'Failed to create report' }
    }
  }

  // Get reports by organization
  async getReportsByOrganization(organizationId: string) {
    try {
      const reports = await this.prisma.report.findMany({
        where: { organizationId },
        orderBy: { createdAt: 'desc' },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              year: true,
              registrationNumber: true,
            },
          },
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })
      return { success: true, data: reports }
    } catch (error) {
      console.error('Error fetching reports:', error)
      return { success: false, error: 'Failed to fetch reports' }
    }
  }

  // Get report by ID
  async getReportById(id: string, organizationId: string) {
    try {
      const report = await this.prisma.report.findFirst({
        where: {
          id,
          organizationId,
        },
        include: {
          company: true,
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })

      if (!report) {
        return { success: false, error: 'Report not found' }
      }

      return { success: true, data: report }
    } catch (error) {
      console.error('Error fetching report:', error)
      return { success: false, error: 'Failed to fetch report' }
    }
  }

  // Update report
  async updateReport(
    id: string,
    data: PartialReportData,
    organizationId: string
  ) {
    try {
      const report = await this.prisma.report.updateMany({
        where: {
          id,
          organizationId,
        },
        data,
      })

      if (report.count === 0) {
        return { success: false, error: 'Report not found or access denied' }
      }

      // Fetch the updated report
      const updatedReport = await this.prisma.report.findUnique({
        where: { id },
        include: {
          company: true,
        },
      })

      return { success: true, data: updatedReport }
    } catch (error) {
      console.error('Error updating report:', error)
      return { success: false, error: 'Failed to update report' }
    }
  }

  // Update specific ESG section
  async updateESGSection(
    id: string,
    section: 'environmental' | 'social' | 'governance',
    data: any,
    organizationId: string
  ) {
    try {
      const updateData = { [section]: data }

      const report = await this.prisma.report.updateMany({
        where: {
          id,
          organizationId,
        },
        data: updateData,
      })

      if (report.count === 0) {
        return { success: false, error: 'Report not found or access denied' }
      }

      // Fetch the updated report
      const updatedReport = await this.prisma.report.findUnique({
        where: { id },
      })

      return { success: true, data: updatedReport }
    } catch (error) {
      console.error('Error updating ESG section:', error)
      return { success: false, error: 'Failed to update ESG section' }
    }
  }

  // Delete report
  async deleteReport(id: string, organizationId: string) {
    try {
      const report = await this.prisma.report.deleteMany({
        where: {
          id,
          organizationId,
        },
      })

      if (report.count === 0) {
        return { success: false, error: 'Report not found or access denied' }
      }

      return { success: true, message: 'Report deleted successfully' }
    } catch (error) {
      console.error('Error deleting report:', error)
      return { success: false, error: 'Failed to delete report' }
    }
  }

  // Get reports by company
  async getReportsByCompany(companyId: string, organizationId: string) {
    try {
      const reports = await this.prisma.report.findMany({
        where: {
          companyId,
          organizationId,
        },
        orderBy: { year: 'desc' },
      })
      return { success: true, data: reports }
    } catch (error) {
      console.error('Error fetching reports by company:', error)
      return { success: false, error: 'Failed to fetch reports' }
    }
  }

  // Get reports by year
  async getReportsByYear(organizationId: string, year: number) {
    try {
      const reports = await this.prisma.report.findMany({
        where: {
          organizationId,
          year,
        },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              registrationNumber: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      })
      return { success: true, data: reports }
    } catch (error) {
      console.error('Error fetching reports by year:', error)
      return { success: false, error: 'Failed to fetch reports' }
    }
  }
}

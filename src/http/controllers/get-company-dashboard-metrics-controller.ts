import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { handleControllerError } from './helpers/handle-controller-error'

const getCompanyDashboardMetricsParamsSchema = z.object({
  companyId: z.string().uuid(),
})

const DAY_IN_MS = 24 * 60 * 60 * 1000

function daysAgo(days: number): Date {
  return new Date(Date.now() - days * DAY_IN_MS)
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, 1)
}

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function toPercentDelta(current: number, previous: number): number {
  if (previous === 0) {
    return current === 0 ? 0 : 100
  }

  return ((current - previous) / previous) * 100
}

export async function getCompanyDashboardMetricsController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { companyId } = getCompanyDashboardMetricsParamsSchema.parse(
    request.params,
  )

  try {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: {
        id: true,
        trade_name: true,
        business_units: {
          select: { id: true, name: true },
        },
      },
    })

    if (!company) {
      reply.status(404).send({ message: 'Recurso nao encontrado' })
      return
    }

    const now = new Date()
    const currentPeriodStart = daysAgo(30)
    const previousPeriodStart = daysAgo(60)

    const [
      currentInvoices,
      previousInvoices,
      monthlyInvoices,
      recentInvoices,
      activeStudents,
      previousStudents,
      topItemsCurrent,
      topItemsPrevious,
    ] = await Promise.all([
      prisma.invoice.findMany({
        where: {
          business_unit: { company_id: companyId },
          status: 'COMPLETED',
          issue_date: { gte: currentPeriodStart },
        },
        select: { total_amount: true, business_unit_id: true },
      }),
      prisma.invoice.findMany({
        where: {
          business_unit: { company_id: companyId },
          status: 'COMPLETED',
          issue_date: {
            gte: previousPeriodStart,
            lt: currentPeriodStart,
          },
        },
        select: { total_amount: true },
      }),
      prisma.invoice.findMany({
        where: {
          business_unit: { company_id: companyId },
          status: 'COMPLETED',
          issue_date: { gte: addMonths(startOfMonth(now), -5) },
        },
        select: { issue_date: true, total_amount: true },
      }),
      prisma.invoice.findMany({
        where: {
          business_unit: { company_id: companyId },
          status: { not: 'CANCELLED' },
          issue_date: { gte: daysAgo(7) },
        },
        select: { business_unit_id: true },
      }),
      prisma.student.count({
        where: {
          business_unit: { company_id: companyId },
        },
      }),
      prisma.student.count({
        where: {
          business_unit: { company_id: companyId },
          created_at: { lt: currentPeriodStart },
        },
      }),
      prisma.invoiceItem.findMany({
        where: {
          invoice: {
            business_unit: { company_id: companyId },
            status: 'COMPLETED',
            issue_date: { gte: currentPeriodStart },
          },
        },
        select: {
          subtotal: true,
          product: { select: { name: true } },
        },
      }),
      prisma.invoiceItem.findMany({
        where: {
          invoice: {
            business_unit: { company_id: companyId },
            status: 'COMPLETED',
            issue_date: {
              gte: previousPeriodStart,
              lt: currentPeriodStart,
            },
          },
        },
        select: {
          subtotal: true,
          product: { select: { name: true } },
        },
      }),
    ])

    const currentRevenue = currentInvoices.reduce(
      (sum, invoice) => sum + Number(invoice.total_amount),
      0,
    )
    const previousRevenue = previousInvoices.reduce(
      (sum, invoice) => sum + Number(invoice.total_amount),
      0,
    )

    const currentSalesCount = currentInvoices.length
    const previousSalesCount = previousInvoices.length

    const currentAverageTicket =
      currentSalesCount > 0 ? currentRevenue / currentSalesCount : 0
    const previousAverageTicket =
      previousSalesCount > 0 ? previousRevenue / previousSalesCount : 0

    const currentStudentsInWindow = activeStudents - previousStudents

    const monthlyMap = new Map<string, number>()
    for (const invoice of monthlyInvoices) {
      const key = monthKey(invoice.issue_date)
      const currentValue = monthlyMap.get(key) ?? 0
      monthlyMap.set(key, currentValue + Number(invoice.total_amount))
    }

    const revenueLabels: string[] = []
    const revenueValues: number[] = []
    const targetValues: number[] = []

    for (let index = 0; index < 6; index += 1) {
      const monthDate = addMonths(startOfMonth(now), index - 5)
      const key = monthKey(monthDate)
      const revenue = monthlyMap.get(key) ?? 0
      const previousTargetBase =
        index === 0 ? revenue : revenueValues[index - 1]
      const target = previousTargetBase * 1.05

      revenueLabels.push(
        monthDate.toLocaleDateString('pt-PT', {
          month: 'short',
        }),
      )
      revenueValues.push(Number(revenue.toFixed(2)))
      targetValues.push(Number(target.toFixed(2)))
    }

    const salesByUnitMap = new Map<string, number>()
    const revenueByUnitMap = new Map<string, number>()

    for (const invoice of currentInvoices) {
      salesByUnitMap.set(
        invoice.business_unit_id,
        (salesByUnitMap.get(invoice.business_unit_id) ?? 0) + 1,
      )
      revenueByUnitMap.set(
        invoice.business_unit_id,
        (revenueByUnitMap.get(invoice.business_unit_id) ?? 0) +
          Number(invoice.total_amount),
      )
    }

    const recentSalesByUnitMap = new Map<string, number>()
    for (const invoice of recentInvoices) {
      recentSalesByUnitMap.set(
        invoice.business_unit_id,
        (recentSalesByUnitMap.get(invoice.business_unit_id) ?? 0) + 1,
      )
    }

    const orderedUnitEntries = [...company.business_units].sort((a, b) =>
      a.name.localeCompare(b.name),
    )

    const orderLabels = orderedUnitEntries.map((unit) => unit.name)
    const orderValues = orderedUnitEntries.map(
      (unit) => recentSalesByUnitMap.get(unit.id) ?? 0,
    )

    const channelLabels = orderedUnitEntries.map((unit) => unit.name)
    const channelValues = orderedUnitEntries.map((unit) =>
      Number((revenueByUnitMap.get(unit.id) ?? 0).toFixed(2)),
    )

    const topCurrentMap = new Map<string, number>()
    for (const row of topItemsCurrent) {
      const productName = row.product.name
      topCurrentMap.set(
        productName,
        (topCurrentMap.get(productName) ?? 0) + Number(row.subtotal),
      )
    }

    const topPreviousMap = new Map<string, number>()
    for (const row of topItemsPrevious) {
      const productName = row.product.name
      topPreviousMap.set(
        productName,
        (topPreviousMap.get(productName) ?? 0) + Number(row.subtotal),
      )
    }

    const topItems = [...topCurrentMap.entries()]
      .sort((left, right) => right[1] - left[1])
      .slice(0, 4)
      .map(([name, value]) => {
        const previousValue = topPreviousMap.get(name) ?? 0
        return {
          name,
          value: Number(value.toFixed(2)),
          trend: Number(toPercentDelta(value, previousValue).toFixed(2)),
        }
      })

    reply.send({
      dashboard: {
        businessUnitName: company.trade_name,
        kpis: {
          totalRevenue30d: Number(currentRevenue.toFixed(2)),
          totalRevenueDelta: Number(
            toPercentDelta(currentRevenue, previousRevenue).toFixed(2),
          ),
          totalSales30d: currentSalesCount,
          totalSalesDelta: Number(
            toPercentDelta(currentSalesCount, previousSalesCount).toFixed(2),
          ),
          activeStudents,
          activeStudentsDelta: Number(
            toPercentDelta(currentStudentsInWindow, previousStudents).toFixed(
              2,
            ),
          ),
          averageTicket30d: Number(currentAverageTicket.toFixed(2)),
          averageTicketDelta: Number(
            toPercentDelta(currentAverageTicket, previousAverageTicket).toFixed(
              2,
            ),
          ),
        },
        revenueSeries: {
          labels: revenueLabels,
          revenue: revenueValues,
          target: targetValues,
        },
        ordersSeries: {
          labels: orderLabels,
          values: orderValues,
        },
        channelDistribution: {
          labels: channelLabels,
          values: channelValues,
        },
        topItems,
        updatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return
    }

    throw error
  }
}

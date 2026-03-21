import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { PaymentMethod } from "generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { handleControllerError } from "@/http/controllers/handle-controller-error";

const getDashboardMetricsParamsSchema = z.object({
  businessUnitId: z.string().uuid(),
});

const DAY_IN_MS = 24 * 60 * 60 * 1000;

function daysAgo(days: number): Date {
  return new Date(Date.now() - days * DAY_IN_MS);
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function toPercentDelta(current: number, previous: number): number {
  if (previous === 0) {
    return current === 0 ? 0 : 100;
  }

  return ((current - previous) / previous) * 100;
}

function paymentMethodLabel(method: PaymentMethod): string {
  const labels: Record<PaymentMethod, string> = {
    CASH: "Dinheiro",
    CARD: "Cartao",
    EXPRESS: "Multicaixa",
    BANK_TRANSFER: "Transferencia",
  };

  return labels[method];
}

export async function getDashboardMetricsController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { businessUnitId } = getDashboardMetricsParamsSchema.parse(request.params);

  try {
    const businessUnit = await prisma.businessUnit.findUnique({
      where: { id: businessUnitId },
      select: { id: true, name: true },
    });

    if (!businessUnit) {
      reply.status(404).send({ message: "Recurso nao encontrado" });
      return;
    }

    const now = new Date();
    const currentPeriodStart = daysAgo(30);
    const previousPeriodStart = daysAgo(60);

    const [
      currentInvoices,
      previousInvoices,
      monthlyInvoices,
      recentInvoices,
      paymentRows,
      activeStudents,
      previousStudents,
      topItemsCurrent,
      topItemsPrevious,
    ] = await Promise.all([
      prisma.invoice.findMany({
        where: {
          business_unit_id: businessUnitId,
          status: "COMPLETED",
          issue_date: { gte: currentPeriodStart },
        },
        select: { total_amount: true },
      }),
      prisma.invoice.findMany({
        where: {
          business_unit_id: businessUnitId,
          status: "COMPLETED",
          issue_date: {
            gte: previousPeriodStart,
            lt: currentPeriodStart,
          },
        },
        select: { total_amount: true },
      }),
      prisma.invoice.findMany({
        where: {
          business_unit_id: businessUnitId,
          status: "COMPLETED",
          issue_date: { gte: addMonths(startOfMonth(now), -5) },
        },
        select: { issue_date: true, total_amount: true },
      }),
      prisma.invoice.findMany({
        where: {
          business_unit_id: businessUnitId,
          status: { not: "CANCELLED" },
          issue_date: { gte: daysAgo(7) },
        },
        select: { issue_date: true },
      }),
      prisma.payment.findMany({
        where: {
          invoice: {
            business_unit_id: businessUnitId,
            status: "COMPLETED",
            issue_date: { gte: currentPeriodStart },
          },
        },
        select: { method: true, amount: true },
      }),
      prisma.student.count({
        where: {
          business_unit_id: businessUnitId,
        },
      }),
      prisma.student.count({
        where: {
          business_unit_id: businessUnitId,
          created_at: { lt: currentPeriodStart },
        },
      }),
      prisma.invoiceItem.findMany({
        where: {
          invoice: {
            business_unit_id: businessUnitId,
            status: "COMPLETED",
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
            business_unit_id: businessUnitId,
            status: "COMPLETED",
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
    ]);

    const currentRevenue = currentInvoices.reduce(
      (sum, invoice) => sum + Number(invoice.total_amount),
      0,
    );
    const previousRevenue = previousInvoices.reduce(
      (sum, invoice) => sum + Number(invoice.total_amount),
      0,
    );

    const currentSalesCount = currentInvoices.length;
    const previousSalesCount = previousInvoices.length;

    const currentAverageTicket =
      currentSalesCount > 0 ? currentRevenue / currentSalesCount : 0;
    const previousAverageTicket =
      previousSalesCount > 0 ? previousRevenue / previousSalesCount : 0;

    const currentStudentsInWindow = activeStudents - previousStudents;

    const monthlyMap = new Map<string, number>();
    for (const invoice of monthlyInvoices) {
      const key = monthKey(invoice.issue_date);
      const currentValue = monthlyMap.get(key) ?? 0;
      monthlyMap.set(key, currentValue + Number(invoice.total_amount));
    }

    const revenueLabels: string[] = [];
    const revenueValues: number[] = [];
    const targetValues: number[] = [];

    for (let index = 0; index < 6; index += 1) {
      const monthDate = addMonths(startOfMonth(now), index - 5);
      const key = monthKey(monthDate);
      const revenue = monthlyMap.get(key) ?? 0;
      const previousTargetBase = index === 0 ? revenue : revenueValues[index - 1];
      const target = previousTargetBase * 1.05;

      revenueLabels.push(
        monthDate.toLocaleDateString("pt-PT", {
          month: "short",
        }),
      );
      revenueValues.push(Number(revenue.toFixed(2)));
      targetValues.push(Number(target.toFixed(2)));
    }

    const orderMap = new Map<string, number>();
    for (let index = 0; index < 7; index += 1) {
      const date = daysAgo(6 - index);
      const key = date.toISOString().slice(0, 10);
      orderMap.set(key, 0);
    }

    for (const invoice of recentInvoices) {
      const key = invoice.issue_date.toISOString().slice(0, 10);
      if (orderMap.has(key)) {
        orderMap.set(key, (orderMap.get(key) ?? 0) + 1);
      }
    }

    const orderLabels = [...orderMap.keys()].map((dateKey) => {
      const [year, month, day] = dateKey.split("-");
      return `${day}/${month}`;
    });
    const orderValues = [...orderMap.values()];

    const paymentMap = new Map<PaymentMethod, number>();
    for (const row of paymentRows) {
      paymentMap.set(
        row.method,
        (paymentMap.get(row.method) ?? 0) + Number(row.amount),
      );
    }

    const sortedPaymentEntries = [...paymentMap.entries()].sort(
      (left, right) => right[1] - left[1],
    );

    const channelLabels = sortedPaymentEntries.map(([method]) =>
      paymentMethodLabel(method),
    );
    const channelValues = sortedPaymentEntries.map(([, amount]) =>
      Number(amount.toFixed(2)),
    );

    const topCurrentMap = new Map<string, number>();
    for (const row of topItemsCurrent) {
      const productName = row.product.name;
      topCurrentMap.set(
        productName,
        (topCurrentMap.get(productName) ?? 0) + Number(row.subtotal),
      );
    }

    const topPreviousMap = new Map<string, number>();
    for (const row of topItemsPrevious) {
      const productName = row.product.name;
      topPreviousMap.set(
        productName,
        (topPreviousMap.get(productName) ?? 0) + Number(row.subtotal),
      );
    }

    const topItems = [...topCurrentMap.entries()]
      .sort((left, right) => right[1] - left[1])
      .slice(0, 4)
      .map(([name, value]) => {
        const previousValue = topPreviousMap.get(name) ?? 0;
        return {
          name,
          value: Number(value.toFixed(2)),
          trend: Number(toPercentDelta(value, previousValue).toFixed(2)),
        };
      });

    reply.send({
      dashboard: {
        businessUnitName: businessUnit.name,
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
            toPercentDelta(currentStudentsInWindow, previousStudents).toFixed(2),
          ),
          averageTicket30d: Number(currentAverageTicket.toFixed(2)),
          averageTicketDelta: Number(
            toPercentDelta(currentAverageTicket, previousAverageTicket).toFixed(2),
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
    });
  } catch (error) {
    if (handleControllerError(reply, error)) {
      return;
    }

    throw error;
  }
}

import { prisma } from "@/lib/prisma";

interface UpdateOverdueFinancialPlansResponse {
  updatedCount: number;
}

export class UpdateOverdueFinancialPlansUseCase {
  async execute(): Promise<UpdateOverdueFinancialPlansResponse> {
    // Get current date and time
    const now = new Date();

    // Get grace limit for tuition fees (10th of current month)
    const graceLimitForTuition = new Date(
      now.getFullYear(),
      now.getMonth(),
      10,
      23,
      59,
      59,
      999,
    );

    // Find all PENDING tuition fee plans that are overdue
    const overdueTuitionPlans = await prisma.financialPlan.findMany({
      where: {
        status: "PENDING",
        name: "TUITION_FEE",
        due_date: {
          lt: graceLimitForTuition,
        },
      },
      select: {
        id: true,
      },
    });

    // Find all PENDING enrollment/confirmation fee plans that are overdue
    const overdueFeePlans = await prisma.financialPlan.findMany({
      where: {
        status: "PENDING",
        name: {
          in: ["ENROLLMENT_FEE", "CONFIRMATION_FEE"],
        },
        due_date: {
          lt: now,
        },
      },
      select: {
        id: true,
      },
    });

    const allOverduePlanIds = [
      ...overdueTuitionPlans.map((p) => p.id),
      ...overdueFeePlans.map((p) => p.id),
    ];

    let updatedCount = 0;

    if (allOverduePlanIds.length > 0) {
      const result = await prisma.financialPlan.updateMany({
        where: {
          id: {
            in: allOverduePlanIds,
          },
        },
        data: {
          status: "OVERDUE",
        },
      });

      updatedCount = result.count;

      console.log(
        `[FinancialPlans Cron] Updated ${updatedCount} financial plans to OVERDUE status`,
      );
    } else {
      console.log("No overdue financial plans found to update");
    }

    return { updatedCount };
  }
}

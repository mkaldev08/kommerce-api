import { makeUpdateOverdueFinancialPlansUseCase } from "@/use-cases/factory/make-update-overdue-financial-plans-use-case";

const DAILY_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours
const INITIAL_DELAY_MS = 1 * 60 * 1000; // Run after 1 minute of server startup

export function initializeFinancialPlansCronJob(): void {
  // Schedule the first run after a delay
  setTimeout(() => {
    executeUpdateOverdueFinancialPlans();

    // Then schedule recurring executions
    setInterval(executeUpdateOverdueFinancialPlans, DAILY_INTERVAL_MS);
  }, INITIAL_DELAY_MS);

  console.log(
    "[FinancialPlans Cron] Scheduled daily check for overdue financial plans",
  );
}

async function executeUpdateOverdueFinancialPlans(): Promise<void> {
  try {
    const useCase = makeUpdateOverdueFinancialPlansUseCase();
    const result = await useCase.execute();

    console.log(
      `[FinancialPlans Cron] Execution completed. Updated ${result.updatedCount} plans.`,
    );
  } catch (error) {
    console.error(
      "[FinancialPlans Cron] Error executing financial plans check:",
      error,
    );
  }
}

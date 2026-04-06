import type { GamingExpense } from "generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type {
    CreateGamingExpenseInput,
    GamingExpenseData,
    GamingExpensesRepository,
} from "../gaming-expenses-repository";

export class PrismaGamingExpensesRepository implements GamingExpensesRepository {
  async create(data: CreateGamingExpenseInput): Promise<GamingExpenseData> {
    const expense = await prisma.gamingExpense.create({
      data: {
        business_unit_id: data.businessUnitId,
        description: data.description,
        category: data.category || null,
        amount: data.amount,
        expense_date: data.expenseDate || new Date(),
        notes: data.notes || null,
      },
    });

    return this.toExpenseData(expense);
  }

  async findManyByBusinessUnitId(
    businessUnitId: string,
  ): Promise<GamingExpenseData[]> {
    const expenses = await prisma.gamingExpense.findMany({
      where: { business_unit_id: businessUnitId },
      orderBy: { expense_date: "desc" },
    });

    return expenses.map((expense) => this.toExpenseData(expense));
  }

  private toExpenseData(expense: GamingExpense): GamingExpenseData {
    return {
      id: expense.id,
      businessUnitId: expense.business_unit_id,
      description: expense.description,
      category: expense.category,
      amount: Number(expense.amount),
      expenseDate: expense.expense_date,
      notes: expense.notes,
      createdAt: expense.created_at,
      updatedAt: expense.updated_at,
    };
  }
}

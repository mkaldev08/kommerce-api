export interface GamingExpenseData {
  id: string;
  businessUnitId: string;
  description: string;
  category?: string | null;
  amount: number;
  expenseDate: Date;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGamingExpenseInput {
  businessUnitId: string;
  description: string;
  category?: string | null;
  amount: number;
  expenseDate?: Date;
  notes?: string | null;
}

export interface GamingExpensesRepository {
  create(data: CreateGamingExpenseInput): Promise<GamingExpenseData>;
  findManyByBusinessUnitId(businessUnitId: string): Promise<GamingExpenseData[]>;
}

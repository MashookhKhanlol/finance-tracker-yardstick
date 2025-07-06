export interface Transaction {
  id: string;
  amount: number;
  date: string;
  description: string;
  type: 'income' | 'expense';
  category: string;
}

export interface MonthlyData {
  month: string;
  expenses: number;
  income: number;
}

export interface CategoryData {
  name: string;
  value: number;
  color: string;
}

export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Other'
] as const;

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Business',
  'Investment',
  'Gift',
  'Other'
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];
export type IncomeCategory = typeof INCOME_CATEGORIES[number];

export interface Budget {
  id: string;
  category: string;
  amount: number;
  month: string; // YYYY-MM format
}

export interface BudgetComparison {
  category: string;
  budgeted: number;
  actual: number;
  remaining: number;
  percentage: number;
}

export interface SpendingInsight {
  type: 'warning' | 'info' | 'success';
  title: string;
  description: string;
  category?: string;
  amount?: number;
}

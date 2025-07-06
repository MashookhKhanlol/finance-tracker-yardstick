
import { Transaction, MonthlyData, CategoryData, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/types/Transaction';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Math.abs(amount));
};

export const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

export const getMonthlyData = (transactions: Transaction[]): MonthlyData[] => {
  const monthlyMap = new Map<string, { expenses: number; income: number }>();

  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    if (!monthlyMap.has(monthKey)) {
      monthlyMap.set(monthKey, { expenses: 0, income: 0 });
    }

    const monthData = monthlyMap.get(monthKey)!;
    if (transaction.type === 'expense') {
      monthData.expenses += transaction.amount;
    } else {
      monthData.income += transaction.amount;
    }
  });

  return Array.from(monthlyMap.entries())
    .map(([key, data]) => {
      const [year, month] = key.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return {
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        ...data,
      };
    })
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
    .slice(-6); // Last 6 months
};

export const calculateTotalBalance = (transactions: Transaction[]): number => {
  return transactions.reduce((total, transaction) => {
    return transaction.type === 'income' 
      ? total + transaction.amount 
      : total - transaction.amount;
  }, 0);
};

export const getCategoryData = (transactions: Transaction[]): CategoryData[] => {
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  const categoryTotals = new Map<string, number>();

  expenseTransactions.forEach(transaction => {
    const current = categoryTotals.get(transaction.category) || 0;
    categoryTotals.set(transaction.category, current + transaction.amount);
  });

  const colors = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00',
    '#ff00ff', '#00ffff', '#ffff00', '#ff0080'
  ];

  return Array.from(categoryTotals.entries())
    .map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length]
    }))
    .sort((a, b) => b.value - a.value);
};

export const getTopExpenseCategories = (transactions: Transaction[], limit: number = 3): CategoryData[] => {
  return getCategoryData(transactions).slice(0, limit);
};

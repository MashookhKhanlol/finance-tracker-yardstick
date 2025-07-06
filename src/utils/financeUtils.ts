import { Transaction, MonthlyData, CategoryData, EXPENSE_CATEGORIES, INCOME_CATEGORIES, Budget, BudgetComparison, SpendingInsight } from '@/types/Transaction';

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

export const getBudgetComparison = (transactions: Transaction[], budgets: Budget[], month: string): BudgetComparison[] => {
  const monthBudgets = budgets.filter(b => b.month === month);
  const monthTransactions = transactions.filter(t => {
    const transactionMonth = new Date(t.date).toISOString().slice(0, 7);
    return transactionMonth === month && t.type === 'expense';
  });

  return monthBudgets.map(budget => {
    const categoryExpenses = monthTransactions
      .filter(t => t.category === budget.category)
      .reduce((sum, t) => sum + t.amount, 0);

    const remaining = budget.amount - categoryExpenses;
    const percentage = budget.amount > 0 ? (categoryExpenses / budget.amount) * 100 : 0;

    return {
      category: budget.category,
      budgeted: budget.amount,
      actual: categoryExpenses,
      remaining,
      percentage,
    };
  });
};

export const generateSpendingInsights = (
  transactions: Transaction[], 
  budgets: Budget[], 
  currentMonth: string
): SpendingInsight[] => {
  const insights: SpendingInsight[] = [];
  const budgetComparison = getBudgetComparison(transactions, budgets, currentMonth);
  
  // Budget overspend warnings
  budgetComparison.forEach(budget => {
    if (budget.percentage > 100) {
      insights.push({
        type: 'warning',
        title: 'Budget Exceeded',
        description: `You've spent ${budget.percentage.toFixed(0)}% of your ${budget.category} budget this month.`,
        category: budget.category,
        amount: budget.actual - budget.budgeted,
      });
    } else if (budget.percentage > 80) {
      insights.push({
        type: 'warning',
        title: 'Budget Alert',
        description: `You're close to reaching your ${budget.category} budget limit (${budget.percentage.toFixed(0)}%).`,
        category: budget.category,
        amount: budget.remaining,
      });
    }
  });

  // Success insights for staying under budget
  budgetComparison.forEach(budget => {
    if (budget.percentage < 50 && budget.actual > 0) {
      insights.push({
        type: 'success',
        title: 'Great Savings!',
        description: `You're doing well with your ${budget.category} budget, using only ${budget.percentage.toFixed(0)}%.`,
        category: budget.category,
        amount: budget.remaining,
      });
    }
  });

  // Top spending category insight
  const currentMonthExpenses = transactions.filter(t => {
    const transactionMonth = new Date(t.date).toISOString().slice(0, 7);
    return transactionMonth === currentMonth && t.type === 'expense';
  });

  if (currentMonthExpenses.length > 0) {
    const categoryTotals = new Map<string, number>();
    currentMonthExpenses.forEach(t => {
      categoryTotals.set(t.category, (categoryTotals.get(t.category) || 0) + t.amount);
    });

    const topCategory = Array.from(categoryTotals.entries())
      .sort((a, b) => b[1] - a[1])[0];

    if (topCategory) {
      insights.push({
        type: 'info',
        title: 'Top Spending Category',
        description: `Your highest spending this month is in ${topCategory[0]}.`,
        category: topCategory[0],
        amount: topCategory[1],
      });
    }
  }

  // Income vs expenses insight
  const monthlyBalance = calculateTotalBalance(
    transactions.filter(t => new Date(t.date).toISOString().slice(0, 7) === currentMonth)
  );

  if (monthlyBalance < 0) {
    insights.push({
      type: 'warning',
      title: 'Monthly Deficit',
      description: `Your expenses exceeded income this month by $${Math.abs(monthlyBalance).toFixed(2)}.`,
      amount: Math.abs(monthlyBalance),
    });
  } else if (monthlyBalance > 0) {
    insights.push({
      type: 'success',
      title: 'Monthly Surplus',
      description: `Great job! You saved $${monthlyBalance.toFixed(2)} this month.`,
      amount: monthlyBalance,
    });
  }

  return insights.slice(0, 6); // Limit to 6 insights
};

export const getCurrentMonth = (): string => {
  return new Date().toISOString().slice(0, 7); // YYYY-MM format
};

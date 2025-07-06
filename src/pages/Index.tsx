import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import MonthlyChart from '@/components/MonthlyChart';
import CategoryChart from '@/components/CategoryChart';
import BudgetForm from '@/components/BudgetForm';
import BudgetComparisonChart from '@/components/BudgetComparisonChart';
import SpendingInsights from '@/components/SpendingInsights';
import { Transaction, Budget } from '@/types/Transaction';
import { 
  getMonthlyData, 
  calculateTotalBalance, 
  formatCurrency, 
  getCategoryData, 
  getTopExpenseCategories,
  getBudgetComparison,
  generateSpendingInsights,
  getCurrentMonth
} from '@/utils/financeUtils';
import { useToast } from '@/hooks/use-toast';
import { TrendingUp, TrendingDown, Wallet, PieChart } from 'lucide-react';

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const { toast } = useToast();
  const currentMonth = getCurrentMonth();

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem('finance-transactions');
    const savedBudgets = localStorage.getItem('finance-budgets');
    
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets));
    }
  }, []);

  // Save data to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('finance-transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('finance-budgets', JSON.stringify(budgets));
  }, [budgets]);

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions(prev => [...prev, transaction]);
    toast({
      title: "Transaction Added",
      description: `${transaction.type === 'income' ? 'Income' : 'Expense'} of ${formatCurrency(transaction.amount)} has been added.`,
    });
  };

  const handleUpdateTransaction = (updatedTransaction: Transaction) => {
    setTransactions(prev => 
      prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t)
    );
    setEditingTransaction(null);
    toast({
      title: "Transaction Updated",
      description: "Transaction has been successfully updated.",
    });
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleDeleteTransaction = (id: string) => {
    const transactionToDelete = transactions.find(t => t.id === id);
    setTransactions(prev => prev.filter(t => t.id !== id));
    
    if (transactionToDelete) {
      toast({
        title: "Transaction Deleted",
        description: `${transactionToDelete.description} has been removed.`,
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  const monthlyData = getMonthlyData(transactions);
  const totalBalance = calculateTotalBalance(transactions);
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const categoryData = getCategoryData(transactions);
  const topCategories = getTopExpenseCategories(transactions, 3);
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const handleAddBudget = (budget: Budget) => {
    setBudgets(prev => [...prev, budget]);
    toast({
      title: "Budget Added",
      description: `Budget for ${budget.category} has been set to ${formatCurrency(budget.amount)}.`,
    });
  };

  const handleDeleteBudget = (id: string) => {
    const budgetToDelete = budgets.find(b => b.id === id);
    setBudgets(prev => prev.filter(b => b.id !== id));
    
    if (budgetToDelete) {
      toast({
        title: "Budget Deleted",
        description: `Budget for ${budgetToDelete.category} has been removed.`,
        variant: "destructive",
      });
    }
  };

  const budgetComparison = getBudgetComparison(transactions, budgets, currentMonth);
  const spendingInsights = generateSpendingInsights(transactions, budgets, currentMonth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Personal Finance Visualizer</h1>
          <p className="text-lg text-gray-600">Track your income, expenses, and budgets with beautiful visualizations</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Total Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{formatCurrency(totalIncome)}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Total Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{formatCurrency(totalExpenses)}</p>
            </CardContent>
          </Card>

          <Card className={`bg-gradient-to-r text-white ${
            totalBalance >= 0 
              ? 'from-blue-500 to-blue-600' 
              : 'from-orange-500 to-orange-600'
          }`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Net Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {totalBalance >= 0 ? '+' : ''}{formatCurrency(totalBalance)}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                Top Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold">
                {topCategories.length > 0 ? topCategories[0].name : 'No data'}
              </p>
              <p className="text-sm opacity-90">
                {topCategories.length > 0 ? formatCurrency(topCategories[0].value) : ''}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdown Cards */}
        {topCategories.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Top Expense Categories</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topCategories.map((category, index) => (
                <Card key={category.name} className="border-l-4" style={{ borderLeftColor: category.color }}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{category.name}</p>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(category.value)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Rank #{index + 1}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-1 space-y-8">
            <TransactionForm
              onAddTransaction={handleAddTransaction}
              onUpdateTransaction={handleUpdateTransaction}
              editingTransaction={editingTransaction}
              onCancelEdit={handleCancelEdit}
            />
            
            <BudgetForm
              budgets={budgets}
              onAddBudget={handleAddBudget}
              onDeleteBudget={handleDeleteBudget}
              currentMonth={currentMonth}
            />
          </div>

          {/* Right Column - Charts and Lists */}
          <div className="lg:col-span-2 space-y-8">
            {/* Budget Comparison Chart */}
            <BudgetComparisonChart data={budgetComparison} />

            {/* Spending Insights */}
            <SpendingInsights insights={spendingInsights} />

            {/* Original Charts Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <MonthlyChart data={monthlyData} />
              <CategoryChart data={categoryData} />
            </div>

            {/* Recent Transactions Summary */}
            {recentTransactions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {recentTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-gray-500">{transaction.category}</p>
                        </div>
                        <p className={`font-semibold ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Transaction List */}
            <TransactionList
              transactions={transactions}
              onEditTransaction={handleEditTransaction}
              onDeleteTransaction={handleDeleteTransaction}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

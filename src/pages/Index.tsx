
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import MonthlyChart from '@/components/MonthlyChart';
import { Transaction } from '@/types/Transaction';
import { getMonthlyData, calculateTotalBalance, formatCurrency } from '@/utils/financeUtils';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const { toast } = useToast();

  // Load transactions from localStorage on component mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem('finance-transactions');
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, []);

  // Save transactions to localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem('finance-transactions', JSON.stringify(transactions));
  }, [transactions]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Personal Finance Visualizer</h1>
          <p className="text-lg text-gray-600">Track your income and expenses with beautiful visualizations</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total Income</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{formatCurrency(totalIncome)}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total Expenses</CardTitle>
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
              <CardTitle className="text-sm font-medium opacity-90">Net Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {totalBalance >= 0 ? '+' : ''}{formatCurrency(totalBalance)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Transaction Form */}
          <div className="lg:col-span-1">
            <TransactionForm
              onAddTransaction={handleAddTransaction}
              onUpdateTransaction={handleUpdateTransaction}
              editingTransaction={editingTransaction}
              onCancelEdit={handleCancelEdit}
            />
          </div>

          {/* Chart and Transaction List */}
          <div className="lg:col-span-2 space-y-8">
            {/* Monthly Chart */}
            <MonthlyChart data={monthlyData} />

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


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Budget, EXPENSE_CATEGORIES } from '@/types/Transaction';
import { generateId, formatCurrency } from '@/utils/financeUtils';
import { Target, Plus, Trash2 } from 'lucide-react';

interface BudgetFormProps {
  budgets: Budget[];
  onAddBudget: (budget: Budget) => void;
  onDeleteBudget: (id: string) => void;
  currentMonth: string;
}

const BudgetForm: React.FC<BudgetFormProps> = ({
  budgets,
  onAddBudget,
  onDeleteBudget,
  currentMonth,
}) => {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !amount || parseFloat(amount) <= 0) return;

    const budget: Budget = {
      id: generateId(),
      category,
      amount: parseFloat(amount),
      month: currentMonth,
    };

    onAddBudget(budget);
    setCategory('');
    setAmount('');
  };

  const currentMonthBudgets = budgets.filter(b => b.month === currentMonth);
  const usedCategories = currentMonthBudgets.map(b => b.category);
  const availableCategories = EXPENSE_CATEGORIES.filter(cat => !usedCategories.includes(cat));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Monthly Budget
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="budget-category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {availableCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget-amount">Budget Amount</Label>
            <Input
              id="budget-amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={!category || !amount || parseFloat(amount) <= 0}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Budget
          </Button>
        </form>

        {currentMonthBudgets.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">Current Month Budgets</h4>
            {currentMonthBudgets.map((budget) => (
              <div key={budget.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium">{budget.category}</p>
                  <p className="text-sm text-muted-foreground">{formatCurrency(budget.amount)}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDeleteBudget(budget.id)}
                  className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetForm;

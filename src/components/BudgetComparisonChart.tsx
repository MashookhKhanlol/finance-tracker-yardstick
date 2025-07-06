
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';
import { BudgetComparison } from '@/types/Transaction';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface BudgetComparisonChartProps {
  data: BudgetComparison[];
}

const BudgetComparisonChart: React.FC<BudgetComparisonChartProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Budget vs Actual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Set budgets to see comparison</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartConfig = {
    budgeted: {
      label: "Budgeted",
      color: "#3b82f6",
    },
    actual: {
      label: "Actual",
      color: "#ef4444",
    },
  };

  const chartData = data.map(item => ({
    category: item.category.length > 12 ? item.category.substring(0, 12) + '...' : item.category,
    budgeted: item.budgeted,
    actual: item.actual,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Budget vs Actual
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis 
                dataKey="category" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="budgeted" fill="var(--color-budgeted)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="actual" fill="var(--color-actual)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {data.map((item) => (
            <div key={item.category} className="p-3 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-sm">{item.category}</p>
                {item.percentage > 100 ? (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                ) : (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                )}
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Budget:</span>
                  <span>${item.budgeted.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Spent:</span>
                  <span>${item.actual.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Status:</span>
                  <span className={item.percentage > 100 ? 'text-red-600' : 'text-green-600'}>
                    {item.percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetComparisonChart;

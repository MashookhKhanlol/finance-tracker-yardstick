
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SpendingInsight } from '@/types/Transaction';
import { AlertTriangle, Info, CheckCircle, Lightbulb } from 'lucide-react';

interface SpendingInsightsProps {
  insights: SpendingInsight[];
}

const SpendingInsights: React.FC<SpendingInsightsProps> = ({ insights }) => {
  const getIcon = (type: SpendingInsight['type']) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getVariant = (type: SpendingInsight['type']) => {
    switch (type) {
      case 'warning':
        return 'destructive';
      case 'success':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getBgColor = (type: SpendingInsight['type']) => {
    switch (type) {
      case 'warning':
        return 'bg-red-50 border-red-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  if (insights.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Spending Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Add more transactions to get insights</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Spending Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${getBgColor(insight.type)}`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 ${
                  insight.type === 'warning' ? 'text-red-600' :
                  insight.type === 'success' ? 'text-green-600' : 'text-blue-600'
                }`}>
                  {getIcon(insight.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">{insight.title}</h4>
                    <Badge variant={getVariant(insight.type)} className="text-xs">
                      {insight.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {insight.description}
                  </p>
                  {insight.category && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-medium">Category:</span>
                      <Badge variant="outline">{insight.category}</Badge>
                      {insight.amount && (
                        <>
                          <span className="font-medium">Amount:</span>
                          <span>${insight.amount.toFixed(2)}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SpendingInsights;

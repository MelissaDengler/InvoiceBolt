import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from '@/lib/utils';

const mockBudgets = [
  {
    id: '1',
    category: 'office_supplies',
    amount: 1000,
    spent: 750,
    period: 'monthly',
  },
  {
    id: '2',
    category: 'software',
    amount: 500,
    spent: 200,
    period: 'monthly',
  },
  {
    id: '3',
    category: 'travel',
    amount: 2000,
    spent: 1500,
    period: 'monthly',
  },
];

export function BudgetOverview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockBudgets.map((budget) => {
          const percentage = (budget.spent / budget.amount) * 100;
          const variant = percentage > 90 
            ? 'destructive' 
            : percentage > 75 
              ? 'warning' 
              : 'default';

          return (
            <Card key={budget.id} className="card-hover glass-morphism">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium capitalize">
                  {budget.category.replace('_', ' ')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {formatCurrency(budget.spent)} of {formatCurrency(budget.amount)}
                    </span>
                    <span className="font-medium">
                      {Math.round(percentage)}%
                    </span>
                  </div>
                  <Progress 
                    value={percentage} 
                    className={
                      variant === 'destructive' 
                        ? 'text-destructive' 
                        : variant === 'warning' 
                          ? 'text-yellow-500' 
                          : ''
                    }
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
} 
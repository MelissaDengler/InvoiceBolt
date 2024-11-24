import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: 'up' | 'down';
  className?: string;
}

export function StatCard({ 
  title, 
  value, 
  icon, 
  description, 
  trend,
  className 
}: StatCardProps) {
  return (
    <Card className={cn("transition-all duration-300", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
            {trend && (
              <span className={cn(
                "ml-2 inline-flex items-center",
                trend === 'up' ? "text-green-600" : "text-red-600"
              )}>
                {trend === 'up' ? '↑' : '↓'}
              </span>
            )}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
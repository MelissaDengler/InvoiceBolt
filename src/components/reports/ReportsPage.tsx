import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useInvoices } from '@/hooks/use-invoices';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { Download, FileText, TrendingUp, DollarSign } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function ReportsPage() {
  const { invoices } = useInvoices();
  const [selectedPeriod, setSelectedPeriod] = useState('3m');

  // Calculate revenue metrics
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidRevenue = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);
  const pendingRevenue = invoices
    .filter(inv => inv.status === 'pending')
    .reduce((sum, inv) => sum + inv.amount, 0);
  const overdueRevenue = invoices
    .filter(inv => inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.amount, 0);

  // Status distribution for pie chart
  const statusDistribution = [
    { name: 'Paid', value: invoices.filter(inv => inv.status === 'paid').length },
    { name: 'Pending', value: invoices.filter(inv => inv.status === 'pending').length },
    { name: 'Overdue', value: invoices.filter(inv => inv.status === 'overdue').length },
    { name: 'Draft', value: invoices.filter(inv => inv.status === 'draft').length }
  ];

  // Monthly revenue data
  const getMonthlyData = () => {
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(new Date(), i);
      return {
        month: format(date, 'MMM yyyy'),
        start: startOfMonth(date),
        end: endOfMonth(date)
      };
    }).reverse();

    return months.map(({ month, start, end }) => ({
      name: month,
      revenue: invoices
        .filter(inv => {
          const invDate = new Date(inv.date);
          return invDate >= start && invDate <= end;
        })
        .reduce((sum, inv) => sum + inv.amount, 0)
    }));
  };

  // Client revenue data
  const getClientRevenue = () => {
    const clientRevenue = invoices.reduce((acc, inv) => {
      acc[inv.client] = (acc[inv.client] || 0) + inv.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(clientRevenue)
      .map(([client, revenue]) => ({ client, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground dark:text-primary">Reports</h1>
          <p className="text-muted-foreground mt-1">Financial insights and analytics</p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" /> Export Report
        </Button>
      </div>

      {/* Revenue Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: "Total Revenue",
            value: totalRevenue,
            icon: DollarSign,
            description: "All time revenue"
          },
          {
            title: "Paid",
            value: paidRevenue,
            icon: FileText,
            description: "Collected revenue"
          },
          {
            title: "Pending",
            value: pendingRevenue,
            icon: TrendingUp,
            description: "Awaiting payment"
          },
          {
            title: "Overdue",
            value: overdueRevenue,
            icon: FileText,
            description: "Past due invoices"
          }
        ].map((stat, index) => (
          <Card key={index} className="card-hover glass-morphism gradient-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stat.value.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList>
          <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
          <TabsTrigger value="invoices">Invoice Status</TabsTrigger>
          <TabsTrigger value="clients">Top Clients</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <Card className="card-hover glass-morphism gradient-border">
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getMonthlyData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#8884d8" 
                    name="Revenue"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices">
          <Card className="card-hover glass-morphism gradient-border">
            <CardHeader>
              <CardTitle>Invoice Status Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients">
          <Card className="card-hover glass-morphism gradient-border">
            <CardHeader>
              <CardTitle>Top Clients by Revenue</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getClientRevenue()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="client" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 
import { useState } from 'react';
import { DollarSign, Calendar, Users, ArrowUpRight, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from './StatCard';
import { InvoiceList } from '../invoices/InvoiceList';
import { CreateInvoiceDialog } from '../invoices/CreateInvoiceDialog';
import { InvoiceDetails } from '../invoices/InvoiceDetails';
import { AnalyticsSection } from './AnalyticsSection';
import { QuickActions } from './QuickActions';
import { useToast } from "@/hooks/use-toast";
import { useInvoices } from '@/hooks/use-invoices';
import { Invoice } from '@/types/invoice';
import type { CreateInvoiceInput } from '@/types/invoice';
import { format } from 'date-fns';
import type { DbInvoice } from '@/types/invoice';

interface CustomerData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export function DashboardPage() {
  const { invoices, loading, error, createInvoice, deleteInvoice } = useInvoices();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const { toast } = useToast();

  const handleCreateInvoice = async (invoice: Invoice, customer: CustomerData) => {
    try {
      const newInvoice = await createInvoice(invoice);
      if (newInvoice) {
        toast({
          title: "Success",
          description: `Invoice for ${customer.name} has been created successfully.`,
        });
      }
    } catch (error) {
      console.error('Error in handleCreateInvoice:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create invoice. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleView = (id: string) => {
    const invoice = invoices.find(inv => inv.id === id);
    if (invoice) {
      setSelectedInvoice(invoice);
    }
  };

  const handleEdit = (id: string) => {
    toast({
      title: "Coming Soon",
      description: "Edit functionality will be available soon!",
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteInvoice(id);
      toast({
        title: "Success",
        description: "Invoice has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete invoice. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    toast({
      title: "Coming Soon",
      description: "Export functionality will be available soon!",
    });
  };

  const handleSendReminders = () => {
    toast({
      title: "Coming Soon",
      description: "Reminder functionality will be available soon!",
    });
  };

  const handleGenerateReport = () => {
    toast({
      title: "Coming Soon",
      description: "Report generation will be available soon!",
    });
  };

  const getMonthlyTrend = (invoices: Invoice[]) => {
    const monthlyData: { [key: string]: number } = {};
    
    invoices.forEach(invoice => {
      try {
        const date = new Date(invoice.date);
        if (isNaN(date.getTime())) {
          console.warn('Invalid date:', invoice.date);
          return;
        }
        const monthYear = format(date, 'MMM yyyy');
        monthlyData[monthYear] = (monthlyData[monthYear] || 0) + invoice.amount;
      } catch (error) {
        console.warn('Error processing invoice:', error);
      }
    });

    return Object.entries(monthlyData).map(([date, amount]) => ({
      date,
      amount
    }));
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading...</span>
      </div>
    );
  }

  const totalOutstanding = invoices
    .filter(inv => ['pending', 'overdue'].includes(inv.status))
    .reduce((sum, inv) => sum + inv.amount, 0);

  const totalPaid = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="space-y-8 md:space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground dark:text-primary">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, manage your invoices</p>
        </div>
        <CreateInvoiceDialog onCreateInvoice={handleCreateInvoice} />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 md:gap-8">
        {[
          {
            title: "Total Outstanding",
            value: `$${totalOutstanding.toLocaleString()}`,
            icon: <DollarSign className="h-4 w-4 text-primary" />,
            description: "From pending and overdue invoices",
            trend: totalOutstanding > 0 ? ("up" as const) : ("down" as const)
          },
          {
            title: "Total Paid",
            value: `$${totalPaid.toLocaleString()}`,
            icon: <ArrowUpRight className="h-4 w-4 text-green-600" />,
            description: "Total payments received",
            trend: totalPaid > 0 ? ("up" as const) : ("down" as const)
          },
          {
            title: "Active Clients",
            value: new Set(invoices.map(inv => inv.customer_id)).size,
            icon: <Users className="h-4 w-4 text-primary" />,
            description: "Total active clients",
            trend: new Set(invoices.map(inv => inv.customer_id)).size > 0 ? ("up" as const) : ("down" as const)
          },
          {
            title: "Due This Month",
            value: invoices.filter(inv => 
              inv.status === 'pending' && 
              new Date(inv.due_date).getMonth() === new Date().getMonth()
            ).length,
            icon: <Calendar className="h-4 w-4 text-primary" />,
            description: "Invoices due this month",
            trend: invoices.filter(inv => 
              inv.status === 'pending' && 
              new Date(inv.due_date).getMonth() === new Date().getMonth()
            ).length > 0 ? ("up" as const) : ("down" as const)
          }
        ].map((stat, index) => (
          <StatCard
            key={index}
            {...stat}
            className="card-hover glass-morphism gradient-border shimmer"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <QuickActions 
          className="card-hover glass-morphism gradient-border"
          onNewInvoice={() => setSelectedInvoice(null)}
          onExport={handleExport}
          onSendReminders={handleSendReminders}
          onGenerateReport={handleGenerateReport}
        />
        <AnalyticsSection 
          invoiceData={invoices.map(inv => ({
            date: new Date(inv.date).toLocaleDateString(),
            amount: inv.amount
          }))}
          statusDistribution={[
            { name: 'Paid', value: invoices.filter(inv => inv.status === 'paid').length },
            { name: 'Pending', value: invoices.filter(inv => inv.status === 'pending').length },
            { name: 'Overdue', value: invoices.filter(inv => inv.status === 'overdue').length },
            { name: 'Draft', value: invoices.filter(inv => inv.status === 'draft').length }
          ]}
          monthlyTrend={getMonthlyTrend(invoices)}
        />
      </div>

      <Card className="card-hover glass-morphism gradient-border">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <InvoiceList
            invoices={invoices.map(inv => ({
              id: inv.id,
              client: inv.customers?.name || 'Unknown Client',
              amount: inv.amount,
              currency: inv.currency || 'USD',
              date: inv.date,
              dueDate: inv.due_date,
              status: inv.status,
              customer_id: inv.customer_id,
              notes: inv.notes || undefined
            }))}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      {selectedInvoice && (
        <InvoiceDetails
          invoice={selectedInvoice}
          open={!!selectedInvoice}
          onOpenChange={(open) => !open && setSelectedInvoice(null)}
        />
      )}
    </div>
  );
} 
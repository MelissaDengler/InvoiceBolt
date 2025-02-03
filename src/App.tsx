import { useState, useEffect } from 'react';
import { DollarSign, Calendar, Users, ArrowUpRight, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from '@/components/layout/Header';
import { StatCard } from '@/components/dashboard/StatCard';
import { InvoiceList } from '@/components/invoices/InvoiceList';
import { CreateInvoiceDialog } from '@/components/invoices/CreateInvoiceDialog';
import { InvoiceDetails } from '@/components/invoices/InvoiceDetails';
import { Invoice } from '@/types/invoice';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useInvoices } from '@/hooks/use-invoices';
import { testSupabaseConnection } from '@/lib/supabase';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { CreateInvoiceInput } from '@/types/invoice';
import { AnalyticsSection } from '@/components/dashboard/AnalyticsSection';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { format } from 'date-fns';
import type { DbInvoice } from '@/types/invoice';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { validateEnv } from '@/lib/env';
import { ConnectionStatus } from '@/components/ConnectionStatus'

interface CustomerData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

function App() {
  const { invoices, loading, error, createInvoice: createSupabaseInvoice, deleteInvoice } = useInvoices();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const { toast } = useToast();
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    // Validate environment variables on startup
    validateEnv();
    
    const testConnection = async () => {
      const result = await testSupabaseConnection();
      if (!result.success) {
        setConnectionError(
          result.message || 
          'Failed to connect to database. Please check your credentials.'
        );
      }
    };
    
    testConnection();
  }, []);

  const handleCreateInvoice = async (invoice: Invoice, customer: CustomerData) => {
    try {
      const newInvoiceData: CreateInvoiceInput = {
        customer_id: '',
        total_amount: invoice.amount,
        issue_date: invoice.date,
        due_date: invoice.dueDate,
        status: invoice.status,
        currency: invoice.currency,
        notes: invoice.notes || null,
        items: invoice.items?.map(item => ({
          description: item.description,
          quantity: item.quantity,
          rate: item.rate
        })),
        logo_url: invoice.logo_url,
        payment_terms: invoice.payment_terms,
        tax_rate: invoice.tax_rate,
        discount: invoice.discount,
        recurring: invoice.recurring,
        recurring_interval: invoice.recurring_interval
      };
      
      const newInvoice = await createSupabaseInvoice(newInvoiceData, customer);

      if (newInvoice) {
        toast({
          title: "Success",
          description: `Invoice for ${customer.name} has been created successfully.`,
        });
        setCreateDialogOpen(false);
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

  const handleEdit = (id: string) => {
    const dbInvoice = invoices.find(inv => inv.id === id);
    if (dbInvoice) {
      const uiInvoice: Invoice = {
        id: dbInvoice.id,
        client: dbInvoice.customers?.name || 'Unknown Client',
        customer_id: dbInvoice.customer_id,
        amount: dbInvoice.total_amount,
        currency: dbInvoice.currency || 'USD',
        date: dbInvoice.issue_date,
        dueDate: dbInvoice.due_date,
        status: dbInvoice.status,
        notes: dbInvoice.notes || undefined,
        logo_url: dbInvoice.logo_url || undefined
      };
      setSelectedInvoice(uiInvoice);
    }
  };

  const handleDelete = async (id: string) => {
    const success = await deleteInvoice(id);
    if (success) {
      toast({
        title: "Invoice Deleted",
        description: "The invoice has been deleted successfully.",
        variant: "destructive",
      });
    }
  };

  const handleView = (id: string) => {
    const dbInvoice = invoices.find(inv => inv.id === id);
    if (dbInvoice) {
      const uiInvoice: Invoice = {
        id: dbInvoice.id,
        client: dbInvoice.customers?.name || 'Unknown Client',
        customer_id: dbInvoice.customer_id,
        amount: dbInvoice.total_amount,
        currency: dbInvoice.currency || 'USD',
        date: dbInvoice.issue_date,
        dueDate: dbInvoice.due_date,
        status: dbInvoice.status,
        notes: dbInvoice.notes || undefined,
        items: dbInvoice.items || [],
        logo_url: dbInvoice.logo_url || undefined,
        payment_terms: dbInvoice.payment_terms || undefined,
        tax_rate: dbInvoice.tax_rate || undefined,
        discount: dbInvoice.discount || undefined,
        recurring: dbInvoice.recurring || undefined,
        recurring_interval: dbInvoice.recurring_interval || undefined
      };
      setSelectedInvoice(uiInvoice);
    }
  };

  const totalOutstanding = invoices
    .filter(inv => inv.status === 'pending' || inv.status === 'overdue')
    .reduce((acc, inv) => acc + inv.total_amount, 0);

  const totalPaid = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((acc, inv) => acc + inv.total_amount, 0);

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

  const getMonthlyTrend = (invoices: DbInvoice[]) => {
    const monthlyData: { [key: string]: number } = {};
    
    invoices.forEach(invoice => {
      const monthYear = format(new Date(invoice.issue_date), 'MMM yyyy');
      monthlyData[monthYear] = (monthlyData[monthYear] || 0) + invoice.total_amount;
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

  if (error || connectionError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="mt-2">{error?.message || connectionError}</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 md:px-6 md:py-12 lg:px-8">
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
                className="floating"
                onNewInvoice={() => setCreateDialogOpen(true)}
                onExport={handleExport}
                onSendReminders={handleSendReminders}
                onGenerateReport={handleGenerateReport}
              />
              <AnalyticsSection 
                invoiceData={invoices.map(inv => ({
                  date: new Date(inv.issue_date).toLocaleDateString(),
                  amount: inv.total_amount
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
                    amount: inv.total_amount,
                    currency: inv.currency || 'USD',
                    date: inv.issue_date,
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
          </div>
        </main>

        {selectedInvoice && (
          <InvoiceDetails
            invoice={selectedInvoice}
            open={!!selectedInvoice}
            onOpenChange={(open) => !open && setSelectedInvoice(null)}
          />
        )}
        <ConnectionStatus />
        <Toaster />
      </div>
    </ErrorBoundary>
  );
}

export default App;
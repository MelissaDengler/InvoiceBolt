import { useState, useEffect } from 'react';
import { DollarSign, Calendar, Users, ArrowUpRight } from 'lucide-react';
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
import { AlertCircle } from 'lucide-react';
import type { Database } from '@/lib/database.types'
import type { CreateInvoiceInput } from '@/types/invoice'
import { v4 as uuidv4 } from 'uuid';

interface CustomerData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

function App() {
  const { invoices, loading, error, createInvoice: createSupabaseInvoice, updateInvoice, deleteInvoice } = useInvoices();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const { toast } = useToast();
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
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
        logo_url: invoice.logo_url
      }

      console.log('Creating invoice:', { invoice: newInvoiceData, customer })
      
      const newInvoice = await createSupabaseInvoice(newInvoiceData, customer)

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
        logo_url: dbInvoice.logo_url
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

  const totalOutstanding = invoices
    .filter(inv => inv.status === 'pending' || inv.status === 'overdue')
    .reduce((acc, inv) => acc + inv.total_amount, 0);

  const totalPaid = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((acc, inv) => acc + inv.total_amount, 0);

  if (connectionError) {
    return (
      <div className="min-h-screen p-8 bg-background">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>{connectionError}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-foreground to-background">
      <Header />
      
      <main className="max-w-7xl mx-auto p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back, manage your invoices</p>
          </div>
          <CreateInvoiceDialog onCreateInvoice={handleCreateInvoice} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Outstanding"
            value={`$${totalOutstanding.toLocaleString()}`}
            icon={<DollarSign className="h-4 w-4 text-primary" />}
            description="From pending and overdue invoices"
          />
          <StatCard
            title="Total Paid"
            value={`$${totalPaid.toLocaleString()}`}
            icon={<ArrowUpRight className="h-4 w-4 text-green-600" />}
            description="Total payments received"
          />
          <StatCard
            title="Active Clients"
            value={new Set(invoices.map(inv => inv.customer_id)).size}
            icon={<Users className="h-4 w-4 text-primary" />}
          />
          <StatCard
            title="Due This Month"
            value={invoices.filter(inv => 
              inv.status === 'pending' && 
              new Date(inv.due_date).getMonth() === new Date().getMonth()
            ).length}
            icon={<Calendar className="h-4 w-4 text-primary" />}
          />
        </div>

        <Card className="shadow-lg border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-900">Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <InvoiceList
              invoices={invoices.map(inv => ({
                id: inv.id,
                client: inv.customers?.name || 'Unknown Client',
                amount: inv.total_amount,
                date: inv.issue_date,
                dueDate: inv.due_date,
                status: inv.status,
                customer_id: inv.customer_id,
                notes: inv.notes || undefined
              }))}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </CardContent>
        </Card>
      </main>

      {selectedInvoice && (
        <InvoiceDetails
          invoice={selectedInvoice}
          open={!!selectedInvoice}
          onOpenChange={(open) => !open && setSelectedInvoice(null)}
        />
      )}
      <Toaster />
    </div>
  );
}

export default App;
import { useState } from 'react';
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

function App() {
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: '1',
      client: 'Acme Corp',
      amount: 1500,
      date: '2024-03-20',
      dueDate: '2024-04-20',
      status: 'paid',
      items: [
        { id: '1', description: 'Website Design', quantity: 1, rate: 1500 }
      ]
    },
    {
      id: '2',
      client: 'Stark Industries',
      amount: 2300,
      date: '2024-03-21',
      dueDate: '2024-04-21',
      status: 'pending',
      items: [
        { id: '1', description: 'Consulting Services', quantity: 2, rate: 1150 }
      ]
    },
    {
      id: '3',
      client: 'Wayne Enterprises',
      amount: 3500,
      date: '2024-03-15',
      dueDate: '2024-03-30',
      status: 'overdue',
      items: [
        { id: '1', description: 'Software Development', quantity: 1, rate: 3500 }
      ]
    }
  ]);

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const { toast } = useToast();

  const handleCreateInvoice = (invoice: Invoice) => {
    setInvoices([invoice, ...invoices]);
    toast({
      title: "Invoice Created",
      description: `Invoice for ${invoice.client} has been created successfully.`,
    });
  };

  const handleEdit = (id: string) => {
    const invoice = invoices.find(inv => inv.id === id);
    if (invoice) {
      setSelectedInvoice(invoice);
    }
  };

  const handleDelete = (id: string) => {
    setInvoices(invoices.filter(invoice => invoice.id !== id));
    toast({
      title: "Invoice Deleted",
      description: "The invoice has been deleted successfully.",
      variant: "destructive",
    });
  };

  const totalOutstanding = invoices
    .filter(inv => inv.status === 'pending' || inv.status === 'overdue')
    .reduce((acc, inv) => acc + inv.amount, 0);

  const totalPaid = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((acc, inv) => acc + inv.amount, 0);

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
            value={new Set(invoices.map(inv => inv.client)).size}
            icon={<Users className="h-4 w-4 text-primary" />}
          />
          <StatCard
            title="Due This Month"
            value={invoices.filter(inv => inv.status === 'pending').length}
            icon={<Calendar className="h-4 w-4 text-primary" />}
          />
        </div>

        <Card className="shadow-lg border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-900">Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <InvoiceList
              invoices={invoices}
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
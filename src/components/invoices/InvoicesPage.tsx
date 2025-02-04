import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InvoiceList } from './InvoiceList';
import { CreateInvoiceDialog } from './CreateInvoiceDialog';
import { InvoiceDetails } from './InvoiceDetails';
import { useInvoices } from '@/hooks/use-invoices';
import { useToast } from "@/hooks/use-toast";
import { Invoice } from '@/types/invoice';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function InvoicesPage() {
  const { invoices, loading, error, createInvoice, deleteInvoice } = useInvoices();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  const handleCreateInvoice = async (invoice: Invoice, customer: { name: string }) => {
    try {
      const newInvoice = await createInvoice(invoice);
      if (newInvoice) {
        toast({
          title: "Success",
          description: `Invoice for ${customer.name} has been created successfully.`,
        });
      }
    } catch (error) {
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

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading...</span>
      </div>
    );
  }

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground dark:text-primary">Invoices</h1>
          <p className="text-muted-foreground mt-1">Manage and track your invoices</p>
        </div>
        <CreateInvoiceDialog onCreateInvoice={handleCreateInvoice} />
      </div>

      <Card className="card-hover glass-morphism gradient-border">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex gap-4">
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <InvoiceList
            invoices={filteredInvoices}
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
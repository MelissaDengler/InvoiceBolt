import { formatCurrency } from '@/lib/utils'
import { Badge } from '../ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Invoice } from "@/types/invoice";

interface InvoiceListProps {
  invoices: Invoice[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function InvoiceList({ invoices, onView, onEdit, onDelete }: InvoiceListProps) {
  return (
    <div className="overflow-x-auto">
      {/* Mobile View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {invoices.map((invoice) => (
          <div
            key={invoice.id}
            className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="font-medium">{invoice.client}</div>
              <Badge variant={getStatusVariant(invoice.status)}>
                {invoice.status}
              </Badge>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              {formatCurrency(invoice.amount, invoice.currency)}
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => onView(invoice.id)}
                className="text-sm text-primary hover:underline"
              >
                View
              </button>
              <button
                onClick={() => onEdit(invoice.id)}
                className="text-sm text-primary hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(invoice.id)}
                className="text-sm text-destructive hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View */}
      <Table className="hidden md:table">
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.client}</TableCell>
              <TableCell>
                {formatCurrency(invoice.amount, invoice.currency)}
              </TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(invoice.status)}>
                  {invoice.status}
                </Badge>
              </TableCell>
              <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
              <TableCell className="space-x-2">
                <button
                  onClick={() => onView(invoice.id)}
                  className="text-sm text-primary hover:underline"
                >
                  View
                </button>
                <button
                  onClick={() => onEdit(invoice.id)}
                  className="text-sm text-primary hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(invoice.id)}
                  className="text-sm text-destructive hover:underline"
                >
                  Delete
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
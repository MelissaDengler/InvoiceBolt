import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Badge } from '../ui/badge'
import { formatCurrency } from '@/lib/utils'
import type { Invoice } from '@/types/invoice'
import { getStatusVariant } from '@/lib/utils/status'

interface InvoiceDetailsProps {
  invoice: Invoice
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InvoiceDetails({ invoice, open, onOpenChange }: InvoiceDetailsProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Invoice Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:space-y-0">
            <div>
              <h3 className="font-medium">Client</h3>
              <p className="text-sm text-muted-foreground">{invoice.client}</p>
            </div>
            <div>
              <Badge variant={getStatusVariant(invoice.status)}>
                {invoice.status}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-medium">Amount</h3>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(invoice.amount, invoice.currency)}
              </p>
            </div>
            <div>
              <h3 className="font-medium">Date</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(invoice.date).toLocaleDateString()}
              </p>
            </div>
          </div>

          {invoice.items && invoice.items.length > 0 && (
            <div className="mt-4">
              <h3 className="mb-2 font-medium">Items</h3>
              <div className="max-h-[300px] overflow-y-auto rounded-md border p-4">
                {invoice.items.map((item, index) => (
                  <div
                    key={index}
                    className="mb-2 grid grid-cols-1 gap-2 border-b pb-2 last:border-0 last:pb-0 md:grid-cols-4"
                  >
                    <div className="md:col-span-2">{item.description}</div>
                    <div>{item.quantity} x {formatCurrency(item.rate, invoice.currency)}</div>
                    <div className="text-right font-medium">
                      {formatCurrency(item.amount || item.quantity * item.rate, invoice.currency)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
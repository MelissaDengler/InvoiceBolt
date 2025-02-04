import { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, FileText, Edit, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const mockExpenses = [
  {
    id: '1',
    date: '2024-03-15',
    amount: 299.99,
    currency: 'USD',
    category: 'office_supplies',
    description: 'Office chairs',
    status: 'approved',
    vendor: 'Office Depot',
  },
  {
    id: '2',
    date: '2024-03-14',
    amount: 89.99,
    currency: 'USD',
    category: 'software',
    description: 'Adobe subscription',
    status: 'pending',
    vendor: 'Adobe',
  },
  // Add more mock expenses...
];

export function ExpenseList() {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead className="w-[50px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockExpenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell>
                {new Date(expense.date).toLocaleDateString()}
              </TableCell>
              <TableCell>{expense.description}</TableCell>
              <TableCell className="capitalize">
                {expense.category.replace('_', ' ')}
              </TableCell>
              <TableCell>{formatCurrency(expense.amount)}</TableCell>
              <TableCell>
                <Badge 
                  variant={
                    expense.status === 'approved' 
                      ? 'success' 
                      : expense.status === 'pending' 
                        ? 'warning' 
                        : 'destructive'
                  }
                >
                  {expense.status}
                </Badge>
              </TableCell>
              <TableCell>{expense.vendor}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <FileText className="mr-2 h-4 w-4" />
                      View Receipt
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 
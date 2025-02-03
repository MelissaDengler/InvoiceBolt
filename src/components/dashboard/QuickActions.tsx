import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Plus, Download, Mail, Printer, FileText, 
  RefreshCw, Settings, Users, FileSpreadsheet 
} from 'lucide-react';
import { cn } from "@/lib/utils";

interface QuickActionsProps {
  onNewInvoice: () => void;
  onExport: () => void;
  onSendReminders: () => void;
  onGenerateReport: () => void;
  className?: string;
}

export function QuickActions({ onNewInvoice, onExport, onSendReminders, onGenerateReport, className }: QuickActionsProps) {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <CardTitle className="text-soft-pink">Quick Actions</CardTitle>
        <CardDescription className="text-muted-pink">
          Common tasks and operations
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <Button 
          variant="outline" 
          className="flex items-center gap-2 h-20 text-lg hover:bg-primary hover:text-white transition-colors"
          onClick={onNewInvoice}
        >
          <Plus className="h-5 w-5" /> New Invoice
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 h-20 text-lg hover:bg-primary hover:text-white transition-colors"
          onClick={onExport}
        >
          <FileSpreadsheet className="h-5 w-5" /> Export Data
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 h-20 text-lg hover:bg-primary hover:text-white transition-colors"
          onClick={onSendReminders}
        >
          <Mail className="h-5 w-5" /> Send Reminders
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 h-20 text-lg hover:bg-primary hover:text-white transition-colors"
          onClick={onGenerateReport}
        >
          <FileText className="h-5 w-5" /> Generate Report
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 h-20 text-lg hover:bg-primary hover:text-white transition-colors"
        >
          <RefreshCw className="h-5 w-5" /> Recurring
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 h-20 text-lg hover:bg-primary hover:text-white transition-colors"
        >
          <Users className="h-5 w-5" /> Customers
        </Button>
      </CardContent>
    </Card>
  );
} 
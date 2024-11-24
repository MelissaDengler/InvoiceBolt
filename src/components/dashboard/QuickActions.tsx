import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Plus, Download, Mail, Printer, FileText, 
  RefreshCw, Settings, Users, FileSpreadsheet 
} from 'lucide-react';

interface QuickActionsProps {
  onNewInvoice: () => void;
  onExport: () => void;
  onSendReminders: () => void;
  onGenerateReport: () => void;
}

export function QuickActions({ onNewInvoice, onExport, onSendReminders, onGenerateReport }: QuickActionsProps) {
  return (
    <Card className="shadow-lg border-primary/20 transition-all duration-300 hover:shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" />
          Quick Actions
        </CardTitle>
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
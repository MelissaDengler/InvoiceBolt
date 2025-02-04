import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { DashboardPage } from '@/components/dashboard/DashboardPage';
import { CustomersPage } from '@/components/customers/CustomersPage';
import { InvoicesPage } from '@/components/invoices/InvoicesPage';
import { ExpensePage } from '@/components/expenses/ExpensePage';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { validateEnv } from '@/lib/env';
import { useEffect } from 'react';
import { ReportsPage } from '@/components/reports/ReportsPage';

function App() {
  useEffect(() => {
    validateEnv();
  }, []);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="invoices" element={<InvoicesPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="expenses" element={<ExpensePage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<DashboardPage />} />
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
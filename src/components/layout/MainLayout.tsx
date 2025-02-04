import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { Toaster } from "@/components/ui/toaster";

export function MainLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 md:px-6 md:py-12 lg:px-8">
        <Outlet />
      </main>
      <ConnectionStatus />
      <Toaster />
    </div>
  );
} 
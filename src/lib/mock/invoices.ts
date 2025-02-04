import { Invoice } from '@/types/invoice';
import { addDays, subDays } from 'date-fns';

export const mockInvoices: Invoice[] = [
  {
    id: 'INV-2024-001',
    client: 'TechCorp Solutions',
    amount: 2500.00,
    currency: 'USD',
    date: subDays(new Date(), 30).toISOString(),
    dueDate: addDays(new Date(), 15).toISOString(),
    status: 'paid',
    customer_id: 'CUST-001',
    notes: 'Website development - Final payment',
    items: [
      { id: '1', description: 'Frontend Development', quantity: 1, rate: 1500 },
      { id: '2', description: 'Backend Integration', quantity: 1, rate: 1000 }
    ]
  },
  {
    id: 'INV-2024-002',
    client: 'Design Studio Pro',
    amount: 850.00,
    currency: 'USD',
    date: subDays(new Date(), 15).toISOString(),
    dueDate: addDays(new Date(), 15).toISOString(),
    status: 'pending',
    customer_id: 'CUST-002',
    notes: 'Monthly design retainer - March 2024',
    items: [
      { id: '1', description: 'UI/UX Design Services', quantity: 10, rate: 85 }
    ]
  },
  {
    id: 'INV-2024-003',
    client: 'Marketing Masters',
    amount: 1750.00,
    currency: 'USD',
    date: subDays(new Date(), 45).toISOString(),
    dueDate: subDays(new Date(), 15).toISOString(),
    status: 'overdue',
    customer_id: 'CUST-003',
    notes: 'Digital Marketing Campaign - Q1',
    items: [
      { id: '1', description: 'Social Media Management', quantity: 1, rate: 750 },
      { id: '2', description: 'PPC Campaign', quantity: 1, rate: 1000 }
    ]
  },
  {
    id: 'INV-2024-004',
    client: 'Startup Innovators',
    amount: 3200.00,
    currency: 'USD',
    date: new Date().toISOString(),
    dueDate: addDays(new Date(), 30).toISOString(),
    status: 'draft',
    customer_id: 'CUST-004',
    notes: 'MVP Development Phase 1',
    items: [
      { id: '1', description: 'Requirements Analysis', quantity: 1, rate: 800 },
      { id: '2', description: 'Architecture Design', quantity: 1, rate: 1200 },
      { id: '3', description: 'Initial Development', quantity: 1, rate: 1200 }
    ]
  },
  {
    id: 'INV-2024-005',
    client: 'Global Enterprises Ltd',
    amount: 5000.00,
    currency: 'USD',
    date: subDays(new Date(), 5).toISOString(),
    dueDate: addDays(new Date(), 25).toISOString(),
    status: 'pending',
    customer_id: 'CUST-005',
    notes: 'Enterprise Software Customization',
    items: [
      { id: '1', description: 'Custom Module Development', quantity: 1, rate: 3000 },
      { id: '2', description: 'Integration Services', quantity: 1, rate: 2000 }
    ]
  },
  {
    id: 'INV-2024-006',
    client: 'Local Business Solutions',
    amount: 450.00,
    currency: 'USD',
    date: subDays(new Date(), 60).toISOString(),
    dueDate: subDays(new Date(), 30).toISOString(),
    status: 'paid',
    customer_id: 'CUST-006',
    notes: 'Website Maintenance - February 2024',
    items: [
      { id: '1', description: 'Monthly Maintenance', quantity: 1, rate: 300 },
      { id: '2', description: 'Content Updates', quantity: 3, rate: 50 }
    ]
  },
  {
    id: 'INV-2024-007',
    client: 'E-commerce Plus',
    amount: 4200.00,
    currency: 'USD',
    date: subDays(new Date(), 20).toISOString(),
    dueDate: addDays(new Date(), 10).toISOString(),
    status: 'pending',
    customer_id: 'CUST-007',
    notes: 'E-commerce Platform Enhancement',
    items: [
      { id: '1', description: 'Payment Gateway Integration', quantity: 1, rate: 1500 },
      { id: '2', description: 'Shopping Cart Optimization', quantity: 1, rate: 1200 },
      { id: '3', description: 'Performance Optimization', quantity: 1, rate: 1500 }
    ]
  },
  {
    id: 'INV-2024-008',
    client: 'Healthcare Solutions',
    amount: 6500.00,
    currency: 'USD',
    date: subDays(new Date(), 10).toISOString(),
    dueDate: addDays(new Date(), 20).toISOString(),
    status: 'pending',
    customer_id: 'CUST-008',
    notes: 'Patient Management System - Phase 1',
    items: [
      { id: '1', description: 'System Analysis', quantity: 1, rate: 2000 },
      { id: '2', description: 'Database Design', quantity: 1, rate: 1500 },
      { id: '3', description: 'Initial Development', quantity: 1, rate: 3000 }
    ]
  },
  {
    id: 'INV-2024-009',
    client: 'Educational Institute',
    amount: 1200.00,
    currency: 'USD',
    date: subDays(new Date(), 25).toISOString(),
    dueDate: subDays(new Date(), 5).toISOString(),
    status: 'overdue',
    customer_id: 'CUST-009',
    notes: 'Learning Management System Maintenance',
    items: [
      { id: '1', description: 'System Updates', quantity: 1, rate: 800 },
      { id: '2', description: 'Technical Support', quantity: 8, rate: 50 }
    ]
  },
  {
    id: 'INV-2024-010',
    client: 'Retail Chain Corp',
    amount: 3800.00,
    currency: 'USD',
    date: new Date().toISOString(),
    dueDate: addDays(new Date(), 30).toISOString(),
    status: 'draft',
    customer_id: 'CUST-010',
    notes: 'Inventory Management System',
    items: [
      { id: '1', description: 'System Design', quantity: 1, rate: 1500 },
      { id: '2', description: 'Development', quantity: 1, rate: 2300 }
    ]
  }
]; 
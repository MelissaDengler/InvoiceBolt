import { ReactNode } from 'react';

export interface Stat {
  title: string;
  value: number | string;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: ReactNode;
} 
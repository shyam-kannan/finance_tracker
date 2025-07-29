export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Transaction {
  id: string;
  date: string;
  vendor: string;
  amount: number;
  category: string;
  description: string;
  paymentMethod: string;
  receiptUrl?: string;
  isManuallyAdjusted?: boolean;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: 'monthly' | 'weekly';
  isOverall?: boolean;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Insight {
  id: string;
  type: 'spending' | 'saving' | 'recommendation';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category?: string;
}

export interface SpendingPattern {
  category: string;
  amount: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}
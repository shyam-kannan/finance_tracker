import { Transaction, Budget, Category } from '../types';

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: '2024-01-15',
    vendor: 'Starbucks Coffee',
    amount: 12.45,
    category: 'Food & Drink',
    description: 'Grande Latte, Blueberry Muffin',
    paymentMethod: 'Credit Card'
  },
  {
    id: '2',
    date: '2024-01-14',
    vendor: 'Amazon',
    amount: 89.99,
    category: 'Shopping',
    description: 'Wireless Headphones',
    paymentMethod: 'Credit Card'
  },
  {
    id: '3',
    date: '2024-01-13',
    vendor: 'Shell Gas Station',
    amount: 45.30,
    category: 'Transportation',
    description: 'Fuel Purchase',
    paymentMethod: 'Debit Card'
  },
  {
    id: '4',
    date: '2024-01-12',
    vendor: 'Whole Foods Market',
    amount: 67.83,
    category: 'Groceries',
    description: 'Weekly Grocery Shopping',
    paymentMethod: 'Credit Card'
  },
  {
    id: '5',
    date: '2024-01-11',
    vendor: 'Netflix',
    amount: 15.99,
    category: 'Entertainment',
    description: 'Monthly Subscription',
    paymentMethod: 'Credit Card'
  },
  {
    id: '6',
    date: '2024-01-10',
    vendor: 'Uber',
    amount: 23.50,
    category: 'Transportation',
    description: 'Ride to Airport',
    paymentMethod: 'Credit Card'
  },
  {
    id: '7',
    date: '2024-01-09',
    vendor: 'Apple Store',
    amount: 199.99,
    category: 'Shopping',
    description: 'iPhone Case and Charger',
    paymentMethod: 'Credit Card'
  }
];

export const mockBudgets: Budget[] = [
  {
    id: '1',
    category: 'Food & Drink',
    limit: 300,
    spent: 245.67,
    period: 'monthly'
  },
  {
    id: '2',
    category: 'Transportation',
    limit: 200,
    spent: 168.80,
    period: 'monthly'
  },
  {
    id: '3',
    category: 'Shopping',
    limit: 500,
    spent: 389.98,
    period: 'monthly'
  },
  {
    id: '4',
    category: 'Entertainment',
    limit: 100,
    spent: 47.97,
    period: 'monthly'
  },
  {
    id: '5',
    category: 'Groceries',
    limit: 400,
    spent: 234.56,
    period: 'monthly'
  }
];

export const categories: Category[] = [
  { id: '1', name: 'Food & Drink', color: '#EF4444', icon: 'coffee' },
  { id: '2', name: 'Transportation', color: '#3B82F6', icon: 'car' },
  { id: '3', name: 'Shopping', color: '#8B5CF6', icon: 'shopping-bag' },
  { id: '4', name: 'Entertainment', color: '#F59E0B', icon: 'play-circle' },
  { id: '5', name: 'Groceries', color: '#10B981', icon: 'apple' },
  { id: '6', name: 'Utilities', color: '#6B7280', icon: 'zap' },
  { id: '7', name: 'Healthcare', color: '#EC4899', icon: 'heart' },
  { id: '8', name: 'Other', color: '#64748B', icon: 'more-horizontal' }
];
import { Transaction, Budget, Category } from '../types';

export const mockTransactions: Transaction[] = [];

export const mockBudgets: Budget[] = [];

export const categories: Category[] = [
  { id: '1', name: 'Food & Drink', color: '#EF4444', icon: 'coffee' },
  { id: '2', name: 'Transportation', color: '#3B82F6', icon: 'car' },
  { id: '3', name: 'Shopping', color: '#8B5CF6', icon: 'shopping-bag' },
  { id: '4', name: 'Entertainment', color: '#F59E0B', icon: 'play-circle' },
  { id: '5', name: 'Groceries', color: '#10B981', icon: 'apple' },
  { id: '6', name: 'Utilities', color: '#6B7280', icon: 'zap' },
  { id: '7', name: 'Healthcare', color: '#EC4899', icon: 'heart' },
  { id: '8', name: 'Gas & Fuel', color: '#059669', icon: 'fuel' },
  { id: '9', name: 'Travel', color: '#DC2626', icon: 'plane' },
  { id: '10', name: 'Education', color: '#7C3AED', icon: 'book' },
  { id: '11', name: 'Personal Care', color: '#BE185D', icon: 'user' },
  { id: '12', name: 'Other', color: '#64748B', icon: 'more-horizontal' }
];
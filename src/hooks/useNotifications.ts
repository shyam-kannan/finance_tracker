import { useState, useEffect } from 'react';
import { Transaction, Budget } from '../types';

export interface Notification {
  id: string;
  type: 'budget' | 'large_transaction' | 'weekly_report' | 'insight';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
}

export const useNotifications = (transactions: Transaction[], budgets: Budget[]) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const generateNotifications = () => {
      const newNotifications: Notification[] = [];
      const now = new Date();

      // Budget alerts
      budgets.forEach(budget => {
        const percentage = (budget.spent / budget.limit) * 100;
        
        if (budget.spent > budget.limit) {
          newNotifications.push({
            id: `budget-over-${budget.id}`,
            type: 'budget',
            title: 'Budget Exceeded',
            message: `Your ${budget.category} budget is over by $${(budget.spent - budget.limit).toFixed(2)}`,
            timestamp: now,
            read: false,
            priority: 'high'
          });
        } else if (percentage > 80) {
          newNotifications.push({
            id: `budget-warning-${budget.id}`,
            type: 'budget',
            title: 'Budget Warning',
            message: `You've used ${percentage.toFixed(1)}% of your ${budget.category} budget`,
            timestamp: now,
            read: false,
            priority: 'medium'
          });
        }
      });

      // Large transaction alerts
      const averageTransaction = transactions.length > 0 
        ? transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length 
        : 0;
      
      const largeTransactions = transactions.filter(t => t.amount > Math.max(100, averageTransaction * 2));
      
      largeTransactions.slice(0, 3).forEach(transaction => {
        newNotifications.push({
          id: `large-transaction-${transaction.id}`,
          type: 'large_transaction',
          title: 'Large Transaction Detected',
          message: `$${transaction.amount.toFixed(2)} spent at ${transaction.vendor}`,
          timestamp: new Date(transaction.date),
          read: false,
          priority: 'medium'
        });
      });

      // Weekly spending report
      if (transactions.length > 0) {
        const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
        const topCategory = transactions.reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount;
          return acc;
        }, {} as Record<string, number>);
        
        const topCategoryName = Object.entries(topCategory)
          .sort(([, a], [, b]) => b - a)[0]?.[0];

        if (topCategoryName) {
          newNotifications.push({
            id: 'weekly-report',
            type: 'weekly_report',
            title: 'Spending Summary',
            message: `You've spent $${totalSpent.toFixed(2)} total, mostly on ${topCategoryName}`,
            timestamp: now,
            read: false,
            priority: 'low'
          });
        }
      }

      // AI Insights notification
      if (transactions.length >= 2) {
        newNotifications.push({
          id: 'ai-insights',
          type: 'insight',
          title: 'New AI Insights Available',
          message: `We've analyzed your spending patterns and found ${Math.min(transactions.length, 5)} insights`,
          timestamp: now,
          read: false,
          priority: 'low'
        });
      }

      // Sort by priority and timestamp
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      newNotifications.sort((a, b) => {
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return b.timestamp.getTime() - a.timestamp.getTime();
      });

      setNotifications(newNotifications.slice(0, 10)); // Limit to 10 notifications
    };

    generateNotifications();
  }, [transactions, budgets]);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification
  };
};
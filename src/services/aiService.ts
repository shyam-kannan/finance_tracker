import { Transaction, Insight, SpendingPattern } from '../types';

export const generateInsights = (transactions: Transaction[]): Insight[] => {
  const insights: Insight[] = [];
  
  // Analyze spending patterns
  const categorySpending = transactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const totalSpending = Object.values(categorySpending).reduce((sum, amount) => sum + amount, 0);

  // High spending category insight
  const topCategory = Object.entries(categorySpending)
    .sort(([, a], [, b]) => b - a)[0];
  
  if (topCategory && topCategory[1] > totalSpending * 0.3) {
    insights.push({
      id: '1',
      type: 'spending',
      title: `High ${topCategory[0]} Spending`,
      description: `You've spent $${topCategory[1].toFixed(2)} on ${topCategory[0]} this month, which is ${((topCategory[1] / totalSpending) * 100).toFixed(1)}% of your total spending.`,
      impact: 'high',
      category: topCategory[0]
    });
  }

  // Frequent vendor insight
  const vendorCounts = transactions.reduce((acc, t) => {
    acc[t.vendor] = (acc[t.vendor] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topVendor = Object.entries(vendorCounts)
    .sort(([, a], [, b]) => b - a)[0];

  if (topVendor && topVendor[1] >= 3) {
    insights.push({
      id: '2',
      type: 'recommendation',
      title: `Frequent ${topVendor[0]} Visits`,
      description: `You've visited ${topVendor[0]} ${topVendor[1]} times this month. Consider looking for loyalty programs or bulk purchase discounts.`,
      impact: 'medium'
    });
  }

  // Subscription insight
  const subscriptions = transactions.filter(t => 
    t.description.toLowerCase().includes('subscription') || 
    ['Netflix', 'Spotify', 'Hulu', 'Disney+'].includes(t.vendor)
  );

  if (subscriptions.length > 0) {
    const subscriptionTotal = subscriptions.reduce((sum, t) => sum + t.amount, 0);
    insights.push({
      id: '3',
      type: 'recommendation',
      title: 'Subscription Review',
      description: `You're spending $${subscriptionTotal.toFixed(2)} monthly on subscriptions. Review active subscriptions and cancel unused ones to save money.`,
      impact: 'medium'
    });
  }

  // Weekend spending pattern
  const weekendTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  });

  if (weekendTransactions.length > transactions.length * 0.4) {
    insights.push({
      id: '4',
      type: 'spending',
      title: 'Weekend Spending Pattern',
      description: `${((weekendTransactions.length / transactions.length) * 100).toFixed(1)}% of your transactions happen on weekends. Consider meal prepping to reduce weekend food expenses.`,
      impact: 'low'
    });
  }

  return insights;
};

export const getSpendingPatterns = (transactions: Transaction[]): SpendingPattern[] => {
  const categorySpending = transactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const totalSpending = Object.values(categorySpending).reduce((sum, amount) => sum + amount, 0);

  return Object.entries(categorySpending)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: (amount / totalSpending) * 100,
      trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable'
    }))
    .sort((a, b) => b.amount - a.amount);
};
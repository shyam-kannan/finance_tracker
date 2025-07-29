import { Transaction, Insight, SpendingPattern } from '../types';

export const generateInsights = (transactions: Transaction[]): Insight[] => {
  const insights: Insight[] = [];
  
  if (transactions.length === 0) {
    return insights;
  }
  
  // Use all transactions for historical data analysis
  const allTransactions = transactions;
  const totalSpent = allTransactions.reduce((sum, t) => sum + t.amount, 0);
  const averageTransaction = totalSpent / allTransactions.length;

  // Analyze spending patterns
  const categorySpending = allTransactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  // High spending category insight
  const topCategory = Object.entries(categorySpending)
    .sort(([, a], [, b]) => b - a)[0];
  
  if (topCategory && topCategory[1] > totalSpent * 0.25) {
    const percentage = (topCategory[1] / totalSpent) * 100;
    insights.push({
      id: 'top-category',
      type: 'spending',
      title: `High ${topCategory[0]} Spending`,
      description: `${topCategory[0]} accounts for ${percentage.toFixed(1)}% of your total spending ($${topCategory[1].toFixed(2)}). This represents your largest expense category.`,
      impact: percentage > 40 ? 'high' : 'medium',
      category: topCategory[0]
    });
  }

  // Frequent vendor analysis
  const vendorCounts = allTransactions.reduce((acc, t) => {
    acc[t.vendor] = (acc[t.vendor] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const vendorSpending = allTransactions.reduce((acc, t) => {
    acc[t.vendor] = (acc[t.vendor] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const frequentVendors = Object.entries(vendorCounts)
    .filter(([, count]) => count >= 1) // Lower threshold for historical data
    .sort(([, a], [, b]) => b - a);

  frequentVendors.forEach(([vendor, count]) => {
    const spending = vendorSpending[vendor];
    if (spending > averageTransaction) {
      insights.push({
        id: `vendor-${vendor}`,
        type: 'spending',
        title: `${vendor} Spending Analysis`,
        description: `You've spent $${spending.toFixed(2)} at ${vendor}${count > 1 ? ` across ${count} visits` : ''}. This is ${spending > averageTransaction * 2 ? 'significantly' : 'moderately'} above your average transaction.`,
        impact: spending > averageTransaction * 2 ? 'high' : 'medium'
      });
    }
  });

  // Large transaction analysis
  const largeTransactions = allTransactions.filter(t => t.amount > averageTransaction * 1.5);
  
  if (largeTransactions.length > 0) {
    const largeTransactionTotal = largeTransactions.reduce((sum, t) => sum + t.amount, 0);
    insights.push({
      id: 'large-transactions',
      type: 'spending',
      title: 'Large Transactions Detected',
      description: `You have ${largeTransactions.length} transaction${largeTransactions.length > 1 ? 's' : ''} above average ($${(averageTransaction * 1.5).toFixed(2)}), totaling $${largeTransactionTotal.toFixed(2)}. These represent ${((largeTransactionTotal / totalSpent) * 100).toFixed(1)}% of your spending.`,
      impact: largeTransactionTotal > totalSpent * 0.5 ? 'high' : 'medium'
    });
  }

  // Payment method analysis
  const paymentMethods = allTransactions.reduce((acc, t) => {
    acc[t.paymentMethod] = (acc[t.paymentMethod] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const creditCardSpending = paymentMethods['Credit Card'] || 0;
  const cashSpending = paymentMethods['Cash'] || 0;
  
  if (creditCardSpending > totalSpent * 0.7) {
    insights.push({
      id: 'credit-card-usage',
      type: 'recommendation',
      title: 'High Credit Card Usage',
      description: `${((creditCardSpending / totalSpent) * 100).toFixed(1)}% of your spending ($${creditCardSpending.toFixed(2)}) is on credit cards. Monitor your balances to avoid interest charges.`,
      impact: 'medium'
    });
  }

  // Spending diversity analysis
  const uniqueCategories = Object.keys(categorySpending).length;
  if (uniqueCategories >= 3) {
    insights.push({
      id: 'spending-diversity',
      type: 'recommendation',
      title: 'Diverse Spending Pattern',
      description: `Your spending spans ${uniqueCategories} different categories, showing good expense diversification. The most balanced approach to personal finance.`,
      impact: 'low'
    });
  }

  // Historical data insight
  if (allTransactions.length > 0) {
    const dates = allTransactions.map(t => new Date(t.date)).sort((a, b) => a.getTime() - b.getTime());
    const oldestDate = dates[0];
    const newestDate = dates[dates.length - 1];
    const yearSpan = newestDate.getFullYear() - oldestDate.getFullYear();
    
    if (yearSpan > 1) {
      insights.push({
        id: 'historical-data',
        type: 'recommendation',
        title: 'Historical Spending Analysis',
        description: `Your transaction history spans ${yearSpan + 1} years (${oldestDate.getFullYear()}-${newestDate.getFullYear()}), providing valuable long-term spending insights. Consider tracking trends over time for better financial planning.`,
        impact: 'low'
      });
    }
  }
  
  // Average transaction insight
  if (averageTransaction > 50) {
    insights.push({
      id: 'average-transaction',
      type: 'spending',
      title: 'Transaction Size Analysis',
      description: `Your average transaction is $${averageTransaction.toFixed(2)}, which suggests ${averageTransaction > 75 ? 'larger, planned purchases' : 'moderate spending habits'}. This indicates ${averageTransaction > 100 ? 'careful consideration' : 'regular spending'} in your purchasing decisions.`,
      impact: averageTransaction > 100 ? 'medium' : 'low'
    });
  }

  return insights.slice(0, 8); // Limit to top 8 insights
};

export const getSpendingPatterns = (transactions: Transaction[]): SpendingPattern[] => {
  if (transactions.length === 0) {
    return [];
  }
  
  // Use the provided transactions directly (already filtered by caller)
  const categorySpending = transactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const totalSpending = Object.values(categorySpending).reduce((sum, amount) => sum + amount, 0);

  return Object.entries(categorySpending)
    .map(([category, amount]) => {
      return {
        category,
        amount,
        percentage: totalSpending > 0 ? (amount / totalSpending) * 100 : 0,
        trend: 'stable' as const // Simplified for now
      };
    })
    .sort((a, b) => b.amount - a.amount);
};

export const generateSmartRecommendations = (transactions: Transaction[]): Array<{
  title: string;
  description: string;
  savings: string;
  effort: 'Low' | 'Medium' | 'High';
  category?: string;
}> => {
  const recommendations = [];
  
  if (transactions.length === 0) {
    return [];
  }

  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
  const averageTransaction = totalSpent / transactions.length;

  // Analyze subscription-like patterns
  // Grocery shopping patterns
  const groceryStores = transactions.filter(t => 
    ['walmart', 'target', 'kroger', 'safeway', 'whole foods', 'costco', 'grocery', 'market'].some(keyword => 
      t.vendor.toLowerCase().includes(keyword) || t.category === 'Groceries'
    )
  );

  if (groceryStores.length >= 2) {
    const groceryTotal = groceryStores.reduce((sum, t) => sum + t.amount, 0);
    recommendations.push({
      title: "Grocery Shopping Optimization",
      description: `You've spent $${groceryTotal.toFixed(2)} on groceries across ${groceryStores.length} transactions. Meal planning and bulk buying could reduce costs.`,
      savings: `$${(groceryTotal * 0.15).toFixed(0)}`,
      effort: 'Medium' as const,
      category: 'Groceries'
    });
  }

  // Large transaction analysis
  const largeTransactions = transactions.filter(t => t.amount > averageTransaction * 1.5);
  if (largeTransactions.length > 0) {
    const largeTotal = largeTransactions.reduce((sum, t) => sum + t.amount, 0);
    recommendations.push({
      title: "Review Large Purchases",
      description: `${largeTransactions.length} transaction${largeTransactions.length > 1 ? 's' : ''} above $${(averageTransaction * 1.5).toFixed(2)}. Review these for potential alternatives or better deals.`,
      savings: `$${(largeTotal * 0.1).toFixed(0)}`,
      effort: 'Low' as const
    });
  }

  // Category concentration analysis
  const categorySpending = transactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(categorySpending)
    .sort(([, a], [, b]) => b - a)[0];

  if (topCategory && topCategory[1] > totalSpent * 0.4) {
    recommendations.push({
      title: `Diversify Beyond ${topCategory[0]}`,
      description: `${topCategory[0]} represents ${((topCategory[1] / totalSpent) * 100).toFixed(1)}% of your spending. Consider balancing expenses across categories.`,
      savings: `$${(topCategory[1] * 0.2).toFixed(0)}`,
      effort: 'Medium' as const,
      category: topCategory[0]
    });
  }

  // Payment method optimization
  const paymentMethods = transactions.reduce((acc, t) => {
    acc[t.paymentMethod] = (acc[t.paymentMethod] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const cashSpending = paymentMethods['Cash'] || 0;
  const cardSpending = (paymentMethods['Credit Card'] || 0) + (paymentMethods['Debit Card'] || 0);

  if (cashSpending > totalSpent * 0.3) {
    recommendations.push({
      title: "Consider Card Rewards",
      description: `${((cashSpending / totalSpent) * 100).toFixed(1)}% of spending is cash. Using rewards credit cards could earn cashback or points.`,
      savings: `$${(cashSpending * 0.02).toFixed(0)}`,
      effort: 'Low' as const
    });
  }

  return recommendations.slice(0, 3);
};
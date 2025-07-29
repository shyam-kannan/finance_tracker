import { Transaction, Insight, SpendingPattern } from '../types';

export const generateInsights = (transactions: Transaction[]): Insight[] => {
  const insights: Insight[] = [];
  
  if (transactions.length === 0) {
    return insights;
  }
  
  // Get current month transactions
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const currentMonthTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  // Get last month transactions for comparison
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const lastMonthTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
  });

  // Analyze spending patterns
  const categorySpending = currentMonthTransactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const totalSpending = Object.values(categorySpending).reduce((sum, amount) => sum + amount, 0);
  const lastMonthTotal = lastMonthTransactions.reduce((sum, t) => sum + t.amount, 0);

  // Monthly spending comparison
  if (lastMonthTotal > 0) {
    const monthlyChange = ((totalSpending - lastMonthTotal) / lastMonthTotal) * 100;
    if (Math.abs(monthlyChange) > 10) {
      insights.push({
        id: 'monthly-change',
        type: monthlyChange > 0 ? 'spending' : 'saving',
        title: `${monthlyChange > 0 ? 'Increased' : 'Decreased'} Monthly Spending`,
        description: `You've spent ${Math.abs(monthlyChange).toFixed(1)}% ${monthlyChange > 0 ? 'more' : 'less'} this month compared to last month ($${totalSpending.toFixed(2)} vs $${lastMonthTotal.toFixed(2)}).`,
        impact: Math.abs(monthlyChange) > 25 ? 'high' : 'medium'
      });
    }
  }

  // High spending category insight
  const topCategory = Object.entries(categorySpending)
    .sort(([, a], [, b]) => b - a)[0];
  
  if (topCategory && topCategory[1] > totalSpending * 0.25) {
    const percentage = (topCategory[1] / totalSpending) * 100;
    insights.push({
      id: 'top-category',
      type: 'spending',
      title: `High ${topCategory[0]} Spending`,
      description: `${topCategory[0]} accounts for ${percentage.toFixed(1)}% of your spending this month ($${topCategory[1].toFixed(2)}). Consider reviewing these expenses.`,
      impact: percentage > 40 ? 'high' : 'medium',
      category: topCategory[0]
    });
  }

  // Frequent vendor analysis
  const vendorCounts = currentMonthTransactions.reduce((acc, t) => {
    acc[t.vendor] = (acc[t.vendor] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const vendorSpending = currentMonthTransactions.reduce((acc, t) => {
    acc[t.vendor] = (acc[t.vendor] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const frequentVendors = Object.entries(vendorCounts)
    .filter(([, count]) => count >= 3)
    .sort(([, a], [, b]) => b - a);

  frequentVendors.forEach(([vendor, count]) => {
    const spending = vendorSpending[vendor];
    insights.push({
      id: `frequent-${vendor}`,
      type: 'recommendation',
      title: `Frequent ${vendor} Visits`,
      description: `You've visited ${vendor} ${count} times this month, spending $${spending.toFixed(2)}. Consider loyalty programs or bulk purchases for savings.`,
      impact: spending > 100 ? 'medium' : 'low'
    });
  });

  // Weekend spending pattern
  const weekendTransactions = currentMonthTransactions.filter(t => {
    const date = new Date(t.date);
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  });

  if (weekendTransactions.length > 0) {
    const weekendSpending = weekendTransactions.reduce((sum, t) => sum + t.amount, 0);
    const weekendPercentage = (weekendSpending / totalSpending) * 100;
    
    if (weekendPercentage > 35) {
      insights.push({
        id: 'weekend-spending',
        type: 'spending',
        title: 'High Weekend Spending',
        description: `${weekendPercentage.toFixed(1)}% of your spending ($${weekendSpending.toFixed(2)}) occurs on weekends. Consider meal prepping and planning weekend activities to reduce costs.`,
        impact: weekendPercentage > 50 ? 'high' : 'medium'
      });
    }
  }

  // Large transaction analysis
  const averageTransaction = totalSpending / currentMonthTransactions.length;
  const largeTransactions = currentMonthTransactions.filter(t => t.amount > averageTransaction * 3);
  
  if (largeTransactions.length > 0) {
    const largeTransactionTotal = largeTransactions.reduce((sum, t) => sum + t.amount, 0);
    insights.push({
      id: 'large-transactions',
      type: 'spending',
      title: 'Large Transactions Detected',
      description: `You have ${largeTransactions.length} transactions over $${(averageTransaction * 3).toFixed(2)}, totaling $${largeTransactionTotal.toFixed(2)}. Review these for potential savings.`,
      impact: largeTransactionTotal > totalSpending * 0.3 ? 'high' : 'medium'
    });
  }

  // Payment method analysis
  const paymentMethods = currentMonthTransactions.reduce((acc, t) => {
    acc[t.paymentMethod] = (acc[t.paymentMethod] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const creditCardSpending = paymentMethods['Credit Card'] || 0;
  if (creditCardSpending > totalSpending * 0.8) {
    insights.push({
      id: 'credit-card-usage',
      type: 'recommendation',
      title: 'High Credit Card Usage',
      description: `${((creditCardSpending / totalSpending) * 100).toFixed(1)}% of your spending is on credit cards. Ensure you're paying balances in full to avoid interest charges.`,
      impact: 'medium'
    });
  }

  // Category trend analysis
  if (lastMonthTransactions.length > 0) {
    const lastMonthCategorySpending = lastMonthTransactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    Object.entries(categorySpending).forEach(([category, currentAmount]) => {
      const lastAmount = lastMonthCategorySpending[category] || 0;
      if (lastAmount > 0) {
        const change = ((currentAmount - lastAmount) / lastAmount) * 100;
        if (Math.abs(change) > 30) {
          insights.push({
            id: `category-trend-${category}`,
            type: change > 0 ? 'spending' : 'saving',
            title: `${category} Spending ${change > 0 ? 'Increase' : 'Decrease'}`,
            description: `Your ${category} spending ${change > 0 ? 'increased' : 'decreased'} by ${Math.abs(change).toFixed(1)}% compared to last month ($${currentAmount.toFixed(2)} vs $${lastAmount.toFixed(2)}).`,
            impact: Math.abs(change) > 50 ? 'high' : 'medium',
            category
          });
        }
      }
    });
  }

  // Time-based spending patterns
  const morningTransactions = currentMonthTransactions.filter(t => {
    const hour = new Date(`${t.date}T12:00:00`).getHours();
    return hour >= 6 && hour < 12;
  });

  const eveningTransactions = currentMonthTransactions.filter(t => {
    const hour = new Date(`${t.date}T18:00:00`).getHours();
    return hour >= 18 && hour < 24;
  });

  if (eveningTransactions.length > currentMonthTransactions.length * 0.4) {
    const eveningSpending = eveningTransactions.reduce((sum, t) => sum + t.amount, 0);
    insights.push({
      id: 'evening-spending',
      type: 'spending',
      title: 'High Evening Spending',
      description: `${((eveningTransactions.length / currentMonthTransactions.length) * 100).toFixed(1)}% of your transactions occur in the evening, totaling $${eveningSpending.toFixed(2)}. Consider planning purchases during the day.`,
      impact: 'low'
    });
  }

  return insights.slice(0, 10); // Limit to top 10 insights
};

export const getSpendingPatterns = (transactions: Transaction[]): SpendingPattern[] => {
  if (transactions.length === 0) {
    return [];
  }
  
  // Get current month transactions
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const currentMonthTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  // Get last month for trend analysis
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const lastMonthTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
  });

  const categorySpending = currentMonthTransactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const lastMonthCategorySpending = lastMonthTransactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const totalSpending = Object.values(categorySpending).reduce((sum, amount) => sum + amount, 0);

  return Object.entries(categorySpending)
    .map(([category, amount]) => {
      const lastMonthAmount = lastMonthCategorySpending[category] || 0;
      let trend: 'up' | 'down' | 'stable' = 'stable';
      
      if (lastMonthAmount > 0) {
        const change = ((amount - lastMonthAmount) / lastMonthAmount) * 100;
        if (change > 10) trend = 'up';
        else if (change < -10) trend = 'down';
      } else if (amount > 0) {
        trend = 'up';
      }

      return {
        category,
        amount,
        percentage: totalSpending > 0 ? (amount / totalSpending) * 100 : 0,
        trend
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

  // Analyze subscription-like patterns
  const subscriptionVendors = ['Netflix', 'Spotify', 'Hulu', 'Disney+', 'Amazon Prime', 'Apple Music'];
  const subscriptions = transactions.filter(t => 
    subscriptionVendors.some(sub => t.vendor.toLowerCase().includes(sub.toLowerCase())) ||
    t.description.toLowerCase().includes('subscription') ||
    t.description.toLowerCase().includes('monthly')
  );

  if (subscriptions.length > 2) {
    const subscriptionTotal = subscriptions.reduce((sum, t) => sum + t.amount, 0);
    recommendations.push({
      title: "Optimize Subscription Spending",
      description: `You have ${subscriptions.length} subscription-like services. Consider consolidating or canceling unused ones.`,
      savings: `$${(subscriptionTotal * 0.3).toFixed(0)}/month`,
      effort: 'Low' as const
    });
  }

  // Food delivery analysis
  const deliveryVendors = transactions.filter(t => 
    ['uber eats', 'doordash', 'grubhub', 'postmates', 'delivery'].some(keyword => 
      t.vendor.toLowerCase().includes(keyword) || t.description.toLowerCase().includes(keyword)
    )
  );

  if (deliveryVendors.length > 5) {
    const deliveryTotal = deliveryVendors.reduce((sum, t) => sum + t.amount, 0);
    recommendations.push({
      title: "Reduce Food Delivery Costs",
      description: `You've used food delivery ${deliveryVendors.length} times. Cooking at home could save significantly.`,
      savings: `$${(deliveryTotal * 0.6).toFixed(0)}/month`,
      effort: 'Medium' as const,
      category: 'Food & Drink'
    });
  }

  // Coffee shop analysis
  const coffeeShops = transactions.filter(t => 
    ['starbucks', 'dunkin', 'coffee', 'cafe'].some(keyword => 
      t.vendor.toLowerCase().includes(keyword)
    )
  );

  if (coffeeShops.length > 8) {
    const coffeeTotal = coffeeShops.reduce((sum, t) => sum + t.amount, 0);
    recommendations.push({
      title: "Coffee Shop Alternative",
      description: `${coffeeShops.length} coffee shop visits detected. A home coffee setup could reduce costs.`,
      savings: `$${(coffeeTotal * 0.7).toFixed(0)}/month`,
      effort: 'Low' as const,
      category: 'Food & Drink'
    });
  }

  // Gas station frequency
  const gasStations = transactions.filter(t => 
    ['shell', 'exxon', 'chevron', 'bp', 'mobil', 'gas', 'fuel'].some(keyword => 
      t.vendor.toLowerCase().includes(keyword)
    )
  );

  if (gasStations.length > 8) {
    const gasTotal = gasStations.reduce((sum, t) => sum + t.amount, 0);
    recommendations.push({
      title: "Transportation Optimization",
      description: `Frequent gas purchases suggest high driving. Consider carpooling or public transit for regular commutes.`,
      savings: `$${(gasTotal * 0.25).toFixed(0)}/month`,
      effort: 'Medium' as const,
      category: 'Transportation'
    });
  }

  // Grocery shopping patterns
  const groceryStores = transactions.filter(t => 
    ['walmart', 'target', 'kroger', 'safeway', 'whole foods', 'costco', 'grocery'].some(keyword => 
      t.vendor.toLowerCase().includes(keyword) || t.category === 'Groceries'
    )
  );

  if (groceryStores.length > 12) {
    recommendations.push({
      title: "Bulk Purchase Opportunities",
      description: `${groceryStores.length} grocery trips suggest frequent shopping. Bulk buying and meal planning could reduce costs.`,
      savings: `$${(groceryStores.reduce((sum, t) => sum + t.amount, 0) * 0.15).toFixed(0)}/month`,
      effort: 'Medium' as const,
      category: 'Groceries'
    });
  }

  return recommendations.slice(0, 4);
};
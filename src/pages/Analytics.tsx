import React, { useState } from 'react';
import { Calendar, Filter } from 'lucide-react';
import { Transaction } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SpendingChart } from '../components/analytics/SpendingChart';
import { getSpendingPatterns } from '../services/aiService';

interface AnalyticsProps {
  transactions: Transaction[];
}

export const Analytics: React.FC<AnalyticsProps> = ({ transactions }) => {
  const [timeFilter, setTimeFilter] = useState('month');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Get spending patterns based on all transactions
  const spendingPatterns = getSpendingPatterns(transactions);
  
  // Filter transactions based on time period - if no recent transactions, show all
  const now = new Date();
  const filteredTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    
    switch (timeFilter) {
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return transactionDate >= weekAgo;
      case 'month':
        return transactionDate.getMonth() === now.getMonth() && 
               transactionDate.getFullYear() === now.getFullYear();
      case 'year':
        return transactionDate.getFullYear() === now.getFullYear();
      default:
        return true;
    }
  });

  const totalSpent = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  const avgTransaction = filteredTransactions.length > 0 ? totalSpent / filteredTransactions.length : 0;
  
  // Get top category from filtered transactions
  const categorySpending = filteredTransactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);
  
  const topCategoryEntry = Object.entries(categorySpending)
    .sort(([, a], [, b]) => b - a)[0];
  const topCategory = topCategoryEntry ? {
    category: topCategoryEntry[0],
    amount: topCategoryEntry[1],
    percentage: totalSpent > 0 ? (topCategoryEntry[1] / totalSpent) * 100 : 0
  } : null;
  
  // Vendor analysis
  const vendorSpending = filteredTransactions.reduce((acc, t) => {
    acc[t.vendor] = (acc[t.vendor] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);
  
  const topVendors = Object.entries(vendorSpending)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Monthly comparison
  
  // Check if we have any recent transactions (within last 2 years)
  const recentTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    const yearsAgo = (now.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    return yearsAgo <= 2;
  });
  
  // If no recent transactions, use all transactions for analysis
  const useAllTransactions = recentTransactions.length === 0;
  
  // Monthly comparison - adapt for historical data
  let monthlyChange = 0;
  
  if (useAllTransactions) {
    // For historical data, compare different periods within the data
    const allDates = transactions.map(t => new Date(t.date)).sort((a, b) => b.getTime() - a.getTime());
    if (allDates.length > 1) {
      const latestDate = allDates[0];
      const earliestDate = allDates[allDates.length - 1];
      const latestAmount = transactions.filter(t => new Date(t.date).getTime() === latestDate.getTime())[0]?.amount || 0;
      const earliestAmount = transactions.filter(t => new Date(t.date).getTime() === earliestDate.getTime())[0]?.amount || 0;
      
      if (earliestAmount > 0) {
        monthlyChange = ((latestAmount - earliestAmount) / earliestAmount) * 100;
      }
    }
  } else {
    // Standard monthly comparison for recent data
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    const currentMonthSpending = transactions
      .filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);
      
    const lastMonthSpending = transactions
      .filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);
    
    monthlyChange = lastMonthSpending > 0 
      ? ((currentMonthSpending - lastMonthSpending) / lastMonthSpending) * 100
      : 0;
  }
  
  // Update time filter labels for historical data
  const getTimeFilterLabel = () => {
    if (useAllTransactions) {
      switch (timeFilter) {
        case 'week':
        case 'month':
          return 'Recent Period';
        case 'year':
          return 'Most Recent Year';
        default:
          return 'All Time';
      }
    }
    
    switch (timeFilter) {
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case 'year': return 'This Year';
      default: return 'All Time';
    }
  };

  // Show message when no transactions exist
  if (transactions.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
            <p className="text-gray-600">Detailed insights into your spending patterns</p>
          </div>
        </div>
        
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Data to Analyze</h3>
            <p className="text-gray-600 mb-6">
              Upload receipts or add transactions to see detailed analytics and spending insights.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
          <p className="text-gray-600">Detailed insights into your spending patterns</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
          
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Total Spent</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              ${totalSpent.toFixed(2)}
            </p>
            <p className={`text-sm mt-2 ${monthlyChange >= 0 ? 'text-red-600' : 'text-green-600'}`}>
              {monthlyChange >= 0 ? '+' : ''}{monthlyChange.toFixed(1)}% vs last month
            </p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Transactions</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {filteredTransactions.length}
            </p>
            <p className="text-sm text-gray-500 mt-2">This {timeFilter}</p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Average Transaction</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              ${avgTransaction.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Per transaction
            </p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Top Category</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {topCategory ? topCategory.category : 'None'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {topCategory ? `${topCategory.percentage.toFixed(1)}% of spending` : 'No data'}
            </p>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingChart 
          data={spendingPatterns} 
          type="pie" 
          title="Spending Distribution" 
        />
        <SpendingChart 
          data={spendingPatterns} 
          type="bar" 
          title="Category Analysis" 
        />
      </div>
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Vendors</h3>
        <div className="space-y-3">
          {topVendors.map(([vendor, amount], index) => (
            <div key={vendor} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                </div>
                <span className="font-medium text-gray-900">{vendor}</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-gray-900">${amount.toFixed(2)}</span>
                <p className="text-xs text-gray-500">
                  {((amount / totalSpent) * 100).toFixed(1)}% of total
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Spending Trends */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Most Active Day</h4>
            <p className="text-blue-700">
              {filteredTransactions.length > 0 
                ? "Analysis based on your transaction patterns"
                : "Add more transactions to see patterns"
              }
            </p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Spending Pattern</h4>
            <p className="text-green-700">
              {filteredTransactions.length > 5
                ? "Your spending patterns are being analyzed"
                : "Need more data to identify patterns"
              }
            </p>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">Peak Hours</h4>
            <p className="text-yellow-700">
              {filteredTransactions.length > 10
                ? "Transaction timing patterns available"
                : "More transactions needed for timing analysis"
              }
            </p>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-2">Payment Method</h4>
            <p className="text-purple-700">
              {filteredTransactions.length > 0
                ? `${Math.round((filteredTransactions.filter(t => t.paymentMethod === 'Credit Card').length / filteredTransactions.length) * 100)}% credit card usage`
                : "No payment method data available"
              }
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
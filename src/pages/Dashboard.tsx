import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Target } from 'lucide-react';
import { Transaction, Budget } from '../types';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { SpendingChart } from '../components/analytics/SpendingChart';
import { getSpendingPatterns } from '../services/aiService';

interface DashboardProps {
  transactions: Transaction[];
  budgets: Budget[];
}

export const Dashboard: React.FC<DashboardProps> = ({ transactions, budgets }) => {
  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const averageTransaction = totalSpent / Math.max(transactions.length, 1);
  
  const spendingPatterns = getSpendingPatterns(transactions);
  const topSpendingCategory = spendingPatterns[0];
  
  const overBudgetCategories = budgets.filter(b => b.spent > b.limit);
  const nearBudgetCategories = budgets.filter(b => (b.spent / b.limit) > 0.8 && b.spent <= b.limit);

  const stats = [
    {
      title: 'Total Spent',
      value: `$${totalSpent.toFixed(2)}`,
      change: '+12.5%',
      trend: 'up' as const,
      icon: DollarSign,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      title: 'Budget Remaining',
      value: `$${(totalBudget - totalSpent).toFixed(2)}`,
      change: '-8.2%',
      trend: 'down' as const,
      icon: Target,
      color: 'text-green-600 bg-green-50'
    },
    {
      title: 'Avg Transaction',
      value: `$${averageTransaction.toFixed(2)}`,
      change: '+4.1%',
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'text-purple-600 bg-purple-50'
    },
    {
      title: 'Categories Over Budget',
      value: overBudgetCategories.length.toString(),
      change: overBudgetCategories.length === 0 ? 'Good!' : 'Review needed',
      trend: overBudgetCategories.length === 0 ? 'down' : 'up' as const,
      icon: TrendingDown,
      color: overBudgetCategories.length === 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {stat.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingChart 
          data={spendingPatterns} 
          type="pie" 
          title="Spending by Category" 
        />
        <SpendingChart 
          data={spendingPatterns} 
          type="bar" 
          title="Category Breakdown" 
        />
      </div>

      {/* Budget Overview */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Overview</h3>
        <div className="space-y-4">
          {budgets.slice(0, 5).map((budget) => (
            <div key={budget.id}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900">{budget.category}</span>
                <span className="text-sm text-gray-600">
                  ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                </span>
              </div>
              <ProgressBar
                value={budget.spent}
                max={budget.limit}
                color={budget.spent > budget.limit ? 'red' : budget.spent > budget.limit * 0.8 ? 'yellow' : 'green'}
                showPercentage={false}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Insights */}
      {(overBudgetCategories.length > 0 || nearBudgetCategories.length > 0) && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Insights</h3>
          <div className="space-y-3">
            {overBudgetCategories.map((budget) => (
              <div key={budget.id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-medium">
                  🚨 {budget.category} is over budget by ${(budget.spent - budget.limit).toFixed(2)}
                </p>
              </div>
            ))}
            {nearBudgetCategories.map((budget) => (
              <div key={budget.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 font-medium">
                  ⚠️ {budget.category} is at {((budget.spent / budget.limit) * 100).toFixed(1)}% of budget
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
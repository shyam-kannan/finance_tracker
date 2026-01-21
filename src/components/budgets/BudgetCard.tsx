import React from 'react';
import { Target, TrendingUp, TrendingDown } from 'lucide-react';
import { Budget } from '../../types';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';

interface BudgetCardProps {
  budget: Budget;
  onEdit: (budget: Budget) => void;
}

/**
 * BudgetCard component displays budget information in a card format
 * @param budget - Budget object containing category, spent amount, limit, and period
 * @param onEdit - Callback function triggered when the card is clicked for editing
 * @returns JSX element representing a budget card with progress visualization
 */
export const BudgetCard: React.FC<BudgetCardProps> = ({ budget, onEdit }) => {
  // Calculate percentage of budget spent
  const percentage = (budget.spent / budget.limit) * 100;
  // Calculate remaining budget amount
  const remaining = budget.limit - budget.spent;
  // Check if spending has exceeded the budget limit
  const isOverBudget = budget.spent > budget.limit;

  /**
   * Determines progress bar color based on spending percentage
   * @returns Color string for progress bar styling
   */
  const getProgressColor = () => {
    if (percentage <= 60) return 'green';
    if (percentage <= 85) return 'yellow';
    return 'red';
  };

  return (
    <Card hover className="cursor-pointer" onClick={() => onEdit(budget)}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{budget.category}</h3>
          <p className="text-sm text-gray-500 capitalize">
            {/* Add "Total" prefix for overall budget category */}
            {budget.category === 'Overall Budget' ? 'Total ' : ''}{budget.period} Budget
          </p>
        </div>
        <div className="p-2 bg-blue-50 rounded-lg">
          <Target className="w-5 h-5 text-blue-600" />
        </div>
      </div>

      <div className="space-y-4">
        {/* Display spent amount and budget limit */}
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-gray-900">
            ${budget.spent.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500">
            of ${budget.limit.toFixed(2)}
          </span>
        </div>

        {/* Progress bar showing budget utilization */}
        <ProgressBar
          value={budget.spent}
          max={budget.limit}
          color={getProgressColor()}
          size="lg"
          showPercentage={false}
        />

        <div className="flex items-center justify-between text-sm">
          {/* Show over-budget or remaining amount with appropriate styling */}
          {isOverBudget ? (
            <div className="flex items-center space-x-1 text-red-600">
              <TrendingUp className="w-4 h-4" />
              <span className="font-medium">
                Over by ${(budget.spent - budget.limit).toFixed(2)}
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-1 text-green-600">
              <TrendingDown className="w-4 h-4" />
              <span className="font-medium">
                ${remaining.toFixed(2)} remaining
              </span>
            </div>
          )}
          
          {/* Display percentage with color based on budget status */}
          <span className={`font-medium ${isOverBudget ? 'text-red-600' : 'text-gray-600'}`}>
            {percentage.toFixed(1)}%
          </span>
        </div>

        {/* Warning message when spending exceeds 80% of budget */}
        {percentage > 80 && (
          <div className={`p-2 rounded-lg text-xs ${
            isOverBudget ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'
          }`}>
            {isOverBudget 
              ? '⚠️ Budget exceeded! Consider reviewing your spending.'
              : '⚠️ Approaching budget limit. Monitor your spending carefully.'
            }
          </div>
        )}
      </div>
    </Card>
  );
};
import React from 'react';
import { Target, TrendingUp, TrendingDown } from 'lucide-react';
import { Budget } from '../../types';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';

interface BudgetCardProps {
  budget: Budget;
  onEdit: (budget: Budget) => void;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({ budget, onEdit }) => {
  const percentage = (budget.spent / budget.limit) * 100;
  const remaining = budget.limit - budget.spent;
  const isOverBudget = budget.spent > budget.limit;

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
          <p className="text-sm text-gray-500 capitalize">{budget.period} Budget</p>
        </div>
        <div className="p-2 bg-blue-50 rounded-lg">
          <Target className="w-5 h-5 text-blue-600" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-gray-900">
            ${budget.spent.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500">
            of ${budget.limit.toFixed(2)}
          </span>
        </div>

        <ProgressBar
          value={budget.spent}
          max={budget.limit}
          color={getProgressColor()}
          size="lg"
          showPercentage={false}
        />

        <div className="flex items-center justify-between text-sm">
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
          
          <span className={`font-medium ${isOverBudget ? 'text-red-600' : 'text-gray-600'}`}>
            {percentage.toFixed(1)}%
          </span>
        </div>

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
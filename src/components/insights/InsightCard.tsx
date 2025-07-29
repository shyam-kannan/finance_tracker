import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Lightbulb } from 'lucide-react';
import { Insight } from '../../types';
import { Card } from '../ui/Card';

interface InsightCardProps {
  insight: Insight;
}

export const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
  const getIcon = () => {
    switch (insight.type) {
      case 'spending':
        return <TrendingUp className="w-5 h-5" />;
      case 'saving':
        return <TrendingDown className="w-5 h-5" />;
      case 'recommendation':
        return <Lightbulb className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getColor = () => {
    switch (insight.impact) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getBorderColor = () => {
    switch (insight.impact) {
      case 'high':
        return 'border-red-200';
      case 'medium':
        return 'border-yellow-200';
      case 'low':
        return 'border-blue-200';
      default:
        return 'border-gray-200';
    }
  };

  return (
    <Card className={`border-l-4 ${getBorderColor()}`}>
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-lg ${getColor()}`}>
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{insight.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getColor()}`}>
              {insight.impact.toUpperCase()} IMPACT
            </span>
          </div>
          
          <p className="text-gray-600 leading-relaxed">{insight.description}</p>
          
          {insight.category && (
            <div className="mt-3">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {insight.category}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
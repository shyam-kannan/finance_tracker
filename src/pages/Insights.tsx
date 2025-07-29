import React from 'react';
import { Brain, TrendingUp, AlertTriangle } from 'lucide-react';
import { Transaction } from '../types';
import { Card } from '../components/ui/Card';
import { InsightCard } from '../components/insights/InsightCard';
import { generateInsights } from '../services/aiService';

interface InsightsProps {
  transactions: Transaction[];
}

export const Insights: React.FC<InsightsProps> = ({ transactions }) => {
  const insights = generateInsights(transactions);
  
  const highImpactInsights = insights.filter(i => i.impact === 'high');
  const mediumImpactInsights = insights.filter(i => i.impact === 'medium');
  const lowImpactInsights = insights.filter(i => i.impact === 'low');

  const recommendations = [
    {
      title: "Optimize Subscription Spending",
      description: "You have multiple streaming services. Consider consolidating to save $15-30/month.",
      savings: "$25/month",
      effort: "Low"
    },
    {
      title: "Meal Planning Strategy",
      description: "Weekend food spending is 40% higher. Weekly meal prep could reduce costs by 25%.",
      savings: "$120/month",
      effort: "Medium"
    },
    {
      title: "Transportation Optimization",
      description: "Consider carpooling or public transit for daily commutes to reduce fuel costs.",
      savings: "$80/month",
      effort: "Medium"
    },
    {
      title: "Bulk Purchase Opportunities",
      description: "Frequent grocery trips indicate potential for bulk buying savings.",
      savings: "$45/month",
      effort: "Low"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Insights</h2>
          <p className="text-gray-600">Personalized recommendations based on your spending patterns</p>
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-lg">
          <Brain className="w-5 h-5 text-blue-600" />
          <span className="text-blue-800 font-medium">AI-Powered</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-gray-900">{highImpactInsights.length}</p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Medium Priority</p>
              <p className="text-2xl font-bold text-gray-900">{mediumImpactInsights.length}</p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Brain className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Insights</p>
              <p className="text-2xl font-bold text-gray-900">{insights.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* High Impact Insights */}
      {highImpactInsights.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🚨 High Priority Insights</h3>
          <div className="space-y-4">
            {highImpactInsights.map(insight => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </div>
      )}

      {/* AI Recommendations */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 AI Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900">{rec.title}</h4>
                <span className="text-green-600 font-bold text-sm">{rec.savings}</span>
              </div>
              <p className="text-gray-600 text-sm mb-3">{rec.description}</p>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  rec.effort === 'Low' 
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {rec.effort} Effort
                </span>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Learn More →
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* All Insights */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">All Insights</h3>
        <div className="space-y-4">
          {[...mediumImpactInsights, ...lowImpactInsights].map(insight => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
        
        {insights.length === 0 && (
          <Card className="text-center py-12">
            <Brain className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No insights yet</h3>
            <p className="text-gray-600">
              Add more transactions to get personalized AI insights and recommendations.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};
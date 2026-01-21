import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { SpendingPattern } from '../../types';
import { Card } from '../ui/Card';

interface SpendingChartProps {
  data: SpendingPattern[];
  type: 'pie' | 'bar';
  title: string;
}

// Color palette for chart elements - cycles through when there are more categories than colors
const COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
  '#8B5CF6', '#EC4899', '#6B7280', '#14B8A6'
];

/**
 * SpendingChart component that renders spending data as either a pie chart or bar chart
 * @param data - Array of spending patterns containing category and amount data
 * @param type - Chart type, either 'pie' or 'bar'
 * @param title - Title to display above the chart
 * @returns JSX element containing the rendered chart
 */
export const SpendingChart: React.FC<SpendingChartProps> = ({ data, type, title }) => {
  /**
   * Custom label renderer for pie chart slices
   * @param cx, cy - Center coordinates of the pie chart
   * @param midAngle - Middle angle of the pie slice
   * @param innerRadius, outerRadius - Inner and outer radius of the pie slice
   * @param percent - Percentage value of the slice
   * @returns JSX element for the label or null if slice is too small
   */
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null; // Don't show labels for slices smaller than 5%
    
    const RADIAN = Math.PI / 180;
    // Calculate label position at the middle of the slice
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-sm font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'pie' ? (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
              >
                {/* Apply colors to each pie slice */}
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
                labelFormatter={(label) => `Category: ${label}`}
              />
            </PieChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="category" 
                angle={-45} // Rotate labels to prevent overlap
                textAnchor="end"
                interval={0} // Show all category labels
                height={80}
              />
              <YAxis tickFormatter={(value) => `$${value}`} />
              <Tooltip 
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
                labelFormatter={(label) => `Category: ${label}`}
              />
              <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
      
      {/* Legend for pie chart showing category names with corresponding colors */}
      {type === 'pie' && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {data.map((entry, index) => (
            <div key={entry.category} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-sm text-gray-600 truncate">
                {entry.category}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
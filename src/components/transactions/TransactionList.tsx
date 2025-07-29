import React, { useState } from 'react';
import { Edit, Trash2, Calendar, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { Transaction, Category } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { categories } from '../../data/mockData';

interface TransactionListProps {
  transactions: Transaction[];
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onEditTransaction,
  onDeleteTransaction
}) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category?.color || '#64748B';
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.category === filter;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'amount':
        return b.amount - a.amount;
      case 'vendor':
        return a.vendor.localeCompare(b.vendor);
      default:
        return 0;
    }
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
            <option value="vendor">Sort by Vendor</option>
          </select>
        </div>
        
        <div className="text-sm text-gray-600">
          {sortedTransactions.length} transactions
        </div>
      </div>

      <div className="space-y-3">
        {sortedTransactions.map((transaction) => (
          <Card key={transaction.id} className="hover:shadow-md transition-shadow" padding="none">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div
                    className="w-3 h-12 rounded-full flex-shrink-0"
                    style={{ backgroundColor: getCategoryColor(transaction.category) }}
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {transaction.vendor}
                      </h3>
                      <span className="text-xl font-bold text-gray-900">
                        ${transaction.amount.toFixed(2)}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 truncate mb-2">{transaction.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(transaction.date), 'MMM dd, yyyy')}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <CreditCard className="w-4 h-4" />
                        <span>{transaction.paymentMethod}</span>
                      </div>
                      
                      <span
                        className="px-2 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: getCategoryColor(transaction.category) }}
                      >
                        {transaction.category}
                      </span>
                      
                      {transaction.isManuallyAdjusted && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                          Manually Adjusted
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditTransaction(transaction)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteTransaction(transaction.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
        
        {sortedTransactions.length === 0 && (
          <Card className="text-center py-12">
            <div className="text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No transactions found</h3>
              <p>Upload a receipt or add a transaction manually to get started.</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
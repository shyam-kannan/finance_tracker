import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Budget } from '../types';
import { Button } from '../components/ui/Button';
import { BudgetCard } from '../components/budgets/BudgetCard';
import { BudgetForm } from '../components/budgets/BudgetForm';

interface BudgetsProps {
  budgets: Budget[];
  onAddBudget: (budget: Partial<Budget>) => void;
  onEditBudget: (budget: Budget) => void;
}

export const Budgets: React.FC<BudgetsProps> = ({
  budgets,
  onAddBudget,
  onEditBudget
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (budgetData: Partial<Budget>) => {
    if (editingBudget) {
      onEditBudget({ ...editingBudget, ...budgetData });
    } else {
      onAddBudget(budgetData);
    }
    setIsFormOpen(false);
    setEditingBudget(null);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingBudget(null);
  };

  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const overBudgetCount = budgets.filter(b => b.spent > b.limit).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Budgets</h2>
          <p className="text-gray-600">Set and track your spending limits</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Budget
        </Button>
      </div>

      {/* Budget Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Total Budget</h3>
          <p className="text-3xl font-bold">${totalBudget.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Total Spent</h3>
          <p className="text-3xl font-bold">${totalSpent.toFixed(2)}</p>
        </div>
        <div className={`rounded-xl p-6 text-white ${
          overBudgetCount > 0 
            ? 'bg-gradient-to-r from-red-500 to-red-600' 
            : 'bg-gradient-to-r from-gray-500 to-gray-600'
        }`}>
          <h3 className="text-lg font-semibold mb-2">Over Budget</h3>
          <p className="text-3xl font-bold">{overBudgetCount}</p>
        </div>
      </div>

      {/* Budget Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget) => (
          <BudgetCard
            key={budget.id}
            budget={budget}
            onEdit={handleEditBudget}
          />
        ))}
        
        {budgets.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-500">
              <Plus className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No budgets yet</h3>
              <p>Create your first budget to start tracking your spending limits.</p>
            </div>
          </div>
        )}
      </div>

      <BudgetForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        budget={editingBudget}
      />
    </div>
  );
};
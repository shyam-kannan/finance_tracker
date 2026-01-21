import React, { useState, useEffect } from 'react';
import { Budget } from '../../types';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { categories } from '../../data/mockData';

interface BudgetFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (budget: Partial<Budget>) => void;
  budget?: Budget | null;
}

/**
 * BudgetForm component for creating and editing budget entries
 * @param isOpen - Controls whether the modal is visible
 * @param onClose - Callback function to close the modal
 * @param onSubmit - Callback function to handle form submission with budget data
 * @param budget - Optional existing budget data for editing (null/undefined for creating new)
 */
export const BudgetForm: React.FC<BudgetFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  budget
}) => {
  // Initialize form state with default budget structure
  const [formData, setFormData] = useState<Partial<Budget>>({
    category: '',
    limit: 0,
    period: 'monthly',
    spent: 0
  });

  // Populate form with existing budget data when editing, or reset to defaults when creating new
  useEffect(() => {
    if (budget) {
      setFormData(budget);
    } else {
      setFormData({
        category: '',
        limit: 0,
        period: 'monthly',
        spent: 0
      });
    }
  }, [budget]);

  /**
   * Handle form submission
   * @param e - Form event to prevent default browser submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  /**
   * Handle input field changes and update form state
   * @param e - Change event from input or select elements
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      // Parse limit field as float, all other fields as strings
      [name]: name === 'limit' ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={budget ? 'Edit Budget' : 'Create Budget'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select Category</option>
            <option value="Overall Budget">Overall Budget (All Categories)</option>
            {/* Dynamically populate category options from mock data */}
            {categories.map(category => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget Limit *
            </label>
            <input
              type="number"
              name="limit"
              value={formData.limit}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Period
            </label>
            <select
              name="period"
              value={formData.period}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>

        {/* Informational tips section for user guidance */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Budget Tips</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Set realistic budgets based on your historical spending</li>
            <li>• Leave some room for unexpected expenses</li>
            <li>• Review and adjust your budgets monthly</li>
          </ul>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {budget ? 'Update Budget' : 'Create Budget'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
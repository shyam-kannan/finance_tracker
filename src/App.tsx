import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useSettings } from './hooks/useSettings';
import { AuthForm } from './components/auth/AuthForm';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { Budgets } from './pages/Budgets';
import { Analytics } from './pages/Analytics';
import { Insights } from './pages/Insights';
import { Settings } from './pages/Settings';
import { Transaction, Budget } from './types';
import { mockTransactions, mockBudgets } from './data/mockData';

// Main App component - serves as the root component managing authentication, navigation, and data state
function App() {
  const { user, loading, login, register, logout } = useAuth();
  const { settings } = useSettings();
  const [activeTab, setActiveTab] = useState('dashboard'); // Current active navigation tab
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions); // All transactions data
  const [budgets, setBudgets] = useState<Budget[]>(mockBudgets); // All budget data

  // Handles adding a new transaction and updating related budget spending
  // @param transactionData - Partial transaction data from form input
  const handleAddTransaction = (transactionData: Partial<Transaction>) => {
    // Create new transaction with generated ID and default values
    const newTransaction: Transaction = {
      id: Date.now().toString(), // Generate unique ID using timestamp
      date: transactionData.date || new Date().toISOString().split('T')[0],
      vendor: transactionData.vendor || '',
      amount: transactionData.amount || 0,
      category: transactionData.category || 'Other',
      description: transactionData.description || '',
      paymentMethod: transactionData.paymentMethod || 'Credit Card',
      receiptUrl: transactionData.receiptUrl,
      isManuallyAdjusted: transactionData.isManuallyAdjusted || false
    };
    
    // Add new transaction to the beginning of the array
    setTransactions(prev => [newTransaction, ...prev]);
    
    // Update budget spending for matching categories and overall budget
    setBudgets(prev => prev.map(budget => 
      budget.category === newTransaction.category || budget.category === 'Overall Budget'
        ? { ...budget, spent: budget.spent + newTransaction.amount }
        : budget
    ));
  };

  // Handles editing an existing transaction and adjusting budget spending accordingly
  // @param updatedTransaction - The updated transaction object
  const handleEditTransaction = (updatedTransaction: Transaction) => {
    const oldTransaction = transactions.find(t => t.id === updatedTransaction.id);
    
    // Update the transaction in the array
    setTransactions(prev => prev.map(t => 
      t.id === updatedTransaction.id ? updatedTransaction : t
    ));
    
    // Adjust budget spending by removing old amount and adding new amount
    if (oldTransaction) {
      setBudgets(prev => prev.map(budget => {
        // Remove old transaction amount from previous category
        if (budget.category === oldTransaction.category || budget.category === 'Overall Budget') {
          const newSpent = budget.spent - oldTransaction.amount;
          return { ...budget, spent: Math.max(0, newSpent) }; // Ensure spent doesn't go below 0
        }
        // Add new transaction amount to new category
        if (budget.category === updatedTransaction.category || budget.category === 'Overall Budget') {
          return { ...budget, spent: budget.spent + updatedTransaction.amount };
        }
        return budget;
      }));
    }
  };

  // Handles deleting a transaction and reducing budget spending
  // @param id - The ID of the transaction to delete
  const handleDeleteTransaction = (id: string) => {
    const transaction = transactions.find(t => t.id === id);
    if (transaction) {
      // Remove transaction from array
      setTransactions(prev => prev.filter(t => t.id !== id));
      
      // Reduce budget spending for the transaction's category
      setBudgets(prev => prev.map(budget => 
        budget.category === transaction.category || budget.category === 'Overall Budget'
          ? { ...budget, spent: Math.max(0, budget.spent - transaction.amount) } // Ensure spent doesn't go below 0
          : budget
      ));
    }
  };

  // Handles adding a new budget
  // @param budgetData - Partial budget data from form input
  const handleAddBudget = (budgetData: Partial<Budget>) => {
    // Create new budget with generated ID and default values
    const newBudget: Budget = {
      id: Date.now().toString(), // Generate unique ID using timestamp
      category: budgetData.category || '',
      limit: budgetData.limit || 0,
      spent: budgetData.spent || 0,
      period: budgetData.period || 'monthly'
    };
    
    setBudgets(prev => [...prev, newBudget]);
  };

  // Handles editing an existing budget
  // @param updatedBudget - The updated budget object
  const handleEditBudget = (updatedBudget: Budget) => {
    setBudgets(prev => prev.map(b => 
      b.id === updatedBudget.id ? updatedBudget : b
    ));
  };

  // Returns the display title for the current active tab
  // @returns string - The formatted page title
  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard';
      case 'transactions': return 'Transactions';
      case 'budgets': return 'Budgets';
      case 'analytics': return 'Analytics';
      case 'insights': return 'AI Insights';
      case 'settings': return 'Settings';
      default: return 'Dashboard';
    }
  };

  // Renders the appropriate page component based on active tab
  // @returns JSX.Element - The component for the current active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard transactions={transactions} budgets={budgets} />;
      case 'transactions':
        return (
          <Transactions
            transactions={transactions}
            onAddTransaction={handleAddTransaction}
            onEditTransaction={handleEditTransaction}
            onDeleteTransaction={handleDeleteTransaction}
          />
        );
      case 'budgets':
        return (
          <Budgets
            budgets={budgets}
            onAddBudget={handleAddBudget}
            onEditBudget={handleEditBudget}
          />
        );
      case 'analytics':
        return <Analytics transactions={transactions} />;
      case 'insights':
        return <Insights transactions={transactions} />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard transactions={transactions} budgets={budgets} />;
    }
  };

  // Show loading spinner while authentication is being checked
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show authentication form if user is not logged in
  if (!user) {
    return <AuthForm onLogin={login} onRegister={register} />;
  }

  // Main app layout with sidebar and content area
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onLogout={logout} 
      />
      
      <div className="flex-1 flex flex-col">
        <Header 
          user={user} 
          title={getPageTitle()} 
          transactions={transactions}
          budgets={budgets}
        />
        
        <main className="flex-1 p-6 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
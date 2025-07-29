import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { AuthForm } from './components/auth/AuthForm';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { Budgets } from './pages/Budgets';
import { Analytics } from './pages/Analytics';
import { Insights } from './pages/Insights';
import { Transaction, Budget } from './types';
import { mockTransactions, mockBudgets } from './data/mockData';

function App() {
  const { user, loading, login, register, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [budgets, setBudgets] = useState<Budget[]>(mockBudgets);

  const handleAddTransaction = (transactionData: Partial<Transaction>) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      date: transactionData.date || new Date().toISOString().split('T')[0],
      vendor: transactionData.vendor || '',
      amount: transactionData.amount || 0,
      category: transactionData.category || 'Other',
      description: transactionData.description || '',
      paymentMethod: transactionData.paymentMethod || 'Credit Card',
      receiptUrl: transactionData.receiptUrl,
      isManuallyAdjusted: transactionData.isManuallyAdjusted || false
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    
    // Update budget spending
    setBudgets(prev => prev.map(budget => 
      budget.category === newTransaction.category || budget.category === 'Overall Budget'
        ? { ...budget, spent: budget.spent + newTransaction.amount }
        : budget
    ));
  };

  const handleEditTransaction = (updatedTransaction: Transaction) => {
    const oldTransaction = transactions.find(t => t.id === updatedTransaction.id);
    
    setTransactions(prev => prev.map(t => 
      t.id === updatedTransaction.id ? updatedTransaction : t
    ));
    
    // Update budget spending
    if (oldTransaction) {
      setBudgets(prev => prev.map(budget => {
        if (budget.category === oldTransaction.category || budget.category === 'Overall Budget') {
          const newSpent = budget.spent - oldTransaction.amount;
          return { ...budget, spent: Math.max(0, newSpent) };
        }
        if (budget.category === updatedTransaction.category || budget.category === 'Overall Budget') {
          return { ...budget, spent: budget.spent + updatedTransaction.amount };
        }
        return budget;
      }));
    }
  };

  const handleDeleteTransaction = (id: string) => {
    const transaction = transactions.find(t => t.id === id);
    if (transaction) {
      setTransactions(prev => prev.filter(t => t.id !== id));
      
      // Update budget spending
      setBudgets(prev => prev.map(budget => 
        budget.category === transaction.category || budget.category === 'Overall Budget'
          ? { ...budget, spent: Math.max(0, budget.spent - transaction.amount) }
          : budget
      ));
    }
  };

  const handleAddBudget = (budgetData: Partial<Budget>) => {
    const newBudget: Budget = {
      id: Date.now().toString(),
      category: budgetData.category || '',
      limit: budgetData.limit || 0,
      spent: budgetData.spent || 0,
      period: budgetData.period || 'monthly'
    };
    
    setBudgets(prev => [...prev, newBudget]);
  };

  const handleEditBudget = (updatedBudget: Budget) => {
    setBudgets(prev => prev.map(b => 
      b.id === updatedBudget.id ? updatedBudget : b
    ));
  };

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
        return (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Settings</h3>
            <p className="text-gray-600">Settings panel coming soon...</p>
          </div>
        );
      default:
        return <Dashboard transactions={transactions} budgets={budgets} />;
    }
  };

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

  if (!user) {
    return <AuthForm onLogin={login} onRegister={register} />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onLogout={logout} 
      />
      
      <div className="flex-1 flex flex-col">
        <Header user={user} title={getPageTitle()} />
        
        <main className="flex-1 p-6 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
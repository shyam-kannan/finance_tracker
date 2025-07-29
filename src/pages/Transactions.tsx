import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Transaction } from '../types';
import { Button } from '../components/ui/Button';
import { ReceiptUpload } from '../components/receipts/ReceiptUpload';
import { TransactionList } from '../components/transactions/TransactionList';
import { TransactionForm } from '../components/transactions/TransactionForm';

interface TransactionsProps {
  transactions: Transaction[];
  onAddTransaction: (transaction: Partial<Transaction>) => void;
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

export const Transactions: React.FC<TransactionsProps> = ({
  transactions,
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [pendingTransaction, setPendingTransaction] = useState<Partial<Transaction> | null>(null);

  const handleReceiptProcessed = (processedTransaction: Partial<Transaction>) => {
    setPendingTransaction(processedTransaction);
    setIsFormOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (transactionData: Partial<Transaction>) => {
    if (editingTransaction) {
      onEditTransaction({ ...editingTransaction, ...transactionData });
    } else {
      onAddTransaction(transactionData);
    }
    setIsFormOpen(false);
    setEditingTransaction(null);
    setPendingTransaction(null);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingTransaction(null);
    setPendingTransaction(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Transactions</h2>
          <p className="text-gray-600">Manage your expenses and income</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      <ReceiptUpload onTransactionProcessed={handleReceiptProcessed} />

      <TransactionList
        transactions={transactions}
        onEditTransaction={handleEditTransaction}
        onDeleteTransaction={onDeleteTransaction}
      />

      <TransactionForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        transaction={editingTransaction}
        initialData={pendingTransaction}
      />
    </div>
  );
};
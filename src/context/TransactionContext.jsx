import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateId } from '../utils/helpers';

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Load transactions from localStorage on mount
    useEffect(() => {
        setIsLoading(true);
        try {
            const savedTransactions = localStorage.getItem('financeTracker-transactions');
            if (savedTransactions) {
                setTransactions(JSON.parse(savedTransactions));
            }
        } catch (err) {
            setError('Failed to load transactions');
            console.error('Error loading transactions:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Save transactions to localStorage when they change
    useEffect(() => {
        try {
            localStorage.setItem('financeTracker-transactions', JSON.stringify(transactions));
        } catch (err) {
            setError('Failed to save transactions');
            console.error('Error saving transactions:', err);
        }
    }, [transactions]);

    const addTransaction = async (transactionData) => {
        setIsLoading(true);
        setError(null);

        try {
            const newTransaction = {
                ...transactionData,
                id: generateId(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            setTransactions(prev => [newTransaction, ...prev]);
            return newTransaction;
        } catch (err) {
            setError('Failed to add transaction');
            console.error('Error adding transaction:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const updateTransaction = async (id, updates) => {
        setIsLoading(true);
        setError(null);

        try {
            const updatedTransaction = {
                ...updates,
                id,
                updatedAt: new Date().toISOString(),
            };

            setTransactions(prev =>
                prev.map(transaction =>
                    transaction.id === id
                        ? { ...transaction, ...updatedTransaction }
                        : transaction
                )
            );

            return updatedTransaction;
        } catch (err) {
            setError('Failed to update transaction');
            console.error('Error updating transaction:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteTransaction = async (id) => {
        setIsLoading(true);
        setError(null);

        try {
            setTransactions(prev => prev.filter(transaction => transaction.id !== id));
            return true;
        } catch (err) {
            setError('Failed to delete transaction');
            console.error('Error deleting transaction:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const getTransactionById = (id) => {
        return transactions.find(transaction => transaction.id === id);
    };

    const getTransactionsByType = (type) => {
        return transactions.filter(transaction => transaction.type === type);
    };

    const getTransactionsByCategory = (categoryId) => {
        return transactions.filter(transaction => transaction.category === categoryId);
    };

    const getTransactionsByDateRange = (startDate, endDate) => {
        return transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return transactionDate >= start && transactionDate <= end;
        });
    };

    const clearAllTransactions = async () => {
        setIsLoading(true);
        setError(null);

        try {
            setTransactions([]);
            localStorage.removeItem('financeTracker-transactions');
            return true;
        } catch (err) {
            setError('Failed to clear transactions');
            console.error('Error clearing transactions:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const importTransactions = async (transactionsData) => {
        setIsLoading(true);
        setError(null);

        try {
            const importedTransactions = transactionsData.map(transaction => ({
                ...transaction,
                id: transaction.id || generateId(),
                createdAt: transaction.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }));

            setTransactions(prev => [...importedTransactions, ...prev]);
            return importedTransactions;
        } catch (err) {
            setError('Failed to import transactions');
            console.error('Error importing transactions:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const value = {
        transactions,
        isLoading,
        error,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        getTransactionById,
        getTransactionsByType,
        getTransactionsByCategory,
        getTransactionsByDateRange,
        clearAllTransactions,
        importTransactions,
        setError,
    };

    return (
        <TransactionContext.Provider value={value}>
            {children}
        </TransactionContext.Provider>
    );
};

export const useTransactions = () => {
    const context = useContext(TransactionContext);
    if (!context) {
        throw new Error('useTransactions must be used within TransactionProvider');
    }
    return context;
};
import { useState, useEffect, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { generateId } from '../utils/helpers';

export const useTransactions = () => {
    const [transactions, setTransactions] = useLocalStorage('financeTracker-transactions', []);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Add a new transaction
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
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Update an existing transaction
    const updateTransaction = async (id, updates) => {
        setIsLoading(true);
        setError(null);

        try {
            setTransactions(prev =>
                prev.map(transaction =>
                    transaction.id === id
                        ? { ...transaction, ...updates, updatedAt: new Date().toISOString() }
                        : transaction
                )
            );
        } catch (err) {
            setError('Failed to update transaction');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Delete a transaction
    const deleteTransaction = async (id) => {
        setIsLoading(true);
        setError(null);

        try {
            setTransactions(prev => prev.filter(transaction => transaction.id !== id));
        } catch (err) {
            setError('Failed to delete transaction');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Get transaction by ID
    const getTransactionById = (id) => {
        return transactions.find(transaction => transaction.id === id);
    };

    // Get transactions by type
    const getTransactionsByType = (type) => {
        return transactions.filter(transaction => transaction.type === type);
    };

    // Get transactions by category
    const getTransactionsByCategory = (categoryId) => {
        return transactions.filter(transaction => transaction.category === categoryId);
    };

    // Get transactions by date range
    const getTransactionsByDateRange = (startDate, endDate) => {
        return transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return transactionDate >= start && transactionDate <= end;
        });
    };

    // Search transactions
    const searchTransactions = (query) => {
        if (!query) return transactions;

        const lowercaseQuery = query.toLowerCase();
        return transactions.filter(transaction =>
            transaction.description.toLowerCase().includes(lowercaseQuery) ||
            transaction.category.toLowerCase().includes(lowercaseQuery)
        );
    };

    // Clear all transactions
    const clearAllTransactions = () => {
        setTransactions([]);
    };

    // Import transactions
    const importTransactions = (transactionsData) => {
        const importedTransactions = transactionsData.map(transaction => ({
            ...transaction,
            id: transaction.id || generateId(),
            createdAt: transaction.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }));

        setTransactions(prev => [...importedTransactions, ...prev]);
        return importedTransactions;
    };

    // Calculate financial summary
    const summary = useMemo(() => {
        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const expenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        return {
            income,
            expenses,
            balance: income - expenses,
            totalTransactions: transactions.length,
        };
    }, [transactions]);

    // Get recent transactions
    const getRecentTransactions = (limit = 10) => {
        return transactions
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, limit);
    };

    return {
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
        searchTransactions,
        clearAllTransactions,
        importTransactions,
        summary,
        getRecentTransactions,
        setError,
    };
};
import React, { createContext, useContext, useState, useEffect } from 'react';
import { defaultCategories } from '../data/defaultCategories';
import { generateId } from '../utils/helpers';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState(defaultCategories);
    const [filters, setFilters] = useState({
        type: 'all',
        category: 'all',
        dateFrom: '',
        dateTo: '',
        search: '',
    });

    // Load data from localStorage on mount
    useEffect(() => {
        console.log('Loading data from localStorage...');
        const savedTransactions = localStorage.getItem('financeTracker-transactions');
        const savedCategories = localStorage.getItem('financeTracker-categories');

        if (savedTransactions) {
            try {
                const parsed = JSON.parse(savedTransactions);
                console.log('Loaded transactions:', parsed.length, 'items');
                setTransactions(parsed);
            } catch (error) {
                console.error('Error parsing saved transactions:', error);
            }
        } else {
            console.log('No saved transactions found');
        }

        if (savedCategories) {
            try {
                const parsed = JSON.parse(savedCategories);
                console.log('Loaded categories:', parsed);
                setCategories(parsed);
            } catch (error) {
                console.error('Error parsing saved categories:', error);
            }
        } else {
            console.log('No saved categories found, using defaults');
        }
    }, []);

    // Save to localStorage when data changes
    useEffect(() => {
        localStorage.setItem('financeTracker-transactions', JSON.stringify(transactions));
    }, [transactions]);

    useEffect(() => {
        localStorage.setItem('financeTracker-categories', JSON.stringify(categories));
    }, [categories]);

    const addTransaction = (transaction) => {
        console.log('AppContext: Adding transaction:', transaction);

        const newTransaction = {
            ...transaction,
            id: generateId(),
            createdAt: new Date().toISOString(),
        };

        console.log('AppContext: New transaction with ID:', newTransaction);

        // Update state immediately
        setTransactions(prev => {
            const updated = [newTransaction, ...prev];

            // Save to localStorage
            try {
                localStorage.setItem('financeTracker-transactions', JSON.stringify(updated));
                console.log('AppContext: Saved to localStorage successfully');
            } catch (error) {
                console.error('AppContext: localStorage save failed:', error);
            }

            return updated;
        });

        console.log('AppContext: Transaction added successfully');
        return newTransaction;
    };

    const updateTransaction = async (id, updates) => {
        try {
            console.log('AppContext: Updating transaction:', id, updates);

            setTransactions(prev => {
                const updated = prev.map(transaction =>
                    transaction.id === id ? { ...transaction, ...updates } : transaction
                );
                // Force save to localStorage
                try {
                    localStorage.setItem('financeTracker-transactions', JSON.stringify(updated));
                    console.log('AppContext: Transactions updated in localStorage');
                } catch (error) {
                    console.error('AppContext: Failed to update localStorage:', error);
                    throw new Error('Failed to save updated transaction');
                }
                return updated;
            });

            console.log('AppContext: Transaction updated successfully');
        } catch (error) {
            console.error('AppContext: Error in updateTransaction:', error);
            throw error;
        }
    };

    const deleteTransaction = async (id) => {
        try {
            console.log('AppContext: Deleting transaction:', id);

            setTransactions(prev => {
                const updated = prev.filter(transaction => transaction.id !== id);
                // Force save to localStorage
                try {
                    localStorage.setItem('financeTracker-transactions', JSON.stringify(updated));
                    console.log('AppContext: Transaction deleted from localStorage');
                } catch (error) {
                    console.error('AppContext: Failed to delete from localStorage:', error);
                    throw new Error('Failed to delete transaction');
                }
                return updated;
            });

            console.log('AppContext: Transaction deleted successfully');
        } catch (error) {
            console.error('AppContext: Error in deleteTransaction:', error);
            throw error;
        }
    };

    const getFilteredTransactions = () => {
        return transactions.filter(transaction => {
            const matchesType = filters.type === 'all' || transaction.type === filters.type;
            const matchesCategory = filters.category === 'all' || transaction.category === filters.category;
            const matchesSearch = !filters.search ||
                transaction.description.toLowerCase().includes(filters.search.toLowerCase());

            let matchesDate = true;
            if (filters.dateFrom) {
                matchesDate = matchesDate && new Date(transaction.date) >= new Date(filters.dateFrom);
            }
            if (filters.dateTo) {
                matchesDate = matchesDate && new Date(transaction.date) <= new Date(filters.dateTo);
            }

            return matchesType && matchesCategory && matchesSearch && matchesDate;
        });
    };

    const getFinancialSummary = () => {
        const filteredTransactions = getFilteredTransactions();
        const income = filteredTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        const expenses = filteredTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        return {
            income,
            expenses,
            balance: income - expenses,
            totalTransactions: filteredTransactions.length,
        };
    };

    const value = {
        transactions,
        categories,
        filters,
        setFilters,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        getFilteredTransactions,
        getFinancialSummary,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
};
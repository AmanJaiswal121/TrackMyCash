import { useState, useMemo } from 'react';
import { getDateRange } from '../utils/dateHelpers';

export const useFilters = (transactions) => {
    const [filters, setFilters] = useState({
        type: 'all',
        category: 'all',
        dateFrom: '',
        dateTo: '',
        search: '',
        amountMin: '',
        amountMax: '',
        sortBy: 'date',
        sortOrder: 'desc',
    });

    // Apply filters to transactions
    const filteredTransactions = useMemo(() => {
        return transactions.filter(transaction => {
            // Type filter
            if (filters.type !== 'all' && transaction.type !== filters.type) {
                return false;
            }

            // Category filter
            if (filters.category !== 'all' && transaction.category !== filters.category) {
                return false;
            }

            // Date range filter
            if (filters.dateFrom) {
                const transactionDate = new Date(transaction.date);
                const fromDate = new Date(filters.dateFrom);
                if (transactionDate < fromDate) return false;
            }

            if (filters.dateTo) {
                const transactionDate = new Date(transaction.date);
                const toDate = new Date(filters.dateTo);
                if (transactionDate > toDate) return false;
            }

            // Search filter
            if (filters.search) {
                const searchTerm = filters.search.toLowerCase();
                const matchesDescription = transaction.description.toLowerCase().includes(searchTerm);
                const matchesAmount = transaction.amount.toString().includes(searchTerm);
                if (!matchesDescription && !matchesAmount) return false;
            }

            // Amount range filter
            if (filters.amountMin && transaction.amount < parseFloat(filters.amountMin)) {
                return false;
            }

            if (filters.amountMax && transaction.amount > parseFloat(filters.amountMax)) {
                return false;
            }

            return true;
        }).sort((a, b) => {
            let comparison = 0;

            switch (filters.sortBy) {
                case 'date':
                    comparison = new Date(a.date) - new Date(b.date);
                    break;
                case 'amount':
                    comparison = a.amount - b.amount;
                    break;
                case 'description':
                    comparison = a.description.localeCompare(b.description);
                    break;
                case 'category':
                    comparison = a.category.localeCompare(b.category);
                    break;
                case 'type':
                    comparison = a.type.localeCompare(b.type);
                    break;
                default:
                    comparison = new Date(a.createdAt) - new Date(b.createdAt);
            }

            return filters.sortOrder === 'desc' ? -comparison : comparison;
        });
    }, [transactions, filters]);

    // Update a single filter
    const updateFilter = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    // Update multiple filters at once
    const updateFilters = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    // Clear all filters
    const clearFilters = () => {
        setFilters({
            type: 'all',
            category: 'all',
            dateFrom: '',
            dateTo: '',
            search: '',
            amountMin: '',
            amountMax: '',
            sortBy: 'date',
            sortOrder: 'desc',
        });
    };

    // Set predefined date ranges
    const setDateRange = (period) => {
        const range = getDateRange(period);
        updateFilters({
            dateFrom: range.start,
            dateTo: range.end,
        });
    };

    // Check if any filters are active
    const hasActiveFilters = useMemo(() => {
        return (
            filters.type !== 'all' ||
            filters.category !== 'all' ||
            filters.dateFrom !== '' ||
            filters.dateTo !== '' ||
            filters.search !== '' ||
            filters.amountMin !== '' ||
            filters.amountMax !== ''
        );
    }, [filters]);

    // Get filter summary
    const getFilterSummary = () => {
        const activeFilters = [];

        if (filters.type !== 'all') {
            activeFilters.push(`Type: ${filters.type}`);
        }

        if (filters.category !== 'all') {
            activeFilters.push(`Category: ${filters.category}`);
        }

        if (filters.dateFrom || filters.dateTo) {
            let dateFilter = 'Date: ';
            if (filters.dateFrom && filters.dateTo) {
                dateFilter += `${filters.dateFrom} to ${filters.dateTo}`;
            } else if (filters.dateFrom) {
                dateFilter += `from ${filters.dateFrom}`;
            } else {
                dateFilter += `until ${filters.dateTo}`;
            }
            activeFilters.push(dateFilter);
        }

        if (filters.search) {
            activeFilters.push(`Search: "${filters.search}"`);
        }

        if (filters.amountMin || filters.amountMax) {
            let amountFilter = 'Amount: ';
            if (filters.amountMin && filters.amountMax) {
                amountFilter += `$${filters.amountMin} - $${filters.amountMax}`;
            } else if (filters.amountMin) {
                amountFilter += `≥ $${filters.amountMin}`;
            } else {
                amountFilter += `≤ $${filters.amountMax}`;
            }
            activeFilters.push(amountFilter);
        }

        return activeFilters;
    };

    // Quick filter presets
    const quickFilters = {
        thisWeek: () => setDateRange('week'),
        thisMonth: () => setDateRange('month'),
        thisQuarter: () => setDateRange('quarter'),
        thisYear: () => setDateRange('year'),
        incomeOnly: () => updateFilter('type', 'income'),
        expensesOnly: () => updateFilter('type', 'expense'),
        highAmounts: () => updateFilter('amountMin', '100'),
        recent: () => {
            updateFilters({
                sortBy: 'date',
                sortOrder: 'desc',
            });
        },
    };

    return {
        filters,
        filteredTransactions,
        updateFilter,
        updateFilters,
        clearFilters,
        setDateRange,
        hasActiveFilters,
        getFilterSummary,
        quickFilters,
    };
};
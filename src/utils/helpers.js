// Helper utility functions

// ID generation
export const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Currency formatting
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};

// Date formatting
export const formatDate = (date, options = {}) => {
    const defaultOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    };

    const formatOptions = { ...defaultOptions, ...options };
    return new Date(date).toLocaleDateString('en-IN', formatOptions);
};

export const formatDateInput = (date) => {
    return new Date(date).toISOString().split('T')[0];
};

// Validation functions
export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const validateAmount = (amount) => {
    const num = parseFloat(amount);
    return !isNaN(num) && num >= 1 && num <= 99999999;
};

// Category helper functions
export const getCategoryName = (categoryId, categories, type) => {
    const categoryList = categories[type] || [];
    const category = categoryList.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
};

export const getCategoryColor = (categoryId, categories, type) => {
    const categoryList = categories[type] || [];
    const category = categoryList.find(cat => cat.id === categoryId);
    return category ? category.color : 'bg-gray-500';
};

// Transaction grouping and analysis
export const groupTransactionsByCategory = (transactions) => {
    return transactions.reduce((acc, transaction) => {
        const category = transaction.category;
        if (!acc[category]) {
            acc[category] = {
                transactions: [],
                total: 0,
                count: 0,
            };
        }
        acc[category].transactions.push(transaction);
        acc[category].total += transaction.amount;
        acc[category].count += 1;
        return acc;
    }, {});
};

export const groupTransactionsByDate = (transactions, groupBy = 'month') => {
    const groups = {};

    transactions.forEach(transaction => {
        const date = new Date(transaction.date);
        let key;

        switch (groupBy) {
            case 'day':
                key = formatDateInput(date);
                break;
            case 'week':
                const weekStart = new Date(date);
                weekStart.setDate(date.getDate() - date.getDay());
                key = formatDateInput(weekStart);
                break;
            case 'month':
                key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                break;
            case 'year':
                key = date.getFullYear().toString();
                break;
            default:
                key = formatDateInput(date);
        }

        if (!groups[key]) {
            groups[key] = {
                date: key,
                transactions: [],
                income: 0,
                expenses: 0,
                net: 0,
            };
        }

        groups[key].transactions.push(transaction);

        if (transaction.type === 'income') {
            groups[key].income += transaction.amount;
        } else {
            groups[key].expenses += transaction.amount;
        }

        groups[key].net = groups[key].income - groups[key].expenses;
    });

    return Object.values(groups).sort((a, b) => a.date.localeCompare(b.date));
};

// Sorting functions
export const sortTransactionsByDate = (transactions, ascending = false) => {
    return [...transactions].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return ascending ? dateA - dateB : dateB - dateA;
    });
};

export const sortTransactionsByAmount = (transactions, ascending = false) => {
    return [...transactions].sort((a, b) => {
        return ascending ? a.amount - b.amount : b.amount - a.amount;
    });
};

// Calculation helpers
export const calculatePercentage = (value, total) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
};

export const calculateSum = (transactions, type = null) => {
    return transactions
        .filter(t => type ? t.type === type : true)
        .reduce((sum, t) => sum + t.amount, 0);
};

export const calculateAverage = (transactions, type = null) => {
    const filtered = transactions.filter(t => type ? t.type === type : true);
    if (filtered.length === 0) return 0;
    return calculateSum(filtered) / filtered.length;
};

// Date range helpers
export const getDateRange = (period) => {
    const today = new Date();
    const startDate = new Date();

    switch (period) {
        case 'week':
            startDate.setDate(today.getDate() - 7);
            break;
        case 'month':
            startDate.setMonth(today.getMonth() - 1);
            break;
        case 'quarter':
            startDate.setMonth(today.getMonth() - 3);
            break;
        case 'year':
            startDate.setFullYear(today.getFullYear() - 1);
            break;
        case 'ytd': // Year to date
            startDate.setMonth(0, 1); // January 1st
            break;
        default:
            startDate.setDate(today.getDate() - 30);
    }

    return {
        start: formatDateInput(startDate),
        end: formatDateInput(today),
    };
};

export const isDateInRange = (date, startDate, endDate) => {
    const checkDate = new Date(date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && checkDate < start) return false;
    if (end && checkDate > end) return false;

    return true;
};

// Search and filter helpers
export const searchTransactions = (transactions, query) => {
    if (!query) return transactions;

    const lowercaseQuery = query.toLowerCase();
    return transactions.filter(transaction =>
        transaction.description.toLowerCase().includes(lowercaseQuery) ||
        transaction.amount.toString().includes(lowercaseQuery)
    );
};

export const filterTransactionsByType = (transactions, type) => {
    if (type === 'all') return transactions;
    return transactions.filter(t => t.type === type);
};

export const filterTransactionsByCategory = (transactions, categoryId) => {
    if (categoryId === 'all') return transactions;
    return transactions.filter(t => t.category === categoryId);
};

// Text helpers
export const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

export const capitalizeFirst = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const slugify = (text) => {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

// Array helpers
export const groupBy = (array, keyFn) => {
    return array.reduce((groups, item) => {
        const key = keyFn(item);
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(item);
        return groups;
    }, {});
};

export const sortBy = (array, keyFn, ascending = true) => {
    return [...array].sort((a, b) => {
        const aVal = keyFn(a);
        const bVal = keyFn(b);

        if (aVal < bVal) return ascending ? -1 : 1;
        if (aVal > bVal) return ascending ? 1 : -1;
        return 0;
    });
};

export const uniqueBy = (array, keyFn) => {
    const seen = new Set();
    return array.filter(item => {
        const key = keyFn(item);
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
};

// Number helpers
export const roundToDecimals = (number, decimals = 2) => {
    return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

export const formatNumber = (number, decimals = 2) => {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(number);
};

export const formatCompactNumber = (number) => {
    return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        compactDisplay: 'short',
    }).format(number);
};

// Object helpers
export const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => deepClone(item));

    const cloned = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            cloned[key] = deepClone(obj[key]);
        }
    }
    return cloned;
};

export const isEmpty = (obj) => {
    if (obj == null) return true;
    if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
    return Object.keys(obj).length === 0;
};

// Local storage helpers
export const safeJsonParse = (str, defaultValue = null) => {
    try {
        return JSON.parse(str);
    } catch {
        return defaultValue;
    }
};

export const safeJsonStringify = (obj, defaultValue = '{}') => {
    try {
        return JSON.stringify(obj);
    } catch {
        return defaultValue;
    }
};

// Debounce helper
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Theme helpers
export const getSystemTheme = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Export helpers
export const downloadFile = (content, filename, type = 'text/plain') => {
    const blob = new Blob([content], { type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};
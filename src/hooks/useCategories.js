import { useLocalStorage } from './useLocalStorage';
import { defaultCategories } from '../data/defaultCategories';
import { generateId } from '../utils/helpers';

export const useCategories = () => {
    const [categories, setCategories] = useLocalStorage('financeTracker-categories', defaultCategories);

    // Add a new category
    const addCategory = (categoryData) => {
        const newCategory = {
            ...categoryData,
            id: categoryData.id || generateId(),
        };

        setCategories(prev => ({
            ...prev,
            [categoryData.type]: [...prev[categoryData.type], newCategory]
        }));

        return newCategory;
    };

    // Update an existing category
    const updateCategory = (categoryId, type, updates) => {
        setCategories(prev => ({
            ...prev,
            [type]: prev[type].map(cat =>
                cat.id === categoryId ? { ...cat, ...updates } : cat
            )
        }));
    };

    // Delete a category
    const deleteCategory = (categoryId, type) => {
        setCategories(prev => ({
            ...prev,
            [type]: prev[type].filter(cat => cat.id !== categoryId)
        }));
    };

    // Get category by ID and type
    const getCategoryById = (categoryId, type) => {
        const categoryList = categories[type] || [];
        return categoryList.find(cat => cat.id === categoryId);
    };

    // Get category name
    const getCategoryName = (categoryId, type) => {
        const category = getCategoryById(categoryId, type);
        return category ? category.name : 'Unknown';
    };

    // Get category color
    const getCategoryColor = (categoryId, type) => {
        const category = getCategoryById(categoryId, type);
        return category ? category.color : 'bg-gray-500';
    };

    // Get all categories (flattened)
    const getAllCategories = () => {
        return [
            ...categories.income.map(cat => ({ ...cat, type: 'income' })),
            ...categories.expense.map(cat => ({ ...cat, type: 'expense' }))
        ];
    };

    // Get categories by type
    const getCategoriesByType = (type) => {
        return categories[type] || [];
    };

    // Check if category exists
    const categoryExists = (name, type) => {
        const categoryList = categories[type] || [];
        return categoryList.some(cat => cat.name.toLowerCase() === name.toLowerCase());
    };

    // Reset categories to default
    const resetCategories = () => {
        setCategories(defaultCategories);
    };

    // Import categories
    const importCategories = (categoriesData) => {
        setCategories(categoriesData);
    };

    // Export categories
    const exportCategories = () => {
        return categories;
    };

    // Search categories
    const searchCategories = (query, type = null) => {
        const lowercaseQuery = query.toLowerCase();

        if (type) {
            return categories[type].filter(cat =>
                cat.name.toLowerCase().includes(lowercaseQuery)
            );
        }

        return getAllCategories().filter(cat =>
            cat.name.toLowerCase().includes(lowercaseQuery)
        );
    };

    // Get category usage statistics (requires transactions)
    const getCategoryStats = (transactions) => {
        const stats = {};

        transactions.forEach(transaction => {
            const key = `${transaction.type}-${transaction.category}`;
            if (!stats[key]) {
                stats[key] = {
                    categoryId: transaction.category,
                    type: transaction.type,
                    count: 0,
                    total: 0,
                    name: getCategoryName(transaction.category, transaction.type),
                    color: getCategoryColor(transaction.category, transaction.type),
                };
            }
            stats[key].count++;
            stats[key].total += transaction.amount;
        });

        return Object.values(stats);
    };

    return {
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        getCategoryById,
        getCategoryName,
        getCategoryColor,
        getAllCategories,
        getCategoriesByType,
        categoryExists,
        resetCategories,
        importCategories,
        exportCategories,
        searchCategories,
        getCategoryStats,
        setCategories,
    };
};
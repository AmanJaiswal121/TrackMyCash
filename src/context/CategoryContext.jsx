import React, { createContext, useContext, useState, useEffect } from 'react';
import { defaultCategories } from '../data/defaultCategories';

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
    const [categories, setCategories] = useState(defaultCategories);

    // Load categories from localStorage on mount
    useEffect(() => {
        const savedCategories = localStorage.getItem('financeTracker-categories');
        if (savedCategories) {
            setCategories(JSON.parse(savedCategories));
        }
    }, []);

    // Save categories to localStorage when they change
    useEffect(() => {
        localStorage.setItem('financeTracker-categories', JSON.stringify(categories));
    }, [categories]);

    const addCategory = (category) => {
        setCategories(prev => ({
            ...prev,
            [category.type]: [...prev[category.type], category]
        }));
    };

    const updateCategory = (categoryId, type, updates) => {
        setCategories(prev => ({
            ...prev,
            [type]: prev[type].map(cat =>
                cat.id === categoryId ? { ...cat, ...updates } : cat
            )
        }));
    };

    const deleteCategory = (categoryId, type) => {
        setCategories(prev => ({
            ...prev,
            [type]: prev[type].filter(cat => cat.id !== categoryId)
        }));
    };

    const getCategoryById = (categoryId, type) => {
        const categoryList = categories[type] || [];
        return categoryList.find(cat => cat.id === categoryId);
    };

    const getAllCategories = () => {
        return [
            ...categories.income.map(cat => ({ ...cat, type: 'income' })),
            ...categories.expense.map(cat => ({ ...cat, type: 'expense' }))
        ];
    };

    const value = {
        categories,
        setCategories,
        addCategory,
        updateCategory,
        deleteCategory,
        getCategoryById,
        getAllCategories,
    };

    return (
        <CategoryContext.Provider value={value}>
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategories = () => {
    const context = useContext(CategoryContext);
    if (!context) {
        throw new Error('useCategories must be used within CategoryProvider');
    }
    return context;
};
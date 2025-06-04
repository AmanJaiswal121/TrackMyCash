import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { validateAmount, generateId } from '../../utils/helpers';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';

const TransactionForm = ({ transaction, onSubmit, onCancel }) => {
    const { categories, setCategories } = useApp();
    const [formData, setFormData] = useState({
        type: 'expense',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        ...transaction,
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [customCategoryName, setCustomCategoryName] = useState('');

    useEffect(() => {
        if (transaction) {
            setFormData({
                type: 'expense',
                amount: '',
                category: '',
                description: '',
                date: new Date().toISOString().split('T')[0],
                ...transaction,
            });
            setShowCustomInput(false);
            setCustomCategoryName('');
        }
    }, [transaction]);

    const createCustomCategory = () => {
        if (!customCategoryName.trim()) {
            setErrors({ customCategory: 'Please enter a category name' });
            return null;
        }

        const newCategory = {
            id: `custom-${formData.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: customCategoryName.trim(),
            color: 'bg-gray-500'
        };

        console.log('Creating custom category:', newCategory);

        // Update categories immediately
        const updatedCategories = {
            ...categories,
            [formData.type]: [...categories[formData.type], newCategory]
        };

        console.log('Updated categories:', updatedCategories);

        // Update state
        setCategories(updatedCategories);

        // Save to localStorage immediately
        try {
            localStorage.setItem('financeTracker-categories', JSON.stringify(updatedCategories));
            console.log('Categories saved to localStorage');
        } catch (error) {
            console.error('Failed to save categories:', error);
        }

        return newCategory.id;
    };

    const handleSubmit = () => {
        console.log('=== STARTING FORM SUBMISSION ===');
        setIsSubmitting(true);
        setErrors({});

        // Basic validation
        const newErrors = {};

        if (!formData.amount || !validateAmount(formData.amount)) {
            newErrors.amount = 'Please enter a valid amount (₹1 or more)';
        }

        if (!formData.date) {
            newErrors.date = 'Please select a date';
        }

        // Category validation
        let finalCategoryId = formData.category;

        if (showCustomInput) {
            if (!customCategoryName.trim()) {
                newErrors.customCategory = 'Please enter a category name';
            } else {
                // Create custom category
                finalCategoryId = createCustomCategory();
                if (!finalCategoryId) {
                    newErrors.customCategory = 'Failed to create custom category';
                }
            }
        } else {
            if (!formData.category) {
                newErrors.category = 'Please select a category';
            }
        }

        if (Object.keys(newErrors).length > 0) {
            console.log('Validation failed:', newErrors);
            setErrors(newErrors);
            setIsSubmitting(false);
            return;
        }

        // Create transaction data
        const transactionData = {
            type: formData.type,
            amount: parseInt(formData.amount), // Convert to integer for INR
            category: finalCategoryId,
            description: formData.description.trim() || 'No details available',
            date: formData.date,
        };

        console.log('Final transaction data:', transactionData);

        try {
            // Submit transaction
            onSubmit(transactionData);

            console.log('Transaction submitted successfully');

            // Reset form only if adding new transaction
            if (!transaction) {
                setFormData({
                    type: 'expense',
                    amount: '',
                    category: '',
                    description: '',
                    date: new Date().toISOString().split('T')[0],
                });
                setShowCustomInput(false);
                setCustomCategoryName('');
            }

        } catch (error) {
            console.error('Failed to submit transaction:', error);
            setErrors({ submit: 'Failed to save transaction. Please try again.' });
        } finally {
            setIsSubmitting(false);
            console.log('=== FORM SUBMISSION COMPLETE ===');
        }
    };

    const handleTypeChange = (newType) => {
        setFormData(prev => ({ ...prev, type: newType, category: '' }));
        setShowCustomInput(false);
        setCustomCategoryName('');
        if (errors.category) {
            setErrors(prev => ({ ...prev, category: '' }));
        }
    };

    const handleCategoryChange = (value) => {
        console.log('Category changed to:', value);

        if (value === 'ADD_CUSTOM') {
            setShowCustomInput(true);
            setFormData(prev => ({ ...prev, category: '' }));
        } else {
            setShowCustomInput(false);
            setCustomCategoryName('');
            setFormData(prev => ({ ...prev, category: value }));
        }

        if (errors.category) {
            setErrors(prev => ({ ...prev, category: '' }));
        }
    };

    const cancelCustomCategory = () => {
        setShowCustomInput(false);
        setCustomCategoryName('');
        setFormData(prev => ({ ...prev, category: '' }));
    };

    const availableCategories = categories[formData.type] || [];

    return (
        <div className="space-y-4">
            {/* Type and Amount */}
            <div className="grid grid-cols-2 gap-4">
                <Select
                    label="Type"
                    value={formData.type}
                    onChange={(e) => handleTypeChange(e.target.value)}
                    options={[
                        { value: 'expense', label: 'Expense' },
                        { value: 'income', label: 'Income' },
                    ]}
                    required
                />
                <Input
                    label="Amount (₹)"
                    type="number"
                    step="1"
                    min="1"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    error={errors.amount}
                    placeholder="1000"
                    required
                />
            </div>

            {/* Category Selection */}
            {showCustomInput ? (
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Custom Category Name <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                        <Input
                            value={customCategoryName}
                            onChange={(e) => {
                                setCustomCategoryName(e.target.value);
                                if (errors.customCategory) {
                                    setErrors(prev => ({ ...prev, customCategory: '' }));
                                }
                            }}
                            error={errors.customCategory}
                            placeholder="Enter category name (e.g., Freelance, Medical)"
                            className="flex-1"
                        />
                        <Button variant="outline" onClick={cancelCustomCategory} type="button">
                            Cancel
                        </Button>
                    </div>
                    {customCategoryName.trim() && (
                        <div className="mt-2 flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                Preview: {customCategoryName.trim()}
                            </span>
                        </div>
                    )}
                </div>
            ) : (
                <Select
                    label="Category"
                    value={formData.category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    error={errors.category}
                    options={[
                        { value: '', label: 'Select a category' },
                        ...availableCategories.map(cat => ({ value: cat.id, label: cat.name })),
                        { value: 'ADD_CUSTOM', label: '+ Add Custom Category' }
                    ]}
                    required
                />
            )}

            {/* Description */}
            <Input
                label="Description (Optional)"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter description (optional)"
            />

            {/* Date */}
            <Input
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                error={errors.date}
                required
            />

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
                <Button
                    onClick={handleSubmit}
                    className="flex-1"
                    disabled={isSubmitting}
                >
                    <Save size={16} className="mr-2" />
                    {isSubmitting ? 'Saving...' : (transaction ? 'Update' : 'Add')} Transaction
                </Button>
                {onCancel && (
                    <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
                        Cancel
                    </Button>
                )}
            </div>

            {/* Error Display */}
            {errors.submit && (
                <div className="text-sm text-red-600 text-center p-2 bg-red-50 dark:bg-red-900/20 rounded">
                    {errors.submit}
                </div>
            )}
        </div>
    );
};

export default TransactionForm;
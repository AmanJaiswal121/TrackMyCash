import React, { useState } from 'react';
import { Save, Palette } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';

const CategoryForm = ({ category, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        type: 'expense',
        color: 'bg-blue-500',
        ...category,
    });

    const [errors, setErrors] = useState({});

    const colorOptions = [
        { value: 'bg-red-500', label: 'Red', color: 'bg-red-500' },
        { value: 'bg-blue-500', label: 'Blue', color: 'bg-blue-500' },
        { value: 'bg-green-500', label: 'Green', color: 'bg-green-500' },
        { value: 'bg-yellow-500', label: 'Yellow', color: 'bg-yellow-500' },
        { value: 'bg-purple-500', label: 'Purple', color: 'bg-purple-500' },
        { value: 'bg-pink-500', label: 'Pink', color: 'bg-pink-500' },
        { value: 'bg-indigo-500', label: 'Indigo', color: 'bg-indigo-500' },
        { value: 'bg-orange-500', label: 'Orange', color: 'bg-orange-500' },
        { value: 'bg-teal-500', label: 'Teal', color: 'bg-teal-500' },
        { value: 'bg-gray-500', label: 'Gray', color: 'bg-gray-500' },
    ];

    const handleSubmit = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Category name is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const categoryData = {
            ...formData,
            id: category?.id || `${formData.type}-${Date.now()}`,
            name: formData.name.trim(),
        };

        console.log('Submitting category:', categoryData);
        onSubmit(categoryData);

        if (!category) {
            setFormData({
                name: '',
                type: 'expense',
                color: 'bg-blue-500',
            });
        }
        setErrors({});
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <div className="space-y-4">
            <Input
                label="Category Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={errors.name}
                placeholder="Enter category name"
                required
            />

            <Select
                label="Type"
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                options={[
                    { value: 'expense', label: 'Expense' },
                    { value: 'income', label: 'Income' },
                ]}
                required
            />

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-5 gap-2">
                    {colorOptions.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => handleInputChange('color', option.value)}
                            className={`w-10 h-10 rounded-lg border-2 transition-all ${formData.color === option.value
                                    ? 'border-gray-900 scale-110'
                                    : 'border-gray-300 hover:border-gray-400'
                                } ${option.color}`}
                            title={option.label}
                        />
                    ))}
                </div>
            </div>

            <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <div className={`w-4 h-4 rounded-full ${formData.color}`} />
                <span className="text-sm text-gray-700">Preview: {formData.name || 'Category Name'}</span>
            </div>

            <div className="flex gap-3 pt-4">
                <Button onClick={handleSubmit} className="flex-1" disabled={!formData.name.trim()}>
                    <Save size={16} className="mr-2" />
                    {category ? 'Update Category' : 'Add Category'}
                </Button>
                {onCancel && (
                    <Button variant="secondary" onClick={onCancel}>
                        Cancel
                    </Button>
                )}
            </div>
        </div>
    );
};

export default CategoryForm;
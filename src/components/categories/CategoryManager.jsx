import React, { useState } from 'react';
import { PlusCircle, Tag } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Button from '../common/Button';
import Modal from '../common/Modal';
import CategoryList from './CategoryList';
import CategoryForm from './CategoryForm';

const CategoryManager = () => {
    const { categories, setCategories } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [selectedType, setSelectedType] = useState('expense');

    const handleAddCategory = (categoryData) => {
        console.log('Adding category:', categoryData);

        const newCategory = {
            ...categoryData,
            id: categoryData.id || `${categoryData.type}-${Date.now()}`,
        };

        console.log('New category with ID:', newCategory);

        setCategories(prev => {
            const updated = {
                ...prev,
                [categoryData.type]: [...prev[categoryData.type], newCategory]
            };
            console.log('Updated categories:', updated);
            return updated;
        });

        setIsModalOpen(false);
        console.log('Category added successfully');
    };

    const handleEditCategory = (category, type) => {
        setEditingCategory({ ...category, type });
        setSelectedType(type);
        setIsModalOpen(true);
    };

    const handleUpdateCategory = (categoryData) => {
        setCategories(prev => ({
            ...prev,
            [categoryData.type]: prev[categoryData.type].map(cat =>
                cat.id === categoryData.id ? categoryData : cat
            )
        }));

        setEditingCategory(null);
        setIsModalOpen(false);
        console.log('Category updated:', categoryData);
    };

    const handleDeleteCategory = (categoryId, type) => {
        setCategories(prev => ({
            ...prev,
            [type]: prev[type].filter(cat => cat.id !== categoryId)
        }));
        console.log('Category deleted:', categoryId);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
    };

    const openAddModal = (type) => {
        setSelectedType(type);
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
                    <p className="text-gray-600 mt-1">Manage your transaction categories</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Expense Categories */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                            <Tag size={20} className="mr-2 text-red-600" />
                            Expense Categories
                        </h2>
                        <Button
                            size="sm"
                            onClick={() => openAddModal('expense')}
                        >
                            <PlusCircle size={16} className="mr-1" />
                            Add Expense
                        </Button>
                    </div>
                    <CategoryList
                        categories={categories}
                        type="expense"
                        onEdit={handleEditCategory}
                        onDelete={handleDeleteCategory}
                    />
                </div>

                {/* Income Categories */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                            <Tag size={20} className="mr-2 text-green-600" />
                            Income Categories
                        </h2>
                        <Button
                            size="sm"
                            onClick={() => openAddModal('income')}
                        >
                            <PlusCircle size={16} className="mr-1" />
                            Add Income
                        </Button>
                    </div>
                    <CategoryList
                        categories={categories}
                        type="income"
                        onEdit={handleEditCategory}
                        onDelete={handleDeleteCategory}
                    />
                </div>
            </div>

            {/* Category Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={editingCategory ? `Edit ${editingCategory.type} Category` : `Add New ${selectedType} Category`}
            >
                <CategoryForm
                    category={editingCategory}
                    onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory}
                    onCancel={closeModal}
                />
            </Modal>
        </div>
    );
};

export default CategoryManager;
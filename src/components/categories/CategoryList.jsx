import React from 'react';
import { Edit2, Trash2, Tag } from 'lucide-react';
import Card from '../common/Card';

const CategoryList = ({ categories, type, onEdit, onDelete }) => {
    const categoryList = categories[type] || [];

    if (categoryList.length === 0) {
        return (
            <Card>
                <div className="text-center py-8">
                    <Tag size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No {type} categories yet
                    </h3>
                    <p className="text-gray-500">
                        Start by adding your first {type} category
                    </p>
                </div>
            </Card>
        );
    }

    const handleDelete = (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
            onDelete(categoryId, type);
        }
    };

    return (
        <Card padding="p-0">
            <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 capitalize">
                    {type} Categories ({categoryList.length})
                </h3>
            </div>

            <div className="divide-y divide-gray-200">
                {categoryList.map((category) => (
                    <div key={category.id} className="p-4 hover:bg-gray-50 transition-colors group">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className={`w-4 h-4 rounded-full ${category.color}`} />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {category.name}
                                    </p>
                                    <p className="text-xs text-gray-500 capitalize">
                                        {type} category
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => onEdit(category, type)}
                                    className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded hover:bg-blue-50"
                                    title="Edit category"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(category.id)}
                                    className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50"
                                    title="Delete category"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default CategoryList;
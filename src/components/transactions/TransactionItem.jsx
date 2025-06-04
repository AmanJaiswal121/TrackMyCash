import React, { useState } from 'react';
import { Edit2, Trash2, Check, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate, getCategoryName, getCategoryColor } from '../../utils/helpers';

const TransactionItem = ({ transaction, onEdit, onDelete }) => {
    const { categories, updateTransaction } = useApp();
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [editDescription, setEditDescription] = useState(transaction.description);

    const categoryName = getCategoryName(transaction.category, categories, transaction.type);
    const categoryColor = getCategoryColor(transaction.category, categories, transaction.type);

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            onDelete(transaction.id);
        }
    };

    const handleDescriptionEdit = () => {
        setIsEditingDescription(true);
        setEditDescription(transaction.description === 'No details available' ? '' : transaction.description);
    };

    const handleDescriptionSave = () => {
        const newDescription = editDescription.trim() || 'No details available';
        updateTransaction(transaction.id, { description: newDescription });
        setIsEditingDescription(false);
    };

    const handleDescriptionCancel = () => {
        setEditDescription(transaction.description);
        setIsEditingDescription(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleDescriptionSave();
        } else if (e.key === 'Escape') {
            handleDescriptionCancel();
        }
    };

    return (
        <div className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group">
            <div className="flex items-center space-x-4 flex-1 min-w-0">
                <div className={`w-3 h-3 rounded-full ${categoryColor} flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        {isEditingDescription ? (
                            <div className="flex items-center space-x-2 flex-1">
                                <input
                                    type="text"
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    placeholder="Enter description"
                                    autoFocus
                                />
                                <button
                                    onClick={handleDescriptionSave}
                                    className="text-green-600 hover:text-green-700 p-1 rounded hover:bg-green-50"
                                    title="Save"
                                >
                                    <Check size={14} />
                                </button>
                                <button
                                    onClick={handleDescriptionCancel}
                                    className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50"
                                    title="Cancel"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2 flex-1">
                                <p
                                    className={`text-sm font-medium truncate cursor-pointer hover:text-blue-600 transition-colors ${transaction.description === 'No details available'
                                            ? 'text-gray-400 dark:text-gray-500 italic'
                                            : 'text-gray-900 dark:text-gray-100'
                                        }`}
                                    onClick={handleDescriptionEdit}
                                    title="Click to edit description"
                                >
                                    {transaction.description}
                                </p>
                                {transaction.description === 'No details available' && (
                                    <button
                                        onClick={handleDescriptionEdit}
                                        className="text-blue-600 hover:text-blue-700 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Add description"
                                    >
                                        Add details
                                    </button>
                                )}
                            </div>
                        )}

                        {!isEditingDescription && (
                            <div className="flex items-center space-x-2 ml-4">
                                <span className={`text-sm font-semibold whitespace-nowrap ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400 space-x-4">
                        <span className="truncate">{categoryName}</span>
                        <span className="whitespace-nowrap">{formatDate(transaction.date)}</span>
                        <span className="capitalize text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-600">
                            {transaction.type}
                        </span>
                    </div>
                </div>
            </div>

            {!isEditingDescription && (
                <div className="flex items-center space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onEdit(transaction)}
                        className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900"
                        title="Edit transaction"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50 dark:hover:bg-red-900"
                        title="Delete transaction"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default TransactionItem;
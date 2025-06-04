import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Card from '../common/Card';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';

const TransactionFilters = () => {
    const { filters, setFilters, categories } = useApp();

    const allCategories = [
        ...categories.expense.map(cat => ({ ...cat, type: 'expense' })),
        ...categories.income.map(cat => ({ ...cat, type: 'income' }))
    ];

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const clearFilters = () => {
        setFilters({
            type: 'all',
            category: 'all',
            dateFrom: '',
            dateTo: '',
            search: '',
        });
    };

    const hasActiveFilters = Object.values(filters).some(value =>
        value !== 'all' && value !== ''
    );

    return (
        <Card className="mb-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <Filter size={20} className="text-gray-500" />
                    <h3 className="text-lg font-medium text-gray-900">Filters</h3>
                </div>
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-red-600 hover:text-red-700"
                    >
                        <X size={16} className="mr-1" />
                        Clear All
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Select
                    label="Type"
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    options={[
                        { value: 'all', label: 'All Types' },
                        { value: 'income', label: 'Income' },
                        { value: 'expense', label: 'Expense' },
                    ]}
                />

                <Select
                    label="Category"
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    options={[
                        { value: 'all', label: 'All Categories' },
                        ...allCategories.map(cat => ({
                            value: cat.id,
                            label: `${cat.name} (${cat.type})`
                        }))
                    ]}
                />

                <Input
                    label="From Date"
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                />

                <Input
                    label="To Date"
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                />

                <div className="relative">
                    <Input
                        label="Search"
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        placeholder="Search transactions..."
                    />
                    <Search size={16} className="absolute right-3 top-8 text-gray-400 pointer-events-none" />
                </div>
            </div>

            {hasActiveFilters && (
                <div className="mt-4 flex flex-wrap gap-2">
                    {filters.type !== 'all' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Type: {filters.type}
                            <button
                                onClick={() => handleFilterChange('type', 'all')}
                                className="ml-1 text-blue-600 hover:text-blue-800"
                            >
                                <X size={12} />
                            </button>
                        </span>
                    )}
                    {filters.category !== 'all' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Category: {allCategories.find(c => c.id === filters.category)?.name || filters.category}
                            <button
                                onClick={() => handleFilterChange('category', 'all')}
                                className="ml-1 text-green-600 hover:text-green-800"
                            >
                                <X size={12} />
                            </button>
                        </span>
                    )}
                    {filters.search && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Search: "{filters.search}"
                            <button
                                onClick={() => handleFilterChange('search', '')}
                                className="ml-1 text-purple-600 hover:text-purple-800"
                            >
                                <X size={12} />
                            </button>
                        </span>
                    )}
                    {filters.dateFrom && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            From: {filters.dateFrom}
                            <button
                                onClick={() => handleFilterChange('dateFrom', '')}
                                className="ml-1 text-orange-600 hover:text-orange-800"
                            >
                                <X size={12} />
                            </button>
                        </span>
                    )}
                    {filters.dateTo && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            To: {filters.dateTo}
                            <button
                                onClick={() => handleFilterChange('dateTo', '')}
                                className="ml-1 text-red-600 hover:text-red-800"
                            >
                                <X size={12} />
                            </button>
                        </span>
                    )}
                </div>
            )}
        </Card>
    );
};

export default TransactionFilters;
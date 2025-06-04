import React from 'react';
import { PieChart, BarChart3 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getCategoryName, getCategoryColor, formatCurrency, groupTransactionsByCategory } from '../../utils/helpers';

const CategoryBreakdown = ({ transactions }) => {
    const { categories } = useApp();

    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const incomeTransactions = transactions.filter(t => t.type === 'income');

    const groupedExpenses = groupTransactionsByCategory(expenseTransactions);
    const groupedIncome = groupTransactionsByCategory(incomeTransactions);

    const processData = (grouped, type) => {
        return Object.entries(grouped)
            .map(([categoryId, data]) => ({
                categoryId,
                category: getCategoryName(categoryId, categories, type),
                color: getCategoryColor(categoryId, categories, type),
                amount: data.total,
                count: data.count,
                percentage: 0
            }))
            .sort((a, b) => b.amount - a.amount);
    };

    const expenseData = processData(groupedExpenses, 'expense');
    const incomeData = processData(groupedIncome, 'income');

    const totalExpenses = expenseData.reduce((sum, item) => sum + item.amount, 0);
    const totalIncome = incomeData.reduce((sum, item) => sum + item.amount, 0);

    // Calculate percentages
    expenseData.forEach(item => {
        item.percentage = totalExpenses > 0 ? (item.amount / totalExpenses) * 100 : 0;
    });

    incomeData.forEach(item => {
        item.percentage = totalIncome > 0 ? (item.amount / totalIncome) * 100 : 0;
    });

    const CategoryPieChart = ({ data, total, type }) => {
        if (data.length === 0) {
            return (
                <div className="text-center py-8">
                    <PieChart size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">No {type} categories</p>
                </div>
            );
        }

        // Create a simple text-based pie chart representation
        return (
            <div className="space-y-3">
                {data.slice(0, 6).map((item, index) => (
                    <div key={item.categoryId} className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full ${item.color}`} />
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium text-gray-900">{item.category}</span>
                                <span className="text-sm font-semibold text-gray-700">
                                    {formatCurrency(item.amount)}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all duration-300 ${type === 'expense' ? 'bg-red-500' : 'bg-green-500'
                                        }`}
                                    style={{ width: `${item.percentage}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>{item.percentage.toFixed(1)}%</span>
                                <span>{item.count} transactions</span>
                            </div>
                        </div>
                    </div>
                ))}

                {data.length > 6 && (
                    <div className="text-center pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                            +{data.length - 6} more categories
                        </p>
                    </div>
                )}
            </div>
        );
    };

    if (transactions.length === 0) {
        return (
            <div className="text-center py-12">
                <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No data available</h3>
                <p className="text-gray-500">No transactions found for the selected period</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-sm text-red-600 font-medium">Total Expenses</p>
                    <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
                    <p className="text-xs text-red-500">{expenseData.length} categories</p>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600 font-medium">Total Income</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
                    <p className="text-xs text-green-500">{incomeData.length} categories</p>
                </div>

                <div className={`text-center p-4 rounded-lg ${totalIncome - totalExpenses >= 0 ? 'bg-blue-50' : 'bg-red-50'
                    }`}>
                    <p className={`text-sm font-medium ${totalIncome - totalExpenses >= 0 ? 'text-blue-600' : 'text-red-600'
                        }`}>
                        Net Balance
                    </p>
                    <p className={`text-2xl font-bold ${totalIncome - totalExpenses >= 0 ? 'text-blue-600' : 'text-red-600'
                        }`}>
                        {formatCurrency(totalIncome - totalExpenses)}
                    </p>
                    <p className={`text-xs ${totalIncome - totalExpenses >= 0 ? 'text-blue-500' : 'text-red-500'
                        }`}>
                        {totalIncome - totalExpenses >= 0 ? 'Surplus' : 'Deficit'}
                    </p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Expenses Breakdown */}
                <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <PieChart size={20} className="mr-2 text-red-600" />
                        Expense Categories
                    </h4>
                    <CategoryPieChart data={expenseData} total={totalExpenses} type="expense" />
                </div>

                {/* Income Breakdown */}
                <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <PieChart size={20} className="mr-2 text-green-600" />
                        Income Categories
                    </h4>
                    <CategoryPieChart data={incomeData} total={totalIncome} type="income" />
                </div>
            </div>

            {/* Top Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-3">Top Expense Categories</h5>
                    <div className="space-y-2">
                        {expenseData.slice(0, 3).map((item, index) => (
                            <div key={item.categoryId} className="flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                    <span className="text-lg font-bold text-gray-500">#{index + 1}</span>
                                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                                    <span className="text-sm font-medium">{item.category}</span>
                                </div>
                                <span className="text-sm font-bold text-red-600">
                                    {formatCurrency(item.amount)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-3">Top Income Categories</h5>
                    <div className="space-y-2">
                        {incomeData.slice(0, 3).map((item, index) => (
                            <div key={item.categoryId} className="flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                    <span className="text-lg font-bold text-gray-500">#{index + 1}</span>
                                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                                    <span className="text-sm font-medium">{item.category}</span>
                                </div>
                                <span className="text-sm font-bold text-green-600">
                                    {formatCurrency(item.amount)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryBreakdown;
import React from 'react';
import { BarChart3, TrendingDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getCategoryName, formatCurrency, groupTransactionsByCategory } from '../../utils/helpers';

const ExpenseChart = ({ transactions }) => {
    const { categories } = useApp();

    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const groupedExpenses = groupTransactionsByCategory(expenseTransactions);

    const expenseData = Object.entries(groupedExpenses)
        .map(([categoryId, data]) => ({
            category: getCategoryName(categoryId, categories, 'expense'),
            amount: data.total,
            count: data.count,
            percentage: 0 // Will be calculated below
        }))
        .sort((a, b) => b.amount - a.amount);

    const totalExpenses = expenseData.reduce((sum, item) => sum + item.amount, 0);

    // Calculate percentages
    expenseData.forEach(item => {
        item.percentage = totalExpenses > 0 ? (item.amount / totalExpenses) * 100 : 0;
    });

    const maxAmount = Math.max(...expenseData.map(item => item.amount), 1);

    if (expenseTransactions.length === 0) {
        return (
            <div className="text-center py-12">
                <TrendingDown size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No expense data</h3>
                <p className="text-gray-500">No expense transactions found for the selected period</p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-900">Expense Breakdown</h4>
                    <div className="text-sm text-gray-600">
                        Total: {formatCurrency(totalExpenses)}
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {expenseData.map((item, index) => (
                    <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-gray-900">{item.category}</span>
                            <div className="text-right">
                                <div className="font-semibold text-red-600">{formatCurrency(item.amount)}</div>
                                <div className="text-xs text-gray-500">{item.count} transactions</div>
                            </div>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className="bg-red-500 h-3 rounded-full transition-all duration-300"
                                style={{
                                    width: `${(item.amount / maxAmount) * 100}%`
                                }}
                            />
                        </div>

                        <div className="flex justify-between text-xs text-gray-500">
                            <span>{item.percentage.toFixed(1)}% of total expenses</span>
                            <span>Avg: {formatCurrency(item.amount / item.count)}</span>
                        </div>
                    </div>
                ))}
            </div>

            {expenseData.length > 5 && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                        Showing top {Math.min(5, expenseData.length)} expense categories.
                        {expenseData.length > 5 && ` ${expenseData.length - 5} more categories not shown.`}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ExpenseChart;
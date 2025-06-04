import React from 'react';
import { ArrowRight, Receipt } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate, getCategoryName, getCategoryColor } from '../../utils/helpers';
import Card from '../common/Card';
import Button from '../common/Button';

const RecentTransactions = ({ limit = 5 }) => {
    const { getFilteredTransactions, categories } = useApp();
    const recentTransactions = getFilteredTransactions().slice(0, limit);

    if (recentTransactions.length === 0) {
        return (
            <Card>
                <div className="text-center py-12">
                    <Receipt size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
                    <p className="text-gray-500 mb-4">Start by adding your first transaction</p>
                </div>
            </Card>
        );
    }

    return (
        <Card padding="p-0">
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                    <Button variant="ghost" size="sm">
                        View All
                        <ArrowRight size={16} className="ml-1" />
                    </Button>
                </div>
            </div>

            <div className="divide-y divide-gray-200">
                {recentTransactions.map((transaction) => {
                    const categoryName = getCategoryName(transaction.category, categories, transaction.type);
                    const categoryColor = getCategoryColor(transaction.category, categories, transaction.type);

                    return (
                        <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className={`w-3 h-3 rounded-full ${categoryColor}`} />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {transaction.description}
                                        </p>
                                        <div className="flex items-center mt-1 text-xs text-gray-500 space-x-4">
                                            <span>{categoryName}</span>
                                            <span>{formatDate(transaction.date)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`text-sm font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                    </span>
                                    <p className="text-xs text-gray-500 mt-1 capitalize">
                                        {transaction.type}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};

export default RecentTransactions;
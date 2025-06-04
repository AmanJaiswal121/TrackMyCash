import React, { useState } from 'react';
import { PlusCircle, TrendingUp, ArrowRight, Calendar, DollarSign } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate, getCategoryName, getCategoryColor } from '../utils/helpers';
import Button from './common/Button';
import Card from './common/Card';
import TransactionModal from './transactions/TransactionModal';

const Dashboard = () => {
    const {
        getFilteredTransactions,
        getFinancialSummary,
        addTransaction,
        categories
    } = useApp();

    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

    const transactions = getFilteredTransactions();
    const summary = getFinancialSummary();
    const recentTransactions = transactions.slice(0, 5);

    const handleAddTransaction = (transactionData) => {
        console.log('Dashboard: Received transaction data:', transactionData);

        try {
            const result = addTransaction(transactionData);
            console.log('Dashboard: Transaction added successfully:', result);
            setIsTransactionModalOpen(false);
        } catch (error) {
            console.error('Dashboard: Error adding transaction:', error);
        }
    };

    const getCategoryInfo = (categoryId, type) => {
        const categoryList = categories[type] || [];
        return categoryList.find(cat => cat.id === categoryId) || { name: 'Unknown', color: 'bg-gray-500' };
    };

    // Summary Cards Component
    const SummaryCards = () => {
        const cards = [
            {
                title: 'Total Income',
                amount: summary.income,
                icon: TrendingUp,
                color: 'text-green-600',
                bgColor: 'bg-green-50',
                trend: '+12% from last month',
            },
            {
                title: 'Total Expenses',
                amount: summary.expenses,
                icon: TrendingUp,
                color: 'text-red-600',
                bgColor: 'bg-red-50',
                trend: '+8% from last month',
            },
            {
                title: 'Balance',
                amount: summary.balance,
                icon: DollarSign,
                color: summary.balance >= 0 ? 'text-blue-600' : 'text-red-600',
                bgColor: summary.balance >= 0 ? 'bg-blue-50' : 'bg-red-50',
                trend: summary.balance >= 0 ? 'Positive balance' : 'Negative balance',
            },
        ];

        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {cards.map((card, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                            <div className={`p-3 rounded-lg ${card.bgColor}`}>
                                <card.icon size={24} className={card.color} />
                            </div>
                            <div className="ml-4 flex-1">
                                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                                <p className={`text-2xl font-bold ${card.color}`}>
                                    {formatCurrency(card.amount)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">{card.trend}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        );
    };

    // Recent Transactions Component
    const RecentTransactions = () => {
        if (recentTransactions.length === 0) {
            return (
                <Card>
                    <div className="text-center py-12">
                        <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
                        <p className="text-gray-500 mb-4">Start by adding your first transaction</p>
                        <Button onClick={() => setIsTransactionModalOpen(true)}>
                            <PlusCircle size={16} className="mr-2" />
                            Add Transaction
                        </Button>
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
                        const categoryInfo = getCategoryInfo(transaction.category, transaction.type);

                        return (
                            <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-3 h-3 rounded-full ${categoryInfo.color}`} />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {transaction.description}
                                            </p>
                                            <div className="flex items-center mt-1 text-xs text-gray-500 space-x-4">
                                                <span>{categoryInfo.name}</span>
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

    // Quick Actions Component
    const QuickActions = () => {
        const actions = [
            {
                icon: PlusCircle,
                label: 'Add Transaction',
                description: 'Record a new income or expense',
                color: 'text-blue-600',
                bgColor: 'bg-blue-50',
                onClick: () => setIsTransactionModalOpen(true),
            },
            {
                icon: TrendingUp,
                label: 'View Reports',
                description: 'Analyze your finances',
                color: 'text-purple-600',
                bgColor: 'bg-purple-50',
                onClick: () => console.log('Navigate to reports'),
            },
            {
                icon: Calendar,
                label: 'Monthly Summary',
                description: 'This month overview',
                color: 'text-green-600',
                bgColor: 'bg-green-50',
                onClick: () => console.log('Show monthly summary'),
            },
        ];

        return (
            <Card>
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                    <p className="text-sm text-gray-600 mt-1">Common tasks and shortcuts</p>
                </div>

                <div className="space-y-3">
                    {actions.map((action, index) => (
                        <button
                            key={index}
                            onClick={action.onClick}
                            className="w-full flex items-center p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors text-left"
                        >
                            <div className={`p-2 rounded-lg ${action.bgColor}`}>
                                <action.icon size={20} className={action.color} />
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-sm font-medium text-gray-900">{action.label}</p>
                                <p className="text-xs text-gray-500">{action.description}</p>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">This Month</h4>
                    <div className="space-y-2 text-xs text-gray-600">
                        <div className="flex justify-between">
                            <span>Income:</span>
                            <span className="font-medium text-green-600">{formatCurrency(summary.income)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Expenses:</span>
                            <span className="font-medium text-red-600">{formatCurrency(summary.expenses)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-200">
                            <span className="font-medium">Balance:</span>
                            <span className={`font-medium ${summary.balance >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {formatCurrency(summary.balance)}
                            </span>
                        </div>
                    </div>
                </div>
            </Card>
        );
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-1">Overview of your financial activity</p>
                </div>
                <Button onClick={() => setIsTransactionModalOpen(true)}>
                    <PlusCircle size={20} className="mr-2" />
                    Add Transaction
                </Button>
            </div>

            {/* Summary Cards */}
            <SummaryCards />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Transactions */}
                <div className="lg:col-span-2">
                    <RecentTransactions />
                </div>

                {/* Quick Actions */}
                <div className="lg:col-span-1">
                    <QuickActions />
                </div>
            </div>

            {/* Transaction Modal */}
            <TransactionModal
                isOpen={isTransactionModalOpen}
                onClose={() => setIsTransactionModalOpen(false)}
                onSubmit={handleAddTransaction}
            />
        </div>
    );
};

export default Dashboard;
import React from 'react';
import { PlusCircle, TrendingUp, TrendingDown, BarChart3, Download } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';

const QuickActions = ({ onAddTransaction }) => {
    const actions = [
        {
            icon: PlusCircle,
            label: 'Add Transaction',
            description: 'Record a new income or expense',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            onClick: onAddTransaction,
        },
        {
            icon: TrendingUp,
            label: 'Add Income',
            description: 'Quick income entry',
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            onClick: () => onAddTransaction('income'),
        },
        {
            icon: TrendingDown,
            label: 'Add Expense',
            description: 'Quick expense entry',
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            onClick: () => onAddTransaction('expense'),
        },
        {
            icon: BarChart3,
            label: 'View Reports',
            description: 'Analyze your finances',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            onClick: () => console.log('Navigate to reports'),
        },
        {
            icon: Download,
            label: 'Export Data',
            description: 'Download your transaction data',
            color: 'text-gray-600',
            bgColor: 'bg-gray-50',
            onClick: () => console.log('Export data'),
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
                <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Activity</h4>
                <div className="space-y-2 text-xs text-gray-600">
                    <p>• Last transaction: 2 hours ago</p>
                    <p>• Weekly expenses: $234.50</p>
                    <p>• Monthly budget: 67% used</p>
                </div>
            </div>
        </Card>
    );
};

export default QuickActions;
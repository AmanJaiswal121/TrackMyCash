import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, CreditCard } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/helpers';
import Card from '../common/Card';

const SummaryCards = () => {
    const { getFinancialSummary } = useApp();
    const summary = getFinancialSummary();

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
            icon: TrendingDown,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            trend: '+8% from last month',
        },
        {
            title: 'Balance',
            amount: summary.balance,
            icon: DollarSign,
            color: summary.balance >= 0 ? 'text-green-600' : 'text-red-600',
            bgColor: summary.balance >= 0 ? 'bg-green-50' : 'bg-red-50',
            trend: summary.balance >= 0 ? 'Positive balance' : 'Negative balance',
        },
        {
            title: 'Transactions',
            amount: summary.totalTransactions,
            icon: CreditCard,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            trend: `${summary.totalTransactions} this period`,
            isCount: true,
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cards.map((card, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                        <div className={`p-3 rounded-lg ${card.bgColor}`}>
                            <card.icon size={24} className={card.color} />
                        </div>
                        <div className="ml-4 flex-1">
                            <p className="text-sm font-medium text-gray-600">{card.title}</p>
                            <p className={`text-2xl font-bold ${card.color}`}>
                                {card.isCount ? card.amount : formatCurrency(card.amount)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{card.trend}</p>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default SummaryCards;
import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Button from '../common/Button';
import SummaryCards from './SummaryCards';
import RecentTransactions from './RecentTransactions';
import QuickActions from './QuickActions';
import TransactionModal from '../transactions/TransactionModal';

const Dashboard = () => {
    const { addTransaction } = useApp();
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

    const handleAddTransaction = (transactionData) => {
        addTransaction(transactionData);
        setIsTransactionModalOpen(false);
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
                    <QuickActions onAddTransaction={() => setIsTransactionModalOpen(true)} />
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
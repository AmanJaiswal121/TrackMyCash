import React, { useState } from 'react';
import { PlusCircle, Download, Upload, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Button from '../components/common/Button';
import TransactionFilters from '../components/transactions/TransactionFilters';
import TransactionList from '../components/transactions/TransactionList';
import TransactionModal from '../components/transactions/TransactionModal';
import { formatForExport } from '../utils/formatters';

const TransactionsPage = () => {
    const { addTransaction, updateTransaction, deleteTransaction, getFilteredTransactions } = useApp();
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [showFilters, setShowFilters] = useState(true);

    const transactions = getFilteredTransactions();

    const handleAddTransaction = (transactionData) => {
        addTransaction(transactionData);
        setIsTransactionModalOpen(false);
    };

    const handleEditTransaction = (transaction) => {
        setEditingTransaction(transaction);
        setIsTransactionModalOpen(true);
    };

    const handleUpdateTransaction = (transactionData) => {
        updateTransaction(editingTransaction.id, transactionData);
        setEditingTransaction(null);
        setIsTransactionModalOpen(false);
    };

    const handleDeleteTransaction = (id) => {
        deleteTransaction(id);
    };

    const closeModal = () => {
        setIsTransactionModalOpen(false);
        setEditingTransaction(null);
    };

    const exportTransactions = () => {
        try {
            const csvData = formatForExport.csv(transactions);
            const blob = new Blob([csvData], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to export transactions. Please try again.');
        }
    };

    const importTransactions = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv,.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        let importedData;
                        if (file.name.endsWith('.json')) {
                            importedData = JSON.parse(event.target.result);
                        } else {
                            // Basic CSV parsing - in a real app, you'd use a proper CSV parser
                            alert('CSV import not yet implemented. Please use JSON format.');
                            return;
                        }

                        // TODO: Implement proper import validation and processing
                        console.log('Imported data:', importedData);
                        alert('Import functionality will be available soon!');
                    } catch (error) {
                        console.error('Import failed:', error);
                        alert('Failed to import transactions. Please check the file format.');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
                    <p className="text-gray-600 mt-1">
                        Manage all your financial transactions • {transactions.length} total
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setShowFilters(!showFilters)}
                        className="w-full sm:w-auto"
                    >
                        <Filter size={16} className="mr-2" />
                        {showFilters ? 'Hide' : 'Show'} Filters
                    </Button>
                    <Button
                        variant="outline"
                        onClick={exportTransactions}
                        className="w-full sm:w-auto"
                    >
                        <Download size={16} className="mr-2" />
                        Export
                    </Button>
                    <Button
                        variant="outline"
                        onClick={importTransactions}
                        className="w-full sm:w-auto"
                    >
                        <Upload size={16} className="mr-2" />
                        Import
                    </Button>
                    <Button
                        onClick={() => setIsTransactionModalOpen(true)}
                        className="w-full sm:w-auto"
                    >
                        <PlusCircle size={16} className="mr-2" />
                        Add Transaction
                    </Button>
                </div>
            </div>

            {showFilters && <TransactionFilters />}

            <TransactionList
                onEdit={handleEditTransaction}
                onDelete={handleDeleteTransaction}
            />

            <TransactionModal
                isOpen={isTransactionModalOpen}
                onClose={closeModal}
                onSubmit={editingTransaction ? handleUpdateTransaction : handleAddTransaction}
                transaction={editingTransaction}
            />
        </div>
    );
};

export default TransactionsPage;
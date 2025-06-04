import React, { useState } from 'react';
import { Receipt, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import TransactionItem from './TransactionItem';
import Card from '../common/Card';
import Button from '../common/Button';

const TransactionList = ({ onEdit, onDelete }) => {
    const { getFilteredTransactions } = useApp();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const transactions = getFilteredTransactions();
    const totalPages = Math.ceil(transactions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedTransactions = transactions.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    if (transactions.length === 0) {
        return (
            <Card>
                <div className="text-center py-12">
                    <Receipt size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
                    <p className="text-gray-500">
                        No transactions match your current filters. Try adjusting your search criteria.
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <Card padding="p-0">
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                        All Transactions ({transactions.length})
                    </h3>
                    <div className="text-sm text-gray-500">
                        Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, transactions.length)} of {transactions.length}
                    </div>
                </div>
            </div>

            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {paginatedTransactions.map((transaction) => (
                    <TransactionItem
                        key={transaction.id}
                        transaction={transaction}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft size={16} className="mr-1" />
                            Previous
                        </Button>

                        <div className="flex items-center space-x-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <Button
                                    key={page}
                                    variant={currentPage === page ? 'primary' : 'ghost'}
                                    size="sm"
                                    onClick={() => handlePageChange(page)}
                                    className="min-w-[40px]"
                                >
                                    {page}
                                </Button>
                            ))}
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                            <ChevronRight size={16} className="ml-1" />
                        </Button>
                    </div>
                </div>
            )}
        </Card>
    );
};

export default TransactionList;
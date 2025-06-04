import React from 'react';
import Modal from '../common/Modal';
import TransactionForm from './TransactionForm';

const TransactionModal = ({
    isOpen,
    onClose,
    onSubmit,
    transaction = null,
    title
}) => {
    const modalTitle = title || (transaction ? 'Edit Transaction' : 'Add New Transaction');

    const handleSubmit = (transactionData) => {
        onSubmit(transactionData);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={modalTitle}
            size="md"
        >
            <TransactionForm
                transaction={transaction}
                onSubmit={handleSubmit}
                onCancel={onClose}
            />
        </Modal>
    );
};

export default TransactionModal;
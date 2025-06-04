import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Dashboard from '../Dashboard';
import TransactionsPage from '../../pages/Transactions';
import CategoriesPage from '../../pages/Categories';
import ReportsPage from '../../pages/Reports';
import SettingsPage from '../../pages/Settings';

const Layout = () => {
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const renderContent = () => {
        switch (currentPage) {
            case 'dashboard':
                return <Dashboard />;
            case 'transactions':
                return <TransactionsPage />;
            case 'categories':
                return <CategoriesPage />;
            case 'reports':
                return <ReportsPage />;
            case 'settings':
                return <SettingsPage />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header
                    onMenuClick={() => setIsSidebarOpen(true)}
                />

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
                    <div className="container mx-auto px-6 py-8">
                        {renderContent()}
                    </div>
                </main>
            </div>

            {/* Mobile overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default Layout;
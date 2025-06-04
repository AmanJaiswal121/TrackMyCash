import React from 'react';
import { Home, CreditCard, Tag, BarChart3, Settings, X, DollarSign } from 'lucide-react';

const Sidebar = ({ currentPage, setCurrentPage, isOpen, setIsOpen }) => {
    const navigation = [
        { id: 'dashboard', name: 'Dashboard', icon: Home },
        { id: 'transactions', name: 'Transactions', icon: CreditCard },
        { id: 'categories', name: 'Categories', icon: Tag },
        { id: 'reports', name: 'Reports', icon: BarChart3 },
        { id: 'settings', name: 'Settings', icon: Settings },
    ];

    const handlePageChange = (pageId) => {
        setCurrentPage(pageId);
        setIsOpen(false);
    };

    return (
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
            } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>

            {/* Header */}
            <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <DollarSign size={20} className="text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Finance Tracker</h2>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    className="lg:hidden text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    aria-label="Close sidebar"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Navigation */}
            <nav className="mt-6">
                {navigation.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => handlePageChange(item.id)}
                        className={`w-full flex items-center px-6 py-3 text-left transition-colors ${currentPage === item.id
                                ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-r-2 border-blue-700'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                            }`}
                    >
                        <item.icon size={20} className="mr-3" />
                        {item.name}
                    </button>
                ))}
            </nav>

            {/* Footer */}
            <div className="absolute bottom-0 w-full p-6 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    <p>Personal Finance Tracker</p>
                    <p className="mt-1">v1.0.0</p>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
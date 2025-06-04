import React, { useState } from 'react';
import { Menu, X, DollarSign, User, Bell, Settings } from 'lucide-react';
import Button from './Button';

const Navbar = ({
    title = "Finance Tracker",
    user,
    onMenuClick,
    showNotifications = true,
    notifications = []
}) => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotificationMenu, setShowNotificationMenu] = useState(false);

    const unreadNotifications = notifications.filter(n => !n.read).length;

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Left side */}
                    <div className="flex items-center">
                        {/* Mobile menu button */}
                        <button
                            onClick={onMenuClick}
                            className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            <Menu size={20} />
                        </button>

                        {/* Logo and title */}
                        <div className="flex-shrink-0 flex items-center ml-4 lg:ml-0">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <DollarSign size={20} className="text-white" />
                            </div>
                            <span className="ml-3 text-xl font-bold text-gray-900 hidden sm:block">
                                {title}
                            </span>
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center space-x-4">
                        {/* Notifications */}
                        {showNotifications && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowNotificationMenu(!showNotificationMenu)}
                                    className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <Bell size={20} />
                                    {unreadNotifications > 0 && (
                                        <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                            {unreadNotifications}
                                        </span>
                                    )}
                                </button>

                                {/* Notification dropdown */}
                                {showNotificationMenu && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                        <div className="px-4 py-2 border-b border-gray-200">
                                            <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                                        </div>
                                        {notifications.length === 0 ? (
                                            <div className="px-4 py-6 text-center text-gray-500 text-sm">
                                                No notifications
                                            </div>
                                        ) : (
                                            <div className="max-h-64 overflow-y-auto">
                                                {notifications.map((notification, index) => (
                                                    <div
                                                        key={index}
                                                        className={`px-4 py-3 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''
                                                            }`}
                                                    >
                                                        <p className="text-sm text-gray-900">{notification.title}</p>
                                                        <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
                                                        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* User menu */}
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center space-x-2 p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                    <User size={16} className="text-white" />
                                </div>
                                <span className="text-sm font-medium hidden sm:block">
                                    {user?.name || 'User'}
                                </span>
                            </button>

                            {/* User dropdown */}
                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                    <div className="px-4 py-2 border-b border-gray-200">
                                        <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                                        <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                                    </div>
                                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                                        <User size={16} className="mr-2" />
                                        Profile
                                    </button>
                                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                                        <Settings size={16} className="mr-2" />
                                        Settings
                                    </button>
                                    <hr className="my-2" />
                                    <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center">
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Click outside to close menus */}
            {(showUserMenu || showNotificationMenu) && (
                <div
                    className="fixed inset-0 z-10"
                    onClick={() => {
                        setShowUserMenu(false);
                        setShowNotificationMenu(false);
                    }}
                />
            )}
        </nav>
    );
};

export default Navbar;
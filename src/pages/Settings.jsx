import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Database, Palette, Download, Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';

const SettingsPage = () => {
    const { theme, setTheme, isDark } = useTheme();
    const [userData, setUserData] = useState({
        name: 'Aman Jaiswal',
        email: 'amanjswl000@gmail.com',
        currency: 'INR',
        dateFormat: 'DD/MM/YYYY',
    });

    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        budgetAlerts: true,
        monthlyReports: false,
    });

    const handleUserDataChange = (field, value) => {
        setUserData(prev => ({ ...prev, [field]: value }));
    };

    const handleNotificationChange = (field, value) => {
        setNotifications(prev => ({ ...prev, [field]: value }));
    };

    const saveSettings = () => {
        // TODO: Implement save functionality
        console.log('Settings saved:', { userData, notifications });
        alert('Settings saved successfully!');
    };

    const exportData = () => {
        // TODO: Implement data export
        console.log('Exporting data...');
    };

    const clearData = () => {
        if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            localStorage.removeItem('financeTracker-transactions');
            localStorage.removeItem('financeTracker-categories');
            window.location.reload();
        }
    };

    const settingsSections = [
        {
            title: 'Profile Information',
            icon: User,
            content: (
                <div className="space-y-4">
                    <Input
                        label="Full Name"
                        value={userData.name}
                        onChange={(e) => handleUserDataChange('name', e.target.value)}
                    />
                    <Input
                        label="Email Address"
                        type="email"
                        value={userData.email}
                        onChange={(e) => handleUserDataChange('email', e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Currency"
                            value={userData.currency}
                            onChange={(e) => handleUserDataChange('currency', e.target.value)}
                            options={[
                                { value: 'USD', label: 'US Dollar (USD)' },
                                { value: 'EUR', label: 'Euro (EUR)' },
                                { value: 'GBP', label: 'British Pound (GBP)' },
                                { value: 'JPY', label: 'Japanese Yen (JPY)' },
                            ]}
                        />
                        <Select
                            label="Date Format"
                            value={userData.dateFormat}
                            onChange={(e) => handleUserDataChange('dateFormat', e.target.value)}
                            options={[
                                { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                                { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                                { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
                            ]}
                        />
                    </div>
                </div>
            ),
        },
        {
            title: 'Notifications',
            icon: Bell,
            content: (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                            <p className="text-sm text-gray-500">Receive updates via email</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={notifications.emailNotifications}
                            onChange={(e) => handleNotificationChange('emailNotifications', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-900">Budget Alerts</p>
                            <p className="text-sm text-gray-500">Get notified when approaching budget limits</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={notifications.budgetAlerts}
                            onChange={(e) => handleNotificationChange('budgetAlerts', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-900">Monthly Reports</p>
                            <p className="text-sm text-gray-500">Receive monthly financial summaries</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={notifications.monthlyReports}
                            onChange={(e) => handleNotificationChange('monthlyReports', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                    </div>
                </div>
            ),
        },
        {
            title: 'Appearance',
            icon: Palette,
            content: (
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Theme Preference
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { value: 'light', label: 'Light', icon: Sun },
                                { value: 'dark', label: 'Dark', icon: Moon },
                                { value: 'auto', label: 'Auto', icon: Monitor },
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setTheme(option.value)}
                                    className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${theme === option.value
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                            : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
                                        }`}
                                >
                                    <option.icon
                                        size={24}
                                        className={theme === option.value ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'}
                                    />
                                    <span className={`mt-2 text-sm font-medium ${theme === option.value ? 'text-blue-600' : 'text-gray-700 dark:text-gray-300'
                                        }`}>
                                        {option.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Current theme:</span> {theme.charAt(0).toUpperCase() + theme.slice(1)}
                            {theme === 'auto' && ` (${isDark ? 'Dark' : 'Light'} detected)`}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            title: 'Data Management',
            icon: Database,
            content: (
                <div className="space-y-4">
                    <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Export Data</h4>
                        <p className="text-sm text-gray-500 mb-4">
                            Download your financial data as a backup or for use in other applications.
                        </p>
                        <Button variant="outline" onClick={exportData}>
                            <Download size={16} className="mr-2" />
                            Export All Data
                        </Button>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Clear Data</h4>
                        <p className="text-sm text-gray-500 mb-4">
                            Permanently delete all your financial data. This action cannot be undone.
                        </p>
                        <Button variant="danger" onClick={clearData}>
                            Clear All Data
                        </Button>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-600 mt-1">Manage your account and application preferences</p>
                </div>
                <Button onClick={saveSettings}>
                    Save Changes
                </Button>
            </div>

            <div className="space-y-6">
                {settingsSections.map((section, index) => (
                    <Card key={index}>
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <section.icon size={20} className="text-gray-600" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                        </div>
                        {section.content}
                    </Card>
                ))}
            </div>

            {/* About Section */}
            <Card className="mt-8">
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">About Personal Finance Tracker</h3>
                    <p className="text-gray-600 mb-4">
                        A simple and effective way to manage your personal finances.
                    </p>
                    <div className="flex justify-center space-x-8 text-sm text-gray-500">
                        <div>
                            <p className="font-medium">Version</p>
                            <p>1.0.0</p>
                        </div>
                        <div>
                            <p className="font-medium">Build</p>
                            <p>2024.01.01</p>
                        </div>
                        <div>
                            <p className="font-medium">Framework</p>
                            <p>React + Vite</p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default SettingsPage;
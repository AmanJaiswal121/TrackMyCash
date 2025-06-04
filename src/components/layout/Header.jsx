import React from 'react';
import { Menu, User, Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Button from '../common/Button';

const Header = ({ onMenuClick }) => {
    const { theme, setTheme, isDark } = useTheme();

    const getThemeIcon = () => {
        switch (theme) {
            case 'light': return <Sun size={16} />;
            case 'dark': return <Moon size={16} />;
            case 'auto': return <Monitor size={16} />;
            default: return <Sun size={16} />;
        }
    };

    const cycleTheme = () => {
        switch (theme) {
            case 'light': setTheme('dark'); break;
            case 'dark': setTheme('auto'); break;
            case 'auto': setTheme('light'); break;
            default: setTheme('light');
        }
    };

    return (
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between h-16 px-6">
                <div className="flex items-center">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        aria-label="Open sidebar"
                    >
                        <Menu size={20} />
                    </button>
                    <div className="ml-4 lg:ml-0">
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                            Welcome to your Personal Finance Tracker
                        </span>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    {/* Theme Toggle Button */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={cycleTheme}
                        className="text-gray-600 dark:text-gray-300"
                        title={`Current theme: ${theme}`}
                    >
                        {getThemeIcon()}
                    </Button>

                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <User size={16} className="text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
                            User
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
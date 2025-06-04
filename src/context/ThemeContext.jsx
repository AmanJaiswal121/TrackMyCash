import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        // Get theme from localStorage or default to 'light'
        const savedTheme = localStorage.getItem('financeTracker-theme');
        return savedTheme || 'light';
    });

    // Apply theme to document
    useEffect(() => {
        const root = document.documentElement;

        // Remove existing theme classes
        root.classList.remove('light', 'dark');

        // Add current theme class
        if (theme === 'dark') {
            root.classList.add('dark');
        } else if (theme === 'light') {
            root.classList.add('light');
        } else if (theme === 'auto') {
            // Auto theme - detect system preference
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.classList.add(systemTheme);
        }

        // Save to localStorage
        localStorage.setItem('financeTracker-theme', theme);
    }, [theme]);

    // Listen for system theme changes when auto mode is selected
    useEffect(() => {
        if (theme === 'auto') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

            const handleChange = (e) => {
                const root = document.documentElement;
                root.classList.remove('light', 'dark');
                root.classList.add(e.matches ? 'dark' : 'light');
            };

            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(current => {
            switch (current) {
                case 'light': return 'dark';
                case 'dark': return 'auto';
                case 'auto': return 'light';
                default: return 'light';
            }
        });
    };

    const setSpecificTheme = (newTheme) => {
        if (['light', 'dark', 'auto'].includes(newTheme)) {
            setTheme(newTheme);
        }
    };

    const getSystemTheme = () => {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const getCurrentTheme = () => {
        if (theme === 'auto') {
            return getSystemTheme();
        }
        return theme;
    };

    const value = {
        theme,
        setTheme: setSpecificTheme,
        toggleTheme,
        getCurrentTheme,
        getSystemTheme,
        isDark: getCurrentTheme() === 'dark',
        isLight: getCurrentTheme() === 'light',
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};
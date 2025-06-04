// Application constants
export const APP_NAME = 'Personal Finance Tracker';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'A modern web application for managing personal finances';

// API endpoints (for future backend integration)
export const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
export const API_TIMEOUT = 30000; // 30 seconds

// Local storage keys
export const STORAGE_KEYS = {
  TRANSACTIONS: 'financeTracker-transactions',
  CATEGORIES: 'financeTracker-categories',
  USER_PREFERENCES: 'financeTracker-preferences',
  FILTERS: 'financeTracker-filters',
  THEME: 'financeTracker-theme',
};

// Transaction types
export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
};

// Date formats
export const DATE_FORMATS = {
  INPUT: 'YYYY-MM-DD',
  DISPLAY: 'MMM DD, YYYY',
  LONG: 'MMMM DD, YYYY',
  SHORT: 'MMM DD',
  ISO: 'YYYY-MM-DDTHH:mm:ss.sssZ',
};

// Currency settings
export const CURRENCIES = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound' },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  CHF: { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  CNY: { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
};

// Color palette for categories
export const CATEGORY_COLORS = [
  'bg-red-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-orange-500',
  'bg-teal-500',
  'bg-cyan-500',
  'bg-lime-500',
  'bg-amber-500',
  'bg-emerald-500',
  'bg-violet-500',
  'bg-rose-500',
  'bg-gray-500',
];

// Validation limits
export const VALIDATION_LIMITS = {
  MAX_AMOUNT: 999999999,
  MIN_AMOUNT: 0.01,
  MAX_DESCRIPTION_LENGTH: 200,
  MIN_DESCRIPTION_LENGTH: 1,
  MAX_CATEGORY_NAME_LENGTH: 50,
  MIN_CATEGORY_NAME_LENGTH: 2,
  MAX_TRANSACTIONS_PER_PAGE: 50,
  MIN_TRANSACTIONS_PER_PAGE: 5,
};

// Pagination settings
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50],
  MAX_VISIBLE_PAGES: 5,
};

// Chart settings
export const CHART_SETTINGS = {
  DEFAULT_HEIGHT: 300,
  COLORS: {
    INCOME: '#10b981', // green-500
    EXPENSE: '#ef4444', // red-500
    BALANCE: '#3b82f6', // blue-500
    NEUTRAL: '#6b7280', // gray-500
  },
  GRADIENTS: {
    INCOME: ['#10b981', '#34d399'],
    EXPENSE: ['#ef4444', '#f87171'],
    BALANCE: ['#3b82f6', '#60a5fa'],
  },
};

// Filter options
export const FILTER_OPTIONS = {
  TIME_PERIODS: [
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'Last 30 Days' },
    { value: 'quarter', label: 'Last 3 Months' },
    { value: 'year', label: 'Last Year' },
    { value: 'all', label: 'All Time' },
  ],
  SORT_OPTIONS: [
    { value: 'date', label: 'Date' },
    { value: 'amount', label: 'Amount' },
    { value: 'description', label: 'Description' },
    { value: 'category', label: 'Category' },
    { value: 'type', label: 'Type' },
  ],
  SORT_ORDERS: [
    { value: 'asc', label: 'Ascending' },
    { value: 'desc', label: 'Descending' },
  ],
};

// Theme settings
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto',
};

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// File export formats
export const EXPORT_FORMATS = {
  CSV: 'csv',
  JSON: 'json',
  PDF: 'pdf',
  XLSX: 'xlsx',
};

// Status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  PERMISSION_DENIED: 'You do not have permission to perform this action.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  TRANSACTION_ADDED: 'Transaction added successfully!',
  TRANSACTION_UPDATED: 'Transaction updated successfully!',
  TRANSACTION_DELETED: 'Transaction deleted successfully!',
  CATEGORY_ADDED: 'Category added successfully!',
  CATEGORY_UPDATED: 'Category updated successfully!',
  CATEGORY_DELETED: 'Category deleted successfully!',
  DATA_EXPORTED: 'Data exported successfully!',
  DATA_IMPORTED: 'Data imported successfully!',
  SETTINGS_SAVED: 'Settings saved successfully!',
};

// User preferences defaults
export const DEFAULT_PREFERENCES = {
  currency: 'INR',
  dateFormat: 'DD/MM/YYYY',
  theme: 'light',
  language: 'en-IN',
  pageSize: 10,
  defaultTransactionType: 'expense',
  showWelcomeMessage: true,
  enableNotifications: true,
  autoSave: true,
};

// Feature flags
export const FEATURES = {
  DARK_MODE: true,          // ✅ Enable dark mode
  CHARTS: true,
  EXPORT: true,
  IMPORT: true,
  CATEGORIES: true,
  FILTERS: true,
  SEARCH: true,
  BUDGET_TRACKING: false,
  GOALS: false,
  MULTI_CURRENCY: false,
  RECURRING_TRANSACTIONS: false,
};

// Regular expressions
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s\-\(\)]{10,}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  AMOUNT: /^\d+(\.\d{1,2})?$/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  ALPHA_SPACES: /^[a-zA-Z\s]+$/,
};

// Keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  ADD_TRANSACTION: 'ctrl+n',
  SEARCH: 'ctrl+f',
  SAVE: 'ctrl+s',
  CANCEL: 'escape',
  DELETE: 'delete',
  EDIT: 'enter',
};

// Animation durations (in milliseconds)
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  LOADING: 1000,
};

// Breakpoints (matching Tailwind CSS)
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px',
};

// Z-index levels
export const Z_INDEX = {
  DROPDOWN: 1000,
  MODAL: 2000,
  TOOLTIP: 3000,
  NOTIFICATION: 4000,
  OVERLAY: 5000,
};

// Default chart options
export const DEFAULT_CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
    },
    tooltip: {
      enabled: true,
      mode: 'index',
      intersect: false,
    },
  },
  scales: {
    x: {
      display: true,
      grid: {
        display: false,
      },
    },
    y: {
      display: true,
      beginAtZero: true,
    },
  },
};
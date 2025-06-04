// Currency formatting functions

// Change the default currency parameter
export const formatCurrency = (amount, currency = 'INR', locale = 'en-IN') => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};

// Date formatting functions
// Date formatting functions
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  
  const formatOptions = { ...defaultOptions, ...options };
  return new Date(date).toLocaleDateString('en-IN', formatOptions);
};

export const formatCurrencyCompact = (amount, currency = 'INR', locale = 'en-IN') => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        notation: 'compact',
        compactDisplay: 'short',
    }).format(amount);
};

export const formatDateLong = (date) => {
    return formatDate(date, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

export const formatDateShort = (date) => {
    return formatDate(date, {
        month: 'short',
        day: 'numeric',
    });
};

export const formatDateInput = (date) => {
    return new Date(date).toISOString().split('T')[0];
};

export const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const formatDateTime = (date) => {
    return `${formatDate(date)} at ${formatTime(date)}`;
};

// Number formatting functions
export const formatNumber = (number, decimals = 2) => {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(number);
};

export const formatPercentage = (decimal, decimals = 1) => {
    return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(decimal / 100);
};

export const formatCompactNumber = (number) => {
    return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        compactDisplay: 'short',
    }).format(number);
};

// Text formatting functions
export const formatCategoryName = (categoryId) => {
    return categoryId
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export const formatTransactionType = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
};

export const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

export const capitalizeFirst = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const formatInitials = (name) => {
    return name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .join('')
        .substring(0, 2);
};

// File size formatting
export const formatFileSize = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';

    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = bytes / Math.pow(1024, i);

    return `${size.toFixed(1)} ${sizes[i]}`;
};

// Duration formatting
export const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
        return `${minutes}m ${remainingSeconds}s`;
    } else {
        return `${remainingSeconds}s`;
    }
};

// Relative time formatting
export const formatRelativeTime = (date) => {
    const now = new Date();
    const targetDate = new Date(date);
    const diffInSeconds = Math.floor((now - targetDate) / 1000);

    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
    };

    for (const [unit, seconds] of Object.entries(intervals)) {
        const interval = Math.floor(diffInSeconds / seconds);
        if (interval >= 1) {
            return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
        }
    }

    return 'Just now';
};

// Export/import formatting
export const formatForExport = {
    csv: (data) => {
        if (!Array.isArray(data) || data.length === 0) return '';

        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(row =>
            Object.values(row).map(value =>
                typeof value === 'string' && value.includes(',')
                    ? `"${value}"`
                    : value
            ).join(',')
        );

        return [headers, ...rows].join('\n');
    },

    json: (data) => {
        return JSON.stringify(data, null, 2);
    },
};
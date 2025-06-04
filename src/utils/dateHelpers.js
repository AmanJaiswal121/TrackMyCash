// Date utility functions

// Format date for input fields
export const formatDateForInput = (date) => {
    return new Date(date).toISOString().split('T')[0];
};

// Get current date in YYYY-MM-DD format
export const getCurrentDate = () => {
    return formatDateForInput(new Date());
};

// Get date range based on period
export const getDateRange = (period) => {
    const today = new Date();
    const startDate = new Date();

    switch (period) {
        case 'week':
            startDate.setDate(today.getDate() - 7);
            break;
        case 'month':
            startDate.setMonth(today.getMonth() - 1);
            break;
        case 'quarter':
            startDate.setMonth(today.getMonth() - 3);
            break;
        case 'year':
            startDate.setFullYear(today.getFullYear() - 1);
            break;
        case 'ytd': // Year to date
            startDate.setMonth(0, 1); // January 1st
            break;
        case 'mtd': // Month to date
            startDate.setDate(1); // First day of current month
            break;
        default:
            startDate.setDate(today.getDate() - 30); // Default to 30 days
    }

    return {
        start: formatDateForInput(startDate),
        end: formatDateForInput(today),
    };
};

// Get start and end of week
export const getWeekRange = (date = new Date()) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day; // First day is the Monday
    startOfWeek.setDate(diff);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return {
        start: formatDateForInput(startOfWeek),
        end: formatDateForInput(endOfWeek),
    };
};

// Get start and end of month
export const getMonthRange = (date = new Date()) => {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    return {
        start: formatDateForInput(startOfMonth),
        end: formatDateForInput(endOfMonth),
    };
};

// Get start and end of year
export const getYearRange = (date = new Date()) => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const endOfYear = new Date(date.getFullYear(), 11, 31);

    return {
        start: formatDateForInput(startOfYear),
        end: formatDateForInput(endOfYear),
    };
};

// Add days to a date
export const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

// Add months to a date
export const addMonths = (date, months) => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
};

// Add years to a date
export const addYears = (date, years) => {
    const result = new Date(date);
    result.setFullYear(result.getFullYear() + years);
    return result;
};

// Get difference in days between two dates
export const getDaysDifference = (date1, date2) => {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const firstDate = new Date(date1);
    const secondDate = new Date(date2);

    return Math.round(Math.abs((firstDate - secondDate) / oneDay));
};

// Check if date is today
export const isToday = (date) => {
    const today = new Date();
    const checkDate = new Date(date);

    return checkDate.toDateString() === today.toDateString();
};

// Check if date is yesterday
export const isYesterday = (date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const checkDate = new Date(date);

    return checkDate.toDateString() === yesterday.toDateString();
};

// Check if date is this week
export const isThisWeek = (date) => {
    const weekRange = getWeekRange();
    const checkDate = formatDateForInput(new Date(date));

    return checkDate >= weekRange.start && checkDate <= weekRange.end;
};

// Check if date is this month
export const isThisMonth = (date) => {
    const today = new Date();
    const checkDate = new Date(date);

    return checkDate.getMonth() === today.getMonth() &&
        checkDate.getFullYear() === today.getFullYear();
};

// Check if date is this year
export const isThisYear = (date) => {
    const today = new Date();
    const checkDate = new Date(date);

    return checkDate.getFullYear() === today.getFullYear();
};

// Get month name
export const getMonthName = (monthIndex, short = false) => {
    const months = short
        ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    return months[monthIndex];
};

// Get day name
export const getDayName = (dayIndex, short = false) => {
    const days = short
        ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return days[dayIndex];
};

// Parse date string safely
export const parseDate = (dateString) => {
    if (!dateString) return null;

    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
};

// Check if date is valid
export const isValidDate = (date) => {
    return date instanceof Date && !isNaN(date.getTime());
};

// Get age from birthdate
export const getAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age;
};

// Get time until/since date
export const getTimeUntil = (targetDate) => {
    const now = new Date();
    const target = new Date(targetDate);
    const diffMs = target - now;
    const isPast = diffMs < 0;
    const absDiffMs = Math.abs(diffMs);

    const days = Math.floor(absDiffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((absDiffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((absDiffMs % (1000 * 60 * 60)) / (1000 * 60));

    return {
        isPast,
        days,
        hours,
        minutes,
        totalMs: diffMs,
    };
};

// Format duration in human readable format
export const formatDuration = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
};

// Get fiscal year (assuming April to March)
export const getFiscalYear = (date = new Date()) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    // If month is Jan, Feb, or Mar, fiscal year started in previous calendar year
    return month < 3 ? year - 1 : year;
};

// Get quarter from date
export const getQuarter = (date = new Date()) => {
    return Math.floor((date.getMonth() + 3) / 3);
};

// Get quarter range
export const getQuarterRange = (year, quarter) => {
    const startMonth = (quarter - 1) * 3;
    const startDate = new Date(year, startMonth, 1);
    const endDate = new Date(year, startMonth + 3, 0); // Last day of the quarter

    return {
        start: formatDateForInput(startDate),
        end: formatDateForInput(endDate),
    };
};

// Group dates by period
export const groupDatesByPeriod = (dates, period = 'month') => {
    const groups = {};

    dates.forEach(date => {
        const d = new Date(date);
        let key;

        switch (period) {
            case 'day':
                key = formatDateForInput(d);
                break;
            case 'week':
                const weekStart = new Date(d);
                weekStart.setDate(d.getDate() - d.getDay());
                key = formatDateForInput(weekStart);
                break;
            case 'month':
                key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                break;
            case 'quarter':
                key = `${d.getFullYear()}-Q${getQuarter(d)}`;
                break;
            case 'year':
                key = d.getFullYear().toString();
                break;
            default:
                key = formatDateForInput(d);
        }

        if (!groups[key]) groups[key] = [];
        groups[key].push(date);
    });

    return groups;
};

// Get business days between two dates (excluding weekends)
export const getBusinessDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let businessDays = 0;

    const currentDate = new Date(start);
    while (currentDate <= end) {
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
            businessDays++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return businessDays;
};
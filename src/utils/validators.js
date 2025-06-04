// Email validation
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Amount validation for Indian Rupees (whole numbers)
export const validateAmount = (amount) => {
    const num = parseFloat(amount);
    return !isNaN(num) && num >= 1 && num <= 99999999 && Number.isInteger(num);
};

export const validatePositiveNumber = (value) => {
    const num = parseFloat(value);
    return !isNaN(num) && num >= 0;
};

// Date validation
export const validateDate = (date) => {
    if (!date) return false;
    const dateObj = new Date(date);
    return dateObj instanceof Date && !isNaN(dateObj);
};

export const validateDateRange = (startDate, endDate) => {
    if (!validateDate(startDate) || !validateDate(endDate)) {
        return false;
    }
    return new Date(startDate) <= new Date(endDate);
};

export const validateFutureDate = (date) => {
    if (!validateDate(date)) return false;
    return new Date(date) > new Date();
};

export const validatePastDate = (date) => {
    if (!validateDate(date)) return false;
    return new Date(date) <= new Date();
};

// Text validation
export const validateRequired = (value) => {
    return value !== null && value !== undefined && value.toString().trim().length > 0;
};

export const validateMinLength = (value, minLength) => {
    return value && value.toString().length >= minLength;
};

export const validateMaxLength = (value, maxLength) => {
    return !value || value.toString().length <= maxLength;
};

export const validatePattern = (value, pattern) => {
    if (!value) return false;
    const regex = new RegExp(pattern);
    return regex.test(value);
};

// Category validation
export const validateCategoryName = (name, existingCategories = []) => {
    const errors = [];

    if (!validateRequired(name)) {
        errors.push('Category name is required');
    }

    if (!validateMinLength(name, 2)) {
        errors.push('Category name must be at least 2 characters');
    }

    if (!validateMaxLength(name, 50)) {
        errors.push('Category name must be less than 50 characters');
    }

    if (existingCategories.some(cat => cat.name.toLowerCase() === name.toLowerCase())) {
        errors.push('Category name already exists');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

// Transaction validation
export const validateTransaction = (transaction) => {
    const errors = {};

    // Amount validation
    if (!validateAmount(transaction.amount)) {
        errors.amount = 'Amount must be a positive number';
    }

    // Description is optional - no validation needed

    // Category validation
    if (!validateRequired(transaction.category)) {
        errors.category = 'Category is required';
    }

    // Type validation
    if (!['income', 'expense'].includes(transaction.type)) {
        errors.type = 'Transaction type must be income or expense';
    }

    // Date validation
    if (!validateDate(transaction.date)) {
        errors.date = 'Valid date is required';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

// Form validation helpers
export const createValidator = (rules) => {
    return (value) => {
        const errors = [];

        for (const rule of rules) {
            const result = rule.validator(value);
            if (!result) {
                errors.push(rule.message);
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
        };
    };
};

// Common validation rules
export const validationRules = {
    required: {
        validator: validateRequired,
        message: 'This field is required',
    },
    email: {
        validator: validateEmail,
        message: 'Please enter a valid email address',
    },
    positiveAmount: {
        validator: validateAmount,
        message: 'Amount must be a positive number',
    },
    validDate: {
        validator: validateDate,
        message: 'Please enter a valid date',
    },
    minLength: (length) => ({
        validator: (value) => validateMinLength(value, length),
        message: `Must be at least ${length} characters`,
    }),
    maxLength: (length) => ({
        validator: (value) => validateMaxLength(value, length),
        message: `Must be less than ${length} characters`,
    }),
    pattern: (regex, message) => ({
        validator: (value) => validatePattern(value, regex),
        message: message || 'Invalid format',
    }),
};

// File validation
export const validateFile = (file, options = {}) => {
    const {
        maxSize = 5 * 1024 * 1024, // 5MB default
        allowedTypes = ['image/jpeg', 'image/png', 'image/gif'],
        required = false,
    } = options;

    const errors = [];

    if (required && !file) {
        errors.push('File is required');
        return { isValid: false, errors };
    }

    if (!file) {
        return { isValid: true, errors: [] };
    }

    if (file.size > maxSize) {
        errors.push(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
    }

    if (!allowedTypes.includes(file.type)) {
        errors.push(`File type must be one of: ${allowedTypes.join(', ')}`);
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

// Password validation
export const validatePassword = (password) => {
    const errors = [];

    if (!validateRequired(password)) {
        errors.push('Password is required');
        return { isValid: false, errors };
    }

    if (!validateMinLength(password, 8)) {
        errors.push('Password must be at least 8 characters');
    }

    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }

    if (!/\d/.test(password)) {
        errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Password must contain at least one special character');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

// URL validation
export const validateUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

// Phone number validation (basic)
export const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
};

// Credit card validation (basic Luhn algorithm)
export const validateCreditCard = (cardNumber) => {
    const cleaned = cardNumber.replace(/\D/g, '');

    if (cleaned.length < 13 || cleaned.length > 19) {
        return false;
    }

    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
        let digit = parseInt(cleaned[i]);

        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        isEven = !isEven;
    }

    return sum % 10 === 0;
};
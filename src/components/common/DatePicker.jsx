import React from 'react';
import { Calendar } from 'lucide-react';

const DatePicker = ({
    label,
    value,
    onChange,
    error,
    className = '',
    id,
    required = false,
    min,
    max,
    ...props
}) => {
    const inputId = id || `datepicker-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className={className}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                <input
                    id={inputId}
                    type="date"
                    value={value}
                    onChange={onChange}
                    min={min}
                    max={max}
                    className={`w-full px-3 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                        }`}
                    {...props}
                />
                <Calendar
                    size={16}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                />
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};

export default DatePicker;
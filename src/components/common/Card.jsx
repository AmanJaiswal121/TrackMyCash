import React from 'react';

const Card = ({ children, className = '', padding = 'p-6', shadow = 'shadow-sm' }) => {
    return (
        <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${shadow} ${padding} ${className}`}>
            {children}
        </div>
    );
};

export default Card;
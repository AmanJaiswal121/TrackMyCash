export const formatIndianCurrency = (amount) => {
    if (amount >= 10000000) { // 1 Crore
        return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) { // 1 Lakh
        return `₹${(amount / 100000).toFixed(2)} L`;
    } else if (amount >= 1000) { // 1 Thousand
        return `₹${(amount / 1000).toFixed(2)} K`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
};

export const formatIndianNumber = (number) => {
    return number.toLocaleString('en-IN');
};
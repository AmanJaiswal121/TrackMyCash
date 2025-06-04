// Financial calculation utilities

// Calculate percentage
export const calculatePercentage = (value, total) => {
    if (total === 0) return 0;
    return (value / total) * 100;
};

// Calculate percentage change
export const calculatePercentageChange = (oldValue, newValue) => {
    if (oldValue === 0) return newValue > 0 ? 100 : 0;
    return ((newValue - oldValue) / oldValue) * 100;
};

// Calculate compound interest
export const calculateCompoundInterest = (principal, rate, time, compoundingFrequency = 1) => {
    const amount = principal * Math.pow(1 + rate / compoundingFrequency, compoundingFrequency * time);
    const interest = amount - principal;

    return {
        principal,
        rate,
        time,
        amount,
        interest,
        totalReturn: (interest / principal) * 100,
    };
};

// Calculate simple interest
export const calculateSimpleInterest = (principal, rate, time) => {
    const interest = principal * rate * time;
    const amount = principal + interest;

    return {
        principal,
        rate,
        time,
        amount,
        interest,
        totalReturn: (interest / principal) * 100,
    };
};

// Calculate savings goal
export const calculateSavingsGoal = (targetAmount, currentAmount, monthlyContribution, interestRate = 0) => {
    if (monthlyContribution <= 0) return { months: Infinity, years: Infinity };

    const remaining = Math.max(0, targetAmount - currentAmount);

    if (interestRate === 0) {
        const months = Math.ceil(remaining / monthlyContribution);
        return {
            months,
            years: months / 12,
            totalContributions: monthlyContribution * months,
            interestEarned: 0,
        };
    }

    const monthlyRate = interestRate / 12;
    let balance = currentAmount;
    let months = 0;
    let totalContributions = 0;

    while (balance < targetAmount && months < 1200) { // Max 100 years
        balance = balance * (1 + monthlyRate) + monthlyContribution;
        totalContributions += monthlyContribution;
        months++;
    }

    return {
        months,
        years: months / 12,
        totalContributions,
        interestEarned: balance - currentAmount - totalContributions,
    };
};

// Calculate budget variance
export const calculateBudgetVariance = (budgeted, actual) => {
    const variance = actual - budgeted;
    const percentageVariance = budgeted !== 0 ? (variance / budgeted) * 100 : 0;

    return {
        variance,
        percentageVariance,
        isOverBudget: variance > 0,
        isUnderBudget: variance < 0,
        isOnTarget: Math.abs(percentageVariance) <= 5, // Within 5%
    };
};

// Calculate emergency fund recommendation
export const calculateEmergencyFund = (monthlyExpenses, months = 6) => {
    return {
        recommendedAmount: monthlyExpenses * months,
        months,
        monthlyExpenses,
    };
};

// Calculate debt payoff scenarios
export const calculateDebtPayoff = (balance, interestRate, minimumPayment, extraPayment = 0) => {
    const monthlyRate = interestRate / 12;
    const totalMonthlyPayment = minimumPayment + extraPayment;

    if (totalMonthlyPayment <= balance * monthlyRate) {
        return {
            months: Infinity,
            totalPaid: Infinity,
            totalInterest: Infinity,
            isPayable: false,
        };
    }

    let currentBalance = balance;
    let months = 0;
    let totalPaid = 0;

    while (currentBalance > 0.01 && months < 1200) {
        const interestPayment = currentBalance * monthlyRate;
        const principalPayment = Math.min(totalMonthlyPayment - interestPayment, currentBalance);

        currentBalance -= principalPayment;
        totalPaid += interestPayment + principalPayment;
        months++;
    }

    return {
        months,
        years: months / 12,
        totalPaid,
        totalInterest: totalPaid - balance,
        isPayable: true,
        extraPayment,
    };
};

// Calculate retirement savings
export const calculateRetirement = (currentAge, retirementAge, currentSavings, monthlyContribution, expectedReturn) => {
    const yearsToRetirement = retirementAge - currentAge;
    const monthsToRetirement = yearsToRetirement * 12;
    const monthlyReturn = expectedReturn / 12;

    // Future value of current savings
    const futureValueCurrent = currentSavings * Math.pow(1 + monthlyReturn, monthsToRetirement);

    // Future value of monthly contributions (annuity)
    const futureValueContributions = monthlyContribution *
        ((Math.pow(1 + monthlyReturn, monthsToRetirement) - 1) / monthlyReturn);

    const totalRetirementSavings = futureValueCurrent + futureValueContributions;
    const totalContributions = monthlyContribution * monthsToRetirement;

    return {
        yearsToRetirement,
        totalRetirementSavings,
        totalContributions: totalContributions + currentSavings,
        investmentGrowth: totalRetirementSavings - totalContributions - currentSavings,
        monthlyIncomeAt4Percent: totalRetirementSavings * 0.04 / 12, // 4% withdrawal rule
    };
};

// Calculate loan payment
export const calculateLoanPayment = (principal, interestRate, termYears) => {
    const monthlyRate = interestRate / 12;
    const numPayments = termYears * 12;

    if (interestRate === 0) {
        return {
            monthlyPayment: principal / numPayments,
            totalPaid: principal,
            totalInterest: 0,
        };
    }

    const monthlyPayment = principal *
        (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
        (Math.pow(1 + monthlyRate, numPayments) - 1);

    const totalPaid = monthlyPayment * numPayments;
    const totalInterest = totalPaid - principal;

    return {
        monthlyPayment,
        totalPaid,
        totalInterest,
        principal,
        interestRate,
        termYears,
    };
};

// Calculate tax implications
export const calculateTaxes = (income, taxBrackets) => {
    let totalTax = 0;
    let remainingIncome = income;
    const taxBreakdown = [];

    for (const bracket of taxBrackets) {
        if (remainingIncome <= 0) break;

        const taxableAtThisBracket = Math.min(remainingIncome, bracket.max - bracket.min);
        const taxAtThisBracket = taxableAtThisBracket * bracket.rate;

        totalTax += taxAtThisBracket;
        remainingIncome -= taxableAtThisBracket;

        taxBreakdown.push({
            bracket: `${bracket.min} - ${bracket.max}`,
            rate: bracket.rate,
            taxableAmount: taxableAtThisBracket,
            tax: taxAtThisBracket,
        });
    }

    return {
        grossIncome: income,
        totalTax,
        netIncome: income - totalTax,
        effectiveRate: income > 0 ? (totalTax / income) * 100 : 0,
        taxBreakdown,
    };
};

// Calculate investment returns
export const calculateInvestmentReturns = (investments) => {
    const totalInvested = investments.reduce((sum, inv) => sum + inv.invested, 0);
    const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
    const totalGain = totalCurrentValue - totalInvested;
    const totalReturn = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;

    return {
        totalInvested,
        totalCurrentValue,
        totalGain,
        totalReturn,
        investments: investments.map(inv => ({
            ...inv,
            gain: inv.currentValue - inv.invested,
            return: inv.invested > 0 ? ((inv.currentValue - inv.invested) / inv.invested) * 100 : 0,
        })),
    };
};

// Calculate cost per unit
export const calculateCostPerUnit = (totalCost, quantity, unit = 'item') => {
    if (quantity === 0) return 0;
    return {
        costPerUnit: totalCost / quantity,
        totalCost,
        quantity,
        unit,
    };
};

// Calculate break-even point
export const calculateBreakEven = (fixedCosts, variableCostPerUnit, pricePerUnit) => {
    const contributionMargin = pricePerUnit - variableCostPerUnit;

    if (contributionMargin <= 0) {
        return {
            breakEvenUnits: Infinity,
            breakEvenRevenue: Infinity,
            isViable: false,
        };
    }

    const breakEvenUnits = fixedCosts / contributionMargin;
    const breakEvenRevenue = breakEvenUnits * pricePerUnit;

    return {
        breakEvenUnits: Math.ceil(breakEvenUnits),
        breakEvenRevenue,
        contributionMargin,
        isViable: true,
    };
};

// Calculate financial ratios
export const calculateFinancialRatios = (financialData) => {
    const {
        totalAssets,
        totalLiabilities,
        equity,
        revenue,
        netIncome,
        currentAssets,
        currentLiabilities,
    } = financialData;

    return {
        debtToEquity: equity > 0 ? totalLiabilities / equity : 0,
        debtToAssets: totalAssets > 0 ? totalLiabilities / totalAssets : 0,
        currentRatio: currentLiabilities > 0 ? currentAssets / currentLiabilities : 0,
        profitMargin: revenue > 0 ? (netIncome / revenue) * 100 : 0,
        returnOnAssets: totalAssets > 0 ? (netIncome / totalAssets) * 100 : 0,
        returnOnEquity: equity > 0 ? (netIncome / equity) * 100 : 0,
    };
};

// Round to specified decimal places
export const roundToDecimals = (number, decimals = 2) => {
    return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

// Format large numbers with suffixes
export const formatLargeNumber = (number) => {
    const suffixes = ['', 'K', 'M', 'B', 'T'];
    let suffixIndex = 0;
    let value = Math.abs(number);

    while (value >= 1000 && suffixIndex < suffixes.length - 1) {
        value /= 1000;
        suffixIndex++;
    }

    const formattedValue = roundToDecimals(value, value < 10 ? 1 : 0);
    return `${number < 0 ? '-' : ''}${formattedValue}${suffixes[suffixIndex]}`;
};
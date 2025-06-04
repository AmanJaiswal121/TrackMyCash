import { useMemo } from 'react';
import { groupTransactionsByCategory, getDateRange } from '../utils/helpers';

export const useFinancialSummary = (transactions, period = 'all') => {
    // Filter transactions by period if specified
    const periodTransactions = useMemo(() => {
        if (period === 'all') return transactions;

        const range = getDateRange(period);
        return transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            const startDate = new Date(range.start);
            const endDate = new Date(range.end);
            return transactionDate >= startDate && transactionDate <= endDate;
        });
    }, [transactions, period]);

    // Basic financial summary
    const summary = useMemo(() => {
        const income = periodTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const expenses = periodTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        return {
            income,
            expenses,
            balance: income - expenses,
            totalTransactions: periodTransactions.length,
            savingsRate: income > 0 ? ((income - expenses) / income) * 100 : 0,
        };
    }, [periodTransactions]);

    // Category breakdowns
    const categoryBreakdown = useMemo(() => {
        const incomeTransactions = periodTransactions.filter(t => t.type === 'income');
        const expenseTransactions = periodTransactions.filter(t => t.type === 'expense');

        return {
            income: groupTransactionsByCategory(incomeTransactions),
            expenses: groupTransactionsByCategory(expenseTransactions),
        };
    }, [periodTransactions]);

    // Monthly trends (for the last 12 months)
    const monthlyTrends = useMemo(() => {
        const now = new Date();
        const trends = [];

        for (let i = 11; i >= 0; i--) {
            const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

            const monthTransactions = transactions.filter(transaction => {
                const transactionDate = new Date(transaction.date);
                return transactionDate >= month && transactionDate < nextMonth;
            });

            const monthIncome = monthTransactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);

            const monthExpenses = monthTransactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);

            trends.push({
                month: month.toISOString().slice(0, 7), // YYYY-MM format
                income: monthIncome,
                expenses: monthExpenses,
                balance: monthIncome - monthExpenses,
                transactionCount: monthTransactions.length,
            });
        }

        return trends;
    }, [transactions]);

    // Top categories by spending
    const topCategories = useMemo(() => {
        const expenseCategories = Object.entries(categoryBreakdown.expenses)
            .map(([categoryId, data]) => ({
                categoryId,
                ...data,
                percentage: summary.expenses > 0 ? (data.total / summary.expenses) * 100 : 0,
            }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 5);

        return expenseCategories;
    }, [categoryBreakdown, summary.expenses]);

    // Financial metrics
    const metrics = useMemo(() => {
        const avgMonthlyIncome = monthlyTrends.reduce((sum, month) => sum + month.income, 0) / 12;
        const avgMonthlyExpenses = monthlyTrends.reduce((sum, month) => sum + month.expenses, 0) / 12;
        const avgTransactionAmount = periodTransactions.length > 0
            ? periodTransactions.reduce((sum, t) => sum + t.amount, 0) / periodTransactions.length
            : 0;

        const expenseTransactions = periodTransactions.filter(t => t.type === 'expense');
        const avgExpenseAmount = expenseTransactions.length > 0
            ? expenseTransactions.reduce((sum, t) => sum + t.amount, 0) / expenseTransactions.length
            : 0;

        return {
            avgMonthlyIncome,
            avgMonthlyExpenses,
            avgTransactionAmount,
            avgExpenseAmount,
            transactionFrequency: periodTransactions.length / (period === 'all' ? 12 : 1), // per month
        };
    }, [periodTransactions, monthlyTrends, period]);

    // Budget analysis (if budget targets were set)
    const budgetAnalysis = useMemo(() => {
        // This would typically come from user-defined budgets
        // For now, we'll use some basic heuristics
        const monthlyExpenses = summary.expenses / (period === 'month' ? 1 : 12);
        const recommendedBudget = summary.income * 0.8; // 80% of income for expenses

        return {
            currentSpending: summary.expenses,
            recommendedBudget,
            isOverBudget: summary.expenses > recommendedBudget,
            budgetUtilization: recommendedBudget > 0 ? (summary.expenses / recommendedBudget) * 100 : 0,
        };
    }, [summary, period]);

    // Financial health score (0-100)
    const healthScore = useMemo(() => {
        let score = 50; // Base score

        // Positive balance adds points
        if (summary.balance > 0) {
            score += 20;
        }

        // Good savings rate (>20%) adds points
        if (summary.savingsRate > 20) {
            score += 15;
        } else if (summary.savingsRate > 10) {
            score += 10;
        }

        // Diversified income sources
        const incomeCategories = Object.keys(categoryBreakdown.income);
        if (incomeCategories.length > 1) {
            score += 10;
        }

        // Controlled expenses (not overspending)
        if (!budgetAnalysis.isOverBudget) {
            score += 15;
        }

        // Regular transaction patterns (consistency)
        const hasRegularTransactions = monthlyTrends.every(month => month.transactionCount > 0);
        if (hasRegularTransactions) {
            score += 10;
        }

        return Math.min(100, Math.max(0, score));
    }, [summary, categoryBreakdown, budgetAnalysis, monthlyTrends]);

    // Insights and recommendations
    const insights = useMemo(() => {
        const insights = [];

        if (summary.savingsRate < 10) {
            insights.push({
                type: 'warning',
                title: 'Low Savings Rate',
                message: 'Consider reducing expenses or increasing income to improve your savings rate.',
            });
        }

        if (budgetAnalysis.isOverBudget) {
            insights.push({
                type: 'warning',
                title: 'Over Budget',
                message: 'You\'re spending more than recommended. Review your expenses.',
            });
        }

        if (topCategories.length > 0 && topCategories[0].percentage > 40) {
            insights.push({
                type: 'info',
                title: 'High Category Spending',
                message: `${topCategories[0].categoryId} accounts for ${topCategories[0].percentage.toFixed(1)}% of your expenses.`,
            });
        }

        if (summary.balance > summary.income * 0.3) {
            insights.push({
                type: 'success',
                title: 'Great Savings!',
                message: 'You\'re maintaining excellent financial discipline.',
            });
        }

        return insights;
    }, [summary, budgetAnalysis, topCategories]);

    return {
        summary,
        categoryBreakdown,
        monthlyTrends,
        topCategories,
        metrics,
        budgetAnalysis,
        healthScore,
        insights,
        period,
    };
};
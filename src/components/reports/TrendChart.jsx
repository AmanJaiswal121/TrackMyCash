import React from 'react';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/helpers';

const TrendChart = ({ transactions, period = 'month' }) => {
    // Group transactions by date
    const groupByDate = (transactions, groupBy) => {
        const groups = {};

        transactions.forEach(transaction => {
            const date = new Date(transaction.date);
            let key;

            switch (groupBy) {
                case 'week':
                    // Group by week (start of week)
                    const weekStart = new Date(date);
                    weekStart.setDate(date.getDate() - date.getDay());
                    key = weekStart.toISOString().split('T')[0];
                    break;
                case 'month':
                    // Group by month
                    key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                    break;
                case 'quarter':
                    // Group by quarter
                    const quarter = Math.floor(date.getMonth() / 3) + 1;
                    key = `${date.getFullYear()}-Q${quarter}`;
                    break;
                case 'year':
                    // Group by year
                    key = date.getFullYear().toString();
                    break;
                default:
                    // Group by day
                    key = transaction.date;
            }

            if (!groups[key]) {
                groups[key] = { income: 0, expenses: 0, net: 0, date: key };
            }

            if (transaction.type === 'income') {
                groups[key].income += transaction.amount;
            } else {
                groups[key].expenses += transaction.amount;
            }

            groups[key].net = groups[key].income - groups[key].expenses;
        });

        return Object.values(groups).sort((a, b) => a.date.localeCompare(b.date));
    };

    const trendData = groupByDate(transactions, period);

    if (trendData.length === 0) {
        return (
            <div className="text-center py-12">
                <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No trend data</h3>
                <p className="text-gray-500">No transactions found for the selected period</p>
            </div>
        );
    }

    const maxAmount = Math.max(
        ...trendData.map(item => Math.max(item.income, item.expenses)),
        100
    );

    const formatDateLabel = (dateStr) => {
        if (period === 'month') {
            const [year, month] = dateStr.split('-');
            return new Date(year, month - 1).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric'
            });
        } else if (period === 'quarter') {
            return dateStr;
        } else if (period === 'year') {
            return dateStr;
        } else {
            return formatDate(dateStr);
        }
    };

    const getTrendDirection = () => {
        if (trendData.length < 2) return 'neutral';

        const recent = trendData.slice(-3);
        const avgRecent = recent.reduce((sum, item) => sum + item.net, 0) / recent.length;

        const older = trendData.slice(-6, -3);
        if (older.length === 0) return 'neutral';

        const avgOlder = older.reduce((sum, item) => sum + item.net, 0) / older.length;

        if (avgRecent > avgOlder * 1.1) return 'up';
        if (avgRecent < avgOlder * 0.9) return 'down';
        return 'neutral';
    };

    const trendDirection = getTrendDirection();

    return (
        <div>
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-900">Financial Trends</h4>
                    <div className="flex items-center space-x-2">
                        {trendDirection === 'up' && (
                            <div className="flex items-center text-green-600">
                                <TrendingUp size={16} className="mr-1" />
                                <span className="text-sm">Trending Up</span>
                            </div>
                        )}
                        {trendDirection === 'down' && (
                            <div className="flex items-center text-red-600">
                                <TrendingDown size={16} className="mr-1" />
                                <span className="text-sm">Trending Down</span>
                            </div>
                        )}
                        {trendDirection === 'neutral' && (
                            <span className="text-sm text-gray-600">Stable</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {trendData.map((item, index) => (
                    <div key={index} className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h5 className="font-medium text-gray-900">
                                {formatDateLabel(item.date)}
                            </h5>
                            <div className="text-right">
                                <div className={`font-semibold ${item.net >= 0 ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    Net: {formatCurrency(item.net)}
                                </div>
                            </div>
                        </div>

                        {/* Income Bar */}
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs text-gray-600">
                                <span>Income</span>
                                <span>{formatCurrency(item.income)}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                    style={{
                                        width: `${(item.income / maxAmount) * 100}%`
                                    }}
                                />
                            </div>
                        </div>

                        {/* Expense Bar */}
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs text-gray-600">
                                <span>Expenses</span>
                                <span>{formatCurrency(item.expenses)}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-red-500 h-2 rounded-full transition-all duration-300"
                                    style={{
                                        width: `${(item.expenses / maxAmount) * 100}%`
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h6 className="font-medium text-gray-900 mb-2">Summary</h6>
                <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                        <p className="text-gray-600">Total Income</p>
                        <p className="font-semibold text-green-600">
                            {formatCurrency(trendData.reduce((sum, item) => sum + item.income, 0))}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-600">Total Expenses</p>
                        <p className="font-semibold text-red-600">
                            {formatCurrency(trendData.reduce((sum, item) => sum + item.expenses, 0))}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-600">Net Total</p>
                        <p className={`font-semibold ${trendData.reduce((sum, item) => sum + item.net, 0) >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {formatCurrency(trendData.reduce((sum, item) => sum + item.net, 0))}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrendChart;
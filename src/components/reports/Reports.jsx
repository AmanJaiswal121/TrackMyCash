import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, Calendar, Download } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Card from '../common/Card';
import Button from '../common/Button';
import Select from '../common/Select';
import ExpenseChart from './ExpenseChart';
import IncomeChart from './IncomeChart';
import TrendChart from './TrendChart';
import CategoryBreakdown from './CategoryBreakdown';

const Reports = () => {
    const { getFilteredTransactions, getFinancialSummary } = useApp();
    const [selectedPeriod, setSelectedPeriod] = useState('month');
    const [selectedChart, setSelectedChart] = useState('category');

    const transactions = getFilteredTransactions();
    const summary = getFinancialSummary();

    const periodOptions = [
        { value: 'week', label: 'Last 7 Days' },
        { value: 'month', label: 'Last 30 Days' },
        { value: 'quarter', label: 'Last 3 Months' },
        { value: 'year', label: 'Last Year' },
        { value: 'all', label: 'All Time' },
    ];

    const chartOptions = [
        { value: 'category', label: 'Category Breakdown', icon: PieChart },
        { value: 'trend', label: 'Spending Trends', icon: TrendingUp },
        { value: 'income', label: 'Income Analysis', icon: BarChart3 },
        { value: 'expense', label: 'Expense Analysis', icon: BarChart3 },
    ];

    const renderChart = () => {
        switch (selectedChart) {
            case 'category':
                return <CategoryBreakdown transactions={transactions} />;
            case 'trend':
                return <TrendChart transactions={transactions} period={selectedPeriod} />;
            case 'income':
                return <IncomeChart transactions={transactions} />;
            case 'expense':
                return <ExpenseChart transactions={transactions} />;
            default:
                return <CategoryBreakdown transactions={transactions} />;
        }
    };

    const exportReport = () => {
        // TODO: Implement report export functionality
        console.log('Exporting report...');
        alert('Export functionality will be available soon!');
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
                    <p className="text-gray-600 mt-1">Analyze your financial data with detailed insights</p>
                </div>
                <Button onClick={exportReport} variant="outline">
                    <Download size={16} className="mr-2" />
                    Export Report
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-green-50">
                            <TrendingUp size={24} className="text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Income</p>
                            <p className="text-2xl font-bold text-green-600">
                                ${summary.income.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-red-50">
                            <TrendingUp size={24} className="text-red-600 rotate-180" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                            <p className="text-2xl font-bold text-red-600">
                                ${summary.expenses.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center">
                        <div className={`p-3 rounded-lg ${summary.balance >= 0 ? 'bg-blue-50' : 'bg-red-50'}`}>
                            <BarChart3 size={24} className={summary.balance >= 0 ? 'text-blue-600' : 'text-red-600'} />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Net Balance</p>
                            <p className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                ${summary.balance.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Chart Controls */}
            <Card className="mb-8">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <Select
                            label="Chart Type"
                            value={selectedChart}
                            onChange={(e) => setSelectedChart(e.target.value)}
                            options={chartOptions}
                        />
                    </div>
                    <div className="flex-1">
                        <Select
                            label="Time Period"
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                            options={periodOptions}
                        />
                    </div>
                </div>
            </Card>

            {/* Chart Display */}
            <Card>
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {chartOptions.find(option => option.value === selectedChart)?.label}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        {periodOptions.find(option => option.value === selectedPeriod)?.label} • {transactions.length} transactions
                    </p>
                </div>
                {renderChart()}
            </Card>
        </div>
    );
};

export default Reports;
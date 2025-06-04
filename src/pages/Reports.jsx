import React from 'react';
import { BarChart3, PieChart, TrendingUp, Calendar } from 'lucide-react';
import SummaryCards from '../components/dashboard/SummaryCards';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const ReportsPage = () => {
    const reportTypes = [
        {
            title: 'Expense by Category',
            description: 'View your spending breakdown by category',
            icon: PieChart,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            title: 'Monthly Trends',
            description: 'Track your financial trends over time',
            icon: TrendingUp,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            title: 'Income vs Expenses',
            description: 'Compare your income and expenses',
            icon: BarChart3,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
        {
            title: 'Budget Analysis',
            description: 'Analyze your budget performance',
            icon: Calendar,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
        },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
                    <p className="text-gray-600 mt-1">Analyze your financial data with detailed reports</p>
                </div>
            </div>

            <SummaryCards />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {reportTypes.map((report, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-start space-x-4">
                            <div className={`p-3 rounded-lg ${report.bgColor}`}>
                                <report.icon size={24} className={report.color} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {report.title}
                                </h3>
                                <p className="text-gray-600 mb-4">{report.description}</p>
                                <Button size="sm" variant="outline">
                                    View Report
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <Card>
                <div className="text-center py-12">
                    <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Advanced Reports Coming Soon</h3>
                    <p className="text-gray-600 mb-4">
                        We're working on detailed charts and analytics features. Stay tuned for updates!
                    </p>
                    <div className="space-y-2 text-sm text-gray-500">
                        <p>• Interactive charts and graphs</p>
                        <p>• Custom date range analysis</p>
                        <p>• Export reports to PDF/Excel</p>
                        <p>• Budget tracking and alerts</p>
                        <p>• Goal setting and progress tracking</p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ReportsPage;
'use client';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const monthlyData = {
    labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
        { label: 'Views', data: [1200, 1900, 1500, 2100, 1800, 2400], backgroundColor: '#1976d2' },
        { label: 'Inquiries', data: [45, 72, 58, 89, 76, 102], backgroundColor: '#2e7d32' },
    ],
};

const conversionData = {
    labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
        label: 'Conversion Rate %',
        data: [18, 22, 19, 24, 21, 26],
        borderColor: '#9c27b0',
        backgroundColor: 'rgba(156, 39, 176, 0.1)',
        fill: true,
        tension: 0.4,
    }],
};

const leadSourceData = {
    labels: ['Property Inquiry', 'Direct Search', 'Referral', 'Social Media'],
    datasets: [{
        data: [45, 30, 15, 10],
        backgroundColor: ['#1976d2', '#2e7d32', '#ed6c02', '#9c27b0'],
    }],
};

export default function AnalyticsDashboard() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 bg-white rounded-xl shadow-md p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Views & Inquiries</h3>
                <div className="h-72">
                    <Bar data={monthlyData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
            </div>

            <div className="md:col-span-4 bg-white rounded-xl shadow-md p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Sources</h3>
                <div className="h-72 flex items-center justify-center">
                    <Doughnut data={leadSourceData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
            </div>

            <div className="md:col-span-6 bg-white rounded-xl shadow-md p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Rate Trend</h3>
                <div className="h-60">
                    <Line data={conversionData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
            </div>

            <div className="md:col-span-6 bg-white rounded-xl shadow-md p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
                <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">$2.4M</p>
                        <p className="text-sm text-gray-500">Total Sales Volume</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">8</p>
                        <p className="text-sm text-gray-500">Properties Sold</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-orange-500">23</p>
                        <p className="text-sm text-gray-500">Avg Days on Market</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">4.8</p>
                        <p className="text-sm text-gray-500">Client Rating</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

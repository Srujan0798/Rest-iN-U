import React, { useState } from 'react';
import {
    LayoutDashboard,
    CreditCard,
    Share2,
    Users,
    TrendingUp,
    DollarSign,
    Award,
    MessageSquare,
    Heart,
    Copy,
    Shield,
    X,
    Twitter,
    Facebook,
    Home
} from 'lucide-react';

const AdminSocialPaymentSystem = () => {
    const [activeView, setActiveView] = useState('overview');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

    // Mock Data
    const metrics = {
        users: 1247,
        mrr: 1290000,
        growth: 23.4,
        activeSubscriptions: 342
    };

    const subscriptionPlans = [
        {
            id: 'basic',
            name: 'Basic Plan',
            price: 0,
            features: ['1 Property Analysis', 'Basic Vastu Score', 'Community Access'],
            color: 'bg-gray-100'
        },
        {
            id: 'premium',
            name: 'Premium Plan',
            price: 2999,
            features: ['5 Property Analyses', 'Full AI Consultation', 'Detailed Remedies', 'Priority Support'],
            color: 'bg-gradient-to-br from-orange-100 to-amber-100 border-orange-200',
            popular: true
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            price: 9999,
            features: ['Unlimited Analyses', 'White-label Reports', 'API Access', 'Dedicated Account Manager'],
            color: 'bg-blue-50'
        }
    ];

    // Components
    const OverviewView = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="text-green-600 text-sm font-medium flex items-center">
                            <TrendingUp className="w-3 h-3 mr-1" /> +12%
                        </span>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
                    <p className="text-2xl font-bold text-gray-900">{metrics.users.toLocaleString()}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-green-50 rounded-lg">
                            <DollarSign className="w-6 h-6 text-green-600" />
                        </div>
                        <span className="text-green-600 text-sm font-medium flex items-center">
                            <TrendingUp className="w-3 h-3 mr-1" /> +{metrics.growth}%
                        </span>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Monthly Revenue</h3>
                    <p className="text-2xl font-bold text-gray-900">₹{(metrics.mrr / 100000).toFixed(2)}L</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <Award className="w-6 h-6 text-purple-600" />
                        </div>
                        <span className="text-purple-600 text-sm font-medium">Active</span>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Paid Subscribers</h3>
                    <p className="text-2xl font-bold text-gray-900">{metrics.activeSubscriptions}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-orange-50 rounded-lg">
                            <Home className="w-6 h-6 text-orange-600" />
                        </div>
                        <span className="text-orange-600 text-sm font-medium">Beta</span>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Properties Analyzed</h3>
                    <p className="text-2xl font-bold text-gray-900">1,893</p>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Recent System Activity</h3>
                <div className="space-y-4">
                    {[
                        { action: 'New Subscription', user: 'Rahul M.', time: '2 mins ago', amount: '₹2,999' },
                        { action: 'Property Analysis', user: 'Sarah K.', time: '15 mins ago', type: 'Vastu + Ayurveda' },
                        { action: 'New User Signup', user: 'Amit P.', time: '1 hour ago', source: 'Referral' },
                        { action: 'Consultation Booked', user: 'Priya S.', time: '3 hours ago', expert: 'Dr. Sharma' }
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between py-3 border-b last:border-0">
                            <div>
                                <p className="font-medium text-gray-800">{item.action}</p>
                                <p className="text-sm text-gray-500">{item.user} • {item.time}</p>
                            </div>
                            <div className="text-right">
                                {item.amount && <span className="font-bold text-green-600">{item.amount}</span>}
                                {item.type && <span className="text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded">{item.type}</span>}
                                {item.source && <span className="text-sm bg-purple-50 text-purple-700 px-2 py-1 rounded">{item.source}</span>}
                                {item.expert && <span className="text-sm bg-orange-50 text-orange-700 px-2 py-1 rounded">{item.expert}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const PaymentView = () => (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Choose Your Plan</h2>
                <p className="text-gray-600">Unlock the full power of Ayurvedic Property Analysis</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {subscriptionPlans.map((plan) => (
                    <div key={plan.id} className={`relative rounded-2xl p-6 border ${plan.color} ${plan.popular ? 'shadow-lg scale-105' : 'shadow-sm'}`}>
                        {plan.popular && (
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                                Most Popular
                            </div>
                        )}
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                        <div className="mb-6">
                            <span className="text-4xl font-bold text-gray-900">₹{plan.price}</span>
                            <span className="text-gray-500">/month</span>
                        </div>
                        <ul className="space-y-3 mb-8">
                            {plan.features.map((feature, idx) => (
                                <li key={idx} className="flex items-center text-gray-700">
                                    <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 text-xs">✓</div>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => {
                                setSelectedPlan(plan.id);
                                setShowPaymentModal(true);
                            }}
                            className={`w-full py-3 rounded-xl font-bold transition ${plan.popular
                                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700'
                                    : 'bg-white text-gray-800 border-2 border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            {plan.price === 0 ? 'Get Started' : 'Subscribe Now'}
                        </button>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border mt-8">
                <h3 className="font-bold text-gray-800 mb-4">Transaction History</h3>
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-sm text-gray-500 border-b">
                            <th className="pb-3">Date</th>
                            <th className="pb-3">Description</th>
                            <th className="pb-3">Amount</th>
                            <th className="pb-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { date: 'Dec 20, 2024', desc: 'Premium Plan Subscription', amount: '₹2,999', status: 'Success' },
                            { date: 'Nov 20, 2024', desc: 'Premium Plan Subscription', amount: '₹2,999', status: 'Success' },
                            { date: 'Oct 20, 2024', desc: 'Premium Plan Subscription', amount: '₹2,999', status: 'Success' }
                        ].map((tx, idx) => (
                            <tr key={idx} className="border-b last:border-0">
                                <td className="py-3 text-gray-700">{tx.date}</td>
                                <td className="py-3 text-gray-800 font-medium">{tx.desc}</td>
                                <td className="py-3 text-gray-700">{tx.amount}</td>
                                <td className="py-3">
                                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                                        {tx.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const SocialView = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Community & Referrals</h2>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center">
                        <Share2 className="w-4 h-4 mr-2" />
                        Invite Friends
                    </button>
                </div>

                {/* Referral Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                        <div className="text-purple-600 text-sm font-medium mb-1">Total Referrals</div>
                        <div className="text-2xl font-bold text-gray-900">12</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                        <div className="text-green-600 text-sm font-medium mb-1">Credits Earned</div>
                        <div className="text-2xl font-bold text-gray-900">₹6,000</div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                        <div className="text-orange-600 text-sm font-medium mb-1">Pending</div>
                        <div className="text-2xl font-bold text-gray-900">2</div>
                    </div>
                </div>

                {/* Referral Link */}
                <div className="bg-gray-50 rounded-lg p-4 mb-8">
                    <label className="text-sm text-gray-600 mb-2 block">Your Unique Referral Link</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value="https://ayurvedic-property.com/invite/SUNRISE2024"
                            readOnly
                            className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm"
                        />
                        <button
                            onClick={() => alert('Copied!')}
                            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition"
                        >
                            <Copy className="w-4 h-4" />
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Share this link to earn ₹500 for every friend who subscribes.</p>
                </div>

                {/* Community Feed */}
                <div className="space-y-4">
                    <h3 className="font-bold text-gray-800">Community Updates</h3>
                    {[
                        { user: 'Rajesh Kumar', action: 'shared a success story', time: '2 hours ago', content: 'My Vata imbalance reduced significantly after implementing the suggested color therapy! 🎨✨' },
                        { user: 'Priya Sharma', action: 'asked a question', time: '4 hours ago', content: 'Has anyone tried the copper pyramid remedy for the South-West corner?' },
                        { user: 'Dr. Amit (Expert)', action: 'posted a tip', time: '6 hours ago', content: 'Winter is coming! Time to check your property\'s insulation to prevent excess Vata accumulation.' }
                    ].map((post, idx) => (
                        <div key={idx} className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition">
                            <div className="flex items-center mb-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center font-bold text-xs text-gray-600 mr-3">
                                    {post.user[0]}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {post.user} <span className="text-gray-500 font-normal">{post.action}</span>
                                    </p>
                                    <p className="text-xs text-gray-400">{post.time}</p>
                                </div>
                            </div>
                            <p className="text-gray-700 text-sm ml-11">{post.content}</p>
                            <div className="flex items-center gap-4 mt-3 ml-11">
                                <button className="text-gray-400 hover:text-red-500 flex items-center text-xs">
                                    <Heart className="w-3 h-3 mr-1" /> Like
                                </button>
                                <button className="text-gray-400 hover:text-blue-500 flex items-center text-xs">
                                    <MessageSquare className="w-3 h-3 mr-1" /> Reply
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    // Payment Modal
    const PaymentModal = () => (
        showPaymentModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Complete Payment</h2>
                        <button
                            onClick={() => setShowPaymentModal(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-4 mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600">Plan:</span>
                            <span className="font-bold text-gray-800">
                                {subscriptionPlans.find(p => p.id === selectedPlan)?.name}
                            </span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600">Duration:</span>
                            <span className="font-semibold text-gray-800">1 Month</span>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-orange-200">
                            <span className="text-gray-800 font-semibold">Total:</span>
                            <span className="text-2xl font-bold text-gray-800">
                                ₹{subscriptionPlans.find(p => p.id === selectedPlan)?.price.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            alert('Payment processing... (Demo mode)');
                            setShowPaymentModal(false);
                        }}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 rounded-xl font-bold hover:from-orange-600 hover:to-red-700 transition mb-3 shadow-lg shadow-orange-200"
                    >
                        Pay with Razorpay
                    </button>

                    <div className="text-center text-xs text-gray-500 flex items-center justify-center">
                        <Shield className="w-3 h-3 mr-1" />
                        Secure payment powered by Razorpay
                    </div>
                </div>
            </div>
        )
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-2xl mr-3 shadow-md">
                            🎛️
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">Platform Control Center</h1>
                            <p className="text-xs text-gray-500">Admin Dashboard + Payments + Social</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                            All Systems Operational
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="bg-white border-b border-gray-200 px-6">
                <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto">
                    {[
                        { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
                        { id: 'payments', label: 'Subscriptions', icon: CreditCard },
                        { id: 'social', label: 'Social & Share', icon: Share2 }
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={`flex items-center px-4 py-3 border-b-2 transition whitespace-nowrap ${activeView === item.id
                                    ? 'border-orange-500 text-orange-600 bg-orange-50'
                                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                                }`}
                        >
                            <item.icon className="w-4 h-4 mr-2" />
                            <span className="font-semibold">{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto p-6">
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {activeView === 'overview' && <OverviewView />}
                    {activeView === 'payments' && <PaymentView />}
                    {activeView === 'social' && <SocialView />}
                </div>
            </div>

            {/* Payment Modal */}
            <PaymentModal />
        </div>
    );
};

export default AdminSocialPaymentSystem;

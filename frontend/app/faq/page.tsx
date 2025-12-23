'use client';
import { useState } from 'react';
import { Search, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const faqCategories = [
    {
        name: 'Buying',
        faqs: [
            { q: 'How do I start searching for homes?', a: 'Use our search page to filter by location, price, bedrooms, and more. Save your favorite properties and set up alerts for new listings.' },
            { q: 'What is the home buying process?', a: 'The typical process includes: getting pre-approved for a mortgage, searching for homes, making an offer, home inspection, appraisal, and closing.' },
            { q: 'How do I contact an agent?', a: 'You can contact agents directly from property listings or browse our agent directory to find a specialist in your area.' },
            { q: 'What are closing costs?', a: 'Closing costs typically range from 2-5% of the home price and include fees for loan origination, title insurance, appraisal, and more.' },
        ]
    },
    {
        name: 'Selling',
        faqs: [
            { q: 'How do I get a home valuation?', a: 'Use our free home value estimator for an instant estimate, or connect with a local agent for a comprehensive market analysis.' },
            { q: 'How long does it take to sell a home?', a: 'The average time varies by market, but typically homes sell within 30-60 days. Pricing correctly is key to a faster sale.' },
            { q: 'What fees do sellers pay?', a: 'Sellers typically pay agent commissions (usually 5-6% split between agents), closing costs, and any negotiated repairs or credits.' },
            { q: 'Should I stage my home?', a: 'Yes! Staged homes often sell faster and for higher prices. Our agents can provide staging recommendations.' },
        ]
    },
    {
        name: 'Renting',
        faqs: [
            { q: 'What do I need to apply for a rental?', a: 'Typically you\'ll need proof of income, credit check authorization, references, and a photo ID. Requirements vary by landlord.' },
            { q: 'How much should I budget for rent?', a: 'A common rule is to spend no more than 30% of your gross monthly income on rent, though this varies by location.' },
            { q: 'Can I negotiate rent?', a: 'Yes! Especially during slower rental seasons or for longer lease terms. It never hurts to ask.' },
            { q: 'What is a security deposit?', a: 'A refundable deposit (usually 1-2 months rent) held by the landlord to cover potential damages or unpaid rent.' },
        ]
    },
    {
        name: 'Agents',
        faqs: [
            { q: 'How do I become a featured agent?', a: 'Sign up for an agent account and complete your profile. Premium subscriptions offer enhanced visibility and lead generation.' },
            { q: 'How does lead distribution work?', a: 'Leads from inquiries on your listings go directly to you. Premium agents also receive leads from area searches.' },
            { q: 'What analytics are available?', a: 'Our agent dashboard provides views, inquiries, conversion rates, and detailed performance metrics for all your listings.' },
            { q: 'How do I add listings?', a: 'Log in to your agent dashboard and use the "Add Listing" feature. You can import from MLS or enter details manually.' },
        ]
    },
];

export default function FAQPage() {
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState(0);
    const [expanded, setExpanded] = useState<string | false>(false);

    const filteredFaqs = faqCategories.map(cat => ({
        ...cat,
        faqs: cat.faqs.filter(faq =>
            faq.q.toLowerCase().includes(search.toLowerCase()) ||
            faq.a.toLowerCase().includes(search.toLowerCase())
        )
    })).filter(cat => cat.faqs.length > 0);

    const displayCategory = search ? filteredFaqs : [faqCategories[activeTab]];

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-10">
                    <HelpCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                    <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
                    <p className="text-gray-600 mb-8 text-lg">
                        Find answers to common questions about buying, selling, and renting
                    </p>

                    <div className="relative max-w-lg mx-auto">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm shadow-sm"
                            placeholder="Search FAQs..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {!search && (
                    <div className="flex justify-center mb-8 border-b overflow-x-auto">
                        {faqCategories.map((cat, i) => (
                            <button
                                key={cat.name}
                                onClick={() => setActiveTab(i)}
                                className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${activeTab === i
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                )}

                <div className="space-y-6">
                    {displayCategory.map((category) => (
                        <div key={category.name}>
                            {search && <h2 className="text-xl font-semibold mb-4 text-gray-800">{category.name}</h2>}
                            <div className="space-y-3">
                                {category.faqs.map((faq, i) => {
                                    const isExpanded = expanded === `${category.name}-${i}`;
                                    return (
                                        <div
                                            key={i}
                                            className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
                                        >
                                            <button
                                                onClick={() => setExpanded(isExpanded ? false : `${category.name}-${i}`)}
                                                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none hover:bg-gray-50 transition-colors"
                                            >
                                                <span className="font-medium text-gray-900">{faq.q}</span>
                                                {isExpanded ? (
                                                    <ChevronUp className="h-5 w-5 text-gray-500" />
                                                ) : (
                                                    <ChevronDown className="h-5 w-5 text-gray-500" />
                                                )}
                                            </button>
                                            {isExpanded && (
                                                <div className="px-6 pb-4 text-gray-600 animate-in fade-in slide-in-from-top-1 duration-200">
                                                    {faq.a}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {search && filteredFaqs.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No FAQs match your search</p>
                    </div>
                )}

                <div className="mt-12 bg-primary rounded-xl p-8 text-center text-white shadow-lg">
                    <h3 className="text-2xl font-bold mb-2">Still have questions?</h3>
                    <p className="mb-6 opacity-90">Our support team is here to help</p>
                    <a
                        href="/contact"
                        className="inline-block bg-white text-primary font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        Contact Support →
                    </a>
                </div>
            </div>
        </div>
    );
}


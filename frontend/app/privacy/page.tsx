'use client';

export default function PrivacyPage() {
    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-3xl mx-auto px-4">
                <div className="bg-white rounded-xl shadow-md p-8 md:p-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
                    <p className="text-gray-500 mb-6">Last updated: December 2025</p>
                    <hr className="border-gray-200 mb-8" />

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
                        <p className="text-gray-700 mb-3">
                            We collect information you provide directly, including name, email, phone number, and property preferences when you create an account, contact agents, or use our services.
                        </p>
                        <p className="text-gray-700">
                            We automatically collect usage data including IP address, browser type, pages visited, and time spent on our platform to improve our services.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h2>
                        <p className="text-gray-700">
                            We use your information to provide and improve our services, connect you with real estate professionals, send relevant property alerts, and communicate about your account.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Information Sharing</h2>
                        <p className="text-gray-700 mb-3">
                            We share your information with real estate agents when you submit inquiries, with service providers who help us operate our platform, and as required by law.
                        </p>
                        <p className="text-gray-700">
                            We do not sell your personal information to third parties for marketing purposes.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Cookies and Tracking</h2>
                        <p className="text-gray-700">
                            We use cookies and similar technologies to remember your preferences, analyze traffic, and personalize your experience. You can manage cookie preferences in your browser settings.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Data Security</h2>
                        <p className="text-gray-700">
                            We implement industry-standard security measures to protect your data, including encryption, secure servers, and regular security audits.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Your Rights</h2>
                        <p className="text-gray-700">
                            You have the right to access, correct, or delete your personal information. You can update your preferences in account settings or contact us directly.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Contact Us</h2>
                        <p className="text-gray-700">
                            For privacy questions or concerns, contact us at privacy@restinu.com or through our contact page.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}


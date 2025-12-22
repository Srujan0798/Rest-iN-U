'use client';

export default function TermsPage() {
    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-3xl mx-auto px-4">
                <div className="bg-white rounded-xl shadow-md p-8 md:p-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
                    <p className="text-gray-500 mb-6">Last updated: December 2025</p>
                    <hr className="border-gray-200 mb-8" />

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
                        <p className="text-gray-700">
                            By accessing or using Rest-iN-U, you agree to be bound by these Terms of Service and all applicable laws and regulations.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Use of Service</h2>
                        <p className="text-gray-700">
                            You may use our services for lawful purposes only. You agree not to misuse our platform, submit false information, or interfere with other users' access.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">3. User Accounts</h2>
                        <p className="text-gray-700">
                            You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. Notify us immediately of any unauthorized use.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Property Listings</h2>
                        <p className="text-gray-700">
                            Property information is provided by third parties including real estate agents and MLS services. While we strive for accuracy, we cannot guarantee the completeness or accuracy of all listings.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Agent Services</h2>
                        <p className="text-gray-700">
                            Real estate agents using our platform are independent professionals. Rest-iN-U is not responsible for the actions, advice, or services provided by agents.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Intellectual Property</h2>
                        <p className="text-gray-700">
                            All content on Rest-iN-U, including text, graphics, logos, and software, is our property or licensed to us. You may not copy, distribute, or create derivative works without permission.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Limitation of Liability</h2>
                        <p className="text-gray-700">
                            Rest-iN-U is provided "as is" without warranties. We are not liable for any damages arising from your use of our services or reliance on information provided.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Changes to Terms</h2>
                        <p className="text-gray-700">
                            We may modify these terms at any time. Continued use of our services constitutes acceptance of updated terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Contact</h2>
                        <p className="text-gray-700">
                            For questions about these terms, contact us at legal@restinu.com.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}

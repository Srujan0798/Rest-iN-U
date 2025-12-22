import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar, Footer } from '../components/Layout';
import { AuthProvider } from '../context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Dharma Realty - Where Ancient Wisdom Meets Modern Real Estate',
    description: 'Find your perfect home aligned with Vastu Shastra principles, climate-safe, and blockchain-verified.',
    keywords: ['real estate', 'vastu', 'property', 'dharma', 'blockchain', 'iot', 'climate'],
    authors: [{ name: 'Dharma Realty' }],
    openGraph: {
        title: 'Dharma Realty',
        description: 'Where Ancient Wisdom Meets Modern Real Estate',
        url: 'https://dharmarealty.com',
        siteName: 'Dharma Realty',
        images: [{ url: '/og-image.png', width: 1200, height: 630 }],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Dharma Realty',
        description: 'Where Ancient Wisdom Meets Modern Real Estate',
    },
    robots: {
        index: true,
        follow: true,
    },
    icons: {
        icon: '/favicon.ico',
        apple: '/apple-touch-icon.png',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <AuthProvider>
                    <div className="min-h-screen flex flex-col">
                        <Navbar />
                        <main className="flex-1">{children}</main>
                        <Footer />
                    </div>
                </AuthProvider>
            </body>
        </html>
    );
}

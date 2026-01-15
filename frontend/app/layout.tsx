import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../src/contexts/ThemeContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Rest-iN-U - Where Ancient Wisdom Meets Modern Real Estate",
    template: "%s | Rest-iN-U",
  },
  description:
    "Revolutionary real estate platform combining 5,000-year-old Vastu Shastra, Feng Shui, Vedic Astrology with modern AI, blockchain property NFTs, climate risk analysis, and IoT monitoring. Find your perfect harmonious home.",
  keywords: [
    "real estate",
    "vastu shastra",
    "feng shui",
    "vedic astrology",
    "numerology",
    "property NFT",
    "blockchain real estate",
    "climate risk analysis",
    "AI property valuation",
    "sacred geometry",
    "ayurvedic homes",
    "smart home IoT",
    "property fractional ownership",
    "DAO real estate",
    "ancient wisdom",
  ],
  authors: [{ name: "Rest-iN-U Team" }],
  creator: "Rest-iN-U",
  publisher: "Rest-iN-U",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://rest-in-u.com",
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Rest-iN-U - Where Ancient Wisdom Meets Modern Real Estate",
    description:
      "Find harmonious properties with Vastu analysis, climate risk scores, blockchain verification, and AI-powered recommendations. The world's first Dharmic IoT real estate platform.",
    url: "https://rest-in-u.com",
    siteName: "Rest-iN-U",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rest-iN-U - Ancient Wisdom Real Estate Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rest-iN-U - Ancient Wisdom Real Estate",
    description:
      "Revolutionary platform combining Vastu, Feng Shui, Astrology with AI, Blockchain & Climate Intelligence",
    images: ["/twitter-image.png"],
    creator: "@restinu",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-search-console-verification-code",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
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
        <ThemeProvider>
          <main className="flex-1">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}

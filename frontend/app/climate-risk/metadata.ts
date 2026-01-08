import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Climate Risk Analysis - 100-Year Projections for Properties',
  description: 'Comprehensive climate risk assessment including flood risk, wildfire danger, extreme heat, sea level rise, and storm predictions. Make informed decisions with 100-year climate projections powered by AI.',
  keywords: [
    'climate risk',
    'flood risk assessment',
    'wildfire risk',
    'sea level rise',
    'climate change real estate',
    'property flood zone',
    'hurricane risk',
    'extreme weather',
    'climate resilience',
    'environmental hazards'
  ],
  openGraph: {
    title: 'Climate Risk Analysis - Rest-iN-U',
    description: '100-year climate projections for properties. Assess flood, fire, storm, and heat risks with AI-powered analysis.',
    type: 'website',
    images: [{ url: '/og-climate.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Climate Risk Analysis - Protect Your Investment',
    description: 'AI-powered 100-year climate risk projections for properties',
  },
};

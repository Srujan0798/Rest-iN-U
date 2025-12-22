import { Metadata } from 'next';
import { SEO_CONFIG } from '@/lib/config';

// ============================================================================
// Types
// ============================================================================

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  noIndex?: boolean;
  noFollow?: boolean;
  alternates?: {
    canonical?: string;
    languages?: Record<string, string>;
  };
}

export interface PropertySEOProps {
  title: string;
  description?: string;
  price: number;
  currency?: string;
  location: string;
  type: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  images?: string[];
  url: string;
  agentName?: string;
  vastuScore?: number;
}

export interface ArticleSEOProps {
  title: string;
  description: string;
  author: string;
  publishedTime: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  image?: string;
  url: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Generate full page title with template
 */
export function generateTitle(title?: string): string {
  if (!title) return SEO_CONFIG.defaultTitle;
  return SEO_CONFIG.titleTemplate.replace('%s', title);
}

/**
 * Generate absolute URL
 */
export function generateUrl(path?: string): string {
  if (!path) return SEO_CONFIG.siteUrl;
  if (path.startsWith('http')) return path;
  return `${SEO_CONFIG.siteUrl}${path.startsWith('/') ? '' : '/'}${path}`;
}

/**
 * Format price for SEO
 */
export function formatPriceForSEO(price: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

// ============================================================================
// Metadata Generators
// ============================================================================

/**
 * Generate page metadata for Next.js
 */
export function generateMetadata(props: SEOProps): Metadata {
  const {
    title,
    description = SEO_CONFIG.defaultDescription,
    keywords = [],
    image = SEO_CONFIG.ogImage,
    url,
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
    section,
    tags = [],
    noIndex = false,
    noFollow = false,
    alternates,
  } = props;

  const fullTitle = generateTitle(title);
  const fullUrl = generateUrl(url);
  const fullImage = image?.startsWith('http') ? image : generateUrl(image);

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: author ? [{ name: author }] : undefined,
    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      siteName: SEO_CONFIG.defaultTitle,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title || SEO_CONFIG.defaultTitle,
        },
      ],
      locale: 'en_IN',
      type: type as 'website' | 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [fullImage],
      creator: SEO_CONFIG.twitterHandle,
    },
    robots: {
      index: !noIndex,
      follow: !noFollow,
      googleBot: {
        index: !noIndex,
        follow: !noFollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: alternates
      ? {
          canonical: alternates.canonical,
          languages: alternates.languages,
        }
      : {
          canonical: fullUrl,
        },
  };

  // Add article-specific metadata
  if (type === 'article' && metadata.openGraph) {
    (metadata.openGraph as Record<string, unknown>).publishedTime = publishedTime;
    (metadata.openGraph as Record<string, unknown>).modifiedTime = modifiedTime;
    (metadata.openGraph as Record<string, unknown>).section = section;
    (metadata.openGraph as Record<string, unknown>).tags = tags;
  }

  return metadata;
}

/**
 * Generate property listing metadata
 */
export function generatePropertyMetadata(props: PropertySEOProps): Metadata {
  const {
    title,
    description,
    price,
    currency = 'INR',
    location,
    type,
    bedrooms,
    bathrooms,
    area,
    images = [],
    url,
    agentName,
    vastuScore,
  } = props;

  // Generate rich description
  const features: string[] = [];
  if (bedrooms) features.push(`${bedrooms} Bedrooms`);
  if (bathrooms) features.push(`${bathrooms} Bathrooms`);
  if (area) features.push(`${area.toLocaleString()} sq ft`);
  if (vastuScore) features.push(`Vastu Score: ${vastuScore}%`);

  const richDescription =
    description ||
    `${type} for sale in ${location}. ${features.join(', ')}. Listed at ${formatPriceForSEO(price, currency)}.`;

  const metadata = generateMetadata({
    title: `${title} - ${formatPriceForSEO(price, currency)}`,
    description: richDescription,
    keywords: [
      type.toLowerCase(),
      'property',
      'real estate',
      location.toLowerCase(),
      'buy',
      'vastu',
      ...(bedrooms ? [`${bedrooms} bhk`] : []),
    ],
    image: images[0],
    url,
    type: 'product',
  });

  // Add product-specific structured data
  if (metadata.openGraph) {
    (metadata.openGraph as Record<string, unknown>).type = 'product';
  }

  return metadata;
}

/**
 * Generate article/blog metadata
 */
export function generateArticleMetadata(props: ArticleSEOProps): Metadata {
  return generateMetadata({
    ...props,
    type: 'article',
  });
}

// ============================================================================
// JSON-LD Structured Data Generators
// ============================================================================

/**
 * Generate Organization structured data
 */
export function generateOrganizationSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Dharma Realty',
    url: SEO_CONFIG.siteUrl,
    logo: `${SEO_CONFIG.siteUrl}/images/logo.png`,
    description: SEO_CONFIG.defaultDescription,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Mumbai',
      addressRegion: 'Maharashtra',
      addressCountry: 'IN',
    },
    sameAs: [
      'https://facebook.com/dharmarealty',
      'https://twitter.com/dharmarealty',
      'https://linkedin.com/company/dharmarealty',
      'https://instagram.com/dharmarealty',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-22-1234-5678',
      contactType: 'customer service',
      availableLanguage: ['English', 'Hindi'],
    },
  };
}

/**
 * Generate Property structured data
 */
export function generatePropertySchema(property: {
  id: string;
  title: string;
  description?: string;
  price: number;
  currency?: string;
  address: {
    street?: string;
    city: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  type: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  images?: string[];
  url: string;
  datePosted?: string;
  agent?: {
    name: string;
    phone?: string;
    email?: string;
  };
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    '@id': `${SEO_CONFIG.siteUrl}/property/${property.id}`,
    name: property.title,
    description: property.description,
    url: property.url,
    datePosted: property.datePosted || new Date().toISOString(),
    image: property.images,
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: property.currency || 'INR',
      availability: 'https://schema.org/InStock',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.address.street,
      addressLocality: property.address.city,
      addressRegion: property.address.state,
      postalCode: property.address.postalCode,
      addressCountry: property.address.country || 'IN',
    },
    numberOfRooms: property.bedrooms,
    numberOfBathroomsTotal: property.bathrooms,
    floorSize: property.area
      ? {
          '@type': 'QuantitativeValue',
          value: property.area,
          unitCode: 'FTK', // Square feet
        }
      : undefined,
    broker: property.agent
      ? {
          '@type': 'RealEstateAgent',
          name: property.agent.name,
          telephone: property.agent.phone,
          email: property.agent.email,
        }
      : undefined,
  };
}

/**
 * Generate BreadcrumbList structured data
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: generateUrl(item.url),
    })),
  };
}

/**
 * Generate FAQ structured data
 */
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate LocalBusiness structured data
 */
export function generateLocalBusinessSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': SEO_CONFIG.siteUrl,
    name: 'Dharma Realty',
    image: `${SEO_CONFIG.siteUrl}/images/office.jpg`,
    telephone: '+91-22-1234-5678',
    email: 'contact@dharmarealty.com',
    url: SEO_CONFIG.siteUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Real Estate Tower',
      addressLocality: 'Mumbai',
      addressRegion: 'Maharashtra',
      postalCode: '400001',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 19.076,
      longitude: 72.8777,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '16:00',
      },
    ],
    priceRange: 'â‚¹â‚¹â‚¹',
  };
}

/**
 * Generate Search Action structured data
 */
export function generateSearchActionSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: SEO_CONFIG.siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SEO_CONFIG.siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

// ============================================================================
// React Component for JSON-LD
// ============================================================================

interface JsonLdProps {
  data: object | object[];
}

export function JsonLd({ data }: JsonLdProps): JSX.Element {
  const jsonLd = Array.isArray(data) ? data : [data];

  return (
    <>
      {jsonLd.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}

export default generateMetadata;

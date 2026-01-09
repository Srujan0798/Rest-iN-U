/**
 * Frontend Component Tests
 * Tests for UI components
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// ============================================================================
// Mock Next.js
// ============================================================================

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

// ============================================================================
// PropertyCard Tests
// ============================================================================

describe('PropertyCard', () => {
  const mockProperty = {
    id: '1',
    property_id: '1',
    title: 'Luxury 3BHK Apartment',
    slug: 'luxury-3bhk-apartment',
    price: 15000000,
    type: 'apartment',
    status: 'available',
    primary_photo: '/test-image.jpg',
    address: {
      street: '123 Main St',
      city: 'Mumbai',
      state: 'Maharashtra',
      zip: '400001',
    },
    bedrooms: 3,
    bathrooms: 2,
    square_feet: 1500,
    specifications: {
      bedrooms: 3,
      bathrooms: 2,
      area: 1500,
      furnishing: 'semi-furnished',
    },
    images: [{ url: '/test-image.jpg', alt: 'Property' }],
    vastuScore: 85,
    isFeatured: true,
    createdAt: new Date().toISOString(),
  };

  // Lazy import to avoid module resolution issues in test setup
  const renderPropertyCard = async () => {
    const { default: PropertyCard } = await import('@/components/PropertyCard');
    return render(<PropertyCard property={mockProperty} />);
  };

  it('displays formatted price', async () => {
    await renderPropertyCard();
    // Price should be formatted as Indian currency
    expect(screen.getByText(/15,000,000/)).toBeInTheDocument();
  });

  it('shows property specifications', async () => {
    await renderPropertyCard();
    expect(screen.getByText(/3 beds/)).toBeInTheDocument(); // bedrooms
    expect(screen.getByText(/1,500 sqft/)).toBeInTheDocument(); // area
  });
});

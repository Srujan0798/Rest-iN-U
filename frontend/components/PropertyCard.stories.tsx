import type { Meta, StoryObj } from '@storybook/react';
import PropertyCard from './PropertyCard';

const meta: Meta<typeof PropertyCard> = {
  title: 'Components/PropertyCard',
  component: PropertyCard,
  tags: ['autodocs'],
  argTypes: {
    isFavorited: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof PropertyCard>;

const mockProperty = {
  property_id: '1',
  address: {
    street: '123 Vastu Way',
    city: 'Bangalore',
    state: 'KA',
    zip: '560001',
  },
  price: 12500000,
  bedrooms: 3,
  bathrooms: 2,
  square_feet: 1500,
  primary_photo: 'https://images.unsplash.com/photo-1600596542815-22b4899975d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  status: 'ACTIVE',
  days_on_market: 2,
};

export const Default: Story = {
  args: {
    property: mockProperty,
    isFavorited: false,
  },
};

export const Favorited: Story = {
  args: {
    property: mockProperty,
    isFavorited: true,
  },
};

export const Pending: Story = {
  args: {
    property: {
      ...mockProperty,
      status: 'PENDING',
    },
  },
};

export const NewListing: Story = {
  args: {
    property: {
      ...mockProperty,
      days_on_market: 1,
    },
  },
};

export const WithoutPhoto: Story = {
  args: {
    property: {
      ...mockProperty,
      primary_photo: null,
    },
  },
};

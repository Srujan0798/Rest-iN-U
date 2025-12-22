import type { Meta, StoryObj } from '@storybook/react';
import { Heart, MapPin, Bed, Bath, Square, Compass } from 'lucide-react';

// ============================================================================
// PropertyCard Component (Inline for Storybook)
// ============================================================================

interface Property {
  id: string;
  title: string;
  price: number;
  type: string;
  status: 'available' | 'pending' | 'sold';
  address: {
    street: string;
    city: string;
    state: string;
  };
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  vastuScore?: number;
  isFeatured?: boolean;
  isPremium?: boolean;
}

interface PropertyCardProps {
  property: Property;
  isFavorite?: boolean;
  onFavoriteClick?: (id: string) => void;
  onCardClick?: (id: string) => void;
  variant?: 'grid' | 'list';
}

const formatPrice = (price: number): string => {
  if (price >= 10000000) {
    return `â‚¹${(price / 10000000).toFixed(2)} Cr`;
  }
  if (price >= 100000) {
    return `â‚¹${(price / 100000).toFixed(2)} L`;
  }
  return `â‚¹${price.toLocaleString('en-IN')}`;
};

const getVastuColor = (score?: number): string => {
  if (!score) return 'bg-gray-100 text-gray-600';
  if (score >= 80) return 'bg-green-100 text-green-700';
  if (score >= 60) return 'bg-yellow-100 text-yellow-700';
  return 'bg-red-100 text-red-700';
};

const PropertyCard = ({
  property,
  isFavorite = false,
  onFavoriteClick,
  onCardClick,
  variant = 'grid',
}: PropertyCardProps) => {
  const statusColors = {
    available: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    sold: 'bg-red-100 text-red-700',
  };

  if (variant === 'list') {
    return (
      <div 
        className="flex gap-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 cursor-pointer"
        onClick={() => onCardClick?.(property.id)}
      >
        {/* Image */}
        <div className="relative w-64 h-44 flex-shrink-0">
          <img
            src={property.images[0] || '/images/placeholder-property.jpg'}
            alt={property.title}
            className="w-full h-full object-cover rounded-lg"
          />
          {property.isPremium && (
            <span className="absolute top-2 left-2 px-2 py-1 bg-amber-500 text-white text-xs font-semibold rounded">
              Premium
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-xl font-bold text-primary-600">
                {formatPrice(property.price)}
              </p>
              <span className={`inline-block px-2 py-0.5 text-xs rounded ${statusColors[property.status]}`}>
                {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFavoriteClick?.(property.id);
              }}
              className={`p-2 rounded-full transition-colors ${
                isFavorite ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          <h3 className="font-semibold text-gray-900 mb-1">{property.title}</h3>
          
          <p className="text-sm text-gray-500 flex items-center gap-1 mb-3">
            <MapPin className="w-4 h-4" />
            {property.address.city}, {property.address.state}
          </p>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <span className="flex items-center gap-1">
              <Bed className="w-4 h-4" /> {property.bedrooms} Beds
            </span>
            <span className="flex items-center gap-1">
              <Bath className="w-4 h-4" /> {property.bathrooms} Baths
            </span>
            <span className="flex items-center gap-1">
              <Square className="w-4 h-4" /> {property.area.toLocaleString()} sq ft
            </span>
          </div>

          {property.vastuScore && (
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium w-fit ${getVastuColor(property.vastuScore)}`}>
              <Compass className="w-3 h-3" />
              Vastu: {property.vastuScore}%
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
      onClick={() => onCardClick?.(property.id)}
    >
      {/* Image */}
      <div className="relative h-48">
        <img
          src={property.images[0] || '/images/placeholder-property.jpg'}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {property.isFeatured && (
            <span className="px-2 py-1 bg-primary-600 text-white text-xs font-semibold rounded">
              Featured
            </span>
          )}
          {property.isPremium && (
            <span className="px-2 py-1 bg-amber-500 text-white text-xs font-semibold rounded">
              Premium
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteClick?.(property.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
            isFavorite ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-600 hover:bg-white'
          }`}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Status Badge */}
        <span className={`absolute bottom-3 left-3 px-2 py-1 text-xs font-medium rounded ${statusColors[property.status]}`}>
          {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <p className="text-xl font-bold text-primary-600">
            {formatPrice(property.price)}
          </p>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {property.type}
          </span>
        </div>

        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
          {property.title}
        </h3>
        
        <p className="text-sm text-gray-500 flex items-center gap-1 mb-3">
          <MapPin className="w-4 h-4" />
          {property.address.city}, {property.address.state}
        </p>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <span className="flex items-center gap-1">
            <Bed className="w-4 h-4" /> {property.bedrooms}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="w-4 h-4" /> {property.bathrooms}
          </span>
          <span className="flex items-center gap-1">
            <Square className="w-4 h-4" /> {property.area.toLocaleString()}
          </span>
        </div>

        {property.vastuScore && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium w-fit ${getVastuColor(property.vastuScore)}`}>
            <Compass className="w-3 h-3" />
            Vastu Score: {property.vastuScore}%
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// Mock Data
// ============================================================================

const mockProperty: Property = {
  id: '1',
  title: 'Luxurious 3BHK Apartment in Bandra West',
  price: 45000000,
  type: 'Apartment',
  status: 'available',
  address: {
    street: '123 Linking Road',
    city: 'Mumbai',
    state: 'Maharashtra',
  },
  bedrooms: 3,
  bathrooms: 2,
  area: 1850,
  images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
  vastuScore: 85,
  isFeatured: true,
  isPremium: false,
};

const mockPendingProperty: Property = {
  ...mockProperty,
  id: '2',
  title: 'Modern Villa with Garden',
  price: 125000000,
  type: 'Villa',
  status: 'pending',
  vastuScore: 72,
  isPremium: true,
};

const mockSoldProperty: Property = {
  ...mockProperty,
  id: '3',
  title: 'Cozy Studio Apartment',
  price: 8500000,
  type: 'Studio',
  status: 'sold',
  bedrooms: 1,
  bathrooms: 1,
  area: 450,
  vastuScore: 45,
};

// ============================================================================
// Storybook Configuration
// ============================================================================

const meta: Meta<typeof PropertyCard> = {
  title: 'Components/PropertyCard',
  component: PropertyCard,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['grid', 'list'],
      description: 'Card layout variant',
    },
    isFavorite: {
      control: 'boolean',
      description: 'Whether the property is favorited',
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PropertyCard>;

// ============================================================================
// Stories
// ============================================================================

export const Default: Story = {
  args: {
    property: mockProperty,
    variant: 'grid',
  },
};

export const Favorited: Story = {
  args: {
    property: mockProperty,
    isFavorite: true,
    variant: 'grid',
  },
};

export const PendingStatus: Story = {
  args: {
    property: mockPendingProperty,
    variant: 'grid',
  },
};

export const SoldStatus: Story = {
  args: {
    property: mockSoldProperty,
    variant: 'grid',
  },
};

export const ListVariant: Story = {
  args: {
    property: mockProperty,
    variant: 'list',
  },
  decorators: [
    (Story) => (
      <div className="max-w-3xl">
        <Story />
      </div>
    ),
  ],
};

export const LowVastuScore: Story = {
  args: {
    property: mockSoldProperty,
    variant: 'grid',
  },
};

export const HighPrice: Story = {
  args: {
    property: {
      ...mockProperty,
      price: 250000000,
      title: 'Ultra Luxury Penthouse',
    },
    variant: 'grid',
  },
};

export const PropertyGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
      <PropertyCard property={mockProperty} />
      <PropertyCard property={mockPendingProperty} isFavorite />
      <PropertyCard property={mockSoldProperty} />
      <PropertyCard property={{ ...mockProperty, id: '4', vastuScore: undefined }} />
      <PropertyCard property={{ ...mockProperty, id: '5', isFeatured: false, isPremium: true }} />
      <PropertyCard property={{ ...mockProperty, id: '6', status: 'available' }} isFavorite />
    </div>
  ),
  decorators: [(Story) => <Story />],
};

export const PropertyList: Story = {
  render: () => (
    <div className="space-y-4 max-w-4xl">
      <PropertyCard property={mockProperty} variant="list" />
      <PropertyCard property={mockPendingProperty} variant="list" isFavorite />
      <PropertyCard property={mockSoldProperty} variant="list" />
    </div>
  ),
  decorators: [(Story) => <Story />],
};

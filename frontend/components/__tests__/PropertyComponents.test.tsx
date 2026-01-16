import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  VastuScore,
  ClimateRiskBadge,
  PropertyCard,
  AuspiciousDateCard,
  PropertyCardSkeleton,
} from '../PropertyComponents';

describe('VastuScore', () => {
  describe('Color rendering', () => {
    it('should render emerald color for score >= 80', () => {
      render(<VastuScore score={85} grade="A" />);

      const scoreText = screen.getByText('85');
      expect(scoreText).toHaveClass('text-emerald-600');
    });

    it('should render amber color for score >= 60 and < 80', () => {
      render(<VastuScore score={70} grade="B" />);

      const scoreText = screen.getByText('70');
      expect(scoreText).toHaveClass('text-amber-600');
    });

    it('should render orange color for score >= 40 and < 60', () => {
      render(<VastuScore score={50} grade="C" />);

      const scoreText = screen.getByText('50');
      expect(scoreText).toHaveClass('text-orange-600');
    });

    it('should render red color for score < 40', () => {
      render(<VastuScore score={30} grade="D" />);

      const scoreText = screen.getByText('30');
      expect(scoreText).toHaveClass('text-red-600');
    });
  });

  describe('Size variations', () => {
    it('should render small size correctly', () => {
      render(<VastuScore score={85} grade="A" size="sm" />);

      const container = screen.getByText('85').closest('div');
      expect(container?.parentElement).toHaveClass('w-12', 'h-12');
    });

    it('should render medium size by default', () => {
      render(<VastuScore score={85} grade="A" />);

      const container = screen.getByText('85').closest('div');
      expect(container?.parentElement).toHaveClass('w-20', 'h-20');
    });

    it('should render large size correctly', () => {
      render(<VastuScore score={85} grade="A" size="lg" />);

      const container = screen.getByText('85').closest('div');
      expect(container?.parentElement).toHaveClass('w-28', 'h-28');
    });
  });

  describe('Label display', () => {
    it('should show label by default', () => {
      render(<VastuScore score={85} grade="A" />);

      expect(screen.getByText('Vastu Score')).toBeInTheDocument();
    });

    it('should hide label when showLabel is false', () => {
      render(<VastuScore score={85} grade="A" showLabel={false} />);

      expect(screen.queryByText('Vastu Score')).not.toBeInTheDocument();
    });
  });

  describe('Grade display', () => {
    it('should display grade for medium and large sizes', () => {
      render(<VastuScore score={85} grade="A" size="md" />);

      expect(screen.getByText('A')).toBeInTheDocument();
    });

    it('should not display grade for small size', () => {
      render(<VastuScore score={85} grade="A" size="sm" />);

      expect(screen.queryByText('A')).not.toBeInTheDocument();
    });
  });
});

describe('ClimateRiskBadge', () => {
  describe('Color rendering', () => {
    it('should render green for low risk (score <= 30)', () => {
      render(<ClimateRiskBadge riskScore={25} riskGrade="Low" />);

      const badge = screen.getByText(/Climate Risk: Low/i).closest('span');
      expect(badge).toHaveClass('bg-green-100', 'text-green-800');
    });

    it('should render yellow for moderate risk (score 31-50)', () => {
      render(<ClimateRiskBadge riskScore={45} riskGrade="Moderate" />);

      const badge = screen.getByText(/Climate Risk: Moderate/i).closest('span');
      expect(badge).toHaveClass('bg-yellow-100', 'text-yellow-800');
    });

    it('should render orange for high risk (score 51-70)', () => {
      render(<ClimateRiskBadge riskScore={65} riskGrade="High" />);

      const badge = screen.getByText(/Climate Risk: High/i).closest('span');
      expect(badge).toHaveClass('bg-orange-100', 'text-orange-800');
    });

    it('should render red for extreme risk (score > 70)', () => {
      render(<ClimateRiskBadge riskScore={85} riskGrade="Extreme" />);

      const badge = screen.getByText(/Climate Risk: Extreme/i).closest('span');
      expect(badge).toHaveClass('bg-red-100', 'text-red-800');
    });
  });

  it('should display correct risk grade', () => {
    render(<ClimateRiskBadge riskScore={25} riskGrade="Low" />);

    expect(screen.getByText(/Climate Risk: Low/i)).toBeInTheDocument();
  });
});

describe('PropertyCard', () => {
  const mockProperty = {
    id: '1',
    title: 'Beautiful Villa',
    city: 'Bangalore',
    state: 'Karnataka',
    price: 8500000,
    bedrooms: 4,
    bathrooms: 3.5,
    squareFeet: 2500,
    photos: [{ url: '/test-photo.jpg' }],
    vastuAnalysis: { overallScore: 85, grade: 'A' },
    climateAnalysis: { overallRiskScore: 25, riskGrade: 'Low' },
  };

  describe('Property details', () => {
    it('should render property title', () => {
      render(<PropertyCard property={mockProperty} />);

      expect(screen.getByText('Beautiful Villa')).toBeInTheDocument();
    });

    it('should render property location', () => {
      render(<PropertyCard property={mockProperty} />);

      expect(screen.getByText('Bangalore, Karnataka')).toBeInTheDocument();
    });

    it('should render bedroom count', () => {
      render(<PropertyCard property={mockProperty} />);

      expect(screen.getByText('4 bed')).toBeInTheDocument();
    });

    it('should render bathroom count', () => {
      render(<PropertyCard property={mockProperty} />);

      expect(screen.getByText('3.5 bath')).toBeInTheDocument();
    });

    it('should render square footage when available', () => {
      render(<PropertyCard property={mockProperty} />);

      expect(screen.getByText('2,500 sqft')).toBeInTheDocument();
    });

    it('should not render square footage when not available', () => {
      const propertyWithoutSqft = { ...mockProperty, squareFeet: undefined };
      render(<PropertyCard property={propertyWithoutSqft} />);

      expect(screen.queryByText(/sqft/i)).not.toBeInTheDocument();
    });
  });

  describe('Price formatting', () => {
    it('should format price in millions correctly', () => {
      render(<PropertyCard property={mockProperty} />);

      expect(screen.getByText('$8.5M')).toBeInTheDocument();
    });

    it('should format price in thousands correctly', () => {
      const propertyWithKPrice = { ...mockProperty, price: 500000 };
      render(<PropertyCard property={propertyWithKPrice} />);

      expect(screen.getByText('$500K')).toBeInTheDocument();
    });

    it('should format small price correctly', () => {
      const propertyWithSmallPrice = { ...mockProperty, price: 500 };
      render(<PropertyCard property={propertyWithSmallPrice} />);

      expect(screen.getByText('$500')).toBeInTheDocument();
    });
  });

  describe('Image rendering', () => {
    it('should render property image when available', () => {
      render(<PropertyCard property={mockProperty} />);

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', '/test-photo.jpg');
      expect(image).toHaveAttribute('alt', 'Beautiful Villa');
    });

    it('should render placeholder when no photos', () => {
      const propertyWithoutPhotos = { ...mockProperty, photos: undefined };
      render(<PropertyCard property={propertyWithoutPhotos} />);

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', '/placeholder-property.jpg');
    });

    it('should render placeholder when photos array is empty', () => {
      const propertyWithEmptyPhotos = { ...mockProperty, photos: [] };
      render(<PropertyCard property={propertyWithEmptyPhotos} />);

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', '/placeholder-property.jpg');
    });
  });

  describe('Vastu score display', () => {
    it('should render vastu score when available', () => {
      render(<PropertyCard property={mockProperty} />);

      expect(screen.getByText('85')).toBeInTheDocument();
    });

    it('should not render vastu score when not available', () => {
      const propertyWithoutVastu = { ...mockProperty, vastuAnalysis: undefined };
      render(<PropertyCard property={propertyWithoutVastu} />);

      expect(screen.queryByText('85')).not.toBeInTheDocument();
    });
  });

  describe('Climate risk display', () => {
    it('should render climate risk badge when available', () => {
      render(<PropertyCard property={mockProperty} />);

      expect(screen.getByText(/Climate Risk: Low/i)).toBeInTheDocument();
    });

    it('should not render climate risk badge when not available', () => {
      const propertyWithoutClimate = { ...mockProperty, climateAnalysis: undefined };
      render(<PropertyCard property={propertyWithoutClimate} />);

      expect(screen.queryByText(/Climate Risk/i)).not.toBeInTheDocument();
    });
  });

  describe('Favorite button', () => {
    it('should render favorite button when onFavorite is provided', () => {
      const mockOnFavorite = jest.fn();
      render(<PropertyCard property={mockProperty} onFavorite={mockOnFavorite} />);

      const favoriteButton = screen.getByRole('button');
      expect(favoriteButton).toBeInTheDocument();
    });

    it('should not render favorite button when onFavorite is not provided', () => {
      render(<PropertyCard property={mockProperty} />);

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('should call onFavorite when clicked', () => {
      const mockOnFavorite = jest.fn();
      render(<PropertyCard property={mockProperty} onFavorite={mockOnFavorite} />);

      const favoriteButton = screen.getByRole('button');
      fireEvent.click(favoriteButton);

      expect(mockOnFavorite).toHaveBeenCalledTimes(1);
    });

    it('should prevent event propagation when favorite clicked', () => {
      const mockOnFavorite = jest.fn();
      const mockParentClick = jest.fn();

      render(
        <div onClick={mockParentClick}>
          <PropertyCard property={mockProperty} onFavorite={mockOnFavorite} />
        </div>
      );

      const favoriteButton = screen.getByRole('button');
      fireEvent.click(favoriteButton);

      expect(mockOnFavorite).toHaveBeenCalled();
      expect(mockParentClick).not.toHaveBeenCalled();
    });

    it('should show filled heart when favorited', () => {
      const mockOnFavorite = jest.fn();
      render(
        <PropertyCard
          property={mockProperty}
          onFavorite={mockOnFavorite}
          isFavorited={true}
        />
      );

      const favoriteButton = screen.getByRole('button');
      const heartIcon = favoriteButton.querySelector('svg');
      expect(heartIcon).toHaveClass('text-red-500', 'fill-red-500');
    });

    it('should show empty heart when not favorited', () => {
      const mockOnFavorite = jest.fn();
      render(
        <PropertyCard
          property={mockProperty}
          onFavorite={mockOnFavorite}
          isFavorited={false}
        />
      );

      const favoriteButton = screen.getByRole('button');
      const heartIcon = favoriteButton.querySelector('svg');
      expect(heartIcon).toHaveClass('text-gray-400');
      expect(heartIcon).not.toHaveClass('fill-red-500');
    });
  });

  describe('Card interactions', () => {
    it('should have hover effect classes', () => {
      render(<PropertyCard property={mockProperty} />);

      const card = screen.getByText('Beautiful Villa').closest('.bg-white');
      expect(card).toHaveClass('hover:shadow-xl');
    });
  });
});

describe('AuspiciousDateCard', () => {
  const mockDate = {
    date: 'March 15, 2024',
    quality: 'Highly Auspicious',
    eventType: 'Property Purchase',
  };

  it('should render date correctly', () => {
    render(
      <AuspiciousDateCard
        date={mockDate.date}
        quality={mockDate.quality}
        eventType={mockDate.eventType}
      />
    );

    expect(screen.getByText('March 15, 2024')).toBeInTheDocument();
  });

  it('should render quality correctly', () => {
    render(
      <AuspiciousDateCard
        date={mockDate.date}
        quality={mockDate.quality}
        eventType={mockDate.eventType}
      />
    );

    expect(screen.getByText('Highly Auspicious')).toBeInTheDocument();
  });

  it('should render event type correctly', () => {
    render(
      <AuspiciousDateCard
        date={mockDate.date}
        quality={mockDate.quality}
        eventType={mockDate.eventType}
      />
    );

    expect(screen.getByText('Property Purchase')).toBeInTheDocument();
  });

  it('should have purple gradient styling', () => {
    render(
      <AuspiciousDateCard
        date={mockDate.date}
        quality={mockDate.quality}
        eventType={mockDate.eventType}
      />
    );

    const card = screen.getByText('March 15, 2024').closest('.bg-gradient-to-br');
    expect(card).toHaveClass('from-purple-50', 'to-indigo-50');
  });
});

describe('PropertyCardSkeleton', () => {
  it('should render skeleton with animation', () => {
    render(<PropertyCardSkeleton />);

    const skeleton = document.querySelector('.animate-pulse');
    expect(skeleton).toBeInTheDocument();
  });

  it('should render image placeholder', () => {
    render(<PropertyCardSkeleton />);

    const imagePlaceholder = document.querySelector('.h-48.bg-gray-200');
    expect(imagePlaceholder).toBeInTheDocument();
  });

  it('should render multiple content placeholders', () => {
    render(<PropertyCardSkeleton />);

    const contentPlaceholders = document.querySelectorAll('.bg-gray-200.rounded');
    expect(contentPlaceholders.length).toBeGreaterThanOrEqual(5);
  });

  it('should have proper container styling', () => {
    render(<PropertyCardSkeleton />);

    const container = document.querySelector('.bg-white.rounded-xl.shadow-md');
    expect(container).toBeInTheDocument();
  });
});

describe('Edge cases', () => {
  it('should handle PropertyCard with minimal data', () => {
    const minimalProperty = {
      id: '1',
      title: 'Test',
      city: 'City',
      state: 'State',
      price: 100000,
      bedrooms: 1,
      bathrooms: 1,
    };

    render(<PropertyCard property={minimalProperty} />);

    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('City, State')).toBeInTheDocument();
  });

  it('should handle VastuScore with edge values', () => {
    render(<VastuScore score={0} grade="F" />);
    expect(screen.getByText('0')).toBeInTheDocument();

    render(<VastuScore score={100} grade="A+" />);
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('should handle ClimateRiskBadge with edge values', () => {
    render(<ClimateRiskBadge riskScore={0} riskGrade="None" />);
    expect(screen.getByText(/Climate Risk: None/i)).toBeInTheDocument();

    render(<ClimateRiskBadge riskScore={100} riskGrade="Extreme" />);
    expect(screen.getByText(/Climate Risk: Extreme/i)).toBeInTheDocument();
  });

  it('should handle long property title', () => {
    const propertyWithLongTitle = {
      id: '1',
      title: 'This is a very long property title that should be truncated when displayed on the card',
      city: 'City',
      state: 'State',
      price: 100000,
      bedrooms: 1,
      bathrooms: 1,
    };

    render(<PropertyCard property={propertyWithLongTitle} />);

    const title = screen.getByText(propertyWithLongTitle.title);
    expect(title).toHaveClass('line-clamp-1');
  });
});

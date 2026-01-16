import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchPage from '../page';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

// Mock the usePropertySearch hook
const mockSearch = jest.fn();
const mockNaturalSearch = jest.fn();

jest.mock('../../../lib/hooks', () => ({
  usePropertySearch: () => ({
    results: mockResults,
    loading: mockLoading,
    error: mockError,
    search: mockSearch,
    naturalSearch: mockNaturalSearch,
  }),
}));

// Mock data
let mockResults: any = null;
let mockLoading = false;
let mockError: string | null = null;

const mockProperties = [
  {
    id: '1',
    title: 'Beautiful Villa in Koramangala',
    city: 'Bangalore',
    state: 'Karnataka',
    price: 8500000,
    bedrooms: 4,
    bathrooms: 3.5,
    squareFeet: 2500,
    photos: [{ url: '/test-photo-1.jpg' }],
    vastuAnalysis: { overallScore: 85, grade: 'A' },
    climateAnalysis: { overallRiskScore: 25, riskGrade: 'Low' },
  },
  {
    id: '2',
    title: 'Modern Apartment in Indiranagar',
    city: 'Bangalore',
    state: 'Karnataka',
    price: 5500000,
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1800,
    photos: [{ url: '/test-photo-2.jpg' }],
    vastuAnalysis: { overallScore: 72, grade: 'B' },
    climateAnalysis: { overallRiskScore: 35, riskGrade: 'Medium' },
  },
  {
    id: '3',
    title: 'Spacious House in Whitefield',
    city: 'Bangalore',
    state: 'Karnataka',
    price: 12000000,
    bedrooms: 5,
    bathrooms: 4,
    squareFeet: 3500,
    photos: [],
    vastuAnalysis: { overallScore: 90, grade: 'A+' },
    climateAnalysis: { overallRiskScore: 20, riskGrade: 'Low' },
  },
];

describe('SearchPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockResults = null;
    mockLoading = false;
    mockError = null;
  });

  describe('Initial render', () => {
    it('should render the search page header', () => {
      render(<SearchPage />);

      expect(screen.getByText(/Find Your REST-iN-U Home/i)).toBeInTheDocument();
      expect(screen.getByText(/Properties aligned with ancient wisdom/i)).toBeInTheDocument();
    });

    it('should render the search input', () => {
      render(<SearchPage />);

      const searchInput = screen.getByPlaceholderText(/Try: '3 bed house/i);
      expect(searchInput).toBeInTheDocument();
    });

    it('should render the search button', () => {
      render(<SearchPage />);

      expect(screen.getByRole('button', { name: /Search/i })).toBeInTheDocument();
    });

    it('should render quick filter buttons', () => {
      render(<SearchPage />);

      expect(screen.getByText(/High Vastu Score/i)).toBeInTheDocument();
      expect(screen.getByText(/Low Climate Risk/i)).toBeInTheDocument();
      expect(screen.getByText(/All Filters/i)).toBeInTheDocument();
    });

    it('should call search on initial load', () => {
      render(<SearchPage />);

      expect(mockSearch).toHaveBeenCalledWith(
        expect.objectContaining({ includeAnalysis: true })
      );
    });
  });

  describe('Search functionality', () => {
    it('should update search input value', async () => {
      const user = userEvent.setup();
      render(<SearchPage />);

      const searchInput = screen.getByPlaceholderText(/Try: '3 bed house/i);
      await user.type(searchInput, '3 bed house under 500k');

      expect(searchInput).toHaveValue('3 bed house under 500k');
    });

    it('should call naturalSearch when search button is clicked', async () => {
      const user = userEvent.setup();
      render(<SearchPage />);

      const searchInput = screen.getByPlaceholderText(/Try: '3 bed house/i);
      await user.type(searchInput, '3 bed villa with pool');

      const searchButton = screen.getByRole('button', { name: /Search/i });
      await user.click(searchButton);

      expect(mockNaturalSearch).toHaveBeenCalledWith('3 bed villa with pool');
    });

    it('should call naturalSearch when Enter is pressed', async () => {
      const user = userEvent.setup();
      render(<SearchPage />);

      const searchInput = screen.getByPlaceholderText(/Try: '3 bed house/i);
      await user.type(searchInput, '4 bedroom apartment{Enter}');

      expect(mockNaturalSearch).toHaveBeenCalledWith('4 bedroom apartment');
    });

    it('should not call naturalSearch for empty query', async () => {
      const user = userEvent.setup();
      render(<SearchPage />);

      const searchButton = screen.getByRole('button', { name: /Search/i });
      await user.click(searchButton);

      expect(mockNaturalSearch).not.toHaveBeenCalled();
    });

    it('should call search with high vastu filter when quick filter is clicked', async () => {
      const user = userEvent.setup();
      render(<SearchPage />);

      const vastuButton = screen.getByText(/High Vastu Score/i);
      await user.click(vastuButton);

      expect(mockSearch).toHaveBeenCalledWith(
        expect.objectContaining({
          vastuScore: { min: 80 },
          includeAnalysis: true,
        })
      );
    });

    it('should call search with low climate risk filter when quick filter is clicked', async () => {
      const user = userEvent.setup();
      render(<SearchPage />);

      const climateButton = screen.getByText(/Low Climate Risk/i);
      await user.click(climateButton);

      expect(mockSearch).toHaveBeenCalledWith(
        expect.objectContaining({
          climateRisk: { max: 30 },
          includeAnalysis: true,
        })
      );
    });
  });

  describe('Filters panel', () => {
    it('should toggle filters panel visibility', async () => {
      const user = userEvent.setup();
      render(<SearchPage />);

      // Initially filters panel is hidden
      expect(screen.queryByText('Property Type')).not.toBeInTheDocument();

      // Click All Filters button
      const filtersButton = screen.getByText(/All Filters/i);
      await user.click(filtersButton);

      // Filters panel should be visible
      expect(screen.getByText('Property Type')).toBeInTheDocument();
      expect(screen.getByText('Min Price')).toBeInTheDocument();
      expect(screen.getByText('Max Price')).toBeInTheDocument();
      expect(screen.getByText('Bedrooms')).toBeInTheDocument();
    });

    it('should display property type buttons', async () => {
      const user = userEvent.setup();
      render(<SearchPage />);

      const filtersButton = screen.getByText(/All Filters/i);
      await user.click(filtersButton);

      expect(screen.getByRole('button', { name: 'House' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Condo' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Townhouse' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Apartment' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Villa' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Land' })).toBeInTheDocument();
    });

    it('should toggle property type selection', async () => {
      const user = userEvent.setup();
      render(<SearchPage />);

      const filtersButton = screen.getByText(/All Filters/i);
      await user.click(filtersButton);

      const houseButton = screen.getByRole('button', { name: 'House' });

      // Click to select
      await user.click(houseButton);
      expect(houseButton).toHaveClass('bg-amber-500');

      // Click to deselect
      await user.click(houseButton);
      expect(houseButton).not.toHaveClass('bg-amber-500');
    });

    it('should allow multiple property types selection', async () => {
      const user = userEvent.setup();
      render(<SearchPage />);

      const filtersButton = screen.getByText(/All Filters/i);
      await user.click(filtersButton);

      const houseButton = screen.getByRole('button', { name: 'House' });
      const villaButton = screen.getByRole('button', { name: 'Villa' });

      await user.click(houseButton);
      await user.click(villaButton);

      expect(houseButton).toHaveClass('bg-amber-500');
      expect(villaButton).toHaveClass('bg-amber-500');
    });

    it('should reset filters when Reset button is clicked', async () => {
      const user = userEvent.setup();
      render(<SearchPage />);

      const filtersButton = screen.getByText(/All Filters/i);
      await user.click(filtersButton);

      // Select a property type
      const houseButton = screen.getByRole('button', { name: 'House' });
      await user.click(houseButton);
      expect(houseButton).toHaveClass('bg-amber-500');

      // Click reset
      const resetButton = screen.getByRole('button', { name: 'Reset' });
      await user.click(resetButton);

      // Property type should be deselected
      expect(houseButton).not.toHaveClass('bg-amber-500');
    });

    it('should call search when Apply Filters is clicked', async () => {
      const user = userEvent.setup();
      mockSearch.mockClear();
      render(<SearchPage />);

      const filtersButton = screen.getByText(/All Filters/i);
      await user.click(filtersButton);

      // Select House property type
      const houseButton = screen.getByRole('button', { name: 'House' });
      await user.click(houseButton);

      // Apply filters
      const applyButton = screen.getByRole('button', { name: 'Apply Filters' });
      await user.click(applyButton);

      expect(mockSearch).toHaveBeenCalledWith(
        expect.objectContaining({
          propertyTypes: ['HOUSE'],
          includeAnalysis: true,
        })
      );
    });

    it('should close filters panel after applying filters', async () => {
      const user = userEvent.setup();
      render(<SearchPage />);

      const filtersButton = screen.getByText(/All Filters/i);
      await user.click(filtersButton);

      // Filters panel visible
      expect(screen.getByText('Property Type')).toBeInTheDocument();

      // Apply filters
      const applyButton = screen.getByRole('button', { name: 'Apply Filters' });
      await user.click(applyButton);

      // Filters panel should be hidden
      expect(screen.queryByText('Property Type')).not.toBeInTheDocument();
    });
  });

  describe('Loading state', () => {
    it('should display loading skeletons when loading', () => {
      mockLoading = true;
      render(<SearchPage />);

      expect(screen.getByText('Searching...')).toBeInTheDocument();
      // Should render skeleton cards
      const skeletons = document.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe('Error state', () => {
    it('should display error message when there is an error', () => {
      mockError = 'Failed to fetch properties';
      render(<SearchPage />);

      expect(screen.getByText('Failed to fetch properties')).toBeInTheDocument();
    });

    it('should display error with red styling', () => {
      mockError = 'Network error';
      render(<SearchPage />);

      const errorElement = screen.getByText('Network error');
      expect(errorElement.closest('div')).toHaveClass('bg-red-50');
    });
  });

  describe('Results display', () => {
    it('should display property cards when results exist', () => {
      mockResults = {
        properties: mockProperties,
        pagination: { total: 3, page: 1, pages: 1 },
      };
      render(<SearchPage />);

      expect(screen.getByText('Beautiful Villa in Koramangala')).toBeInTheDocument();
      expect(screen.getByText('Modern Apartment in Indiranagar')).toBeInTheDocument();
      expect(screen.getByText('Spacious House in Whitefield')).toBeInTheDocument();
    });

    it('should display correct property count', () => {
      mockResults = {
        properties: mockProperties,
        pagination: { total: 3, page: 1, pages: 1 },
      };
      render(<SearchPage />);

      expect(screen.getByText('3 Properties Found')).toBeInTheDocument();
    });

    it('should display empty state when no results', () => {
      mockResults = {
        properties: [],
        pagination: { total: 0, page: 1, pages: 0 },
      };
      render(<SearchPage />);

      expect(screen.getByText('No properties found')).toBeInTheDocument();
      expect(screen.getByText('Try adjusting your search or filters')).toBeInTheDocument();
    });

    it('should link property cards to property detail page', () => {
      mockResults = {
        properties: mockProperties,
        pagination: { total: 3, page: 1, pages: 1 },
      };
      render(<SearchPage />);

      const links = screen.getAllByRole('link');
      expect(links[0]).toHaveAttribute('href', '/property/1');
    });

    it('should display parsed query when available', () => {
      mockResults = {
        properties: mockProperties,
        pagination: { total: 3, page: 1, pages: 1 },
        parsedQuery: { bedrooms: 3, city: 'Bangalore' },
      };
      render(<SearchPage />);

      expect(screen.getByText(/Understood:/i)).toBeInTheDocument();
      expect(screen.getByText(/bedrooms: 3/i)).toBeInTheDocument();
    });
  });

  describe('Sorting', () => {
    it('should display sort dropdown', () => {
      mockResults = {
        properties: mockProperties,
        pagination: { total: 3, page: 1, pages: 1 },
      };
      render(<SearchPage />);

      const sortSelect = screen.getByRole('combobox');
      expect(sortSelect).toBeInTheDocument();
    });

    it('should have correct sort options', () => {
      mockResults = {
        properties: mockProperties,
        pagination: { total: 3, page: 1, pages: 1 },
      };
      render(<SearchPage />);

      const sortSelect = screen.getByRole('combobox');
      const options = within(sortSelect).getAllByRole('option');

      expect(options).toHaveLength(5);
      expect(options[0]).toHaveTextContent('Newest');
      expect(options[1]).toHaveTextContent('Price: Low to High');
      expect(options[2]).toHaveTextContent('Price: High to Low');
      expect(options[3]).toHaveTextContent('Best Vastu Score');
      expect(options[4]).toHaveTextContent('Lowest Climate Risk');
    });

    it('should call search when sort option changes', async () => {
      const user = userEvent.setup();
      mockResults = {
        properties: mockProperties,
        pagination: { total: 3, page: 1, pages: 1 },
      };
      mockSearch.mockClear();
      render(<SearchPage />);

      const sortSelect = screen.getByRole('combobox');
      await user.selectOptions(sortSelect, 'price_asc');

      expect(mockSearch).toHaveBeenCalledWith(
        expect.objectContaining({
          sortBy: 'price_asc',
          includeAnalysis: true,
        })
      );
    });
  });

  describe('Pagination', () => {
    it('should display pagination when multiple pages exist', () => {
      mockResults = {
        properties: mockProperties,
        pagination: { total: 50, page: 1, pages: 3 },
      };
      render(<SearchPage />);

      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
    });

    it('should not display pagination for single page', () => {
      mockResults = {
        properties: mockProperties,
        pagination: { total: 3, page: 1, pages: 1 },
      };
      render(<SearchPage />);

      // Pagination buttons should not be present
      expect(screen.queryByRole('button', { name: '2' })).not.toBeInTheDocument();
    });

    it('should highlight current page', () => {
      mockResults = {
        properties: mockProperties,
        pagination: { total: 50, page: 2, pages: 3 },
      };
      render(<SearchPage />);

      const page2Button = screen.getByRole('button', { name: '2' });
      expect(page2Button).toHaveClass('bg-amber-500');
    });

    it('should call search with page number when pagination clicked', async () => {
      const user = userEvent.setup();
      mockResults = {
        properties: mockProperties,
        pagination: { total: 50, page: 1, pages: 3 },
      };
      mockSearch.mockClear();
      render(<SearchPage />);

      const page2Button = screen.getByRole('button', { name: '2' });
      await user.click(page2Button);

      expect(mockSearch).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 2,
          includeAnalysis: true,
        })
      );
    });

    it('should limit pagination to 5 buttons', () => {
      mockResults = {
        properties: mockProperties,
        pagination: { total: 200, page: 1, pages: 10 },
      };
      render(<SearchPage />);

      // Should only show 5 page buttons
      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: '6' })).not.toBeInTheDocument();
    });
  });

  describe('Price filter', () => {
    it('should update min price filter', async () => {
      const user = userEvent.setup();
      render(<SearchPage />);

      const filtersButton = screen.getByText(/All Filters/i);
      await user.click(filtersButton);

      // Select elements don't have accessible names, so we get all comboboxes
      const selects = screen.getAllByRole('combobox');
      // First select in filters is Min Price (index 0 after sort dropdown)
      const minPriceSelect = selects.find(s => s.querySelector('option[value="100000"]'));
      if (minPriceSelect) {
        await user.selectOptions(minPriceSelect, '500000');
      }

      const applyButton = screen.getByRole('button', { name: 'Apply Filters' });
      await user.click(applyButton);

      expect(mockSearch).toHaveBeenCalledWith(
        expect.objectContaining({
          priceRange: expect.objectContaining({ min: 500000 }),
        })
      );
    });

    it('should update max price filter', async () => {
      const user = userEvent.setup();
      render(<SearchPage />);

      const filtersButton = screen.getByText(/All Filters/i);
      await user.click(filtersButton);

      const selects = screen.getAllByRole('combobox');
      // Max price select has $2M and $5M options
      const maxPriceSelect = selects.find(s => s.querySelector('option[value="2000000"]'));
      if (maxPriceSelect) {
        await user.selectOptions(maxPriceSelect, '1000000');
      }

      const applyButton = screen.getByRole('button', { name: 'Apply Filters' });
      await user.click(applyButton);

      expect(mockSearch).toHaveBeenCalledWith(
        expect.objectContaining({
          priceRange: expect.objectContaining({ max: 1000000 }),
        })
      );
    });
  });

  describe('Bedroom filter', () => {
    it('should update bedroom filter', async () => {
      const user = userEvent.setup();
      render(<SearchPage />);

      const filtersButton = screen.getByText(/All Filters/i);
      await user.click(filtersButton);

      const selects = screen.getAllByRole('combobox');
      // Bedroom select has options 1-5
      const bedroomSelect = selects.find(s =>
        s.querySelector('option[value="1"]') &&
        s.querySelector('option[value="5"]') &&
        !s.querySelector('option[value="100000"]')
      );
      if (bedroomSelect) {
        await user.selectOptions(bedroomSelect, '3');
      }

      const applyButton = screen.getByRole('button', { name: 'Apply Filters' });
      await user.click(applyButton);

      expect(mockSearch).toHaveBeenCalledWith(
        expect.objectContaining({
          beds: expect.objectContaining({ min: 3 }),
        })
      );
    });
  });

  describe('Vastu filter', () => {
    it('should update vastu score filter', async () => {
      const user = userEvent.setup();
      render(<SearchPage />);

      const filtersButton = screen.getByText(/All Filters/i);
      await user.click(filtersButton);

      const selects = screen.getAllByRole('combobox');
      // Vastu select has options 60, 70, 80, 90
      const vastuSelect = selects.find(s =>
        s.querySelector('option[value="60"]') &&
        s.querySelector('option[value="90"]')
      );
      if (vastuSelect) {
        await user.selectOptions(vastuSelect, '80');
      }

      const applyButton = screen.getByRole('button', { name: 'Apply Filters' });
      await user.click(applyButton);

      expect(mockSearch).toHaveBeenCalledWith(
        expect.objectContaining({
          vastuScore: { min: 80 },
        })
      );
    });
  });

  describe('Accessibility', () => {
    it('should have accessible search input', () => {
      render(<SearchPage />);

      const searchInput = screen.getByPlaceholderText(/Try: '3 bed house/i);
      expect(searchInput).toHaveAttribute('type', 'text');
    });

    it('should have accessible buttons', () => {
      render(<SearchPage />);

      const searchButton = screen.getByRole('button', { name: /Search/i });
      expect(searchButton).toBeEnabled();
    });

    it('should have accessible filter select elements', async () => {
      const user = userEvent.setup();
      render(<SearchPage />);

      const filtersButton = screen.getByText(/All Filters/i);
      await user.click(filtersButton);

      const selects = screen.getAllByRole('combobox');
      selects.forEach((select) => {
        expect(select).toBeEnabled();
      });
    });
  });
});

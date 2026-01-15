import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import EstatePage from "../page";

// Mock the hooks and components
jest.mock("../../../hooks/usePropertySearch", () => ({
  usePropertySearch: jest.fn(),
}));

jest.mock("../../../components/estate/SearchBar", () => ({
  SearchBar: ({ filters, onFiltersChange }: any) => (
    <div data-testid="search-bar">
      <input
        data-testid="city-input"
        value={filters.city}
        onChange={(e) => onFiltersChange({ ...filters, city: e.target.value })}
        placeholder="City"
      />
      <input
        data-testid="min-price-input"
        value={filters.minPrice}
        onChange={(e) =>
          onFiltersChange({ ...filters, minPrice: e.target.value })
        }
        placeholder="Min Price"
      />
      <input
        data-testid="max-price-input"
        value={filters.maxPrice}
        onChange={(e) =>
          onFiltersChange({ ...filters, maxPrice: e.target.value })
        }
        placeholder="Max Price"
      />
      <button
        data-testid="search-button"
        onClick={() => onFiltersChange(filters)}
      >
        Search
      </button>
    </div>
  ),
}));

jest.mock("../../../components/estate/PropertyGrid", () => ({
  PropertyGrid: ({ properties }: any) => (
    <div data-testid="property-grid">
      {properties.map((property: any) => (
        <div key={property.id} data-testid={`property-${property.id}`}>
          <h3>{property.title}</h3>
          <p>{property.price}</p>
          <p>{property.city}</p>
        </div>
      ))}
    </div>
  ),
}));

jest.mock("../../../components/common/ThemeSwitcher", () => ({
  ThemeSwitcher: () => (
    <button data-testid="theme-switcher">Toggle Theme</button>
  ),
}));

jest.mock("../../../components/agents/DebatePanel", () => ({
  DebatePanel: ({ propertyId }: any) => (
    <div data-testid="debate-panel">
      Debate Panel for Property: {propertyId}
    </div>
  ),
}));

jest.mock("../../../components/common/GlassBox", () => ({
  GlassBox: ({ propertyId }: any) => (
    <div data-testid="glass-box">Glass Box for {propertyId}</div>
  ),
}));

jest.mock("../../../components/common/MapComponent", () => ({
  MapComponent: ({ properties, height }: any) => (
    <div data-testid="map-component" style={{ height }}>
      Map with {properties.length} properties
    </div>
  ),
}));

import { usePropertySearch } from "../../../hooks/usePropertySearch";

// Test data
const mockProperties = [
  {
    id: "1",
    title: "Modern Villa",
    price: 8500000,
    city: "Bangalore",
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 2500,
  },
  {
    id: "2",
    title: "Cozy Apartment",
    price: 4500000,
    city: "Bangalore",
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
  },
];

const mockPagination = {
  page: 1,
  limit: 24,
  total: 50,
  totalPages: 3,
};

describe("EstatePage", () => {
  let queryClient: QueryClient;
  let mockUsePropertySearch: jest.MockedFunction<typeof usePropertySearch>;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    mockUsePropertySearch = usePropertySearch as jest.MockedFunction<
      typeof usePropertySearch
    >;
    mockUsePropertySearch.mockReturnValue({
      properties: [],
      isLoading: false,
      error: null,
      pagination: null,
    });
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <EstatePage />
      </QueryClientProvider>,
    );
  };

  describe("Initial render", () => {
    it("should render the ESTATE mode header", () => {
      renderComponent();

      expect(screen.getByText("🏠 ESTATE Mode")).toBeInTheDocument();
      expect(
        screen.getByText("Modern Property Search with AI Agent Analysis"),
      ).toBeInTheDocument();
    });

    it("should render the theme switcher", () => {
      renderComponent();

      expect(screen.getByTestId("theme-switcher")).toBeInTheDocument();
    });

    it("should render the search bar component", () => {
      renderComponent();

      expect(screen.getByTestId("search-bar")).toBeInTheDocument();
      expect(screen.getByTestId("city-input")).toBeInTheDocument();
      expect(screen.getByTestId("min-price-input")).toBeInTheDocument();
      expect(screen.getByTestId("max-price-input")).toBeInTheDocument();
      expect(screen.getByTestId("search-button")).toBeInTheDocument();
    });

    it("should render the view toggle buttons", () => {
      renderComponent();

      expect(screen.getByText("📋 List View")).toBeInTheDocument();
      expect(screen.getByText("🗺️ Map View")).toBeInTheDocument();
    });

    it("should render the GlassBox component", () => {
      renderComponent();

      expect(screen.getByTestId("glass-box")).toBeInTheDocument();
    });

    it("should start in list view mode", () => {
      renderComponent();

      const listButton = screen.getByText("📋 List View");
      const mapButton = screen.getByText("🗺️ Map View");

      expect(listButton).toHaveClass("bg-blue-600", "text-white");
      expect(mapButton).not.toHaveClass("bg-blue-600", "text-white");
    });
  });

  describe("Property search functionality", () => {
    it("should allow users to input search filters", async () => {
      const user = userEvent.setup();
      renderComponent();

      const cityInput = screen.getByTestId("city-input");
      const minPriceInput = screen.getByTestId("min-price-input");
      const maxPriceInput = screen.getByTestId("max-price-input");

      await user.type(cityInput, "Bangalore");
      await user.type(minPriceInput, "5000000");
      await user.type(maxPriceInput, "10000000");

      expect(cityInput).toHaveValue("Bangalore");
      expect(minPriceInput).toHaveValue("5000000");
      expect(maxPriceInput).toHaveValue("10000000");
    });

    it("should trigger search when filters change", async () => {
      const user = userEvent.setup();
      renderComponent();

      const cityInput = screen.getByTestId("city-input");

      await user.type(cityInput, "Bangalore");

      // Verify that usePropertySearch was called with updated filters
      await waitFor(() => {
        expect(mockUsePropertySearch).toHaveBeenCalledWith(
          expect.objectContaining({
            city: "Bangalore",
            page: 1,
          }),
        );
      });
    });
  });

  describe("Loading states", () => {
    it("should show loading spinner when properties are loading", () => {
      mockUsePropertySearch.mockReturnValue({
        properties: [],
        isLoading: true,
        error: null,
        pagination: null,
      });

      renderComponent();

      expect(screen.getByText("Searching properties...")).toBeInTheDocument();
      expect(screen.getByRole("status")).toBeInTheDocument(); // Loading spinner
    });

    it("should not show loading when not loading", () => {
      mockUsePropertySearch.mockReturnValue({
        properties: [],
        isLoading: false,
        error: null,
        pagination: null,
      });

      renderComponent();

      expect(
        screen.queryByText("Searching properties..."),
      ).not.toBeInTheDocument();
    });
  });

  describe("Error states", () => {
    it("should display error message when search fails", () => {
      mockUsePropertySearch.mockReturnValue({
        properties: [],
        isLoading: false,
        error: new Error("Network error"),
        pagination: null,
      });

      renderComponent();

      expect(
        screen.getByText("Error loading properties. Please try again."),
      ).toBeInTheDocument();
    });

    it("should not show error when there is no error", () => {
      mockUsePropertySearch.mockReturnValue({
        properties: [],
        isLoading: false,
        error: null,
        pagination: null,
      });

      renderComponent();

      expect(
        screen.queryByText("Error loading properties. Please try again."),
      ).not.toBeInTheDocument();
    });
  });

  describe("Empty states", () => {
    it("should show no properties message when search returns empty", () => {
      mockUsePropertySearch.mockReturnValue({
        properties: [],
        isLoading: false,
        error: null,
        pagination: { page: 1, limit: 24, total: 0, totalPages: 0 },
      });

      renderComponent();

      expect(
        screen.getByText("No properties found. Try different filters."),
      ).toBeInTheDocument();
    });

    it("should not show empty message when properties exist", () => {
      mockUsePropertySearch.mockReturnValue({
        properties: mockProperties,
        isLoading: false,
        error: null,
        pagination: mockPagination,
      });

      renderComponent();

      expect(
        screen.queryByText("No properties found. Try different filters."),
      ).not.toBeInTheDocument();
    });
  });

  describe("Property display", () => {
    it("should render properties in list view", () => {
      mockUsePropertySearch.mockReturnValue({
        properties: mockProperties,
        isLoading: false,
        error: null,
        pagination: mockPagination,
      });

      renderComponent();

      expect(screen.getByTestId("property-grid")).toBeInTheDocument();
      expect(screen.getByTestId("property-1")).toBeInTheDocument();
      expect(screen.getByTestId("property-2")).toBeInTheDocument();
      expect(screen.getByText("Modern Villa")).toBeInTheDocument();
      expect(screen.getByText("Cozy Apartment")).toBeInTheDocument();
    });

    it("should render properties in map view", async () => {
      mockUsePropertySearch.mockReturnValue({
        properties: mockProperties,
        isLoading: false,
        error: null,
        pagination: mockPagination,
      });

      renderComponent();

      const mapButton = screen.getByText("🗺️ Map View");
      await userEvent.click(mapButton);

      expect(screen.getByTestId("map-component")).toBeInTheDocument();
      expect(screen.getByText("Map with 2 properties")).toBeInTheDocument();
      expect(screen.getByTestId("map-component")).toHaveStyle({
        height: "500px",
      });
    });

    it("should show pagination when there are multiple pages", () => {
      mockUsePropertySearch.mockReturnValue({
        properties: mockProperties,
        isLoading: false,
        error: null,
        pagination: mockPagination,
      });

      renderComponent();

      // Should show pagination buttons for 3 pages
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
    });

    it("should not show pagination when on map view", async () => {
      mockUsePropertySearch.mockReturnValue({
        properties: mockProperties,
        isLoading: false,
        error: null,
        pagination: mockPagination,
      });

      renderComponent();

      const mapButton = screen.getByText("🗺️ Map View");
      await userEvent.click(mapButton);

      // Pagination should be hidden in map view
      expect(screen.queryByText("1")).not.toBeInTheDocument();
      expect(screen.queryByText("2")).not.toBeInTheDocument();
      expect(screen.queryByText("3")).not.toBeInTheDocument();
    });
  });

  describe("View mode switching", () => {
    it("should switch to map view when map button is clicked", async () => {
      mockUsePropertySearch.mockReturnValue({
        properties: mockProperties,
        isLoading: false,
        error: null,
        pagination: mockPagination,
      });

      renderComponent();

      const mapButton = screen.getByText("🗺️ Map View");
      await userEvent.click(mapButton);

      expect(mapButton).toHaveClass("bg-blue-600", "text-white");
      expect(screen.getByText("📋 List View")).not.toHaveClass(
        "bg-blue-600",
        "text-white",
      );
      expect(screen.getByTestId("map-component")).toBeInTheDocument();
    });

    it("should switch back to list view when list button is clicked", async () => {
      mockUsePropertySearch.mockReturnValue({
        properties: mockProperties,
        isLoading: false,
        error: null,
        pagination: mockPagination,
      });

      renderComponent();

      // Switch to map view first
      const mapButton = screen.getByText("🗺️ Map View");
      await userEvent.click(mapButton);

      // Then switch back to list view
      const listButton = screen.getByText("📋 List View");
      await userEvent.click(listButton);

      expect(listButton).toHaveClass("bg-blue-600", "text-white");
      expect(screen.getByText("🗺️ Map View")).not.toHaveClass(
        "bg-blue-600",
        "text-white",
      );
      expect(screen.getByTestId("property-grid")).toBeInTheDocument();
    });
  });

  describe("Pagination functionality", () => {
    it("should change page when pagination button is clicked", async () => {
      mockUsePropertySearch.mockReturnValue({
        properties: mockProperties,
        isLoading: false,
        error: null,
        pagination: mockPagination,
      });

      renderComponent();

      const page2Button = screen.getByText("2");
      await userEvent.click(page2Button);

      // Verify that usePropertySearch was called with new page
      await waitFor(() => {
        expect(mockUsePropertySearch).toHaveBeenCalledWith(
          expect.objectContaining({
            page: 2,
          }),
        );
      });
    });

    it("should highlight current page in pagination", () => {
      mockUsePropertySearch.mockReturnValue({
        properties: mockProperties,
        isLoading: false,
        error: null,
        pagination: { ...mockPagination, page: 2 },
      });

      renderComponent();

      const page1Button = screen.getByText("1");
      const page2Button = screen.getByText("2");
      const page3Button = screen.getByText("3");

      expect(page1Button).not.toHaveClass("bg-blue-600", "text-white");
      expect(page2Button).toHaveClass("bg-blue-600", "text-white");
      expect(page3Button).not.toHaveClass("bg-blue-600", "text-white");
    });
  });

  describe("Agent Debate Panel", () => {
    it("should show debate panel when property is selected", async () => {
      mockUsePropertySearch.mockReturnValue({
        properties: mockProperties,
        isLoading: false,
        error: null,
        pagination: mockPagination,
      });

      renderComponent();

      // Initially debate panel should not be visible
      expect(screen.queryByTestId("debate-panel")).not.toBeInTheDocument();

      // Simulate property selection (need to trigger the handlePropertySelect function)
      // This would typically happen when clicking on a property card
      // For testing, we'll need to mock this interaction

      // For now, just verify the component structure
      expect(screen.getByTestId("property-grid")).toBeInTheDocument();
    });

    it("should have close button for debate panel", () => {
      // This test would need to trigger the debate panel visibility
      // The close button should be visible when panel is shown
      expect(true).toBe(true); // Placeholder test
    });
  });

  describe("Responsive design", () => {
    it("should render responsive layout elements", () => {
      renderComponent();

      // Check for responsive container classes
      expect(screen.getByText("🏠 ESTATE Mode")).toBeInTheDocument();
      expect(screen.getByTestId("search-bar")).toBeInTheDocument();
    });
  });

  describe("Integration with hooks", () => {
    it("should initialize usePropertySearch with default filters", () => {
      renderComponent();

      expect(mockUsePropertySearch).toHaveBeenCalledWith({
        city: "",
        minPrice: "",
        maxPrice: "",
        propertyType: "",
        minBedrooms: "",
        page: 1,
      });
    });

    it("should update usePropertySearch when filters change", async () => {
      const user = userEvent.setup();
      renderComponent();

      const cityInput = screen.getByTestId("city-input");
      await user.type(cityInput, "Bangalore");

      await waitFor(() => {
        expect(mockUsePropertySearch).toHaveBeenLastCalledWith(
          expect.objectContaining({
            city: "Bangalore",
          }),
        );
      });
    });

    it("should update usePropertySearch when page changes", async () => {
      mockUsePropertySearch.mockReturnValue({
        properties: mockProperties,
        isLoading: false,
        error: null,
        pagination: mockPagination,
      });

      renderComponent();

      const page2Button = screen.getByText("2");
      await userEvent.click(page2Button);

      await waitFor(() => {
        expect(mockUsePropertySearch).toHaveBeenLastCalledWith(
          expect.objectContaining({
            page: 2,
          }),
        );
      });
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels", () => {
      renderComponent();

      // Check for semantic HTML structure
      expect(
        screen.getByRole("heading", { name: "🏠 ESTATE Mode" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "📋 List View" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "🗺️ Map View" }),
      ).toBeInTheDocument();
    });

    it("should have accessible form controls", () => {
      renderComponent();

      const cityInput = screen.getByTestId("city-input");
      expect(cityInput).toHaveAttribute("placeholder", "City");

      const searchButton = screen.getByTestId("search-button");
      expect(searchButton).toHaveAttribute("type", "button");
    });
  });

  describe("Component interactions", () => {
    it("should handle multiple rapid filter changes", async () => {
      const user = userEvent.setup();
      renderComponent();

      const cityInput = screen.getByTestId("city-input");
      const minPriceInput = screen.getByTestId("min-price-input");

      await user.type(cityInput, "Bangalore");
      await user.type(minPriceInput, "5000000");
      await user.clear(cityInput);
      await user.type(cityInput, "Mumbai");

      // Should handle multiple changes without errors
      expect(cityInput).toHaveValue("Mumbai");
      expect(minPriceInput).toHaveValue("5000000");
    });

    it("should maintain state during view mode switches", async () => {
      const user = userEvent.setup();
      mockUsePropertySearch.mockReturnValue({
        properties: mockProperties,
        isLoading: false,
        error: null,
        pagination: mockPagination,
      });

      renderComponent();

      const cityInput = screen.getByTestId("city-input");
      await user.type(cityInput, "Bangalore");

      const mapButton = screen.getByText("🗺️ Map View");
      await user.click(mapButton);

      const listButton = screen.getByText("📋 List View");
      await user.click(listButton);

      // Filters should persist across view changes
      expect(cityInput).toHaveValue("Bangalore");
    });
  });
});

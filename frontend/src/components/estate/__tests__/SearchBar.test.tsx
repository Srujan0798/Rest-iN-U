import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { SearchBar } from "../SearchBar";

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  Search: ({ className }: any) => (
    <div data-testid="search-icon" className={className} />
  ),
  Filter: ({ className }: any) => (
    <div data-testid="filter-icon" className={className} />
  ),
  MapPin: ({ className }: any) => (
    <div data-testid="map-pin-icon" className={className} />
  ),
}));

describe("SearchBar Component", () => {
  const mockOnFiltersChange = jest.fn();

  const defaultFilters = {
    city: "",
    minPrice: "",
    maxPrice: "",
    propertyType: "",
    minBedrooms: "",
    searchQuery: "",
    page: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    it("should render search bar with all elements", () => {
      render(
        <SearchBar
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
        />,
      );

      expect(
        screen.getByPlaceholderText("Search by location, property name..."),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /search/i }),
      ).toBeInTheDocument();
      expect(screen.getByTestId("filter-icon")).toBeInTheDocument();
      expect(screen.getByTestId("map-pin-icon")).toBeInTheDocument();
    });

    it("should initialize search query from filters", () => {
      const filtersWithQuery = { ...defaultFilters, searchQuery: "Bangalore" };

      render(
        <SearchBar
          filters={filtersWithQuery}
          onFiltersChange={mockOnFiltersChange}
        />,
      );

      const searchInput = screen.getByPlaceholderText(
        "Search by location, property name...",
      );
      expect(searchInput).toHaveValue("Bangalore");
    });

    it("should not show advanced filters by default", () => {
      render(
        <SearchBar
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
        />,
      );

      expect(screen.queryByText("Advanced Filters")).not.toBeInTheDocument();
    });
  });

  describe("Search Input Functionality", () => {
    it("should update search query when typing", async () => {
      const user = userEvent.setup();

      render(
        <SearchBar
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
        />,
      );

      const searchInput = screen.getByPlaceholderText(
        "Search by location, property name...",
      );
      await user.type(searchInput, "Bangalore");

      expect(searchInput).toHaveValue("Bangalore");
    });

    it("should trigger search on Enter key", async () => {
      const user = userEvent.setup();

      render(
        <SearchBar
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
        />,
      );

      const searchInput = screen.getByPlaceholderText(
        "Search by location, property name...",
      );
      await user.type(searchInput, "Bangalore");
      await user.keyboard("{Enter}");

      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        ...defaultFilters,
        searchQuery: "Bangalore",
        page: 1,
      });
    });

    it("should trigger search when clicking search button", async () => {
      const user = userEvent.setup();

      render(
        <SearchBar
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
        />,
      );

      const searchInput = screen.getByPlaceholderText(
        "Search by location, property name...",
      );
      await user.type(searchInput, "Mumbai");

      const searchButton = screen.getByRole("button", { name: /search/i });
      await user.click(searchButton);

      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        ...defaultFilters,
        searchQuery: "Mumbai",
        page: 1,
      });
    });
  });

  describe("Advanced Filters Toggle", () => {
    it("should show advanced filters when filter button is clicked", async () => {
      const user = userEvent.setup();

      render(
        <SearchBar
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
        />,
      );

      const filterButton = screen.getByTestId("filter-icon").closest("button");
      await user.click(filterButton!);

      expect(screen.getByText("Advanced Filters")).toBeInTheDocument();
      expect(screen.getByText("Clear All")).toBeInTheDocument();
    });

    it("should hide advanced filters when clicked again", async () => {
      const user = userEvent.setup();

      render(
        <SearchBar
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
        />,
      );

      // Open filters
      const filterButton = screen.getByTestId("filter-icon").closest("button");
      await user.click(filterButton!);

      // Close filters
      await user.click(filterButton!);

      expect(screen.queryByText("Advanced Filters")).not.toBeInTheDocument();
    });

    it("should render all advanced filter fields", async () => {
      const user = userEvent.setup();

      render(
        <SearchBar
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
        />,
      );

      const filterButton = screen.getByTestId("filter-icon").closest("button");
      await user.click(filterButton!);

      expect(screen.getByLabelText("City")).toBeInTheDocument();
      expect(screen.getByLabelText("Min Price (₹)")).toBeInTheDocument();
      expect(screen.getByLabelText("Max Price (₹)")).toBeInTheDocument();
      expect(screen.getByLabelText("Property Type")).toBeInTheDocument();
      expect(screen.getByLabelText("Min Bedrooms")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Apply Filters" }),
      ).toBeInTheDocument();
    });
  });

  describe("Filter Input Changes", () => {
    it("should update city filter", async () => {
      const user = userEvent.setup();

      render(
        <SearchBar
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
        />,
      );

      const filterButton = screen.getByTestId("filter-icon").closest("button");
      await user.click(filterButton!);

      const cityInput = screen.getByLabelText("City");
      await user.type(cityInput, "Bangalore");

      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        ...defaultFilters,
        city: "Bangalore",
      });
    });

    it("should update min price filter", async () => {
      const user = userEvent.setup();

      render(
        <SearchBar
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
        />,
      );

      const filterButton = screen.getByTestId("filter-icon").closest("button");
      await user.click(filterButton!);

      const minPriceInput = screen.getByLabelText("Min Price (₹)");
      await user.type(minPriceInput, "5000000");

      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        ...defaultFilters,
        minPrice: "5000000",
      });
    });

    it("should update max price filter", async () => {
      const user = userEvent.setup();

      render(
        <SearchBar
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
        />,
      );

      const filterButton = screen.getByTestId("filter-icon").closest("button");
      await user.click(filterButton!);

      const maxPriceInput = screen.getByLabelText("Max Price (₹)");
      await user.type(maxPriceInput, "10000000");

      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        ...defaultFilters,
        maxPrice: "10000000",
      });
    });

    it("should update property type filter", async () => {
      const user = userEvent.setup();

      render(
        <SearchBar
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
        />,
      );

      const filterButton = screen.getByTestId("filter-icon").closest("button");
      await user.click(filterButton!);

      const propertyTypeSelect = screen.getByLabelText("Property Type");
      await user.selectOptions(propertyTypeSelect, "HOUSE");

      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        ...defaultFilters,
        propertyType: "HOUSE",
      });
    });

    it("should update min bedrooms filter", async () => {
      const user = userEvent.setup();

      render(
        <SearchBar
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
        />,
      );

      const filterButton = screen.getByTestId("filter-icon").closest("button");
      await user.click(filterButton!);

      const minBedroomsSelect = screen.getByLabelText("Min Bedrooms");
      await user.selectOptions(minBedroomsSelect, "3");

      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        ...defaultFilters,
        minBedrooms: "3",
      });
    });
  });

  describe("Apply Filters Functionality", () => {
    it("should apply filters when Apply Filters button is clicked", async () => {
      const user = userEvent.setup();

      render(
        <SearchBar
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
        />,
      );

      const filterButton = screen.getByTestId("filter-icon").closest("button");
      await user.click(filterButton!);

      const cityInput = screen.getByLabelText("City");
      await user.type(cityInput, "Bangalore");

      const applyButton = screen.getByRole("button", { name: "Apply Filters" });
      await user.click(applyButton);

      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        ...defaultFilters,
        city: "Bangalore",
        page: 1,
      });
    });

    it("should maintain existing filters when applying new ones", async () => {
      const user = userEvent.setup();
      const existingFilters = {
        ...defaultFilters,
        searchQuery: "Existing query",
      };

      render(
        <SearchBar
          filters={existingFilters}
          onFiltersChange={mockOnFiltersChange}
        />,
      );

      const filterButton = screen.getByTestId("filter-icon").closest("button");
      await user.click(filterButton!);

      const cityInput = screen.getByLabelText("City");
      await user.type(cityInput, "Bangalore");

      const applyButton = screen.getByRole("button", { name: "Apply Filters" });
      await user.click(applyButton);

      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        ...existingFilters,
        city: "Bangalore",
        page: 1,
      });
    });
  });

  describe("Clear Filters Functionality", () => {
    it("should clear all filters when Clear All is clicked", async () => {
      const user = userEvent.setup();
      const filtersWithData = {
        ...defaultFilters,
        searchQuery: "Bangalore",
        city: "Bangalore",
        minPrice: "5000000",
        maxPrice: "10000000",
        propertyType: "HOUSE",
        minBedrooms: "3",
      };

      render(
        <SearchBar
          filters={filtersWithData}
          onFiltersChange={mockOnFiltersChange}
        />,
      );

      const filterButton = screen.getByTestId("filter-icon").closest("button");
      await user.click(filterButton!);

      const clearButton = screen.getByRole("button", { name: "Clear All" });
      await user.click(clearButton);

      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        city: "",
        minPrice: "",
        maxPrice: "",
        propertyType: "",
        minBedrooms: "",
        searchQuery: "",
        page: 1,
      });
    });

    it("should clear search input when filters are cleared", async () => {
      const user = userEvent.setup();
      const filtersWithData = { ...defaultFilters, searchQuery: "Bangalore" };

      render(
        <SearchBar
          filters={filtersWithData}
          onFiltersChange={mockOnFiltersChange}
        />,
      );

      const filterButton = screen.getByTestId("filter-icon").closest("button");
      await user.click(filterButton!);

      const clearButton = screen.getByRole("button", { name: "Clear All" });
      await user.click(clearButton);

      const searchInput = screen.getByPlaceholderText(
        "Search by location, property name...",
      );
      await waitFor(() => {
        expect(searchInput).toHaveValue("");
      });
    });
  });

  describe("Property Type Options", () => {
    it("should render all property type options", async () => {
      const user = userEvent.setup();

      render(
        <SearchBar
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
        />,
      );

      const filterButton = screen.getByTestId("filter-icon").closest("button");
      await user.click(filterButton!);

      const propertyTypeSelect = screen.getByLabelText("Property Type");

      const options = Array.from(propertyTypeSelect.querySelectorAll("option"));
      const optionTexts = options.map((option) => option.textContent);

      expect(optionTexts).toContain("All Types");
      expect(optionTexts).toContain("House");
      expect(optionTexts).toContain("Condo");
      expect(optionTexts).toContain("Apartment");
      expect(optionTexts).toContain("Villa");
    });

    it("should display selected property type", async () => {
      const user = userEvent.setup();

      render(
        <SearchBar
          filters={{ ...defaultFilters, propertyType: "VILLA" }}
          onFiltersChange={mockOnFiltersChange}
        />,
      );

      const filterButton = screen.getByTestId("filter-icon").closest("button");
      await user.click(filterButton!);

      const propertyTypeSelect = screen.getByLabelText(
        "Property Type",
      ) as HTMLSelectElement;
      expect(propertyTypeSelect.value).toBe("VILLA");
    });
  });

  describe("Bedroom Options", () => {
    it("should render all bedroom options", async () => {
      const user = userEvent.setup();

      render(
        <SearchBar
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
        />,
      );

      const filterButton = screen.getByTestId("filter-icon").closest("button");
      await user.click(filterButton!);

      const bedroomsSelect = screen.getByLabelText("Min Bedrooms");

      const options = Array.from(bedroomsSelect.querySelectorAll("option"));
      const optionTexts = options.map((option) => option.textContent);

      expect(optionTexts).toContain("Any");
      expect(optionTexts).toContain("1+");
      expect(optionTexts).toContain("2+");
      expect(optionTexts).toContain("3+");
      expect(optionTexts).toContain("4+");
    });

    it("should display selected bedroom option", async () => {
      const user = userEvent.setup();

      render(
        <SearchBar
          filters={{ ...defaultFilters, minBedrooms: "3" }}
          onFiltersChange={mockOnFiltersChange}
        />,
      );

      const filterButton = screen.getByTestId("filter-icon").closest("button");
      await user.click(filterButton!);

      const bedroomsSelect = screen.getByLabelText(
        "Min Bedrooms",
      ) as HTMLSelectElement;
      expect(bedroomsSelect.value).toBe("3");
    });
  });

  describe("Input Attributes", () => {
    it("should have correct placeholder text", () => {
      render(
        <SearchBar
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
        />,
      );

      expect(
        screen.getByPlaceholderText("Search by location, property name..."),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("e.g., Bangalore"),
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText("5000000")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("10000000")).toBeInTheDocument();
    });

    it("should have correct input types", async () => {
      const user = userEvent.setup();

      render(
        <SearchBar
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
        />,
      );

      const filterButton = screen.getByTestId("filter-icon").closest("button");
      await user.click(filterButton!);

      expect(screen.getByLabelText("Min Price (₹)")).toHaveAttribute(
        "type",
        "number",
      );
      expect(screen.getByLabelText("Max Price (₹)")).toHaveAttribute(
        "type",
        "number",
      );
      expect(screen.getByLabelText("City")).toHaveAttribute("type", "text");
    });
  });

  describe("Styling and Layout", () => {
    it("should apply correct container classes", () => {
      render(
        <SearchBar
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
        />,
      );

      const container = screen
        .getByPlaceholderText("Search by location, property name...")
        .closest(".max-w-6xl");
      expect(container).toHaveClass(
        "w-full",
        "max-w-6xl",
        "mx-auto",
        "space-y-4",
      );
    });

    it("should apply correct search bar classes", () => {
      render(
        <SearchBar
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
        />,
      );

      const searchBar = screen
        .getByPlaceholderText("Search by location, property name...")
        .closest(".border-blue-200");
      expect(searchBar).toHaveClass(
        "relative",
        "flex",
        "items-center",
        "bg-white",
        "border",
        "border-blue-200",
        "rounded-xl",
        "shadow-sm",
        "focus-within:shadow-md",
        "transition-shadow",
      );
    });

    it("should apply correct advanced filters classes", async () => {
      const user = userEvent.setup();

      render(
        <SearchBar
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
        />,
      );

      const filterButton = screen.getByTestId("filter-icon").closest("button");
      await user.click(filterButton!);

      const filtersContainer = screen
        .getByText("Advanced Filters")
        .closest(".bg-white");
      expect(filtersContainer).toHaveClass(
        "bg-white",
        "border",
        "border-blue-100",
        "rounded-xl",
        "shadow-sm",
        "p-6",
      );
    });
  });

  describe("Accessibility", () => {
    it("should have proper labels for all inputs", async () => {
      const user = userEvent.setup();

      render(
        <SearchBar
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
        />,
      );

      const filterButton = screen.getByTestId("filter-icon").closest("button");
      await user.click(filterButton!);

      expect(screen.getByLabelText("City")).toBeInTheDocument();
      expect(screen.getByLabelText("Min Price (₹)")).toBeInTheDocument();
      expect(screen.getByLabelText("Max Price (₹)")).toBeInTheDocument();
      expect(screen.getByLabelText("Property Type")).toBeInTheDocument();
      expect(screen.getByLabelText("Min Bedrooms")).toBeInTheDocument();
    });

    it("should have accessible button text", () => {
      render(
        <SearchBar
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
        />,
      );

      expect(
        screen.getByRole("button", { name: /search/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Clear All" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Apply Filters" }),
      ).toBeInTheDocument();
    });

    it("should have proper ARIA attributes", () => {
      render(
        <SearchBar
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
        />,
      );

      const searchInput = screen.getByPlaceholderText(
        "Search by location, property name...",
      );
      expect(searchInput).toHaveAttribute("type", "text");
    });
  });

  describe("State Management", () => {
    it("should handle multiple filter changes correctly", async () => {
      const user = userEvent.setup();

      render(
        <SearchBar
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
        />,
      );

      const filterButton = screen.getByTestId("filter-icon").closest("button");
      await user.click(filterButton!);

      // Change city
      const cityInput = screen.getByLabelText("City");
      await user.type(cityInput, "Bangalore");

      // Change property type
      const propertyTypeSelect = screen.getByLabelText("Property Type");
      await user.selectOptions(propertyTypeSelect, "VILLA");

      // Change min bedrooms
      const bedroomsSelect = screen.getByLabelText("Min Bedrooms");
      await user.selectOptions(bedroomsSelect, "3");

      // Apply filters
      const applyButton = screen.getByRole("button", { name: "Apply Filters" });
      await user.click(applyButton);

      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        ...defaultFilters,
        city: "Bangalore",
        propertyType: "VILLA",
        minBedrooms: "3",
        page: 1,
      });
    });

    it("should maintain filter state when toggling advanced filters", async () => {
      const user = userEvent.setup();
      const filtersWithCity = { ...defaultFilters, city: "Bangalore" };

      render(
        <SearchBar
          filters={filtersWithCity}
          onFiltersChange={mockOnFiltersChange}
        />,
      );

      // Open filters
      const filterButton = screen.getByTestId("filter-icon").closest("button");
      await user.click(filterButton!);

      // Verify city is populated
      const cityInput = screen.getByLabelText("City");
      expect(cityInput).toHaveValue("Bangalore");

      // Close filters
      await user.click(filterButton!);

      // Open again
      await user.click(filterButton!);

      // City should still be populated
      expect(cityInput).toHaveValue("Bangalore");
    });
  });

  describe("Error Handling", () => {
    it("should handle empty filter values gracefully", () => {
      const emptyFilters = { ...defaultFilters };

      render(
        <SearchBar
          filters={emptyFilters}
          onFiltersChange={mockOnFiltersChange}
        />,
      );

      expect(
        screen.getByPlaceholderText("Search by location, property name..."),
      ).toBeInTheDocument();
    });

    it("should handle invalid filter values gracefully", () => {
      const invalidFilters = {
        ...defaultFilters,
        minPrice: "invalid",
        maxPrice: "invalid",
      };

      render(
        <SearchBar
          filters={invalidFilters}
          onFiltersChange={mockOnFiltersChange}
        />,
      );

      // Should render without crashing
      expect(
        screen.getByPlaceholderText("Search by location, property name..."),
      ).toBeInTheDocument();
    });
  });

  describe("Integration", () => {
    it("should work with external filter updates", async () => {
      const { rerender } = render(
        <SearchBar
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
        />,
      );

      // Update props
      const newFilters = { ...defaultFilters, city: "New City" };
      rerender(
        <SearchBar
          filters={newFilters}
          onFiltersChange={mockOnFiltersChange}
        />,
      );

      const filterButton = screen.getByTestId("filter-icon").closest("button");
      await userEvent.click(filterButton!);

      const cityInput = screen.getByLabelText("City");
      expect(cityInput).toHaveValue("New City");
    });
  });
});

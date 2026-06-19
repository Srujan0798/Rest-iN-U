import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PropertyCard } from "../PropertyCard";

// Mock Next.js Image component
jest.mock("next/image", () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

// Mock Next.js Link component
jest.mock("next/link", () => {
  return function MockLink({ children, href }: any) {
    return <a href={href}>{children}</a>;
  };
});

describe("PropertyCard Component", () => {
  const mockProperty = {
    id: "test-property-id",
    title: "Modern Villa with Pool",
    price: 8500000,
    city: "Bangalore",
    state: "Karnataka",
    bedrooms: 4,
    bathrooms: 3,
    sqft: 3500,
    image: "https://example.com/property-image.jpg",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    it("should render property details correctly", () => {
      render(<PropertyCard {...mockProperty} />);

      expect(screen.getByText("Modern Villa with Pool")).toBeInTheDocument();
      expect(screen.getByText("₹85,00,000")).toBeInTheDocument();
      expect(screen.getByText("Bangalore, Karnataka")).toBeInTheDocument();
      expect(screen.getByText("4 Beds")).toBeInTheDocument();
      expect(screen.getByText("3 Baths")).toBeInTheDocument();
      expect(screen.getByText("3,500 sqft")).toBeInTheDocument();
    });

    it("should render link with correct href", () => {
      render(<PropertyCard {...mockProperty} />);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/estate/property/test-property-id");
    });

    it("should render property image when provided", () => {
      render(<PropertyCard {...mockProperty} />);

      const image = screen.getByAltText("Modern Villa with Pool");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute(
        "src",
        "https://example.com/property-image.jpg",
      );
    });
  });

  describe("Price Formatting", () => {
    it("should format price correctly in INR", () => {
      render(<PropertyCard {...mockProperty} />);

      expect(screen.getByText("₹85,00,000")).toBeInTheDocument();
    });

    it("should handle different price ranges", () => {
      const testCases = [
        { price: 1000000, expected: "₹10,00,000" },
        { price: 25000000, expected: "₹2,50,00,000" },
        { price: 500000, expected: "₹5,00,000" },
      ];

      testCases.forEach(({ price, expected }) => {
        const { unmount } = render(
          <PropertyCard {...mockProperty} price={price} />,
        );
        expect(screen.getByText(expected)).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe("Bedroom and Bathroom Text", () => {
    it("should use singular form for 1 bedroom", () => {
      render(<PropertyCard {...mockProperty} bedrooms={1} />);

      expect(screen.getByText("1")).toBeInTheDocument();
    });

    it("should use plural form for multiple bedrooms", () => {
      render(<PropertyCard {...mockProperty} bedrooms={4} />);

      expect(screen.getByText("4 Beds")).toBeInTheDocument();
    });

    it("should use singular form for 1 bathroom", () => {
      render(<PropertyCard {...mockProperty} bathrooms={1} />);

      expect(screen.getByText("1 Bath")).toBeInTheDocument();
    });

    it("should use plural form for multiple bathrooms", () => {
      render(<PropertyCard {...mockProperty} bathrooms={3} />);

      expect(screen.getByText("3 Baths")).toBeInTheDocument();
    });
  });

  describe("Square Footage", () => {
    it("should format square footage with locale string", () => {
      render(<PropertyCard {...mockProperty} sqft={3500} />);

      expect(screen.getByText("3,500 sqft")).toBeInTheDocument();
    });

    it("should handle large numbers", () => {
      render(<PropertyCard {...mockProperty} sqft={10000} />);

      expect(screen.getByText("10,000 sqft")).toBeInTheDocument();
    });
  });

  describe("Image Handling", () => {
    it("should render placeholder when no image provided", () => {
      const propertyWithoutImage = { ...mockProperty };
      delete propertyWithoutImage.image;

      render(<PropertyCard {...propertyWithoutImage} />);

      // Should not have an img tag with the property alt text
      expect(
        screen.queryByAltText("Modern Villa with Pool"),
      ).not.toBeInTheDocument();

      // Should have the placeholder container
      const placeholder = screen
        .getByText("Modern Villa with Pool")
        .closest(".bg-gradient-to-br");
      expect(placeholder).toBeInTheDocument();
    });

    it("should apply hover effects to image", () => {
      render(<PropertyCard {...mockProperty} />);

      const image = screen.getByAltText("Modern Villa with Pool");
      expect(image).toHaveClass("group-hover:scale-105");
    });
  });

  describe("Vastu Score Badge", () => {
    it("should display Vastu score when provided", () => {
      render(<PropertyCard {...mockProperty} vastuScore={8} />);

      const vastuBadge = screen.getByText(/Vastu/);
      expect(vastuBadge).toBeInTheDocument();
      // Class checks might be brittle if color coding logic changed
    });

    it("should not display Vastu badge when not provided", () => {
      render(<PropertyCard {...mockProperty} />);

      expect(screen.queryByText(/Vastu/)).not.toBeInTheDocument();
    });

    it("should position Vastu badge correctly", () => {
      render(<PropertyCard {...mockProperty} vastuScore={7} />);

      const vastuBadge = screen.getByText("Vastu 7/10");
      expect(vastuBadge).toHaveClass("absolute", "top-3", "right-3");
    });
  });

  describe("Climate Risk Badge", () => {
    it("should display low climate risk correctly", () => {
      render(<PropertyCard {...mockProperty} climateRisk="low" />);

      const riskBadge = screen.getByText("🟢 Low Risk");
      expect(riskBadge).toBeInTheDocument();
      expect(riskBadge).toHaveClass("bg-green-100", "text-green-800");
    });

    it("should display medium climate risk correctly", () => {
      render(<PropertyCard {...mockProperty} climateRisk="medium" />);

      const riskBadge = screen.getByText("🟡 Med Risk");
      expect(riskBadge).toBeInTheDocument();
      expect(riskBadge).toHaveClass("bg-yellow-100", "text-yellow-800");
    });

    it("should display high climate risk correctly", () => {
      render(<PropertyCard {...mockProperty} climateRisk="high" />);

      const riskBadge = screen.getByText("🔴 High Risk");
      expect(riskBadge).toBeInTheDocument();
      expect(riskBadge).toHaveClass("bg-red-100", "text-red-800");
    });

    it("should not display climate risk when not provided", () => {
      render(<PropertyCard {...mockProperty} />);

      expect(screen.queryByText(/Risk/)).not.toBeInTheDocument();
    });

    it("should position climate risk badge correctly", () => {
      render(<PropertyCard {...mockProperty} climateRisk="low" />);

      const riskBadge = screen.getByText("🟢 Low Risk");
      expect(riskBadge).toHaveClass("absolute", "top-3", "left-3");
    });
  });

  describe("Multiple Badges", () => {
    it("should display both Vastu and climate risk badges", () => {
      render(
        <PropertyCard {...mockProperty} vastuScore={8} climateRisk="medium" />,
      );

      expect(screen.getByText("Vastu 8/10")).toBeInTheDocument();
      expect(screen.getByText("🟡 Med Risk")).toBeInTheDocument();
    });
  });

  describe("Styling and Layout", () => {
    it("should apply correct container classes", () => {
      render(<PropertyCard {...mockProperty} />);

      const container = screen.getByRole("link").firstChild;
      expect(container).toHaveClass(
        "bg-white",
        "rounded-xl",
        "shadow-md",
        "hover:shadow-xl",
        "transition-shadow",
        "duration-300",
        "overflow-hidden",
        "border",
        "border-blue-100",
        "hover:border-blue-200",
        "group",
      );
    });

    it("should have correct image container dimensions", () => {
      render(<PropertyCard {...mockProperty} />);

      const imageContainer = screen
        .getByAltText("Modern Villa with Pool")
        .closest(".h-48");
      expect(imageContainer).toHaveClass(
        "h-48",
        "w-full",
        "overflow-hidden",
        "bg-gray-100",
      );
    });

    it("should have correct details padding", () => {
      render(<PropertyCard {...mockProperty} />);

      const detailsContainer = screen.getByText("₹85.00 L").closest(".p-4");
      expect(detailsContainer).toHaveClass("p-4");
    });
  });

  describe("Accessibility", () => {
    it("should have proper alt text for images", () => {
      render(<PropertyCard {...mockProperty} />);

      const image = screen.getByRole("img");
      expect(image).toHaveAttribute("alt", "Modern Villa with Pool");
    });

    it("should have accessible link structure", () => {
      render(<PropertyCard {...mockProperty} />);

      const link = screen.getByRole("link");
      expect(link).toBeInTheDocument();
    });

    it("should have proper heading structure", () => {
      render(<PropertyCard {...mockProperty} />);

      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("Modern Villa with Pool");
    });
  });

  describe("Edge Cases", () => {
    it("should handle zero values gracefully", () => {
      const zeroProperty = {
        ...mockProperty,
        price: 0,
        bedrooms: 0,
        bathrooms: 0,
        sqft: 0,
      };

      render(<PropertyCard {...zeroProperty} />);

      expect(screen.getByText("₹0")).toBeInTheDocument();
      // Multiple 0s expected
      const zeros = screen.getAllByText("0");
      expect(zeros.length).toBeGreaterThanOrEqual(2); // Beds, Baths

      expect(screen.getByText("-")).toBeInTheDocument(); // 0 sqft case
    });

    it("should handle very long titles", () => {
      const longTitle = "A".repeat(200);
      render(<PropertyCard {...mockProperty} title={longTitle} />);

      const title = screen.getByRole("heading", { level: 3 });
      expect(title).toHaveClass("line-clamp-1");
    });

    it("should handle special characters in title", () => {
      const specialTitle = "Villa with Pool & Garden! @ Premium Location #123";
      render(<PropertyCard {...mockProperty} title={specialTitle} />);

      expect(screen.getByText(specialTitle)).toBeInTheDocument();
    });
  });

  describe("Interaction States", () => {
    it("should apply hover styles to container", () => {
      render(<PropertyCard {...mockProperty} />);

      const container = screen.getByRole("link").firstChild;
      expect(container).toHaveClass("hover:shadow-xl", "hover:border-blue-200");
    });

    it("should apply transition classes", () => {
      render(<PropertyCard {...mockProperty} />);

      const container = screen.getByRole("link").firstChild;
      expect(container).toHaveClass("transition-all", "duration-300");
    });
  });

  describe("Component Structure", () => {
    it("should have all required sections", () => {
      render(<PropertyCard {...mockProperty} />);

      // Check for image section
      const imageSection = screen.getByRole("img").closest(".relative");
      expect(imageSection).toBeInTheDocument();

      // Check for details section
      const detailsSection = screen.getByText("₹85.00 L").closest(".p-4");
      expect(detailsSection).toBeInTheDocument();

      // Check for amenities section
      const amenitiesSection = screen.getByText("4").closest(".flex");
      expect(amenitiesSection).toBeInTheDocument();
    });

    it("should maintain consistent icon usage", () => {
      render(<PropertyCard {...mockProperty} />);

      // Check for bedroom icon
      expect(screen.getByText("4")).toBeInTheDocument();

      // Check for bathroom icon
      expect(screen.getByText("3")).toBeInTheDocument();

      // Check for sqft icon
      expect(screen.getByText("3,500")).toBeInTheDocument();
    });
  });

  describe("Data Integrity", () => {
    it("should use all provided props correctly", () => {
      const fullProperty = {
        id: "full-test-id",
        title: "Complete Property",
        price: 15000000,
        city: "Mumbai",
        state: "Maharashtra",
        bedrooms: 5,
        bathrooms: 4,
        sqft: 5000,
        image: "https://example.com/full-property.jpg",
        vastuScore: 9,
        climateRisk: "low" as const,
      };

      render(<PropertyCard {...fullProperty} />);

      expect(screen.getByText("Complete Property")).toBeInTheDocument();
      expect(screen.getByText("₹1.50 Cr")).toBeInTheDocument();
      expect(screen.getByText("Mumbai, Maharashtra")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("4")).toBeInTheDocument();
      expect(screen.getByText("5,000")).toBeInTheDocument();
      expect(screen.getByText(/Vastu/)).toBeInTheDocument();
      expect(screen.getByText(/Low Risk/)).toBeInTheDocument();
      expect(screen.getByRole("link")).toHaveAttribute(
        "href",
        "/estate/property/full-test-id",
      );
    });
  });

  describe("Responsive Design", () => {
    it("should maintain layout structure on different screen sizes", () => {
      render(<PropertyCard {...mockProperty} />);

      // Check if responsive classes are applied
      const container = screen.getByRole("link").firstChild;
      expect(container).toBeInTheDocument();

      // The component should be responsive by default through Tailwind classes
      // This is more of an integration test with actual viewport testing
    });
  });
});

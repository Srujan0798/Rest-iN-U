/**
 * Unit tests for Uncle Report Button component
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UncleReportButton from "../UncleReportButton";

// Mock URL.createObjectURL and URL.revokeObjectURL
const mockCreateObjectURL = jest.fn(() => "mock-url");
const mockRevokeObjectURL = jest.fn();

beforeAll(() => {
    global.URL.createObjectURL = mockCreateObjectURL;
    global.URL.revokeObjectURL = mockRevokeObjectURL;
});

afterEach(() => {
    jest.clearAllMocks();
});

const mockProperty = {
    id: "test-property-123",
    title: "3 BHK Apartment in Whitefield",
    address: "123 Main Street",
    city: "Bangalore",
    state: "Karnataka",
    price: 8500000,
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1500,
    vastuScore: 78,
    vastuGrade: "B+",
    climateRiskScore: 25,
    climateGrade: "A-",
};

describe("UncleReportButton", () => {
    it("renders download button", () => {
        render(<UncleReportButton property={mockProperty} />);

        expect(screen.getByText("Download Uncle Report™")).toBeInTheDocument();
    });

    it("shows loading state when generating report", async () => {
        render(<UncleReportButton property={mockProperty} />);

        const button = screen.getByText("Download Uncle Report™");
        fireEvent.click(button);

        expect(screen.getByText("Generating...")).toBeInTheDocument();
    });

    it("shows success state after generation", async () => {
        render(<UncleReportButton property={mockProperty} />);

        const button = screen.getByText("Download Uncle Report™");
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText("Downloaded!")).toBeInTheDocument();
        });
    });

    it("creates a downloadable blob", async () => {
        render(<UncleReportButton property={mockProperty} />);

        const button = screen.getByText("Download Uncle Report™");
        fireEvent.click(button);

        await waitFor(() => {
            expect(mockCreateObjectURL).toHaveBeenCalled();
        });
    });

    it("includes property data in report", async () => {
        render(<UncleReportButton property={mockProperty} />);

        const button = screen.getByText("Download Uncle Report™");
        fireEvent.click(button);

        // Check that blob was created (download initiated)
        await waitFor(() => {
            expect(mockCreateObjectURL).toHaveBeenCalledWith(expect.any(Blob));
        });
    });

    it("cleans up object URL after download", async () => {
        render(<UncleReportButton property={mockProperty} />);

        const button = screen.getByText("Download Uncle Report™");
        fireEvent.click(button);

        await waitFor(() => {
            expect(mockRevokeObjectURL).toHaveBeenCalledWith("mock-url");
        });
    });

    it("handles property with agent debate data", async () => {
        const propertyWithDebate = {
            ...mockProperty,
            agentDebate: {
                verdict: "GOOD_BUY",
                summary: "This is a good property",
                agents: [
                    { name: "Discovery Scout", message: "Great location" },
                    { name: "Vastu Vidya", message: "Score: 78/100" },
                ],
            },
        };

        render(<UncleReportButton property={propertyWithDebate} />);

        const button = screen.getByText("Download Uncle Report™");
        fireEvent.click(button);

        await waitFor(() => {
            expect(mockCreateObjectURL).toHaveBeenCalled();
        });
    });

    it("applies custom className", () => {
        render(<UncleReportButton property={mockProperty} className="custom-class" />);

        const button = screen.getByRole("button");
        expect(button).toHaveClass("custom-class");
    });
});

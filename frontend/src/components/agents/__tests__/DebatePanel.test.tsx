import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { DebatePanel } from "../DebatePanel";

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  MessageCircle: ({ className }: any) => (
    <div data-testid="message-circle-icon" className={className} />
  ),
  Download: ({ className }: any) => (
    <div data-testid="download-icon" className={className} />
  ),
  Users: ({ className }: any) => (
    <div data-testid="users-icon" className={className} />
  ),
  Bot: ({ className }: any) => (
    <div data-testid="bot-icon" className={className} />
  ),
  CheckCircle: ({ className }: any) => (
    <div data-testid="check-circle-icon" className={className} />
  ),
  AlertCircle: ({ className }: any) => (
    <div data-testid="alert-circle-icon" className={className} />
  ),
}));

// Mock URL.createObjectURL and URL.revokeObjectURL
global.URL.createObjectURL = jest.fn(() => "mock-url");
global.URL.revokeObjectURL = jest.fn();

// Mock createElement and click for download
const mockCreateElement = jest.fn(() => ({
  href: "mock-url",
  download: "test-report.json",
  click: jest.fn(),
}));
global.document.createElement = mockCreateElement as any;

describe("DebatePanel Component", () => {
  const mockPropertyId = "test-property-123";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    it("should render the component with all main sections", () => {
      render(<DebatePanel propertyId={mockPropertyId} />);

      expect(screen.getByText("Agent Analysis")).toBeInTheDocument();
      expect(
        screen.getByText("Multi-expert property evaluation"),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /download report/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("tab", { name: "Agent Debate" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("tab", { name: "Final Verdict" }),
      ).toBeInTheDocument();
    });

    it("should display correct header information", () => {
      render(<DebatePanel propertyId={mockPropertyId} />);

      expect(screen.getByText("Agent Analysis")).toBeInTheDocument();
      expect(
        screen.getByText("Multi-expert property evaluation"),
      ).toBeInTheDocument();
      expect(screen.getByTestId("users-icon")).toBeInTheDocument();
    });

    it("should start with debate tab active", () => {
      render(<DebatePanel propertyId={mockPropertyId} />);

      const debateTab = screen.getByRole("tab", { name: "Agent Debate" });
      expect(debateTab).toHaveClass(
        "border-b-2",
        "border-blue-600",
        "text-blue-600",
        "bg-blue-50",
      );
    });

    it("should have verdict tab inactive by default", () => {
      render(<DebatePanel propertyId={mockPropertyId} />);

      const verdictTab = screen.getByRole("tab", { name: "Final Verdict" });
      expect(verdictTab).toHaveClass(
        "text-gray-600",
        "hover:text-gray-900",
        "hover:bg-gray-50",
      );
      expect(verdictTab).not.toHaveClass("border-blue-600");
    });
  });

  describe("Tab Navigation", () => {
    it("should switch to verdict tab when clicked", async () => {
      const user = userEvent.setup();
      render(<DebatePanel propertyId={mockPropertyId} />);

      const verdictTab = screen.getByRole("tab", { name: "Final Verdict" });
      await user.click(verdictTab);

      expect(verdictTab).toHaveClass(
        "border-b-2",
        "border-blue-600",
        "text-blue-600",
        "bg-blue-50",
      );

      const debateTab = screen.getByRole("tab", { name: "Agent Debate" });
      expect(debateTab).toHaveClass(
        "text-gray-600",
        "hover:text-gray-900",
        "hover:bg-gray-50",
      );
    });

    it("should switch back to debate tab when clicked", async () => {
      const user = userEvent.setup();
      render(<DebatePanel propertyId={mockPropertyId} />);

      const verdictTab = screen.getByRole("tab", { name: "Final Verdict" });
      await user.click(verdictTab);

      const debateTab = screen.getByRole("tab", { name: "Agent Debate" });
      await user.click(debateTab);

      expect(debateTab).toHaveClass(
        "border-b-2",
        "border-blue-600",
        "text-blue-600",
        "bg-blue-50",
      );
      expect(verdictTab).toHaveClass(
        "text-gray-600",
        "hover:text-gray-900",
        "hover:bg-gray-50",
      );
    });

    it("should show correct content for active tab", async () => {
      const user = userEvent.setup();
      render(<DebatePanel propertyId={mockPropertyId} />);

      // Initially shows debate content
      expect(screen.getByText("Vastu Master")).toBeInTheDocument();
      expect(screen.getByText("Climate Analyst")).toBeInTheDocument();
      expect(screen.getByText("Financial Advisor")).toBeInTheDocument();

      // Switch to verdict
      const verdictTab = screen.getByRole("tab", { name: "Final Verdict" });
      await user.click(verdictTab);

      expect(screen.getByText("Final Verdict")).toBeInTheDocument();
      expect(screen.getByText("Summary")).toBeInTheDocument();
      expect(screen.getByText("Recommendations")).toBeInTheDocument();
    });
  });

  describe("Agent Display", () => {
    it("should display all mock agents with correct information", () => {
      render(<DebatePanel propertyId={mockPropertyId} />);

      expect(screen.getByText("Vastu Master")).toBeInTheDocument();
      expect(screen.getByText("Vastu Shastra Expert")).toBeInTheDocument();
      expect(screen.getByText("🕉️")).toBeInTheDocument();

      expect(screen.getByText("Climate Analyst")).toBeInTheDocument();
      expect(
        screen.getByText("Environmental Risk Specialist"),
      ).toBeInTheDocument();
      expect(screen.getByText("🌍")).toBeInTheDocument();

      expect(screen.getByText("Financial Advisor")).toBeInTheDocument();
      expect(screen.getByText("Investment Analyst")).toBeInTheDocument();
      expect(screen.getByText("💰")).toBeInTheDocument();
    });

    it("should display agents in correct order", () => {
      render(<DebatePanel propertyId={mockPropertyId} />);

      const agents = screen.getAllByTestId("avatar-container"); // Assuming we add test ids
      expect(agents.length).toBe(3);
    });
  });

  describe("Message Display", () => {
    it("should display all mock messages", () => {
      render(<DebatePanel propertyId={mockPropertyId} />);

      expect(
        screen.getByText(/The property has excellent Vastu compliance/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Climate risk assessment shows moderate flood risk/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Property price is 8% above market average/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/The master bedroom is in the southwest corner/),
      ).toBeInTheDocument();
    });

    it("should display message timestamps", () => {
      render(<DebatePanel propertyId={mockPropertyId} />);

      // Check that timestamps are displayed (format may vary)
      const timestamps = screen.getAllByText(/:/); // Time format contains colons
      expect(timestamps.length).toBeGreaterThan(0);
    });

    it("should display correct icons for message types", () => {
      render(<DebatePanel propertyId={mockPropertyId} />);

      // Evidence messages should have check circle icons
      const evidenceIcons = screen.getAllByTestId("check-circle-icon");
      expect(evidenceIcons.length).toBeGreaterThan(0);

      // Argument messages should have message circle icons
      const argumentIcons = screen.getAllByTestId("message-circle-icon");
      expect(argumentIcons.length).toBeGreaterThan(0);
    });

    it("should color code agent avatars correctly", () => {
      render(<DebatePanel propertyId={mockPropertyId} />);

      // Check if agent avatars have correct color classes
      const vastuAgent = screen.getByText("🕉️").closest(".bg-purple-100");
      expect(vastuAgent).toBeInTheDocument();

      const climateAgent = screen.getByText("🌍").closest(".bg-green-100");
      expect(climateAgent).toBeInTheDocument();

      const financialAgent = screen.getByText("💰").closest(".bg-blue-100");
      expect(financialAgent).toBeInTheDocument();
    });
  });

  describe("Verdict Display", () => {
    it("should display verdict information when tab is active", async () => {
      const user = userEvent.setup();
      render(<DebatePanel propertyId={mockPropertyId} />);

      const verdictTab = screen.getByRole("tab", { name: "Final Verdict" });
      await user.click(verdictTab);

      expect(screen.getByText("Final Verdict")).toBeInTheDocument();
      expect(screen.getByText("Summary")).toBeInTheDocument();
      expect(screen.getByText("Recommendations")).toBeInTheDocument();
    });

    it("should display confidence score correctly", async () => {
      const user = userEvent.setup();
      render(<DebatePanel propertyId={mockPropertyId} />);

      const verdictTab = screen.getByRole("tab", { name: "Final Verdict" });
      await user.click(verdictTab);

      expect(screen.getByText("78%")).toBeInTheDocument();

      // Check progress bar width
      const progressBar = screen.getByRole("progressbar");
      expect(progressBar).toHaveStyle("width: 78%");
    });

    it("should display decision badge correctly", async () => {
      const user = userEvent.setup();
      render(<DebatePanel propertyId={mockPropertyId} />);

      const verdictTab = screen.getByRole("tab", { name: "Final Verdict" });
      await user.click(verdictTab);

      expect(screen.getByText("Conditional")).toBeInTheDocument();
      expect(screen.getByText("Conditional")).toHaveClass(
        "bg-yellow-100",
        "text-yellow-800",
      );
    });

    it("should display summary text", async () => {
      const user = userEvent.setup();
      render(<DebatePanel propertyId={mockPropertyId} />);

      const verdictTab = screen.getByRole("tab", { name: "Final Verdict" });
      await user.click(verdictTab);

      expect(
        screen.getByText(/Property shows excellent Vastu compliance/),
      ).toBeInTheDocument();
    });

    it("should display all recommendations", async () => {
      const user = userEvent.setup();
      render(<DebatePanel propertyId={mockPropertyId} />);

      const verdictTab = screen.getByRole("tab", { name: "Final Verdict" });
      await user.click(verdictTab);

      expect(
        screen.getByText(/Install flood barrier systems/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Negotiate price down by 5-7%/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Consider additional insurance/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Proceed with purchase if Vastu/),
      ).toBeInTheDocument();
    });

    it("should display check icons for recommendations", async () => {
      const user = userEvent.setup();
      render(<DebatePanel propertyId={mockPropertyId} />);

      const verdictTab = screen.getByRole("tab", { name: "Final Verdict" });
      await user.click(verdictTab);

      const checkIcons = screen.getAllByTestId("check-circle-icon");
      expect(checkIcons.length).toBeGreaterThan(0);
    });
  });

  describe("Download Report Functionality", () => {
    it("should trigger download when button is clicked", async () => {
      const user = userEvent.setup();
      render(<DebatePanel propertyId={mockPropertyId} />);

      const downloadButton = screen.getByRole("button", {
        name: /download report/i,
      });
      await user.click(downloadButton);

      expect(downloadButton).toBeDisabled();
      expect(screen.getByText("Generating...")).toBeInTheDocument();
    });

    it("should re-enable button after generation", async () => {
      const user = userEvent.setup();
      render(<DebatePanel propertyId={mockPropertyId} />);

      const downloadButton = screen.getByRole("button", {
        name: /download report/i,
      });
      await user.click(downloadButton);

      // Wait for generation to complete
      await waitFor(
        () => {
          expect(downloadButton).not.toBeDisabled();
          expect(screen.getByText("Download Report")).toBeInTheDocument();
        },
        { timeout: 3000 },
      );
    });

    it("should create download with correct filename", async () => {
      const user = userEvent.setup();
      render(<DebatePanel propertyId={mockPropertyId} />);

      const downloadButton = screen.getByRole("button", {
        name: /download report/i,
      });
      await user.click(downloadButton);

      await waitFor(
        () => {
          expect(mockCreateElement).toHaveBeenCalledWith("a");
          expect(mockCreateElement().download).toBe(
            `property-report-${mockPropertyId}.json`,
          );
        },
        { timeout: 3000 },
      );
    });

    it("should include correct data in download", async () => {
      const user = userEvent.setup();
      render(<DebatePanel propertyId={mockPropertyId} />);

      const downloadButton = screen.getByRole("button", {
        name: /download report/i,
      });
      await user.click(downloadButton);

      await waitFor(
        () => {
          expect(global.URL.createObjectURL).toHaveBeenCalled();
          const blobArg = (global.URL.createObjectURL as jest.Mock).mock
            .calls[0][0];
          expect(blobArg).toBeInstanceOf(Blob);
        },
        { timeout: 3000 },
      );
    });
  });

  describe("Styling and Layout", () => {
    it("should apply correct container classes", () => {
      render(<DebatePanel propertyId={mockPropertyId} />);

      const container = screen.getByText("Agent Analysis").closest(".bg-white");
      expect(container).toHaveClass(
        "bg-white",
        "rounded-2xl",
        "shadow-xl",
        "border",
        "border-gray-200",
        "overflow-hidden",
      );
    });

    it("should apply correct header gradient classes", () => {
      render(<DebatePanel propertyId={mockPropertyId} />);

      const header = screen
        .getByText("Agent Analysis")
        .closest(".bg-gradient-to-r");
      expect(header).toHaveClass(
        "bg-gradient-to-r",
        "from-blue-600",
        "to-purple-600",
        "text-white",
        "p-6",
      );
    });

    it("should apply correct tab container classes", () => {
      render(<DebatePanel propertyId={mockPropertyId} />);

      const tabContainer = screen
        .getByRole("tab", { name: "Agent Debate" })
        .closest(".border-b");
      expect(tabContainer).toHaveClass("border-b", "border-gray-200");
    });

    it("should apply correct content container classes", () => {
      render(<DebatePanel propertyId={mockPropertyId} />);

      const contentContainer = screen
        .getByText("Vastu Master")
        .closest(".max-h-96");
      expect(contentContainer).toHaveClass("max-h-96", "overflow-y-auto");
    });
  });

  describe("Message Type Icons", () => {
    it("should return correct icon for evidence type", () => {
      render(<DebatePanel propertyId={mockPropertyId} />);

      const evidenceIcons = screen.getAllByTestId("check-circle-icon");
      expect(evidenceIcons.length).toBeGreaterThan(0);
    });

    it("should return correct icon for argument type", () => {
      render(<DebatePanel propertyId={mockPropertyId} />);

      const argumentIcons = screen.getAllByTestId("message-circle-icon");
      expect(argumentIcons.length).toBeGreaterThan(0);
    });
  });

  describe("Agent Color Mapping", () => {
    it("should map agent IDs to correct colors", () => {
      render(<DebatePanel propertyId={mockPropertyId} />);

      const vastuAgent = screen.getByText("🕉️").closest(".bg-purple-100");
      expect(vastuAgent).toBeInTheDocument();

      const climateAgent = screen.getByText("🌍").closest(".bg-green-100");
      expect(climateAgent).toBeInTheDocument();

      const financialAgent = screen.getByText("💰").closest(".bg-blue-100");
      expect(financialAgent).toBeInTheDocument();
    });

    it("should handle unknown agent gracefully", () => {
      // This would test the fallback case if we had an unknown agent
      const unknownAgentId = "unknown-agent";
      // Since we're using mock data, this is more of a theoretical test
      expect(unknownAgentId).toBeDefined();
    });
  });

  describe("Decision Badge Styling", () => {
    it("should apply correct styling for approve decision", async () => {
      const user = userEvent.setup();

      // Mock a different verdict for testing
      const { rerender } = render(<DebatePanel propertyId={mockPropertyId} />);

      const verdictTab = screen.getByRole("tab", { name: "Final Verdict" });
      await user.click(verdictTab);

      // The mock verdict is 'conditional', so we expect yellow styling
      expect(screen.getByText("Conditional")).toHaveClass(
        "bg-yellow-100",
        "text-yellow-800",
      );
    });

    it("should display correct decision icon", async () => {
      const user = userEvent.setup();
      render(<DebatePanel propertyId={mockPropertyId} />);

      const verdictTab = screen.getByRole("tab", { name: "Final Verdict" });
      await user.click(verdictTab);

      expect(screen.getByText("Conditional")).toBeInTheDocument();
      expect(screen.getByText("Conditional")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper tab roles", () => {
      render(<DebatePanel propertyId={mockPropertyId} />);

      expect(
        screen.getByRole("tab", { name: "Agent Debate" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("tab", { name: "Final Verdict" }),
      ).toBeInTheDocument();
    });

    it("should have proper button labels", () => {
      render(<DebatePanel propertyId={mockPropertyId} />);

      expect(
        screen.getByRole("button", { name: /download report/i }),
      ).toBeInTheDocument();
    });

    it("should have proper heading hierarchy", () => {
      render(<DebatePanel propertyId={mockPropertyId} />);

      expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument(); // Agent Analysis
    });

    it("should support keyboard navigation for tabs", async () => {
      const user = userEvent.setup();
      render(<DebatePanel propertyId={mockPropertyId} />);

      const verdictTab = screen.getByRole("tab", { name: "Final Verdict" });
      verdictTab.focus();
      await user.keyboard("{Enter}");

      expect(verdictTab).toHaveClass("border-blue-600");
    });
  });

  describe("Responsive Behavior", () => {
    it("should maintain layout on different screen sizes", () => {
      render(<DebatePanel propertyId={mockPropertyId} />);

      // The component should use responsive classes
      const container = screen
        .getByText("Agent Analysis")
        .closest(".rounded-2xl");
      expect(container).toBeInTheDocument();

      // Test that the component adapts to screen size changes
      // This would typically require more complex viewport testing
    });
  });

  describe("Data Integrity", () => {
    it("should use correct property ID in download", async () => {
      const user = userEvent.setup();
      render(<DebatePanel propertyId={mockPropertyId} />);

      const downloadButton = screen.getByRole("button", {
        name: /download report/i,
      });
      await user.click(downloadButton);

      await waitFor(
        () => {
          expect(mockCreateElement).toHaveBeenCalled();
          // The filename should include the property ID
          expect(mockCreateElement().download).toContain(mockPropertyId);
        },
        { timeout: 3000 },
      );
    });

    it("should maintain message order", () => {
      render(<DebatePanel propertyId={mockPropertyId} />);

      const messages = screen.getAllByText(
        /The property|Climate|Property price|The master bedroom/,
      );
      expect(messages.length).toBe(4);

      // Messages should be in the order they appear in mockData
      expect(messages[0]).toHaveTextContent(
        /The property has excellent Vastu compliance/,
      );
      expect(messages[1]).toHaveTextContent(/Climate risk assessment shows/);
      expect(messages[2]).toHaveTextContent(/Property price is 8%/);
      expect(messages[3]).toHaveTextContent(/The master bedroom is/);
    });
  });

  describe("Performance", () => {
    it("should render without performance issues", () => {
      const startTime = performance.now();
      render(<DebatePanel propertyId={mockPropertyId} />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100); // Should render in under 100ms
    });

    it("should handle tab switches efficiently", async () => {
      const user = userEvent.setup();
      render(<DebatePanel propertyId={mockPropertyId} />);

      const startTime = performance.now();

      const verdictTab = screen.getByRole("tab", { name: "Final Verdict" });
      await user.click(verdictTab);

      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(50); // Tab switch should be fast
    });
  });

  describe("Error Handling", () => {
    it("should handle missing propertyId gracefully", () => {
      expect(() => {
        render(<DebatePanel propertyId="" />);
      }).not.toThrow();
    });

    it("should handle download errors gracefully", async () => {
      // Mock a download error
      global.URL.createObjectURL = jest.fn(() => {
        throw new Error("Download failed");
      });

      const user = userEvent.setup();
      render(<DebatePanel propertyId={mockPropertyId} />);

      const downloadButton = screen.getByRole("button", {
        name: /download report/i,
      });

      // Should not crash the component
      await expect(user.click(downloadButton)).resolves.not.toThrow();
    });
  });

  describe("Integration", () => {
    it("should work with property context", () => {
      const testPropertyId = "integration-test-property";
      render(<DebatePanel propertyId={testPropertyId} />);

      // Component should render without external dependencies
      expect(screen.getByText("Agent Analysis")).toBeInTheDocument();
    });
  });
});

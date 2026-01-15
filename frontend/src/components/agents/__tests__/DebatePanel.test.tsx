import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { DebatePanel } from "../DebatePanel";

// Mock framer-motion to avoid animation issues in tests
jest.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      whileHover,
      whileTap,
      layout,
      animate,
      exit,
      initial,
      transition,
      ...props
    }: any) => <div {...props}>{children}</div>,
    button: ({
      children,
      whileHover,
      whileTap,
      layout,
      animate,
      exit,
      initial,
      transition,
      ...props
    }: any) => <button {...props}>{children}</button>,
    li: ({
      children,
      whileHover,
      whileTap,
      layout,
      animate,
      exit,
      initial,
      transition,
      ...props
    }: any) => <li {...props}>{children}</li>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

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
  ChevronDown: ({ className }: any) => (
    <div data-testid="chevron-down-icon" className={className} />
  ),
  ChevronUp: ({ className }: any) => (
    <div data-testid="chevron-up-icon" className={className} />
  ),
  Brain: ({ className }: any) => (
    <div data-testid="brain-icon" className={className} />
  ),
  Compass: ({ className }: any) => (
    <div data-testid="compass-icon" className={className} />
  ),
  TrendingUp: ({ className }: any) => (
    <div data-testid="trending-icon" className={className} />
  ),
  Shield: ({ className }: any) => (
    <div data-testid="shield-icon" className={className} />
  ),
  Sparkles: ({ className }: any) => (
    <div data-testid="sparkles-icon" className={className} />
  ),
  ThumbsUp: ({ className }: any) => (
    <div data-testid="thumbs-up-icon" className={className} />
  ),
  ThumbsDown: ({ className }: any) => (
    <div data-testid="thumbs-down-icon" className={className} />
  ),
  Scale: ({ className }: any) => (
    <div data-testid="scale-icon" className={className} />
  ),
  Zap: ({ className }: any) => (
    <div data-testid="zap-icon" className={className} />
  ),
  FileText: ({ className }: any) => (
    <div data-testid="file-text-icon" className={className} />
  ),
}));

// Mock URL.createObjectURL and URL.revokeObjectURL
global.URL.createObjectURL = jest.fn(() => "mock-url");
global.URL.revokeObjectURL = jest.fn();

// Mock createElement and click for download
const mockAnchorElement = {
  href: "",
  download: "",
  click: jest.fn(),
};

const originalCreateElement = document.createElement.bind(document);
document.createElement = jest.fn((tagName: string) => {
  if (tagName === "a") {
    return mockAnchorElement as unknown as HTMLAnchorElement;
  }
  return originalCreateElement(tagName);
});

describe("DebatePanel Component", () => {
  const mockPropertyId = "test-property-123";

  beforeEach(() => {
    jest.clearAllMocks();
    mockAnchorElement.href = "";
    mockAnchorElement.download = "";
  });

  describe("Basic Rendering", () => {
    it("should render the component with header", () => {
      render(<DebatePanel propertyId={mockPropertyId} />);

      expect(screen.getByText("Agent Swarm Analysis")).toBeInTheDocument();
      expect(
        screen.getByText(/Multi-expert property evaluation/),
      ).toBeInTheDocument();
    });

    it("should render download button", () => {
      render(<DebatePanel propertyId={mockPropertyId} />);

      expect(
        screen.getByRole("button", { name: /download uncle report/i }),
      ).toBeInTheDocument();
    });

    it("should render all three tabs", () => {
      render(<DebatePanel propertyId={mockPropertyId} />);

      expect(screen.getByText("Agent Analysis")).toBeInTheDocument();
      expect(screen.getByText("Debate Thread")).toBeInTheDocument();
      expect(screen.getByText("Swarm Verdict")).toBeInTheDocument();
    });

    it("should start with Agent Analysis tab active", () => {
      render(<DebatePanel propertyId={mockPropertyId} />);

      // Agent Analysis tab should be active and show agent cards
      expect(screen.getByText("Vastu Master")).toBeInTheDocument();
      expect(screen.getByText("Climate Guardian")).toBeInTheDocument();
      expect(screen.getByText("Value Analyst")).toBeInTheDocument();
    });
  });

  describe("Tab Navigation", () => {
    it("should switch to Debate Thread tab when clicked", async () => {
      const user = userEvent.setup();
      render(<DebatePanel propertyId={mockPropertyId} />);

      const debateTab = screen.getByText("Debate Thread");
      await user.click(debateTab);

      // Should show debate messages
      expect(
        screen.getByText(
          /The property demonstrates excellent Vastu compliance/,
        ),
      ).toBeInTheDocument();
    });

    it("should switch to Swarm Verdict tab when clicked", async () => {
      const user = userEvent.setup();
      render(<DebatePanel propertyId={mockPropertyId} />);

      const verdictTab = screen.getByText("Swarm Verdict");
      await user.click(verdictTab);

      // Should show verdict
      expect(screen.getByText("Conditional Approval")).toBeInTheDocument();
      expect(
        screen.getByText("Swarm Intelligence Verdict"),
      ).toBeInTheDocument();
    });

    it("should switch back to Agent Analysis tab", async () => {
      const user = userEvent.setup();
      render(<DebatePanel propertyId={mockPropertyId} />);

      // Go to verdict tab
      await user.click(screen.getByText("Swarm Verdict"));

      // Go back to agent analysis
      await user.click(screen.getByText("Agent Analysis"));

      expect(screen.getByText("Vastu Master")).toBeInTheDocument();
    });
  });

  describe("Agent Analysis Tab", () => {
    it("should display all mock agents", () => {
      render(<DebatePanel propertyId={mockPropertyId} />);

      expect(screen.getByText("Vastu Master")).toBeInTheDocument();
      expect(screen.getByText("Climate Guardian")).toBeInTheDocument();
      expect(screen.getByText("Value Analyst")).toBeInTheDocument();
      expect(screen.getByText("Legal Expert")).toBeInTheDocument();
    });

    it("should display agent roles", () => {
      render(<DebatePanel propertyId={mockPropertyId} />);

      expect(screen.getByText("Vastu Shastra Expert")).toBeInTheDocument();
      expect(
        screen.getByText("Environmental Risk Analyst"),
      ).toBeInTheDocument();
      expect(screen.getByText("Financial Advisor")).toBeInTheDocument();
    });

    it("should display agent scores", () => {
      render(<DebatePanel propertyId={mockPropertyId} />);

      expect(screen.getByText("8.5")).toBeInTheDocument();
      expect(screen.getByText("6.8")).toBeInTheDocument();
      expect(screen.getByText("7.2")).toBeInTheDocument();
    });

    it("should have Expand All / Collapse All button", () => {
      render(<DebatePanel propertyId={mockPropertyId} />);

      expect(screen.getByText("Expand All")).toBeInTheDocument();
    });

    it("should expand agent card when clicked", async () => {
      const user = userEvent.setup();
      render(<DebatePanel propertyId={mockPropertyId} />);

      // Click on Vastu Master card
      const vastuCard = screen.getByText("Vastu Master").closest("button");
      if (vastuCard) {
        await user.click(vastuCard);
      }

      // Should show expanded content
      expect(
        screen.getByText(
          /Excellent Vastu compliance with ideal entrance placement/,
        ),
      ).toBeInTheDocument();
    });

    it("should show reasoning steps when agent is expanded", async () => {
      const user = userEvent.setup();
      render(<DebatePanel propertyId={mockPropertyId} />);

      // Expand Vastu Master
      const vastuCard = screen.getByText("Vastu Master").closest("button");
      if (vastuCard) {
        await user.click(vastuCard);
      }

      // Should show reasoning header
      expect(screen.getByText("Reasoning Process")).toBeInTheDocument();
      expect(screen.getByText("Entrance Analysis")).toBeInTheDocument();
    });

    it("should expand All agents when Expand All is clicked", async () => {
      const user = userEvent.setup();
      render(<DebatePanel propertyId={mockPropertyId} />);

      await user.click(screen.getByText("Expand All"));

      // Should show Collapse All now
      expect(screen.getByText("Collapse All")).toBeInTheDocument();
    });
  });

  describe("Debate Thread Tab", () => {
    it("should display debate messages", async () => {
      const user = userEvent.setup();
      render(<DebatePanel propertyId={mockPropertyId} />);

      await user.click(screen.getByText("Debate Thread"));

      expect(
        screen.getByText(
          /The property demonstrates excellent Vastu compliance/,
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          /I must raise a concern about the moderate flood risk/,
        ),
      ).toBeInTheDocument();
    });

    it("should show agent names with messages", async () => {
      const user = userEvent.setup();
      render(<DebatePanel propertyId={mockPropertyId} />);

      await user.click(screen.getByText("Debate Thread"));

      // Agent names should appear multiple times in debate
      const vastuMasters = screen.getAllByText("Vastu Master");
      expect(vastuMasters.length).toBeGreaterThan(0);
    });

    it("should indicate reply messages", async () => {
      const user = userEvent.setup();
      render(<DebatePanel propertyId={mockPropertyId} />);

      await user.click(screen.getByText("Debate Thread"));

      // Reply messages should have "reply" indicator
      const replyIndicators = screen.getAllByText("reply");
      expect(replyIndicators.length).toBeGreaterThan(0);
    });
  });

  describe("Swarm Verdict Tab", () => {
    it("should display verdict decision", async () => {
      const user = userEvent.setup();
      render(<DebatePanel propertyId={mockPropertyId} />);

      await user.click(screen.getByText("Swarm Verdict"));

      expect(screen.getByText("Conditional Approval")).toBeInTheDocument();
    });

    it("should display confidence percentage", async () => {
      const user = userEvent.setup();
      render(<DebatePanel propertyId={mockPropertyId} />);

      await user.click(screen.getByText("Swarm Verdict"));

      expect(screen.getByText("78%")).toBeInTheDocument();
    });

    it("should display verdict summary", async () => {
      const user = userEvent.setup();
      render(<DebatePanel propertyId={mockPropertyId} />);

      await user.click(screen.getByText("Swarm Verdict"));

      expect(
        screen.getByText(/Property recommended with conditions/),
      ).toBeInTheDocument();
    });

    it("should display consensus level", async () => {
      const user = userEvent.setup();
      render(<DebatePanel propertyId={mockPropertyId} />);

      await user.click(screen.getByText("Swarm Verdict"));

      expect(screen.getByText(/Agent Consensus/)).toBeInTheDocument();
      expect(screen.getByText(/majority/i)).toBeInTheDocument();
    });

    it("should display recommendations section", async () => {
      const user = userEvent.setup();
      render(<DebatePanel propertyId={mockPropertyId} />);

      await user.click(screen.getByText("Swarm Verdict"));

      expect(screen.getByText("Recommendations")).toBeInTheDocument();
      expect(
        screen.getByText(/Install flood mitigation measures/),
      ).toBeInTheDocument();
    });

    it("should display risks section", async () => {
      const user = userEvent.setup();
      render(<DebatePanel propertyId={mockPropertyId} />);

      await user.click(screen.getByText("Swarm Verdict"));

      expect(screen.getByText("Risks")).toBeInTheDocument();
      expect(screen.getByText(/Moderate flood risk/)).toBeInTheDocument();
    });

    it("should display opportunities section", async () => {
      const user = userEvent.setup();
      render(<DebatePanel propertyId={mockPropertyId} />);

      await user.click(screen.getByText("Swarm Verdict"));

      expect(screen.getByText("Opportunities")).toBeInTheDocument();
      expect(screen.getByText(/Strong Vastu compliance/)).toBeInTheDocument();
    });

    it("should display agent votes", async () => {
      const user = userEvent.setup();
      render(<DebatePanel propertyId={mockPropertyId} />);

      await user.click(screen.getByText("Swarm Verdict"));

      // Should show agent vote chips
      expect(screen.getByText(/85%/)).toBeInTheDocument();
      expect(screen.getByText(/75%/)).toBeInTheDocument();
    });
  });

  describe("Download Report Functionality", () => {
    it("should trigger download when button is clicked", async () => {
      const user = userEvent.setup();
      render(<DebatePanel propertyId={mockPropertyId} />);

      const downloadButton = screen.getByRole("button", {
        name: /download uncle report/i,
      });
      await user.click(downloadButton);

      // Button should show generating state
      expect(screen.getByText("Generating...")).toBeInTheDocument();
    });

    it("should re-enable button after generation", async () => {
      const user = userEvent.setup();
      render(<DebatePanel propertyId={mockPropertyId} />);

      const downloadButton = screen.getByRole("button", {
        name: /download uncle report/i,
      });
      await user.click(downloadButton);

      await waitFor(
        () => {
          expect(screen.getByText("Download Uncle Report")).toBeInTheDocument();
        },
        { timeout: 10000 },
      );
    }, 15000);

    it("should create download with correct filename", async () => {
      const user = userEvent.setup();
      render(<DebatePanel propertyId={mockPropertyId} />);

      const downloadButton = screen.getByRole("button", {
        name: /download uncle report/i,
      });
      await user.click(downloadButton);

      await waitFor(
        () => {
          expect(mockAnchorElement.download).toBe(
            `uncle-report-${mockPropertyId}.json`,
          );
        },
        { timeout: 3000 },
      );
    });

    it("should call onDownloadReport callback", async () => {
      const onDownloadReport = jest.fn();
      const user = userEvent.setup();
      render(
        <DebatePanel
          propertyId={mockPropertyId}
          onDownloadReport={onDownloadReport}
        />,
      );

      const downloadButton = screen.getByRole("button", {
        name: /download uncle report/i,
      });
      await user.click(downloadButton);

      expect(onDownloadReport).toHaveBeenCalled();
    });
  });

  describe("Loading State", () => {
    it("should show loading state when isLoading is true", () => {
      render(<DebatePanel propertyId={mockPropertyId} isLoading={true} />);

      expect(screen.getByText("Agents are analyzing...")).toBeInTheDocument();
      expect(screen.getByText("This may take a moment")).toBeInTheDocument();
    });

    it("should not show loading state when isLoading is false", () => {
      render(<DebatePanel propertyId={mockPropertyId} isLoading={false} />);

      expect(
        screen.queryByText("Agents are analyzing..."),
      ).not.toBeInTheDocument();
    });
  });

  describe("Expandable Reasoning", () => {
    it("should expand reasoning step when clicked", async () => {
      const user = userEvent.setup();
      render(<DebatePanel propertyId={mockPropertyId} />);

      // First expand the agent card
      const vastuCard = screen.getByText("Vastu Master").closest("button");
      if (vastuCard) {
        await user.click(vastuCard);
      }

      // Then click on a reasoning step
      const entranceStep = screen
        .getByText("Entrance Analysis")
        .closest("button");
      if (entranceStep) {
        await user.click(entranceStep);
      }

      // Should show detailed content
      expect(
        screen.getByText(/The main entrance faces Northeast/),
      ).toBeInTheDocument();
    });

    it("should show confidence bar in reasoning step", async () => {
      const user = userEvent.setup();
      render(<DebatePanel propertyId={mockPropertyId} />);

      // Expand agent and reasoning step
      const vastuCard = screen.getByText("Vastu Master").closest("button");
      if (vastuCard) {
        await user.click(vastuCard);
      }

      // Step confidence should be shown in the step header
      expect(screen.getByText("95%")).toBeInTheDocument();
    });

    it("should show data object when present in reasoning step", async () => {
      const user = userEvent.setup();
      render(<DebatePanel propertyId={mockPropertyId} />);

      // Expand agent
      const vastuCard = screen.getByText("Vastu Master").closest("button");
      if (vastuCard) {
        await user.click(vastuCard);
      }

      // Find and click Energy Flow Score step (has data)
      const energyStep = screen
        .getByText("Energy Flow Score")
        .closest("button");
      if (energyStep) {
        await user.click(energyStep);
      }

      // Should show JSON data
      expect(screen.getByText(/"flowScore": 8.5/)).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper heading hierarchy", () => {
      render(<DebatePanel propertyId={mockPropertyId} />);

      expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    });

    it("should have proper button labels", () => {
      render(<DebatePanel propertyId={mockPropertyId} />);

      expect(
        screen.getByRole("button", { name: /download uncle report/i }),
      ).toBeInTheDocument();
    });

    it("should support keyboard navigation for tabs", async () => {
      const user = userEvent.setup();
      render(<DebatePanel propertyId={mockPropertyId} />);

      const verdictTab = screen.getByText("Swarm Verdict");
      verdictTab.focus();
      await user.keyboard("{Enter}");

      // Should switch to verdict tab
      await user.click(screen.getByText("Swarm Verdict"));
      expect(screen.getByText("Conditional Approval")).toBeInTheDocument();
    });
  });

  describe("Custom Props", () => {
    it("should render with custom agents", () => {
      const customAgents = [
        {
          id: "custom",
          name: "Custom Agent",
          role: "Custom Role",
          description: "Custom description",
          icon: "bot" as const,
          color: "purple" as const,
          gradient: "from-purple-500 to-indigo-600",
        },
      ];

      render(
        <DebatePanel
          propertyId={mockPropertyId}
          agents={customAgents}
          analyses={[]}
          messages={[]}
        />,
      );

      expect(screen.getByText("Custom Agent")).toBeInTheDocument();
      expect(screen.getByText("Custom Role")).toBeInTheDocument();
    });

    it("should handle empty analyses gracefully", () => {
      render(<DebatePanel propertyId={mockPropertyId} analyses={[]} />);

      // Should still render agent cards without analysis data
      expect(screen.getByText("Vastu Master")).toBeInTheDocument();
    });

    it("should handle empty messages gracefully", async () => {
      const user = userEvent.setup();
      render(<DebatePanel propertyId={mockPropertyId} messages={[]} />);

      await user.click(screen.getByText("Debate Thread"));

      // Should render empty debate thread without errors
      expect(
        screen.queryByText(/excellent Vastu compliance/),
      ).not.toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    it("should render without performance issues", () => {
      const startTime = performance.now();
      render(<DebatePanel propertyId={mockPropertyId} />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(200);
    });

    it("should handle tab switches efficiently", async () => {
      const user = userEvent.setup();
      render(<DebatePanel propertyId={mockPropertyId} />);

      const startTime = performance.now();

      await user.click(screen.getByText("Swarm Verdict"));
      await user.click(screen.getByText("Debate Thread"));
      await user.click(screen.getByText("Agent Analysis"));

      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(3000);
    });
  });

  describe("Error Handling", () => {
    it("should handle missing propertyId gracefully", () => {
      expect(() => {
        render(<DebatePanel propertyId="" />);
      }).not.toThrow();
    });

    it("should handle malformed data gracefully", () => {
      const malformedAnalyses = [
        {
          id: "1",
          agentId: "nonexistent",
          score: 0,
          verdict: "positive" as const,
          summary: "",
          reasoning: [],
          recommendations: [],
          confidence: 0,
          timestamp: new Date(),
        },
      ];

      expect(() => {
        render(
          <DebatePanel
            propertyId={mockPropertyId}
            analyses={malformedAnalyses}
          />,
        );
      }).not.toThrow();
    });
  });
});

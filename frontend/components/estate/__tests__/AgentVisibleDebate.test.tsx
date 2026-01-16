/**
 * Unit tests for Agent Visible Debate component
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AgentVisibleDebate from "../AgentVisibleDebate";

// Mock property data
const mockProperty = {
    title: "3 BHK Apartment in Whitefield",
    price: 8500000,
    city: "Bangalore",
    bedrooms: 3,
    vastuScore: 78,
    climateRisk: 25,
    daysOnMarket: 45,
};

describe("AgentVisibleDebate", () => {
    it("renders initial state with Run Analysis button", () => {
        render(<AgentVisibleDebate propertyData={mockProperty} />);

        expect(screen.getByText("Agent Swarm Analysis")).toBeInTheDocument();
        expect(screen.getByText("Run Analysis")).toBeInTheDocument();
    });

    it("shows loading state when analysis is running", async () => {
        render(<AgentVisibleDebate propertyData={mockProperty} />);

        const runButton = screen.getByText("Run Analysis");
        fireEvent.click(runButton);

        expect(screen.getByText("Agents are analyzing property...")).toBeInTheDocument();
    });

    it("displays agent messages after analysis completes", async () => {
        render(<AgentVisibleDebate propertyData={mockProperty} />);

        const runButton = screen.getByText("Run Analysis");
        fireEvent.click(runButton);

        await waitFor(() => {
            expect(screen.getByText(/SWARM VERDICT/)).toBeInTheDocument();
        }, { timeout: 5000 });

        // Check for agent names
        await waitFor(() => {
            expect(screen.getByText(/Discovery Scout/)).toBeInTheDocument();
        });
    });

    it("shows verdict based on Vastu score", async () => {
        render(<AgentVisibleDebate propertyData={{ ...mockProperty, vastuScore: 85 }} />);

        const runButton = screen.getByText("Run Analysis");
        fireEvent.click(runButton);

        await waitFor(() => {
            expect(screen.getByText(/GOOD BUY/)).toBeInTheDocument();
        }, { timeout: 5000 });
    });

    it("shows cautionary verdict for low Vastu score", async () => {
        render(<AgentVisibleDebate propertyData={{ ...mockProperty, vastuScore: 55 }} />);

        const runButton = screen.getByText("Run Analysis");
        fireEvent.click(runButton);

        await waitFor(() => {
            expect(screen.getByText(/CAUTION/)).toBeInTheDocument();
        }, { timeout: 5000 });
    });

    it("allows re-running analysis", async () => {
        render(<AgentVisibleDebate propertyData={mockProperty} />);

        // First run
        fireEvent.click(screen.getByText("Run Analysis"));

        await waitFor(() => {
            expect(screen.getByText(/SWARM VERDICT/)).toBeInTheDocument();
        }, { timeout: 5000 });

        // Re-analyze button should be visible
        expect(screen.getByText("Re-analyze")).toBeInTheDocument();
    });

    it("displays recommendations when available", async () => {
        render(<AgentVisibleDebate propertyData={mockProperty} />);

        fireEvent.click(screen.getByText("Run Analysis"));

        await waitFor(() => {
            expect(screen.getByText("📋 Recommendations")).toBeInTheDocument();
        }, { timeout: 5000 });
    });

    it("renders with initial debate data", () => {
        const initialDebate = {
            verdict: "GOOD_BUY" as const,
            summary: "Test verdict",
            agentMessages: [
                { agent: "discovery" as const, message: "Test message", sentiment: "positive" as const },
            ],
            recommendations: ["Test recommendation"],
        };

        render(<AgentVisibleDebate initialDebate={initialDebate} />);

        expect(screen.getByText(/GOOD BUY/)).toBeInTheDocument();
        expect(screen.getByText("Test verdict")).toBeInTheDocument();
    });
});

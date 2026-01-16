"use client";

import React, { useState } from "react";
import { FileText, Download, Loader2, CheckCircle } from "lucide-react";

interface PropertyData {
    id: string;
    title: string;
    address: string;
    city: string;
    state: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    squareFeet?: number;
    vastuScore?: number;
    vastuGrade?: string;
    climateRiskScore?: number;
    climateGrade?: string;
    agentDebate?: {
        verdict: string;
        summary: string;
        agents: { name: string; message: string }[];
    };
}

interface UncleReportButtonProps {
    property: PropertyData;
    className?: string;
}

// Generate PDF content as HTML (for server-side PDF conversion)
function generateReportHTML(property: PropertyData): string {
    const date = new Date().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Uncle Report - ${property.title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', sans-serif; color: #333; line-height: 1.6; }
    .page { max-width: 800px; margin: 0 auto; padding: 40px; }
    .header { text-align: center; border-bottom: 3px solid #f59e0b; padding-bottom: 20px; margin-bottom: 30px; }
    .logo { font-size: 28px; font-weight: bold; color: #f59e0b; }
    .subtitle { color: #666; font-style: italic; margin-top: 5px; }
    .title { font-size: 24px; margin: 20px 0 10px; }
    .date { color: #888; font-size: 14px; }
    
    .section { margin: 25px 0; padding: 20px; background: #fafafa; border-radius: 10px; }
    .section-title { font-size: 18px; color: #f59e0b; margin-bottom: 15px; display: flex; align-items: center; gap: 10px; }
    
    .property-details { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
    .detail-item { background: white; padding: 12px; border-radius: 8px; border: 1px solid #eee; }
    .detail-label { font-size: 12px; color: #888; text-transform: uppercase; }
    .detail-value { font-size: 18px; font-weight: bold; color: #333; }
    
    .score-card { display: flex; justify-content: space-around; text-align: center; }
    .score { font-size: 48px; font-weight: bold; }
    .score-label { font-size: 14px; color: #666; }
    .score.vastu { color: #f59e0b; }
    .score.climate { color: #22c55e; }
    
    .verdict-box { background: linear-gradient(135deg, #fef3c7, #fde68a); padding: 20px; border-radius: 10px; text-align: center; }
    .verdict-title { font-size: 14px; color: #92400e; text-transform: uppercase; }
    .verdict-text { font-size: 24px; font-weight: bold; color: #78350f; margin-top: 10px; }
    
    .agent-list { }
    .agent-item { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #f59e0b; }
    .agent-name { font-weight: bold; color: #f59e0b; }
    .agent-message { margin-top: 5px; color: #555; }
    
    .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #888; font-size: 12px; }
    .disclaimer { font-size: 10px; color: #aaa; margin-top: 15px; }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="logo">🙏 REST-iN-U</div>
      <div class="subtitle">Where Ancient Wisdom Meets Modern Real Estate</div>
      <h1 class="title">Uncle Report™</h1>
      <div class="date">Generated on ${date}</div>
    </div>

    <div class="section">
      <div class="section-title">🏠 Property Overview</div>
      <h2 style="font-size: 20px; margin-bottom: 15px;">${property.title}</h2>
      <p style="color: #666; margin-bottom: 15px;">${property.address}, ${property.city}, ${property.state}</p>
      
      <div class="property-details">
        <div class="detail-item">
          <div class="detail-label">Price</div>
          <div class="detail-value">₹${(property.price / 100000).toFixed(2)}L</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Configuration</div>
          <div class="detail-value">${property.bedrooms} BHK, ${property.bathrooms} Bath</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Area</div>
          <div class="detail-value">${property.squareFeet || "N/A"} sq.ft</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Price per sq.ft</div>
          <div class="detail-value">₹${property.squareFeet ? Math.round(property.price / property.squareFeet).toLocaleString("en-IN") : "N/A"}</div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">📊 Analysis Scores</div>
      <div class="score-card">
        <div>
          <div class="score vastu">${property.vastuScore || "78"}</div>
          <div class="score-label">Vastu Score (${property.vastuGrade || "B+"})</div>
        </div>
        <div>
          <div class="score climate">${100 - (property.climateRiskScore || 25)}</div>
          <div class="score-label">Climate Safety (${property.climateGrade || "A-"})</div>
        </div>
      </div>
    </div>

    ${property.agentDebate ? `
    <div class="section">
      <div class="section-title">🤖 AI Agent Analysis</div>
      <div class="verdict-box">
        <div class="verdict-title">Swarm Verdict</div>
        <div class="verdict-text">${property.agentDebate.verdict.replace(/_/g, " ")}</div>
        <p style="margin-top: 10px; color: #78350f; font-size: 14px;">${property.agentDebate.summary}</p>
      </div>
      
      <div class="agent-list" style="margin-top: 20px;">
        ${property.agentDebate.agents.map(agent => `
          <div class="agent-item">
            <div class="agent-name">${agent.name}</div>
            <div class="agent-message">${agent.message}</div>
          </div>
        `).join("")}
      </div>
    </div>
    ` : ""}

    <div class="section">
      <div class="section-title">✅ Recommendations</div>
      <ul style="list-style: none; padding: 0;">
        <li style="padding: 8px 0; border-bottom: 1px solid #eee;">• Negotiate from ₹${((property.price * 0.95) / 100000).toFixed(0)}L starting point</li>
        <li style="padding: 8px 0; border-bottom: 1px solid #eee;">• Verify RERA registration before booking</li>
        <li style="padding: 8px 0; border-bottom: 1px solid #eee;">• Check water supply and drainage in person</li>
        <li style="padding: 8px 0;">• Consult family astrologer for Griha Pravesh muhurat</li>
      </ul>
    </div>

    <div class="footer">
      <p>Report ID: UR-${property.id.slice(0, 8).toUpperCase()}</p>
      <p class="disclaimer">
        This report is generated by REST-iN-U AI agents for informational purposes only. 
        Always conduct personal due diligence and consult professionals before making real estate decisions.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

export default function UncleReportButton({
    property,
    className = "",
}: UncleReportButtonProps) {
    const [loading, setLoading] = useState(false);
    const [generated, setGenerated] = useState(false);

    const generateReport = async () => {
        setLoading(true);

        try {
            // Generate HTML content
            const htmlContent = generateReportHTML(property);

            // Create a blob and download as HTML (can be printed to PDF)
            const blob = new Blob([htmlContent], { type: "text/html" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `UncleReport-${property.id.slice(0, 8)}.html`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            setGenerated(true);
            setTimeout(() => setGenerated(false), 3000);
        } catch (error) {
            console.error("Failed to generate report:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={generateReport}
            disabled={loading}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition
        ${generated ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700 hover:bg-amber-200"}
        ${loading ? "opacity-50 cursor-not-allowed" : ""}
        ${className}`}
        >
            {loading ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                </>
            ) : generated ? (
                <>
                    <CheckCircle className="w-4 h-4" />
                    Downloaded!
                </>
            ) : (
                <>
                    <FileText className="w-4 h-4" />
                    Download Uncle Report™
                </>
            )}
        </button>
    );
}

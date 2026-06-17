import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { PropertyAnalysis } from '../agents/BaseAgent';

export class ReportGeneratorService {
  /**
   * Generates the "Uncle Report" PDF for a given property and agent opinions.
   * @param propertyId The ID of the property.
   * @param agentOpinions List of analyses from different agents.
   * @returns A Promise resolving to the PDF file as a Uint8Array.
   */
  async generateUncleReport(propertyId: string, agentOpinions: PropertyAnalysis[]): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Title
    page.drawText('The "Uncle" Report', {
      x: 50,
      y: height - 50,
      size: 30,
      font: boldFont,
      color: rgb(0, 0, 0),
    });

    // Property ID
    page.drawText(`Property ID: ${propertyId}`, {
      x: 50,
      y: height - 80,
      size: 12,
      font,
      color: rgb(0.5, 0.5, 0.5),
    });

    // Placeholder Image
    page.drawRectangle({
        x: 50,
        y: height - 250,
        width: 200,
        height: 150,
        color: rgb(0.9, 0.9, 0.9),
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
    });
    page.drawText('Property Photo Placeholder', {
        x: 70,
        y: height - 180,
        size: 10,
        font,
        color: rgb(0.5, 0.5, 0.5),
    });

    // Verdict Logic
    const avgScore = agentOpinions.length > 0
        ? agentOpinions.reduce((acc, curr) => acc + curr.score, 0) / agentOpinions.length
        : 0;

    let verdictText = "NEUTRAL";
    if (avgScore >= 7) verdictText = "RECOMMENDED";
    if (avgScore <= 4) verdictText = "NOT RECOMMENDED";

    // Verdict Section
    page.drawText('Verdict from the Swarm', {
        x: 50,
        y: height - 280,
        size: 18,
        font: boldFont,
    });

    page.drawText(`${verdictText} (Average Score: ${avgScore.toFixed(1)}/10)`, {
        x: 50,
        y: height - 305,
        size: 14,
        font,
        color: avgScore >= 7 ? rgb(0, 0.5, 0) : (avgScore <= 4 ? rgb(0.8, 0, 0) : rgb(0.5, 0.5, 0)),
    });

    // Summary Table
    let yPosition = height - 350;
    page.drawText('Agent Opinions:', {
        x: 50,
        y: yPosition,
        size: 14,
        font: boldFont,
        color: rgb(0, 0, 0),
    });
    yPosition -= 25;

    // Table Headers
    page.drawText('Agent', { x: 50, y: yPosition, size: 12, font: boldFont });
    page.drawText('Score', { x: 150, y: yPosition, size: 12, font: boldFont });
    page.drawText('Reasoning', { x: 220, y: yPosition, size: 12, font: boldFont });

    // Draw Header Line
    page.drawLine({
        start: { x: 50, y: yPosition - 5 },
        end: { x: width - 50, y: yPosition - 5 },
        thickness: 1,
        color: rgb(0, 0, 0),
    });

    yPosition -= 25;

    // Table Rows
    for (const opinion of agentOpinions) {
        if (yPosition < 50) {
            // In a real implementation, we would add a new page here.
            // For now, we'll stop rendering to prevent writing off-page.
            break;
        }

        page.drawText(opinion.agentId, { x: 50, y: yPosition, size: 10, font });
        page.drawText(opinion.score.toString(), { x: 150, y: yPosition, size: 10, font });

        // Truncate reasoning to fit in one line for simplicity
        const maxReasoningChars = 65;
        const reasoningPreview = opinion.reasoning.length > maxReasoningChars
            ? opinion.reasoning.substring(0, maxReasoningChars - 3) + '...'
            : opinion.reasoning;

        page.drawText(reasoningPreview, { x: 220, y: yPosition, size: 10, font });

        yPosition -= 20;
    }

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  }
}

export const reportGeneratorService = new ReportGeneratorService();

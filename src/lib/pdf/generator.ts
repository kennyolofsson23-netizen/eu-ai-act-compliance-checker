import type { AssessmentData } from "@/lib/engine/types";

export interface PdfGeneratorOptions {
  assessment: AssessmentData;
  includeObligations?: boolean;
  includeArticles?: boolean;
}

/**
 * Generates a PDF report for an EU AI Act compliance assessment.
 * Returns the PDF as a Buffer.
 *
 * Note: This is a minimal implementation stub. A production implementation
 * would use a library such as @react-pdf/renderer or puppeteer.
 */
export async function generateAssessmentPdf(
  options: PdfGeneratorOptions,
): Promise<Buffer> {
  const { assessment, includeObligations = true, includeArticles = true } = options;

  const lines: string[] = [
    "EU AI Act Compliance Assessment Report",
    "=====================================",
    "",
    `System Name: ${assessment.systemName}`,
    `Risk Level: ${assessment.riskLevel}`,
    `Role: ${assessment.role}`,
    `GPAI Model: ${assessment.isGpai ? "Yes" : "No"}`,
    `Assessment Date: ${new Date(assessment.createdAt).toLocaleDateString()}`,
    "",
    "Reasoning:",
    assessment.riskLevel,
    "",
  ];

  if (includeArticles && assessment.citedArticles.length > 0) {
    lines.push("Cited Articles:", assessment.citedArticles.join(", "), "");
  }

  if (includeObligations && assessment.obligations.length > 0) {
    lines.push("Obligations:");
    for (const obligation of assessment.obligations) {
      lines.push(`- ${obligation.title} (${obligation.article})`);
      lines.push(`  ${obligation.summary}`);
    }
    lines.push("");
  }

  lines.push("Disclaimer: This report is for informational purposes only and does not constitute legal advice.");

  return Buffer.from(lines.join("\n"), "utf-8");
}

export function getPdfFilename(assessment: Pick<AssessmentData, "systemName" | "createdAt">): string {
  const slug = assessment.systemName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
  const date = new Date(assessment.createdAt).toISOString().split("T")[0];
  return `eu-ai-act-assessment-${slug}-${date}.pdf`;
}

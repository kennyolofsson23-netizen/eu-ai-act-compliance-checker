import { describe, it, expect } from "vitest";
import { generateAssessmentPdf, getPdfFilename } from "@/lib/pdf/generator";
import type { AssessmentData } from "@/lib/engine/types";

const mockAssessment: AssessmentData = {
  id: "test-id-123",
  systemName: "Test AI System",
  riskLevel: "high",
  role: "provider",
  isGpai: false,
  citedArticles: ["Article 6(2)", "Annex III"],
  obligations: [
    {
      id: "risk-mgmt",
      title: "Risk Management System",
      article: "Article 9",
      summary: "Establish and maintain a risk management system.",
      practicalMeaning: "Document identified risks and mitigations.",
      appliesToRole: ["provider"],
      riskLevels: ["high"],
    },
  ],
  answers: { isAiSystem: true, role: "provider" },
  createdAt: "2026-01-15T10:00:00.000Z",
};

describe("generateAssessmentPdf()", () => {
  it("returns a Buffer", async () => {
    const result = await generateAssessmentPdf({ assessment: mockAssessment });
    expect(result).toBeInstanceOf(Buffer);
  });

  it("buffer is non-empty", async () => {
    const result = await generateAssessmentPdf({ assessment: mockAssessment });
    expect(result.length).toBeGreaterThan(0);
  });

  it("includes system name in output", async () => {
    const result = await generateAssessmentPdf({ assessment: mockAssessment });
    expect(result.toString("utf-8")).toContain("Test AI System");
  });

  it("includes risk level in output", async () => {
    const result = await generateAssessmentPdf({ assessment: mockAssessment });
    expect(result.toString("utf-8")).toContain("high");
  });

  it("includes cited articles when includeArticles is true", async () => {
    const result = await generateAssessmentPdf({
      assessment: mockAssessment,
      includeArticles: true,
    });
    expect(result.toString("utf-8")).toContain("Article 6(2)");
  });

  it("omits cited articles when includeArticles is false", async () => {
    const result = await generateAssessmentPdf({
      assessment: mockAssessment,
      includeArticles: false,
    });
    expect(result.toString("utf-8")).not.toContain("Cited Articles:");
  });

  it("includes obligations when includeObligations is true", async () => {
    const result = await generateAssessmentPdf({
      assessment: mockAssessment,
      includeObligations: true,
    });
    expect(result.toString("utf-8")).toContain("Risk Management System");
  });

  it("omits obligations when includeObligations is false", async () => {
    const result = await generateAssessmentPdf({
      assessment: mockAssessment,
      includeObligations: false,
    });
    expect(result.toString("utf-8")).not.toContain("Obligations:");
  });

  it("includes disclaimer text", async () => {
    const result = await generateAssessmentPdf({ assessment: mockAssessment });
    expect(result.toString("utf-8")).toContain("not constitute legal advice");
  });

  it("handles assessment with no obligations", async () => {
    const assessment: AssessmentData = {
      ...mockAssessment,
      riskLevel: "minimal",
      obligations: [],
      citedArticles: [],
    };
    const result = await generateAssessmentPdf({ assessment });
    expect(result).toBeInstanceOf(Buffer);
    expect(result.length).toBeGreaterThan(0);
  });
});

describe("getPdfFilename()", () => {
  it("returns a string ending in .pdf", () => {
    const filename = getPdfFilename(mockAssessment);
    expect(filename).toMatch(/\.pdf$/);
  });

  it("includes the date in the filename", () => {
    const filename = getPdfFilename(mockAssessment);
    expect(filename).toContain("2026-01-15");
  });

  it("slugifies the system name", () => {
    const filename = getPdfFilename({
      systemName: "My AI System!",
      createdAt: "2026-01-15T00:00:00.000Z",
    });
    expect(filename).toContain("my-ai-system");
    expect(filename).not.toContain("!");
  });

  it("truncates very long system names", () => {
    const longName = "A".repeat(100);
    const filename = getPdfFilename({
      systemName: longName,
      createdAt: "2026-01-15T00:00:00.000Z",
    });
    expect(filename.length).toBeLessThan(120);
  });
});

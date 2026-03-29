import { describe, it, expect } from "vitest";
import { generateBadgeSvg, getRiskColor } from "@/lib/badge/generator";
import type { RiskLevel } from "@/lib/engine/types";

const ALL_RISK_LEVELS: RiskLevel[] = [
  "unacceptable",
  "high",
  "limited",
  "minimal",
];

describe("generateBadgeSvg()", () => {
  it("returns a string starting with <svg", () => {
    const svg = generateBadgeSvg({
      riskLevel: "high",
      systemName: "Test System",
      assessmentId: "abc123",
    });
    expect(svg).toMatch(/^<svg/);
  });

  it("includes the risk level label in the SVG", () => {
    const svg = generateBadgeSvg({
      riskLevel: "high",
      systemName: "Test System",
      assessmentId: "abc123",
    });
    expect(svg).toContain("High Risk");
  });

  it("includes the system name", () => {
    const svg = generateBadgeSvg({
      riskLevel: "minimal",
      systemName: "My AI System",
      assessmentId: "def456",
    });
    expect(svg).toContain("My AI System");
  });

  it("includes the assessment ID as a comment", () => {
    const svg = generateBadgeSvg({
      riskLevel: "limited",
      systemName: "Test",
      assessmentId: "xyz789",
    });
    expect(svg).toContain("xyz789");
  });

  it.each(ALL_RISK_LEVELS)(
    "generates valid SVG for risk level: %s",
    (riskLevel) => {
      const svg = generateBadgeSvg({
        riskLevel,
        systemName: "Test System",
        assessmentId: "id-123",
      });
      expect(svg).toContain("<svg");
      expect(svg).toContain("</svg>");
    },
  );

  it("truncates long system names to 30 characters", () => {
    const longName = "A".repeat(40);
    const svg = generateBadgeSvg({
      riskLevel: "minimal",
      systemName: longName,
      assessmentId: "id-1",
    });
    expect(svg).not.toContain(longName);
    expect(svg).toContain("…");
  });

  it("does not truncate names under 30 characters", () => {
    const shortName = "Short Name";
    const svg = generateBadgeSvg({
      riskLevel: "minimal",
      systemName: shortName,
      assessmentId: "id-1",
    });
    expect(svg).toContain(shortName);
  });

  it("includes EU AI Act Compliance text", () => {
    const svg = generateBadgeSvg({
      riskLevel: "high",
      systemName: "Test",
      assessmentId: "id-1",
    });
    expect(svg).toContain("EU AI Act Compliance");
  });
});

describe("getRiskColor()", () => {
  it("returns red for unacceptable risk", () => {
    const color = getRiskColor("unacceptable");
    expect(color.bg).toBe("#DC2626");
    expect(color.label).toBe("Unacceptable Risk");
  });

  it("returns orange for high risk", () => {
    const color = getRiskColor("high");
    expect(color.bg).toBe("#EA580C");
    expect(color.label).toBe("High Risk");
  });

  it("returns yellow/amber for limited risk", () => {
    const color = getRiskColor("limited");
    expect(color.bg).toBe("#CA8A04");
    expect(color.label).toBe("Limited Risk");
  });

  it("returns green for minimal risk", () => {
    const color = getRiskColor("minimal");
    expect(color.bg).toBe("#16A34A");
    expect(color.label).toBe("Minimal Risk");
  });

  it.each(ALL_RISK_LEVELS)(
    "returns an object with bg, text, and label for: %s",
    (riskLevel) => {
      const color = getRiskColor(riskLevel);
      expect(typeof color.bg).toBe("string");
      expect(typeof color.text).toBe("string");
      expect(typeof color.label).toBe("string");
    },
  );
});

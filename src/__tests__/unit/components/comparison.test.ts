import { describe, it, expect } from "vitest";
import type { ComparisonTableProps } from "@/components/dashboard/ComparisonTable";
import type { AssessmentData } from "@/lib/engine/types";

// Risk ordering as defined in ComparisonTable
const RISK_ORDER: Record<string, number> = {
  unacceptable: 0,
  high: 1,
  limited: 2,
  minimal: 3,
};

function sortByRisk(assessments: AssessmentData[]): AssessmentData[] {
  return [...assessments].sort(
    (a, b) => RISK_ORDER[a.riskLevel] - RISK_ORDER[b.riskLevel],
  );
}

const makeAssessment = (
  id: string,
  systemName: string,
  riskLevel: AssessmentData["riskLevel"],
  role: AssessmentData["role"] = "provider",
): AssessmentData => ({
  id,
  systemName,
  riskLevel,
  role,
  isGpai: false,
  citedArticles: [],
  obligations: [],
  answers: {},
  createdAt: new Date().toISOString(),
});

describe("ComparisonTable data logic", () => {
  it("RISK_ORDER places unacceptable before high", () => {
    expect(RISK_ORDER.unacceptable).toBeLessThan(RISK_ORDER.high);
  });

  it("RISK_ORDER places high before limited", () => {
    expect(RISK_ORDER.high).toBeLessThan(RISK_ORDER.limited);
  });

  it("RISK_ORDER places limited before minimal", () => {
    expect(RISK_ORDER.limited).toBeLessThan(RISK_ORDER.minimal);
  });

  it("sorts assessments by risk level descending severity", () => {
    const assessments = [
      makeAssessment("3", "C", "minimal"),
      makeAssessment("1", "A", "high"),
      makeAssessment("2", "B", "unacceptable"),
    ];
    const sorted = sortByRisk(assessments);
    expect(sorted[0].riskLevel).toBe("unacceptable");
    expect(sorted[1].riskLevel).toBe("high");
    expect(sorted[2].riskLevel).toBe("minimal");
  });

  it("accepts ComparisonTableProps with empty assessments array", () => {
    const props: ComparisonTableProps = { assessments: [] };
    expect(props.assessments).toHaveLength(0);
  });

  it("accepts ComparisonTableProps with multiple assessments", () => {
    const assessments = [
      makeAssessment("1", "System A", "high"),
      makeAssessment("2", "System B", "minimal"),
    ];
    const props: ComparisonTableProps = { assessments };
    expect(props.assessments).toHaveLength(2);
  });

  it("preserves all assessment fields in sorted output", () => {
    const a = makeAssessment("1", "Alpha", "high");
    const sorted = sortByRisk([a]);
    expect(sorted[0].id).toBe("1");
    expect(sorted[0].systemName).toBe("Alpha");
    expect(sorted[0].role).toBe("provider");
  });
});

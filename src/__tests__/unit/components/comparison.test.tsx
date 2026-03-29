import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ComparisonTable from "@/components/dashboard/ComparisonTable";
import type { AssessmentData } from "@/lib/engine/types";

const mockAssessments: AssessmentData[] = [
  {
    id: "1",
    systemName: "System Alpha",
    riskLevel: "high",
    role: "provider",
    isGpai: false,
    citedArticles: ["Article 6(2)"],
    obligations: [
      {
        id: "risk-mgmt",
        title: "Risk Management",
        article: "Article 9",
        summary: "...",
        practicalMeaning: "...",
        appliesToRole: ["provider"],
        riskLevels: ["high"],
      },
    ],
    answers: {},
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    systemName: "System Beta",
    riskLevel: "minimal",
    role: "deployer",
    isGpai: true,
    citedArticles: [],
    obligations: [],
    answers: {},
    createdAt: "2026-01-02T00:00:00.000Z",
  },
];

describe("ComparisonTable", () => {
  it("renders a table when assessments are provided", () => {
    render(<ComparisonTable assessments={mockAssessments} />);
    expect(screen.getByRole("table")).toBeTruthy();
  });

  it("displays system names as column headers", () => {
    render(<ComparisonTable assessments={mockAssessments} />);
    expect(screen.getByText("System Alpha")).toBeTruthy();
    expect(screen.getByText("System Beta")).toBeTruthy();
  });

  it("shows an empty state when no assessments provided", () => {
    render(<ComparisonTable assessments={[]} />);
    expect(screen.getByText(/no assessments to compare/i)).toBeTruthy();
  });

  it("displays risk levels for each assessment", () => {
    render(<ComparisonTable assessments={mockAssessments} />);
    expect(screen.getByText("high")).toBeTruthy();
    expect(screen.getByText("minimal")).toBeTruthy();
  });

  it("displays roles for each assessment", () => {
    render(<ComparisonTable assessments={mockAssessments} />);
    expect(screen.getByText("provider")).toBeTruthy();
    expect(screen.getByText("deployer")).toBeTruthy();
  });

  it("shows obligation counts", () => {
    render(<ComparisonTable assessments={mockAssessments} />);
    expect(screen.getByText("1")).toBeTruthy(); // 1 obligation for System Alpha
    expect(screen.getByText("0")).toBeTruthy(); // 0 obligations for System Beta
  });

  it("has accessible aria-label on the table", () => {
    render(<ComparisonTable assessments={mockAssessments} />);
    expect(
      screen.getByRole("table", { name: /assessment comparison/i }),
    ).toBeTruthy();
  });
});

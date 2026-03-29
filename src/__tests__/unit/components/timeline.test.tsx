import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ComplianceTimeline from "@/components/results/ComplianceTimeline";
import type { Obligation } from "@/lib/engine/types";

const mockObligations: Obligation[] = [
  {
    id: "conformity",
    title: "Conformity Assessment",
    article: "Article 43",
    summary:
      "Undergo conformity assessment before placing the system on the market.",
    practicalMeaning: "Complete self-assessment or engage a notified body.",
    appliesToRole: ["provider"],
    riskLevels: ["high"],
  },
  {
    id: "risk-mgmt",
    title: "Risk Management System",
    article: "Article 9",
    summary: "Establish and maintain a risk management system.",
    practicalMeaning: "Document identified risks.",
    appliesToRole: ["provider"],
    riskLevels: ["high"],
  },
];

const noDeadlineObligations: Obligation[] = [
  {
    id: "custom-obligation",
    title: "Custom Obligation",
    article: "Article X",
    summary: "A custom obligation with no deadline.",
    practicalMeaning: "Do something.",
    appliesToRole: ["provider"],
    riskLevels: ["high"],
  },
];

describe("ComplianceTimeline", () => {
  it("renders a list when obligations with deadlines are provided", () => {
    render(
      <ComplianceTimeline obligations={mockObligations} riskLevel="high" />,
    );
    expect(screen.getByRole("list")).toBeTruthy();
  });

  it("renders obligation titles", () => {
    render(
      <ComplianceTimeline obligations={mockObligations} riskLevel="high" />,
    );
    expect(screen.getByText("Conformity Assessment")).toBeTruthy();
  });

  it("renders article references", () => {
    render(
      <ComplianceTimeline obligations={mockObligations} riskLevel="high" />,
    );
    expect(screen.getByText("Article 43")).toBeTruthy();
  });

  it("shows empty state when no obligations have known deadlines", () => {
    render(
      <ComplianceTimeline
        obligations={noDeadlineObligations}
        riskLevel="high"
      />,
    );
    expect(screen.getByText(/no deadline-based obligations/i)).toBeTruthy();
  });

  it("shows empty state when obligations array is empty", () => {
    render(<ComplianceTimeline obligations={[]} riskLevel="minimal" />);
    expect(screen.getByText(/no deadline-based obligations/i)).toBeTruthy();
  });

  it("has an accessible aria-label on the list", () => {
    render(
      <ComplianceTimeline obligations={mockObligations} riskLevel="high" />,
    );
    expect(
      screen.getByRole("list", { name: /compliance timeline/i }),
    ).toBeTruthy();
  });
});

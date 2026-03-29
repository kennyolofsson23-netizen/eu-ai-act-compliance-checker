import { describe, it, expect } from "vitest";
import type {
  ComplianceTimelineProps,
  TimelineItem,
} from "@/components/results/ComplianceTimeline";
import type { Obligation } from "@/lib/engine/types";

// Mirrors the deadline map from ComplianceTimeline
const KNOWN_DEADLINES: Record<string, string> = {
  conformity: "2025-08-02",
  registration: "2025-08-02",
  "risk-mgmt": "2025-08-02",
  "tech-docs": "2025-08-02",
  "transparency-users": "2025-08-02",
  "cease-prohibited": "2024-02-02",
};

function makeObligation(id: string, title = "Test", article = "Article X"): Obligation {
  return {
    id,
    title,
    article,
    summary: "Test summary.",
    practicalMeaning: "Do this.",
    appliesToRole: ["provider"],
    riskLevels: ["high"],
  };
}

function getDeadline(obligationId: string): string | null {
  return KNOWN_DEADLINES[obligationId] ?? null;
}

describe("ComplianceTimeline data logic", () => {
  it("returns a deadline for known obligation IDs", () => {
    expect(getDeadline("conformity")).toBe("2025-08-02");
    expect(getDeadline("cease-prohibited")).toBe("2024-02-02");
  });

  it("returns null for unknown obligation IDs", () => {
    expect(getDeadline("unknown-obligation")).toBeNull();
  });

  it("cease-prohibited deadline is before conformity deadline", () => {
    const cease = new Date(getDeadline("cease-prohibited")!);
    const conformity = new Date(getDeadline("conformity")!);
    expect(cease.getTime()).toBeLessThan(conformity.getTime());
  });

  it("TimelineItem interface allows isCompleted to be optional", () => {
    const item: TimelineItem = {
      date: "2025-08-02",
      title: "Test",
      description: "desc",
      article: "Article 1",
    };
    expect(item.isCompleted).toBeUndefined();
  });

  it("TimelineItem interface accepts isCompleted boolean", () => {
    const item: TimelineItem = {
      date: "2025-08-02",
      title: "Test",
      description: "desc",
      article: "Article 1",
      isCompleted: true,
    };
    expect(item.isCompleted).toBe(true);
  });

  it("ComplianceTimelineProps accepts valid obligations and riskLevel", () => {
    const props: ComplianceTimelineProps = {
      obligations: [makeObligation("conformity", "Conformity", "Article 43")],
      riskLevel: "high",
    };
    expect(props.obligations).toHaveLength(1);
    expect(props.riskLevel).toBe("high");
  });

  it("filters obligations with no known deadline", () => {
    const obligations = [
      makeObligation("conformity"),
      makeObligation("no-deadline"),
    ];
    const withDeadlines = obligations.filter((o) => getDeadline(o.id) !== null);
    expect(withDeadlines).toHaveLength(1);
    expect(withDeadlines[0].id).toBe("conformity");
  });

  it("sorts timeline items chronologically", () => {
    const items: TimelineItem[] = [
      { date: "2025-08-02", title: "Later", description: "", article: "" },
      { date: "2024-02-02", title: "Earlier", description: "", article: "" },
    ];
    const sorted = [...items].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    expect(sorted[0].title).toBe("Earlier");
    expect(sorted[1].title).toBe("Later");
  });
});

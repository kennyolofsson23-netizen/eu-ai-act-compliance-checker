import { describe, it, expect } from "vitest";
import {
  APP_NAME,
  APP_DESCRIPTION,
  EU_AI_ACT_ENFORCEMENT_DATE,
  EU_AI_ACT_PROHIBITED_DATE,
  EU_AI_ACT_GPAI_DATE,
  RISK_LEVELS,
  RISK_COLORS,
  RISK_LEVEL_LABELS,
  EU_AI_ACT_DEADLINES,
  ANONYMOUS_ID_COOKIE,
  ANONYMOUS_ASSESSMENT_COOKIE,
} from "@/lib/constants";

describe("App metadata constants", () => {
  it("APP_NAME is the expected string", () => {
    expect(APP_NAME).toBe("EU AI Act Compliance Checker");
  });

  it("APP_DESCRIPTION is a non-empty string", () => {
    expect(typeof APP_DESCRIPTION).toBe("string");
    expect(APP_DESCRIPTION.length).toBeGreaterThan(0);
  });

  it("ANONYMOUS_ID_COOKIE is a non-empty string", () => {
    expect(typeof ANONYMOUS_ID_COOKIE).toBe("string");
    expect(ANONYMOUS_ID_COOKIE.length).toBeGreaterThan(0);
  });

  it("ANONYMOUS_ASSESSMENT_COOKIE is a non-empty string", () => {
    expect(typeof ANONYMOUS_ASSESSMENT_COOKIE).toBe("string");
    expect(ANONYMOUS_ASSESSMENT_COOKIE.length).toBeGreaterThan(0);
  });
});

describe("EU AI Act enforcement dates", () => {
  it("prohibited date is 2025-02-02", () => {
    expect(EU_AI_ACT_PROHIBITED_DATE.toISOString()).toContain("2025-02-02");
  });

  it("GPAI obligations date is 2025-08-02", () => {
    expect(EU_AI_ACT_GPAI_DATE.toISOString()).toContain("2025-08-02");
  });

  it("full enforcement date is 2026-08-02", () => {
    expect(EU_AI_ACT_ENFORCEMENT_DATE.toISOString()).toContain("2026-08-02");
  });

  it("prohibited date is before GPAI date", () => {
    expect(EU_AI_ACT_PROHIBITED_DATE.getTime()).toBeLessThan(
      EU_AI_ACT_GPAI_DATE.getTime(),
    );
  });

  it("GPAI date is before full enforcement date", () => {
    expect(EU_AI_ACT_GPAI_DATE.getTime()).toBeLessThan(
      EU_AI_ACT_ENFORCEMENT_DATE.getTime(),
    );
  });

  it("all date objects are valid Date instances", () => {
    expect(EU_AI_ACT_PROHIBITED_DATE).toBeInstanceOf(Date);
    expect(EU_AI_ACT_GPAI_DATE).toBeInstanceOf(Date);
    expect(EU_AI_ACT_ENFORCEMENT_DATE).toBeInstanceOf(Date);
  });
});

describe("RISK_LEVELS", () => {
  it("UNACCEPTABLE is 'unacceptable'", () => {
    expect(RISK_LEVELS.UNACCEPTABLE).toBe("unacceptable");
  });

  it("HIGH is 'high'", () => {
    expect(RISK_LEVELS.HIGH).toBe("high");
  });

  it("LIMITED is 'limited'", () => {
    expect(RISK_LEVELS.LIMITED).toBe("limited");
  });

  it("MINIMAL is 'minimal'", () => {
    expect(RISK_LEVELS.MINIMAL).toBe("minimal");
  });
});

describe("RISK_COLORS", () => {
  const levels = ["unacceptable", "high", "limited", "minimal"] as const;

  levels.forEach((level) => {
    it(`${level} has hex badge, bg, border, bannerBg colors`, () => {
      const c = RISK_COLORS[level];
      expect(c.badge).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(c.bg).toMatch(/^#/);
      expect(c.border).toMatch(/^#/);
      expect(c.bannerBg).toMatch(/^#/);
    });

    it(`${level} has tailwind class strings`, () => {
      const t = RISK_COLORS[level].tailwind;
      expect(typeof t.bg).toBe("string");
      expect(typeof t.border).toBe("string");
      expect(typeof t.heading).toBe("string");
      expect(typeof t.body).toBe("string");
    });
  });
});

describe("RISK_LEVEL_LABELS", () => {
  it("has human-readable label for unacceptable", () => {
    expect(RISK_LEVEL_LABELS.unacceptable).toBe("Unacceptable Risk");
  });

  it("has human-readable label for high", () => {
    expect(RISK_LEVEL_LABELS.high).toBe("High Risk");
  });

  it("has human-readable label for limited", () => {
    expect(RISK_LEVEL_LABELS.limited).toBe("Limited Risk");
  });

  it("has human-readable label for minimal", () => {
    expect(RISK_LEVEL_LABELS.minimal).toBe("Minimal Risk");
  });
});

describe("EU_AI_ACT_DEADLINES", () => {
  it("has at least 3 deadlines", () => {
    expect(EU_AI_ACT_DEADLINES.length).toBeGreaterThanOrEqual(3);
  });

  it("each deadline has required shape", () => {
    EU_AI_ACT_DEADLINES.forEach((d) => {
      expect(typeof d.id).toBe("string");
      expect(typeof d.date).toBe("string");
      expect(typeof d.title).toBe("string");
      expect(typeof d.description).toBe("string");
      expect(Array.isArray(d.articles)).toBe(true);
      expect(d.articles.length).toBeGreaterThan(0);
    });
  });

  it("includes the prohibited practices deadline referencing Article 5", () => {
    const d = EU_AI_ACT_DEADLINES.find((x) => x.id === "prohibited");
    expect(d).toBeDefined();
    expect(d?.articles).toContain("Article 5");
  });

  it("dates are parseable ISO date strings", () => {
    EU_AI_ACT_DEADLINES.forEach((d) => {
      expect(new Date(d.date).toString()).not.toBe("Invalid Date");
    });
  });
});

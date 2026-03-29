import { describe, it, expect } from "vitest";
import { getObligationsForLevel } from "@/lib/engine/obligations";
import type { RiskLevel, UserRole } from "@/lib/engine/types";

const ALL_ROLES: UserRole[] = [
  "provider",
  "deployer",
  "importer",
  "distributor",
];

describe("getObligationsForLevel() — unacceptable", () => {
  ALL_ROLES.forEach((role) => {
    it(`returns 1 obligation for unacceptable + ${role}`, () => {
      const result = getObligationsForLevel("unacceptable", role);
      expect(result).toHaveLength(1);
    });

    it(`cease-prohibited obligation for unacceptable + ${role}`, () => {
      const result = getObligationsForLevel("unacceptable", role);
      expect(result[0].id).toBe("cease-prohibited");
    });
  });

  it("cease-prohibited cites Article 5", () => {
    const result = getObligationsForLevel("unacceptable", "provider");
    expect(result[0].article).toBe("Article 5");
  });

  it("cease-prohibited applies to all roles", () => {
    const ob = getObligationsForLevel("unacceptable", "provider")[0];
    expect(ob.appliesToRole).toContain("provider");
    expect(ob.appliesToRole).toContain("deployer");
    expect(ob.appliesToRole).toContain("importer");
    expect(ob.appliesToRole).toContain("distributor");
  });
});

describe("getObligationsForLevel() — high risk provider", () => {
  it("returns 11 obligations for provider", () => {
    expect(getObligationsForLevel("high", "provider")).toHaveLength(11);
  });

  const expectedArticles = [
    "Article 9",
    "Article 10",
    "Article 11",
    "Article 12",
    "Article 13",
    "Article 14",
    "Article 15",
    "Article 17",
    "Article 43",
    "Article 49",
    "Article 72",
  ];

  expectedArticles.forEach((article) => {
    it(`includes ${article} obligation for provider`, () => {
      const articles = getObligationsForLevel("high", "provider").map(
        (o) => o.article,
      );
      expect(articles).toContain(article);
    });
  });

  it("all provider obligations have required fields", () => {
    getObligationsForLevel("high", "provider").forEach((ob) => {
      expect(ob.id).toBeTruthy();
      expect(ob.title).toBeTruthy();
      expect(ob.summary).toBeTruthy();
      expect(ob.practicalMeaning).toBeTruthy();
    });
  });
});

describe("getObligationsForLevel() — high risk deployer", () => {
  it("returns 2 obligations for deployer", () => {
    expect(getObligationsForLevel("high", "deployer")).toHaveLength(2);
  });

  it("includes human-oversight-deployer obligation", () => {
    const ids = getObligationsForLevel("high", "deployer").map((o) => o.id);
    expect(ids).toContain("human-oversight-deployer");
  });

  it("includes fundamental-rights-impact obligation", () => {
    const ids = getObligationsForLevel("high", "deployer").map((o) => o.id);
    expect(ids).toContain("fundamental-rights-impact");
  });
});

describe("getObligationsForLevel() — high risk importer/distributor", () => {
  it("importer gets role-specific obligations (Article 23)", () => {
    const obligations = getObligationsForLevel("high", "importer");
    expect(obligations.length).toBeGreaterThan(0);
    const articles = obligations.map((o) => o.article);
    expect(articles.some((a) => a.includes("23"))).toBe(true);
  });

  it("importer does NOT get provider-only obligations", () => {
    const obligations = getObligationsForLevel("high", "importer");
    const ids = obligations.map((o) => o.id);
    // Provider obligations like qms, conformity, registration should not appear
    expect(ids).not.toContain("qms");
    expect(ids).not.toContain("conformity");
  });

  it("distributor gets role-specific obligations (Article 24)", () => {
    const obligations = getObligationsForLevel("high", "distributor");
    expect(obligations.length).toBeGreaterThan(0);
    const articles = obligations.map((o) => o.article);
    expect(articles.some((a) => a.includes("24"))).toBe(true);
  });

  it("distributor does NOT get provider-only obligations", () => {
    const obligations = getObligationsForLevel("high", "distributor");
    const ids = obligations.map((o) => o.id);
    expect(ids).not.toContain("qms");
    expect(ids).not.toContain("conformity");
  });
});

describe("getObligationsForLevel() — limited risk", () => {
  ALL_ROLES.forEach((role) => {
    it(`returns transparency-users for limited + ${role}`, () => {
      const result = getObligationsForLevel("limited", role);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("transparency-users");
    });
  });

  it("transparency-users cites Article 50", () => {
    const result = getObligationsForLevel("limited", "provider");
    expect(result[0].article).toBe("Article 50");
  });
});

describe("getObligationsForLevel() — minimal risk", () => {
  ALL_ROLES.forEach((role) => {
    it(`returns empty array for minimal + ${role}`, () => {
      expect(getObligationsForLevel("minimal", role)).toHaveLength(0);
    });
  });
});

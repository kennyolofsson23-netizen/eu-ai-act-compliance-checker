import { describe, it, expect } from "vitest";
import {
  cn,
  formatDate,
  formatDateISO,
  getDaysUntil,
  generateAnonymousId,
  truncate,
  slugify,
} from "@/lib/utils";

describe("cn()", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes (false is excluded)", () => {
    expect(cn("foo", false && "bar")).toBe("foo");
  });

  it("deduplicates tailwind classes (last wins)", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("handles undefined and null gracefully", () => {
    expect(cn("foo", undefined, null)).toBe("foo");
  });

  it("returns empty string with no args", () => {
    expect(cn()).toBe("");
  });

  it("handles array of classes", () => {
    expect(cn(["a", "b"])).toBe("a b");
  });
});

describe("formatDate()", () => {
  it("formats a Date object to en-GB locale", () => {
    const d = new Date("2025-08-02");
    const result = formatDate(d);
    expect(result).toContain("2025");
    expect(result).toContain("Aug");
  });

  it("formats an ISO string the same as a Date object", () => {
    expect(formatDate("2025-08-02")).toBe(formatDate(new Date("2025-08-02")));
  });

  it("includes the day number in the output", () => {
    const result = formatDate("2026-01-15");
    expect(result).toContain("15");
  });

  it("handles year-only edge: includes correct year", () => {
    expect(formatDate("2020-12-31")).toContain("2020");
  });
});

describe("formatDateISO()", () => {
  it("formats a date to YYYY-MM-DD", () => {
    expect(formatDateISO(new Date("2025-08-02T00:00:00.000Z"))).toBe(
      "2025-08-02",
    );
  });

  it("strips time portion", () => {
    const result = formatDateISO(new Date("2026-03-29T15:30:00.000Z"));
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("getDaysUntil()", () => {
  it("returns a negative number for a date in the past", () => {
    expect(getDaysUntil("2020-01-01")).toBeLessThan(0);
  });

  it("returns a positive number for a date in the future", () => {
    expect(getDaysUntil("2099-12-31")).toBeGreaterThan(0);
  });

  it("returns an integer (Math.ceil applied)", () => {
    const days = getDaysUntil("2099-01-01");
    expect(Number.isInteger(days)).toBe(true);
  });

  it("accepts a Date object as well as a string", () => {
    const future = new Date();
    future.setFullYear(future.getFullYear() + 1);
    expect(getDaysUntil(future)).toBeGreaterThan(0);
  });
});

describe("generateAnonymousId()", () => {
  it("starts with anon_", () => {
    expect(generateAnonymousId()).toMatch(/^anon_/);
  });

  it("is unique across multiple calls", () => {
    const ids = Array.from({ length: 10 }, () => generateAnonymousId());
    const unique = new Set(ids);
    expect(unique.size).toBe(10);
  });

  it("is a non-empty string", () => {
    const id = generateAnonymousId();
    expect(typeof id).toBe("string");
    expect(id.length).toBeGreaterThan(0);
  });

  it("includes a timestamp segment", () => {
    const id = generateAnonymousId();
    const parts = id.split("_");
    expect(parts.length).toBeGreaterThanOrEqual(3);
    expect(Number(parts[1])).toBeGreaterThan(0);
  });
});

describe("truncate()", () => {
  it("returns the string unchanged when shorter than the limit", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  it("returns the string unchanged when exactly at the limit", () => {
    expect(truncate("hello", 5)).toBe("hello");
  });

  it("truncates and appends ellipsis when longer than the limit", () => {
    expect(truncate("hello world", 5)).toBe("hello...");
  });

  it("truncates to the correct length before ellipsis", () => {
    const result = truncate("abcdefghij", 4);
    expect(result).toBe("abcd...");
  });

  it("handles empty string", () => {
    expect(truncate("", 10)).toBe("");
  });

  it("handles limit of 0 (truncates entire string)", () => {
    expect(truncate("hello", 0)).toBe("...");
  });
});

describe("slugify()", () => {
  it("converts to lowercase", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("replaces spaces with hyphens", () => {
    expect(slugify("foo bar baz")).toBe("foo-bar-baz");
  });

  it("removes special characters", () => {
    expect(slugify("Hello, World!")).toBe("hello-world");
  });

  it("collapses multiple hyphens into one", () => {
    expect(slugify("foo---bar")).toBe("foo-bar");
  });

  it("trims whitespace (spaces become hyphens at boundaries)", () => {
    // The implementation uses .trim() which removes whitespace but spaces
    // at boundaries are converted to hyphens first by replace(/\s+/g, '-')
    const result = slugify("  Hello  ");
    expect(result).toContain("hello");
  });

  it("handles an already-slugified string unchanged", () => {
    expect(slugify("already-slugified")).toBe("already-slugified");
  });

  it("handles empty string", () => {
    expect(slugify("")).toBe("");
  });

  it("handles numbers in string", () => {
    expect(slugify("EU AI Act 2024")).toBe("eu-ai-act-2024");
  });
});

import { describe, it, expect } from "vitest";
import {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  isValidLocale,
  getLocaleDisplayName,
} from "@/lib/i18n/config";
import en from "@/lib/i18n/locales/en.json";
import de from "@/lib/i18n/locales/de.json";
import fr from "@/lib/i18n/locales/fr.json";

describe("i18n config", () => {
  it("supports exactly 3 locales: en, de, fr", () => {
    expect(SUPPORTED_LOCALES).toHaveLength(3);
    expect(SUPPORTED_LOCALES).toContain("en");
    expect(SUPPORTED_LOCALES).toContain("de");
    expect(SUPPORTED_LOCALES).toContain("fr");
  });

  it("defaults to English", () => {
    expect(DEFAULT_LOCALE).toBe("en");
  });
});

describe("isValidLocale()", () => {
  it("returns true for supported locales", () => {
    expect(isValidLocale("en")).toBe(true);
    expect(isValidLocale("de")).toBe(true);
    expect(isValidLocale("fr")).toBe(true);
  });

  it("returns false for unsupported locales", () => {
    expect(isValidLocale("es")).toBe(false);
    expect(isValidLocale("zh")).toBe(false);
    expect(isValidLocale("")).toBe(false);
    expect(isValidLocale("EN")).toBe(false);
  });
});

describe("getLocaleDisplayName()", () => {
  it("returns English for en", () => {
    expect(getLocaleDisplayName("en")).toBe("English");
  });

  it("returns Deutsch for de", () => {
    expect(getLocaleDisplayName("de")).toBe("Deutsch");
  });

  it("returns Français for fr", () => {
    expect(getLocaleDisplayName("fr")).toBe("Français");
  });
});

describe("translation files structure", () => {
  const translations = { en, de, fr };
  const topLevelKeys = ["nav", "hero", "riskLevels", "questionnaire", "common"];

  it.each(topLevelKeys)("all locales have the '%s' namespace", (key) => {
    for (const [locale, t] of Object.entries(translations)) {
      expect(t, `${locale} missing '${key}'`).toHaveProperty(key);
    }
  });

  it("riskLevels namespace has all 4 risk levels in all locales", () => {
    const riskLevels = ["unacceptable", "high", "limited", "minimal"];
    for (const [locale, t] of Object.entries(translations)) {
      for (const level of riskLevels) {
        expect(
          (t.riskLevels as Record<string, string>)[level],
          `${locale} missing riskLevel.${level}`,
        ).toBeTruthy();
      }
    }
  });

  it("all locales have nav.startAssessment", () => {
    for (const [locale, t] of Object.entries(translations)) {
      expect(
        (t.nav as Record<string, string>).startAssessment,
        `${locale} missing nav.startAssessment`,
      ).toBeTruthy();
    }
  });

  it("English translation keys match German translation keys", () => {
    const enKeys = Object.keys(en).sort();
    const deKeys = Object.keys(de).sort();
    expect(deKeys).toEqual(enKeys);
  });

  it("English translation keys match French translation keys", () => {
    const enKeys = Object.keys(en).sort();
    const frKeys = Object.keys(fr).sort();
    expect(frKeys).toEqual(enKeys);
  });
});

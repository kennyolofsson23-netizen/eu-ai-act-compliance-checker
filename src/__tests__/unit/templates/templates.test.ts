import { describe, it, expect } from "vitest";
import {
  TEMPLATES,
  TEMPLATE_IDS,
  getTemplate,
  getAllTemplates,
} from "@/lib/templates/index";
import type { TemplateId } from "@/lib/templates/index";

const EXPECTED_TEMPLATE_IDS: TemplateId[] = [
  "technical-documentation",
  "risk-management",
  "data-governance",
  "human-oversight",
  "post-market-monitoring",
  "transparency-disclosure",
];

describe("TEMPLATES", () => {
  it("contains all 6 required templates", () => {
    expect(Object.keys(TEMPLATES)).toHaveLength(6);
  });

  it("contains all expected template IDs", () => {
    for (const id of EXPECTED_TEMPLATE_IDS) {
      expect(TEMPLATES).toHaveProperty(id);
    }
  });

  it.each(EXPECTED_TEMPLATE_IDS)("template %s has required fields", (id) => {
    const template = TEMPLATES[id];
    expect(typeof template.id).toBe("string");
    expect(typeof template.title).toBe("string");
    expect(typeof template.description).toBe("string");
    expect(typeof template.article).toBe("string");
    expect(Array.isArray(template.sections)).toBe(true);
    expect(template.sections.length).toBeGreaterThan(0);
  });

  it.each(EXPECTED_TEMPLATE_IDS)("template %s has valid sections", (id) => {
    const template = TEMPLATES[id];
    for (const section of template.sections) {
      expect(typeof section.id).toBe("string");
      expect(typeof section.title).toBe("string");
      expect(typeof section.description).toBe("string");
      expect(typeof section.placeholder).toBe("string");
    }
  });

  it("each template id matches its key", () => {
    for (const [key, template] of Object.entries(TEMPLATES)) {
      expect(template.id).toBe(key);
    }
  });
});

describe("TEMPLATE_IDS", () => {
  it("contains all 6 template IDs", () => {
    expect(TEMPLATE_IDS).toHaveLength(6);
  });

  it("contains all expected IDs", () => {
    for (const id of EXPECTED_TEMPLATE_IDS) {
      expect(TEMPLATE_IDS).toContain(id);
    }
  });
});

describe("getTemplate()", () => {
  it("returns the correct template for each ID", () => {
    for (const id of EXPECTED_TEMPLATE_IDS) {
      const template = getTemplate(id);
      expect(template.id).toBe(id);
    }
  });

  it("returns technical-documentation template", () => {
    const template = getTemplate("technical-documentation");
    expect(template.article).toBe("Article 11");
  });

  it("returns risk-management template", () => {
    const template = getTemplate("risk-management");
    expect(template.article).toBe("Article 9");
  });

  it("returns data-governance template", () => {
    const template = getTemplate("data-governance");
    expect(template.article).toBe("Article 10");
  });

  it("returns human-oversight template", () => {
    const template = getTemplate("human-oversight");
    expect(template.article).toBe("Article 14");
  });

  it("returns post-market-monitoring template", () => {
    const template = getTemplate("post-market-monitoring");
    expect(template.article).toBe("Article 72");
  });

  it("returns transparency-disclosure template", () => {
    const template = getTemplate("transparency-disclosure");
    expect(template.article).toMatch(/Article 13/);
  });
});

describe("getAllTemplates()", () => {
  it("returns an array of 6 templates", () => {
    const templates = getAllTemplates();
    expect(templates).toHaveLength(6);
  });

  it("each template has an id, title, article, and sections", () => {
    const templates = getAllTemplates();
    for (const template of templates) {
      expect(template.id).toBeTruthy();
      expect(template.title).toBeTruthy();
      expect(template.article).toBeTruthy();
      expect(template.sections.length).toBeGreaterThan(0);
    }
  });

  it("returns unique template IDs", () => {
    const templates = getAllTemplates();
    const ids = templates.map((t) => t.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(templates.length);
  });
});

import { describe, it, expect } from "vitest";
import { classify } from "@/lib/engine/classifier";
import type { AssessmentAnswers } from "@/lib/engine/types";

/** Fully-answered "safe" baseline → should produce minimal risk */
const minimal: AssessmentAnswers = {
  isAiSystem: true,
  role: "provider",
  isGpai: false,
  prohibitedPractices: ["none"],
  isSafetyComponent: false,
  domain: "other",
  domainFunction: "recommendation",
  isNarrowTask: false,
  profilesPersons: false,
  interactsWithPeople: false,
  generatesSyntheticContent: false,
  emotionRecognition: false,
};

describe("classify() — non-AI system", () => {
  it("returns minimal risk when isAiSystem is false", () => {
    expect(classify({ isAiSystem: false }).riskLevel).toBe("minimal");
  });

  it("returns empty citedArticles for non-AI", () => {
    expect(classify({ isAiSystem: false }).citedArticles).toHaveLength(0);
  });

  it("returns empty obligations for non-AI", () => {
    expect(classify({ isAiSystem: false }).obligations).toHaveLength(0);
  });

  it("mentions Article 3(1) in reasoning", () => {
    expect(classify({ isAiSystem: false }).reasoning).toContain("Article 3(1)");
  });
});

describe("classify() — prohibited practices (Article 5)", () => {
  const prohibited = [
    "subliminal",
    "vulnerability",
    "social_scoring",
    "realtime_biometric",
    "emotion_workplace",
    "biometric_categorisation",
  ];

  prohibited.forEach((practice) => {
    it(`classifies "${practice}" as unacceptable`, () => {
      const result = classify({
        isAiSystem: true,
        prohibitedPractices: [practice],
      });
      expect(result.riskLevel).toBe("unacceptable");
    });
  });

  it("cites Article 5 for any prohibited practice", () => {
    const result = classify({
      isAiSystem: true,
      prohibitedPractices: ["social_scoring"],
    });
    expect(result.citedArticles).toContain("Article 5");
  });

  it("sets prohibitedPractice field describing the violation", () => {
    const result = classify({
      isAiSystem: true,
      prohibitedPractices: ["subliminal"],
    });
    expect(result.prohibitedPractice).toBeDefined();
    expect(result.prohibitedPractice!.length).toBeGreaterThan(0);
  });

  it("returns the cease-prohibited obligation", () => {
    const result = classify({
      isAiSystem: true,
      prohibitedPractices: ["social_scoring"],
    });
    expect(result.obligations).toHaveLength(1);
    expect(result.obligations[0].id).toBe("cease-prohibited");
  });

  it("handles multiple prohibited practices", () => {
    const result = classify({
      isAiSystem: true,
      prohibitedPractices: ["subliminal", "social_scoring"],
    });
    expect(result.riskLevel).toBe("unacceptable");
  });

  it("ignores the 'none' sentinel value", () => {
    const result = classify({ ...minimal, prohibitedPractices: ["none"] });
    expect(result.riskLevel).not.toBe("unacceptable");
  });

  it("ignores empty-string sentinel value", () => {
    const result = classify({ ...minimal, prohibitedPractices: [""] });
    expect(result.riskLevel).not.toBe("unacceptable");
  });

  it("handles empty prohibitedPractices array", () => {
    const result = classify({ ...minimal, prohibitedPractices: [] });
    expect(result.riskLevel).not.toBe("unacceptable");
  });
});

describe("classify() — high risk: safety component", () => {
  it("classifies safety component as high risk", () => {
    expect(classify({ ...minimal, isSafetyComponent: true }).riskLevel).toBe(
      "high",
    );
  });

  it("cites Article 6(1) and Annex II", () => {
    const result = classify({ ...minimal, isSafetyComponent: true });
    expect(result.citedArticles).toContain("Article 6(1)");
    expect(result.citedArticles).toContain("Annex II");
  });

  it("sets annexCategory to 'safety_component'", () => {
    expect(
      classify({ ...minimal, isSafetyComponent: true }).annexCategory,
    ).toBe("safety_component");
  });
});

describe("classify() — high risk: domain + function", () => {
  const highRiskDomains = [
    "biometrics",
    "critical_infrastructure",
    "education",
    "employment",
    "essential_services",
    "law_enforcement",
    "migration",
    "justice",
  ];

  const highRiskFunctions = [
    "decision_making",
    "risk_assessment",
    "profiling",
    "monitoring",
  ];

  highRiskDomains.forEach((domain) => {
    it(`${domain} + decision_making → high risk`, () => {
      const result = classify({
        ...minimal,
        domain,
        domainFunction: "decision_making",
        isNarrowTask: false,
      });
      expect(result.riskLevel).toBe("high");
    });
  });

  highRiskFunctions.forEach((fn) => {
    it(`employment + ${fn} → high risk`, () => {
      const result = classify({
        ...minimal,
        domain: "employment",
        domainFunction: fn,
        isNarrowTask: false,
      });
      expect(result.riskLevel).toBe("high");
    });
  });

  it("non-high-risk domain with high-risk function → not high", () => {
    const result = classify({
      ...minimal,
      domain: "other",
      domainFunction: "decision_making",
      isNarrowTask: false,
    });
    expect(result.riskLevel).not.toBe("high");
  });

  it("high-risk domain with non-high-risk function → not high", () => {
    const result = classify({
      ...minimal,
      domain: "employment",
      domainFunction: "recommendation",
      isNarrowTask: false,
    });
    expect(result.riskLevel).not.toBe("high");
  });

  it("narrow task exemption prevents high classification", () => {
    const result = classify({
      ...minimal,
      domain: "employment",
      domainFunction: "decision_making",
      isNarrowTask: true,
    });
    expect(result.riskLevel).not.toBe("high");
  });

  it("cites Article 6(2) and Annex III", () => {
    const result = classify({
      ...minimal,
      domain: "employment",
      domainFunction: "decision_making",
      isNarrowTask: false,
    });
    expect(result.citedArticles).toContain("Article 6(2)");
    expect(result.citedArticles).toContain("Annex III");
  });

  it("sets annexCategory to the domain name", () => {
    const result = classify({
      ...minimal,
      domain: "employment",
      domainFunction: "decision_making",
      isNarrowTask: false,
    });
    expect(result.annexCategory).toBe("employment");
  });
});

describe("classify() — high risk: domain + profiling", () => {
  it("high-risk domain + profilesPersons → high risk", () => {
    const result = classify({
      ...minimal,
      domain: "law_enforcement",
      domainFunction: "recommendation",
      profilesPersons: true,
      isNarrowTask: false,
    });
    expect(result.riskLevel).toBe("high");
  });

  it("narrow task does NOT exempt profiling-based high risk (Article 6(3))", () => {
    // Per Article 6(3): profiling nullifies the narrow procedural task exception
    const result = classify({
      ...minimal,
      domain: "law_enforcement",
      domainFunction: "recommendation",
      profilesPersons: true,
      isNarrowTask: true,
    });
    expect(result.riskLevel).toBe("high");
  });

  it("non-high-risk domain + profilesPersons → not high", () => {
    const result = classify({
      ...minimal,
      domain: "other",
      profilesPersons: true,
      isNarrowTask: false,
    });
    expect(result.riskLevel).not.toBe("high");
  });
});

describe("classify() — limited risk (Article 50)", () => {
  it("interactsWithPeople → limited", () => {
    expect(classify({ ...minimal, interactsWithPeople: true }).riskLevel).toBe(
      "limited",
    );
  });

  it("generatesSyntheticContent → limited", () => {
    expect(
      classify({ ...minimal, generatesSyntheticContent: true }).riskLevel,
    ).toBe("limited");
  });

  it("emotionRecognition → limited", () => {
    expect(classify({ ...minimal, emotionRecognition: true }).riskLevel).toBe(
      "limited",
    );
  });

  it("cites Article 50", () => {
    const result = classify({ ...minimal, interactsWithPeople: true });
    expect(result.citedArticles).toContain("Article 50");
  });

  it("includes transparency-users obligation", () => {
    const result = classify({ ...minimal, interactsWithPeople: true });
    expect(result.obligations.some((o) => o.id === "transparency-users")).toBe(
      true,
    );
  });

  it("mentions all triggered factors in reasoning", () => {
    const result = classify({
      ...minimal,
      interactsWithPeople: true,
      generatesSyntheticContent: true,
      emotionRecognition: true,
    });
    expect(result.reasoning).toContain("natural persons");
    expect(result.reasoning).toContain("media content");
    expect(result.reasoning).toContain("emotion recognition");
  });
});

describe("classify() — minimal risk", () => {
  it("fully safe system returns minimal", () => {
    expect(classify(minimal).riskLevel).toBe("minimal");
  });

  it("empty obligations for minimal risk", () => {
    expect(classify(minimal).obligations).toHaveLength(0);
  });

  it("references Article 95 in reasoning", () => {
    expect(classify(minimal).reasoning).toContain("Article 95");
  });
});

describe("classify() — role-based obligations", () => {
  it("provider gets 11 high-risk obligations", () => {
    const result = classify({
      ...minimal,
      role: "provider",
      isSafetyComponent: true,
    });
    expect(result.obligations.length).toBeGreaterThanOrEqual(11);
  });

  it("deployer gets human-oversight and fundamental-rights obligations", () => {
    const result = classify({
      ...minimal,
      role: "deployer",
      isSafetyComponent: true,
    });
    const ids = result.obligations.map((o) => o.id);
    expect(ids).toContain("human-oversight-deployer");
    expect(ids).toContain("fundamental-rights-impact");
  });

  it("defaults to provider role when role is undefined", () => {
    const result = classify({
      ...minimal,
      role: undefined,
      isSafetyComponent: true,
    });
    expect(result.obligations.some((o) => o.id === "risk-mgmt")).toBe(true);
  });

  it("unacceptable risk same obligation regardless of role", () => {
    const provider = classify({
      isAiSystem: true,
      role: "provider",
      prohibitedPractices: ["social_scoring"],
    });
    const deployer = classify({
      isAiSystem: true,
      role: "deployer",
      prohibitedPractices: ["social_scoring"],
    });
    expect(provider.obligations[0].id).toBe("cease-prohibited");
    expect(deployer.obligations[0].id).toBe("cease-prohibited");
  });
});

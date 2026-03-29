import { describe, it, expect } from "vitest";
import {
  QUESTIONS,
  QUESTION_MAP,
  FIRST_QUESTION_ID,
  TOTAL_QUESTIONS,
} from "@/lib/engine/questions";

describe("QUESTIONS array", () => {
  it("contains exactly 12 questions", () => {
    expect(QUESTIONS).toHaveLength(12);
  });

  it("every question has id, text, and type", () => {
    QUESTIONS.forEach((q) => {
      expect(typeof q.id).toBe("string");
      expect(q.id.length).toBeGreaterThan(0);
      expect(typeof q.text).toBe("string");
      expect(q.text.length).toBeGreaterThan(0);
      expect(["radio", "checkbox", "info"]).toContain(q.type);
    });
  });

  it("radio/checkbox questions have at least 2 options", () => {
    QUESTIONS.filter(
      (q) => q.type === "radio" || q.type === "checkbox",
    ).forEach((q) => {
      expect(q.options).toBeDefined();
      expect(q.options!.length).toBeGreaterThanOrEqual(2);
    });
  });

  it("all options have a value and a label", () => {
    QUESTIONS.forEach((q) => {
      q.options?.forEach((opt) => {
        expect(typeof opt.value).toBe("string");
        expect(opt.value.length).toBeGreaterThan(0);
        expect(typeof opt.label).toBe("string");
        expect(opt.label.length).toBeGreaterThan(0);
      });
    });
  });

  it("question IDs follow the expected order", () => {
    const expected = [
      "q1_is_ai",
      "q2_role",
      "q3_gpai",
      "q4_prohibited",
      "q5_safety_component",
      "q6_domain",
      "q7_function",
      "q8_narrow_task",
      "q9_profiles_persons",
      "q10_interacts_people",
      "q11_synthetic_content",
      "q12_emotion_recognition",
    ];
    expect(QUESTIONS.map((q) => q.id)).toEqual(expected);
  });

  it("q4 is a checkbox question", () => {
    const q4 = QUESTIONS.find((q) => q.id === "q4_prohibited");
    expect(q4?.type).toBe("checkbox");
  });

  it("q4 includes a 'none of the above' option", () => {
    const q4 = QUESTIONS.find((q) => q.id === "q4_prohibited");
    expect(q4?.options?.some((o) => o.value === "none")).toBe(true);
  });

  it("q6 includes all 8 high-risk domains plus 'other'", () => {
    const q6 = QUESTIONS.find((q) => q.id === "q6_domain");
    const values = q6?.options?.map((o) => o.value) ?? [];
    const domains = [
      "biometrics",
      "critical_infrastructure",
      "education",
      "employment",
      "essential_services",
      "law_enforcement",
      "migration",
      "justice",
      "other",
    ];
    domains.forEach((d) => expect(values).toContain(d));
  });

  it("q2 includes all four EU AI Act roles", () => {
    const q2 = QUESTIONS.find((q) => q.id === "q2_role");
    const values = q2?.options?.map((o) => o.value) ?? [];
    ["provider", "deployer", "importer", "distributor"].forEach((r) =>
      expect(values).toContain(r),
    );
  });
});

describe("QUESTION_MAP", () => {
  it("has 12 entries", () => {
    expect(QUESTION_MAP.size).toBe(12);
  });

  it("lookup by id returns the correct question", () => {
    const q = QUESTION_MAP.get("q1_is_ai");
    expect(q).toBeDefined();
    expect(q?.id).toBe("q1_is_ai");
  });

  it("returns undefined for unknown id", () => {
    expect(QUESTION_MAP.get("not_a_question")).toBeUndefined();
  });
});

describe("FIRST_QUESTION_ID", () => {
  it("is q1_is_ai", () => {
    expect(FIRST_QUESTION_ID).toBe("q1_is_ai");
  });
});

describe("TOTAL_QUESTIONS", () => {
  it("is 12", () => {
    expect(TOTAL_QUESTIONS).toBe(12);
  });
});

describe("Question navigation (next functions)", () => {
  it("q1 → null when answer is 'no' (early exit)", () => {
    const q1 = QUESTION_MAP.get("q1_is_ai")!;
    expect(q1.next?.("no")).toBeNull();
  });

  it("q1 → q2_role when answer is 'yes'", () => {
    const q1 = QUESTION_MAP.get("q1_is_ai")!;
    expect(q1.next?.("yes")).toBe("q2_role");
  });

  it("q2 always → q3_gpai regardless of role", () => {
    const q2 = QUESTION_MAP.get("q2_role")!;
    ["provider", "deployer", "importer", "distributor"].forEach((role) => {
      expect(q2.next?.(role)).toBe("q3_gpai");
    });
  });

  it("q3 always → q4_prohibited", () => {
    const q3 = QUESTION_MAP.get("q3_gpai")!;
    expect(q3.next?.("yes")).toBe("q4_prohibited");
    expect(q3.next?.("no")).toBe("q4_prohibited");
  });

  it("q4 → null for any prohibited practice (early exit)", () => {
    const q4 = QUESTION_MAP.get("q4_prohibited")!;
    [
      "subliminal",
      "vulnerability",
      "social_scoring",
      "realtime_biometric",
      "emotion_workplace",
      "biometric_categorisation",
    ].forEach((p) => {
      expect(q4.next?.([p])).toBeNull();
    });
  });

  it("q4 → q5_safety_component when answer is ['none']", () => {
    const q4 = QUESTION_MAP.get("q4_prohibited")!;
    expect(q4.next?.(["none"])).toBe("q5_safety_component");
  });

  it("q4 → q5_safety_component when answer is ['']", () => {
    const q4 = QUESTION_MAP.get("q4_prohibited")!;
    expect(q4.next?.([""])).toBe("q5_safety_component");
  });

  it("q5 always → q6_domain", () => {
    const q5 = QUESTION_MAP.get("q5_safety_component")!;
    expect(q5.next?.("yes")).toBe("q6_domain");
    expect(q5.next?.("no")).toBe("q6_domain");
  });

  it("q6 always → q7_function", () => {
    const q6 = QUESTION_MAP.get("q6_domain")!;
    expect(q6.next?.("employment")).toBe("q7_function");
    expect(q6.next?.("other")).toBe("q7_function");
  });

  it("q7 always → q8_narrow_task", () => {
    const q7 = QUESTION_MAP.get("q7_function")!;
    expect(q7.next?.("decision_making")).toBe("q8_narrow_task");
  });

  it("q12 → null (terminal question)", () => {
    const q12 = QUESTION_MAP.get("q12_emotion_recognition")!;
    expect(q12.next?.("yes")).toBeNull();
    expect(q12.next?.("no")).toBeNull();
  });
});

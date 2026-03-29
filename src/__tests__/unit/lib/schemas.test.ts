import { describe, it, expect } from "vitest";
import {
  assessmentAnswersSchema,
  createAssessmentSchema,
  updateAssessmentSchema,
  analyticsEventSchema,
  registerSchema,
  loginSchema,
} from "@/lib/validation/schemas";

describe("assessmentAnswersSchema", () => {
  it("accepts a fully populated answers object", () => {
    const result = assessmentAnswersSchema.safeParse({
      isAiSystem: true,
      role: "provider",
      isGpai: false,
      prohibitedPractices: ["none"],
      isSafetyComponent: false,
      domain: "employment",
      domainFunction: "decision_making",
      isNarrowTask: false,
      profilesPersons: false,
      interactsWithPeople: true,
      generatesSyntheticContent: false,
      emotionRecognition: false,
    });
    expect(result.success).toBe(true);
  });

  it("accepts an empty object (all fields optional)", () => {
    expect(assessmentAnswersSchema.safeParse({}).success).toBe(true);
  });

  it("rejects an invalid role value", () => {
    expect(assessmentAnswersSchema.safeParse({ role: "admin" }).success).toBe(
      false,
    );
  });

  it("accepts all four valid roles", () => {
    ["provider", "deployer", "importer", "distributor"].forEach((role) => {
      expect(assessmentAnswersSchema.safeParse({ role }).success).toBe(true);
    });
  });

  it("rejects non-boolean for isAiSystem", () => {
    expect(
      assessmentAnswersSchema.safeParse({ isAiSystem: "yes" }).success,
    ).toBe(false);
  });

  it("accepts array for prohibitedPractices", () => {
    expect(
      assessmentAnswersSchema.safeParse({
        prohibitedPractices: ["subliminal", "none"],
      }).success,
    ).toBe(true);
  });
});

describe("createAssessmentSchema", () => {
  it("accepts valid full input", () => {
    const result = createAssessmentSchema.safeParse({
      systemName: "My AI System",
      answers: { isAiSystem: true, role: "provider" },
      anonymousId: "anon-123",
    });
    expect(result.success).toBe(true);
  });

  it("accepts input with only answers (everything else optional)", () => {
    expect(createAssessmentSchema.safeParse({ answers: {} }).success).toBe(true);
  });

  it("rejects systemName longer than 200 characters", () => {
    expect(
      createAssessmentSchema.safeParse({
        answers: {},
        systemName: "a".repeat(201),
      }).success,
    ).toBe(false);
  });

  it("rejects empty systemName", () => {
    expect(
      createAssessmentSchema.safeParse({ answers: {}, systemName: "" }).success,
    ).toBe(false);
  });

  it("rejects missing answers field", () => {
    expect(
      createAssessmentSchema.safeParse({ systemName: "Test" }).success,
    ).toBe(false);
  });
});

describe("updateAssessmentSchema", () => {
  it("accepts systemName update", () => {
    expect(
      updateAssessmentSchema.safeParse({ systemName: "New Name" }).success,
    ).toBe(true);
  });

  it("accepts emailReminders update", () => {
    expect(
      updateAssessmentSchema.safeParse({ emailReminders: true }).success,
    ).toBe(true);
  });

  it("accepts empty object", () => {
    expect(updateAssessmentSchema.safeParse({}).success).toBe(true);
  });

  it("rejects non-boolean emailReminders", () => {
    expect(
      updateAssessmentSchema.safeParse({ emailReminders: "yes" }).success,
    ).toBe(false);
  });

  it("rejects systemName over 200 characters", () => {
    expect(
      updateAssessmentSchema.safeParse({ systemName: "a".repeat(201) }).success,
    ).toBe(false);
  });
});

describe("analyticsEventSchema", () => {
  const validTypes = [
    "started",
    "completed",
    "abandoned",
    "pdf_downloaded",
    "badge_copied",
  ];

  validTypes.forEach((eventType) => {
    it(`accepts valid eventType: ${eventType}`, () => {
      expect(analyticsEventSchema.safeParse({ eventType }).success).toBe(true);
    });
  });

  it("rejects unknown event type", () => {
    expect(
      analyticsEventSchema.safeParse({ eventType: "viewed" }).success,
    ).toBe(false);
  });

  it("rejects missing eventType", () => {
    expect(analyticsEventSchema.safeParse({}).success).toBe(false);
  });

  it("accepts optional assessmentId, questionId, metadata", () => {
    expect(
      analyticsEventSchema.safeParse({
        eventType: "completed",
        assessmentId: "abc123",
        questionId: "q5",
        metadata: { source: "web" },
      }).success,
    ).toBe(true);
  });
});

describe("registerSchema", () => {
  it("accepts valid registration data", () => {
    expect(
      registerSchema.safeParse({
        email: "user@example.com",
        password: "Password1",
        name: "Alice",
      }).success,
    ).toBe(true);
  });

  it("rejects invalid email", () => {
    expect(
      registerSchema.safeParse({ email: "not-an-email", password: "Password1" })
        .success,
    ).toBe(false);
  });

  it("rejects password shorter than 8 characters", () => {
    expect(
      registerSchema.safeParse({ email: "a@b.com", password: "Pass1" }).success,
    ).toBe(false);
  });

  it("rejects password without an uppercase letter", () => {
    expect(
      registerSchema.safeParse({ email: "a@b.com", password: "password1" })
        .success,
    ).toBe(false);
  });

  it("rejects password without a number", () => {
    expect(
      registerSchema.safeParse({ email: "a@b.com", password: "Password" })
        .success,
    ).toBe(false);
  });
});

describe("loginSchema", () => {
  it("accepts valid credentials", () => {
    expect(
      loginSchema.safeParse({ email: "user@example.com", password: "any" })
        .success,
    ).toBe(true);
  });

  it("rejects invalid email", () => {
    expect(
      loginSchema.safeParse({ email: "bad", password: "x" }).success,
    ).toBe(false);
  });

  it("rejects empty password", () => {
    expect(
      loginSchema.safeParse({ email: "a@b.com", password: "" }).success,
    ).toBe(false);
  });
});

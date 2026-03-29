import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import React from "react";
import {
  QuestionnaireProvider,
  useQuestionnaire,
  getAnswerKey,
} from "@/components/checker/QuestionnaireProvider";

// Mock classifier to keep tests deterministic and fast
vi.mock("@/lib/engine/classifier", () => ({
  classify: vi.fn((answers) => ({
    riskLevel: answers.isAiSystem === false ? "minimal" : "high",
    citedArticles: answers.isAiSystem === false ? [] : ["Article 6(2)"],
    obligations: [],
    reasoning: "Mocked reasoning",
  })),
}));

function wrapper({ children }: { children: React.ReactNode }) {
  return <QuestionnaireProvider>{children}</QuestionnaireProvider>;
}

describe("getAnswerKey()", () => {
  const expectedMappings: Array<[string, string]> = [
    ["q1_is_ai", "isAiSystem"],
    ["q2_role", "role"],
    ["q3_gpai", "isGpai"],
    ["q4_prohibited", "prohibitedPractices"],
    ["q5_safety_component", "isSafetyComponent"],
    ["q6_domain", "domain"],
    ["q7_function", "domainFunction"],
    ["q8_narrow_task", "isNarrowTask"],
    ["q9_profiles_persons", "profilesPersons"],
    ["q10_interacts_people", "interactsWithPeople"],
    ["q11_synthetic_content", "generatesSyntheticContent"],
    ["q12_emotion_recognition", "emotionRecognition"],
  ];

  expectedMappings.forEach(([questionId, expectedKey]) => {
    it(`maps ${questionId} → ${expectedKey}`, () => {
      expect(getAnswerKey(questionId)).toBe(expectedKey);
    });
  });

  it("falls back to the questionId itself for unknown ids", () => {
    expect(getAnswerKey("unknown_q")).toBe("unknown_q");
  });
});

describe("useQuestionnaire() — context guard", () => {
  it("throws when used outside of QuestionnaireProvider", () => {
    expect(() => renderHook(() => useQuestionnaire())).toThrow(
      "useQuestionnaire must be used within QuestionnaireProvider",
    );
  });
});

describe("QuestionnaireProvider — initial state", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it("starts at the first question (q1_is_ai)", () => {
    const { result } = renderHook(() => useQuestionnaire(), { wrapper });
    expect(result.current.state.currentQuestionId).toBe("q1_is_ai");
  });

  it("starts with empty answers", () => {
    const { result } = renderHook(() => useQuestionnaire(), { wrapper });
    expect(result.current.state.answers).toEqual({});
  });

  it("starts with isComplete = false", () => {
    const { result } = renderHook(() => useQuestionnaire(), { wrapper });
    expect(result.current.state.isComplete).toBe(false);
  });

  it("starts with no result", () => {
    const { result } = renderHook(() => useQuestionnaire(), { wrapper });
    expect(result.current.state.result).toBeNull();
  });

  it("totalQuestions is 12", () => {
    const { result } = renderHook(() => useQuestionnaire(), { wrapper });
    expect(result.current.totalQuestions).toBe(12);
  });
});

describe("QuestionnaireProvider — answerQuestion", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it("advances to q2_role after answering q1 with 'yes'", () => {
    const { result } = renderHook(() => useQuestionnaire(), { wrapper });
    act(() => {
      result.current.answerQuestion("q1_is_ai", "yes");
    });
    expect(result.current.state.currentQuestionId).toBe("q2_role");
  });

  it("records the answer in the answers object", () => {
    const { result } = renderHook(() => useQuestionnaire(), { wrapper });
    act(() => {
      result.current.answerQuestion("q1_is_ai", "yes");
    });
    expect(result.current.state.answers.isAiSystem).toBe("yes");
  });

  it("completes immediately when q1 = 'no' (non-AI system)", () => {
    const { result } = renderHook(() => useQuestionnaire(), { wrapper });
    act(() => {
      result.current.answerQuestion("q1_is_ai", "no");
    });
    expect(result.current.state.isComplete).toBe(true);
    expect(result.current.state.result).not.toBeNull();
  });

  it("completes immediately on prohibited practice in q4", () => {
    const { result } = renderHook(() => useQuestionnaire(), { wrapper });
    act(() => {
      result.current.answerQuestion("q1_is_ai", "yes");
      result.current.answerQuestion("q2_role", "provider");
      result.current.answerQuestion("q3_gpai", "no");
      result.current.answerQuestion("q4_prohibited", ["social_scoring"]);
    });
    expect(result.current.state.isComplete).toBe(true);
  });

  it("does NOT complete on q4 when answer is ['none']", () => {
    const { result } = renderHook(() => useQuestionnaire(), { wrapper });
    act(() => {
      result.current.answerQuestion("q1_is_ai", "yes");
      result.current.answerQuestion("q2_role", "provider");
      result.current.answerQuestion("q3_gpai", "no");
      result.current.answerQuestion("q4_prohibited", ["none"]);
    });
    expect(result.current.state.isComplete).toBe(false);
  });

  it("ignores answers for unknown question ids", () => {
    const { result } = renderHook(() => useQuestionnaire(), { wrapper });
    const before = result.current.state.currentQuestionId;
    act(() => {
      result.current.answerQuestion("not_a_real_question", "anything");
    });
    expect(result.current.state.currentQuestionId).toBe(before);
  });

  it("adds the next question to questionHistory", () => {
    const { result } = renderHook(() => useQuestionnaire(), { wrapper });
    act(() => {
      result.current.answerQuestion("q1_is_ai", "yes");
    });
    expect(result.current.state.questionHistory).toContain("q2_role");
  });
});

describe("QuestionnaireProvider — goBack", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it("navigates to the previous question", () => {
    const { result } = renderHook(() => useQuestionnaire(), { wrapper });
    act(() => {
      result.current.answerQuestion("q1_is_ai", "yes");
    });
    expect(result.current.state.currentQuestionId).toBe("q2_role");
    act(() => {
      result.current.goBack();
    });
    expect(result.current.state.currentQuestionId).toBe("q1_is_ai");
  });

  it("does nothing when already on the first question", () => {
    const { result } = renderHook(() => useQuestionnaire(), { wrapper });
    act(() => {
      result.current.goBack();
    });
    expect(result.current.state.currentQuestionId).toBe("q1_is_ai");
  });

  it("clears isComplete and result when going back from a deep completion", () => {
    const { result } = renderHook(() => useQuestionnaire(), { wrapper });
    // Navigate deep enough so history length > 1, then trigger prohibited-practice completion
    act(() => {
      result.current.answerQuestion("q1_is_ai", "yes");
      result.current.answerQuestion("q2_role", "provider");
      result.current.answerQuestion("q3_gpai", "no");
      result.current.answerQuestion("q4_prohibited", ["social_scoring"]);
    });
    expect(result.current.state.isComplete).toBe(true);
    act(() => {
      result.current.goBack();
    });
    expect(result.current.state.isComplete).toBe(false);
    expect(result.current.state.result).toBeNull();
  });
});

describe("QuestionnaireProvider — reset", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it("resets to initial state after answering questions", () => {
    const { result } = renderHook(() => useQuestionnaire(), { wrapper });
    act(() => {
      result.current.answerQuestion("q1_is_ai", "yes");
      result.current.setSystemName("My System");
      result.current.reset();
    });
    expect(result.current.state.currentQuestionId).toBe("q1_is_ai");
    expect(result.current.state.answers).toEqual({});
    expect(result.current.state.isComplete).toBe(false);
    expect(result.current.state.systemName).toBe("");
  });

  it("resets localStorage to initial state on reset", () => {
    const { result } = renderHook(() => useQuestionnaire(), { wrapper });
    act(() => {
      result.current.setSystemName("Test");
      result.current.reset();
    });
    // The state-sync effect re-writes the initial state after reset;
    // verify systemName is cleared and we're back at the first question.
    const saved = localStorage.getItem("eu_ai_questionnaire_state");
    const parsed = saved ? JSON.parse(saved) : null;
    expect(parsed?.systemName).toBe("");
    expect(parsed?.currentQuestionId).toBe("q1_is_ai");
  });
});

describe("QuestionnaireProvider — setSystemName", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it("updates the systemName in state", () => {
    const { result } = renderHook(() => useQuestionnaire(), { wrapper });
    act(() => {
      result.current.setSystemName("My AI Platform");
    });
    expect(result.current.state.systemName).toBe("My AI Platform");
  });

  it("can update systemName multiple times", () => {
    const { result } = renderHook(() => useQuestionnaire(), { wrapper });
    act(() => {
      result.current.setSystemName("First");
      result.current.setSystemName("Second");
    });
    expect(result.current.state.systemName).toBe("Second");
  });
});

describe("QuestionnaireProvider — progress", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it("starts at a low progress percentage", () => {
    const { result } = renderHook(() => useQuestionnaire(), { wrapper });
    expect(result.current.progress).toBeGreaterThanOrEqual(0);
    expect(result.current.progress).toBeLessThanOrEqual(100);
  });

  it("progress increases after answering a question", () => {
    const { result } = renderHook(() => useQuestionnaire(), { wrapper });
    const before = result.current.progress;
    act(() => {
      result.current.answerQuestion("q1_is_ai", "yes");
    });
    expect(result.current.progress).toBeGreaterThan(before);
  });
});

describe("QuestionnaireProvider — localStorage persistence", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it("persists state to localStorage when systemName changes", () => {
    const { result } = renderHook(() => useQuestionnaire(), { wrapper });
    act(() => {
      result.current.setSystemName("Persistent System");
    });
    const saved = localStorage.getItem("eu_ai_questionnaire_state");
    expect(saved).not.toBeNull();
    expect(JSON.parse(saved!).systemName).toBe("Persistent System");
  });

  it("restores state from localStorage on mount", async () => {
    const savedState = {
      currentQuestionId: "q3_gpai",
      answers: { isAiSystem: true, role: "provider" },
      questionHistory: ["q1_is_ai", "q2_role", "q3_gpai"],
      isComplete: false,
      result: null,
      systemName: "Restored System",
    };
    localStorage.setItem(
      "eu_ai_questionnaire_state",
      JSON.stringify(savedState),
    );

    const { result } = renderHook(() => useQuestionnaire(), { wrapper });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.state.currentQuestionId).toBe("q3_gpai");
    expect(result.current.state.systemName).toBe("Restored System");
  });

  it("handles malformed localStorage data gracefully", () => {
    localStorage.setItem("eu_ai_questionnaire_state", "NOT_VALID_JSON{{{{");
    expect(() =>
      renderHook(() => useQuestionnaire(), { wrapper }),
    ).not.toThrow();
  });
});

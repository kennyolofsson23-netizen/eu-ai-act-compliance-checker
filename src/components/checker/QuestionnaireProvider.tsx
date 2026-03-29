"use client";
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import { AssessmentAnswers, ClassificationResult } from "@/lib/engine/types";
import {
  QUESTIONS,
  FIRST_QUESTION_ID,
  QUESTION_MAP,
} from "@/lib/engine/questions";
import { classify } from "@/lib/engine/classifier";

function onStorageError(_err: unknown): void {
  // Storage errors (private browsing, quota limits, corrupted data) are non-fatal.
  // Fresh/default state will be used.
}

export interface QuestionnaireState {
  currentQuestionId: string;
  answers: AssessmentAnswers;
  questionHistory: string[];
  isComplete: boolean;
  result: ClassificationResult | null;
  systemName: string;
}

type Action =
  | {
      type: "ANSWER_QUESTION";
      questionId: string;
      answer: string | string[] | boolean;
    }
  | { type: "GO_BACK" }
  | { type: "RESET" }
  | { type: "SET_SYSTEM_NAME"; name: string }
  | { type: "RESTORE"; state: QuestionnaireState };

const initialState: QuestionnaireState = {
  currentQuestionId: FIRST_QUESTION_ID,
  answers: {},
  questionHistory: [FIRST_QUESTION_ID],
  isComplete: false,
  result: null,
  systemName: "",
};

const STORAGE_KEY = "eu_ai_questionnaire_state";

export function getAnswerKey(questionId: string): keyof AssessmentAnswers {
  const map: Record<string, keyof AssessmentAnswers> = {
    q1_is_ai: "isAiSystem",
    q2_role: "role",
    q3_gpai: "isGpai",
    q4_prohibited: "prohibitedPractices",
    q5_safety_component: "isSafetyComponent",
    q6_domain: "domain",
    q7_function: "domainFunction",
    q8_narrow_task: "isNarrowTask",
    q9_profiles_persons: "profilesPersons",
    q10_interacts_people: "interactsWithPeople",
    q11_synthetic_content: "generatesSyntheticContent",
    q12_emotion_recognition: "emotionRecognition",
  };
  return (map[questionId] ?? questionId) as keyof AssessmentAnswers;
}

function buildNonAiResult(
  state: QuestionnaireState,
  newAnswers: AssessmentAnswers,
): QuestionnaireState {
  return {
    ...state,
    answers: newAnswers,
    isComplete: true,
    result: classify({ isAiSystem: false }),
  };
}

function buildProhibitedResult(
  state: QuestionnaireState,
  newAnswers: AssessmentAnswers,
  answer: string | string[] | boolean,
): QuestionnaireState | null {
  const arr = Array.isArray(answer) ? answer : [answer as string];
  if (!arr.some((a) => a !== "none" && a !== "")) return null;
  const mergedAnswers = { ...newAnswers, prohibitedPractices: arr };
  return {
    ...state,
    answers: mergedAnswers,
    isComplete: true,
    result: classify(mergedAnswers),
  };
}

function buildCompleteState(
  state: QuestionnaireState,
  newAnswers: AssessmentAnswers,
): QuestionnaireState {
  return {
    ...state,
    answers: newAnswers,
    isComplete: true,
    result: classify(newAnswers),
    questionHistory: [...state.questionHistory],
  };
}

function buildNextState(
  state: QuestionnaireState,
  newAnswers: AssessmentAnswers,
  nextId: string,
): QuestionnaireState {
  return {
    ...state,
    answers: newAnswers,
    currentQuestionId: nextId,
    questionHistory: [...state.questionHistory, nextId],
  };
}

function handleAnswerQuestion(
  state: QuestionnaireState,
  questionId: string,
  answer: string | string[] | boolean,
): QuestionnaireState {
  const question = QUESTION_MAP.get(questionId);
  if (!question) return state;

  const answerKey = getAnswerKey(questionId);
  const newAnswers = { ...state.answers, [answerKey]: answer } as AssessmentAnswers;

  if (questionId === "q1_is_ai" && answer === "no")
    return buildNonAiResult(state, newAnswers);

  if (questionId === "q4_prohibited") {
    const prohibitedResult = buildProhibitedResult(state, newAnswers, answer);
    if (prohibitedResult) return prohibitedResult;
  }

  const answerStr = Array.isArray(answer) ? (answer as string[])[0] : String(answer);
  const nextId = question.next ? question.next(answerStr) : null;

  return nextId
    ? buildNextState(state, newAnswers, nextId)
    : buildCompleteState(state, newAnswers);
}

function reducer(
  state: QuestionnaireState,
  action: Action,
): QuestionnaireState {
  switch (action.type) {
    case "ANSWER_QUESTION":
      return handleAnswerQuestion(state, action.questionId, action.answer);
    case "GO_BACK": {
      if (state.questionHistory.length <= 1) return state;
      const newHistory = state.questionHistory.slice(0, -1);
      return {
        ...state,
        currentQuestionId: newHistory[newHistory.length - 1],
        questionHistory: newHistory,
        isComplete: false,
        result: null,
      };
    }
    case "RESET":
      return { ...initialState };
    case "SET_SYSTEM_NAME":
      return { ...state, systemName: action.name };
    case "RESTORE":
      return action.state;
    default:
      return state;
  }
}

export interface QuestionnaireContextValue {
  state: QuestionnaireState;
  answerQuestion: (
    questionId: string,
    answer: string | string[] | boolean,
  ) => void;
  goBack: () => void;
  reset: () => void;
  setSystemName: (name: string) => void;
  progress: number;
  totalQuestions: number;
}

const QuestionnaireContext = createContext<QuestionnaireContextValue | null>(
  null,
);

export function QuestionnaireProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: QuestionnaireState = JSON.parse(saved);
        if (parsed?.currentQuestionId)
          dispatch({ type: "RESTORE", state: parsed });
      }
    } catch (err: unknown) {
      onStorageError(err);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err: unknown) {
      onStorageError(err);
    }
  }, [state]);

  const answerQuestion = useCallback(
    (questionId: string, answer: string | string[] | boolean) => {
      dispatch({ type: "ANSWER_QUESTION", questionId, answer });
    },
    [],
  );

  const goBack = useCallback(() => dispatch({ type: "GO_BACK" }), []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err: unknown) {
      onStorageError(err);
    }
  }, []);

  const setSystemName = useCallback(
    (name: string) => dispatch({ type: "SET_SYSTEM_NAME", name }),
    [],
  );
  const progress = Math.round(
    (state.questionHistory.length / QUESTIONS.length) * 100,
  );

  return (
    <QuestionnaireContext.Provider
      value={{
        state,
        answerQuestion,
        goBack,
        reset,
        setSystemName,
        progress,
        totalQuestions: QUESTIONS.length,
      }}
    >
      {children}
    </QuestionnaireContext.Provider>
  );
}

export function useQuestionnaire(): QuestionnaireContextValue {
  const ctx = useContext(QuestionnaireContext);
  if (!ctx)
    throw new Error(
      "useQuestionnaire must be used within QuestionnaireProvider",
    );
  return ctx;
}

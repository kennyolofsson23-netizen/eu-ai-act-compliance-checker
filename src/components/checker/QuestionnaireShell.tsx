"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useQuestionnaire, getAnswerKey } from "./QuestionnaireProvider";
import QuestionCard from "./QuestionCard";
import ProgressBar from "./ProgressBar";
import { QUESTION_MAP } from "@/lib/engine/questions";
import { AssessmentAnswers } from "@/lib/engine/types";

function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Loader2
        className="h-8 w-8 text-blue-600 animate-spin mb-4"
        aria-hidden="true"
      />
      <p className="text-slate-600">Classifying your AI system under the EU AI Act…</p>
    </div>
  );
}

export default function QuestionnaireShell() {
  const router = useRouter();
  const { state, answerQuestion, goBack, progress, totalQuestions } =
    useQuestionnaire();

  useEffect(() => {
    if (!state.isComplete || !state.result) return;
    try {
      sessionStorage.setItem(
        "eu_ai_result",
        JSON.stringify({
          result: state.result,
          answers: state.answers,
          systemName: state.systemName,
        }),
      );
    } catch (_err) {
      // Ignore storage errors
    }
    router.push("/checker/results");
  }, [state.isComplete, state.result, state.answers, state.systemName, router]);

  if (state.isComplete) return <LoadingScreen />;

  const question = QUESTION_MAP.get(state.currentQuestionId);
  if (!question) return null;

  const currentStep = state.questionHistory.length;
  const answerKey = getAnswerKey(state.currentQuestionId);
  const previousAnswer = state.answers[answerKey as keyof AssessmentAnswers] as
    | string
    | string[]
    | undefined;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <ProgressBar
        current={currentStep}
        total={totalQuestions}
        percentage={progress}
      />

      <div className="mt-8 bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">
          {question.text}
        </h2>
        <QuestionCard
          question={question}
          onAnswer={(answer) => answerQuestion(state.currentQuestionId, answer)}
          previousAnswer={previousAnswer}
        />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={goBack}
          disabled={state.questionHistory.length <= 1}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors py-2 px-3 rounded-md hover:bg-slate-100"
          aria-label="Go to previous question"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Previous
        </button>
        <p className="text-xs text-slate-400">
          Progress is saved automatically
        </p>
      </div>
    </div>
  );
}

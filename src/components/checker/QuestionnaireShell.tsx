"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuestionnaire, getAnswerKey } from "./QuestionnaireProvider";
import QuestionCard from "./QuestionCard";
import ProgressBar from "./ProgressBar";
import { QUESTION_MAP } from "@/lib/engine/questions";

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
    } catch (err: unknown) {
      void err; // sessionStorage write failure is non-fatal; navigation proceeds
    }
    router.push("/checker/results");
  }, [state.isComplete, state.result, state.answers, state.systemName, router]);

  if (state.isComplete) return <LoadingScreen />;

  const question = QUESTION_MAP.get(state.currentQuestionId);
  if (!question) return null;

  const currentStep = state.questionHistory.length;
  const answerKey = getAnswerKey(state.currentQuestionId);
  const rawAnswer = state.answers[answerKey];
  const previousAnswer: string | string[] | undefined = Array.isArray(rawAnswer)
    ? rawAnswer
    : typeof rawAnswer === "string"
      ? rawAnswer
      : undefined;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <ProgressBar
        current={currentStep}
        total={totalQuestions}
        percentage={progress}
      />

      <div className="mt-8 bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8">
        <h2 className="text-2xl font-semibold text-slate-900 mb-6">
          {question.text}
        </h2>
        <QuestionCard
          question={question}
          onAnswer={(answer) => answerQuestion(state.currentQuestionId, answer)}
          previousAnswer={previousAnswer}
        />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <Button
          onClick={goBack}
          disabled={state.questionHistory.length <= 1}
          variant="ghost"
          size="lg"
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
          aria-label="Go to previous question"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Previous
        </Button>
        <p className="text-xs text-slate-400">
          Progress is saved automatically
        </p>
      </div>
    </div>
  );
}

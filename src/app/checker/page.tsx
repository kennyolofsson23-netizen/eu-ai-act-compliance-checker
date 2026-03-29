import type { Metadata } from "next";
import { Shield } from "lucide-react";
import { QuestionnaireProvider } from "@/components/checker/QuestionnaireProvider";
import QuestionnaireShell from "@/components/checker/QuestionnaireShell";

export const metadata: Metadata = {
  title: "EU AI Act Risk Assessment",
  description:
    "Classify your AI system under the EU AI Act in 12 questions. Receive your risk level, obligation checklist, and compliance badge. Free, no account needed.",
};

export default function CheckerPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium mb-4">
            <Shield className="h-4 w-4" aria-hidden="true" />
            Free Assessment — No Signup Required
          </div>
          <h1 className="text-3xl font-bold text-slate-900">
            EU AI Act Risk Assessment
          </h1>
          <p className="mt-2 text-slate-600 max-w-xl mx-auto">
            Answer up to 12 plain-language questions. Get your risk
            classification, obligation checklist, and compliance badge
            — no account required.
          </p>
        </div>
        <QuestionnaireProvider>
          <QuestionnaireShell />
        </QuestionnaireProvider>
      </div>
    </div>
  );
}

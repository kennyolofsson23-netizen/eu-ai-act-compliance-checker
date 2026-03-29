"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { EU_AI_ACT_DEADLINES } from "@/lib/constants";
import { getDaysUntil, formatDate } from "@/lib/utils";

export default function DeadlineCountdown() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section
      className="py-20 md:py-32 bg-white"
      aria-labelledby="deadlines-heading"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            id="deadlines-heading"
            className="text-4xl font-bold text-slate-900"
          >
            Key EU AI Act Deadlines
          </h2>
          <p className="mt-4 text-xl text-slate-600">
            Each phase carries real enforcement teeth. Know which deadlines
            apply to your AI system before they pass.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {EU_AI_ACT_DEADLINES.map((deadline) => {
            const daysLeft = mounted ? getDaysUntil(deadline.date) : null;
            const isPast = daysLeft !== null && daysLeft <= 0;
            const isUrgent =
              daysLeft !== null && daysLeft > 0 && daysLeft <= 90;

            return (
              <div
                key={deadline.id}
                className={`rounded-xl border p-6 ${
                  isPast
                    ? "bg-green-50 border-green-200"
                    : isUrgent
                      ? "bg-orange-50 border-orange-200"
                      : "bg-blue-50 border-blue-200"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {deadline.title}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      {deadline.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {deadline.articles.map((a) => (
                        <span
                          key={a}
                          className="text-xs bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-medium text-slate-500">
                      {formatDate(deadline.date)}
                    </div>
                    {mounted && (
                      <div
                        className={`text-2xl font-bold mt-1 ${
                          isPast
                            ? "text-green-700"
                            : isUrgent
                              ? "text-orange-700"
                              : "text-blue-700"
                        }`}
                      >
                        {isPast ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-5 w-5" aria-hidden="true" />
                            <span>Now in effect</span>
                          </span>
                        ) : `${daysLeft} days`}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/checker"
            className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Check Your Compliance Status
          </Link>
        </div>
      </div>
    </section>
  );
}

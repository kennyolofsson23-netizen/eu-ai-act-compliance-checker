"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import type { ClassificationResult } from "@/lib/engine/types";

interface StoredResult {
  result: ClassificationResult;
  answers: Record<string, unknown>;
  systemName?: string;
}

const RISK_CONFIG: Record<
  string,
  { label: string; color: string; Icon: React.ElementType }
> = {
  unacceptable: {
    label: "Unacceptable Risk",
    color: "text-red-700 bg-red-50 border-red-200",
    Icon: XCircle,
  },
  high: {
    label: "High Risk",
    color: "text-orange-700 bg-orange-50 border-orange-200",
    Icon: AlertTriangle,
  },
  limited: {
    label: "Limited Risk",
    color: "text-yellow-700 bg-yellow-50 border-yellow-200",
    Icon: Shield,
  },
  minimal: {
    label: "Minimal Risk",
    color: "text-green-700 bg-green-50 border-green-200",
    Icon: CheckCircle,
  },
};

export default function ResultsPage() {
  const router = useRouter();
  const [data, setData] = useState<StoredResult | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("eu_ai_result");
      if (!raw) {
        router.replace("/checker");
        return;
      }
      const parsed = JSON.parse(raw) as StoredResult;
      if (!parsed?.result?.riskLevel) {
        router.replace("/checker");
        return;
      }
      setData(parsed);
    } catch {
      setError(true);
    }
  }, [router]);

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">
            Unable to load your results. Please try again.
          </p>
          <button
            onClick={() => router.push("/checker")}
            className="text-blue-600 underline"
          >
            Start a new assessment
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-slate-500">Loading results…</p>
      </div>
    );
  }

  const { result, systemName } = data;
  const riskConfig = RISK_CONFIG[result.riskLevel] ?? RISK_CONFIG.minimal;
  const { label, color, Icon } = riskConfig;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Assessment Results
          </h1>
          {systemName && (
            <p className="mt-2 text-slate-600">
              System:{" "}
              <span className="font-medium text-slate-800">{systemName}</span>
            </p>
          )}
        </div>

        <div className={`rounded-xl border p-6 mb-6 ${color}`}>
          <div className="flex items-center gap-3 mb-3">
            <Icon className="h-6 w-6" aria-hidden="true" />
            <h2 className="text-xl font-semibold">{label}</h2>
          </div>
          <p className="text-sm leading-relaxed">{result.reasoning}</p>
        </div>

        {result.obligations.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Key Obligations
            </h3>
            <ul className="space-y-3">
              {result.obligations.map((obligation) => (
                <li key={obligation.id} className="flex gap-3">
                  <CheckCircle
                    className="h-5 w-5 text-blue-500 mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-medium text-slate-800">
                      {obligation.title}
                    </p>
                    <p className="text-sm text-slate-500">
                      {obligation.summary}
                    </p>
                    <span className="text-xs text-blue-600">
                      {obligation.article}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={() => {
              sessionStorage.removeItem("eu_ai_result");
              router.push("/checker");
            }}
            className="text-sm text-blue-600 underline hover:text-blue-800"
          >
            Start a new assessment
          </button>
        </div>
      </div>
    </div>
  );
}

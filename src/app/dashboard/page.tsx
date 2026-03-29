"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Plus, Clock, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface AssessmentSummary {
  id: string;
  systemName: string;
  riskLevel: string;
  role: string;
  isGpai: boolean;
  createdAt: string;
  updatedAt: string;
}

const RISK_ICONS: Record<string, React.ElementType> = {
  unacceptable: XCircle,
  high: AlertTriangle,
  limited: Shield,
  minimal: CheckCircle,
};

const RISK_COLORS: Record<string, string> = {
  unacceptable: "text-red-600",
  high: "text-orange-500",
  limited: "text-yellow-500",
  minimal: "text-green-500",
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [assessments, setAssessments] = useState<AssessmentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/assessments")
      .then((r) => r.json())
      .then((data) => {
        setAssessments(data.assessments ?? []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load assessments.");
        setLoading(false);
      });
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-slate-500">Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600 mt-1">
              Welcome back, {session?.user?.name ?? session?.user?.email}
            </p>
          </div>
          <Link
            href="/checker"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            New Assessment
          </Link>
        </div>

        {assessments.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <Shield className="h-12 w-12 text-slate-300 mx-auto mb-4" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-slate-700 mb-2">
              No assessments yet
            </h2>
            <p className="text-slate-500 mb-6">
              Start your first EU AI Act compliance assessment.
            </p>
            <Link
              href="/checker"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Start Assessment
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {assessments.map((assessment) => {
              const Icon = RISK_ICONS[assessment.riskLevel] ?? Shield;
              const colorClass = RISK_COLORS[assessment.riskLevel] ?? "text-slate-500";
              return (
                <div
                  key={assessment.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Icon className={`h-5 w-5 shrink-0 ${colorClass}`} aria-hidden="true" />
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {assessment.systemName}
                        </h3>
                        <p className="text-sm text-slate-500 capitalize">
                          {assessment.riskLevel.replace("-", " ")} risk · {assessment.role}
                          {assessment.isGpai ? " · GPAI" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 shrink-0">
                      <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                      {new Date(assessment.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

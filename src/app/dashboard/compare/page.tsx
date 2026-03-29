"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ComparisonTable from "@/components/dashboard/ComparisonTable";
import type { AssessmentData } from "@/lib/engine/types";

export default function ComparePage() {
  const { status } = useSession();
  const router = useRouter();
  const [assessments, setAssessments] = useState<AssessmentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/assessments")
      .then((r) => r.json())
      .then((data: { assessments?: AssessmentData[] }) => {
        setAssessments(data.assessments ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-slate-500">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">
          Compare Assessments
        </h1>
        <ComparisonTable assessments={assessments} />
      </div>
    </div>
  );
}

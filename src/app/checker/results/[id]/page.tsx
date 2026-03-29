export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/client";
import RiskClassificationBanner from "@/components/results/RiskClassificationBanner";
import ObligationChecklist from "@/components/results/ObligationChecklist";
import ArticleCitations from "@/components/results/ArticleCitations";
import DisclaimerBanner from "@/components/results/DisclaimerBanner";
import type { AssessmentData } from "@/lib/engine/types";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SavedResultPage({ params }: Props) {
  const { id } = await params;

  const assessment = await prisma.assessment.findUnique({ where: { id } });
  if (!assessment) notFound();

  const data: AssessmentData = {
    id: assessment.id,
    systemName: assessment.systemName,
    riskLevel: assessment.riskLevel as AssessmentData["riskLevel"],
    role: assessment.role as AssessmentData["role"],
    isGpai: assessment.isGpai,
    annexCategory: assessment.annexCategory ?? undefined,
    citedArticles: JSON.parse(assessment.citedArticles) as string[],
    obligations: JSON.parse(
      assessment.obligations,
    ) as AssessmentData["obligations"],
    answers: JSON.parse(assessment.answers) as AssessmentData["answers"],
    createdAt: assessment.createdAt.toISOString(),
    updatedAt: assessment.updatedAt.toISOString(),
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Assessment Results
          </h1>
          <p className="mt-2 text-slate-600">
            System:{" "}
            <span className="font-medium text-slate-800">
              {data.systemName}
            </span>
          </p>
        </div>

        <RiskClassificationBanner
          riskLevel={data.riskLevel}
          reasoning={`Risk classification: ${data.riskLevel}`}
          systemName={data.systemName}
        />

        <ArticleCitations articles={data.citedArticles} />

        <ObligationChecklist obligations={data.obligations} />

        <div className="mt-6">
          <DisclaimerBanner />
        </div>
      </div>
    </div>
  );
}

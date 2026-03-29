import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { auth } from "@/lib/auth";
import { generateAssessmentPdf, getPdfFilename } from "@/lib/pdf/generator";
import type { AssessmentData } from "@/lib/engine/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await auth();
    const userId = session?.user?.id ?? null;
    const anonymousId = request.cookies.get("eu_ai_anon_id")?.value ?? null;

    const assessment = await prisma.assessment.findUnique({ where: { id } });
    if (!assessment) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const canAccess =
      (userId && assessment.userId === userId) ||
      (!userId && anonymousId && assessment.anonymousId === anonymousId);

    if (!canAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const assessmentData: AssessmentData = {
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

    const pdfBuffer = await generateAssessmentPdf({
      assessment: assessmentData,
    });
    const filename = getPdfFilename(assessmentData);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(pdfBuffer.length),
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 },
    );
  }
}

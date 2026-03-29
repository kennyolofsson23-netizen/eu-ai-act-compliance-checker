import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { auth } from "@/lib/auth";
import { createAssessmentSchema } from "@/lib/validation/schemas";
import { classify } from "@/lib/engine/classifier";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit/limiter";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const assessments = await prisma.assessment.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        systemName: true,
        riskLevel: true,
        role: true,
        isGpai: true,
        annexCategory: true,
        emailReminders: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ assessments });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || "anonymous";
    const session = await auth();
    const userId = session?.user?.id;

    const rl = rateLimit(
      userId ? `assessment_auth_${userId}` : `assessment_anon_${ip}`,
      userId
        ? RATE_LIMITS.ASSESSMENT_CREATE_AUTH.limit
        : RATE_LIMITS.ASSESSMENT_CREATE_ANON.limit,
      userId
        ? RATE_LIMITS.ASSESSMENT_CREATE_AUTH.windowMs
        : RATE_LIMITS.ASSESSMENT_CREATE_ANON.windowMs,
    );

    if (!rl.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await request.json();
    const parsed = createAssessmentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 422 },
      );
    }

    const { systemName, answers, anonymousId } = parsed.data;

    // Run classification
    const result = classify(answers);

    // Store in DB
    const assessment = await prisma.assessment.create({
      data: {
        userId: userId || null,
        anonymousId: userId ? null : anonymousId || null,
        systemName: systemName || "Untitled AI System",
        answers: JSON.stringify(answers),
        riskLevel: result.riskLevel,
        role: (answers.role as string) || "provider",
        isGpai: Boolean(answers.isGpai),
        annexCategory: result.annexCategory || null,
        citedArticles: JSON.stringify(result.citedArticles),
        obligations: JSON.stringify(result.obligations),
      },
    });

    return NextResponse.json(
      {
        id: assessment.id,
        systemName: assessment.systemName,
        riskLevel: result.riskLevel,
        role: assessment.role,
        isGpai: assessment.isGpai,
        annexCategory: result.annexCategory,
        citedArticles: result.citedArticles,
        obligations: result.obligations,
        reasoning: result.reasoning,
        badgeUrl: `/api/badge/${assessment.id}`,
        createdAt: assessment.createdAt,
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

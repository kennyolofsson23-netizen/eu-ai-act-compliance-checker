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
      take: 100,
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
  } catch (err: unknown) {
    console.error("[assessments]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rawIp = request.headers.get("x-forwarded-for");
    const ip = rawIp ? rawIp.split(",").at(-1)!.trim() : "anonymous";
    const session = await auth();
    const userId = session?.user?.id;

    const rl = await rateLimit(
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

    // Attempt to store in DB — gracefully degrade if DB is unavailable
    let assessmentId: string | null = null;
    let savedSystemName = systemName || "Untitled AI System";
    let savedRole = (answers.role as string) || "provider";
    let savedIsGpai = Boolean(answers.isGpai);
    let savedCreatedAt = new Date();

    try {
      const assessment = await prisma.assessment.create({
        data: {
          userId: userId || null,
          anonymousId: userId ? null : anonymousId || null,
          systemName: savedSystemName,
          answers: JSON.stringify(answers),
          riskLevel: result.riskLevel,
          role: savedRole,
          isGpai: savedIsGpai,
          annexCategory: result.annexCategory || null,
          citedArticles: JSON.stringify(result.citedArticles),
          obligations: JSON.stringify(result.obligations),
        },
      });
      assessmentId = assessment.id;
      savedSystemName = assessment.systemName;
      savedRole = assessment.role;
      savedIsGpai = assessment.isGpai;
      savedCreatedAt = assessment.createdAt;
    } catch (dbErr: unknown) {
      console.warn("[assessments] DB unavailable, returning stateless result:", dbErr);
      // Generate a temporary ID for badge URL — not persisted
      assessmentId = `tmp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    }

    return NextResponse.json(
      {
        id: assessmentId,
        systemName: savedSystemName,
        riskLevel: result.riskLevel,
        role: savedRole,
        isGpai: savedIsGpai,
        annexCategory: result.annexCategory,
        citedArticles: result.citedArticles,
        obligations: result.obligations,
        reasoning: result.reasoning,
        badgeUrl: assessmentId ? `/api/badge/${assessmentId}` : null,
        createdAt: savedCreatedAt,
      },
      { status: 201 },
    );
  } catch (err: unknown) {
    console.error("[assessments]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { analyticsEventSchema } from "@/lib/validation/schemas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = analyticsEventSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 422 },
      );
    }

    const { assessmentId, eventType, questionId, metadata } = parsed.data;

    await prisma.assessmentEvent.create({
      data: {
        assessmentId: assessmentId || null,
        eventType,
        questionId: questionId || null,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    // Don't fail the main flow if analytics fails
    console.error("Analytics event error:", error);
    return NextResponse.json({ ok: true }, { status: 201 });
  }
}

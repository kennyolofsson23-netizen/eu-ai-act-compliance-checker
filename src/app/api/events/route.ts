import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { analyticsEventSchema } from "@/lib/validation/schemas";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit/limiter";

export async function POST(request: NextRequest) {
  const rawIp = request.headers.get("x-forwarded-for");
  const ip = rawIp ? rawIp.split(",").at(-1)!.trim() : "anonymous";
  const rl = await rateLimit(
    `events_${ip}`,
    RATE_LIMITS.EVENTS.limit,
    RATE_LIMITS.EVENTS.windowMs,
  );
  if (!rl.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch (_error) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = analyticsEventSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 422 },
    );
  }

  const { assessmentId, eventType, questionId, metadata } = parsed.data;

  // Fire-and-forget: analytics must not block or fail the user flow
  void prisma.assessmentEvent
    .create({
      data: {
        assessmentId: assessmentId || null,
        eventType,
        questionId: questionId || null,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    })
    .catch(() => {
      // Intentionally ignored — analytics failure must not disrupt user flow
    });

  return NextResponse.json({ ok: true }, { status: 201 });
}

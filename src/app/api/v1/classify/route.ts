import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { classify } from "@/lib/engine/classifier";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit/limiter";
import type { AssessmentAnswers } from "@/lib/engine/types";

const classifyRequestSchema = z.object({
  systemName: z.string().min(1).max(200).optional(),
  answers: z.object({
    isAiSystem: z.boolean().optional(),
    role: z.enum(["provider", "deployer", "importer", "distributor"]).optional(),
    isGpai: z.boolean().optional(),
    prohibitedPractices: z.array(z.string()).optional(),
    isSafetyComponent: z.boolean().optional(),
    domain: z.string().optional(),
    domainFunction: z.string().optional(),
    isNarrowTask: z.boolean().optional(),
    profilesPersons: z.boolean().optional(),
    interactsWithPeople: z.boolean().optional(),
    generatesSyntheticContent: z.boolean().optional(),
    emotionRecognition: z.boolean().optional(),
  }),
});

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim() ??
      request.headers.get("x-real-ip") ??
      "anonymous";
    const rl = await rateLimit(
      `classify_${ip}`,
      RATE_LIMITS.API_ANONYMOUS.limit,
      RATE_LIMITS.API_ANONYMOUS.windowMs,
    );
    if (!rl.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await request.json();
    const parsed = classifyRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 422 },
      );
    }

    const answers: AssessmentAnswers = parsed.data.answers;
    const result = classify(answers);

    return NextResponse.json({
      riskLevel: result.riskLevel,
      citedArticles: result.citedArticles,
      obligations: result.obligations.map((o) => ({
        id: o.id,
        title: o.title,
        article: o.article,
        summary: o.summary,
      })),
      reasoning: result.reasoning,
      annexCategory: result.annexCategory,
    });
  } catch (err: unknown) {
    void err;
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

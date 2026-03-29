import { NextRequest, NextResponse } from "next/server";
import { sendDeadlineReminder } from "@/lib/email/reminders";
import { prisma } from "@/lib/db/client";

/**
 * Cron endpoint: send deadline reminder emails to users who have opted in.
 * Expects a CRON_SECRET header for authentication.
 */
export async function GET(request: NextRequest) {
  const secret = request.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const assessments = await prisma.assessment.findMany({
      where: { emailReminders: true, userId: { not: null } },
      include: { user: { select: { email: true, name: true } } },
    });

    const results = await Promise.allSettled(
      assessments.map((assessment) => {
        if (!assessment.user?.email) return Promise.resolve({ skipped: true });
        return sendDeadlineReminder({
          assessmentId: assessment.id,
          systemName: assessment.systemName,
          riskLevel: assessment.riskLevel,
          deadlineTitle: "EU AI Act Full Enforcement",
          deadlineDate: "2026-08-02",
          daysUntil: Math.ceil(
            (new Date("2026-08-02").getTime() - Date.now()) / 86_400_000,
          ),
          recipient: {
            email: assessment.user.email,
            name: assessment.user.name ?? undefined,
          },
        });
      }),
    );

    const sent = results.filter(
      (r) => r.status === "fulfilled",
    ).length;

    return NextResponse.json({ sent, total: assessments.length });
  } catch {
    return NextResponse.json(
      { error: "Failed to process reminders" },
      { status: 500 },
    );
  }
}

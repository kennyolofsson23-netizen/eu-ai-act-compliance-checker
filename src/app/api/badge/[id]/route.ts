import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { generateBadgeSvg } from "@/lib/badge/generator";
import type { RiskLevel } from "@/lib/engine/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const assessment = await prisma.assessment.findUnique({
      where: { id },
      select: {
        id: true,
        systemName: true,
        riskLevel: true,
      },
    });

    if (!assessment) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const svg = generateBadgeSvg({
      riskLevel: assessment.riskLevel as RiskLevel,
      systemName: assessment.systemName,
      assessmentId: assessment.id,
    });

    return new NextResponse(svg, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (err: unknown) {
    console.error("[badge/id]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

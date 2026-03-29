import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/client";
import { registerSchema } from "@/lib/validation/schemas";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit/limiter";

export async function POST(request: NextRequest) {
  try {
    const rawIp = request.headers.get("x-forwarded-for");
    const ip = rawIp ? rawIp.split(",")[0].trim() : "anonymous";
    const rl = await rateLimit(
      `register_${ip}`,
      RATE_LIMITS.AUTH_REGISTER.limit,
      RATE_LIMITS.AUTH_REGISTER.windowMs,
    );
    if (!rl.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 422 },
      );
    }
    const { email, password, name } = parsed.data;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Registration failed. Please try with different credentials." },
        { status: 409 },
      );
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, passwordHash, name: name || null },
      select: { id: true, email: true, name: true },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (_error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

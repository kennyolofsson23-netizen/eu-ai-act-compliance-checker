import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/db/client", () => ({
  prisma: {
    assessment: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/rate-limit/limiter", () => ({
  rateLimit: vi.fn(() => ({
    success: true,
    remaining: 59,
    reset: Date.now() + 3_600_000,
  })),
  RATE_LIMITS: {
    ASSESSMENT_CREATE_ANON: { limit: 20, windowMs: 3_600_000 },
    ASSESSMENT_CREATE_AUTH: { limit: 60, windowMs: 3_600_000 },
  },
}));

vi.mock("@/lib/engine/classifier", () => ({
  classify: vi.fn(() => ({
    riskLevel: "high",
    citedArticles: ["Article 6(2)", "Annex III"],
    obligations: [],
    reasoning: "Test reasoning",
    annexCategory: "employment",
  })),
}));

import { POST, GET } from "@/app/api/assessments/route";
import { prisma } from "@/lib/db/client";
import { auth } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit/limiter";
import { classify } from "@/lib/engine/classifier";
import { NextRequest } from "next/server";

function postRequest(body: unknown, extraHeaders: Record<string, string> = {}) {
  return new NextRequest("http://localhost/api/assessments", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json", ...extraHeaders },
  });
}

function getRequest() {
  return new NextRequest("http://localhost/api/assessments", { method: "GET" });
}

const mockAssessment = {
  id: "assessment-1",
  systemName: "Test AI System",
  riskLevel: "high",
  role: "provider",
  isGpai: false,
  annexCategory: "employment",
  emailReminders: false,
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-01"),
};

describe("POST /api/assessments", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(auth).mockResolvedValue(null);
    vi.mocked(prisma.assessment.create).mockResolvedValue(
      mockAssessment as never,
    );
  });

  it("returns 201 on successful creation", async () => {
    const res = await POST(postRequest({ answers: { isAiSystem: true } }));
    expect(res.status).toBe(201);
  });

  it("calls classify with the provided answers", async () => {
    const answers = { isAiSystem: true, role: "provider" };
    await POST(postRequest({ answers }));
    expect(classify).toHaveBeenCalledWith(answers);
  });

  it("response body contains riskLevel from classification", async () => {
    const res = await POST(postRequest({ answers: {} }));
    const data = await res.json();
    expect(data.riskLevel).toBe("high");
  });

  it("response includes a badgeUrl", async () => {
    const res = await POST(postRequest({ answers: {} }));
    const data = await res.json();
    expect(typeof data.badgeUrl).toBe("string");
    expect(data.badgeUrl).toContain("/api/badge/");
  });

  it("response includes citedArticles and obligations", async () => {
    const res = await POST(postRequest({ answers: {} }));
    const data = await res.json();
    expect(Array.isArray(data.citedArticles)).toBe(true);
    expect(Array.isArray(data.obligations)).toBe(true);
  });

  it("returns 422 when answers field is missing", async () => {
    const res = await POST(postRequest({ systemName: "Test" }));
    expect(res.status).toBe(422);
  });

  it("returns 422 for invalid role in answers", async () => {
    const res = await POST(
      postRequest({ answers: { isAiSystem: true, role: "admin" } }),
    );
    expect(res.status).toBe(422);
  });

  it("returns 422 for systemName exceeding 200 chars", async () => {
    const res = await POST(
      postRequest({ answers: {}, systemName: "x".repeat(201) }),
    );
    expect(res.status).toBe(422);
  });

  it("returns 429 when rate limit is exceeded", async () => {
    vi.mocked(rateLimit).mockReturnValueOnce({
      success: false,
      remaining: 0,
      reset: Date.now() + 3_600_000,
    });
    const res = await POST(postRequest({ answers: {} }));
    expect(res.status).toBe(429);
  });

  it("defaults systemName to 'Untitled AI System' when omitted", async () => {
    await POST(postRequest({ answers: {} }));
    expect(prisma.assessment.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ systemName: "Untitled AI System" }),
      }),
    );
  });

  it("uses the provided systemName when given", async () => {
    await POST(postRequest({ answers: {}, systemName: "My Custom System" }));
    expect(prisma.assessment.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ systemName: "My Custom System" }),
      }),
    );
  });

  it("stores answers as JSON string in DB", async () => {
    const answers = { isAiSystem: true, role: "provider" as const };
    await POST(postRequest({ answers }));
    expect(prisma.assessment.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ answers: JSON.stringify(answers) }),
      }),
    );
  });

  it("uses authenticated rate-limit key when user is logged in", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "user-1" } } as never);
    await POST(postRequest({ answers: {} }));
    expect(rateLimit).toHaveBeenCalledWith(
      expect.stringContaining("user-1"),
      60,
      expect.any(Number),
    );
  });

  it("uses anonymous rate-limit key with lower limit for unauthenticated", async () => {
    await POST(postRequest({ answers: {} }));
    expect(rateLimit).toHaveBeenCalledWith(
      expect.stringContaining("anon"),
      20,
      expect.any(Number),
    );
  });

  it("returns 500 when DB throws", async () => {
    vi.mocked(prisma.assessment.create).mockRejectedValueOnce(
      new Error("DB error"),
    );
    const res = await POST(postRequest({ answers: {} }));
    expect(res.status).toBe(500);
  });
});

describe("GET /api/assessments", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 for unauthenticated requests", async () => {
    vi.mocked(auth).mockResolvedValue(null);
    const res = await GET(getRequest());
    expect(res.status).toBe(401);
  });

  it("returns 401 when session has no user.id", async () => {
    vi.mocked(auth).mockResolvedValue({ user: {} } as never);
    const res = await GET(getRequest());
    expect(res.status).toBe(401);
  });

  it("returns assessments list for authenticated user", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "user-1" } } as never);
    vi.mocked(prisma.assessment.findMany).mockResolvedValue([
      mockAssessment,
    ] as never);
    const res = await GET(getRequest());
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.assessments).toHaveLength(1);
  });

  it("queries DB with the session user id", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "user-abc" } } as never);
    vi.mocked(prisma.assessment.findMany).mockResolvedValue([]);
    await GET(getRequest());
    expect(prisma.assessment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: "user-abc" } }),
    );
  });

  it("returns empty array when user has no assessments", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "user-1" } } as never);
    vi.mocked(prisma.assessment.findMany).mockResolvedValue([]);
    const res = await GET(getRequest());
    const data = await res.json();
    expect(data.assessments).toHaveLength(0);
  });

  it("returns 500 when DB throws", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "user-1" } } as never);
    vi.mocked(prisma.assessment.findMany).mockRejectedValueOnce(
      new Error("DB error"),
    );
    const res = await GET(getRequest());
    expect(res.status).toBe(500);
  });
});

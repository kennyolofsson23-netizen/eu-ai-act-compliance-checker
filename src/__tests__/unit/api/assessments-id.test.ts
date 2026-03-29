import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/db/client", () => ({
  prisma: {
    assessment: {
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

import { GET, PATCH, DELETE } from "@/app/api/assessments/[id]/route";
import { prisma } from "@/lib/db/client";
import { auth } from "@/lib/auth";
import { NextRequest } from "next/server";

type Params = { params: Promise<{ id: string }> };

function makeParams(id: string): Params {
  return { params: Promise.resolve({ id }) };
}

function req(
  method: string,
  id: string,
  opts: { body?: unknown; cookie?: string } = {},
) {
  const headers: Record<string, string> = {};
  if (opts.body) headers["Content-Type"] = "application/json";
  if (opts.cookie) headers["cookie"] = opts.cookie;
  return new NextRequest(`http://localhost/api/assessments/${id}`, {
    method,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    headers,
  });
}

const baseAssessment = {
  id: "assess-1",
  userId: "user-1",
  anonymousId: null as string | null,
  systemName: "Test System",
  riskLevel: "high",
  role: "provider",
  isGpai: false,
  annexCategory: "employment",
  citedArticles: JSON.stringify(["Article 6(2)"]),
  obligations: JSON.stringify([]),
  answers: JSON.stringify({ isAiSystem: true }),
  emailReminders: false,
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-01"),
};

describe("GET /api/assessments/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(auth).mockResolvedValue({ user: { id: "user-1" } } as never);
    vi.mocked(prisma.assessment.findUnique).mockResolvedValue(
      baseAssessment as never,
    );
  });

  it("returns 200 with assessment data for the owner", async () => {
    const res = await GET(req("GET", "assess-1"), makeParams("assess-1"));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.id).toBe("assess-1");
  });

  it("parses citedArticles, obligations, and answers from JSON", async () => {
    const res = await GET(req("GET", "assess-1"), makeParams("assess-1"));
    const data = await res.json();
    expect(Array.isArray(data.citedArticles)).toBe(true);
    expect(Array.isArray(data.obligations)).toBe(true);
    expect(typeof data.answers).toBe("object");
  });

  it("returns 404 when assessment does not exist", async () => {
    vi.mocked(prisma.assessment.findUnique).mockResolvedValue(null);
    const res = await GET(req("GET", "missing"), makeParams("missing"));
    expect(res.status).toBe(404);
  });

  it("returns 403 when a different user tries to access", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "other-user" } } as never);
    const res = await GET(req("GET", "assess-1"), makeParams("assess-1"));
    expect(res.status).toBe(403);
  });

  it("allows anonymous access when anonymousId cookie matches", async () => {
    vi.mocked(auth).mockResolvedValue(null as never);
    vi.mocked(prisma.assessment.findUnique).mockResolvedValue({
      ...baseAssessment,
      userId: null,
      anonymousId: "anon-xyz",
    } as never);
    const res = await GET(
      req("GET", "assess-1", { cookie: "eu_ai_anon_id=anon-xyz" }),
      makeParams("assess-1"),
    );
    expect(res.status).toBe(200);
  });

  it("returns 403 when anonymous id does not match", async () => {
    vi.mocked(auth).mockResolvedValue(null as never);
    vi.mocked(prisma.assessment.findUnique).mockResolvedValue({
      ...baseAssessment,
      userId: null,
      anonymousId: "anon-abc",
    } as never);
    const res = await GET(
      req("GET", "assess-1", { cookie: "eu_ai_anon_id=wrong-id" }),
      makeParams("assess-1"),
    );
    expect(res.status).toBe(403);
  });

  it("includes badgeUrl in response", async () => {
    const res = await GET(req("GET", "assess-1"), makeParams("assess-1"));
    const data = await res.json();
    expect(data.badgeUrl).toContain("/api/badge/");
  });
});

describe("PATCH /api/assessments/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(auth).mockResolvedValue({ user: { id: "user-1" } } as never);
    vi.mocked(prisma.assessment.findUnique).mockResolvedValue(
      baseAssessment as never,
    );
    vi.mocked(prisma.assessment.update).mockResolvedValue({
      ...baseAssessment,
      systemName: "Updated Name",
    } as never);
  });

  it("returns 401 for unauthenticated requests", async () => {
    vi.mocked(auth).mockResolvedValue(null as never);
    const res = await PATCH(
      req("PATCH", "assess-1", { body: { systemName: "x" } }),
      makeParams("assess-1"),
    );
    expect(res.status).toBe(401);
  });

  it("returns 200 with updated fields", async () => {
    const res = await PATCH(
      req("PATCH", "assess-1", { body: { systemName: "Updated Name" } }),
      makeParams("assess-1"),
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.systemName).toBe("Updated Name");
  });

  it("returns 404 when assessment does not exist", async () => {
    vi.mocked(prisma.assessment.findUnique).mockResolvedValue(null);
    const res = await PATCH(
      req("PATCH", "missing", { body: { systemName: "x" } }),
      makeParams("missing"),
    );
    expect(res.status).toBe(404);
  });

  it("returns 403 when user does not own the assessment", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "other-user" } } as never);
    const res = await PATCH(
      req("PATCH", "assess-1", { body: { systemName: "x" } }),
      makeParams("assess-1"),
    );
    expect(res.status).toBe(403);
  });

  it("returns 422 for invalid body (non-boolean emailReminders)", async () => {
    const res = await PATCH(
      req("PATCH", "assess-1", { body: { emailReminders: "not-a-bool" } }),
      makeParams("assess-1"),
    );
    expect(res.status).toBe(422);
  });

  it("calls prisma.update with the validated data", async () => {
    await PATCH(
      req("PATCH", "assess-1", { body: { emailReminders: true } }),
      makeParams("assess-1"),
    );
    expect(prisma.assessment.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "assess-1" },
        data: expect.objectContaining({ emailReminders: true }),
      }),
    );
  });
});

describe("DELETE /api/assessments/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(auth).mockResolvedValue({ user: { id: "user-1" } } as never);
    vi.mocked(prisma.assessment.findUnique).mockResolvedValue(
      baseAssessment as never,
    );
    vi.mocked(prisma.assessment.delete).mockResolvedValue(
      baseAssessment as never,
    );
  });

  it("returns 401 for unauthenticated requests", async () => {
    vi.mocked(auth).mockResolvedValue(null as never);
    const res = await DELETE(req("DELETE", "assess-1"), makeParams("assess-1"));
    expect(res.status).toBe(401);
  });

  it("returns 204 on successful deletion", async () => {
    const res = await DELETE(req("DELETE", "assess-1"), makeParams("assess-1"));
    expect(res.status).toBe(204);
  });

  it("returns 404 when assessment does not exist", async () => {
    vi.mocked(prisma.assessment.findUnique).mockResolvedValue(null);
    const res = await DELETE(req("DELETE", "missing"), makeParams("missing"));
    expect(res.status).toBe(404);
  });

  it("returns 403 when user does not own the assessment", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: "other-user" } } as never);
    const res = await DELETE(req("DELETE", "assess-1"), makeParams("assess-1"));
    expect(res.status).toBe(403);
  });

  it("calls prisma.delete with the correct id", async () => {
    await DELETE(req("DELETE", "assess-1"), makeParams("assess-1"));
    expect(prisma.assessment.delete).toHaveBeenCalledWith({
      where: { id: "assess-1" },
    });
  });

  it("returns 500 when DB throws", async () => {
    vi.mocked(prisma.assessment.delete).mockRejectedValueOnce(
      new Error("DB error"),
    );
    const res = await DELETE(req("DELETE", "assess-1"), makeParams("assess-1"));
    expect(res.status).toBe(500);
  });
});

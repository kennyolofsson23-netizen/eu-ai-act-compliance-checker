import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/v1/classify/route";
import { NextRequest } from "next/server";

// Mock rate limiter to always allow
vi.mock("@/lib/rate-limit/limiter", () => ({
  rateLimit: vi
    .fn()
    .mockResolvedValue({ success: true, remaining: 9, reset: 0 }),
  RATE_LIMITS: {
    API_ANONYMOUS: { limit: 10, windowMs: 3600000 },
  },
}));

function makeRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost/api/v1/classify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/v1/classify", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("classifies a non-AI system as minimal risk", async () => {
    const req = makeRequest({ answers: { isAiSystem: false } });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.riskLevel).toBe("minimal");
  });

  it("classifies a high-risk system", async () => {
    const req = makeRequest({
      answers: {
        isAiSystem: true,
        role: "provider",
        isGpai: false,
        prohibitedPractices: ["none"],
        isSafetyComponent: false,
        domain: "employment",
        domainFunction: "decision_making",
        isNarrowTask: false,
      },
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.riskLevel).toBe("high");
  });

  it("classifies a system with prohibited practices as unacceptable", async () => {
    const req = makeRequest({
      answers: {
        isAiSystem: true,
        role: "provider",
        prohibitedPractices: ["subliminal"],
      },
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.riskLevel).toBe("unacceptable");
  });

  it("classifies a limited risk system (chatbot)", async () => {
    const req = makeRequest({
      answers: {
        isAiSystem: true,
        role: "deployer",
        isGpai: false,
        prohibitedPractices: ["none"],
        isSafetyComponent: false,
        domain: "other",
        domainFunction: "recommendation",
        isNarrowTask: true,
        interactsWithPeople: true,
      },
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.riskLevel).toBe("limited");
  });

  it("returns riskLevel, citedArticles, obligations, and reasoning", async () => {
    const req = makeRequest({ answers: { isAiSystem: false } });
    const res = await POST(req);
    const body = await res.json();
    expect(body).toHaveProperty("riskLevel");
    expect(body).toHaveProperty("citedArticles");
    expect(body).toHaveProperty("obligations");
    expect(body).toHaveProperty("reasoning");
  });

  it("returns 422 for invalid request body", async () => {
    const req = makeRequest({ invalidField: true });
    const res = await POST(req);
    expect(res.status).toBe(422);
  });

  it("returns 429 when rate limit exceeded", async () => {
    const { rateLimit } = await import("@/lib/rate-limit/limiter");
    vi.mocked(rateLimit).mockResolvedValueOnce({
      success: false,
      remaining: 0,
      reset: Date.now() + 1000,
    });
    const req = makeRequest({ answers: { isAiSystem: false } });
    const res = await POST(req);
    expect(res.status).toBe(429);
  });

  it("obligations array contains id, title, article, summary", async () => {
    const req = makeRequest({
      answers: {
        isAiSystem: true,
        role: "provider",
        isGpai: false,
        prohibitedPractices: ["none"],
        isSafetyComponent: true,
      },
    });
    const res = await POST(req);
    const body = await res.json();
    if (body.obligations.length > 0) {
      const obligation = body.obligations[0];
      expect(obligation).toHaveProperty("id");
      expect(obligation).toHaveProperty("title");
      expect(obligation).toHaveProperty("article");
      expect(obligation).toHaveProperty("summary");
    }
  });
});

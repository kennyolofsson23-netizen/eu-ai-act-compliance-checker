import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/db/client", () => ({
  prisma: {
    assessmentEvent: {
      create: vi.fn(),
    },
  },
}));

import { POST } from "@/app/api/events/route";
import { prisma } from "@/lib/db/client";
import { NextRequest } from "next/server";

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost/api/events", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("POST /api/events", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(prisma.assessmentEvent.create).mockResolvedValue({
      id: "evt-1",
    } as never);
  });

  it("returns 201 for a valid event", async () => {
    const res = await POST(makeRequest({ eventType: "started" }));
    expect(res.status).toBe(201);
  });

  it("response body contains { ok: true }", async () => {
    const res = await POST(makeRequest({ eventType: "started" }));
    const data = await res.json();
    expect(data.ok).toBe(true);
  });

  it("stores the event in the database", async () => {
    await POST(makeRequest({ eventType: "completed", assessmentId: "abc" }));
    expect(prisma.assessmentEvent.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ eventType: "completed" }),
      }),
    );
  });

  it("stores the assessmentId when provided", async () => {
    await POST(makeRequest({ eventType: "completed", assessmentId: "id-999" }));
    expect(prisma.assessmentEvent.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ assessmentId: "id-999" }),
      }),
    );
  });

  it("stores null for assessmentId when not provided", async () => {
    await POST(makeRequest({ eventType: "started" }));
    expect(prisma.assessmentEvent.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ assessmentId: null }),
      }),
    );
  });

  it("stores null for questionId when not provided", async () => {
    await POST(makeRequest({ eventType: "started" }));
    expect(prisma.assessmentEvent.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ questionId: null }),
      }),
    );
  });

  it("stores questionId when provided", async () => {
    await POST(
      makeRequest({
        eventType: "abandoned",
        questionId: "q5_safety_component",
      }),
    );
    expect(prisma.assessmentEvent.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          questionId: "q5_safety_component",
        }),
      }),
    );
  });

  it("serialises metadata to JSON string", async () => {
    await POST(
      makeRequest({
        eventType: "completed",
        metadata: { riskLevel: "high" },
      }),
    );
    expect(prisma.assessmentEvent.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          metadata: JSON.stringify({ riskLevel: "high" }),
        }),
      }),
    );
  });

  it("returns 422 for an unknown event type", async () => {
    const res = await POST(makeRequest({ eventType: "unknown_event" }));
    expect(res.status).toBe(422);
  });

  it("returns 422 when eventType is missing", async () => {
    const res = await POST(makeRequest({ assessmentId: "abc" }));
    expect(res.status).toBe(422);
  });

  it("still returns 201 even when DB throws (non-blocking analytics)", async () => {
    vi.mocked(prisma.assessmentEvent.create).mockRejectedValueOnce(
      new Error("DB failure"),
    );
    const res = await POST(makeRequest({ eventType: "completed" }));
    expect(res.status).toBe(201);
  });

  const validTypes = [
    "started",
    "completed",
    "abandoned",
    "pdf_downloaded",
    "badge_copied",
  ];

  validTypes.forEach((eventType) => {
    it(`accepts valid event type: "${eventType}"`, async () => {
      const res = await POST(makeRequest({ eventType }));
      expect(res.status).toBe(201);
    });
  });
});

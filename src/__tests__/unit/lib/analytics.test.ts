import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { trackEvent, analytics } from "@/lib/analytics/events";

function mockFetch(ok = true): ReturnType<typeof vi.spyOn> {
  return vi.spyOn(global, "fetch").mockResolvedValue(
    new Response(JSON.stringify({ ok }), { status: ok ? 201 : 500 }),
  );
}

describe("trackEvent()", () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchSpy = mockFetch();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("sends a POST request to /api/events", async () => {
    await trackEvent("started");
    expect(fetchSpy).toHaveBeenCalledWith(
      "/api/events",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("sets Content-Type header to application/json", async () => {
    await trackEvent("started");
    expect(fetchSpy).toHaveBeenCalledWith(
      "/api/events",
      expect.objectContaining({
        headers: { "Content-Type": "application/json" },
      }),
    );
  });

  it("sends eventType in the request body", async () => {
    await trackEvent("completed");
    const call = fetchSpy.mock.calls[0][1] as RequestInit;
    const body = JSON.parse(call.body as string);
    expect(body.eventType).toBe("completed");
  });

  it("includes assessmentId when provided", async () => {
    await trackEvent("completed", { assessmentId: "id-123" });
    const call = fetchSpy.mock.calls[0][1] as RequestInit;
    const body = JSON.parse(call.body as string);
    expect(body.assessmentId).toBe("id-123");
  });

  it("includes questionId when provided", async () => {
    await trackEvent("abandoned", { questionId: "q7_function" });
    const call = fetchSpy.mock.calls[0][1] as RequestInit;
    const body = JSON.parse(call.body as string);
    expect(body.questionId).toBe("q7_function");
  });

  it("includes metadata when provided", async () => {
    await trackEvent("started", { metadata: { source: "landing" } });
    const call = fetchSpy.mock.calls[0][1] as RequestInit;
    const body = JSON.parse(call.body as string);
    expect(body.metadata).toEqual({ source: "landing" });
  });

  it("does not throw on network failure (silent)", async () => {
    vi.restoreAllMocks();
    vi.spyOn(global, "fetch").mockRejectedValueOnce(new Error("Network error"));
    await expect(trackEvent("started")).resolves.toBeUndefined();
  });

  it("resolves to undefined (void return)", async () => {
    const result = await trackEvent("badge_copied", {
      assessmentId: "id-456",
    });
    expect(result).toBeUndefined();
  });
});

describe("analytics helpers", () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchSpy = mockFetch();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("assessmentStarted sends the 'started' event type", async () => {
    await analytics.assessmentStarted();
    const body = JSON.parse(
      (fetchSpy.mock.calls[0][1] as RequestInit).body as string,
    );
    expect(body.eventType).toBe("started");
  });

  it("assessmentCompleted sends 'completed' with assessmentId", async () => {
    await analytics.assessmentCompleted("assess-abc");
    const body = JSON.parse(
      (fetchSpy.mock.calls[0][1] as RequestInit).body as string,
    );
    expect(body.eventType).toBe("completed");
    expect(body.assessmentId).toBe("assess-abc");
  });

  it("assessmentAbandoned sends 'abandoned' with questionId", async () => {
    await analytics.assessmentAbandoned("q3_gpai");
    const body = JSON.parse(
      (fetchSpy.mock.calls[0][1] as RequestInit).body as string,
    );
    expect(body.eventType).toBe("abandoned");
    expect(body.questionId).toBe("q3_gpai");
  });

  it("assessmentAbandoned works without questionId", async () => {
    await analytics.assessmentAbandoned();
    const body = JSON.parse(
      (fetchSpy.mock.calls[0][1] as RequestInit).body as string,
    );
    expect(body.eventType).toBe("abandoned");
  });

  it("pdfDownloaded sends 'pdf_downloaded' with assessmentId", async () => {
    await analytics.pdfDownloaded("pdf-id-1");
    const body = JSON.parse(
      (fetchSpy.mock.calls[0][1] as RequestInit).body as string,
    );
    expect(body.eventType).toBe("pdf_downloaded");
    expect(body.assessmentId).toBe("pdf-id-1");
  });

  it("badgeCopied sends 'badge_copied' with assessmentId", async () => {
    await analytics.badgeCopied("badge-id-1");
    const body = JSON.parse(
      (fetchSpy.mock.calls[0][1] as RequestInit).body as string,
    );
    expect(body.eventType).toBe("badge_copied");
    expect(body.assessmentId).toBe("badge-id-1");
  });
});

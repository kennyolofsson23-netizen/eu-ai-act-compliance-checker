import { describe, it, expect } from "vitest";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit/limiter";

/** Generates a unique identifier to avoid cross-test state pollution */
function uid(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

describe("rateLimit()", () => {
  it("allows the first request and returns remaining = limit - 1", async () => {
    const result = await rateLimit(uid("first"), 10, 60_000);
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(9);
  });

  it("allows all requests within the limit", async () => {
    const id = uid("within");
    for (let i = 0; i < 5; i++) {
      expect((await rateLimit(id, 5, 60_000)).success).toBe(true);
    }
  });

  it("remaining count decreases with each request", async () => {
    const id = uid("remaining");
    const first = await rateLimit(id, 10, 60_000);
    const second = await rateLimit(id, 10, 60_000);
    expect(second.remaining).toBe(first.remaining - 1);
  });

  it("blocks the request that exceeds the limit", async () => {
    const id = uid("block");
    for (let i = 0; i < 3; i++) await rateLimit(id, 3, 60_000);
    const over = await rateLimit(id, 3, 60_000);
    expect(over.success).toBe(false);
    expect(over.remaining).toBe(0);
  });

  it("returns remaining = 0 when blocked", async () => {
    const id = uid("zero-remaining");
    for (let i = 0; i < 2; i++) await rateLimit(id, 2, 60_000);
    expect((await rateLimit(id, 2, 60_000)).remaining).toBe(0);
  });

  it("tracks different identifiers independently", async () => {
    const id1 = uid("ind-a");
    const id2 = uid("ind-b");
    for (let i = 0; i < 2; i++) await rateLimit(id1, 3, 60_000);
    const result = await rateLimit(id2, 3, 60_000);
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(2);
  });

  it("reset timestamp is in the future", async () => {
    const result = await rateLimit(uid("reset"), 10, 60_000);
    expect(result.reset).toBeGreaterThan(Date.now());
  });

  it("reset timestamp is approximately now + windowMs", async () => {
    const windowMs = 60_000;
    const before = Date.now();
    const result = await rateLimit(uid("reset-approx"), 10, windowMs);
    expect(result.reset).toBeGreaterThanOrEqual(before + windowMs - 50);
    expect(result.reset).toBeLessThanOrEqual(before + windowMs + 50);
  });

  it("allows a new window after the previous one expires", async () => {
    const id = uid("expire");
    for (let i = 0; i < 2; i++) await rateLimit(id, 2, 1);
    const blocked = await rateLimit(id, 2, 1);
    expect(blocked.success).toBe(false);

    await new Promise((resolve) => setTimeout(resolve, 10));
    const after = await rateLimit(id, 2, 60_000);
    expect(after.success).toBe(true);
  });

  it("limit of 1 allows exactly one request", async () => {
    const id = uid("limit-one");
    expect((await rateLimit(id, 1, 60_000)).success).toBe(true);
    expect((await rateLimit(id, 1, 60_000)).success).toBe(false);
  });
});

describe("RATE_LIMITS constants", () => {
  it("ASSESSMENT_CREATE_ANON allows 20 requests per hour", () => {
    expect(RATE_LIMITS.ASSESSMENT_CREATE_ANON.limit).toBe(20);
    expect(RATE_LIMITS.ASSESSMENT_CREATE_ANON.windowMs).toBe(60 * 60 * 1000);
  });

  it("ASSESSMENT_CREATE_AUTH allows 60 requests per hour", () => {
    expect(RATE_LIMITS.ASSESSMENT_CREATE_AUTH.limit).toBe(60);
    expect(RATE_LIMITS.ASSESSMENT_CREATE_AUTH.windowMs).toBe(60 * 60 * 1000);
  });

  it("API_ANONYMOUS allows 10 requests per hour", () => {
    expect(RATE_LIMITS.API_ANONYMOUS.limit).toBe(10);
    expect(RATE_LIMITS.API_ANONYMOUS.windowMs).toBe(60 * 60 * 1000);
  });

  it("API_AUTHENTICATED allows 100 requests per hour", () => {
    expect(RATE_LIMITS.API_AUTHENTICATED.limit).toBe(100);
  });

  it("AUTH_LOGIN is limited to 5 per 15 minutes", () => {
    expect(RATE_LIMITS.AUTH_LOGIN.limit).toBe(5);
    expect(RATE_LIMITS.AUTH_LOGIN.windowMs).toBe(15 * 60 * 1000);
  });

  it("AUTH_LOGIN limit is stricter than API_ANONYMOUS", () => {
    expect(RATE_LIMITS.AUTH_LOGIN.limit).toBeLessThan(
      RATE_LIMITS.API_ANONYMOUS.limit,
    );
  });

  it("authenticated limit is higher than anonymous limit", () => {
    expect(RATE_LIMITS.ASSESSMENT_CREATE_AUTH.limit).toBeGreaterThan(
      RATE_LIMITS.ASSESSMENT_CREATE_ANON.limit,
    );
  });
});

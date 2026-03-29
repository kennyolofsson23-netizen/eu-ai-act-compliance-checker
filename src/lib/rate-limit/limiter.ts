import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
}

// In-memory store with TTL cleanup for development/fallback
const store = new Map<string, { count: number; resetAt: number }>();
let lastCleanup = Date.now();

function evictExpired(): void {
  const now = Date.now();
  // Only clean up every 5 minutes to avoid performance impact
  if (now - lastCleanup < 5 * 60 * 1000) return;
  lastCleanup = now;
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) store.delete(key);
  }
}

function inMemoryRateLimit(
  identifier: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  evictExpired();
  const now = Date.now();
  const entry = store.get(identifier);

  if (!entry || now > entry.resetAt) {
    const resetAt = now + windowMs;
    store.set(identifier, { count: 1, resetAt });
    return { success: true, remaining: limit - 1, reset: resetAt };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0, reset: entry.resetAt };
  }

  entry.count++;
  return {
    success: true,
    remaining: limit - entry.count,
    reset: entry.resetAt,
  };
}

function getRedisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export async function rateLimit(
  identifier: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const redis = getRedisClient();
  if (redis) {
    const rl = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, `${windowMs}ms` as `${number}ms`),
    });
    const result = await rl.limit(identifier);
    return {
      success: result.success,
      remaining: result.remaining,
      reset: result.reset,
    };
  }
  return inMemoryRateLimit(identifier, limit, windowMs);
}

export const RATE_LIMITS = {
  API_ANONYMOUS: { limit: 10, windowMs: 60 * 60 * 1000 },
  API_AUTHENTICATED: { limit: 100, windowMs: 60 * 60 * 1000 },
  ASSESSMENT_CREATE_ANON: { limit: 20, windowMs: 60 * 60 * 1000 },
  ASSESSMENT_CREATE_AUTH: { limit: 60, windowMs: 60 * 60 * 1000 },
  AUTH_LOGIN: { limit: 5, windowMs: 15 * 60 * 1000 },
  AUTH_REGISTER: { limit: 10, windowMs: 60 * 60 * 1000 },
  EVENTS: { limit: 100, windowMs: 60 * 60 * 1000 },
  BADGE: { limit: 1000, windowMs: 60 * 60 * 1000 },
};

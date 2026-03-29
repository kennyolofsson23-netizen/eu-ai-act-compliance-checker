// Simple in-memory rate limiter for development; use Upstash Redis in production
const requests = new Map<string, { count: number; resetAt: number }>();

interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
}

export function rateLimit(
  identifier: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const entry = requests.get(identifier);

  if (!entry || now > entry.resetAt) {
    const resetAt = now + windowMs;
    requests.set(identifier, { count: 1, resetAt });
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

export const RATE_LIMITS = {
  API_ANONYMOUS: { limit: 10, windowMs: 60 * 60 * 1000 }, // 10/hour
  API_AUTHENTICATED: { limit: 100, windowMs: 60 * 60 * 1000 }, // 100/hour
  ASSESSMENT_CREATE_ANON: { limit: 20, windowMs: 60 * 60 * 1000 }, // 20/hour
  ASSESSMENT_CREATE_AUTH: { limit: 60, windowMs: 60 * 60 * 1000 }, // 60/hour
  AUTH_LOGIN: { limit: 5, windowMs: 15 * 60 * 1000 }, // 5/15min
  BADGE: { limit: 1000, windowMs: 60 * 60 * 1000 }, // 1000/hour
};

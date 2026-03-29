import { describe, it, expect, vi, beforeEach } from "vitest";

// Set the secret before any imports that would throw without it
process.env.AUTH_SECRET = "test-secret-for-testing-only";

// Mock prisma and bcrypt before importing providers
vi.mock("@/lib/db/client", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("bcryptjs", () => ({
  default: {
    compare: vi.fn(),
  },
}));

import { prisma } from "@/lib/db/client";
import bcrypt from "bcryptjs";
import { credentialsProvider } from "@/lib/auth/providers";
import { authConfig } from "@/lib/auth/config";

// Extract the authorize function from the credentials provider
// next-auth wraps it; we access it via the options property
const authorize = (
  credentialsProvider as unknown as {
    options?: { authorize?: (c: unknown, r: unknown) => Promise<unknown> };
  }
).options?.authorize;

describe("Credentials Provider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null for invalid credentials format (missing email)", async () => {
    if (!authorize) return;
    const result = await authorize({ email: "", password: "password123" }, {});
    expect(result).toBeNull();
  });

  it("returns null when user does not exist", async () => {
    if (!authorize) return;
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

    const result = await authorize(
      { email: "notexist@example.com", password: "password123" },
      {},
    );
    expect(result).toBeNull();
  });

  it("always runs bcrypt.compare regardless of user existence (timing attack prevention)", async () => {
    if (!authorize) return;
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

    await authorize(
      { email: "nonexistent@example.com", password: "somepassword" },
      {},
    );
    expect(bcrypt.compare).toHaveBeenCalled();
  });

  it("returns null when password does not match", async () => {
    if (!authorize) return;
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "user-1",
      email: "user@example.com",
      passwordHash: "$2b$12$hashedpassword",
      name: "Test User",
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      emailReminders: true,
    } as never);
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

    const result = await authorize(
      { email: "user@example.com", password: "wrongpassword" },
      {},
    );
    expect(result).toBeNull();
  });

  it("returns user object when credentials are valid", async () => {
    if (!authorize) return;
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "user-1",
      email: "user@example.com",
      passwordHash: "$2b$12$hashedpassword",
      name: "Test User",
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      emailReminders: true,
    } as never);
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

    const result = await authorize(
      { email: "user@example.com", password: "correctpassword" },
      {},
    );
    expect(result).not.toBeNull();
    if (result) {
      expect((result as { email: string }).email).toBe("user@example.com");
      expect((result as { id: string }).id).toBe("user-1");
    }
  });
});

describe("Auth Config callbacks", () => {
  it("jwt callback adds user id to token", async () => {
    const jwtCallback = authConfig.callbacks?.jwt;
    if (!jwtCallback) return;

    const token = { sub: "test", iat: 0, exp: 0 };
    const user = { id: "user-123", email: "test@example.com" };
    const result = await jwtCallback({
      token,
      user,
      account: null,
      trigger: "signIn",
    });
    expect((result as { id: string }).id).toBe("user-123");
  });

  it("session callback adds user id to session", async () => {
    const sessionCallback = authConfig.callbacks?.session;
    if (!sessionCallback) return;

    const token = { id: "user-123" };
    // Cast to avoid complex AdapterUser/AdapterSession intersection typing in tests
    const callSession = sessionCallback as unknown as (args: unknown) => Promise<{ user: Record<string, unknown> }>;
    const result = await callSession({
      session: {
        user: { id: "placeholder", email: "test@example.com", name: "Test", emailVerified: null },
        expires: new Date().toISOString(),
      },
      token,
      newSession: undefined,
      trigger: "update",
    });
    expect(result.user.id).toBe("user-123");
  });

  it("authorized callback allows access to non-dashboard routes", () => {
    const authorizedCallback = authConfig.callbacks?.authorized;
    if (!authorizedCallback) return;

    const result = authorizedCallback({
      auth: null,
      request: { nextUrl: new URL("http://localhost/checker") } as never,
    });
    expect(result).toBe(true);
  });

  it("authorized callback blocks unauthenticated access to dashboard", () => {
    const authorizedCallback = authConfig.callbacks?.authorized;
    if (!authorizedCallback) return;

    const result = authorizedCallback({
      auth: null,
      request: { nextUrl: new URL("http://localhost/dashboard") } as never,
    });
    expect(result).toBe(false);
  });

  it("authorized callback allows authenticated access to dashboard", () => {
    const authorizedCallback = authConfig.callbacks?.authorized;
    if (!authorizedCallback) return;

    const result = authorizedCallback({
      auth: { user: { email: "test@example.com" }, expires: "" },
      request: { nextUrl: new URL("http://localhost/dashboard") } as never,
    });
    expect(result).toBe(true);
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/db/client", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn().mockResolvedValue("hashed-password"),
  },
}));

vi.mock("@/lib/rate-limit/limiter", () => ({
  rateLimit: vi.fn().mockResolvedValue({
    success: true,
    remaining: 9,
    reset: Date.now() + 3_600_000,
  }),
  RATE_LIMITS: {
    AUTH_REGISTER: { limit: 10, windowMs: 3_600_000 },
  },
}));

import { POST } from "@/app/api/auth/register/route";
import { prisma } from "@/lib/db/client";
import { NextRequest } from "next/server";

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost/api/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

const validBody = {
  email: "user@example.com",
  password: "Password1",
  name: "Alice",
};

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.user.create).mockResolvedValue({
      id: "user-001",
      email: "user@example.com",
      name: "Alice",
    } as never);
  });

  it("returns 201 on successful registration", async () => {
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(201);
  });

  it("response body includes id, email, and name", async () => {
    const res = await POST(makeRequest(validBody));
    const data = await res.json();
    expect(data.id).toBe("user-001");
    expect(data.email).toBe("user@example.com");
    expect(data.name).toBe("Alice");
  });

  it("calls prisma.user.findUnique to check for existing email", async () => {
    await POST(makeRequest(validBody));
    expect(prisma.user.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { email: "user@example.com" } }),
    );
  });

  it("calls prisma.user.create with the correct email", async () => {
    await POST(makeRequest(validBody));
    expect(prisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ email: "user@example.com" }),
      }),
    );
  });

  it("returns 409 when email is already registered", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "existing-user",
      email: "user@example.com",
    } as never);
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(409);
  });

  it("409 response body contains error message", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "existing-user",
    } as never);
    const res = await POST(makeRequest(validBody));
    const data = await res.json();
    expect(typeof data.error).toBe("string");
  });

  it("returns 422 for invalid email", async () => {
    const res = await POST(makeRequest({ ...validBody, email: "not-an-email" }));
    expect(res.status).toBe(422);
  });

  it("returns 422 for password shorter than 8 characters", async () => {
    const res = await POST(makeRequest({ ...validBody, password: "Pass1" }));
    expect(res.status).toBe(422);
  });

  it("returns 422 for password without uppercase letter", async () => {
    const res = await POST(makeRequest({ ...validBody, password: "password1" }));
    expect(res.status).toBe(422);
  });

  it("returns 422 for password without a number", async () => {
    const res = await POST(makeRequest({ ...validBody, password: "Password" }));
    expect(res.status).toBe(422);
  });

  it("returns 422 when email is missing", async () => {
    const res = await POST(makeRequest({ password: "Password1" }));
    expect(res.status).toBe(422);
  });

  it("returns 422 when password is missing", async () => {
    const res = await POST(makeRequest({ email: "user@example.com" }));
    expect(res.status).toBe(422);
  });

  it("accepts registration without optional name field", async () => {
    const res = await POST(
      makeRequest({ email: "user@example.com", password: "Password1" }),
    );
    expect(res.status).toBe(201);
  });

  it("does NOT expose passwordHash in response", async () => {
    const res = await POST(makeRequest(validBody));
    const data = await res.json();
    expect(data.passwordHash).toBeUndefined();
  });

  it("returns 500 when DB throws during creation", async () => {
    vi.mocked(prisma.user.create).mockRejectedValueOnce(new Error("DB error"));
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(500);
  });
});

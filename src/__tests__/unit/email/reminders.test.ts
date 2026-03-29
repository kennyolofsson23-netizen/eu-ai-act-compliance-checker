import { describe, it, expect } from "vitest";
import {
  sendDeadlineReminder,
  buildReminderSubject,
  buildReminderText,
  shouldSendReminder,
} from "@/lib/email/reminders";
import type { DeadlineReminder } from "@/lib/email/reminders";

const mockReminder: DeadlineReminder = {
  assessmentId: "assessment-123",
  systemName: "Test AI System",
  riskLevel: "high",
  deadlineTitle: "High-Risk AI Obligations",
  deadlineDate: "2026-08-02T00:00:00.000Z",
  daysUntil: 30,
  recipient: {
    email: "compliance@example.com",
    name: "Compliance Officer",
  },
};

describe("sendDeadlineReminder()", () => {
  it("returns success: true in test environment", async () => {
    const result = await sendDeadlineReminder(mockReminder);
    expect(result.success).toBe(true);
  });

  it("returns a messageId on success", async () => {
    const result = await sendDeadlineReminder(mockReminder);
    expect(result.messageId).toBeTruthy();
  });

  it("returns success: false when email is missing", async () => {
    const result = await sendDeadlineReminder({
      ...mockReminder,
      recipient: { email: "" },
    });
    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("returns success: false when deadline date is missing", async () => {
    const result = await sendDeadlineReminder({
      ...mockReminder,
      deadlineDate: "",
    });
    expect(result.success).toBe(false);
  });

  it("includes assessmentId in simulated messageId", async () => {
    const result = await sendDeadlineReminder(mockReminder);
    expect(result.messageId).toContain("assessment-123");
  });
});

describe("buildReminderSubject()", () => {
  it("includes the days until deadline", () => {
    const subject = buildReminderSubject(mockReminder);
    expect(subject).toContain("30");
  });

  it("includes the deadline title", () => {
    const subject = buildReminderSubject(mockReminder);
    expect(subject).toContain("High-Risk AI Obligations");
  });

  it("starts with [EU AI Act]", () => {
    const subject = buildReminderSubject(mockReminder);
    expect(subject).toMatch(/^\[EU AI Act\]/);
  });
});

describe("buildReminderText()", () => {
  it("includes the system name", () => {
    const text = buildReminderText(mockReminder);
    expect(text).toContain("Test AI System");
  });

  it("includes the risk level", () => {
    const text = buildReminderText(mockReminder);
    expect(text).toContain("high");
  });

  it("includes the days remaining", () => {
    const text = buildReminderText(mockReminder);
    expect(text).toContain("30");
  });

  it("includes the assessment ID in the URL", () => {
    const text = buildReminderText(mockReminder);
    expect(text).toContain("assessment-123");
  });

  it("includes a disclaimer about automated reminders", () => {
    const text = buildReminderText(mockReminder);
    expect(text).toContain("automated reminder");
  });

  it("uses recipient name when provided", () => {
    const text = buildReminderText(mockReminder);
    expect(text).toContain("Compliance Officer");
  });

  it("falls back to generic greeting when name is not provided", () => {
    const text = buildReminderText({
      ...mockReminder,
      recipient: { email: "test@example.com" },
    });
    expect(text).toContain("compliance officer");
  });
});

describe("shouldSendReminder()", () => {
  it("returns true for 90 days (default interval)", () => {
    expect(shouldSendReminder(90)).toBe(true);
  });

  it("returns true for 30 days (default interval)", () => {
    expect(shouldSendReminder(30)).toBe(true);
  });

  it("returns true for 7 days (default interval)", () => {
    expect(shouldSendReminder(7)).toBe(true);
  });

  it("returns true for 1 day (default interval)", () => {
    expect(shouldSendReminder(1)).toBe(true);
  });

  it("returns false for non-interval days", () => {
    expect(shouldSendReminder(45)).toBe(false);
    expect(shouldSendReminder(14)).toBe(false);
    expect(shouldSendReminder(0)).toBe(false);
  });

  it("accepts custom intervals", () => {
    expect(shouldSendReminder(60, [60, 30])).toBe(true);
    expect(shouldSendReminder(30, [60, 30])).toBe(true);
    expect(shouldSendReminder(7, [60, 30])).toBe(false);
  });
});

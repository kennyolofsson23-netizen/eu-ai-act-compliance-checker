export interface ReminderRecipient {
  email: string;
  name?: string;
}

export interface DeadlineReminder {
  assessmentId: string;
  systemName: string;
  riskLevel: string;
  deadlineTitle: string;
  deadlineDate: string;
  daysUntil: number;
  recipient: ReminderRecipient;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Sends a deadline reminder email for an EU AI Act compliance deadline.
 * In production, this would use a service like Resend, SendGrid, or AWS SES.
 */
export async function sendDeadlineReminder(
  reminder: DeadlineReminder,
): Promise<EmailResult> {
  // Validate required fields
  if (!reminder.recipient.email) {
    return { success: false, error: "Recipient email is required" };
  }
  if (!reminder.deadlineDate) {
    return { success: false, error: "Deadline date is required" };
  }

  // In development/test mode, simulate sending
  if (process.env.NODE_ENV === "test" || !process.env.EMAIL_API_KEY) {
    return {
      success: true,
      messageId: `simulated-${Date.now()}-${reminder.assessmentId}`,
    };
  }

  // Production email sending would go here
  return { success: false, error: "Email service not configured" };
}

export function buildReminderSubject(reminder: DeadlineReminder): string {
  return `[EU AI Act] ${reminder.daysUntil} days until: ${reminder.deadlineTitle}`;
}

export function buildReminderText(reminder: DeadlineReminder): string {
  const lines = [
    `Dear ${reminder.recipient.name ?? "compliance officer"},`,
    "",
    `This is a reminder that the EU AI Act deadline "${reminder.deadlineTitle}" is approaching.`,
    "",
    `System: ${reminder.systemName}`,
    `Risk Level: ${reminder.riskLevel}`,
    `Deadline: ${new Date(reminder.deadlineDate).toLocaleDateString("en-GB")}`,
    `Days Remaining: ${reminder.daysUntil}`,
    "",
    "Please ensure all required compliance actions are completed before this deadline.",
    "",
    "View your assessment at: https://euaiacompliance.app/checker/results/" + reminder.assessmentId,
    "",
    "This is an automated reminder. You can manage your reminder settings in your dashboard.",
  ];
  return lines.join("\n");
}

export function shouldSendReminder(
  daysUntil: number,
  reminderIntervals: number[] = [90, 30, 7, 1],
): boolean {
  return reminderIntervals.includes(daysUntil);
}

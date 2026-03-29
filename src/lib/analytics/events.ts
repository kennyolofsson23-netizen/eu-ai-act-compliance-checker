type EventType =
  | "started"
  | "completed"
  | "abandoned"
  | "pdf_downloaded"
  | "badge_copied";

interface TrackEventOptions {
  assessmentId?: string;
  questionId?: string;
  metadata?: Record<string, unknown>;
}

export async function trackEvent(
  eventType: EventType,
  options: TrackEventOptions = {},
): Promise<void> {
  try {
    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType,
        assessmentId: options.assessmentId,
        questionId: options.questionId,
        metadata: options.metadata,
      }),
    });
  } catch {
    // Silently fail — analytics should never break the user flow
  }
}

export const analytics = {
  assessmentStarted: (options?: TrackEventOptions) =>
    trackEvent("started", options),
  assessmentCompleted: (assessmentId: string, options?: TrackEventOptions) =>
    trackEvent("completed", { assessmentId, ...options }),
  assessmentAbandoned: (questionId?: string, options?: TrackEventOptions) =>
    trackEvent("abandoned", { questionId, ...options }),
  pdfDownloaded: (assessmentId: string) =>
    trackEvent("pdf_downloaded", { assessmentId }),
  badgeCopied: (assessmentId: string) =>
    trackEvent("badge_copied", { assessmentId }),
};

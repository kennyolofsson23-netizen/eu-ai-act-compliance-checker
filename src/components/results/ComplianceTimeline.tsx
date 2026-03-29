import type { Obligation } from "@/lib/engine/types";

export interface TimelineItem {
  date: string;
  title: string;
  description: string;
  article: string;
  isCompleted?: boolean;
}

export interface ComplianceTimelineProps {
  obligations: Obligation[];
  riskLevel: string;
}

function getDeadlineForObligation(obligationId: string): string | null {
  const deadlines: Record<string, string> = {
    conformity: "2025-08-02",
    registration: "2025-08-02",
    "risk-mgmt": "2025-08-02",
    "tech-docs": "2025-08-02",
    "transparency-users": "2025-08-02",
    "cease-prohibited": "2024-02-02",
  };
  return deadlines[obligationId] ?? null;
}

export default function ComplianceTimeline({
  obligations,
}: ComplianceTimelineProps) {
  const timelineItems: TimelineItem[] = obligations
    .reduce<TimelineItem[]>((acc, obligation) => {
      const deadline = getDeadlineForObligation(obligation.id);
      if (!deadline) return acc;
      acc.push({
        date: deadline,
        title: obligation.title,
        description: obligation.summary,
        article: obligation.article,
        isCompleted: new Date(deadline) < new Date(),
      });
      return acc;
    }, [])
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (timelineItems.length === 0) {
    return (
      <p className="text-slate-500 text-sm">
        No deadline-based obligations for this classification.
      </p>
    );
  }

  return (
    <ol
      aria-label="Compliance timeline"
      className="relative border-l border-slate-200 space-y-6 ml-3"
    >
      {timelineItems.map((item) => (
        <li key={item.title} className="ml-6">
          <span
            className={`absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-white ${
              item.isCompleted ? "bg-green-500" : "bg-blue-600"
            }`}
            aria-hidden="true"
          />
          <time className="text-xs font-normal text-slate-400">
            {new Date(item.date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </time>
          <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
          <p className="text-sm text-slate-500">{item.description}</p>
          <span className="text-xs text-blue-600">{item.article}</span>
        </li>
      ))}
    </ol>
  );
}

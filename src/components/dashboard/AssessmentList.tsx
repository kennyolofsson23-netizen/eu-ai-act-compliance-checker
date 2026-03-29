import Link from "next/link";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

export interface AssessmentListItem {
  id: string;
  systemName: string;
  riskLevel: string;
  role: string;
  isGpai: boolean;
  updatedAt: string;
}

interface AssessmentListProps {
  assessments: AssessmentListItem[];
}

const RISK_ICONS: Record<string, React.ElementType> = {
  unacceptable: XCircle,
  high: AlertTriangle,
  limited: Shield,
  minimal: CheckCircle,
};

const RISK_COLORS: Record<string, string> = {
  unacceptable: "text-red-600",
  high: "text-orange-500",
  limited: "text-yellow-500",
  minimal: "text-green-500",
};

export default function AssessmentList({ assessments }: AssessmentListProps) {
  if (assessments.length === 0) {
    return (
      <p className="text-slate-500 text-sm text-center py-8">
        No assessments yet.{" "}
        <Link href="/checker" className="text-blue-600 hover:underline">
          Start your first assessment
        </Link>
        .
      </p>
    );
  }

  return (
    <ul className="space-y-3" aria-label="Your assessments">
      {assessments.map((assessment) => {
        const Icon = RISK_ICONS[assessment.riskLevel] ?? Shield;
        const colorClass =
          RISK_COLORS[assessment.riskLevel] ?? "text-slate-500";
        return (
          <li
            key={assessment.id}
            className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`h-5 w-5 shrink-0 ${colorClass}`}
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <p className="font-medium text-slate-900 truncate">
                    {assessment.systemName}
                  </p>
                  <p className="text-xs text-slate-500 capitalize">
                    {assessment.riskLevel.replace("-", " ")} risk ·{" "}
                    {assessment.role}
                    {assessment.isGpai ? " · GPAI" : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 shrink-0">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                {new Date(assessment.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

import Link from "next/link";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

export interface AssessmentCardProps {
  id: string;
  systemName: string;
  riskLevel: string;
  role: string;
  isGpai: boolean;
  updatedAt: string;
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

export default function AssessmentCard({
  id,
  systemName,
  riskLevel,
  role,
  isGpai,
  updatedAt,
}: AssessmentCardProps) {
  const Icon = RISK_ICONS[riskLevel] ?? Shield;
  const colorClass = RISK_COLORS[riskLevel] ?? "text-slate-500";

  return (
    <Link
      href={`/checker/results/${id}`}
      className="block bg-white rounded-xl border border-slate-200 p-5 hover:shadow-sm transition-shadow"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Icon
            className={`h-5 w-5 shrink-0 ${colorClass}`}
            aria-hidden="true"
          />
          <div>
            <h3 className="font-semibold text-slate-900">{systemName}</h3>
            <p className="text-sm text-slate-500 capitalize">
              {riskLevel.replace("-", " ")} risk · {role}
              {isGpai ? " · GPAI" : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 shrink-0">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          {new Date(updatedAt).toLocaleDateString()}
        </div>
      </div>
    </Link>
  );
}

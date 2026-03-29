import { AlertTriangle, CheckCircle, Shield, XCircle } from "lucide-react";
import type { RiskLevel } from "@/lib/engine/types";

interface RiskClassificationBannerProps {
  riskLevel: RiskLevel;
  reasoning: string;
  systemName?: string;
}

const RISK_CONFIG: Record<
  RiskLevel,
  { label: string; colorClass: string; Icon: React.ElementType }
> = {
  unacceptable: {
    label: "Unacceptable Risk",
    colorClass: "text-red-700 bg-red-50 border-red-200",
    Icon: XCircle,
  },
  high: {
    label: "High Risk",
    colorClass: "text-orange-700 bg-orange-50 border-orange-200",
    Icon: AlertTriangle,
  },
  limited: {
    label: "Limited Risk",
    colorClass: "text-yellow-700 bg-yellow-50 border-yellow-200",
    Icon: Shield,
  },
  minimal: {
    label: "Minimal Risk",
    colorClass: "text-green-700 bg-green-50 border-green-200",
    Icon: CheckCircle,
  },
};

export default function RiskClassificationBanner({
  riskLevel,
  reasoning,
  systemName,
}: RiskClassificationBannerProps) {
  const config = RISK_CONFIG[riskLevel] ?? RISK_CONFIG.minimal;
  const { label, colorClass, Icon } = config;

  return (
    <div className={`rounded-xl border p-6 mb-6 ${colorClass}`}>
      <div className="flex items-center gap-3 mb-3">
        <Icon className="h-6 w-6" aria-hidden="true" />
        <h2 className="text-xl font-semibold">{label}</h2>
      </div>
      {systemName && (
        <p className="text-sm font-medium mb-2">System: {systemName}</p>
      )}
      <p className="text-sm leading-relaxed">{reasoning}</p>
    </div>
  );
}

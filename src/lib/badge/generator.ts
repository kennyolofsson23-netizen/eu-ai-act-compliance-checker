import { RiskLevel } from "@/lib/engine/types";

const RISK_COLORS: Record<RiskLevel, { bg: string; text: string; label: string }> = {
  unacceptable: { bg: "#DC2626", text: "#FFFFFF", label: "Unacceptable Risk" },
  high: { bg: "#EA580C", text: "#FFFFFF", label: "High Risk" },
  limited: { bg: "#CA8A04", text: "#FFFFFF", label: "Limited Risk" },
  minimal: { bg: "#16A34A", text: "#FFFFFF", label: "Minimal Risk" },
};

export interface BadgeOptions {
  riskLevel: RiskLevel;
  systemName: string;
  assessmentId: string;
}

export function generateBadgeSvg(options: BadgeOptions): string {
  const { riskLevel, systemName, assessmentId } = options;
  const color = RISK_COLORS[riskLevel];
  const truncatedName = systemName.length > 30 ? systemName.slice(0, 27) + "…" : systemName;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60" role="img" aria-label="EU AI Act compliance badge: ${color.label}">
  <title>EU AI Act: ${color.label}</title>
  <rect width="200" height="60" rx="6" fill="${color.bg}" />
  <text x="10" y="22" font-family="sans-serif" font-size="11" fill="${color.text}" font-weight="bold">EU AI Act Compliance</text>
  <text x="10" y="40" font-family="sans-serif" font-size="13" fill="${color.text}" font-weight="bold">${color.label}</text>
  <text x="10" y="54" font-family="sans-serif" font-size="9" fill="${color.text}" opacity="0.8">${truncatedName}</text>
  <!-- id:${assessmentId} -->
</svg>`;
}

export function getRiskColor(riskLevel: RiskLevel): { bg: string; text: string; label: string } {
  return RISK_COLORS[riskLevel];
}

"use client";
import type { AssessmentData } from "@/lib/engine/types";

export interface ComparisonTableProps {
  assessments: AssessmentData[];
}

const RISK_ORDER: Record<string, number> = {
  unacceptable: 0,
  high: 1,
  limited: 2,
  minimal: 3,
};

export default function ComparisonTable({ assessments }: ComparisonTableProps) {
  if (assessments.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        No assessments to compare. Select at least two assessments.
      </div>
    );
  }

  const sorted = [...assessments].sort(
    (a, b) => RISK_ORDER[a.riskLevel] - RISK_ORDER[b.riskLevel],
  );

  return (
    <div className="overflow-x-auto">
      <table
        className="w-full border-collapse"
        aria-label="Assessment comparison"
      >
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
              Attribute
            </th>
            {sorted.map((a) => (
              <th
                key={a.id}
                className="text-left py-3 px-4 text-sm font-semibold text-slate-700"
              >
                {a.systemName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-slate-100">
            <td className="py-3 px-4 text-sm font-medium text-slate-600">
              Risk Level
            </td>
            {sorted.map((a) => (
              <td key={a.id} className="py-3 px-4 text-sm text-slate-900">
                {a.riskLevel}
              </td>
            ))}
          </tr>
          <tr className="border-b border-slate-100">
            <td className="py-3 px-4 text-sm font-medium text-slate-600">
              Role
            </td>
            {sorted.map((a) => (
              <td key={a.id} className="py-3 px-4 text-sm text-slate-900">
                {a.role}
              </td>
            ))}
          </tr>
          <tr className="border-b border-slate-100">
            <td className="py-3 px-4 text-sm font-medium text-slate-600">
              GPAI Model
            </td>
            {sorted.map((a) => (
              <td key={a.id} className="py-3 px-4 text-sm text-slate-900">
                {a.isGpai ? "Yes" : "No"}
              </td>
            ))}
          </tr>
          <tr className="border-b border-slate-100">
            <td className="py-3 px-4 text-sm font-medium text-slate-600">
              Obligations
            </td>
            {sorted.map((a) => (
              <td key={a.id} className="py-3 px-4 text-sm text-slate-900">
                {a.obligations.length}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

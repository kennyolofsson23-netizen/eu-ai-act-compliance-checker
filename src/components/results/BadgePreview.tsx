"use client";
import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import { getRiskColor } from "@/lib/badge/generator";
import type { RiskLevel } from "@/lib/engine/types";

interface BadgePreviewProps {
  assessmentId: string;
  riskLevel: RiskLevel;
  systemName: string;
}

export default function BadgePreview({
  assessmentId,
  riskLevel,
  systemName,
}: BadgePreviewProps) {
  const [copied, setCopied] = useState(false);
  const color = getRiskColor(riskLevel);
  const badgeUrl = `/api/badge/${assessmentId}`;
  const absoluteUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${badgeUrl}`
      : badgeUrl;

  const markdownSnippet = `![EU AI Act Compliance: ${color.label}](${absoluteUrl})`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(markdownSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
      <h3 className="text-sm font-semibold text-slate-700">Compliance Badge</h3>

      <div className="flex items-center gap-3">
        {/* Badge preview */}
        <img
          src={badgeUrl}
          alt={`EU AI Act compliance badge: ${color.label}`}
          width={200}
          height={60}
          className="rounded"
        />
        <a
          href={badgeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs"
          aria-label="Open badge in new tab"
        >
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          Open
        </a>
      </div>

      <div>
        <p className="text-xs text-slate-500 mb-1.5">
          Embed in README or documentation:
        </p>
        <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 border border-slate-200">
          <code className="text-xs text-slate-700 flex-1 truncate">
            {markdownSnippet}
          </code>
          <button
            onClick={handleCopy}
            className="text-slate-400 hover:text-slate-600 transition-colors shrink-0"
            aria-label="Copy Markdown snippet"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" aria-hidden="true" />
            ) : (
              <Copy className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-400">System: {systemName}</p>
    </div>
  );
}

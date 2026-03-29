"use client";
import { useState } from "react";
import { Download, Share2 } from "lucide-react";

interface ResultsActionsProps {
  assessmentId?: string;
  systemName?: string;
}

export default function ResultsActions({
  assessmentId,
  systemName,
}: ResultsActionsProps) {
  const [downloading, setDownloading] = useState(false);

  async function handleDownloadPdf() {
    if (!assessmentId) return;
    setDownloading(true);
    try {
      const res = await fetch(`/api/assessments/${assessmentId}/pdf`);
      if (!res.ok) throw new Error("PDF generation failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${systemName ?? "assessment"}-compliance-report.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // Silent failure — user remains on page
    } finally {
      setDownloading(false);
    }
  }

  async function handleShare() {
    if (!assessmentId) return;
    const url = `${window.location.origin}/checker/results/${assessmentId}`;
    await navigator.clipboard.writeText(url).catch(() => {});
  }

  return (
    <div className="flex flex-wrap gap-3 mt-6">
      {assessmentId && (
        <>
          <button
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-60"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            {downloading ? "Generating…" : "Download PDF"}
          </button>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            <Share2 className="h-4 w-4" aria-hidden="true" />
            Copy Link
          </button>
        </>
      )}
    </div>
  );
}

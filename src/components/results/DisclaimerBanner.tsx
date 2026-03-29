import { Info } from "lucide-react";

export default function DisclaimerBanner() {
  return (
    <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800">
      <Info className="h-5 w-5 shrink-0 mt-0.5" aria-hidden="true" />
      <p className="text-sm leading-relaxed">
        <span className="font-semibold">Disclaimer:</span> This tool provides
        educational guidance based on publicly available information about the EU
        AI Act. The results are{" "}
        <span className="font-semibold">not legal advice</span>. You should
        consult qualified legal counsel for compliance decisions affecting your
        business.
      </p>
    </div>
  );
}

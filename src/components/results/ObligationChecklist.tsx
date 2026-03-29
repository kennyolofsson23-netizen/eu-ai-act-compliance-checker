import type { Obligation } from "@/lib/engine/types";
import ObligationItem from "./ObligationItem";

interface ObligationChecklistProps {
  obligations: Obligation[];
}

export default function ObligationChecklist({
  obligations,
}: ObligationChecklistProps) {
  if (obligations.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        No specific obligations apply to your AI system.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        Compliance Obligations
      </h3>
      <ul className="divide-y divide-slate-100">
        {obligations.map((obligation) => (
          <ObligationItem key={obligation.id} obligation={obligation} />
        ))}
      </ul>
    </div>
  );
}

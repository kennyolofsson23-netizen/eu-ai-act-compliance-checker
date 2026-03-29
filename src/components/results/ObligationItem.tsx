import { CheckCircle } from "lucide-react";
import type { Obligation } from "@/lib/engine/types";

interface ObligationItemProps {
  obligation: Obligation;
}

export default function ObligationItem({ obligation }: ObligationItemProps) {
  return (
    <li className="flex gap-3 py-3 border-b border-slate-100 last:border-0">
      <CheckCircle
        className="h-5 w-5 text-blue-500 mt-0.5 shrink-0"
        aria-hidden="true"
      />
      <div>
        <p className="font-medium text-slate-800">{obligation.title}</p>
        <p className="text-sm text-slate-500 mt-0.5">{obligation.summary}</p>
        <p className="text-sm text-slate-600 mt-1">
          {obligation.practicalMeaning}
        </p>
        <span className="text-xs text-blue-600 font-medium">
          {obligation.article}
        </span>
        {obligation.deadline && (
          <span className="ml-2 text-xs text-slate-400">
            Deadline: {obligation.deadline}
          </span>
        )}
      </div>
    </li>
  );
}

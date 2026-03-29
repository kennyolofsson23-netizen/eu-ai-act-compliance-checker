import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  current: number;
  total: number;
  percentage: number;
}

export default function ProgressBar({
  current,
  total,
  percentage,
}: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-600">
          Question {current} of {total}
        </span>
        <span className="text-sm text-slate-500">{percentage}% complete</span>
      </div>
      <Progress
        value={percentage}
        className="h-2"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Assessment progress: question ${current} of ${total}, ${percentage}% complete`}
      />
    </div>
  );
}

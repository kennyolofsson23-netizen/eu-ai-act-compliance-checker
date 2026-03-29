"use client";
import { useState, useEffect } from "react";
import { CheckCircle, Circle } from "lucide-react";
import { Question } from "@/lib/engine/types";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: string | string[]) => void;
  previousAnswer?: string | string[];
}

function RadioOption({
  value,
  label,
  description,
  isSelected,
  onSelect,
  onKeyDown,
}: {
  value: string;
  label: string;
  description?: string;
  isSelected: boolean;
  onSelect: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}) {
  return (
    <button
      role="radio"
      aria-checked={isSelected}
      onClick={() => onSelect(value)}
      onKeyDown={onKeyDown}
      className={cn(
        "w-full text-left p-4 rounded-lg border-2 transition-all duration-150 min-h-[44px]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600",
        isSelected
          ? "border-blue-600 bg-blue-50"
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">
          {isSelected ? (
            <CheckCircle className="h-5 w-5 text-blue-600" aria-hidden="true" />
          ) : (
            <Circle className="h-5 w-5 text-slate-300" aria-hidden="true" />
          )}
        </div>
        <div>
          <span className="font-medium text-slate-900">{label}</span>
          {description && (
            <p className="mt-0.5 text-sm text-slate-500">{description}</p>
          )}
        </div>
      </div>
    </button>
  );
}

function CheckboxOption({
  value,
  label,
  description,
  isSelected,
  onToggle,
}: {
  value: string;
  label: string;
  description?: string;
  isSelected: boolean;
  onToggle: (value: string) => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={() => onToggle(value)}
      className={cn(
        "w-full text-left p-4 rounded-lg border-2 transition-all duration-150 min-h-[44px]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600",
        isSelected
          ? "border-blue-600 bg-blue-50"
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "mt-0.5 shrink-0 h-5 w-5 rounded border-2 flex items-center justify-center",
            isSelected ? "bg-blue-600 border-blue-600" : "border-slate-300",
          )}
          aria-hidden="true"
        >
          {isSelected && (
            <svg
              className="h-3 w-3 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
        <div>
          <span className="font-medium text-slate-900">{label}</span>
          {description && (
            <p className="mt-0.5 text-sm text-slate-500">{description}</p>
          )}
        </div>
      </div>
    </button>
  );
}

export default function QuestionCard({
  question,
  onAnswer,
  previousAnswer,
}: QuestionCardProps) {
  const [selected, setSelected] = useState<string | string[]>(
    previousAnswer ?? (question.type === "checkbox" ? [] : ""),
  );

  useEffect(() => {
    setSelected(previousAnswer ?? (question.type === "checkbox" ? [] : ""));
  }, [question.id, previousAnswer]);

  const handleRadioSelect = (value: string) => {
    setSelected(value);
    setTimeout(() => onAnswer(value), 150);
  };

  const handleRadioKeyDown = (e: React.KeyboardEvent, currentValue: string) => {
    const opts = question.options ?? [];
    const currentIdx = opts.findIndex((o) => o.value === currentValue);
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      const nextIdx = (currentIdx + 1) % opts.length;
      handleRadioSelect(opts[nextIdx].value);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIdx = (currentIdx - 1 + opts.length) % opts.length;
      handleRadioSelect(opts[prevIdx].value);
    }
  };

  const handleCheckboxToggle = (value: string) => {
    setSelected((prev) => {
      const arr = Array.isArray(prev) ? prev : [];
      if (value === "none") return ["none"];
      const withoutNone = arr.filter((v) => v !== "none");
      return withoutNone.includes(value)
        ? withoutNone.filter((v) => v !== value)
        : [...withoutNone, value];
    });
  };

  const handleCheckboxSubmit = () => {
    const answers = Array.isArray(selected) ? selected : [selected];
    if (answers.length > 0) onAnswer(answers);
  };

  if (question.type === "radio") {
    return (
      <fieldset>
        <legend className="sr-only">{question.text}</legend>
        <div className="space-y-3" role="radiogroup">
          {question.options?.map((opt) => (
            <RadioOption
              key={opt.value}
              {...opt}
              isSelected={selected === opt.value}
              onSelect={handleRadioSelect}
              onKeyDown={(e) => handleRadioKeyDown(e, opt.value)}
            />
          ))}
        </div>
      </fieldset>
    );
  }

  if (question.type === "checkbox") {
    const selectedArr = Array.isArray(selected) ? selected : [];
    return (
      <div>
        <fieldset>
          <legend className="sr-only">{question.text}</legend>
          <div className="space-y-3">
            {question.options?.map((opt) => (
              <CheckboxOption
                key={opt.value}
                {...opt}
                isSelected={selectedArr.includes(opt.value)}
                onToggle={handleCheckboxToggle}
              />
            ))}
          </div>
        </fieldset>
        <button
          onClick={handleCheckboxSubmit}
          disabled={selectedArr.length === 0}
          aria-label="Continue to next question"
          className="mt-6 w-full py-3 px-6 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          Continue
        </button>
      </div>
    );
  }

  return null;
}

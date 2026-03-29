import { ClipboardList, BarChart3, FileDown } from "lucide-react";

const steps = [
  {
    number: "1",
    icon: ClipboardList,
    title: "Answer 12 Questions",
    description:
      "Our branching questionnaire covers your AI system type, domain, functions, and role. Takes 3 minutes.",
  },
  {
    number: "2",
    icon: BarChart3,
    title: "Get Your Classification",
    description:
      "Instantly receive your risk level (Unacceptable, High, Limited, or Minimal) with specific EU AI Act article citations.",
  },
  {
    number: "3",
    icon: FileDown,
    title: "Download Your Checklist",
    description:
      "Get an actionable obligation checklist, downloadable PDF report, and embeddable compliance badge.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-20 md:py-32 bg-white"
      aria-labelledby="how-it-works-heading"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            id="how-it-works-heading"
            className="text-4xl font-bold text-slate-900"
          >
            How It Works
          </h2>
          <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto">
            From AI system to compliance checklist in three straightforward
            steps.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.number} className="relative text-center">
              {index < steps.length - 1 && (
                <div
                  className="hidden md:block absolute top-8 left-[calc(50%+40px)] right-[-50%] h-px bg-slate-200"
                  aria-hidden="true"
                />
              )}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white text-xl font-bold mb-4">
                {step.number}
              </div>
              <div className="flex justify-center mb-3">
                <step.icon
                  className="h-7 w-7 text-blue-600"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {step.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

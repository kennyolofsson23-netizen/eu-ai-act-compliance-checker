import { Users, Shield, Clock } from "lucide-react";

const stats = [
  { icon: Users, value: "12,800+", label: "Assessments Completed" },
  { icon: Shield, value: "4", label: "Risk Categories Covered" },
  { icon: Clock, value: "3 min", label: "Average Completion Time" },
];

export default function SocialProof() {
  return (
    <section
      className="py-12 bg-white border-y border-slate-200"
      aria-label="Usage statistics"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="flex justify-center mb-2">
                <stat.icon
                  className="h-6 w-6 text-blue-600"
                  aria-hidden="true"
                />
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {stat.value}
              </div>
              <div className="text-sm text-slate-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

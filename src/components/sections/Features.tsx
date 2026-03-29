import { Shield, FileText, Share2, Clock, Globe, Key, List, Download } from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Instant Risk Classification',
    description: 'Branching logic classifies your AI system into one of four risk categories with specific Article citations.',
  },
  {
    icon: List,
    title: 'Obligation Checklist',
    description: 'Plain-language explanations of every applicable obligation with practical implementation guidance.',
  },
  {
    icon: Share2,
    title: 'Shareable Compliance Badge',
    description: 'Embeddable SVG badge for your website, GitHub README, or investor deck showing your compliance status.',
  },
  {
    icon: Download,
    title: 'PDF Export',
    description: 'Download a complete compliance assessment report with all obligations, article references, and dates.',
  },
  {
    icon: FileText,
    title: 'Documentation Templates',
    description: 'Ready-to-use Markdown templates for technical documentation, risk management plans, and more.',
  },
  {
    icon: Clock,
    title: 'Deadline Tracker',
    description: 'Visual timeline showing exactly when each obligation becomes enforceable with countdown timers.',
  },
  {
    icon: Globe,
    title: 'Multi-Language Support',
    description: 'Available in English, German, and French to serve organizations across the EU.',
  },
  {
    icon: Key,
    title: 'Public API',
    description: 'Programmatic access to the classification engine for integration into your compliance workflows.',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-20 md:py-32 bg-slate-50" aria-labelledby="features-heading">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 id="features-heading" className="text-4xl font-bold text-slate-900">
            Everything You Need for EU AI Act Compliance
          </h2>
          <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto">
            From initial risk assessment to ongoing compliance monitoring — all free.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(feature => (
            <div key={feature.title} className="bg-white rounded-xl border border-slate-200 p-6 hover:border-blue-300 hover:shadow-sm transition-all">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 mb-4">
                <feature.icon className="h-5 w-5 text-blue-600" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
